import { useEffect, useState } from "react";
import type Idoso from "../modelo/Idoso";
import { useNavigate } from "react-router-dom";
import Botao from "../componentes/Botao/Botao";
import { ChevronLeftIcon } from "lucide-react";

export default function ListaIdosos() {
  const [idosos, setIdosos] = useState<Idoso[]>([]);
  const [mensagem, setMensagem] = useState("");
  const navegacao = useNavigate();

  useEffect(() => {
  const carregarIdosos = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN ENCONTRADO:", token);

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
    <div className="w-screen min-h-screen bg-gray-200 box-border flex flex-col items-center">
      <div className="text-black p-6 w-full flex items-center relative">
        <Botao
          className="absolute left-0 top-3"
          onClick={() => navegacao("/menu")}
        >
          <ChevronLeftIcon />
        </Botao>
        <h1 className="text-3xl font-bold text-center w-full">
          Idosos
        </h1>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        <div className="h-[60vh] overflow-y-auto">
          {idosos.map((idoso) => (
            <div
              key={idoso.id}
              className="flex justify-between text-black items-center border-b py-2 px-2"
            >
              <span>{idoso.nome}</span>
              
                <Botao
                  texto="Ver dados"
                  className="bg-gray-400 text-white hover:bg-gray-500"
                  onClick={() => navegacao(`/dados/idoso/${idoso.id}`)}
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

      <div className="mt-8">
        <Botao
          texto="Cadastrar novo idoso"
          variant="gray"
          onClick={() => navegacao(`/cadastro/idoso/`)}
        />
      </div>
    </div>
  );
}
