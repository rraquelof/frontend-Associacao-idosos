import { useEffect, useState } from "react";
import FormularioIdoso from "../componentes/FormularioIdoso";
import { useParams } from "react-router-dom";

export default function AtualizarIdoso() {
  const { id } = useParams();
  const [dados, setDados] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    async function carregarIdoso() {
      const resposta = await fetch(
        `https://api-associacao-idosos.onrender.com/api/idoso/${id}`
      );
      const data = await resposta.json();
      setDados(data);
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
