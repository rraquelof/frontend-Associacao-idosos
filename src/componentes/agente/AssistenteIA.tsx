import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  KeyRound,
  Loader2,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  obterIdUsuarioLogado,
  obterTipoUsuarioLogado,
} from "../../utilitarios/authUsuario";
import { usuarioTemAcesso } from "../../utilitarios/permissoes";
import {
  enviarMensagemAgente,
  ErroAgenteIA,
  obterChaveGeminiLocal,
  removerChaveGeminiLocal,
  salvarChaveGeminiLocal,
  type ConfirmacaoPendente,
  type MensagemHistoricoPayload,
} from "../../utilitarios/agenteIA";

interface MensagemUI {
  id: string;
  papel: "user" | "model";
  texto: string;
  acaoNavegacao?: string | null;
  dadosAlterados?: boolean;
  confirmacaoPendente?: ConfirmacaoPendente | null;
  confirmacaoResolvida?: "confirmada" | "cancelada";
  erro?: boolean;
}

const CHAVE_CHAT_ABERTO = "sigaai_agente_aberto_v1";

function obterChaveHistorico(usuarioId: string): string {
  return `sigaai_agente_chat_${usuarioId}`;
}

function formatarPerfil(tipo: string | null): string {
  if (!tipo) return "Usuário";
  const mapa: Record<string, string> = {
    coordenador: "Coordenador(a)",
    enfermeiro: "Enfermeiro(a)",
    voluntario: "Voluntário(a)",
    familiar: "Familiar",
  };
  return mapa[tipo.toLowerCase()] || tipo;
}

function sugerirComandosPorPerfil(tipo: string | null): string[] {
  const tipoLower = (tipo || "").toLowerCase();
  const sugestoes = ["Resumo do abrigo hoje"];

  if (usuarioTemAcesso("idosos")) {
    sugestoes.push("Listar idosos cadastrados");
  }
  if (
    usuarioTemAcesso("saude") &&
    (tipoLower === "coordenador" || tipoLower === "enfermeiro")
  ) {
    sugestoes.push("Registrar acompanhamento de saúde");
  }
  if (usuarioTemAcesso("visitas")) {
    sugestoes.push("Agendar nova visita");
  }
  if (usuarioTemAcesso("eventos")) {
    sugestoes.push("Próximos eventos");
  }

  return sugestoes;
}

export default function AssistenteIA() {
  const navegacao = useNavigate();
  const localizacao = useLocation();
  const usuarioId = obterIdUsuarioLogado();
  const tipoUsuario = obterTipoUsuarioLogado();

  const [aberto, setAberto] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(CHAVE_CHAT_ABERTO) === "true";
    } catch {
      return false;
    }
  });

  const [mensagens, setMensagens] = useState<MensagemUI[]>(() => {
    if (!usuarioId) return [];
    try {
      const salvo = sessionStorage.getItem(obterChaveHistorico(usuarioId));
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignora erro de leitura no storage
    }
    return [];
  });

  const [entrada, setEntrada] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [configurandoChave, setConfigurandoChave] = useState(false);
  const [chaveInput, setChaveInput] = useState(() => obterChaveGeminiLocal());
  const [temChaveLocal, setTemChaveLocal] = useState(() =>
    Boolean(obterChaveGeminiLocal())
  );

  const fimMensagensRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(CHAVE_CHAT_ABERTO, String(aberto));
    } catch {
      // ignora erro de escrita
    }
  }, [aberto]);

  useEffect(() => {
    if (!usuarioId) return;
    try {
      sessionStorage.setItem(
        obterChaveHistorico(usuarioId),
        JSON.stringify(mensagens.slice(-30))
      );
    } catch {
      // ignora erro de escrita
    }
  }, [mensagens, usuarioId]);

  useEffect(() => {
    if (aberto) {
      fimMensagensRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensagens, aberto, carregando]);

  if (!usuarioId) {
    return null;
  }

  const sugestoes = sugerirComandosPorPerfil(tipoUsuario);

  const montarHistoricoPayload = (lista: MensagemUI[]): MensagemHistoricoPayload[] =>
    lista
      .filter((m) => !m.erro)
      .slice(-10)
      .map((m) => ({ papel: m.papel, texto: m.texto }));

  const processarResposta = (
    resposta: Awaited<ReturnType<typeof enviarMensagemAgente>>,
    textoFallback?: string
  ) => {
    const novaMsg: MensagemUI = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      papel: "model",
      texto: resposta.resposta || textoFallback || "Operação concluída.",
      acaoNavegacao: resposta.acaoNavegacao || null,
      dadosAlterados: Boolean(resposta.dadosAlterados),
      confirmacaoPendente: resposta.confirmacaoPendente || null,
    };

    setMensagens((prev) => [...prev, novaMsg]);

    if (resposta.acaoNavegacao) {
      navegacao(resposta.acaoNavegacao);
    } else if (resposta.dadosAlterados) {
      window.dispatchEvent(new CustomEvent("sigaai:dados-alterados"));
      navegacao(localizacao.pathname, {
        replace: true,
        state: { atualizadoEm: Date.now() },
      });
    }
  };

  const enviar = async (textoCustom?: string) => {
    const texto = (textoCustom ?? entrada).trim();
    if (!texto || carregando) return;

    const msgUsuario: MensagemUI = {
      id: `usr-${Date.now()}`,
      papel: "user",
      texto,
    };

    const historicoAntes = montarHistoricoPayload(mensagens);
    setMensagens((prev) => [...prev, msgUsuario]);
    if (!textoCustom) setEntrada("");
    setCarregando(true);

    try {
      const res = await enviarMensagemAgente({
        mensagem: texto,
        historico: historicoAntes,
      });
      processarResposta(res);
    } catch (err: any) {
      const ehErroChave =
        err instanceof ErroAgenteIA &&
        (err.codigo === "CHAVE_GEMINI_AUSENTE" ||
          err.codigo === "CHAVE_GEMINI_INVALIDA");

      if (ehErroChave) {
        setConfigurandoChave(true);
      }

      setMensagens((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          papel: "model",
          texto:
            err?.message ||
            "Não foi possível consultar o assistente agora. Tente novamente.",
          erro: true,
        },
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const lidarConfirmacao = async (
    mensagemId: string,
    confirmacao: ConfirmacaoPendente,
    aceitou: boolean
  ) => {
    setMensagens((prev) =>
      prev.map((m) =>
        m.id === mensagemId
          ? {
              ...m,
              confirmacaoResolvida: aceitou ? "confirmada" : "cancelada",
            }
          : m
      )
    );

    if (!aceitou) {
      setMensagens((prev) => [
        ...prev,
        {
          id: `cancel-${Date.now()}`,
          papel: "model",
          texto: "Exclusão cancelada. Nenhum dado foi alterado.",
        },
      ]);
      return;
    }

    setCarregando(true);
    try {
      const res = await enviarMensagemAgente({
        confirmacaoExecucao: {
          ferramenta: confirmacao.ferramenta,
          argumentos: confirmacao.argumentos,
        },
      });
      processarResposta(res, "Exclusão realizada com sucesso.");
    } catch (err: any) {
      setMensagens((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          papel: "model",
          texto: err?.message || "Não foi possível confirmar a exclusão.",
          erro: true,
        },
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const salvarChave = () => {
    if (!chaveInput.trim()) return;
    salvarChaveGeminiLocal(chaveInput);
    setTemChaveLocal(true);
    setConfigurandoChave(false);
  };

  const limparChave = () => {
    removerChaveGeminiLocal();
    setChaveInput("");
    setTemChaveLocal(false);
  };

  const limparConversa = () => {
    setMensagens([]);
    try {
      sessionStorage.removeItem(obterChaveHistorico(usuarioId));
    } catch {
      // ignora erro de storage
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {aberto && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 text-white px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm truncate">Assistente SIGAAI</h2>
                  <span className="text-[10px] font-semibold bg-white/20 px-1.5 py-0.5 rounded-full">
                    {formatarPerfil(tipoUsuario)}
                  </span>
                </div>
                <p className="text-[11px] text-blue-50 flex items-center gap-1 truncate">
                  <ShieldCheck size={12} />
                  Exclusivo Abrigo Luca Zorn · LGPD
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setConfigurandoChave((v) => !v)}
                title="Configurar chave gratuita Google Gemini"
                className={`p-1.5 rounded-lg transition-colors ${
                  configurandoChave || !temChaveLocal
                    ? "bg-white/25 hover:bg-white/35"
                    : "hover:bg-white/20"
                }`}
              >
                <KeyRound size={16} />
              </button>
              {mensagens.length > 0 && (
                <button
                  type="button"
                  onClick={limparConversa}
                  title="Limpar conversa"
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setAberto(false)}
                title="Fechar assistente"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {configurandoChave && (
            <div className="bg-blue-50 border-b border-blue-100 p-3 text-xs text-gray-700 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-blue-900">
                  Chave gratuita Google AI Studio (Gemini)
                </span>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-medium"
                >
                  Gerar chave grátis
                </a>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Opcional caso o servidor já tenha{" "}
                <code className="bg-white px-1 rounded">GEMINI_API_KEY</code> configurada.
                Salva apenas neste navegador.
              </p>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  value={chaveInput}
                  onChange={(e) => setChaveInput(e.target.value)}
                  placeholder="Cole sua chave AIza..."
                  className="flex-1 bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={salvarChave}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Salvar
                </button>
                {temChaveLocal && (
                  <button
                    type="button"
                    onClick={limparChave}
                    className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/70">
            {mensagens.length === 0 ? (
              <div className="space-y-3 py-2">
                <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm text-xs text-gray-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <Sparkles size={14} className="text-blue-500" />
                    Olá! Como posso ajudar no sistema hoje?
                  </div>
                  <p className="leading-relaxed">
                    Consulto e gerencio idosos, saúde, visitas e eventos de acordo com
                    as permissões do seu perfil (<strong>{formatarPerfil(tipoUsuario)}</strong>),
                    sem expor CPF, RG ou SUS.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium text-gray-500 px-1">
                    Sugestões rápidas:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sugestoes.map((sugestao) => (
                      <button
                        key={sugestao}
                        type="button"
                        onClick={() => enviar(sugestao)}
                        className="text-left text-xs bg-white hover:bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1.5 transition-colors shadow-xs"
                      >
                        {sugestao}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.papel === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.papel === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : msg.erro
                        ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-sm"
                        : "bg-white text-gray-800 border border-gray-100 shadow-xs rounded-bl-sm"
                    }`}
                  >
                    {msg.texto}
                  </div>

                  {msg.acaoNavegacao && (
                    <button
                      type="button"
                      onClick={() => navegacao(msg.acaoNavegacao!)}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-full transition-colors"
                    >
                      Página aberta: {msg.acaoNavegacao}
                      <ArrowRight size={12} />
                    </button>
                  )}

                  {msg.dadosAlterados && !msg.acaoNavegacao && (
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full transition-colors"
                    >
                      <RefreshCw size={11} />
                      Atualizar dados na tela
                    </button>
                  )}

                  {msg.confirmacaoPendente && !msg.confirmacaoResolvida && (
                    <div className="mt-2 w-[88%] bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
                      <div className="flex items-start gap-2 text-amber-900">
                        <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                        <div>
                          <p className="font-semibold">
                            {msg.confirmacaoPendente.titulo}
                          </p>
                          <p className="text-amber-800 mt-0.5">
                            {msg.confirmacaoPendente.descricao}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={carregando}
                          onClick={() =>
                            lidarConfirmacao(msg.id, msg.confirmacaoPendente!, true)
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-1.5 px-2.5 rounded-lg transition-colors"
                        >
                          <Check size={13} />
                          Confirmar exclusão
                        </button>
                        <button
                          type="button"
                          disabled={carregando}
                          onClick={() =>
                            lidarConfirmacao(msg.id, msg.confirmacaoPendente!, false)
                          }
                          className="flex-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-medium py-1.5 px-2.5 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {msg.confirmacaoResolvida && (
                    <span className="mt-1 text-[11px] text-gray-400 px-1">
                      {msg.confirmacaoResolvida === "confirmada"
                        ? "Exclusão confirmada"
                        : "Exclusão cancelada"}
                    </span>
                  )}
                </div>
              ))
            )}

            {carregando && (
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-100 rounded-2xl px-3 py-2 w-fit shadow-xs">
                <Loader2 size={14} className="animate-spin text-blue-600" />
                Consultando sistema...
              </div>
            )}
            <div ref={fimMensagensRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
            className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Pergunte ou peça uma ação no sistema..."
              disabled={carregando}
              className="flex-1 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={carregando || !entrada.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white flex items-center justify-center hover:shadow-md disabled:opacity-40 transition-all shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold text-sm"
        aria-label="Abrir assistente de IA do SIGAAI"
      >
        <Bot size={20} />
        <span>{aberto ? "Fechar Assistente" : "Assistente IA"}</span>
      </button>
    </div>
  );
}
