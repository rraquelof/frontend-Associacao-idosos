import { useEffect, useState } from "react";
import type Visita from "../../modelo/Visita";
import { useNavigate, useLocation } from "react-router-dom";
import Botao from "../../componentes/botao/Botao";
import { ChevronLeftIcon } from "lucide-react";

export default function ListarVisitas() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [mensagem, setMensagem] = useState("");
  const navegacao = useNavigate();
  const localizacao = useLocation();
  const [idosoSelecionado, setIdosoSelecionado] = useState<{
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
      }
    };

    carregarVisitas();
  }, [localizacao]);

  const idososUnicos = visitas.filter(
    (visita, index, self) =>
      index === self.findIndex((v) => v.nome === visita.nome)
  );

  return (
    <div className="w-screen min-h-screen bg-gray-200 flex flex-col items-center p-8 relative">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 mt-10">
        <div className="flex items-center gap-4">
          <Botao
            onClick={() => navegacao("/menu")}
            className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
          >
            <ChevronLeftIcon />
          </Botao>
          <h1 className="text-3xl font-bold text-black">
            Gerenciamento de Visitas
          </h1>
        </div>
        <Botao
          onClick={() => navegacao("/cadastro/visita")}
          texto="+ Nova Visita"
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
        <div className="h-[60vh] overflow-y-auto">
          {idososUnicos.map((visita) => (
            <div
              key={visita._id}
              className="flex justify-between text-black items-center border-b py-4 px-2 last:border-0"
            >
              <span className="text-lg font-medium">
                {visita.nome || "Visita não identificada"}
              </span>

              <Botao
                texto="Ver dados"
                className="bg-blue-300 text-white hover:bg-blue-500"
                onClick={() => {
                  setIdosoSelecionado({
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
            <p className="text-gray-500 text-center py-4">
              Nenhuma visita cadastrada.
            </p>
          )}
        </div>
      </div>

      {idosoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl text-black">
            <h2 className="text-xl font-bold mb-4">Dados da Visita</h2>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Idoso:</p>
                <p className="text-lg text-black">{idosoSelecionado.nome}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Data:</p>
                <p className="text-lg text-black">
                  {visitas.find((v) => v._id === idosoSelecionado._id)?.data
                    ? new Date(
                        visitas.find((v) => v._id === idosoSelecionado._id)
                          ?.data || "",
                      ).toLocaleDateString("pt-BR")
                    : "Data indisponível"}
                </p>
              </div>
            </div>

            <div className="w-full flex gap-2">
              <Botao
                texto="Editar"
                onClick={() =>
                  navegacao(`/atualizar/visita/${idosoSelecionado._id}`)
                }
                className="bg-yellow-500 text-white hover:bg-yellow-600 text-sm py-2 px-3 rounded-md font-medium shadow-sm transition flex-1"
              />
              <Botao
                texto="Deletar"
                onClick={() =>
                  navegacao(`/deletar/visita/${idosoSelecionado._id}`)
                }
                className="bg-red-500 text-white hover:bg-red-600 text-sm py-2 px-3 rounded-md font-medium shadow-sm transition flex-1"
              />
            </div>

            <Botao
              onClick={() => setIdosoSelecionado(null)}
              texto="Fechar"
              className="mt-4 w-full bg-gray-500 text-white font-bold py-2 rounded-xl hover:bg-gray-600 transition"
            />
          </div>
        </div>
      )}
    </div>
  );
}
