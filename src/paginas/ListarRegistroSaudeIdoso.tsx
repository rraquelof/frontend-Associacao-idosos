import { useEffect, useState } from "react";
import type RegistroSaudeIdoso from "../modelo/RegistroSaudeIdoso";
import { useNavigate } from "react-router-dom";
import Botao from "../componentes/botao/Botao";
import { ChevronLeftIcon } from "lucide-react";

export default function ListarRegistroSaudeIdoso() {
  const [registrosSaude, setRegistrosSaude] = useState<RegistroSaudeIdoso[]>([]);
  const [mensagem, setMensagem] = useState("");
  const navegacao = useNavigate();
  const [idosoSelecionado, setIdosoSelecionado] = useState<{ _id: string; nome: string } | null>(null);
  const [dataPesquisa, setDataPesquisa] = useState("");

  useEffect(() => {
    const carregarDadosSaude = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const respostaSaude = await fetch(
          "https://api-associacao-idosos.onrender.com/api/saudeIdoso",
          { method: "GET", headers }
        );
        const dadosSaude = await respostaSaude.json();

        if (!respostaSaude.ok) {
          setMensagem(dadosSaude.message || "Erro ao buscar registros de saúde");
          return;
        }

        setRegistrosSaude(dadosSaude);
      } catch {
        setMensagem("Falha ao carregar os dados de saúde");
      }
    };

    carregarDadosSaude();
  }, []);

  const idososUnicos = registrosSaude.filter((registro, index, self) =>
    index === self.findIndex((r) => r.idosoId?._id === registro.idosoId?._id)
  );

  const datasDoIdosoSelecionado = registrosSaude
    .filter((registro) => registro.idosoId?._id === idosoSelecionado?._id)
   
    .sort((a, b) => {
      const dataA = a.dataConsulta ? new Date(a.dataConsulta).getTime() : 0;
      const dataB = b.dataConsulta ? new Date(b.dataConsulta).getTime() : 0;
      return dataB - dataA; 
    })
   
    .filter((registro) => {
      if (!dataPesquisa) return true; 
      if (!registro.dataConsulta) return false;

      const dataRegistroFormatoInput = new Date(registro.dataConsulta).toISOString().split("T")[0];
      return dataRegistroFormatoInput === dataPesquisa;
    });

  return (
    <div className="w-screen min-h-screen bg-gray-200 flex flex-col items-center p-8 relative">

      <div className="w-full max-w-5xl flex items-center justify-between mb-8 mt-10">
        <div className="flex items-center gap-4">
          <Botao onClick={() => navegacao("/menu")} className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100">
            <ChevronLeftIcon />
          </Botao>
          <h1 className="text-3xl font-bold text-black">Gerenciamento dos Registros de Saúde dos Idosos</h1>
        </div>
        <Botao 
          onClick={() => navegacao("/registro/saude")}
          texto="+ Novo Registro"
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
        <div className="h-[60vh] overflow-y-auto">
          {idososUnicos.map((registro) => (
            <div
              key={registro._id}
              className="flex justify-between text-black items-center border-b py-4 px-2 last:border-0"
            >
              <span className="text-lg font-medium">
                {registro.idosoId?.nome || "Idoso não identificado"}
              </span>
              
              <Botao
                texto="Ver dados"
                className="bg-blue-300 text-white hover:bg-blue-500"
                onClick={() => {
                  if (registro.idosoId) {
                    setIdosoSelecionado({ _id: registro.idosoId._id, nome: registro.idosoId.nome });
                    setDataPesquisa(""); 
                  }
                }}
              />
            </div>
          ))}

          {mensagem && (
            <p className="text-center text-sm mt-2 text-gray-700">{mensagem}</p>
          )}

          {registrosSaude.length === 0 && !mensagem && (
            <p className="text-gray-500 text-center py-4">
              Nenhum registro de saúde cadastrado.
            </p>
          )}
        </div>
      </div>

      {idosoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl text-black">
            <h2 className="text-xl font-bold mb-1">
              Histórico de Registro
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Idoso: <span className="font-semibold text-black">{idosoSelecionado.nome}</span>
            </p>

            <div className="mb-4 flex flex-col gap-1">
              <label htmlFor="pesquisaData" className="text-xs font-semibold text-gray-700">
                Buscar por data específica:
              </label>
              <div className="flex gap-2 items-center">
                <input
                  id="pesquisaData"
                  type="date"
                  className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dataPesquisa}
                  onChange={(e) => setDataPesquisa(e.target.value)}
                />
                {dataPesquisa && (
                  <Botao
                    texto="Limpar"
                    onClick={() => setDataPesquisa("")}
                    className="bg-red-100 text-red-600 hover:bg-red-200 text-xs font-semibold py-2 px-3 rounded-lg border border-red-300"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
              {datasDoIdosoSelecionado.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum registro encontrado para está data.
                </p>
              ) : (
                datasDoIdosoSelecionado.map((reg) => (
                  <div 
                    key={reg._id} 
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200"
                  >
                    <span className="text-gray-800 font-medium">
                      📅 {reg.dataConsulta ? new Date(reg.dataConsulta).toLocaleDateString("pt-BR") : "Data indisponível"}
                    </span>
                    
                    <Botao
                      texto="Detalhes do registro"
                      onClick={() => navegacao(`/dados/saude/${reg._id}`)}
                      className="bg-blue-600 text-white hover:bg-blue-700 text-xs py-1 px-3 rounded-md font-medium shadow-sm transition"
                    />
                  </div>
                ))
              )}
            </div>

            <Botao
              onClick={() => setIdosoSelecionado(null)}
              texto="Fechar"
              className="mt-6 w-full bg-red-500 text-white font-bold py-2 rounded-xl hover:bg-red-600 transition"
            />
          </div>
        </div>
      )}

    </div>
  );
}