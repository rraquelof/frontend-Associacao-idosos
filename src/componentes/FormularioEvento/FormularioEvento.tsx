import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Botao from "../botao/Botao";
import Input from "../input/Input";
import Label from "../label/Label";
import Textarea from "../Textarea/Textarea";
import Mensagem from "../mensagem/Mensagem";
import ErroCampoObrigatorio from "../erroCampoObrigatorio/ErroCampoObrigatorio";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

interface EventoFormProps {
  eventoId?: string;
}

function SelecionadorDeLocal({ formDados, setFormDados }: any) {
  useMapEvents({
    click(e) {
      setFormDados({
        ...formDados,
        latitude: e.latlng.lat.toString(),
        longitude: e.latlng.lng.toString(),
      });
    },
  });

  const position = formDados.latitude && formDados.longitude
    ? [Number(formDados.latitude), Number(formDados.longitude)] as [number, number]
    : null;

  return position === null ? null : (
    <Marker position={position} icon={iconeMarcador} />
  );
}

export default function FormularioEvento({ eventoId }: EventoFormProps) {
  const navegacao = useNavigate();
  const metodo = eventoId ? "PUT" : "POST";
  const textoBotao = eventoId ? "Salvar Alterações" : "Criar Evento";

  const [formDados, setFormDados] = useState({
    nome: "",
    descricao: "",
    data: "",
    latitude: "",
    longitude: "",
  });

  const [imagemAtual, setImagemAtual] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "informacao">("informacao");
  const [enviarVazio, setEnviarVazio] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const formatarDataParaInputLocal = (dataBanco: string) => {
    if (!dataBanco) return "";
    const data = new Date(dataBanco);
    const compensacaoFuso = data.getTimezoneOffset() * 60000;
    const dataLocal = new Date(data.getTime() - compensacaoFuso);
    return dataLocal.toISOString().slice(0, 16);
  };

  const obterUrlImagem = (caminhoImagem: string) => {
    if (!caminhoImagem) return "";
    if (caminhoImagem.startsWith("http")) return caminhoImagem;
    const urlServidor = "https://api-associacao-idosos.onrender.com";
    return caminhoImagem.startsWith("/") ? `${urlServidor}${caminhoImagem}` : `${urlServidor}/${caminhoImagem}`;
  };

  useEffect(() => {
    if (eventoId) {
      const buscarDadosDoEvento = async () => {
        setCarregando(true);
        try {
          const token = localStorage.getItem("token");
          const resposta = await fetch(`${API_URL}/eventos/${eventoId}`, {
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
          });

          if (resposta.ok) {
            const dados = await resposta.json();
            setFormDados({
              nome: dados.nome || "",
              descricao: dados.descricao || "",
              data: dados.data ? formatarDataParaInputLocal(dados.data) : "",
              latitude: dados.local?.coordinates[1]?.toString() || "",
              longitude: dados.local?.coordinates[0]?.toString() || "",
            });
            setImagemAtual(dados.imagem || "");
          } else {
            setMensagem("Erro ao carregar os dados do evento.");
            setTipoMensagem("erro");
          }
        } catch (error) {
          console.error("Erro ao buscar evento:", error);
          setMensagem("Erro de conexão ao buscar o evento.");
          setTipoMensagem("erro");
        } finally {
          setCarregando(false);
        }
      };

      buscarDadosDoEvento();
    }
  }, [eventoId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormDados({
      ...formDados,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagemFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviarVazio(true);
    
    if (!formDados.latitude || !formDados.longitude) {
      setMensagem("Por favor, clique no mapa para selecionar o local do evento.");
      setTipoMensagem("erro");
      return;
    }

    setMensagem("Salvando evento...");
    setTipoMensagem("informacao");

    const token = localStorage.getItem("token");
    const dataFormatadaParaAPI = new Date(formDados.data).toISOString();

    try {
      const formData = new FormData();
      formData.append("nome", formDados.nome);
      formData.append("descricao", formDados.descricao);
      formData.append("data", dataFormatadaParaAPI);
      
      const localObj = {
        type: "Point",
        coordinates: [Number(formDados.longitude), Number(formDados.latitude)]
      };
      formData.append("local", JSON.stringify(localObj));

      if (imagemFile) {
        formData.append("imagem", imagemFile);
      }

      const url = metodo === "POST" ? `${API_URL}/cadastroEvento` : `${API_URL}/eventos/${eventoId}`;
      
      const resposta = await fetch(url, {
        method: metodo,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem(dados.message || `${textoBotao} realizado com sucesso!`);
        setTipoMensagem("sucesso");
        setTimeout(() => navegacao("/eventos"), 1000);
      } else {
        setMensagem(dados.message || `Erro ao ${textoBotao.toLowerCase()}.`);
        setTipoMensagem("erro");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }
  };

  const centroInicial: [number, number] = formDados.latitude && formDados.longitude 
    ? [Number(formDados.latitude), Number(formDados.longitude)] 
    : [-6.8894, -38.5586];

  return (
    <div className="w-screen min-h-screen bg-gray-200 box-border flex flex-col items-center">
      <div className="text-black p-6 w-full flex items-center relative mt-10">
        <Botao className="absolute left-6 top-5" onClick={() => navegacao("/eventos")}>
          <ChevronLeftIcon />
        </Botao>
        <h1 className="text-3xl font-bold text-center w-full">
          {metodo === "POST" ? "Novo Evento" : "Editar Evento"}
        </h1>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl mx-auto mt-4 p-8 overflow-hidden">
        {carregando ? (
          <div className="flex justify-center items-center h-40 text-gray-500 font-medium">
            Carregando informações do evento...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
            
            <div className="flex flex-col border-b border-gray-100 pb-6 mb-2">
              <Label htmlFor="imagem" texto="Capa do Evento (Opcional)" />
              
              {imagemAtual && !imagemFile && (
                <div className="mt-2 mb-4">
                  <p className="text-sm text-gray-500 mb-2">Imagem atual:</p>
                  <img 
                    src={obterUrlImagem(imagemAtual)} 
                    alt="Capa do evento" 
                    className="w-48 h-32 object-cover rounded-xl border border-gray-300 shadow-sm"
                  />
                </div>
              )}

              <input
                type="file"
                id="imagem"
                name="imagem"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer file:cursor-pointer"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="nome" texto="Nome do Evento" />
              <ErroCampoObrigatorio valor={formDados.nome} obrigatorio envioVazio={enviarVazio}>
                <Input type="text" id="nome" name="nome" value={formDados.nome} onChange={handleChange} required />
              </ErroCampoObrigatorio>
            </div>

            <div className="flex flex-col">
              <Label htmlFor="data" texto="Data e Hora" />
              <ErroCampoObrigatorio valor={formDados.data} obrigatorio envioVazio={enviarVazio}>
                <Input type="datetime-local" id="data" name="data" value={formDados.data} onChange={handleChange} required />
              </ErroCampoObrigatorio>
            </div>

            <div className="flex flex-col">
              <Label htmlFor="descricao" texto="Descrição" />
              <Textarea id="descricao" name="descricao" value={formDados.descricao} onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="mapa" texto="Localização (Clique no mapa para marcar)" />
              <div className="w-full h-72 bg-gray-100 rounded-xl overflow-hidden border border-gray-300 relative z-0 mt-2">
                <MapContainer center={centroInicial} zoom={14} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <SelecionadorDeLocal formDados={formDados} setFormDados={setFormDados} />
                </MapContainer>
              </div>
              {!formDados.latitude && enviarVazio && (
                <p className="text-red-500 text-sm mt-1">Obrigatório selecionar um local no mapa.</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Botao tipo="submit" texto={textoBotao} className="bg-green-600 text-white hover:bg-green-700" />
            </div>

            {mensagem && (
              <Mensagem texto={mensagem} tipo={tipoMensagem} onClose={() => setMensagem("")} />
            )}
          </form>
        )}
      </div>
    </div>
  );
}