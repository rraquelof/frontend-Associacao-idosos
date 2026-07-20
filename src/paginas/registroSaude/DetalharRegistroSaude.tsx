import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampoDetalhes from "../../componentes/campo-detalhes-idoso/CampoDetalhes";
import type RegistroSaudeIdoso from "../../modelo/RegistroSaudeIdoso";
import Botao from "../../componentes/botao/Botao";
import { ChevronLeftIcon } from "lucide-react";
import Layout from "../../componentes/layout/Layout";

export default function DetalharRegistroSaude() {
    const { id } = useParams();
    const [registroSaude, setRegistroSaude] = useState<RegistroSaudeIdoso | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const navegacao = useNavigate();

    useEffect(() => {
        const buscarRegistro = async () => {
            try {
                const token = localStorage.getItem("token");
                const resposta = await fetch(
                    `https://api-associacao-idosos.onrender.com/api/saudeIdoso/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                    }
                );

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar dados do registro de saúde");
                }

                const dados = await resposta.json();
                setRegistroSaude({ ...dados, id: dados.id ?? dados._id });
            } catch (err) {
                setErro((err as Error).message);
            } finally {
                setCarregando(false);
            }
        };

        if (id) buscarRegistro();
    }, [id]);

    if (carregando) {
        return <Layout><div className="flex justify-center items-center py-24 text-blue-500 font-medium">Carregando detalhes...</div></Layout>;
    }

    if (erro) {
        return <Layout><div className="flex justify-center items-center py-24 text-red-500 font-bold">Erro: {erro}</div></Layout>;
    }

    if (!registroSaude) {
        return <Layout><div className="flex justify-center items-center py-24 text-red-500 font-bold">Registro não encontrado.</div></Layout>;
    }

    return (
        <Layout>
        <div className="w-full box-border flex flex-col items-center py-6 sm:py-8">
            <div className="text-black p-4 sm:p-6 w-full max-w-4xl flex items-center relative mt-4">
                <Botao
                    className="absolute left-0 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
                    onClick={() => navegacao("/lista/registro/saude")}
                >
                    <ChevronLeftIcon />
                </Botao>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 text-center w-full">
                    Registro de Saúde
                </h1>
            </div>
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto flex flex-col mt-8 sm:mt-16 mx-2 sm:mx-0">
                <div className="p-4 sm:p-8 flex flex-wrap gap-6 content-start">
                    <CampoDetalhes label="Nome do idoso" valor={registroSaude.idosoId?.nome || "Não informado"} />
                    <CampoDetalhes label="Enfermeiro responsável" valor={registroSaude.usuarioId?.nome || "Não informado"} />
                    <CampoDetalhes
                        label="Data do registro"
                        valor={registroSaude.dataConsulta ? new Date(registroSaude.dataConsulta).toLocaleDateString("pt-BR") : "Não informada"}
                    />
                    <CampoDetalhes label="Altura (cm)" valor={registroSaude.altura} />
                    <CampoDetalhes label="Peso (kg)" valor={registroSaude.peso} />
                    <CampoDetalhes label="Pressão (mmHg)" valor={registroSaude.pressao} />
                    <CampoDetalhes label="Glicemia (mg/dL)" valor={registroSaude.glicemia} />
                    <CampoDetalhes label="Estado Nutricional" valor={registroSaude.estadoNutricional} />

                    <CampoDetalhes
                        label="Alergias"
                        valor={Array.isArray(registroSaude.alergias) ? registroSaude.alergias.join(", ") : registroSaude.alergias || "Nenhuma"}
                    />
                    <CampoDetalhes
                        label="Doenças Crônicas"
                        valor={Array.isArray(registroSaude.doencasCronicas) ? registroSaude.doencasCronicas.join(", ") : registroSaude.doencasCronicas || "Nenhuma"}
                    />
                </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 w-full max-w-4xl px-4">
                <Botao
                    texto="Ver dados do idoso"
                    onClick={() => navegacao(`/dados/idoso/${registroSaude.idosoId?._id}`)}
                    className="px-8 py-3 bg-emerald-600 text-gray-800 hover:bg-emerald-700 font-semibold shadow-md rounded-xl transition"
                />
                <Botao
                    texto="Atualizar"
                    variant="update"
                    onClick={() => navegacao(`/atualizar/registro/saude/${registroSaude._id}`)}
                    className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md rounded-xl transition"
                />
                <Botao
                    texto="Deletar"
                    variant="delete"
                    onClick={() => navegacao(`/deletar/registro/saude/${registroSaude._id}`)}
                    className="px-8 py-3 bg-red-600 text-white hover:bg-red-700 font-semibold shadow-md rounded-xl transition"
                />
            </div>
        </div>
        </Layout>
    );
}