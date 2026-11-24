import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import AssistenteIA from "./AssistenteIA";
import {
  enviarMensagemAgente,
  ErroAgenteIA,
  processarAgenteComApiSistema,
  CHAVE_GEMINI_STORAGE,
} from "../../utilitarios/agenteIA";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/menu", search: "", hash: "", state: null }),
}));

function criarJwtMock(id: string, tipo: string): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ id, tipo }));
  return `${header}.${payload}.sig`;
}

describe("AssistenteIA e motor agenteIA", () => {
  const fetchOriginal = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockNavigate.mockReset();
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = fetchOriginal;
    vi.restoreAllMocks();
  });

  test("Não renderiza o assistente quando o usuário não está logado", () => {
    const { container } = render(<AssistenteIA />);
    expect(container.firstChild).toBeNull();
  });

  test("Renderiza botão flutuante após login e navega/exibe confirmação ao responder", async () => {
    localStorage.setItem("token", criarJwtMock("usr-coord-01", "coordenador"));
    localStorage.setItem(CHAVE_GEMINI_STORAGE, "AIzaTestKey123");

    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        resposta: "Abrindo a lista de idosos e aguardando confirmação.",
        acaoNavegacao: "/lista/idosos",
        confirmacaoPendente: {
          ferramenta: "deletar_visita",
          argumentos: { visitaId: "vis-1", confirmado: true },
          titulo: "Confirmar exclusão de visita",
          descricao: "Excluir a visita de João?",
        },
      }),
    });
    globalThis.fetch = fetchMock as any;

    const { getByRole, getByPlaceholderText, getByText, getAllByText } = render(<AssistenteIA />);

    fireEvent.click(getByRole("button", { name: /Abrir assistente de IA/i }));
    expect(getAllByText("Coordenador(a)").length).toBeGreaterThan(0);

    const input = getByPlaceholderText(/Pergunte ou peça uma ação/i);
    fireEvent.change(input, { target: { value: "Abrir lista de idosos" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(getByText("Abrindo a lista de idosos e aguardando confirmação.")).toBeInTheDocument();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/lista/idosos");
    expect(getByText("Confirmar exclusão")).toBeInTheDocument();
    expect(getByText("Cancelar")).toBeInTheDocument();
  });

  test("processarAgenteComApiSistema sanitiza dados LGPD (remove CPF/RG/SUS/senha) e restringe tools por perfil", async () => {
    localStorage.setItem("token", criarJwtMock("usr-enf-01", "enfermeiro"));
    localStorage.setItem(CHAVE_GEMINI_STORAGE, "AIzaTestKey123");

    let payloadToolResponseEnviadoAoGemini: any = null;
    let toolsDeclaradasParaEnfermeiro: string[] = [];

    const fetchMock = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = String(url);

      if (urlStr.endsWith("/usuario/usr-enf-01")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            _id: "usr-enf-01",
            nome: "Dr. Carlos",
            tipo: "enfermeiro",
            cpf: "999.999.999-99",
          }),
        } as Response;
      }

      if (urlStr.endsWith("/idosos")) {
        return {
          ok: true,
          status: 200,
          json: async () => [
            {
              _id: "idoso-01",
              nome: "Maria das Graças",
              cpf: "145.236.987-01",
              rg: "1.452.890",
              sus: "704501289632145",
              sexo: "Feminino",
            },
          ],
        } as Response;
      }

      if (urlStr.includes("/v1beta/models?")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            models: [
              {
                name: "models/gemini-3.5-flash-lite",
                supportedGenerationMethods: ["generateContent"],
              },
            ],
          }),
        } as Response;
      }

      if (urlStr.includes(":generateContent")) {
        const body = JSON.parse(String(init?.body || "{}"));
        toolsDeclaradasParaEnfermeiro =
          body.tools?.[0]?.functionDeclarations?.map((d: any) => d.name) || [];

        const ultimaParte = body.contents[body.contents.length - 1]?.parts?.[0];
        if (!ultimaParte?.functionResponse) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              candidates: [
                {
                  content: {
                    role: "model",
                    parts: [{ functionCall: { name: "listar_idosos", args: {} } }],
                  },
                },
              ],
            }),
          } as Response;
        }

        payloadToolResponseEnviadoAoGemini = ultimaParte.functionResponse.response.result;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  role: "model",
                  parts: [{ text: "Temos 1 residente visível: Maria das Graças." }],
                },
              },
            ],
          }),
        } as Response;
      }

      return { ok: false, status: 404, json: async () => ({}) } as Response;
    });

    globalThis.fetch = fetchMock as any;

    const resultado = await processarAgenteComApiSistema({
      mensagem: "Liste os idosos",
    });

    expect(resultado.status).toBe(200);
    expect(resultado.body.resposta).toContain("Maria das Graças");

    // Enfermeiro não pode receber tools de eventos, visitas ou cadastro/exclusão de idoso
    expect(toolsDeclaradasParaEnfermeiro).toContain("listar_idosos");
    expect(toolsDeclaradasParaEnfermeiro).toContain("cadastrar_registro_saude");
    expect(toolsDeclaradasParaEnfermeiro).not.toContain("cadastrar_idoso");
    expect(toolsDeclaradasParaEnfermeiro).not.toContain("deletar_idoso");
    expect(toolsDeclaradasParaEnfermeiro).not.toContain("listar_eventos");
    expect(toolsDeclaradasParaEnfermeiro).not.toContain("listar_visitas");

    // CPF, RG e SUS não podem ir para a API do Gemini
    const idosoEnviado = payloadToolResponseEnviadoAoGemini?.idosos?.[0];
    expect(idosoEnviado?.nome).toBe("Maria das Graças");
    expect(idosoEnviado?.cpf).toBeUndefined();
    expect(idosoEnviado?.rg).toBeUndefined();
    expect(idosoEnviado?.sus).toBeUndefined();
  });

  test("processarAgenteComApiSistema faz fallback automático para o próximo modelo quando o primeiro retorna 429", async () => {
    localStorage.setItem("token", criarJwtMock("usr-coord-01", "coordenador"));
    localStorage.setItem(CHAVE_GEMINI_STORAGE, "AIzaTestKey429");

    const modelosChamados: string[] = [];

    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      const urlStr = String(url);
      if (urlStr.endsWith("/usuario/usr-coord-01")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ _id: "usr-coord-01", nome: "Ana", tipo: "coordenador" }),
        } as Response;
      }
      if (urlStr.includes("/v1beta/models?")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            models: [
              {
                name: "models/gemini-flash-lite-latest",
                supportedGenerationMethods: ["generateContent"],
              },
              {
                name: "models/gemini-2.5-flash-lite",
                supportedGenerationMethods: ["generateContent"],
              },
            ],
          }),
        } as Response;
      }
      if (urlStr.includes("gemini-flash-lite-latest:")) {
        modelosChamados.push("gemini-flash-lite-latest");
        return {
          ok: false,
          status: 429,
          statusText: "Too Many Requests",
          json: async () => ({ error: { message: "Quota exceeded" } }),
        } as Response;
      }
      if (urlStr.includes("gemini-2.5-flash-lite:")) {
        modelosChamados.push("gemini-2.5-flash-lite");
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  role: "model",
                  parts: [{ text: "Resposta via modelo flash-lite gratuito." }],
                },
              },
            ],
          }),
        } as Response;
      }
      return { ok: false, status: 404, json: async () => ({}) } as Response;
    });

    globalThis.fetch = fetchMock as any;

    const resultado = await processarAgenteComApiSistema({
      mensagem: "Olá, resumo do abrigo",
    });

    expect(resultado.status).toBe(200);
    expect(resultado.body.modeloUtilizado).toBe("gemini-2.5-flash-lite");
    expect(modelosChamados).toEqual(["gemini-flash-lite-latest", "gemini-2.5-flash-lite"]);
  });

  test("processarAgenteComApiSistema ignora modelo 404 depreciado e usa modelo ativo sem falso erro de limite", async () => {
    localStorage.setItem("token", criarJwtMock("usr-coord-01", "coordenador"));
    localStorage.setItem(CHAVE_GEMINI_STORAGE, "AIzaTestKey404");

    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      const urlStr = String(url);
      if (urlStr.endsWith("/usuario/usr-coord-01")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ _id: "usr-coord-01", nome: "Ana", tipo: "coordenador" }),
        } as Response;
      }
      if (urlStr.includes("/v1beta/models?")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            models: [
              {
                name: "models/gemini-flash-lite-latest",
                supportedGenerationMethods: ["generateContent"],
              },
              {
                name: "models/gemini-3.5-flash-lite",
                supportedGenerationMethods: ["generateContent"],
              },
            ],
          }),
        } as Response;
      }
      if (urlStr.includes("gemini-flash-lite-latest:")) {
        return {
          ok: false,
          status: 404,
          statusText: "Not Found",
          json: async () => ({ error: { message: "Model not found" } }),
        } as Response;
      }
      if (urlStr.includes("gemini-3.5-flash-lite:")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  role: "model",
                  parts: [{ text: "Resposta via modelo descoberto 3.5-flash-lite." }],
                },
              },
            ],
          }),
        } as Response;
      }
      return { ok: false, status: 404, json: async () => ({}) } as Response;
    });

    globalThis.fetch = fetchMock as any;

    const resultado = await processarAgenteComApiSistema({
      mensagem: "Resumo do sistema",
    });

    expect(resultado.status).toBe(200);
    expect(resultado.body.modeloUtilizado).toBe("gemini-3.5-flash-lite");
    expect(resultado.body.resposta).toContain("3.5-flash-lite");
  });

  test("chave AQ. roteia automaticamente para Vertex AI Express (aiplatform.googleapis.com) sem chamar generativelanguage", async () => {
    localStorage.setItem("token", criarJwtMock("usr-coord-01", "coordenador"));
    localStorage.setItem(CHAVE_GEMINI_STORAGE, "AQ.VertexExpressKey123");

    const urlsChamadas: string[] = [];
    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      const urlStr = String(url);
      urlsChamadas.push(urlStr);

      if (urlStr.endsWith("/usuario/usr-coord-01")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ _id: "usr-coord-01", nome: "Ana", tipo: "coordenador" }),
        } as Response;
      }

      if (urlStr.startsWith("https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  role: "model",
                  parts: [{ text: "Resposta via Vertex AI Express." }],
                },
              },
            ],
          }),
        } as Response;
      }

      return { ok: false, status: 404, json: async () => ({}) } as Response;
    });

    globalThis.fetch = fetchMock as any;

    const resultado = await processarAgenteComApiSistema({
      mensagem: "Resumo do abrigo",
    });

    expect(resultado.status).toBe(200);
    expect(resultado.body.resposta).toBe("Resposta via Vertex AI Express.");
    expect(urlsChamadas.some((u) => u.includes("generativelanguage.googleapis.com"))).toBe(false);
    expect(urlsChamadas.some((u) => u.startsWith("https://aiplatform.googleapis.com/"))).toBe(true);
  });

  test("quebra loop quando o modelo repete a mesma chamada de ferramenta", async () => {
    localStorage.setItem("token", criarJwtMock("usr-coord-01", "coordenador"));
    localStorage.setItem(CHAVE_GEMINI_STORAGE, "AIzaLoopTest123");

    let chamadasGenerate = 0;
    let modoToolConfigFinal = "";

    const fetchMock = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = String(url);
      if (urlStr.endsWith("/usuario/usr-coord-01")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ _id: "usr-coord-01", nome: "Ana", tipo: "coordenador" }),
        } as Response;
      }
      if (urlStr.endsWith("/visitas")) {
        return { ok: true, status: 200, json: async () => [] } as Response;
      }
      if (urlStr.includes("/v1beta/models?")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            models: [
              {
                name: "models/gemini-2.5-flash-lite",
                supportedGenerationMethods: ["generateContent"],
              },
            ],
          }),
        } as Response;
      }
      if (urlStr.includes(":generateContent")) {
        chamadasGenerate++;
        const body = JSON.parse(String(init?.body || "{}"));
        if (body.toolConfig?.functionCallingConfig?.mode === "NONE") {
          modoToolConfigFinal = "NONE";
          return {
            ok: true,
            status: 200,
            json: async () => ({
              candidates: [
                {
                  content: {
                    role: "model",
                    parts: [{ text: "Não há visitas cadastradas no momento." }],
                  },
                },
              ],
            }),
          } as Response;
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  role: "model",
                  parts: [{ functionCall: { name: "listar_visitas", args: {} } }],
                },
              },
            ],
          }),
        } as Response;
      }
      return { ok: false, status: 404, json: async () => ({}) } as Response;
    });

    globalThis.fetch = fetchMock as any;

    const resultado = await processarAgenteComApiSistema({
      mensagem: "Liste as visitas",
    });

    expect(resultado.status).toBe(200);
    expect(modoToolConfigFinal).toBe("NONE");
    expect(chamadasGenerate).toBe(3);
    expect(resultado.body.resposta).toBe("Não há visitas cadastradas no momento.");
  });

  test("enviarMensagemAgente não executa fallback duplicado quando erro 503 já traz codigo do agente", async () => {
    localStorage.setItem("token", criarJwtMock("usr-coord-01", "coordenador"));
    localStorage.setItem(CHAVE_GEMINI_STORAGE, "AQ.KeyNoDup");

    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({
        message: "Serviço do Google Gemini temporariamente indisponível.",
        codigo: "SERVICO_INDISPONIVEL",
      }),
    });
    globalThis.fetch = fetchMock as any;

    await expect(
      enviarMensagemAgente({ mensagem: "Resumo" })
    ).rejects.toMatchObject({
      codigo: "SERVICO_INDISPONIVEL",
      status: 503,
    });
    expect(ErroAgenteIA).toBeDefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
