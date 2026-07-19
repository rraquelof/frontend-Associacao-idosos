import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  Users,
  DoorOpen,
  Calendar,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Layout from "../componentes/layout/Layout";
import idososIcon from "../img/idosos.png";
import eventosIcon from "../img/eventos.png";
import saudeIcon from "../img/saude.png";
import visitaIcon from "../img/visita.png";
import perfilIcon from "../img/perfil.png";
import casalIdosos from "../img/casalIdosos.png";
import { obterIdUsuarioLogado } from "../utilitarios/authUsuario";
import { usuarioTemAcesso } from "../utilitarios/permissoes";

const API_URL = "https://api-associacao-idosos.onrender.com/api";

function ehHoje(dataIso?: string) {
  if (!dataIso) return false;
  const data = new Date(dataIso);
  const hoje = new Date();
  return (
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
}

const acentoCard: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-amber-50 text-amber-600",
  pink: "bg-rose-50 text-rose-600",
  green: "bg-emerald-50 text-emerald-600",
};

export default function Menu() {
  const navegacao = useNavigate();
  const [usuario, setUsuario] = useState<{ nome: string; tipo: string; idosoVinculado?: string } | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [contagens, setContagens] = useState({
    idosos: 0,
    visitasHoje: 0,
    eventosHoje: 0,
    registrosSaudeHoje: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

    const idUsuario = obterIdUsuarioLogado();
    const buscaUsuario = idUsuario
      ? fetch(`${API_URL}/usuario/${idUsuario}`, { headers })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      : Promise.resolve(null);

    buscaUsuario.then((dados) => {
      if (dados) {
        setUsuario({ nome: dados.nome, tipo: dados.tipo, idosoVinculado: dados.idosoVinculado });
      }

      // Familiares só contam o idoso ao qual estão vinculados.
      fetch(`${API_URL}/idosos`, { headers })
        .then((r) => (r.ok ? r.json() : []))
        .then((idososDados) => {
          if (!Array.isArray(idososDados)) return;
          const total =
            dados?.tipo === "familiar"
              ? idososDados.filter((i: { _id: string }) => i._id === dados.idosoVinculado).length
              : idososDados.length;
          setContagens((c) => ({ ...c, idosos: total }));
        })
        .catch(() => {});

      // Familiares só veem os próprios registros de saúde do idoso vinculado.
      fetch(`${API_URL}/saudeIdoso`, { headers })
        .then((r) => (r.ok ? r.json() : []))
        .then((saudeDados) => {
          if (!Array.isArray(saudeDados)) return;
          const registrosDoUsuario =
            dados?.tipo === "familiar"
              ? saudeDados.filter(
                  (r: { idosoId?: { _id?: string } | string }) =>
                    (typeof r.idosoId === "string" ? r.idosoId : r.idosoId?._id) ===
                    dados.idosoVinculado
                )
              : saudeDados;

          const idososRegistradosHoje = new Set(
            registrosDoUsuario
              .filter((r: { dataConsulta?: string }) => ehHoje(r.dataConsulta))
              .map((r: { idosoId?: { _id?: string } | string }) =>
                typeof r.idosoId === "string" ? r.idosoId : r.idosoId?._id
              )
          );
          setContagens((c) => ({
            ...c,
            registrosSaudeHoje: idososRegistradosHoje.size,
          }));
        })
        .catch(() => {});
    });

    fetch(`${API_URL}/visitas`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((dados) =>
        setContagens((c) => ({
          ...c,
          visitasHoje: Array.isArray(dados)
            ? dados.filter((v: { data?: string }) => ehHoje(v.data)).length
            : 0,
        }))
      )
      .catch(() => {});

    fetch(`${API_URL}/eventos`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((dados) =>
        setContagens((c) => ({
          ...c,
          eventosHoje: Array.isArray(dados)
            ? dados.filter((e: { data?: string }) => ehHoje(e.data)).length
            : 0,
        }))
      )
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navegacao("/login");
  };

  const primeiroNome = usuario?.nome?.split(" ")[0] || "";

  const faltamRegistrosHoje = Math.max(
    contagens.idosos - contagens.registrosSaudeHoje,
    0
  );

  const descricaoSaude =
    contagens.idosos === 0
      ? "Nenhum idoso cadastrado"
      : faltamRegistrosHoje === 0
      ? "Todos os idosos foram registrados hoje"
      : `Faltam ${faltamRegistrosHoje} registro${faltamRegistrosHoje > 1 ? "s" : ""} para hoje`;

  const cartoesResumo = [
    {
      label: "Residentes",
      valor: contagens.idosos,
      descricao: "Cadastrados",
      link: "Ver todos",
      rota: "/lista/idosos",
      icon: <Users className="w-6 h-6" />,
      cor: "blue",
      pagina: "idosos" as const,
    },
    {
      label: "Visitas hoje",
      valor: contagens.visitasHoje,
      descricao: "Registradas hoje",
      link: "Ver visitas",
      rota: "/lista/visitas",
      icon: <DoorOpen className="w-6 h-6" />,
      cor: "green",
      pagina: "visitas" as const,
    },
    {
      label: "Eventos hoje",
      valor: contagens.eventosHoje,
      descricao: "Programados",
      link: "Ver eventos",
      rota: "/eventos",
      icon: <Calendar className="w-6 h-6" />,
      cor: "orange",
      pagina: "eventos" as const,
    },
    {
      label: "Registros de saúde",
      valor: contagens.registrosSaudeHoje,
      descricao: descricaoSaude,
      link: "Ver registros",
      rota: "/lista/registro/saude",
      icon: <HeartPulse className="w-6 h-6" />,
      cor: "pink",
      pagina: "saude" as const,
    },
  ].filter((c) => usuarioTemAcesso(c.pagina));

  const acessoRapidoTodos: {
    icon: string;
    titulo: string;
    descricao: string;
    rota: string;
    cor: string;
    pagina?: "idosos" | "eventos" | "saude" | "visitas";
  }[] = [
    {
      icon: idososIcon,
      titulo: "Residentes",
      descricao: "Cadastros e informações dos residentes",
      rota: "/lista/idosos",
      cor: "blue",
      pagina: "idosos",
    },
    {
      icon: eventosIcon,
      titulo: "Eventos",
      descricao: "Atividades, compromissos e calendário",
      rota: "/eventos",
      cor: "orange",
      pagina: "eventos",
    },
    {
      icon: saudeIcon,
      titulo: "Cuidados de saúde",
      descricao: "Acompanhamentos, prontuários e medicamentos",
      rota: "/lista/registro/saude",
      cor: "pink",
      pagina: "saude",
    },
    {
      icon: visitaIcon,
      titulo: "Visitas",
      descricao: "Entrada, autorização e histórico de visitantes",
      rota: "/lista/visitas",
      cor: "orange",
      pagina: "visitas",
    },
    {
      icon: perfilIcon,
      titulo: "Meu perfil",
      descricao: "Dados da conta e configurações",
      rota: "/perfil",
      cor: "green",
    },
  ];

  const acessoRapido = acessoRapidoTodos.filter(
    (item) => !item.pagina || usuarioTemAcesso(item.pagina)
  );

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-emerald-50/30">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-end gap-4 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuAberto((v) => !v)}
                className="flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <User size={18} />
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold text-gray-800">
                    {usuario?.nome || "..."}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">
                    {usuario?.tipo || ""}
                  </span>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {menuAberto && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20">
                  <button
                    type="button"
                    onClick={() => navegacao("/perfil")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Meu perfil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Olá{primeiroNome ? `, ${primeiroNome}` : ""}!
            </h1>
            <p className="text-gray-500 mt-1">
              Veja o que precisa da sua atenção hoje.
            </p>
          </div>
          <img
            src={casalIdosos}
            alt=""
            className="hidden md:block w-40 lg:w-56 h-auto object-contain shrink-0"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cartoesResumo.map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${acentoCard[c.cor]}`}>
                {c.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{c.valor}</p>
                <p className="text-gray-800 text-sm font-medium">{c.label}</p>
                <p className="text-gray-400 text-xs">{c.descricao}</p>
              </div>
              <button
                type="button"
                onClick={() => navegacao(c.rota)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-auto"
              >
                {c.link} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {acessoRapido.map((item) => (
            <button
              type="button"
              key={item.rota}
              onClick={() => navegacao(item.rota)}
              className="text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${acentoCard[item.cor]}`}>
                <img src={item.icon} alt="" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{item.titulo}</p>
                <p className="text-gray-400 text-sm mt-0.5">{item.descricao}</p>
              </div>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center ${acentoCard[item.cor]}`}>
                <ArrowRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-100 mt-12 py-6 text-center text-xs text-gray-400">
        <p className="flex items-center justify-center gap-1.5 text-gray-500 font-medium">
          <ShieldCheck size={14} className="text-blue-500" />
          SIGAAI — Abrigo Luca Zorn
        </p>
        <p className="mt-1">
          Versão 2.0 • © {new Date().getFullYear()} Todos os direitos reservados
        </p>
      </footer>
    </div>
    </Layout>
  );
}
