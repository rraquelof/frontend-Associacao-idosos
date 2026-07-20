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
import type RegistroSaudeIdoso from "../../modelo/RegistroSaudeIdoso";
import Layout from "../layout/Layout";
import { obterIdUsuarioLogado } from "../../utilitarios/authUsuario";

interface IdosoSimplificado {
  _id: string;
  nome: string;
}

interface FormularioProps {
  endpoint: string;
  metodo: "POST" | "PUT";
  textoBotao: string;
  tituloFormulario: string; 
  dadosIniciais?: Partial<RegistroSaudeIdoso>;
}

export default function FormularioRegistroSaude({
  endpoint,
  metodo,
  textoBotao,
  tituloFormulario,
  dadosIniciais,
}: FormularioProps) {
  const navegacao = useNavigate();

  const [listaIdosos, setListaIdosos] = useState<IdosoSimplificado[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "informacao">("informacao");
  const [enviarVazio, setEnviarVazio] = useState(false);

  // Quem registra a consulta é sempre o usuário logado no momento — não faz
  // sentido escolher manualmente. Em edição, o valor original é preservado
  // pelo useEffect de dadosIniciais logo abaixo.
  const [formData, setFormData] = useState({
    idosoId: "",
    usuarioId: obterIdUsuarioLogado() || "",
    altura: "",
    peso: "",
    pressao: "",
    glicemia: "",
    estadoNutricional: "",
    alergias: "",
    doencasCronicas: "",
  });

  useEffect(() => {
    const carregarIdosos = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

        const respIdosos = await fetch("https://api-associacao-idosos.onrender.com/api/idosos", { headers });
        if (respIdosos.ok) {
          const dados = await respIdosos.json();
          setListaIdosos(dados.map((i: any) => ({ _id: i._id || i.id, nome: i.nome })));
        }
      } catch {
        setMensagem("Erro ao carregar os dados auxiliares do servidor.");
        setTipoMensagem("erro");
      }
    };

    carregarIdosos();
  }, []);

  useEffect(() => {
    if (dadosIniciais) {
      setFormData({
        idosoId: typeof dadosIniciais.idosoId === "object" ? dadosIniciais.idosoId?._id || "" : dadosIniciais.idosoId || "",
        usuarioId: typeof dadosIniciais.usuarioId === "object" ? dadosIniciais.usuarioId?._id || "" : dadosIniciais.usuarioId || "",
        altura: dadosIniciais.altura?.toString() || "",
        peso: dadosIniciais.peso?.toString() || "",
        pressao: dadosIniciais.pressao || "",
        glicemia: dadosIniciais.glicemia?.toString() || "",
        estadoNutricional: dadosIniciais.estadoNutricional || "",
        alergias: Array.isArray(dadosIniciais.alergias) ? dadosIniciais.alergias.join(", ") : dadosIniciais.alergias || "",
        doencasCronicas: Array.isArray(dadosIniciais.doencasCronicas) ? dadosIniciais.doencasCronicas.join(", ") : dadosIniciais.doencasCronicas || "",
      });
    }
  }, [dadosIniciais]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
          ...formData,
          altura: Number(formData.altura),
          peso: Number(formData.peso),
          glicemia: Number(formData.glicemia),
          alergias: formData.alergias || "",
          doencasCronicas: formData.doencasCronicas || "",
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.message || "Erro ao processar a requisição de saúde.");
        setTipoMensagem("erro");
        return;
      }

      setMensagem(`Acompanhamento de saúde salvo com sucesso!`);
      setTipoMensagem("sucesso");

      setTimeout(() => {
        navegacao("/lista/registro/saude");
      }, 2000);
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }
  };

  return (
    <Layout>
    <div className="w-full box-border flex flex-col items-center py-6 sm:py-8 px-2 sm:px-0">
      <div className="w-full max-w-3xl flex items-center justify-between mb-6 mt-4 px-4 relative">
        <div className="flex items-center gap-4 w-full">
          <Botao onClick={() => navegacao("/lista/registro/saude")} className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100 absolute left-0">
            <ChevronLeftIcon />
          </Botao>
          <h1 className="text-lg sm:text-3xl font-bold text-gray-800 text-center w-full">
            {tituloFormulario}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl mx-auto p-4 sm:p-8 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 max-h-[65vh] overflow-y-auto pr-2"
        >
          <h3 className="text-blue-800 font-bold text-xl uppercase tracking-wider">
            Dados de Saúde
          </h3>

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col w-full sm:w-1/2">
              <Label htmlFor="idosoId" texto="Idoso *" />
              <ErroCampoObrigatorio valor={formData.idosoId} obrigatorio envioVazio={enviarVazio}>
                <Select
                  id="idosoId"
                  name="idosoId"
                  value={formData.idosoId}
                  onChange={handleChange}
                  required
                >
                  <Option value="" texto="Selecione o Idoso" />
                  {listaIdosos.map(i => (
                    <Option key={i._id} value={i._id} texto={i.nome} />
                  ))}
                </Select>
              </ErroCampoObrigatorio>
            </div>
          </div>

          <p className="text-sm text-gray-400 -mt-2">
            Este registro será associado a você e à data de hoje automaticamente.
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col w-full sm:w-1/2">
              <Label htmlFor="altura" texto="Altura (cm) *" />
              <ErroCampoObrigatorio valor={formData.altura} obrigatorio envioVazio={enviarVazio}>
                <Input
                  type="number"
                  id="altura"
                  name="altura"
                  placeholder="Ex: 165"
                  value={formData.altura}
                  onChange={handleChange}
                  required
                />
              </ErroCampoObrigatorio>
            </div>

            <div className="flex flex-col w-full sm:w-1/2">
              <Label htmlFor="peso" texto="Peso (kg) *" />
              <ErroCampoObrigatorio valor={formData.peso} obrigatorio envioVazio={enviarVazio}>
                <Input
                  type="number"
                  step="0.1"
                  id="peso"
                  name="peso"
                  placeholder="Ex: 72.5"
                  value={formData.peso}
                  onChange={handleChange}
                  required
                />
              </ErroCampoObrigatorio>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col w-full sm:w-1/2">
              <Label htmlFor="pressao" texto="Pressão Arterial (mmHg) *" />
              <ErroCampoObrigatorio valor={formData.pressao} obrigatorio envioVazio={enviarVazio}>
                <Input
                  type="text"
                  id="pressao"
                  name="pressao"
                  placeholder="Ex: 120/80 "
                  value={formData.pressao}
                  onChange={handleChange}
                  required
                />
              </ErroCampoObrigatorio>
            </div>

            <div className="flex flex-col w-full sm:w-1/2">
              <Label htmlFor="glicemia" texto="Glicemia (mg/dL) *" />
              <ErroCampoObrigatorio valor={formData.glicemia} obrigatorio envioVazio={enviarVazio}>
                <Input
                  type="number"
                  id="glicemia"
                  name="glicemia"
                  placeholder="Ex: 80"
                  value={formData.glicemia}
                  onChange={handleChange}
                  required
                />
              </ErroCampoObrigatorio>
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="estadoNutricional" texto="Estado Nutricional *" />
            <ErroCampoObrigatorio valor={formData.estadoNutricional} obrigatorio envioVazio={enviarVazio}>
              <Select
                id="estadoNutricional"
                name="estadoNutricional"
                value={formData.estadoNutricional}
                onChange={handleChange}
                required
              >
                <Option value="" texto="Selecione o estado nutricional" />
                <Option value="normal" texto="Normal" />
                <Option value="baixo peso" texto="Baixo peso" />
                <Option value="sobrepeso" texto="Sobrepeso" />
              </Select>
            </ErroCampoObrigatorio>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="alergias" texto="Alergias (separadas por vírgula)" />
            <Input
              type="text"
              id="alergias"
              name="alergias"
              placeholder="Ex: Dipirona, Penicilina, Látex"
              value={formData.alergias}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="doencasCronicas" texto="Doenças Crônicas (separadas por vírgula)" />
            <Input
              type="text"
              id="doencasCronicas"
              name="doencasCronicas"
              placeholder="Ex: Diabetes, Hipertensão arterial, Alzheimer"
              value={formData.doencasCronicas}
              onChange={handleChange}
            />
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
            />)}
        </form>
      </div>
    </div>
    </Layout>
  );
}