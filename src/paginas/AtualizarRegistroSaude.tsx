import { useEffect, useState } from "react";
import FormularioRegistroSaude from "../componentes/formularioRegistroSaude/FormularioRegistroSaude";
import { useParams } from "react-router-dom";
import type RegistroSaudeIdoso from "../modelo/RegistroSaudeIdoso";

export default function AtualizarRegistroSaude() {
  const { id } = useParams();
   const [dados, setDados] = useState<RegistroSaudeIdoso | null>(null);

  useEffect(() => {
    async function carregarRegistroSaude() {
      const token = localStorage.getItem("token");

    const resposta = await fetch(
      `https://api-associacao-idosos.onrender.com/api/saudeIdoso/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
       const dados = await resposta.json();
      setDados({ ...dados, id: dados.id ?? dados._id });
    }
    carregarRegistroSaude();
  }, [id]);

  if (!dados)
    return (
      <p className="min-h-screen bg-gray-200 flex justify-center items-center text-blue-500 font-medium">
        Carregando dados...
      </p>
    );

  return (
    <FormularioRegistroSaude
    tituloFormulario="Atualizar Registro de Saúde do Idoso"
      endpoint={`https://api-associacao-idosos.onrender.com/api/saudeIdoso/${id}`}
      metodo="PUT"
      textoBotao="Atualizar"
      dadosIniciais={dados}
    />
  );
}
