import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../input/Input";
import Botao from "../botao/Botao";
import Select from "../select/Select";
import Label from "../label/Label";
import Option from "../option/Option";
import Mensagem from "../mensagem/Mensagem";
import ErroCampoObrigatorio from "../erroCampoObrigatorio/ErroCampoObrigatorio";
import { ChevronLeftIcon } from "lucide-react";
import type Visita from "../../modelo/Visita";

interface IdosoSimplificado {
  _id: string;
  nome: string;
}

interface FormularioProps {
  endpoint: string;
  metodo?: "POST" | "PUT";
  textoBotao: string;
  tituloFormulario: string;
  dadosIniciais?: Partial<Visita>;
}

export default function FormularioVisita({
  endpoint,
  metodo = "POST",
  textoBotao,
  tituloFormulario,
  dadosIniciais,
}: FormularioProps) {
  const navegacao = useNavigate();

  const [listaIdosos, setListaIdosos] = useState<IdosoSimplificado[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<
    "sucesso" | "erro" | "informacao"
  >("informacao");
  const [enviarVazio, setEnviarVazio] = useState(false);

  const [formData, setFormData] = useState({
    idosoId: "",
    dataVisita: "",
    nome: "",
  });

  useEffect(() => {
    const carregarListaIdosos = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

        const respIdosos = await fetch(
          "https://api-associacao-idosos.onrender.com/api/idosos",
          { headers },
        );
        if (respIdosos.ok) {
          const dados = await respIdosos.json();
          setListaIdosos(
            dados.map((i: any) => ({ _id: i._id || i.id, nome: i.nome })),
          );
        }
      } catch {
        setMensagem("Erro ao carregar a lista de idosos.");
        setTipoMensagem("erro");
      }
    };

    carregarListaIdosos();
  }, []);

  useEffect(() => {
    if (dadosIniciais) {
      setFormData({
        idosoId: "",
        dataVisita: dadosIniciais.data
          ? formatarDataParaInputLocal(dadosIniciais.data)
          : "",
        nome: dadosIniciais.nome || "",
      });
    }
  }, [dadosIniciais]);

  useEffect(() => {
    if (formData.idosoId) {
      const idoso = listaIdosos.find((i) => i._id === formData.idosoId);
      if (idoso) {
        setFormData((prev) => ({ ...prev, nome: idoso.nome }));
      }
    }
  }, [formData.idosoId, listaIdosos]);

  const formatarDataParaInputLocal = (dataBanco: string) => {
    if (!dataBanco) return "";
    const data = new Date(dataBanco);
    const compensacaoFuso = data.getTimezoneOffset() * 60000;
    const dataLocal = new Date(data.getTime() - compensacaoFuso);
    return dataLocal.toISOString().slice(0, 16);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.idosoId || !formData.dataVisita) {
      setEnviarVazio(true);
      setMensagem("Por favor, preencha todos os campos obrigatórios.");
      setTipoMensagem("erro");
      return;
    }

    setEnviarVazio(false);
    setMensagem("Enviando dados, por favor aguarde...");
    setTipoMensagem("informacao");

    try {
      const token = localStorage.getItem("token");

      const resposta = await fetch(endpoint, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          idosoId: formData.idosoId,
          data: new Date(formData.dataVisita).toISOString(),
          nome: formData.nome,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error(
          "Erro do servidor completo:",
          JSON.stringify(dados, null, 2),
        );
        setMensagem(
          dados.message || "Erro ao processar a requisição de visita.",
        );
        setTipoMensagem("erro");
        return;
      }

      setMensagem(`Visita salva com sucesso!`);
      setTipoMensagem("sucesso");

      setTimeout(() => {
        navegacao("/lista/visitas");
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar visita:", error);
      setMensagem("Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-200 box-border flex flex-col items-center py-8">
      <div className="w-full max-w-3xl flex items-center justify-between mb-6 mt-4 px-4 relative">
        <div className="flex items-center gap-4 w-full">
          <Botao
            onClick={() => navegacao("/lista/visitas")}
            className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100 absolute left-0"
          >
            <ChevronLeftIcon />
          </Botao>
          <h1 className="text-3xl font-bold text-black text-center w-full">
            {tituloFormulario}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl mx-auto p-8 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 max-h-[65vh] overflow-y-auto pr-2"
        >
          <h3 className="text-black font-bold text-xl uppercase tracking-wider">
            Dados da Visita
          </h3>

          <div className="flex flex-col">
            <Label htmlFor="idosoId" texto="Idoso a Visitar *" />
            <ErroCampoObrigatorio
              valor={formData.idosoId}
              obrigatorio
              envioVazio={enviarVazio}
            >
              <Select
                id="idosoId"
                name="idosoId"
                value={formData.idosoId}
                onChange={handleChange}
                required
              >
                <Option value="" texto="Selecione o Idoso" />
                {listaIdosos.map((i) => (
                  <Option key={i._id} value={i._id} texto={i.nome} />
                ))}
              </Select>
            </ErroCampoObrigatorio>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="dataVisita" texto="Data e Hora da Visita *" />
            <ErroCampoObrigatorio
              valor={formData.dataVisita}
              obrigatorio
              envioVazio={enviarVazio}
            >
              <Input
                type="datetime-local"
                id="dataVisita"
                name="dataVisita"
                value={formData.dataVisita}
                onChange={handleChange}
                required
              />
            </ErroCampoObrigatorio>
          </div>

          <div className="flex justify-end pt-4">
            <Botao
              tipo="submit"
              texto={textoBotao}
              className="bg-green-600 text-white hover:bg-green-700 ml-auto"
            />
          </div>

          {mensagem && (
            <Mensagem
              texto={mensagem}
              tipo={tipoMensagem}
              onClose={() => setMensagem("")}
            />
          )}
        </form>
      </div>
    </div>
  );
}
