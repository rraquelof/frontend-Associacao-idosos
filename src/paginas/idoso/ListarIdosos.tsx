import { useEffect, useState } from "react";
import type Idoso from "../../modelo/Idoso";
import { useNavigate } from "react-router-dom";
import Botao from "../../componentes/botao/Botao";
import { ChevronLeftIcon, Users, Loader2 } from "lucide-react";
import Layout from "../../componentes/layout/Layout";
import idososIcon from "../../img/idosos.png";
import { useUsuarioLogado } from "../../hooks/useUsuarioLogado";

export default function ListaIdosos() {
  const [idosos, setIdosos] = useState<Idoso[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const navegacao = useNavigate();
  const { usuario: usuarioLogado, carregando: carregandoUsuario } = useUsuarioLogado();

  useEffect(() => {
    const carregarIdosos = async () => {
      try {
        const token = localStorage.getItem("token");

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
      } finally {
        setCarregando(false);
      }
    };

    carregarIdosos();
  }, []);

  // Familiares só podem ver o idoso ao qual a conta deles está vinculada.
  const idososExibidos =
    usuarioLogado?.tipo === "familiar"
      ? idosos.filter((i) => i._id === usuarioLogado.idosoVinculado)
      : idosos;

  const carregandoTudo = carregando || carregandoUsuario;

  return (
    <Layout>
    <div className="w-full flex flex-col items-center p-4 sm:p-8 relative">
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 mb-8 mt-6 sm:mt-10">
        <div className="flex items-center gap-4">
          <Botao onClick={() => navegacao("/menu")} className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100">
            <ChevronLeftIcon />
          </Botao>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src={idososIcon} alt="" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Gerenciamento dos Idosos</h1>
            <p className="text-gray-500 text-sm mt-0.5">Cadastros e informações dos residentes</p>
          </div>
        </div>
        {usuarioLogado?.tipo === "coordenador" && (
          <Botao
            onClick={() => navegacao("/cadastro/idoso")}
            texto="+ Novo Idoso"
            className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 text-white rounded-full shadow-md hover:shadow-lg transition-all font-semibold"
          />
        )}
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <div className={`overflow-y-auto ${idososExibidos.length > 0 ? "h-[60vh]" : ""}`}>
          {carregandoTudo ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <p className="text-gray-500 font-medium">Carregando idosos...</p>
            </div>
          ) : (
            <>
              {idososExibidos.map((idoso) => (
                <div
                  key={idoso._id}
                  className="flex flex-wrap gap-2 justify-between text-black items-center border-b py-2 px-2"
                >
                  <span className="break-words">{idoso.nome}</span>

                  <div className="flex gap-2">
                    <Botao
                      texto="Relatório de saúde"
                      className="bg-rose-50 text-rose-600 hover:bg-rose-100"
                      onClick={() => navegacao(`/relatorio/idoso/${idoso._id}`)}
                    />
                    <Botao
                      texto="Ver dados"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => navegacao(`/dados/idoso/${idoso._id}`)}
                    />
                  </div>
                </div>
              ))}

              {mensagem && (
                <p className="text-center text-sm mt-2 text-gray-700">{mensagem}</p>
              )}

              {idososExibidos.length === 0 && !mensagem && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Nenhum idoso cadastrado</p>
                  <p className="text-gray-400 text-sm -mt-2">
                    {usuarioLogado?.tipo === "coordenador"
                      ? 'Clique em "+ Novo Idoso" para cadastrar o primeiro.'
                      : "Fale com um coordenador para cadastrar um idoso."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
}
