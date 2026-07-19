import { useEffect, useState } from "react";
import FormularioIdoso from "../../componentes/formularioIdoso/FormularioIdoso";
import { useParams } from "react-router-dom";
import type Idoso from "../../modelo/Idoso";
import Layout from "../../componentes/layout/Layout";

export default function AtualizarIdoso() {
  const { id } = useParams();
  const [dados, setDados] = useState<Idoso | null>(null);

  useEffect(() => {
    async function carregarIdoso() {
      const token = localStorage.getItem("token");

      const resposta = await fetch(
        `https://api-associacao-idosos.onrender.com/api/idoso/${id}`,
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
      <Layout>
      <p className="flex justify-center items-center py-24 text-blue-500 font-medium">
        Carregando dados...
      </p>
      </Layout>
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
