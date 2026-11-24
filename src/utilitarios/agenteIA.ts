import { obterIdUsuarioLogado, obterTipoUsuarioLogado } from "./authUsuario";
import { usuarioTemAcesso, type PaginaComPermissao } from "./permissoes";

const API_BASE = "https://api-associacao-idosos.onrender.com/api";
export const CHAVE_GEMINI_STORAGE = "sigaai_gemini_api_key";

const MODELOS_FALLBACK_PADRAO = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

const TIMEOUT_DESCOBERTA_MS = 8000;
const TIMEOUT_GERACAO_MS = 15000;
const PAUSA_POS_503_MS = 1000;
const CACHE_MODELOS_TTL_MS = 10 * 60 * 1000;
const cacheModelosPorChave = new Map<
  string,
  { modelos: string[]; expiraEm: number }
>();

const CAMPOS_SENSIVEIS_LGPD = new Set(["cpf", "rg", "sus", "senha"]);

export interface ConfirmacaoPendente {
  ferramenta: string;
  argumentos: Record<string, any>;
  titulo: string;
  descricao: string;
}

export interface MensagemHistoricoPayload {
  papel: "user" | "model";
  texto: string;
}

export interface RespostaAgente {
  resposta: string;
  acaoNavegacao?: string | null;
  dadosAlterados?: boolean;
  confirmacaoPendente?: ConfirmacaoPendente | null;
  modeloUtilizado?: string;
}

export class ErroAgenteIA extends Error {
  codigo: string;
  status: number;

  constructor(mensagem: string, codigo = "ERRO_AGENTE", status = 500) {
    super(mensagem);
    this.name = "ErroAgenteIA";
    this.codigo = codigo;
    this.status = status;
  }
}

export function obterChaveGeminiLocal(): string {
  const local =
    typeof localStorage !== "undefined"
      ? localStorage.getItem(CHAVE_GEMINI_STORAGE) || ""
      : "";
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  return (local || envKey).trim();
}

export function salvarChaveGeminiLocal(chave: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(CHAVE_GEMINI_STORAGE, chave.trim());
  }
}

export function removerChaveGeminiLocal(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(CHAVE_GEMINI_STORAGE);
  }
}

function sanitizarParaGemini(valor: unknown): unknown {
  if (valor === null || valor === undefined) return valor;
  if (Array.isArray(valor)) {
    return valor.map((item) => sanitizarParaGemini(item));
  }
  if (typeof valor === "object") {
    const limpo: Record<string, unknown> = {};
    for (const [chave, val] of Object.entries(valor as Record<string, unknown>)) {
      if (CAMPOS_SENSIVEIS_LGPD.has(chave)) continue;
      limpo[chave] = sanitizarParaGemini(val);
    }
    return limpo;
  }
  return valor;
}

function obterPermissoesAtivas(): PaginaComPermissao[] {
  const todas: PaginaComPermissao[] = ["idosos", "eventos", "saude", "visitas"];
  return todas.filter((p) => usuarioTemAcesso(p));
}

function usuarioPodeAcessarRota(
  rota: string,
  tipo: string,
  permissoes: PaginaComPermissao[]
): { permitido: boolean; motivo?: string } {
  const rotaLimpa = rota.split("?")[0].trim();
  const tipoLower = tipo.toLowerCase();

  if (rotaLimpa === "/menu" || rotaLimpa === "/perfil") {
    return { permitido: true };
  }

  if (rotaLimpa === "/lista/idosos" || rotaLimpa.startsWith("/dados/idoso/")) {
    return permissoes.includes("idosos")
      ? { permitido: true }
      : { permitido: false, motivo: "Seu perfil não tem acesso ao módulo de idosos." };
  }

  if (
    rotaLimpa === "/cadastro/idoso" ||
    rotaLimpa.startsWith("/atualizar/idoso/") ||
    rotaLimpa.startsWith("/deletar/idoso/")
  ) {
    if (tipoLower !== "coordenador") {
      return {
        permitido: false,
        motivo: "Apenas coordenadores podem cadastrar, editar ou excluir idosos.",
      };
    }
    return { permitido: true };
  }

  if (
    rotaLimpa === "/lista/registro/saude" ||
    rotaLimpa.startsWith("/dados/saude/") ||
    rotaLimpa.startsWith("/relatorio/idoso/")
  ) {
    return permissoes.includes("saude")
      ? { permitido: true }
      : { permitido: false, motivo: "Seu perfil não tem acesso aos registros de saúde." };
  }

  if (
    rotaLimpa === "/registro/saude" ||
    rotaLimpa.startsWith("/atualizar/registro/saude/") ||
    rotaLimpa.startsWith("/deletar/registro/saude/")
  ) {
    if (tipoLower !== "coordenador" && tipoLower !== "enfermeiro") {
      return {
        permitido: false,
        motivo: "Apenas coordenadores ou enfermeiros podem gerenciar registros de saúde.",
      };
    }
    return { permitido: true };
  }

  if (rotaLimpa === "/eventos" || rotaLimpa.startsWith("/eventos/detalhes/")) {
    return permissoes.includes("eventos")
      ? { permitido: true }
      : { permitido: false, motivo: "Seu perfil não tem acesso a eventos." };
  }

  if (rotaLimpa === "/eventos/novo" || rotaLimpa.startsWith("/eventos/editar/")) {
    if (tipoLower !== "coordenador" && tipoLower !== "voluntario") {
      return {
        permitido: false,
        motivo: "Seu perfil não tem permissão para criar ou editar eventos.",
      };
    }
    return { permitido: true };
  }

  if (
    rotaLimpa === "/lista/visitas" ||
    rotaLimpa === "/cadastro/visita" ||
    rotaLimpa.startsWith("/dados/visita/") ||
    rotaLimpa.startsWith("/atualizar/visita/") ||
    rotaLimpa.startsWith("/deletar/visita/")
  ) {
    return permissoes.includes("visitas")
      ? { permitido: true }
      : { permitido: false, motivo: "Seu perfil não tem acesso ao módulo de visitas." };
  }

  return {
    permitido: false,
    motivo: `A rota "${rotaLimpa}" não existe no sistema SIGAAI.`,
  };
}

function ehMesmoDia(dataValor: unknown, referencia: Date): boolean {
  if (!dataValor) return false;
  const d = new Date(String(dataValor));
  if (Number.isNaN(d.getTime())) return false;
  return (
    d.getDate() === referencia.getDate() &&
    d.getMonth() === referencia.getMonth() &&
    d.getFullYear() === referencia.getFullYear()
  );
}

interface ContextoExecucaoLocal {
  usuarioId: string;
  nomeUsuario: string;
  tipoUsuario: string;
  idosoVinculado?: string;
  permissoes: PaginaComPermissao[];
  token: string;
  acaoNavegacao: string | null;
  dadosAlterados: boolean;
  confirmacaoPendente: ConfirmacaoPendente | null;
}

async function requisicaoSistema(
  caminho: string,
  token: string,
  opcoes?: RequestInit
): Promise<{ ok: boolean; status: number; dados: any }> {
  const resposta = await fetch(`${API_BASE}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opcoes?.headers || {}),
    },
  });
  const dados = await resposta.json().catch(() => ({}));
  return { ok: resposta.ok, status: resposta.status, dados };
}

function construirDeclaracoesFerramentas(
  tipoUsuario: string,
  permissoes: PaginaComPermissao[]
) {
  const tipo = tipoUsuario.toLowerCase();
  const ehCoordenador = tipo === "coordenador";
  const ehEnfermeiro = tipo === "enfermeiro";
  const ehVoluntario = tipo === "voluntario";

  const declaracoes: any[] = [
    {
      name: "obter_resumo_sistema",
      description:
        "Retorna contagens gerais permitidas ao perfil logado (idosos visíveis, eventos, visitas e registros de saúde, incluindo ocorrências de hoje).",
      parameters: { type: "OBJECT", properties: {} },
    },
    {
      name: "navegar_para_pagina",
      description:
        "Navega o usuário para uma página válida do sistema SIGAAI (ex: /menu, /lista/idosos, /cadastro/idoso, /dados/idoso/:id, /relatorio/idoso/:id, /eventos, /eventos/novo, /lista/registro/saude, /registro/saude, /lista/visitas, /cadastro/visita, /perfil).",
      parameters: {
        type: "OBJECT",
        properties: {
          rota: {
            type: "STRING",
            description: "Caminho exato da rota no frontend React.",
          },
        },
        required: ["rota"],
      },
    },
  ];

  if (permissoes.includes("idosos")) {
    declaracoes.push(
      {
        name: "listar_idosos",
        description:
          "Lista os residentes (idosos) do Abrigo Luca Zorn acessíveis ao usuário logado. Para familiares, retorna apenas o idoso vinculado.",
        parameters: {
          type: "OBJECT",
          properties: {
            busca: {
              type: "STRING",
              description: "Filtro opcional por parte do nome do residente.",
            },
          },
        },
      },
      {
        name: "detalhar_idoso",
        description:
          "Busca detalhes cadastrais (sem dados sensíveis como CPF/RG/SUS por LGPD) de um idoso específico pelo ID.",
        parameters: {
          type: "OBJECT",
          properties: {
            idosoId: { type: "STRING", description: "ID do idoso." },
          },
          required: ["idosoId"],
        },
      }
    );

    if (ehCoordenador) {
      declaracoes.push(
        {
          name: "cadastrar_idoso",
          description:
            "Cadastra um novo idoso no abrigo (exclusivo para coordenadores). Exige dados básicos obrigatórios.",
          parameters: {
            type: "OBJECT",
            properties: {
              nome: { type: "STRING" },
              cpf: { type: "STRING", description: "Formato xxx.xxx.xxx-xx" },
              rg: { type: "STRING", description: "Formato xx.xxx.xxx ou x.xxx.xxx" },
              sus: { type: "STRING", description: "15 dígitos numéricos" },
              dataNascimento: { type: "STRING", description: "Data ISO YYYY-MM-DD" },
              sexo: { type: "STRING", description: "masculino ou feminino" },
              nacionalidade: { type: "STRING" },
              naturalidade: { type: "STRING" },
              responsavel: { type: "STRING" },
              contato: { type: "STRING" },
              localAcolhimento: { type: "STRING" },
              parecerEquipeTecnica: { type: "STRING" },
            },
            required: [
              "nome",
              "cpf",
              "rg",
              "sus",
              "dataNascimento",
              "sexo",
              "nacionalidade",
              "naturalidade",
            ],
          },
        },
        {
          name: "atualizar_idoso",
          description:
            "Atualiza dados cadastrais de um idoso existente (exclusivo para coordenadores).",
          parameters: {
            type: "OBJECT",
            properties: {
              idosoId: { type: "STRING" },
              nome: { type: "STRING" },
              responsavel: { type: "STRING" },
              contato: { type: "STRING" },
              cidade: { type: "STRING" },
              localAcolhimento: { type: "STRING" },
              parecerEquipeTecnica: { type: "STRING" },
            },
            required: ["idosoId"],
          },
        },
        {
          name: "deletar_idoso",
          description:
            "Exclui o cadastro de um idoso (exclusivo para coordenadores). Na primeira chamada envie confirmado=false para solicitar confirmação explícita.",
          parameters: {
            type: "OBJECT",
            properties: {
              idosoId: { type: "STRING" },
              confirmado: { type: "BOOLEAN" },
            },
            required: ["idosoId"],
          },
        }
      );
    }
  }

  if (permissoes.includes("saude")) {
    declaracoes.push({
      name: "listar_registros_saude",
      description:
        "Lista acompanhamentos clínicos/registros de saúde dos idosos (pressão, glicemia, peso, altura, estado nutricional).",
      parameters: {
        type: "OBJECT",
        properties: {
          idosoId: {
            type: "STRING",
            description: "ID opcional do idoso para filtrar seus registros.",
          },
        },
      },
    });

    if (ehCoordenador || ehEnfermeiro) {
      declaracoes.push(
        {
          name: "cadastrar_registro_saude",
          description:
            "Registra um novo acompanhamento de saúde para um idoso (coordenador ou enfermeiro).",
          parameters: {
            type: "OBJECT",
            properties: {
              idosoId: { type: "STRING" },
              altura: { type: "NUMBER", description: "Altura em metros, ex: 1.65" },
              peso: { type: "NUMBER", description: "Peso em kg, ex: 68.5" },
              pressao: { type: "STRING", description: "Formato xxx/xx, ex: 120/80" },
              glicemia: { type: "NUMBER", description: "Glicemia em mg/dL, ex: 98" },
              estadoNutricional: {
                type: "STRING",
                description: "normal, baixo peso ou sobrepeso",
              },
              alergias: { type: "ARRAY", items: { type: "STRING" } },
              doencasCronicas: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: [
              "idosoId",
              "altura",
              "peso",
              "pressao",
              "glicemia",
              "estadoNutricional",
            ],
          },
        },
        {
          name: "atualizar_registro_saude",
          description:
            "Atualiza um registro de saúde existente (coordenador ou enfermeiro).",
          parameters: {
            type: "OBJECT",
            properties: {
              registroId: { type: "STRING" },
              altura: { type: "NUMBER" },
              peso: { type: "NUMBER" },
              pressao: { type: "STRING" },
              glicemia: { type: "NUMBER" },
              estadoNutricional: {
                type: "STRING",
                description: "normal, baixo peso ou sobrepeso",
              },
              alergias: { type: "ARRAY", items: { type: "STRING" } },
              doencasCronicas: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["registroId"],
          },
        },
        {
          name: "deletar_registro_saude",
          description:
            "Exclui um registro de saúde. Na primeira chamada envie confirmado=false para solicitar confirmação explícita.",
          parameters: {
            type: "OBJECT",
            properties: {
              registroId: { type: "STRING" },
              confirmado: { type: "BOOLEAN" },
            },
            required: ["registroId"],
          },
        }
      );
    }
  }

  if (permissoes.includes("eventos")) {
    declaracoes.push({
      name: "listar_eventos",
      description: "Lista os eventos cadastrados no abrigo.",
      parameters: { type: "OBJECT", properties: {} },
    });

    if (ehCoordenador || ehVoluntario) {
      declaracoes.push(
        {
          name: "cadastrar_evento",
          description: "Cadastra um novo evento do abrigo (coordenador ou voluntário).",
          parameters: {
            type: "OBJECT",
            properties: {
              nome: { type: "STRING" },
              descricao: { type: "STRING" },
              data: { type: "STRING", description: "Data/hora em formato ISO" },
              latitude: { type: "NUMBER" },
              longitude: { type: "NUMBER" },
            },
            required: ["nome", "data"],
          },
        },
        {
          name: "atualizar_evento",
          description: "Atualiza um evento existente (coordenador ou voluntário).",
          parameters: {
            type: "OBJECT",
            properties: {
              eventoId: { type: "STRING" },
              nome: { type: "STRING" },
              descricao: { type: "STRING" },
              data: { type: "STRING" },
              latitude: { type: "NUMBER" },
              longitude: { type: "NUMBER" },
            },
            required: ["eventoId"],
          },
        }
      );
    }

    if (ehCoordenador) {
      declaracoes.push({
        name: "deletar_evento",
        description:
          "Exclui um evento (exclusivo para coordenadores). Na primeira chamada envie confirmado=false para pedir confirmação.",
        parameters: {
          type: "OBJECT",
          properties: {
            eventoId: { type: "STRING" },
            confirmado: { type: "BOOLEAN" },
          },
          required: ["eventoId"],
        },
      });
    }
  }

  if (permissoes.includes("visitas")) {
    declaracoes.push(
      {
        name: "listar_visitas",
        description: "Lista as visitas agendadas ou registradas no abrigo.",
        parameters: { type: "OBJECT", properties: {} },
      },
      {
        name: "cadastrar_visita",
        description: "Agenda ou registra uma nova visita ao abrigo.",
        parameters: {
          type: "OBJECT",
          properties: {
            nomeVisitante: { type: "STRING" },
            dataIso: { type: "STRING", description: "Data/hora ISO da visita" },
            telefone: { type: "STRING" },
          },
          required: ["nomeVisitante", "dataIso"],
        },
      },
      {
        name: "atualizar_visita",
        description: "Atualiza os dados de uma visita agendada.",
        parameters: {
          type: "OBJECT",
          properties: {
            visitaId: { type: "STRING" },
            nomeVisitante: { type: "STRING" },
            dataIso: { type: "STRING" },
            telefone: { type: "STRING" },
          },
          required: ["visitaId"],
        },
      },
      {
        name: "deletar_visita",
        description:
          "Exclui um registro de visita. Na primeira chamada envie confirmado=false para pedir confirmação.",
        parameters: {
          type: "OBJECT",
          properties: {
            visitaId: { type: "STRING" },
            confirmado: { type: "BOOLEAN" },
          },
          required: ["visitaId"],
        },
      }
    );
  }

  return declaracoes;
}

async function executarFerramentaSistema(
  nome: string,
  args: Record<string, any>,
  ctx: ContextoExecucaoLocal
): Promise<unknown> {
  const tipoLower = ctx.tipoUsuario.toLowerCase();
  const ehFamiliar = tipoLower === "familiar";
  const ehCoordenador = tipoLower === "coordenador";
  const ehEnfermeiro = tipoLower === "enfermeiro";
  const ehVoluntario = tipoLower === "voluntario";

  switch (nome) {
    case "obter_resumo_sistema": {
      const hoje = new Date();
      const resumo: Record<string, any> = {
        usuarioLogado: {
          nome: ctx.nomeUsuario,
          tipo: ctx.tipoUsuario,
          permissoes: ctx.permissoes,
        },
      };

      if (ctx.permissoes.includes("idosos")) {
        const resp = await requisicaoSistema("/idosos", ctx.token);
        const lista = Array.isArray(resp.dados) ? resp.dados : [];
        resumo.totalIdososVisiveis = ehFamiliar
          ? lista.filter((i: any) => i._id === ctx.idosoVinculado).length
          : lista.length;
      }

      if (ctx.permissoes.includes("saude")) {
        const resp = await requisicaoSistema("/saudeIdoso", ctx.token);
        const lista = Array.isArray(resp.dados) ? resp.dados : [];
        const visiveis = ehFamiliar
          ? lista.filter(
              (r: any) =>
                (typeof r.idosoId === "string" ? r.idosoId : r.idosoId?._id) ===
                ctx.idosoVinculado
            )
          : lista;
        resumo.totalRegistrosSaude = visiveis.length;
        resumo.registrosSaudeHoje = visiveis.filter((r: any) =>
          ehMesmoDia(r.dataConsulta, hoje)
        ).length;
      }

      if (ctx.permissoes.includes("eventos")) {
        const resp = await requisicaoSistema("/eventos", ctx.token);
        const lista = Array.isArray(resp.dados) ? resp.dados : [];
        resumo.totalEventos = lista.length;
        resumo.eventosHoje = lista.filter((e: any) => ehMesmoDia(e.data, hoje)).length;
      }

      if (ctx.permissoes.includes("visitas")) {
        const resp = await requisicaoSistema("/visitas", ctx.token);
        const lista = Array.isArray(resp.dados) ? resp.dados : [];
        resumo.totalVisitas = lista.length;
        resumo.visitasHoje = lista.filter((v: any) => ehMesmoDia(v.data, hoje)).length;
      }

      return resumo;
    }

    case "navegar_para_pagina": {
      const rota = String(args.rota || "").trim();
      const validacao = usuarioPodeAcessarRota(rota, ctx.tipoUsuario, ctx.permissoes);
      if (!validacao.permitido) {
        return { erro: validacao.motivo };
      }
      ctx.acaoNavegacao = rota;
      return { sucesso: true, rotaDestino: rota };
    }

    case "listar_idosos": {
      if (!ctx.permissoes.includes("idosos")) {
        return { erro: "Sem permissão para visualizar idosos." };
      }
      const resp = await requisicaoSistema("/idosos", ctx.token);
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao buscar idosos." };
      const lista = Array.isArray(resp.dados) ? resp.dados : [];
      const visiveis = ehFamiliar
        ? lista.filter((i: any) => i._id === ctx.idosoVinculado)
        : lista;
      const termo = String(args.busca || "").trim().toLowerCase();
      const filtrados = termo
        ? visiveis.filter((i: any) => String(i.nome || "").toLowerCase().includes(termo))
        : visiveis;
      return { idosos: sanitizarParaGemini(filtrados) };
    }

    case "detalhar_idoso": {
      if (!ctx.permissoes.includes("idosos")) {
        return { erro: "Sem permissão para visualizar idosos." };
      }
      const idosoId = String(args.idosoId || "");
      if (ehFamiliar && idosoId !== ctx.idosoVinculado) {
        return { erro: "Familiares só podem visualizar o idoso vinculado à sua conta." };
      }
      const resp = await requisicaoSistema(`/idoso/${idosoId}`, ctx.token);
      if (!resp.ok) return { erro: resp.dados?.message || "Idoso não encontrado." };
      return { idoso: sanitizarParaGemini(resp.dados) };
    }

    case "cadastrar_idoso": {
      if (!ehCoordenador) {
        return { erro: "Apenas coordenadores podem cadastrar idosos." };
      }
      const resp = await requisicaoSistema("/cadastrarIdoso", ctx.token, {
        method: "POST",
        body: JSON.stringify({
          ...args,
          sexo: String(args.sexo || "feminino").toLowerCase(),
        }),
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao cadastrar idoso." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: resp.dados?.message || "Idoso cadastrado com sucesso!",
        idoso: sanitizarParaGemini(resp.dados?.idoso || resp.dados?.newIdoso || resp.dados),
      };
    }

    case "atualizar_idoso": {
      if (!ehCoordenador) {
        return { erro: "Apenas coordenadores podem atualizar idosos." };
      }
      const { idosoId, ...campos } = args;
      const resp = await requisicaoSistema(`/idoso/${idosoId}`, ctx.token, {
        method: "PUT",
        body: JSON.stringify(campos),
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao atualizar idoso." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: resp.dados?.message || "Cadastro do idoso atualizado com sucesso.",
        idoso: sanitizarParaGemini(resp.dados?.idoso || resp.dados),
      };
    }

    case "deletar_idoso": {
      if (!ehCoordenador) {
        return { erro: "Apenas coordenadores podem excluir idosos." };
      }
      const idosoId = String(args.idosoId || "");
      const detalhe = await requisicaoSistema(`/idoso/${idosoId}`, ctx.token);
      if (!detalhe.ok) return { erro: "Idoso não encontrado." };

      if (args.confirmado !== true) {
        ctx.confirmacaoPendente = {
          ferramenta: "deletar_idoso",
          argumentos: { idosoId, confirmado: true },
          titulo: "Confirmar exclusão de residente",
          descricao: `Excluir permanentemente o cadastro de ${detalhe.dados?.nome || idosoId}?`,
        };
        return {
          requerConfirmacao: true,
          mensagem: `Aguardando confirmação explícita do usuário para excluir ${detalhe.dados?.nome || "este residente"}.`,
        };
      }

      const resp = await requisicaoSistema(`/idoso/${idosoId}`, ctx.token, {
        method: "DELETE",
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao excluir idoso." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: `Idoso ${detalhe.dados?.nome || ""} excluído com sucesso.`.trim(),
      };
    }

    case "listar_registros_saude": {
      if (!ctx.permissoes.includes("saude")) {
        return { erro: "Sem permissão para visualizar registros de saúde." };
      }
      const resp = await requisicaoSistema("/saudeIdoso", ctx.token);
      const lista = Array.isArray(resp.dados) ? resp.dados : [];
      const filtrados = lista.filter((r: any) => {
        const idRef = typeof r.idosoId === "string" ? r.idosoId : r.idosoId?._id;
        if (ehFamiliar) return idRef === ctx.idosoVinculado;
        if (args.idosoId) return idRef === String(args.idosoId);
        return true;
      });
      return { registros: sanitizarParaGemini(filtrados) };
    }

    case "cadastrar_registro_saude": {
      if (!ehCoordenador && !ehEnfermeiro) {
        return { erro: "Apenas coordenadores ou enfermeiros podem registrar saúde." };
      }
      const resp = await requisicaoSistema("/cadastrarConsulta", ctx.token, {
        method: "POST",
        body: JSON.stringify({
          usuarioId: ctx.usuarioId,
          idosoId: String(args.idosoId),
          altura: Number(args.altura),
          peso: Number(args.peso),
          pressao: String(args.pressao),
          glicemia: Number(args.glicemia),
          estadoNutricional: String(args.estadoNutricional),
          alergias: Array.isArray(args.alergias) ? args.alergias : [],
          doencasCronicas: Array.isArray(args.doencasCronicas)
            ? args.doencasCronicas
            : [],
        }),
      });
      if (!resp.ok) {
        return { erro: resp.dados?.message || "Erro ao registrar acompanhamento de saúde." };
      }
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: resp.dados?.message || "Acompanhamento de saúde salvo com sucesso!",
        registro: sanitizarParaGemini(resp.dados?.registro || resp.dados?.saude || resp.dados),
      };
    }

    case "atualizar_registro_saude": {
      if (!ehCoordenador && !ehEnfermeiro) {
        return {
          erro: "Apenas coordenadores ou enfermeiros podem atualizar registros de saúde.",
        };
      }
      const atual = await requisicaoSistema(`/saudeIdoso/${args.registroId}`, ctx.token);
      if (!atual.ok) return { erro: "Registro de saúde não encontrado." };

      const idosoIdRef =
        typeof atual.dados?.idosoId === "string"
          ? atual.dados.idosoId
          : atual.dados?.idosoId?._id;
      const usuarioIdRef =
        typeof atual.dados?.usuarioId === "string"
          ? atual.dados.usuarioId
          : atual.dados?.usuarioId?._id || ctx.usuarioId;

      const resp = await requisicaoSistema(`/saudeIdoso/${args.registroId}`, ctx.token, {
        method: "PUT",
        body: JSON.stringify({
          usuarioId: usuarioIdRef,
          idosoId: idosoIdRef,
          altura: args.altura !== undefined ? Number(args.altura) : atual.dados.altura,
          peso: args.peso !== undefined ? Number(args.peso) : atual.dados.peso,
          pressao: args.pressao !== undefined ? String(args.pressao) : atual.dados.pressao,
          glicemia:
            args.glicemia !== undefined ? Number(args.glicemia) : atual.dados.glicemia,
          estadoNutricional:
            args.estadoNutricional !== undefined
              ? String(args.estadoNutricional)
              : atual.dados.estadoNutricional,
          alergias: Array.isArray(args.alergias) ? args.alergias : atual.dados.alergias,
          doencasCronicas: Array.isArray(args.doencasCronicas)
            ? args.doencasCronicas
            : atual.dados.doencasCronicas,
        }),
      });
      if (!resp.ok) {
        return { erro: resp.dados?.message || "Erro ao atualizar registro de saúde." };
      }
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: resp.dados?.message || "Registro de saúde atualizado com sucesso.",
        registro: sanitizarParaGemini(resp.dados?.registro || resp.dados?.consulta || resp.dados),
      };
    }

    case "deletar_registro_saude": {
      if (!ehCoordenador && !ehEnfermeiro) {
        return {
          erro: "Apenas coordenadores ou enfermeiros podem excluir registros de saúde.",
        };
      }
      const atual = await requisicaoSistema(`/saudeIdoso/${args.registroId}`, ctx.token);
      if (!atual.ok) return { erro: "Registro de saúde não encontrado." };

      if (args.confirmado !== true) {
        const nomeIdoso = atual.dados?.idosoId?.nome || "residente";
        ctx.confirmacaoPendente = {
          ferramenta: "deletar_registro_saude",
          argumentos: { registroId: String(args.registroId), confirmado: true },
          titulo: "Confirmar exclusão de registro de saúde",
          descricao: `Excluir o registro de saúde de ${nomeIdoso} (pressão ${atual.dados?.pressao || "-"})?`,
        };
        return {
          requerConfirmacao: true,
          mensagem: "Aguardando confirmação explícita do usuário para excluir o registro.",
        };
      }

      const resp = await requisicaoSistema(`/saudeIdoso/${args.registroId}`, ctx.token, {
        method: "DELETE",
      });
      if (!resp.ok) {
        return { erro: resp.dados?.message || "Erro ao excluir registro de saúde." };
      }
      ctx.dadosAlterados = true;
      return { sucesso: true, mensagem: "Registro de saúde excluído com sucesso." };
    }

    case "listar_eventos": {
      if (!ctx.permissoes.includes("eventos")) {
        return { erro: "Sem permissão para visualizar eventos." };
      }
      const resp = await requisicaoSistema("/eventos", ctx.token);
      const lista = Array.isArray(resp.dados) ? resp.dados : [];
      return { eventos: sanitizarParaGemini(lista) };
    }

    case "cadastrar_evento": {
      if (!ehCoordenador && !ehVoluntario) {
        return { erro: "Apenas coordenadores ou voluntários podem cadastrar eventos." };
      }
      const lng = args.longitude !== undefined ? Number(args.longitude) : -38.5586;
      const lat = args.latitude !== undefined ? Number(args.latitude) : -6.8894;
      const resp = await requisicaoSistema("/cadastroEvento", ctx.token, {
        method: "POST",
        body: JSON.stringify({
          nome: String(args.nome),
          descricao: args.descricao ? String(args.descricao) : "",
          data: args.data,
          local: { type: "Point", coordinates: [lng, lat] },
        }),
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao cadastrar evento." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: resp.dados?.message || "Evento cadastrado com sucesso!",
        evento: sanitizarParaGemini(resp.dados?.evento || resp.dados?.newEvento || resp.dados),
      };
    }

    case "atualizar_evento": {
      if (!ehCoordenador && !ehVoluntario) {
        return { erro: "Apenas coordenadores ou voluntários podem atualizar eventos." };
      }
      const payload: Record<string, any> = {};
      if (args.nome !== undefined) payload.nome = String(args.nome);
      if (args.descricao !== undefined) payload.descricao = String(args.descricao);
      if (args.data !== undefined) payload.data = String(args.data);
      if (args.latitude !== undefined && args.longitude !== undefined) {
        payload.local = {
          type: "Point",
          coordinates: [Number(args.longitude), Number(args.latitude)],
        };
      }
      const resp = await requisicaoSistema(`/eventos/${args.eventoId}`, ctx.token, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao atualizar evento." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: resp.dados?.message || "Evento atualizado com sucesso!",
        evento: sanitizarParaGemini(resp.dados?.evento || resp.dados),
      };
    }

    case "deletar_evento": {
      if (!ehCoordenador) {
        return { erro: "Apenas coordenadores podem excluir eventos." };
      }
      const atual = await requisicaoSistema(`/eventos/${args.eventoId}`, ctx.token);
      if (!atual.ok) return { erro: "Evento não encontrado." };

      if (args.confirmado !== true) {
        ctx.confirmacaoPendente = {
          ferramenta: "deletar_evento",
          argumentos: { eventoId: String(args.eventoId), confirmado: true },
          titulo: "Confirmar exclusão de evento",
          descricao: `Excluir o evento "${atual.dados?.nome || args.eventoId}"?`,
        };
        return {
          requerConfirmacao: true,
          mensagem: `Aguardando confirmação explícita do usuário para excluir o evento "${atual.dados?.nome || ""}".`,
        };
      }

      const resp = await requisicaoSistema(`/eventos/${args.eventoId}`, ctx.token, {
        method: "DELETE",
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao excluir evento." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: `Evento "${atual.dados?.nome || ""}" excluído com sucesso.`,
      };
    }

    case "listar_visitas": {
      if (!ctx.permissoes.includes("visitas")) {
        return { erro: "Sem permissão para visualizar visitas." };
      }
      const resp = await requisicaoSistema("/visitas", ctx.token);
      const lista = Array.isArray(resp.dados) ? resp.dados : [];
      return { visitas: sanitizarParaGemini(lista) };
    }

    case "cadastrar_visita": {
      if (!ctx.permissoes.includes("visitas")) {
        return { erro: "Sem permissão para cadastrar visitas." };
      }
      const resp = await requisicaoSistema("/visita", ctx.token, {
        method: "POST",
        body: JSON.stringify({
          nome: String(args.nomeVisitante),
          data: args.dataIso,
          ...(args.telefone ? { telefone: String(args.telefone) } : {}),
        }),
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao cadastrar visita." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: resp.dados?.message || "Visita registrada com sucesso!",
        visita: sanitizarParaGemini(resp.dados?.visita || resp.dados),
      };
    }

    case "atualizar_visita": {
      if (!ctx.permissoes.includes("visitas")) {
        return { erro: "Sem permissão para atualizar visitas." };
      }
      const payload: Record<string, any> = {};
      if (args.nomeVisitante !== undefined) payload.nome = String(args.nomeVisitante);
      if (args.dataIso !== undefined) payload.data = String(args.dataIso);
      if (args.telefone !== undefined) payload.telefone = String(args.telefone);
      const resp = await requisicaoSistema(`/visita/${args.visitaId}`, ctx.token, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao atualizar visita." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: resp.dados?.message || "Visita atualizada com sucesso!",
        visita: sanitizarParaGemini(resp.dados?.visita || resp.dados),
      };
    }

    case "deletar_visita": {
      if (!ctx.permissoes.includes("visitas")) {
        return { erro: "Sem permissão para excluir visitas." };
      }
      const atual = await requisicaoSistema(`/visita/${args.visitaId}`, ctx.token);
      if (!atual.ok) return { erro: "Visita não encontrada." };

      if (args.confirmado !== true) {
        ctx.confirmacaoPendente = {
          ferramenta: "deletar_visita",
          argumentos: { visitaId: String(args.visitaId), confirmado: true },
          titulo: "Confirmar exclusão de visita",
          descricao: `Excluir a visita de "${atual.dados?.nome || args.visitaId}"?`,
        };
        return {
          requerConfirmacao: true,
          mensagem: `Aguardando confirmação explícita do usuário para excluir a visita de "${atual.dados?.nome || ""}".`,
        };
      }

      const resp = await requisicaoSistema(`/visita/${args.visitaId}`, ctx.token, {
        method: "DELETE",
      });
      if (!resp.ok) return { erro: resp.dados?.message || "Erro ao excluir visita." };
      ctx.dadosAlterados = true;
      return {
        sucesso: true,
        mensagem: `Visita de "${atual.dados?.nome || ""}" excluída com sucesso.`,
      };
    }

    default:
      return { erro: `Ferramenta desconhecida: ${nome}` };
  }
}

function montarSystemInstruction(ctx: ContextoExecucaoLocal): string {
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  return [
    "Você é o assistente oficial de IA do sistema SIGAAI — Abrigo Luca Zorn (Associação de Idosos).",
    "",
    "REGRAS RÍGIDAS DE ESCOPO:",
    "1. Você deve responder EXCLUSIVAMENTE sobre o gerenciamento e os dados deste sistema (residentes/idosos, registros de saúde, visitas, eventos, perfil e navegação nas páginas do SIGAAI).",
    "2. Se o usuário perguntar qualquer assunto fora deste sistema (culinária, clima, notícias, programação, política, piadas, conhecimentos gerais), recuse educadamente informando que você opera exclusivamente com os dados e ações do SIGAAI — Abrigo Luca Zorn.",
    "3. NUNCA invente dados ou responda com suposições. Sempre consulte as ferramentas (tools) disponíveis antes de afirmar qualquer dado sobre idosos, saúde, visitas ou eventos.",
    "4. Por proteção de dados (LGPD) no plano gratuito, CPF, RG, SUS e senha nunca são compartilhados com você; informe isso se o usuário solicitar esses documentos pelo chat e oriente abrir a ficha no sistema.",
    "5. Para qualquer exclusão (deletar_idoso, deletar_registro_saude, deletar_evento, deletar_visita), chame primeiro com confirmado=false e aguarde confirmação explícita do usuário antes de efetivar.",
    "6. Responda sempre em português do Brasil, de forma objetiva, clara e respeitosa.",
    "",
    `CONTEXTO DO USUÁRIO LOGADO: Nome="${ctx.nomeUsuario}", Perfil="${ctx.tipoUsuario}", Permissões=[${ctx.permissoes.join(", ")}]${
      ctx.idosoVinculado ? `, IdosoVinculado="${ctx.idosoVinculado}"` : ""
    }.`,
    `DATA E HORA ATUAL: ${agora}.`,
    "ROTAS VÁLIDAS DO SISTEMA: /menu, /lista/idosos, /cadastro/idoso, /dados/idoso/:id, /relatorio/idoso/:id, /eventos, /eventos/novo, /lista/registro/saude, /registro/saude, /lista/visitas, /cadastro/visita, /perfil.",
  ].join("\n");
}

function pontuarModeloGemini(id: string): number {
  const lower = id.toLowerCase();
  let pontos = 0;

  if (lower.includes("flash-lite")) pontos += 300;
  else if (lower.includes("flash")) pontos += 200;
  else if (lower.includes("pro")) pontos += 50;

  if (lower.includes("latest")) pontos += 10;

  const versao = lower.match(/gemini-(\d+)(?:\.(\d+))?/);
  if (versao) {
    const maior = Number(versao[1] || 0);
    const menor = Number(versao[2] || 0);
    pontos += maior * 20 + menor * 2;
  }

  if (lower.includes("preview") || lower.includes("-exp")) {
    pontos -= 40;
  }

  return pontos;
}

async function fetchComTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  externalSignal?: AbortSignal
): Promise<Response> {
  if (externalSignal?.aborted) {
    throw new DOMException("Operação cancelada pelo usuário.", "AbortError");
  }

  const controller = new AbortController();
  const onExternalAbort = () => controller.abort(externalSignal?.reason);
  externalSignal?.addEventListener("abort", onExternalAbort, { once: true });

  const timer = setTimeout(() => {
    controller.abort(new DOMException("Tempo limite excedido.", "TimeoutError"));
  }, timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}

async function aguardarComCancelamento(
  ms: number,
  signal?: AbortSignal
): Promise<void> {
  if (signal?.aborted) {
    throw new DOMException("Operação cancelada pelo usuário.", "AbortError");
  }
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Operação cancelada pelo usuário.", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function obterModelosCandidatos(
  apiKey: string,
  externalSignal?: AbortSignal
): Promise<string[]> {
  const agora = Date.now();
  const emCache = cacheModelosPorChave.get(apiKey);
  if (emCache && emCache.expiraEm > agora) {
    return emCache.modelos;
  }

  let descobertos: string[] = [];
  try {
    const resp = await fetchComTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        apiKey
      )}`,
      { method: "GET" },
      TIMEOUT_DESCOBERTA_MS,
      externalSignal
    );
    if (resp.ok) {
      const dados = await resp.json();
      const lista = Array.isArray(dados?.models) ? dados.models : [];
      const candidatos = lista
        .filter(
          (m: any) =>
            typeof m?.name === "string" &&
            m.name.startsWith("models/gemini-") &&
            Array.isArray(m.supportedGenerationMethods) &&
            m.supportedGenerationMethods.includes("generateContent") &&
            !/(tts|image|audio|live|embedding|vision|robotics|computer-use|deep-research|gemma)/i.test(
              m.name
            )
        )
        .map((m: any) => String(m.name).replace(/^models\//, ""));

      const estaveis = candidatos.filter(
        (id: string) =>
          !id.toLowerCase().includes("preview") && !id.toLowerCase().includes("-exp")
      );
      const base = estaveis.length > 0 ? estaveis : candidatos;
      descobertos = base
        .sort((a: string, b: string) => pontuarModeloGemini(b) - pontuarModeloGemini(a))
        .slice(0, 3);
    }
  } catch (err: any) {
    if (externalSignal?.aborted || err?.name === "AbortError") {
      throw err;
    }
    // Falha de rede ou timeout na descoberta usa fallback padrão
  }

  const selecionados =
    descobertos.length > 0 ? descobertos : MODELOS_FALLBACK_PADRAO.slice(0, 3);

  cacheModelosPorChave.set(apiKey, {
    modelos: selecionados,
    expiraEm: agora + CACHE_MODELOS_TTL_MS,
  });

  return selecionados;
}

function montarUrlGenerateContent(apiKey: string, modelo: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;
}

async function chamarGeminiComFallback(
  apiKey: string,
  payload: Record<string, unknown>,
  opcoes?: { modeloPreferido?: string; signal?: AbortSignal }
): Promise<
  | { ok: true; dados: any; modelo: string }
  | { ok: false; status: number; mensagem: string; codigo: string }
> {
  const baseModelos = await obterModelosCandidatos(apiKey, opcoes?.signal);
  const modelos = opcoes?.modeloPreferido
    ? Array.from(new Set([opcoes.modeloPreferido, ...baseModelos])).slice(0, 3)
    : baseModelos.slice(0, 3);

  let ultimoErro = {
    status: 500,
    mensagem: "Erro ao consultar a API do Google Gemini.",
    codigo: "ERRO_GEMINI",
  };

  for (let i = 0; i < modelos.length; i++) {
    const modelo = modelos[i];
    if (opcoes?.signal?.aborted) {
      throw new DOMException("Operação cancelada pelo usuário.", "AbortError");
    }

    const url = montarUrlGenerateContent(apiKey, modelo);
    let resposta: Response;

    try {
      resposta = await fetchComTimeout(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        TIMEOUT_GERACAO_MS,
        opcoes?.signal
      );
    } catch (err: any) {
      if (opcoes?.signal?.aborted) {
        throw new DOMException("Operação cancelada pelo usuário.", "AbortError");
      }
      ultimoErro = {
        status: 504,
        mensagem:
          "Tempo limite excedido ao aguardar resposta do Google Gemini. Tente novamente em instantes.",
        codigo: "TIMEOUT_GEMINI",
      };
      continue;
    }

    if (resposta.ok) {
      const dados = await resposta.json();
      return { ok: true, dados, modelo };
    }

    const erroJson = await resposta.json().catch(() => ({}));
    const msgApi = String(erroJson?.error?.message || resposta.statusText || "");

    if (resposta.status === 404) {
      if (ultimoErro.codigo === "ERRO_GEMINI") {
        ultimoErro = {
          status: 404,
          mensagem: `Nenhum modelo Gemini compatível foi encontrado para esta chave (${msgApi}).`,
          codigo: "MODELO_INDISPONIVEL",
        };
      }
      continue;
    }

    if (resposta.status === 429) {
      const cotaZerada = /limit:\s*0/i.test(msgApi);
      ultimoErro = {
        status: 429,
        mensagem: cotaZerada
          ? `A conta/projeto dessa chave no Google AI Studio está com cota gratuita zerada (limit: 0). Crie a chave em um novo projeto no AI Studio ou verifique as cotas em aistudio.google.com. Detalhe: ${msgApi}`
          : `Limite temporário do plano gratuito do Google Gemini atingido. Aguarde alguns segundos e tente novamente. Detalhe: ${msgApi}`,
        codigo: "LIMITE_PLANO_GRATUITO",
      };
      continue;
    }

    if (resposta.status === 503) {
      ultimoErro = {
        status: 503,
        mensagem: `Serviço do Google Gemini temporariamente indisponível (${msgApi}). Tente novamente em instantes.`,
        codigo: "SERVICO_INDISPONIVEL",
      };
      if (i < modelos.length - 1) {
        await aguardarComCancelamento(PAUSA_POS_503_MS, opcoes?.signal);
      }
      continue;
    }

    if (resposta.status === 401 || resposta.status === 403) {
      return {
        ok: false,
        status: resposta.status,
        mensagem: `Chave da API do Google Gemini inválida ou sem permissão (${msgApi}).`,
        codigo: "CHAVE_GEMINI_INVALIDA",
      };
    }

    if (resposta.status === 400) {
      const erroChave = /api key/i.test(msgApi);
      return {
        ok: false,
        status: 400,
        mensagem: erroChave
          ? `Chave da API do Google Gemini inválida (${msgApi}).`
          : `Erro na requisição ao Gemini: ${msgApi}`,
        codigo: erroChave ? "CHAVE_GEMINI_INVALIDA" : "ERRO_REQUISICAO_GEMINI",
      };
    }

    ultimoErro = {
      status: resposta.status,
      mensagem: `Erro ao consultar o Gemini: ${msgApi}`,
      codigo: "ERRO_GEMINI",
    };
  }

  return { ok: false, ...ultimoErro };
}

export async function processarAgenteComApiSistema(params: {
  mensagem?: string;
  historico?: MensagemHistoricoPayload[];
  confirmacaoExecucao?: { ferramenta: string; argumentos: Record<string, any> };
  apiKeyOverride?: string;
  signal?: AbortSignal;
}): Promise<{ status: number; body: Record<string, any> }> {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") || "" : "";
  const usuarioId = obterIdUsuarioLogado();

  if (!token || !usuarioId) {
    return {
      status: 401,
      body: { message: "Usuário não autenticado." },
    };
  }

  const apiKey = (params.apiKeyOverride || obterChaveGeminiLocal()).trim();
  if (!apiKey) {
    return {
      status: 400,
      body: {
        message:
          "Chave gratuita da API do Google Gemini não configurada. Clique na chave no topo do chat para inserir sua chave do Google AI Studio.",
        codigo: "CHAVE_GEMINI_AUSENTE",
      },
    };
  }

  const perfilResp = await requisicaoSistema(`/usuario/${usuarioId}`, token);
  const dadosUsuario = perfilResp.ok ? perfilResp.dados : {};
  const tipoUsuario =
    dadosUsuario?.tipo || obterTipoUsuarioLogado() || "coordenador";
  const nomeUsuario = dadosUsuario?.nome || "Usuário";
  const idosoVinculado = dadosUsuario?.idosoVinculado
    ? String(dadosUsuario.idosoVinculado)
    : undefined;

  const permissoes = obterPermissoesAtivas();
  const ctx: ContextoExecucaoLocal = {
    usuarioId,
    nomeUsuario,
    tipoUsuario,
    idosoVinculado,
    permissoes,
    token,
    acaoNavegacao: null,
    dadosAlterados: false,
    confirmacaoPendente: null,
  };

  if (params.confirmacaoExecucao?.ferramenta) {
    const resultado = (await executarFerramentaSistema(
      params.confirmacaoExecucao.ferramenta,
      { ...(params.confirmacaoExecucao.argumentos || {}), confirmado: true },
      ctx
    )) as Record<string, any>;

    if (resultado?.erro) {
      return {
        status: 403,
        body: {
          resposta: resultado.erro,
          acaoNavegacao: null,
          dadosAlterados: false,
          confirmacaoPendente: null,
        },
      };
    }

    return {
      status: 200,
      body: {
        resposta: resultado?.mensagem || "Ação confirmada e executada com sucesso.",
        acaoNavegacao: ctx.acaoNavegacao,
        dadosAlterados: ctx.dadosAlterados,
        confirmacaoPendente: null,
      },
    };
  }

  const mensagemLimpa = String(params.mensagem || "").trim();
  if (!mensagemLimpa) {
    return {
      status: 400,
      body: { message: "Envie uma mensagem para o assistente." },
    };
  }

  const historicoRecente = Array.isArray(params.historico)
    ? params.historico.slice(-10)
    : [];
  const contents: any[] = historicoRecente
    .filter((h) => h && (h.papel === "user" || h.papel === "model") && h.texto)
    .map((h) => ({
      role: h.papel,
      parts: [{ text: String(h.texto) }],
    }));

  contents.push({
    role: "user",
    parts: [{ text: mensagemLimpa }],
  });

  const declaracoes = construirDeclaracoesFerramentas(tipoUsuario, permissoes);
  const systemInstruction = {
    parts: [{ text: montarSystemInstruction(ctx) }],
  };

  let modeloUtilizado = MODELOS_FALLBACK_PADRAO[0];
  let modeloAtivo: string | undefined;
  let respostaTexto = "";
  const chamadasExecutadas = new Set<string>();

  for (let rodada = 0; rodada < 3; rodada++) {
    const resultadoGemini = await chamarGeminiComFallback(
      apiKey,
      {
        systemInstruction,
        contents,
        tools: [{ functionDeclarations: declaracoes }],
        generationConfig: { temperature: 0.1 },
      },
      { modeloPreferido: modeloAtivo, signal: params.signal }
    );

    if (!resultadoGemini.ok) {
      return {
        status: resultadoGemini.status,
        body: {
          message: resultadoGemini.mensagem,
          codigo: resultadoGemini.codigo,
        },
      };
    }

    modeloUtilizado = resultadoGemini.modelo;
    modeloAtivo = resultadoGemini.modelo;
    const candidato = resultadoGemini.dados?.candidates?.[0];
    const parts: any[] = candidato?.content?.parts || [];
    const chamadas = parts.filter((p) => p.functionCall);

    if (chamadas.length === 0) {
      respostaTexto = parts
        .map((p) => p.text || "")
        .join("\n")
        .trim();
      break;
    }

    const chavesChamadas = chamadas.map(
      (p) => `${p.functionCall.name}:${JSON.stringify(p.functionCall.args || {})}`
    );
    const todasRepetidas = chavesChamadas.every((k) => chamadasExecutadas.has(k));

    if (todasRepetidas) {
      const resumoFinal = await chamarGeminiComFallback(
        apiKey,
        {
          systemInstruction,
          contents,
          tools: [{ functionDeclarations: declaracoes }],
          toolConfig: { functionCallingConfig: { mode: "NONE" } },
          generationConfig: { temperature: 0.1 },
        },
        { modeloPreferido: modeloAtivo, signal: params.signal }
      );
      if (resumoFinal.ok) {
        const partesFinais: any[] =
          resumoFinal.dados?.candidates?.[0]?.content?.parts || [];
        respostaTexto = partesFinais
          .map((p) => p.text || "")
          .join("\n")
          .trim();
      }
      break;
    }

    chavesChamadas.forEach((k) => chamadasExecutadas.add(k));

    contents.push({
      role: "model",
      parts,
    });

    const respostasFerramentas: any[] = [];
    for (const parte of chamadas) {
      const fc = parte.functionCall;
      let resultadoTool: unknown;
      try {
        resultadoTool = await executarFerramentaSistema(
          fc.name,
          fc.args || {},
          ctx
        );
      } catch (err: any) {
        resultadoTool = { erro: err?.message || "Erro ao executar operação." };
      }
      respostasFerramentas.push({
        functionResponse: {
          name: fc.name,
          response: { result: resultadoTool },
        },
      });
    }

    contents.push({
      role: "user",
      parts: respostasFerramentas,
    });
  }

  if (!respostaTexto) {
    respostaTexto = ctx.confirmacaoPendente
      ? ctx.confirmacaoPendente.descricao
      : "Operação concluída no sistema.";
  }

  return {
    status: 200,
    body: {
      resposta: respostaTexto,
      acaoNavegacao: ctx.acaoNavegacao,
      dadosAlterados: ctx.dadosAlterados,
      confirmacaoPendente: ctx.confirmacaoPendente,
      modeloUtilizado,
    },
  };
}

export async function enviarMensagemAgente(params: {
  mensagem?: string;
  historico?: MensagemHistoricoPayload[];
  confirmacaoExecucao?: { ferramenta: string; argumentos: Record<string, any> };
  signal?: AbortSignal;
}): Promise<RespostaAgente> {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") || "" : "";
  const chaveLocal = obterChaveGeminiLocal();

  const resposta = await fetch(`${API_BASE}/agente`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(chaveLocal ? { "x-gemini-api-key": chaveLocal } : {}),
    },
    body: JSON.stringify({
      mensagem: params.mensagem,
      historico: params.historico,
      confirmacaoExecucao: params.confirmacaoExecucao,
    }),
    signal: params.signal,
  });

  const dados = await resposta.json().catch(() => ({}));

  if ((resposta.status === 404 || resposta.status === 503) && !dados?.codigo) {
    const fallback = await processarAgenteComApiSistema({
      ...params,
      apiKeyOverride: chaveLocal,
    });
    if (fallback.status >= 400) {
      throw new ErroAgenteIA(
        fallback.body?.message || "Erro ao se comunicar com o assistente.",
        fallback.body?.codigo || "ERRO_AGENTE",
        fallback.status
      );
    }
    return fallback.body as RespostaAgente;
  }

  if (!resposta.ok) {
    throw new ErroAgenteIA(
      dados?.message || "Erro ao se comunicar com o assistente.",
      dados?.codigo || "ERRO_AGENTE",
      resposta.status
    );
  }

  return dados as RespostaAgente;
}
