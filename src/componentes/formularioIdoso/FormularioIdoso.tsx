import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Botao from "../botao/Botao";
import Input from "../input/Input";
import Label from "../label/Label";
import Select from "../select/Select";
import Option from "../option/Option";
import Textarea from "../textarea/Textarea";
import Campos from "../campos/Campos";
import type Idoso from "../../modelo/Idoso";
import { formatarData } from "../../formatacao/formatarData";
import Mensagem from "../mensagem/Mensagem";
import { useNavigate } from "react-router-dom";
import ErroCampoObrigatorio from "../erroCampoObrigatorio/ErroCampoObrigatorio";
import { ChevronLeftIcon } from "lucide-react";
import Layout from "../layout/Layout";

// Traduz o "path" que o backend retorna (validação com Zod) para o rótulo
// visível no formulário, para mostrar exatamente qual campo falhou.
const ROTULOS_CAMPOS_IDOSO: Record<string, string> = {
  nome: "Nome",
  cpf: "CPF",
  rg: "RG",
  sus: "Cartão SUS",
  dataNascimento: "Data de nascimento",
  sexo: "Sexo",
  nacionalidade: "Nacionalidade",
  naturalidade: "Naturalidade",
  dataEmissaoRg: "Data de emissão do RG",
  orgaoEmissorRg: "Órgão emissor do RG",
  dataAcolhimento: "Data de acolhimento",
  dataEntradaAcolhimentoAnterior: "Data de entrada no acolhimento anterior",
  dataSaidaAcolhimentoAnterior: "Data de saída do acolhimento anterior",
};

// O Zod (biblioteca de validação do backend) manda mensagens padrão em
// inglês quando o campo nem foi enviado ("Invalid input: expected string,
// received undefined") ou quando o valor não é uma das opções aceitas
// ("Invalid option: expected one of..."). Aqui a gente traduz esses casos
// genéricos; mensagens específicas (como a de formato de CPF/RG/SUS) já
// vêm em português direto do backend e passam sem alteração.
function traduzirMensagemErro(mensagem: string): string {
  if (/expected .* received undefined/i.test(mensagem)) {
    return "Campo obrigatório";
  }
  if (/invalid option/i.test(mensagem)) {
    return "Valor inválido para este campo";
  }
  if (/invalid input/i.test(mensagem)) {
    return "Valor inválido";
  }
  return mensagem;
}

const PAISES = [
  "Brasil",
  "Alemanha",
  "Angola",
  "Argentina",
  "Austrália",
  "Áustria",
  "Bélgica",
  "Bolívia",
  "Cabo Verde",
  "Canadá",
  "Chile",
  "China",
  "Colômbia",
  "Coreia do Sul",
  "Cuba",
  "Dinamarca",
  "Egito",
  "Equador",
  "Espanha",
  "Estados Unidos",
  "França",
  "Guiné-Bissau",
  "Guiana",
  "Holanda",
  "Índia",
  "Inglaterra",
  "Irlanda",
  "Itália",
  "Japão",
  "México",
  "Moçambique",
  "Noruega",
  "Paraguai",
  "Peru",
  "Polônia",
  "Portugal",
  "Reino Unido",
  "Rússia",
  "Suécia",
  "Suíça",
  "Suriname",
  "Uruguai",
  "Venezuela",
  "Outro",
];

function formatarCPF(valor: string) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarRG(valor: string) {
  // RG não tem tamanho fixo (varia de 7 a 9 dígitos entre os estados),
  // então agrupamos de 3 em 3 a partir da direita, como em "4.382.868".
  // O dígito verificador "X" (quando existir) fica separado por "-" no final.
  const limpo = valor.replace(/[^0-9Xx]/g, "").toUpperCase().slice(0, 9);
  const terminaComX = limpo.endsWith("X");
  const somenteDigitos = terminaComX ? limpo.slice(0, -1) : limpo;
  const comPontos = somenteDigitos.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return terminaComX ? `${comPontos}-X` : comPontos;
}

function formatarSUS(valor: string) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 15)
    .replace(/(\d{3})(\d)/, "$1 $2")
    .replace(/(\d{3} \d{4})(\d)/, "$1 $2")
    .replace(/(\d{3} \d{4} \d{4})(\d)/, "$1 $2");
}

interface IdosoFormProps {
  endpoint: string;
  metodo?: "POST" | "PUT";
  textoBotao: string;
  dadosIniciais?: Partial<Idoso> & { foto?: string };
}

export default function FormularioIdoso({
  endpoint,
  metodo = "POST",
  textoBotao,
  dadosIniciais,
}: IdosoFormProps) {
  const [formDados, setFormDados] = useState<Partial<Idoso> & { foto?: string }>(
    dadosIniciais || {}
  );

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [cidadesBrasil, setCidadesBrasil] = useState<string[]>([]);

  useEffect(() => {
    if (dadosIniciais) {
      setFormDados(dadosIniciais);
    }
  }, [dadosIniciais]);

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios")
      .then((r) => (r.ok ? r.json() : []))
      .then((dados) => {
        if (!Array.isArray(dados)) return;
        const nomes = dados
          .map((m: { nome?: string; microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } } }) => {
            const uf = m.microrregiao?.mesorregiao?.UF?.sigla;
            return uf ? `${m.nome} - ${uf}` : m.nome;
          })
          .filter((n): n is string => Boolean(n))
          .sort((a, b) => a.localeCompare(b, "pt-BR"));
        setCidadesBrasil(nomes);
      })
      .catch(() => {});
  }, []);

  const [familia, setFamilia] = useState({
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaNome: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaIdade: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaParentesco: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaProfisao: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaReligiao: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaEscolaridade: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaContato: "",
  });

  const [irmaos, setIrmaos] = useState({
    nomeIrmaos: "",
    idadeIrmaos: "",
    localIrmaos: "",
  });

  useEffect(() => { }, [irmaos]);
  useEffect(() => { }, [familia]);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "informacao">("informacao");

  const [etapa, setEtapa] = useState(1);
  const [aplica, setAplica] = useState<string>("");
  const [enviarVazio, setEnviarVazio] = useState(false);
  const navegacao = useNavigate();
  const formScrollRef = useRef<HTMLFormElement>(null);

  const proximaEtapa = () => setEtapa((prev) => prev + 1);
  const etapaAnterior = () => setEtapa((prev) => prev - 1);

  useEffect(() => {
    formScrollRef.current?.scrollTo({ top: 0 });
  }, [etapa]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormDados({
      ...formDados,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCpf = (e: ChangeEvent<HTMLInputElement>) => {
    setFormDados({
      ...formDados,
      cpf: formatarCPF(e.target.value),
    });
  };

  const handleChangeRg = (e: ChangeEvent<HTMLInputElement>) => {
    setFormDados({
      ...formDados,
      rg: formatarRG(e.target.value),
    });
  };

  const handleChangeSus = (e: ChangeEvent<HTMLInputElement>) => {
    setFormDados({
      ...formDados,
      sus: formatarSUS(e.target.value),
    });
  };

  const handleCheckboxToggle = (name: string) => {
    setFormDados((prev) => ({
      ...prev,
      [name]: !(prev as Record<string, unknown>)[name],
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEnviarVazio(true);
    setMensagem("Enviando...");
    setTipoMensagem("informacao");

    try {
      const token = localStorage.getItem("token");
      let resposta;

      // O campo SUS é exibido com espaços (000 0000 0000 0000) pra facilitar
      // a leitura, mas a API exige exatamente 15 dígitos sem espaços. O
      // valor mascarado só existe na tela — aqui a gente limpa antes de enviar.
      const dadosParaEnviar = {
        ...formDados,
        sus: formDados.sus ? formDados.sus.replace(/\D/g, "") : formDados.sus,
      };

      if (fotoFile) {
        const formData = new FormData();
        Object.entries(dadosParaEnviar).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        formData.append("foto", fotoFile);

        resposta = await fetch(endpoint, {
          method: metodo,
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        });
      } else {
        resposta = await fetch(endpoint, {
          method: metodo,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(dadosParaEnviar),
        });
      }

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem(dados.message || `${textoBotao} realizado com sucesso!`);
        setTipoMensagem("sucesso");
        setTimeout(() => navegacao("/lista/idosos"), 1000);
      } else if (Array.isArray(dados.errors) && dados.errors.length > 0) {
        // O backend retorna um array de erros do Zod com o campo (path) e o
        // motivo. Antes isso era ignorado e só aparecia "Dados inválidos".
        const detalhes = dados.errors
          .map((erro: { path?: (string | number)[]; message: string }) => {
            const campo = erro.path?.[0] ? String(erro.path[0]) : "";
            const rotulo = ROTULOS_CAMPOS_IDOSO[campo] || campo;
            const mensagem = traduzirMensagemErro(erro.message);
            return rotulo ? `${rotulo}: ${mensagem}` : mensagem;
          })
          .join(" — ");
        setMensagem(`⚠️ ${dados.message || "Dados inválidos"}: ${detalhes}`);
        setTipoMensagem("erro");
      } else {
        setMensagem(dados.message || `Erro ao ${textoBotao.toLowerCase()}.`);
        setTipoMensagem("erro");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }
  };

  return (
    <Layout>
    <div className="w-full box-border flex flex-col items-center py-6 sm:py-8 px-2 sm:px-0">
      <div className="w-full max-w-3xl flex items-center gap-3 sm:gap-4 mb-6 mt-4 px-4">
        <Botao onClick={() => navegacao("/lista/idosos")} className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100 shrink-0">
          <ChevronLeftIcon />
        </Botao>
        <h1 className="text-base sm:text-3xl font-bold text-gray-800 text-center flex-1 leading-snug">
          Plano Individual de Atendimento - PIA
        </h1>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl mx-auto p-4 sm:p-8 overflow-hidden">
        <form
            ref={formScrollRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 h-[70vh] overflow-y-auto pr-2"
          >
            {etapa === 1 && (
              <>
                <h3 className="text-blue-800 font-bold text-xl">
                  I - DADOS PESSOAIS
                </h3>

                <div className="flex flex-col">
                  <Label htmlFor="foto" texto="Foto do Idoso" />

                  {formDados.foto && !fotoFile && (
                    <img
                      src={formDados.foto}
                      alt="Foto atual do idoso"
                      className="w-24 h-24 object-cover rounded-xl mt-2 mb-2 border border-gray-300"
                    />
                  )}

                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="nome" texto="Nome completo" />
                  <ErroCampoObrigatorio
                    valor={formDados.nome}
                    obrigatorio
                    envioVazio={enviarVazio}
                  >
                    <Input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formDados.nome}
                      onChange={handleChange}
                      required
                    />
                  </ErroCampoObrigatorio>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col w-full sm:w-1/2">
                    <Label htmlFor="dataNascimento" texto="Data de Nascimento" />
                    <ErroCampoObrigatorio
                      valor={formDados.dataNascimento}
                      obrigatorio
                      envioVazio={enviarVazio}
                    >
                      <Input
                        type="date"
                        id="dataNascimento"
                        name="dataNascimento"
                        value={formatarData(formDados.dataNascimento)}
                        onChange={handleChange}
                        required
                      />
                    </ErroCampoObrigatorio>
                  </div>

                  <div className="flex flex-col w-full sm:w-1/2">
                    <Label htmlFor="sexo" texto="Sexo" />
                    <ErroCampoObrigatorio
                      valor={formDados.sexo}
                      obrigatorio
                      envioVazio={enviarVazio}
                    >
                      <Select
                        id="sexo"
                        name="sexo"
                        value={formDados.sexo}
                        onChange={handleChange}
                        required
                      >
                        <Option value="" texto="Selecione" />
                        <Option value="feminino" texto="Feminino" />
                        <Option value="masculino" texto="Masculino" />
                      </Select>
                    </ErroCampoObrigatorio>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col w-full sm:w-1/2">
                    <Label htmlFor="cpf" texto="CPF" />
                    <ErroCampoObrigatorio
                      valor={formDados.cpf}
                      obrigatorio
                      envioVazio={enviarVazio}
                    >
                      <Input
                        type="text"
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formDados.cpf}
                        onChange={handleChangeCpf}
                        inputMode="numeric"
                        maxLength={14}
                        required
                      />
                    </ErroCampoObrigatorio>
                  </div>

                  <div className="flex flex-col w-full sm:w-1/2">
                    <Label htmlFor="sus" texto="SUS" />
                    <ErroCampoObrigatorio
                      valor={formDados.sus}
                      obrigatorio
                      envioVazio={enviarVazio}
                    >
                      <Input
                        type="text"
                        id="sus"
                        name="sus"
                        placeholder="000 0000 0000 0000"
                        value={formDados.sus}
                        onChange={handleChangeSus}
                        inputMode="numeric"
                        maxLength={18}
                        required
                      />
                    </ErroCampoObrigatorio>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="rg" texto="RG" />
                    <ErroCampoObrigatorio
                      valor={formDados.rg}
                      obrigatorio
                      envioVazio={enviarVazio}
                    >
                      <Input
                        type="text"
                        id="rg"
                        name="rg"
                        placeholder="Somente números"
                        value={formDados.rg}
                        onChange={handleChangeRg}
                        maxLength={12}
                        required
                      />
                    </ErroCampoObrigatorio>
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="dataEmissaoRg" texto="Data de Emissão" />
                    <Input
                      type="date"
                      id="dataEmissaoRg"
                      name="dataEmissaoRg"
                      value={formatarData(formDados.dataEmissaoRg)}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="orgaoEmissorRg" texto="Órgão Emissor" />
                    <Input
                      type="text"
                      id="orgaoEmissorRg"
                      name="orgaoEmissorRg"
                      placeholder="Exemplo: SSP-PB"
                      value={formDados.orgaoEmissorRg}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col w-full sm:w-1/2">
                    <Label htmlFor="nacionalidade" texto="Nacionalidade" />
                    <ErroCampoObrigatorio
                      valor={formDados.nacionalidade}
                      obrigatorio
                      envioVazio={enviarVazio}
                    >
                      <Select
                        id="nacionalidade"
                        name="nacionalidade"
                        value={formDados.nacionalidade || ""}
                        onChange={handleChange}
                        required
                      >
                        <Option value="" texto="Selecione" />
                        {PAISES.map((pais) => (
                          <Option key={pais} value={pais} texto={pais} />
                        ))}
                      </Select>
                    </ErroCampoObrigatorio>
                  </div>

                  <div className="flex flex-col w-full sm:w-1/2">
                    <Label htmlFor="naturalidade" texto="Naturalidade" />
                    <ErroCampoObrigatorio
                      valor={formDados.naturalidade}
                      obrigatorio
                      envioVazio={enviarVazio}
                    >
                      <Input
                        type="text"
                        id="naturalidade"
                        name="naturalidade"
                        list={formDados.nacionalidade === "Brasil" ? "lista-cidades-brasil" : undefined}
                        placeholder={
                          formDados.nacionalidade === "Brasil"
                            ? "Digite para buscar a cidade"
                            : "Cidade ou local de nascimento"
                        }
                        value={formDados.naturalidade}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      />
                    </ErroCampoObrigatorio>
                    {formDados.nacionalidade === "Brasil" && (
                      <datalist id="lista-cidades-brasil">
                        {cidadesBrasil.map((cidade) => (
                          <option key={cidade} value={cidade} />
                        ))}
                      </datalist>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-blue-800 font-bold text-lg">Filiação</p>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex flex-col w-full sm:w-1/2">
                      <Label htmlFor="nomePai" texto="Nome do Pai" />
                      <Input
                        type="text"
                        id="nomePai"
                        name="nomePai"
                        value={formDados.nomePai}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col w-full sm:w-1/2">
                      <Label htmlFor="nomeMae" texto="Nome da Mãe" />
                      <Input
                        type="text"
                        id="nomeMae"
                        name="nomeMae"
                        value={formDados.nomeMae}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="responsavel" texto="Nome do Responsável" />
                  <Input
                    type="text"
                    id="responsavel"
                    name="responsavel"
                    value={formDados.responsavel}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="ultimoEnderecoDoAcolhido"
                    texto="Último endereço do acolhido"
                  />
                  <Input
                    type="text"
                    id="ultimoEnderecoDoAcolhido"
                    name="ultimoEnderecoDoAcolhido"
                    value={formDados.ultimoEnderecoDoAcolhido}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="cidade" texto="Cidade / UF" />
                  <Input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={formDados.cidade}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="contato" texto="Contato" />
                  <Input
                    type="text"
                    id="contato"
                    name="contato"
                    value={formDados.contato}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label
                      htmlFor="numCertidaoNascimento"
                      texto="Nº da Certidão de Nascimento"
                    />
                    <Input
                      type="text"
                      id="numCertidaoNascimento"
                      name="numCertidaoNascimento"
                      value={formDados.numCertidaoNascimento}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3 mt-6">
                    <Label htmlFor="folhaCertidao" texto="Folha" />
                    <Input
                      type="text"
                      id="folhaCertidao"
                      name="folha"
                      value={formDados.folha}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3 mt-6">
                    <Label htmlFor="livroCertidao" texto="Livro" />
                    <Input
                      type="text"
                      id="livroCertidao"
                      name="livro"
                      value={formDados.livro}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="cartorio" texto="Cartório" />
                  <Input
                    type="text"
                    id="cartorio"
                    name="cartorio"
                    value={formDados.cartorio}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="ctps" texto="CTPS" />
                    <Input
                      type="text"
                      id="ctps"
                      name="ctps"
                      value={formDados.ctps}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="serieCtps" texto="Série" />
                    <Input
                      type="text"
                      id="serieCtps"
                      name="serie"
                      value={formDados.serie}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="pis" texto="PIS" />
                    <Input
                      type="text"
                      id="pis"
                      name="pis"
                      value={formDados.pis}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="tituloEleitor" texto="Título de Eleitor" />
                    <Input
                      type="text"
                      id="tituloEleitor"
                      name="tituloEleitor"
                      value={formDados.tituloEleitor}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="zonaTituloEleitor" texto="Zona" />
                    <Input
                      type="text"
                      id="zonaTituloEleitor"
                      name="zonaTituloEleitor"
                      value={formDados.zonaTituloEleitor}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label htmlFor="secaoTituloEleitor" texto="Seção" />
                    <Input
                      type="text"
                      id="secaoTituloEleitor"
                      name="secaoTituloEleitor"
                      value={formDados.secaoTituloEleitor}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="observacoesDadosPessoais" texto="Observações" />
                  <Textarea
                    id="observacoesDadosPessoais"
                    name="observacoesDadosPessoais"
                    value={formDados.observacoesDadosPessoais}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {etapa === 2 && (
              <>
                <h3 className="text-blue-800 font-bold text-xl">
                  II - DADOS DO ACOLHIMENTO
                </h3>

                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col">
                    <Label
                      htmlFor="dataAcolhimento"
                      texto="Data do Acolhimento"
                    />
                    <Input
                      type="date"
                      id="dataAcolhimento"
                      name="dataAcolhimento"
                      value={formatarData(formDados.dataAcolhimento)}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor="localAcolhimento"
                      texto="Local do Acolhimento"
                    />
                    <Input
                      type="text"
                      id="localAcolhimento"
                      name="localAcolhimento"
                      value={formDados.localAcolhimento}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="encaminhadoPor" texto="Encaminhado por" />
                    <Input
                      type="text"
                      id="encaminhadoPor"
                      name="encaminhadoPor"
                      value={formDados.encaminhadoPor}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="motivoDoAcolhimentoConformeOrgaoEmissor"
                    texto="Motivo do Acolhimento conforme o órgão encaminhador"
                  />
                  <Textarea
                    id="motivoDoAcolhimentoConformeOrgaoEmissor"
                    name="motivoDoAcolhimentoConformeOrgaoEmissor"
                    value={formDados.motivoDoAcolhimentoConformeOrgaoEmissor}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="documentacaoRecebida"
                    texto="Documentos Recebidos"
                  />
                  <Input
                    type="text"
                    id="documentacaoRecebida"
                    name="documentacaoRecebida"
                    value={formDados.documentacaoRecebida}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia"
                    texto="Condições em que ocorreu a retirada do idoso da família"
                  />
                  <Textarea
                    id="condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia"
                    name="condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia"
                    value={
                      formDados.condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia
                    }
                    onChange={handleChange}
                  />
                </div>

                <h4 className="text-blue-800 font-bold text-xl">
                  Condições do idoso no momento do acolhimento:
                </h4>

                <div className="flex flex-col">
                  <Label
                    htmlFor="condicoesDeHigieneNoMomentoDoAcolhimento"
                    texto="Higiene"
                  />
                  <Textarea
                    id="condicoesDeHigieneNoMomentoDoAcolhimento"
                    name="condicoesDeHigieneNoMomentoDoAcolhimento"
                    value={formDados.condicoesDeHigieneNoMomentoDoAcolhimento}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="reacoesEComportamentos"
                    texto="Reações e comportamentos"
                  />
                  <Textarea
                    id="reacoesEComportamentos"
                    name="reacoesEComportamentos"
                    value={formDados.reacoesEComportamentos}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="sinasDeViolencia" texto="Sinais de violência" />
                  <Textarea
                    id="sinasDeViolencia"
                    name="sinasDeViolencia"
                    value={formDados.sinasDeViolencia}
                    onChange={handleChange}
                  />
                </div>

                <h4 className="text-blue-800 font-bold text-xl">
                  Acolhimento anterior:
                </h4>

                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label
                      htmlFor="instituicaoAcolhimentoAnterior"
                      texto="Instituição"
                    />
                    <Input
                      type="text"
                      id="instituicaoAcolhimentoAnterior"
                      name="instituicaoAcolhimentoAnterior"
                      value={formDados.instituicaoAcolhimentoAnterior}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label
                      htmlFor="dataEntradaAcolhimentoAnterior"
                      texto="Data de entrada"
                    />
                    <Input
                      type="date"
                      id="dataEntradaAcolhimentoAnterior"
                      name="dataEntradaAcolhimentoAnterior"
                      value={formatarData(
                        formDados.dataEntradaAcolhimentoAnterior
                      )}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/3">
                    <Label
                      htmlFor="dataSaidaAcolhimentoAnterior"
                      texto="Data da saída"
                    />
                    <Input
                      type="date"
                      id="dataSaidaAcolhimentoAnterior"
                      name="dataSaidaAcolhimentoAnterior"
                      value={formatarData(formDados.dataSaidaAcolhimentoAnterior)}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="motivoAcompanhamentoAnterior"
                    texto="Motivo do acompanhamento anterior"
                  />
                  <Textarea
                    id="motivoAcompanhamentoAnterior"
                    name="motivoAcompanhamentoAnterior"
                    value={formDados.motivoAcolhimentoAnterior}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="motivoDesacolhimentoAnterior"
                    texto="Motivos do desacolhimento anterior"
                  />
                  <Textarea
                    id="motivoDesacolhimentoAnterior"
                    name="motivoDesacolhimentoAnterior"
                    value={formDados.motivoDesacolhimentoAnterior}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="encaminhamentosFamiliaAnteriormenteAoAcolhimento"
                    texto="Encaminhamentos dados à família e ao idoso ou responsável anteriormente ao acolhimento institucional"
                  />
                  <Textarea
                    id="encaminhamentosFamiliaAnteriormenteAoAcolhimento"
                    name="encaminhamentosFamiliaAnteriormenteAoAcolhimento"
                    value={
                      formDados.encaminhamentosFamiliaAnteriormenteAoAcolhimento
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="observacoesAcolhimento" texto="Observações" />
                  <Textarea
                    id="observacoesAcolhimento"
                    name="observacoesAcolhimento"
                    value={formDados.observacoesAcolhimento}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {etapa === 3 && (
              <>
                <h3 className="text-blue-800 font-bold text-xl">III - FAMÍLIA</h3>

                <h4 className="text-blue-800 font-bold text-xl">
                  Dados da família:
                </h4>

                <div className="flex flex-col">
                  <Label
                    htmlFor="arranjoFamiliar"
                    texto="Arranjo familiar (pessoas que residiam com o idoso(a))"
                  />
                  <Textarea
                    id="arranjoFamiliar"
                    name="arranjoFamiliar"
                    value={formDados.arranjoFamiliar}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="familiaAmpliada"
                    texto="Família extensa/ampliada (que não residem no domicilio, mas possui vínculos)"
                  />
                  <Textarea
                    id="familiaAmpliada"
                    name="familiaAmpliada"
                    value={formDados.familiaAmpliada}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="interessadosNoIdoso"
                    texto="Há interessados no idoso?"
                  />
                  <Textarea
                    id="interessadosNoIdoso"
                    name="interessadosNoIdoso"
                    value={formDados.interessadosNoIdoso}
                    onChange={handleChange}
                  />
                </div>

                <p className="text-gray-800 text-lg font-medium">
                  A família é atendida por programa/benefício social?
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8">
                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id="recebeProgramaSocial"
                      name="familiaAtendidaPorProgramaSocial"
                      value="sim"
                      checked={formDados.familiaAtendidaPorProgramaSocial === "sim"}
                      onChange={handleChange}
                    />
                    <Label
                      htmlFor="recebeProgramaSocial"
                      texto="Sim, é atendida por programa/benefício"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id="naoRecebeProgramaSocial"
                      name="familiaAtendidaPorProgramaSocial"
                      value="nao"
                      checked={formDados.familiaAtendidaPorProgramaSocial === "nao"}
                      onChange={handleChange}
                    />
                    <Label
                      htmlFor="naoRecebeProgramaSocial"
                      texto="Não é atendida por nenhum programa/benefício"
                    />
                  </div>
                </div>

                {formDados.familiaAtendidaPorProgramaSocial === "sim" && (
                <>
                <p className="text-gray-800 font-medium -mb-2">Se sim, qual?</p>

                <div className="flex flex-wrap gap-6 sm:gap-20">
                  <div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="programaTransferenciaRenda"
                        name="programaTransferenciaRenda"
                        checked={!!(formDados as Record<string, unknown>).programaTransferenciaRenda}
                        onChange={() => handleCheckboxToggle("programaTransferenciaRenda")}
                      />
                      <Label
                        htmlFor="programaTransferenciaRenda"
                        texto="Programa de transferência de renda"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="programaAtendimentoFamilia"
                        name="programaAtendimentoFamilia"
                        checked={!!(formDados as Record<string, unknown>).programaAtendimentoFamilia}
                        onChange={() => handleCheckboxToggle("programaAtendimentoFamilia")}
                      />
                      <Label
                        htmlFor="programaAtendimentoFamilia"
                        texto="Programa de atendimento à família"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="beneficioPrestacaoContinua"
                        name="beneficioPrestacaoContinua"
                        checked={!!(formDados as Record<string, unknown>).beneficioPrestacaoContinua}
                        onChange={() => handleCheckboxToggle("beneficioPrestacaoContinua")}
                      />
                      <Label
                        htmlFor="beneficioPrestacaoContinua"
                        texto="Benefício de Prestação Continuada"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="beneficioPrevidenciario"
                        name="beneficioPrevidenciario"
                        checked={!!(formDados as Record<string, unknown>).beneficioPrevidenciario}
                        onChange={() => handleCheckboxToggle("beneficioPrevidenciario")}
                      />
                      <Label
                        htmlFor="beneficioPrevidenciario"
                        texto="Benefícios previdenciários"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="programaHabitacao"
                        name="programaHabitacao"
                        checked={!!(formDados as Record<string, unknown>).programaHabitacao}
                        onChange={() => handleCheckboxToggle("programaHabitacao")}
                      />
                      <Label
                        htmlFor="programaHabitacao"
                        texto="Programa de habitação"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor="outroProgramaBeneficio" texto="Outros:" />
                      <Input
                        type="text"
                        id="outroProgramaBeneficio"
                        name="outroProgramaSocialDaFamilia"
                        value={(formDados as Record<string, unknown>).outroProgramaSocialDaFamilia as string || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor="quemEAtendidoNoProgramaSocialDaFamilia"
                      texto="Quem recebe o programa/benefício?"
                    />
                    <Input
                      type="text"
                      id="quemEAtendidoNoProgramaSocialDaFamilia"
                      name="quemEAtendidoNoProgramaSocialDaFamilia"
                      value={formDados.quemEAtendidoNoProgramaSocialDaFamilia}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                </>
                )}

                <h4 className="text-blue-800 font-bold text-xl">
                  Composição da renda familiar:
                </h4>

                <p className="text-gray-800 text-lg font-medium">
                  Familiares possuem renda proveniente de atividade laboral e/ou
                  pensão alimentícia?
                </p>

                <div className="flex flex-wrap gap-6 sm:gap-20">
                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id="seAplicaRenda"
                      name="familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia"
                      value="sim"
                      checked={
                        formDados.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia ===
                        "sim"
                      }
                      onChange={(e) => {
                        handleChange(e);
                        setAplica("sim");
                      }}
                    />

                    <Label htmlFor="seAplicaRenda" texto="Sim" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id="naoSeAplicaRenda"
                      name="familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia"
                      value="nao"
                      checked={
                        formDados.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia ===
                        "nao"
                      }
                      onChange={(e) => {
                        handleChange(e);
                        setAplica("nao");
                      }}
                    />
                    <Label htmlFor="naoSeAplicaRenda" texto="Não" />
                  </div>
                </div>

                {aplica === "sim" && (
                  <Campos
                    campos={[
                      "nome",
                      "idade",
                      "parentesco",
                      "profissão",
                      "religião",
                      "escolaridade",
                      "contato",
                    ]}
                    onChange={(valores) => {
                      const f = valores[0] || {};
                      setFamilia({
                        familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaNome:
                          f.nome || "",
                        familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaIdade:
                          f.idade || "",
                        familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaParentesco:
                          f.parentesco || "",
                        familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaProfisao:
                          f["profissão"] || "",
                        familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaReligiao:
                          f["religião"] || "",
                        familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaEscolaridade:
                          f.escolaridade || "",
                        familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaContato:
                          f.contato || "",
                      });
                    }}
                  />
                )}

                <div className="flex flex-col">
                  <Label htmlFor="infraestutura" texto="Infraestrutura" />
                  <Textarea
                    id="infraestutura"
                    name="infraestutura"
                    value={formDados.infraestutura}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="condicoesDeHabilidade"
                    texto="Condições de habitabilidade (higiene, organização, privacidade)"
                  />
                  <Textarea
                    id="condicoesDeHabilidade"
                    name="condicoesDeHabilidade"
                    value={formDados.condicoesDeHabilidade}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="infraestruturaDeComunidade"
                    texto="Infraestrutura da comunidade"
                  />
                  <Textarea
                    id="infraestruturaDeComunidade"
                    name="infraestruturaDeComunidade"
                    value={formDados.infraestruturaDeComunidade}
                    onChange={handleChange}
                  />
                </div>

                <p className="text-gray-800 text-lg font-medium">
                  A família é atendida pelos serviços de saúde?
                </p>

                <div className="flex flex-wrap gap-6 sm:gap-20">
                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id="temAtendimentoSaude"
                      name="familiaAtendidaPorProgramaSaude"
                      value="sim"
                      checked={
                        formDados.familiaAtendidaPorProgramaSaude === "sim"
                      }
                      onChange={(e) => {
                        handleChange(e);
                        setAplica("sim");
                      }}
                    />
                    <Label htmlFor="temAtendimentoSaude" texto="Sim" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id="naoTemAtendimentoSaude"
                      name="familiaAtendidaPorProgramaSaude"
                      value="nao"
                      checked={
                        formDados.familiaAtendidaPorProgramaSaude === "nao"
                      }
                      onChange={(e) => {
                        handleChange(e);
                        setAplica("nao");
                      }}
                    />
                    <Label htmlFor="naoTemAtendimentoSaude" texto="Não" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 sm:gap-20">
                  <div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="programaAtencaoBasica"
                        name="programaAtencaoBasica"
                        checked={!!(formDados as Record<string, unknown>).programaAtencaoBasica}
                        onChange={() => handleCheckboxToggle("programaAtencaoBasica")}
                      />
                      <Label
                        htmlFor="programaAtencaoBasica"
                        texto="Programa de saúde da família básica - atenção básica"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="caps"
                        name="caps"
                        checked={!!(formDados as Record<string, unknown>).caps}
                        onChange={() => handleCheckboxToggle("caps")}
                      />
                      <Label htmlFor="caps" texto="CAPS" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="capsAd"
                        name="capsAd"
                        checked={!!(formDados as Record<string, unknown>).capsAd}
                        onChange={() => handleCheckboxToggle("capsAd")}
                      />
                      <Label htmlFor="capsAd" texto="CAPS - AD" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="capsi"
                        name="capsi"
                        checked={!!(formDados as Record<string, unknown>).capsi}
                        onChange={() => handleCheckboxToggle("capsi")}
                      />
                      <Label htmlFor="capsi" texto="CAPSI" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="alcoolDrogas"
                        name="alcoolDrogas"
                        checked={!!(formDados as Record<string, unknown>).alcoolDrogas}
                        onChange={() => handleCheckboxToggle("alcoolDrogas")}
                      />
                      <Label
                        htmlFor="alcoolDrogas"
                        texto="De álcool e/ou drogas"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor="outroProgramaSaude" texto="Outros:" />
                      <Input
                        type="text"
                        id="outroProgramaSaude"
                        name="outroProgramaSaude"
                        value={(formDados as Record<string, unknown>).outroProgramaSaude as string || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor="localServicoDeSaudeQueAtendeAFamilia"
                      texto="Local"
                    />
                    <Input
                      type="text"
                      id="localServicoDeSaudeQueAtendeAFamilia"
                      name="localServicoDeSaudeQueAtendeAFamilia"
                      value={formDados.localServicoDeSaudeQueAtendeAFamilia}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="observacoesServicoDeSaude"
                    texto="Observações"
                  />
                  <Textarea
                    id="observacoesServicoDeSaude"
                    name="observacoesServicoDeSaude"
                    value={formDados.observacoesServicoDeSaude}
                    onChange={handleChange}
                  />
                </div>

                <h4 className="text-blue-800 font-bold text-xl">
                  Relações familiares:
                </h4>

                <div className="flex flex-col">
                  <Label
                    htmlFor="relacaoComFamilia"
                    texto="Como é a relação com a família? (fugas de casa, vínculos afetivos, indiferenças, brigas, etc)"
                  />
                  <Textarea
                    id="relacaoComFamilia"
                    name="relacaoComFamilia"
                    value={formDados.relacaoComFamilia}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="percepcaoDaFamiliaSobreIdoso"
                    texto="Percepção da família sobre o idoso"
                  />
                  <Textarea
                    id="percepcaoDaFamiliaSobreIdoso"
                    name="percepcaoDaFamiliaSobreIdoso"
                    value={formDados.percepcaoDaFamiliaSobreIdoso}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="percepcaoIdosoSobreFamilia"
                    texto="Percepção do idoso sobre a família"
                  />
                  <Textarea
                    id="percepcaoIdosoSobreFamilia"
                    name="percepcaoIdosoSobreFamilia"
                    value={formDados.percepcaoIdosoSobreFamilia}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="percepcaoEquipeTecnicaSobreRelacaoFamiliar"
                    texto="Percepção da equipe técnica sobre as relações familiares"
                  />
                  <Textarea
                    id="percepcaoEquipeTecnicaSobreRelacaoFamiliar"
                    name="percepcaoEquipeTecnicaSobreRelacaoFamiliar"
                    value={formDados.percepcaoEquipeTecnicaSobreRelacaoFamiliar}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="IdosoRecebeVisita"
                    texto="O idoso recebe visitas?"
                  />
                  <Input
                    type="text"
                    id="IdosoRecebeVisita"
                    name="IdosoRecebeVisita"
                    value={formDados.IdosoRecebeVisita}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="comportamentosIdosoDuranteVisita"
                    texto="Comportamentos do idoso durante a visita"
                  />
                  <Textarea
                    id="comportamentosIdosoDuranteVisita"
                    name="comportamentosIdosoDuranteVisita"
                    value={formDados.comportamentosIdosoDuranteVisita}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="comportamentosFamiliaresDuranteVisita"
                    texto="Comportamentos dos familiares durante a visita"
                  />
                  <Textarea
                    id="comportamentosFamiliaresDuranteVisita"
                    name="comportamentosFamiliaresDuranteVisita"
                    value={formDados.comportamentosFamiliaresDuranteVisita}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="observacoesRelacaoFamiliar"
                    texto="Obervações"
                  />
                  <Textarea
                    id="observacoesRelacaoFamiliar"
                    name="observacoesRelacaoFamiliar"
                    value={formDados.observacoesRelacaoFamiliar}
                    onChange={handleChange}
                  />
                </div>

                <p className="text-gray-800 text-lg font-medium">
                  Idoso tem irmãos?
                </p>

                <div className="flex flex-wrap gap-6 sm:gap-20">
                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id="temIrmao"
                      name="idosoTemIrmaos"
                      value="sim"
                      checked={formDados.idosoTemIrmaos === "sim"}
                      onChange={(e) => {
                        handleChange(e);
                        setAplica("sim");
                      }}
                    />
                    <Label htmlFor="temIrmao" texto="Sim" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      id="naoTemIrmao"
                      name="idosoTemIrmaos"
                      value="nao"
                      checked={formDados.idosoTemIrmaos === "nao"}
                      onChange={(e) => {
                        handleChange(e);
                        setAplica("nao");
                      }}
                    />
                    <Label htmlFor="naoTemIrmao" texto="Não" />
                  </div>
                </div>

                {aplica === "sim" && (
                  <Campos
                    campos={["nome", "idade", "local"]}
                    onChange={(valores) => {
                      const irmao = valores[0] || {};
                      setIrmaos({
                        nomeIrmaos: irmao.nome || "",
                        idadeIrmaos: irmao.idade || "",
                        localIrmaos: irmao.local || "",
                      });
                    }}
                  />
                )}

                <div className="flex flex-col">
                  <Label
                    htmlFor="parecerEquipeTecnicaIdoso"
                    texto="Parecer da equipe técnica"
                  />
                  <Textarea
                    id="parecerEquipeTecnicaIdoso"
                    name="parecerEquipeTecnica"
                    value={formDados.parecerEquipeTecnica}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="reavaliacao" texto="Prazo para reavaliação" />
                  <Input type="reavaliacao" id="reavaliacao" name="reavaliacao" />
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              {etapa > 1 && (
                <Botao
                  tipo="button"
                  onClick={etapaAnterior}
                  texto="Voltar"
                  variant="gray"
                />
              )}

              {etapa < 3 && (
                <Botao
                  tipo="button"
                  onClick={proximaEtapa}
                  texto="Próximo"
                  variant="next"
                />
              )}

              {etapa === 3 && (
                <Botao
                  tipo="button"
                  onClick={() => {
                    handleSubmit(
                      new SubmitEvent(
                        "submit"
                      ) as unknown as FormEvent<HTMLFormElement>
                    );
                  }}
                  texto={textoBotao}
                  className="bg-green-600 text-white hover:bg-green-700 ml-auto"
                />
              )}
            </div>
            {mensagem && (
              <Mensagem
                texto={mensagem}
                tipo={
                  tipoMensagem === "sucesso"
                    ? "sucesso"
                    : tipoMensagem === "erro"
                      ? "erro"
                      : "informacao"
                }
                onClose={() => setMensagem("")}
              />
            )}
        </form>
      </div>
    </div>
    </Layout>
  );
}