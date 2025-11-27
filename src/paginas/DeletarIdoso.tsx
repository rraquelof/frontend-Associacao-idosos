import { useNavigate, useParams } from "react-router-dom";
import Botao from "../componentes/Botao/Botao";
import Mensagem from "../componentes/mensagem/Mensagem";
import { useState } from "react";

export default function DeletarIdoso() {
  const { id } = useParams<{ id: string }>();
  const navegacao = useNavigate();

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<
    "sucesso" | "erro" | "informacao"
  >("informacao");

  async function deletarIdoso(id: string) {
    const token = localStorage.getItem("token");

    const resposta = await fetch(
      `https://api-associacao-idosos.onrender.com/api/idoso/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!resposta.ok) {
      const dados = await resposta.json();
      setMensagem(dados.message || "Erro ao deletar idoso");
      setTipoMensagem("erro");
    }
  }

  async function confirmarDelete() {
    if (!id) {
      setMensagem("ID inválido.");
      setTipoMensagem("erro");
      return;
    }

    setMensagem("Excluindo idoso...");
    setTipoMensagem("informacao");

    try {
      await deletarIdoso(id);
      setMensagem("Idoso excluído com sucesso!");
      setTipoMensagem("sucesso");

      setTimeout(() => {
        navegacao("/lista/idosos");
      }, 2000);
    } catch {
      setMensagem("Erro ao excluir idoso.");
      setTipoMensagem("erro");
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Confirmar Exclusão
        </h1>
        <p className="text-black mb-6">
          Tem certeza que deseja excluir este idoso?
        </p>

        <div className="flex gap-4 justify-center">
          <Botao
            tipo="button"
            onClick={confirmarDelete}
            texto="Deletar"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          />

          <Botao
            tipo="button"
            onClick={() => navegacao("/lista/idosos")}
            texto="Cancelar"
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
          />
        </div>
      </div>
      {mensagem && (
        <Mensagem
          texto={mensagem}
          tipo={
            tipoMensagem === "sucesso"
              ? "sucesso"
              : tipoMensagem === "erro"
              ? "erro"
              : "informacao"
          }
          onClose={() => setMensagem("")}
        />
      )}
    </div>
  );
}
