import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Botao from "../componentes/Botao";
import Input from "../componentes/Input";
import Label from "../componentes/Label";
import Select from "../componentes/Select";
import Option from "../componentes/Option";
import Textarea from "../componentes/Textarea";
import Campos from "../componentes/Campos";
import type Idoso from "../modelo/Idoso";
import { formatacaoData } from "../formatacao/formatacaoData";
import Mensagem from "./mensagem";

interface IdosoFormProps {
  endpoint: string;
  metodo?: "POST" | "PUT";
  textoBotao: string;
  dadosIniciais?: Partial<Idoso>;
}

export default function FormularioIdoso({
  endpoint,
  metodo = "POST",
  textoBotao,
  dadosIniciais,
}: IdosoFormProps) {
  const [formDados, setFormDados] = useState<Partial<Idoso>>(
    dadosIniciais || {}
  );

  
useEffect(() => {
  if (dadosIniciais) {
    setFormDados(dadosIniciais);
  }
}, [dadosIniciais]);

  const [familia, setFamilia] = useState({
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaNome: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaIdade: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaParentesco: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaProfisao: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaReligiao: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaEscolaridade: "",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaContato: "",
  });

  const [irmoes, setIrmoes] = useState({
    nomeIrmaos: "",
    idadeIrmaos: "",
    localIrmaos: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<
    "sucesso" | "erro" | "informacao"
  >("informacao");
  const [etapa, setEtapa] = useState(1);
  const [aplica, setAplica] = useState<string>("");

  const proximaEtapa = () => setEtapa((prev) => prev + 1);
  const etapaAnterior = () => setEtapa((prev) => prev - 1);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormDados({
      ...formDados,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMensagem("Enviando...");
    setTipoMensagem("informacao");

    try {
      const token = localStorage.getItem("token");
      const resposta = await fetch(endpoint, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formDados),
      });

      const dados = await resposta.json();
      console.log("📦 Dados sendo enviados:", dados);
      if (resposta.ok) {
        setMensagem(dados.mensagem ||`${textoBotao} realizado com sucesso!`);
        setTipoMensagem("sucesso");
      } else {
        setMensagem(dados.mensagem || `Erro ao ${textoBotao.toLowerCase()}.`);
        setTipoMensagem("erro");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-200 box-border flex flex-col items-center">
      <div className="text-black p-6">
        <h1 className="text-3xl font-bold text-center">
          Plano Individual de Atendimento - PIA
        </h1>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl mx-auto mt-4 p-8 fixed top-24 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 h-[70vh] overflow-y-auto pr-2"
        >
          {etapa === 1 && (
            <>
              <h3 className="text-black font-bold text-xl">
                I - DADOS PESSOAIS
              </h3>

              <div className="flex flex-col">
                <Label htmlFor="nome" texto="Nome completo" />
                <Input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formDados.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="data_nascimento" texto="Data de Nascimento" />
                  <Input
                    type="date"
                    id="data_nascimento"
                    name="dataNascimento"
                    value={formatacaoData(formDados.dataNascimento)}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <Label htmlFor="sexo" texto="Sexo" />
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
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="cpf" texto="CPF" />
                  <Input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formDados.cpf}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <Label htmlFor="sus" texto="SUS" />
                  <Input
                    type="text"
                    id="sus"
                    name="sus"
                    value={formDados.sus}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/3">
                  <Label htmlFor="rg" texto="RG" />
                  <Input
                    type="text"
                    id="rg"
                    name="rg"
                    value={formDados.rg}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="dataEmissaoRg" texto="Data de Emissão" />
                  <Input
                    type="date"
                    id="dataEmissaoRg"
                    name="dataEmissaoRg"
                    value={formatacaoData(formDados.dataEmissaoRg)}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="orgaoEmissorRg" texto="Órgão Emissor" />
                  <Input
                    type="text"
                    id="orgaoEmissorRg"
                    name="orgaoEmissorRg"
                    value={formDados.orgaoEmissorRg}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="nacionalidade" texto="Nacionalidade" />
                  <Input
                    type="text"
                    id="nacionalidade"
                    name="nacionalidade"
                    value={formDados.nacionalidade}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <Label htmlFor="naturalidade" texto="Naturalidade" />
                  <Input
                    type="text"
                    id="naturalidade"
                    name="naturalidade"
                    value={formDados.naturalidade}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-black font-bold text-lg">Filiação</p>
                <div className="flex gap-6">
                  <div className="flex flex-col w-1/2">
                    <Label htmlFor="nomePai" texto="Nome do Pai" />
                    <Input
                      type="text"
                      id="nomePai"
                      name="nomePai"
                      value={formDados.nomePai}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-1/2">
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

              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
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

                <div className="flex flex-col w-1/3 mt-6">
                  <Label htmlFor="folhaCertidao" texto="Folha" />
                  <Input
                    type="text"
                    id="folhaCertidao"
                    name="folha"
                    value={formDados.folha}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col w-1/3 mt-6">
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

              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <Label htmlFor="ctps" texto="CTPS" />
                  <Input
                    type="text"
                    id="ctps"
                    name="ctps"
                    value={formDados.ctps}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="serieCtps" texto="Série" />
                  <Input
                    type="text"
                    id="serieCtps"
                    name="serie"
                    value={formDados.serie}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col w-1/3">
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

              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <Label htmlFor="tituloEleitor" texto="Título de Eleitor" />
                  <Input
                    type="text"
                    id="tituloEleitor"
                    name="tituloEleitor"
                    value={formDados.tituloEleitor}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="zonaTituloEleitor" texto="Zona" />
                  <Input
                    type="text"
                    id="zonaTituloEleitor"
                    name="zonaTituloEleitor"
                    value={formDados.zonaTituloEleitor}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col w-1/3">
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
              <h3 className="text-black font-bold text-xl">
                II - DADOS DO ACOLHIMENTO
              </h3>

              <div className="flex gap-6">
                <div className="flex flex-col">
                  <Label
                    htmlFor="dataAcolhimento"
                    texto="Data do Acolhimento"
                  />
                  <Input
                    type="date"
                    id="dataAcolhimento"
                    name="dataAcolhimento"
                    value={formatacaoData(formDados.dataAcolhimento)}
                    onChange={handleChange}
                    required
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
                    required
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
                  required
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
                  required
                />
              </div>

              <h4 className="text-black font-bold text-xl">
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
                  required
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
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="sinasDeViolencia" texto="Sinais de violência" />
                <Textarea
                  id="sinasDeViolencia"
                  name="sinasDeViolencia"
                  value={formDados.sinasDeViolencia}
                  onChange={handleChange}
                  required
                />
              </div>

              <h4 className="text-black font-bold text-xl">
                Acolhimento anterior:
              </h4>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/3">
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

                <div className="flex flex-col w-1/3">
                  <Label
                    htmlFor="dataEntradaAcolhimentoAnterior"
                    texto="Data de entrada"
                  />
                  <Input
                    type="date"
                    id="dataEntradaAcolhimentoAnterior"
                    name="dataEntradaAcolhimentoAnterior"
                    value={formatacaoData(
                      formDados.dataEntradaAcolhimentoAnterior
                    )}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label
                    htmlFor="dataSaidaAcolhimentoAnterior"
                    texto="Data da saída"
                  />
                  <Input
                    type="date"
                    id="dataSaidaAcolhimentoAnterior"
                    name="dataSaidaAcolhimentoAnterior"
                    value={formatacaoData(
                      formDados.dataSaidaAcolhimentoAnterior
                    )}
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
              <h3 className="text-black font-bold text-xl">III - FAMÍLIA</h3>

              <h4 className="text-black font-bold text-xl">
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

              <p className="text-black text-lg font-medium">
                A família é atendida por programa/benefício social?
              </p>

              <div className="flex">
                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="recebeProgramaSocial"
                    name="familiaAtendidaPorProgramaSocial"
                    value={formDados.familiaAtendidaPorProgramaSocial}
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
                    value={formDados.familiaAtendidaPorProgramaSocial}
                    onChange={handleChange}
                  />
                  <Label
                    htmlFor="naoRecebeProgramaSocial"
                    texto="Não é atendida por nenhum programa/benefício"
                  />
                </div>
              </div>

              <div className="flex gap-20">
                <div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      id="programaTransferenciaRenda"
                      name="programaSocialDaFamilia"
                      value={formDados.programaSocialDaFamilia}
                      onChange={handleChange}
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
                      name="programaSocialDaFamilia"
                      value={formDados.programaSocialDaFamilia}
                      onChange={handleChange}
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
                      name="programaSocialDaFamilia"
                      value={formDados.programaSocialDaFamilia}
                      onChange={handleChange}
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
                      name="programaSocialDaFamilia"
                      value={formDados.programaSocialDaFamilia}
                      onChange={handleChange}
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
                      name="programaSocialDaFamilia"
                      value={formDados.programaSocialDaFamilia}
                      onChange={handleChange}
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
                      name="programaSocialDaFamilia"
                      value={formDados.programaSocialDaFamilia}
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

              <h4 className="text-black font-bold text-xl">
                Composição da renda familiar:
              </h4>

              <p className="text-black text-lg font-medium">
                Familiares possuem renda proveniente de atividade laboral e/ou
                pensão alimentícia?
              </p>

              <div className="flex gap-20">
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
                      "não"
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

              <p className="text-black text-lg font-medium">
                A família é atendida pelos serviços de saúde?
              </p>

              <div className="flex gap-20">
                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="temAtendimentoSaude"
                    name="familiaAtendidaPorProgramaSaude"
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
                    checked={
                      formDados.familiaAtendidaPorProgramaSaude === "sim"
                    }
                    onChange={(e) => {
                      handleChange(e);
                      setAplica("sim");
                    }}
                  />
                  <Label htmlFor="naoRecebePrograma" texto="Não" />
                </div>
              </div>

              <div className="flex gap-20">
                <div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      id="programaAtencaoBasica"
                      name="servicoDeSaudeQueAtendeAFamilia"
                      value={formDados.servicoDeSaudeQueAtendeAFamilia}
                      onChange={handleChange}
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
                      name="servicoDeSaudeQueAtendeAFamilia"
                      value={formDados.servicoDeSaudeQueAtendeAFamilia}
                      onChange={handleChange}
                    />
                    <Label htmlFor="caps" texto="CAPS" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      id="capsAd"
                      name="servicoDeSaudeQueAtendeAFamilia"
                      value={formDados.servicoDeSaudeQueAtendeAFamilia}
                      onChange={handleChange}
                    />
                    <Label htmlFor="capsAd" texto="CAPS - AD" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      id="capsi"
                      name="servicoDeSaudeQueAtendeAFamilia"
                      value={formDados.servicoDeSaudeQueAtendeAFamilia}
                      onChange={handleChange}
                    />
                    <Label htmlFor="capsi" texto="CAPSI" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      id="alcoolDrogas"
                      name="servicoDeSaudeQueAtendeAFamilia"
                      value={formDados.servicoDeSaudeQueAtendeAFamilia}
                      onChange={handleChange}
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
                      name="servicoDeSaudeQueAtendeAFamilia"
                      value={formDados.servicoDeSaudeQueAtendeAFamilia}
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

              <h4 className="text-black font-bold text-xl">
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

              <p className="text-black text-lg font-medium">
                Idoso tem irmãos?
              </p>

              <div className="flex gap-20">
                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="temIrmao"
                    name="irmao"
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
                    name="irmao"
                    value="nao"
                    checked={formDados.idosoTemIrmaos === "não"}
                    onChange={(e) => {
                      handleChange(e);
                      setAplica("nao");
                    }}
                  />
                  <Label htmlFor="naotemIrmao" texto="Não" />
                </div>
              </div>

              {aplica === "sim" && (
                <Campos
                  campos={["nome", "idade", "local"]}
                  onChange={(valores) => {
                    const irmao = valores[0] || {};
                    setIrmoes({
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
                className="bg-gray-400 text-white hover:bg-gray-500"
              />
            )}

            {etapa < 3 && (
              <Botao
                tipo="button"
                onClick={proximaEtapa}
                texto="Próximo"
                className="bg-purple-500 text-white hover:bg-purple-600 ml-auto"
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
  );
}
