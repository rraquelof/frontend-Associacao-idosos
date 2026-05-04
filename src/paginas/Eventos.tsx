import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Botao from "../componentes/botao/Botao";
import { ChevronLeftIcon, Calendar as CalendarIcon, List as ListIcon, Trash2, Edit, X } from "lucide-react";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const API_URL = "https://api-associacao-idosos.onrender.com/api";

export default function Eventos() {
  const navegacao = useNavigate();
  const [eventos, setEventos] = useState<any[]>([]);
  const [modoVisualizacao, setModoVisualizacao] = useState<"lista" | "calendario">("lista");
  
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);

  const carregarEventos = async () => {
    try {
      const token = localStorage.getItem("token");
      const resposta = await fetch(`${API_URL}/eventos`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      if (resposta.ok) {
        const dados = await resposta.json();
        setEventos(dados);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  };

  const deletarEvento = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch(`${API_URL}/eventos/${id}`, {
          method: "DELETE",
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        });
        if (resposta.ok) {
          carregarEventos(); 
          setDataSelecionada(null); 
        } else {
          alert("Erro ao deletar evento. Verifique se você tem permissão.");
        }
      } catch (error) {
        console.error("Erro ao deletar evento:", error);
      }
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

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

  const pegarEventosDoDia = (date: Date) => {
    return eventos.filter((evento) => {
      const dataEvento = new Date(evento.data);
      return (
        dataEvento.getDate() === date.getDate() &&
        dataEvento.getMonth() === date.getMonth() &&
        dataEvento.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderizarConteudoDoDia = ({ date, view }: any) => {
    if (view === 'month') {
      const eventosDoDia = pegarEventosDoDia(date);
      if (eventosDoDia.length > 0) {
        return (
          <div className="flex flex-col gap-1 mt-1 w-full px-1">
            {eventosDoDia.map((ev) => (
              <div 
                key={ev._id} 
                className="text-[10px] sm:text-xs leading-tight bg-purple-200 text-purple-900 rounded p-1 truncate w-full shadow-sm font-medium" 
                title={ev.nome}
              >
                {formatarHoraBR(ev.data)} - {ev.nome}
              </div>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="w-screen min-h-screen bg-gray-200 flex flex-col items-center p-8 relative">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 mt-10">
        <div className="flex items-center gap-4">
          <Botao onClick={() => navegacao("/")} className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100">
            <ChevronLeftIcon />
          </Botao>
          <h1 className="text-3xl font-bold text-black">Gerenciamento de Eventos</h1>
        </div>
        <Botao 
          onClick={() => navegacao("/eventos/novo")}
          texto="+ Novo Evento"
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
      </div>

      <div className="w-full max-w-5xl flex gap-4 mb-6">
        <button
          onClick={() => setModoVisualizacao("lista")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 ${
            modoVisualizacao === "lista" 
              ? "bg-purple-600 text-white shadow-md border-transparent" 
              : "bg-white text-gray-700 border border-gray-300 hover:bg-purple-50"
          }`}
        >
          <ListIcon size={20} /> Lista
        </button>
        <button
          onClick={() => setModoVisualizacao("calendario")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 ${
            modoVisualizacao === "calendario" 
              ? "bg-purple-600 text-white shadow-md border-transparent" 
              : "bg-white text-gray-700 border border-gray-300 hover:bg-purple-50"
          }`}
        >
          <CalendarIcon size={20} /> Calendário
        </button>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 min-h-[60vh]">
        
        {/* LISTA */}
        {modoVisualizacao === "lista" && (
          <div className="flex flex-col gap-4">
            {eventos.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">Nenhum evento cadastrado ainda.</p>
            ) : (
              eventos.map((evento) => (
                <div 
                  key={evento._id} 
                  onClick={() => navegacao(`/eventos/detalhes/${evento._id}`)}
                  className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:bg-purple-50 transition-colors cursor-pointer shadow-sm"
                >
                  <div className="flex gap-4 items-center">
                    {evento.imagem && (
                      <img src={evento.imagem} alt={evento.nome} className="w-16 h-16 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-black">{evento.nome}</h3>
                      <p className="text-gray-600 text-sm font-medium">
                        {formatarDataBR(evento.data)} às {formatarHoraBR(evento.data)}
                      </p>
                      <p className="text-gray-500 mt-1 line-clamp-1">{evento.descricao}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navegacao(`/eventos/editar/${evento._id}`);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deletarEvento(evento._id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CALENDÁRIO */}
        {modoVisualizacao === "calendario" && (
          <div className="flex flex-col w-full pb-10">
            <div className="w-full bg-white rounded-2xl border border-gray-200 p-2 sm:p-6">
              
              <Calendar 
                className="!w-full !max-w-none border-none font-sans text-gray-800 [&_abbr]:no-underline"
                
                tileClassName={({ view }) => 
                  view === 'month' 
                    ? 'min-h-[100px] sm:min-h-[120px] flex flex-col justify-start items-center p-1 border border-gray-100 hover:bg-purple-50 transition-all' 
                    : null
                }
                tileContent={renderizarConteudoDoDia}
                onClickDay={(value) => setDataSelecionada(value)} 
              />
              
            </div>
          </div>
        )}
      </div>

      {dataSelecionada && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
          onClick={() => setDataSelecionada(null)} 
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Eventos do dia</h3>
                <p className="text-sm text-gray-500">{dataSelecionada.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
              <button 
                onClick={() => setDataSelecionada(null)} 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2">
              {pegarEventosDoDia(dataSelecionada).length > 0 ? (
                pegarEventosDoDia(dataSelecionada).map((ev) => (
                  <div 
                    key={ev._id} 
                    className="border border-purple-100 bg-purple-50 p-4 rounded-xl cursor-pointer hover:bg-purple-100 transition-colors shadow-sm flex justify-between items-center"
                    onClick={() => navegacao(`/eventos/detalhes/${ev._id}`)}
                  >
                    <div>
                      <p className="font-bold text-purple-900 text-lg">{ev.nome}</p>
                      <p className="text-sm font-medium text-purple-700">{formatarHoraBR(ev.data)}</p>
                    </div>
                    <ChevronLeftIcon className="rotate-180 text-purple-400" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Não há eventos marcados para este dia.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}