import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Botao from "../../componentes/botao/Botao";
import { ChevronLeftIcon, CalendarDays, MapPin, Users, Plus, X, Trash2 } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const iconeMarcador = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const API_URL = "https://api-associacao-idosos.onrender.com/api";

export default function DetalharEvento() {
  const { id } = useParams();
  const navegacao = useNavigate();
  const [evento, setEvento] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [todosIdosos, setTodosIdosos] = useState<any[]>([]);
  const [idososSelecionados, setIdososSelecionados] = useState<string[]>([]);
  const [salvandoIdosos, setSalvandoIdosos] = useState(false);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

      const [respostaEvento, respostaIdosos] = await Promise.all([
        fetch(`${API_URL}/eventos/${id}`, { headers }),
        fetch(`${API_URL}/idosos`, { headers })
      ]);

      if (respostaEvento.ok) {
        const dadosEvento = await respostaEvento.json();
        setEvento(dadosEvento);
      }

      if (respostaIdosos.ok) {
        const dadosIdosos = await respostaIdosos.json();
        setTodosIdosos(dadosIdosos);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const abrirModalIdosos = () => {
    setModalAberto(true);
    if (evento?.idosos) {
      const idsJaAdicionados = evento.idosos.map((idoso: any) => 
        typeof idoso === 'string' ? idoso : idoso._id
      );
      setIdososSelecionados(idsJaAdicionados);
    }
  };

  const alternarSelecaoIdoso = (idIdoso: string) => {
    setIdososSelecionados((prev) => 
      prev.includes(idIdoso) 
        ? prev.filter((item) => item !== idIdoso) 
        : [...prev, idIdoso]                  
    );
  };

  const salvarIdososNoEvento = async () => {
    setSalvandoIdosos(true);
    try {
      const token = localStorage.getItem("token");
      const resposta = await fetch(`${API_URL}/eventos/${id}/idosos`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }) 
        },
        body: JSON.stringify({ idosos: idososSelecionados })
      });

      if (resposta.ok) {
        setModalAberto(false);
        carregarDados(); 
      } else {
        alert("Erro ao adicionar idosos. Verifique suas permissões.");
      }
    } catch (error) {
      console.error("Erro ao salvar idosos no evento:", error);
    } finally {
      setSalvandoIdosos(false);
    }
  };

 const removerIdosoDoEvento = async (idIdosoRemover: string) => {
    if (!window.confirm("Deseja realmente remover este idoso do evento?")) return;
    
    setSalvandoIdosos(true);
    try {
      const token = localStorage.getItem("token");
      
      const idsAtuais = evento.idosos.map((i: any) => String(i._id || i));
      const idRemoverLimpo = String(idIdosoRemover);
      const novosIds = idsAtuais.filter((itemId: string) => itemId !== idRemoverLimpo);

      const resposta = await fetch(`${API_URL}/eventos/${id}/idosos`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }) 
        },
        body: JSON.stringify({ idosos: novosIds })
      });

      if (resposta.ok) {
        setEvento((prev: any) => ({
          ...prev,
          idosos: prev.idosos.filter((i: any) => String(i._id || i) !== idRemoverLimpo)
        }));
        setIdososSelecionados(novosIds);
      } else {
        alert("Erro ao remover o idoso.");
      }
    } catch (error) {
      console.error("Erro ao remover idoso:", error);
    } finally {
      setSalvandoIdosos(false);
    }
  };
  
  if (carregando) {
    return <div className="min-h-screen bg-gray-200 flex justify-center items-center font-medium">Carregando detalhes...</div>;
  }

  if (!evento) {
    return <div className="min-h-screen bg-gray-200 flex justify-center items-center text-red-500 font-bold">Evento não encontrado.</div>;
  }

  const obterUrlImagem = (caminhoImagem: string) => {
    if (!caminhoImagem) return "";
    if (caminhoImagem.startsWith("http")) return caminhoImagem;
    const urlServidor = "https://api-associacao-idosos.onrender.com";
    return caminhoImagem.startsWith("/") ? `${urlServidor}${caminhoImagem}` : `${urlServidor}/${caminhoImagem}`;
  };

  const formatarDataBR = (dataIso: string) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); 
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatarHoraBR = (dataIso: string) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  return (
    <div className="w-screen min-h-screen bg-gray-200 flex flex-col items-center p-8 relative">
      <div className="w-full max-w-4xl flex items-center mb-8 mt-10 relative">
        <Botao onClick={() => navegacao("/eventos")} className="absolute left-0 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100">
          <ChevronLeftIcon />
        </Botao>
        <h1 className="text-3xl font-bold text-black text-center w-full">Detalhes do Evento</h1>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {evento.imagem && (
          <div className="w-full h-64 bg-gray-300">
            <img src={obterUrlImagem(evento.imagem)} alt={evento.nome} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{evento.nome}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {evento.descricao ? evento.descricao : "Nenhuma descrição informada."}
            </p>
          </div>

          <div className="border-t border-gray-200 my-2"></div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <CalendarDays size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data e Hora</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatarDataBR(evento.data)} às {formatarHoraBR(evento.data)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 text-gray-700 mt-2">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                <p className="text-md font-bold text-gray-800">Localização do Evento</p>
              </div>
              
              {evento.local?.coordinates ? (
                <div className="w-full h-56 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative z-0">
                  <MapContainer 
                    center={[evento.local.coordinates[1], evento.local.coordinates[0]]} 
                    zoom={15} 
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker 
                      position={[evento.local.coordinates[1], evento.local.coordinates[0]]} 
                      icon={iconeMarcador} 
                    />
                  </MapContainer>
                </div>
              ) : (
                <p className="text-gray-500 italic">Localização não registrada no mapa.</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 text-gray-700 bg-green-50 p-4 rounded-xl border border-green-100">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-green-100 p-2 -ml-2 rounded-lg transition-colors"
                onClick={() => setModalVisualizarAberto(true)}
                title="Clique para ver a lista de participantes"
              >
                <div className="bg-green-200 p-3 rounded-full text-green-700">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Participantes Vinculados</p>
                  <p className="text-xl font-bold text-green-900">
                    {evento.idosos?.length || 0} idoso(s)
                  </p>
                </div>
              </div>
              
              <button 
                onClick={abrirModalIdosos}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                <Plus size={20} /> Adicionar Idosos
              </button>
            </div>

          </div>

          <div className="flex gap-4 mt-6 justify-end border-t border-gray-100 pt-6">
             <Botao 
               texto="Editar Evento" 
               onClick={() => navegacao(`/eventos/editar/${evento._id}`)}
               className="bg-blue-600 text-white hover:bg-blue-700" 
             />
          </div>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 transform transition-all flex flex-col max-h-[80vh]">
            
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Gerenciar Participantes</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
              Selecione os idosos que irão participar deste evento.
            </p>

            <div className="flex flex-col gap-2 overflow-y-auto pr-2 flex-1 mb-4">
              {todosIdosos.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Buscando idosos ou nenhum idoso cadastrado...</p>
              ) : (
                todosIdosos.map((idoso) => (
                  <label 
                    key={idoso._id} 
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                      checked={idososSelecionados.includes(idoso._id)}
                      onChange={() => alternarSelecaoIdoso(idoso._id)}
                    />
                    <span className="text-gray-800 font-medium text-lg">{idoso.nome}</span>
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Botao 
                texto="Cancelar" 
                onClick={() => setModalAberto(false)} 
                variant="gray" 
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              />
              <Botao 
                texto={salvandoIdosos ? "Salvando..." : "Salvar Participantes"} 
                onClick={salvarIdososNoEvento} 
                className="bg-purple-600 text-white hover:bg-purple-700" 
                disabled={salvandoIdosos}
              />
            </div>

          </div>
        </div>
      )}

      {modalVisualizarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all flex flex-col max-h-[80vh]">
            
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Lista de Participantes</h3>
              <button onClick={() => setModalVisualizarAberto(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-2 flex-1 mb-4">
              {evento.idosos && evento.idosos.length > 0 ? (
                evento.idosos.map((item: any, index: number) => {
                  const idosoId = typeof item === 'string' ? item : item._id;
                  const idosoEncontrado = todosIdosos.find(i => i._id === idosoId);
                  const nomeIdoso = idosoEncontrado?.nome || item?.nome || "Idoso Cadastrado";

                  return (
                    <div key={idosoId || index} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-lg">
                          {nomeIdoso !== "Idoso Cadastrado" ? nomeIdoso.charAt(0).toUpperCase() : <Users size={20}/>}
                        </div>
                        <span className="text-gray-800 font-medium text-lg">
                          {nomeIdoso}
                        </span>
                      </div>
                      <button 
                        onClick={() => removerIdosoDoEvento(idosoId)}
                        disabled={salvandoIdosos}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remover participante"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Nenhum idoso está vinculado a este evento no momento.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t pt-4">
              <Botao 
                texto="Fechar" 
                onClick={() => setModalVisualizarAberto(false)} 
                variant="gray" 
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}