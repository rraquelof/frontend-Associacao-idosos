import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, HeartPulse, Ruler, Weight, Droplet } from "lucide-react";
import Botao from "../../componentes/botao/Botao";
import Layout from "../../componentes/layout/Layout";
import GraficoLinha from "../../componentes/grafico-linha/GraficoLinha";
import { formatarDataBR } from "../../formatacao/formatarDataBr";
import type Idoso from "../../modelo/Idoso";
import type RegistroSaudeIdoso from "../../modelo/RegistroSaudeIdoso";

const API_URL = "https://api-associacao-idosos.onrender.com/api";

const estadoNutricionalEstilo: Record<string, string> = {
  normal: "bg-emerald-50 text-emerald-700",
  "baixo peso": "bg-amber-50 text-amber-700",
  sobrepeso: "bg-rose-50 text-rose-700",
};

function calcularIdade(dataNascimento?: string | Date): number | null {
  if (!dataNascimento) return null;
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento.getTime())) return null;

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade--;
  return idade;
}

export default function RelatorioSaudeIdoso() {
  const { id } = useParams();
  const navegacao = useNavigate();

  const [idoso, setIdoso] = useState<Idoso | null>(null);
  const [registros, setRegistros] = useState<RegistroSaudeIdoso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

    const buscarDados = async () => {
      try {
        const [respostaIdoso, respostaSaude] = await Promise.all([
          fetch(`${API_URL}/idoso/${id}`, { headers }),
          fetch(`${API_URL}/saudeIdoso`, { headers }),
        ]);

        if (!respostaIdoso.ok) {
          throw new Error("Erro ao buscar dados do idoso");
        }

        const dadosIdoso = await respostaIdoso.json();
        setIdoso(dadosIdoso);

        const dadosSaude = respostaSaude.ok ? await respostaSaude.json() : [];
        const registrosDoIdoso = Array.isArray(dadosSaude)
          ? dadosSaude
              .filter((r: RegistroSaudeIdoso) => r.idosoId?._id === id)
              .sort(
                (a: RegistroSaudeIdoso, b: RegistroSaudeIdoso) =>
                  new Date(a.dataConsulta).getTime() - new Date(b.dataConsulta).getTime()
              )
          : [];
        setRegistros(registrosDoIdoso);
      } catch (err) {
        setErro((err as Error).message);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, [id]);

  if (carregando) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-24 text-rose-500 font-medium">
          Carregando relatório...
        </div>
      </Layout>
    );
  }

  if (erro || !idoso) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-24 text-red-500 font-bold">
          {erro || "Idoso não encontrado."}
        </div>
      </Layout>
    );
  }

  const idade = calcularIdade(idoso.dataNascimento);
  const ultimoRegistro = registros[registros.length - 1];

  const alergias = Array.from(
    new Set(registros.flatMap((r) => r.alergias ?? []).filter(Boolean))
  );
  const doencasCronicas = Array.from(
    new Set(registros.flatMap((r) => r.doencasCronicas ?? []).filter(Boolean))
  );

  const dadosPeso = registros.map((r) => ({
    label: formatarDataBR(r.dataConsulta),
    valor: r.peso,
  }));
  const dadosGlicemia = registros.map((r) => ({
    label: formatarDataBR(r.dataConsulta),
    valor: r.glicemia,
  }));

  return (
    <Layout>
      <div className="w-full flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-5xl flex flex-wrap items-center gap-4 mb-8 mt-6 sm:mt-10">
          <Botao
            onClick={() => navegacao(-1)}
            className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
          >
            <ChevronLeftIcon />
          </Botao>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
            <HeartPulse className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
              Relatório de saúde — {idoso.nome}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {idade !== null ? `${idade} anos` : ""}
              {idade !== null ? " • " : ""}
              {registros.length > 0
                ? `${registros.length} consulta${registros.length > 1 ? "s" : ""} registrada${registros.length > 1 ? "s" : ""}`
                : "Nenhuma consulta registrada"}
            </p>
          </div>
        </div>

        {registros.length === 0 ? (
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
              <HeartPulse className="w-8 h-8 text-rose-400" />
            </div>
            <p className="text-gray-600 font-medium">Nenhum registro de saúde ainda</p>
            <p className="text-gray-400 text-sm mt-1">
              Assim que consultas forem registradas, o relatório aparece aqui.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Weight className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{ultimoRegistro.peso} kg</p>
                <p className="text-gray-400 text-xs">Peso mais recente</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Ruler className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{ultimoRegistro.altura} m</p>
                <p className="text-gray-400 text-xs">Altura mais recente</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Droplet className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{ultimoRegistro.glicemia} mg/dL</p>
                <p className="text-gray-400 text-xs">Glicemia mais recente</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{ultimoRegistro.pressao}</p>
                <p className="text-gray-400 text-xs">Pressão mais recente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoLinha titulo="Peso ao longo do tempo" dados={dadosPeso} unidade=" kg" corLinha="#2563eb" corArea="#2563eb1a" corPonto="#2563eb" />
              <GraficoLinha titulo="Glicemia ao longo do tempo" dados={dadosGlicemia} unidade=" mg/dL" corLinha="#e11d48" corArea="#e11d481a" corPonto="#e11d48" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="font-bold text-gray-800 mb-3">Alergias</p>
                {alergias.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {alergias.map((a) => (
                      <span key={a} className="bg-amber-50 text-amber-700 text-sm font-medium px-3 py-1 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Nenhuma alergia registrada.</p>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="font-bold text-gray-800 mb-3">Doenças crônicas</p>
                {doencasCronicas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {doencasCronicas.map((d) => (
                      <span key={d} className="bg-rose-50 text-rose-700 text-sm font-medium px-3 py-1 rounded-full">
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Nenhuma doença crônica registrada.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <p className="font-bold text-gray-800 p-5 pb-0">Histórico de consultas</p>
              <div className="overflow-x-auto p-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="py-2 pr-4 font-medium">Data</th>
                      <th className="py-2 pr-4 font-medium">Peso</th>
                      <th className="py-2 pr-4 font-medium">Altura</th>
                      <th className="py-2 pr-4 font-medium">Pressão</th>
                      <th className="py-2 pr-4 font-medium">Glicemia</th>
                      <th className="py-2 pr-4 font-medium">Estado nutricional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...registros].reverse().map((r) => (
                      <tr key={r._id} className="border-b border-gray-50 last:border-0">
                        <td className="py-2 pr-4 text-gray-700">{formatarDataBR(r.dataConsulta)}</td>
                        <td className="py-2 pr-4 text-gray-700">{r.peso} kg</td>
                        <td className="py-2 pr-4 text-gray-700">{r.altura} m</td>
                        <td className="py-2 pr-4 text-gray-700">{r.pressao}</td>
                        <td className="py-2 pr-4 text-gray-700">{r.glicemia} mg/dL</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              estadoNutricionalEstilo[r.estadoNutricional] || "bg-gray-50 text-gray-600"
                            }`}
                          >
                            {r.estadoNutricional}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
