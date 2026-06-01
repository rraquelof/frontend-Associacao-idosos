import { useEffect, useState } from "react";
import type Idoso from "../modelo/Idoso";
import { useNavigate } from "react-router-dom";
import Botao from "../componentes/botao/Botao";
import { ChevronLeftIcon } from "lucide-react";

export default function ListaIdosos() {
  const [idosos, setIdosos] = useState<Idoso[]>([]);
  const [mensagem, setMensagem] = useState("");
  const navegacao = useNavigate();

  useEffect(() => {
  const carregarIdosos = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const resposta = await fetch(
        "https://api-associacao-idosos.onrender.com/api/idosos",
        {
          method: "GET",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const dados = await resposta.json();
      console.log("RESPOSTA:", dados);

      if (!resposta.ok) {
        setMensagem(dados.message || "Erro ao buscar lista de idosos");
        return;
      }

      const idososFormatados = dados.map((i: any) => ({
        ...i,
        id: i._id,
      }));

      setIdosos(idososFormatados);
    } catch {
      setMensagem("Falha ao carregar lista de idosos");
    }
  };

  carregarIdosos();
}, []);

  return (
   <div className="w-screen min-h-screen bg-gray-200 flex flex-col items-center p-8 relative">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 mt-10">
        <div className="flex items-center gap-4">
          <Botao onClick={() => navegacao("/menu")} className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100">
            <ChevronLeftIcon />
          </Botao>
          <h1 className="text-3xl font-bold text-black">Gerenciamento dos Idosos</h1>
        </div>
        <Botao 
          onClick={() => navegacao("/cadastro/idoso")}
          texto="+ Novo Idoso"
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
        <div className="h-[60vh] overflow-y-auto">
          {idosos.map((idoso) => (
            <div
              key={idoso._id}
              className="flex justify-between text-black items-center border-b py-2 px-2"
            >
              <span>{idoso.nome}</span>
              
                <Botao
                  texto="Ver dados"
                  className="bg-blue-300 text-white hover:bg-blue-500"
                  onClick={() => navegacao(`/dados/idoso/${idoso._id}`)}
                />
            </div>
          ))}

          {mensagem && (
            <p className="text-center text-sm mt-2 text-gray-700">{mensagem}</p>
          )}

          {idosos.length === 0 && !mensagem && (
            <p className="text-gray-500 text-center py-4">
              Nenhum idoso cadastrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
