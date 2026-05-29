import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampoDetalhesIdoso from "../componentes/campo-detalhes-idoso/CampoDetalhes";
import type RegistroSaudeIdoso from "../modelo/Idoso";
import Botao from "../componentes/botao/Botao";
import { ChevronLeftIcon, User } from "lucide-react";
import { formatarDataBR } from "../formatacao/formatarDataBr";

export default function DetalharRegistroSaude() {
    const { id } = useParams();
    const [idoso, setIdoso] = useState<Idoso | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const navegacao = useNavigate();

    useEffect(() => {
        const buscarRegistro = async () => {
            try {
                const token = localStorage.getItem("token");
                const resposta = await fetch(
                    `https://api-associacao-idosos.onrender.com/api/idoso/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                    }
                );

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar dados do idoso");
                }

                const dados = await resposta.json();
                setIdoso({ ...dados, id: dados.id ?? dados._id });
            } catch (err) {
                setErro((err as Error).message);
            } finally {
                setCarregando(false);
            }
        };

        if (id) buscarIdoso();
    }, [id]);

    if (carregando) {
        return <div className="min-h-screen bg-gray-200 flex justify-center items-center font-medium">Carregando detalhes...</div>;
    }

    if (erro) {
        return <div className="min-h-screen bg-gray-200 flex justify-center items-center text-red-500 font-bold">Erro: {erro}</div>;
    }

    if (!idoso) {
        return <div className="min-h-screen bg-gray-200 flex justify-center items-center text-gray-500 font-bold">Idoso não encontrado.</div>;
    }