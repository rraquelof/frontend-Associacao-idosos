import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../componentes/input/Input";
import Botao from "../componentes/botao/Botao";
import Select from "../componentes/select/Select";
import Label from "../componentes/label/Label";
import Option from "../componentes/option/Option";
import Mensagem from "../componentes/mensagem/Mensagem";
import ErroCampoObrigatorio from "../componentes/erroCampoObrigatorio/ErroCampoObrigatorio";
import { ChevronLeftIcon } from "lucide-react";

interface IdosoSimplificado {
  _id: string;
  nome: string;
}

interface EnfermeiroSimplificado {
  _id: string;
  nome: string;
}

export default function CadastroSaudeIdoso() {
  const navegacao = useNavigate();

  const [listaIdosos, setListaIdosos] = useState<IdosoSimplificado[]>([]);
  const [listaEnfermeiros, setListaEnfermeiros] = useState<EnfermeiroSimplificado[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "informacao">("informacao");
  const [enviarVazio, setEnviarVazio] = useState(false);

  const [formData, setFormData] = useState({
    idosoId: "",
    usuarioId: "", 
    altura: "",
    peso: "",
    pressao: "",
    glicemia: "",
    estadoNutricional: "",
    alergias: "",
    doencasCronicas: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

        const respIdosos = await fetch("https://api-associacao-idosos.onrender.com/api/idosos", { headers });
        if (respIdosos.ok) {
          const dados = await respIdosos.json();
          setListaIdosos(dados.map((i: any) => ({ _id: i._id || i.id, nome: i.nome })));
        }

        const respUsuarios = await fetch("https://api-associacao-idosos.onrender.com/api/usuarios", { headers });
        if (respUsuarios.ok) {
          const dadosUsuarios = await respUsuarios.json();
     
          const apenasEnfermeiros = dadosUsuarios.filter(
            (usuario: any) => usuario.tipo === "enfermeiro"
          );

          setListaEnfermeiros(apenasEnfermeiros.map((u: any) => ({ _id: u._id || u.id, nome: u.nome })));
        }
      } catch {
        setMensagem("Erro ao carregar os nomes dos enfermeiros ou idosos.");
        setTipoMensagem("erro");
      }
    };

    carregarDados();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviarVazio(false);
    setMensagem("Enviando dados, por favor aguarde...");
    setTipoMensagem("informacao");

    try {
      const token = localStorage.getItem("token");
      
      const resposta = await fetch(
        "https://api-associacao-idosos.onrender.com/api/cadastrarConsulta",
        {
          method: "POST",
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
            doencasCronicas: formData.doencasCronicas || ""
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.message || "Erro ao salvar o registro de saúde.");
        setTipoMensagem("erro");
        return;
      }

      setMensagem("Acompanhamento de saúde registrado com sucesso!");
      setTipoMensagem("sucesso");

      setTimeout(() => {
        navegacao("/saude");
      }, 2000);

    } catch {
      setMensagem("Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-200 box-border flex flex-col items-center">
      <div className="w-full max-w-3xl flex items-center justify-between mb-50 mt-10">
        <div className="flex items-center gap-4">
          <Botao onClick={() => navegacao("/saude")} className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100">
            <ChevronLeftIcon />
          </Botao>
          <h1 className="text-3xl font-bold text-black text-center">Registro de Saúde do Idoso</h1>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl mx-auto mt-4 p-8 fixed top-24 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 h-[70vh] overflow-y-auto pr-2"
        >
          <h3 className="text-black font-bold text-xl">
            DADOS DE SAÚDE
          </h3>

          <div className="flex gap-6">
            <div className="flex flex-col w-1/2">
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

            <div className="flex flex-col w-1/2">
              <Label htmlFor="usuarioId" texto="Enfermeiro Responsável *" />
              <ErroCampoObrigatorio valor={formData.usuarioId} obrigatorio envioVazio={enviarVazio}>
                <Select
                  id="usuarioId"
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={handleChange}
                  required
                >
                  <Option value="" texto="Selecione o Enfermeiro" />
                  {listaEnfermeiros.map(u => (
                    <Option key={u._id} value={u._id} texto={u.nome} />
                  ))}
                </Select>
              </ErroCampoObrigatorio>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col w-1/2">
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

            <div className="flex flex-col w-1/2">
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

          <div className="flex gap-6">
            <div className="flex flex-col w-1/2">
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

            <div className="flex flex-col w-1/2">
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
              texto="Salvar Registro"
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