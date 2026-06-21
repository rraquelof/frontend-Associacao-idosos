import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type Visita from "../../modelo/Visita";
import Botao from "../../componentes/botao/Botao";
import { ChevronLeftIcon } from "lucide-react";

export default function DetalhesVisita() {
  const { id } = useParams();
  const navegacao = useNavigate();
  const [visita, setVisita] = useState<Visita | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const buscarVisita = async () => {
      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch(
          `https://api-associacao-idosos.onrender.com/api/visita/${id}`,
          {
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
          },
        );

        if (resposta.ok) {
          const dados = await resposta.json();
          setVisita(dados);
        } else {
          setMensagem("Erro ao carregar os dados da visita.");
        }
      } catch {
        setMensagem("Falha ao carregar a visita.");
      } finally {
        setCarregando(false);
      }
    };

    if (id) {
      buscarVisita();
    }
  }, [id]);

  if (carregando) {
    return (
      <div className="w-screen min-h-screen bg-gray-200 flex items-center justify-center">
        <p className="text-gray-700 font-medium">Carregando visita...</p>
      </div>
    );
  }

  if (!visita) {
    return (
      <div className="w-screen min-h-screen bg-gray-200 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-700 font-medium">
          {mensagem || "Visita não encontrada."}
        </p>
        <Botao
          onClick={() => navegacao("/lista/visitas")}
          texto="Voltar"
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
      </div>
    );
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-screen min-h-screen bg-gray-200 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl flex items-center justify-between mb-8 mt-10">
        <div className="flex items-center gap-4">
          <Botao
            onClick={() => navegacao("/lista/visitas")}
            className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
          >
            <ChevronLeftIcon />
          </Botao>
          <h1 className="text-3xl font-bold text-black">Detalhes da Visita</h1>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-black font-bold text-xl uppercase tracking-wider mb-4">
              Informações da Visita
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm font-semibold">
                  Idoso
                </span>
                <span className="text-black text-lg font-medium">
                  {visita.idosoId?.nome || "N/A"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-600 text-sm font-semibold">
                  Data e Hora
                </span>
                <span className="text-black text-lg font-medium">
                  {formatarData(visita.data)}
                </span>
              </div>

              {visita.createdAt && (
                <div className="flex flex-col text-xs text-gray-500">
                  <span>
                    Criado em:{" "}
                    {new Date(visita.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  {visita.updatedAt && (
                    <span>
                      Atualizado em:{" "}
                      {new Date(visita.updatedAt).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Botao
              onClick={() => navegacao(`/atualizar/visita/${id}`)}
              texto="Editar"
              className="bg-yellow-500 text-white hover:bg-yellow-600 flex-1"
            />
            <Botao
              onClick={() => navegacao(`/deletar/visita/${id}`)}
              texto="Deletar"
              className="bg-red-500 text-white hover:bg-red-600 flex-1"
            />
            <Botao
              onClick={() => navegacao("/lista/visitas")}
              texto="Voltar"
              className="bg-gray-400 text-white hover:bg-gray-500 flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
