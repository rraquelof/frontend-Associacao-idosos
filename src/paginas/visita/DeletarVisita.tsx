import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Botao from "../../componentes/botao/Botao";
import Mensagem from "../../componentes/mensagem/Mensagem";
import Layout from "../../componentes/layout/Layout";

export default function DeletarVisita() {
  const { id } = useParams<{ id: string }>();
  const navegacao = useNavigate();

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<
    "sucesso" | "erro" | "informacao"
  >("informacao");

  async function deletarVisita(id: string) {
    const token = localStorage.getItem("token");

    const resposta = await fetch(
      `https://api-associacao-idosos.onrender.com/api/visita/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!resposta.ok) {
      const dados = await resposta.json();
      setMensagem(dados.message || "Erro ao deletar visita");
      setTipoMensagem("erro");
    }
  }
  async function confirmarDelete() {
    if (!id) {
      setMensagem("ID inválido.");
      setTipoMensagem("erro");
      return;
    }

    setMensagem("Excluindo visita...");
    setTipoMensagem("informacao");

    try {
      await deletarVisita(id);
      setMensagem("Visita excluída com sucesso!");
      setTipoMensagem("sucesso");

      setTimeout(() => {
        navegacao("/lista/visitas");
      }, 2000);
    } catch {
      setMensagem("Erro ao excluir visita.");
      setTipoMensagem("erro");
    }
  }

  return (
    <Layout>
    <div className="w-full flex flex-col justify-center items-center p-4 py-16">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl text-center w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Confirmar Exclusão
        </h1>
        <p className="text-black mb-6">
          Tem certeza que deseja excluir esta visita?
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
            onClick={() => navegacao("/lista/visitas")}
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
    </Layout>
  );
}
