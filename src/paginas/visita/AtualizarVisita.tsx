import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormularioVisita from "../../componentes/formularioVisita/FormularioVisita";
import type Visita from "../../modelo/Visita";
import Layout from "../../componentes/layout/Layout";

export default function AtualizarVisita() {
  const { id } = useParams();
  const [visita, setVisita] = useState<Partial<Visita> | null>(null);
  const [carregando, setCarregando] = useState(true);

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
        }
      } catch (error) {
        console.error("Erro ao buscar visita:", error);
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
      <Layout>
      <div className="w-full flex items-center justify-center py-24">
        <p className="text-gray-700 font-medium">Carregando visita...</p>
      </div>
      </Layout>
    );
  }

  return (
    <FormularioVisita
      endpoint={`https://api-associacao-idosos.onrender.com/api/visita/${id}`}
      metodo="PUT"
      textoBotao="Atualizar Visita"
      tituloFormulario="Editar Visita"
      dadosIniciais={visita || undefined}
    />
  );
}
