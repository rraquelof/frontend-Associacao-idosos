import { useEffect, useState } from "react";
import type Visita from "../../modelo/Visita";
import { useNavigate, useLocation } from "react-router-dom";
import Botao from "../../componentes/botao/Botao";
import { ChevronLeftIcon, UserCheck, Loader2 } from "lucide-react";
import Layout from "../../componentes/layout/Layout";
import visitaIcon from "../../img/visita.png";

export default function ListarVisitas() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const navegacao = useNavigate();
  const localizacao = useLocation();
  const [visitaSelecionada, setVisitaSelecionada] = useState<{
    _id: string;
    nome: string;
  } | null>(null);

  useEffect(() => {
    const carregarVisitas = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const respostaVisitas = await fetch(
          "https://api-associacao-idosos.onrender.com/api/visitas",
          { method: "GET", headers },
        );
        const dadosVisitas = await respostaVisitas.json();

        if (!respostaVisitas.ok) {
          setMensagem(dadosVisitas.message || "Erro ao buscar visitas");
          return;
        }

        setVisitas(dadosVisitas);
      } catch {
        setMensagem("Falha ao carregar os dados de visitas");
      } finally {
        setCarregando(false);
      }
    };

    carregarVisitas();
  }, [localizacao]);

  const idososUnicos = visitas.filter(
    (visita, index, self) =>
      index === self.findIndex((v) => v.nome === visita.nome),
  );

  return (
    <Layout>
    <div className="w-full flex flex-col items-center p-4 sm:p-8 relative">
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 mb-8 mt-6 sm:mt-10">
        <div className="flex items-center gap-4">
          <Botao
            onClick={() => navegacao("/menu")}
            className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
          >
            <ChevronLeftIcon />
          </Botao>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
            <img src={visitaIcon} alt="" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
              Gerenciamento de Visitas
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Entrada, autorização e histórico de visitantes</p>
          </div>
        </div>
        <Botao
          onClick={() => navegacao("/cadastro/visita")}
          texto="+ Nova Visita"
          className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 text-white rounded-full shadow-md hover:shadow-lg transition-all font-semibold"
        />
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <div className={`overflow-y-auto ${idososUnicos.length > 0 ? "h-[60vh]" : ""}`}>
          {carregando ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
              </div>
              <p className="text-gray-500 font-medium">Carregando visitas...</p>
            </div>
          ) : (
            <>
              {idososUnicos.map((visita) => (
                <div
                  key={visita._id}
                  className="flex flex-wrap gap-2 justify-between text-black items-center border-b py-4 px-2 last:border-0"
                >
                  <span className="text-lg font-medium break-words">
                    {visita.nome || "Visita não identificada"}
                  </span>

                  <Botao
                    texto="Ver dados"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      setVisitaSelecionada({
                        _id: visita._id || "",
                        nome: visita.nome,
                      });
                    }}
                  />
                </div>
              ))}

              {mensagem && (
                <p className="text-center text-sm mt-2 text-gray-700">{mensagem}</p>
              )}

              {visitas.length === 0 && !mensagem && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Nenhuma visita cadastrada</p>
                  <p className="text-gray-400 text-sm -mt-2">
                    Clique em "+ Nova Visita" para registrar a primeira.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {visitaSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl text-black">
            <h2 className="text-xl font-bold mb-4">Dados da Visita</h2>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold">
                  Visitante:
                </p>
                <p className="text-lg text-black">{visitaSelecionada.nome}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">
                  Data e Hora:
                </p>
                <p className="text-lg text-black">
                  {visitas.find((v) => v._id === visitaSelecionada._id)?.data
                    ? new Date(
                        visitas.find((v) => v._id === visitaSelecionada._id)
                          ?.data || "",
                      ).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Data indisponível"}
                </p>
              </div>
            </div>

            <div className="w-full flex gap-2">
              <Botao
                texto="Editar"
                onClick={() =>
                  navegacao(`/atualizar/visita/${visitaSelecionada._id}`)
                }
                className="bg-yellow-500 text-white hover:bg-yellow-600 text-sm py-2 px-3 rounded-md font-medium shadow-sm transition flex-1"
              />
              <Botao
                texto="Deletar"
                onClick={() =>
                  navegacao(`/deletar/visita/${visitaSelecionada._id}`)
                }
                className="bg-red-500 text-white hover:bg-red-600 text-sm py-2 px-3 rounded-md font-medium shadow-sm transition flex-1"
              />
            </div>

            <Botao
              onClick={() => setVisitaSelecionada(null)}
              texto="Fechar"
              className="mt-4 w-full bg-gray-500 text-white font-bold py-2 rounded-xl hover:bg-gray-600 transition"
            />
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}
