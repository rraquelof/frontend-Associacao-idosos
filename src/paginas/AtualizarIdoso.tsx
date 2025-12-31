import { useEffect, useState } from "react";
import FormularioIdoso from "../componentes/FormularioIdoso";
import { useParams } from "react-router-dom";
import type Idoso from "../modelo/Idoso";

export default function AtualizarIdoso() {
  const { id } = useParams();
   const [dados, setDados] = useState<Idoso | null>(null);

  useEffect(() => {
    async function carregarIdoso() {
      const token = localStorage.getItem("token");

    const resposta = await fetch(
      `https://api-associacao-idosos.onrender.com//api/idoso/${id}`,
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
    carregarIdoso();
  }, [id]);

  if (!dados)
    return (
      <p className="text-center text-sm mt-2 text-gray-700">
        Carregando dados...
      </p>
    );

  return (
    <FormularioIdoso
      endpoint={`https://api-associacao-idosos.onrender.com/api/idoso/${id}`}
      metodo="PUT"
      textoBotao="Atualizar"
      dadosIniciais={dados}
    />
  );
}
