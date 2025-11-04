import { useState, type FormEvent } from "react";
import Botao from "../componentes/Botao";
import Input from "../componentes/Input";
import Label from "../componentes/Label";
import Select from "../componentes/Select";
import Option from "../componentes/Option";
import Textarea from "../componentes/Textarea";
import Campos from "../componentes/Campos";

export default function CadastroIdoso() {
  const familiaRenda = [
    "nome",
    "idade",
    "parentesco",
    "profissão",
    "religião",
    "escolaridade",
    "contato",
  ];

  const irmoes = ["nome", "idade", "local"];

  const [etapa, setEtapa] = useState(1);
  const [aplica, setAplica] = useState<string>("");

  const proximaEtapa = () => setEtapa((prev) => prev + 1);
  const etapaAnterior = () => setEtapa((prev) => prev - 1);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
                <Input type="text" id="nome" name="nome" required />
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="dataNascimento" texto="Data de Nascimento" />
                  <Input
                    type="date"
                    id="dataNascimento"
                    name="dataNascimento"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <Label htmlFor="sexo" texto="Sexo" />
                  <Select id="sexo" name="sexo" required>
                    <Option value="" texto="Selecione" />
                    <Option value="feminino" texto="Feminino" />
                    <Option value="masculino" texto="Masculino" />
                  </Select>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="cpf" texto="CPF" />
                  <Input type="text" id="cpf" name="cpf" required />
                </div>

                <div className="flex flex-col w-1/2">
                  <Label htmlFor="sus" texto="SUS" />
                  <Input type="text" id="sus" name="sus" required />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/3">
                  <Label htmlFor="rg" texto="RG" />
                  <Input type="text" id="rg" name="rg" required />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="dataEmissaoRg" texto="Data de Emissão" />
                  <Input
                    type="date"
                    id="dataEmissaoRg"
                    name="dataEmissaoRg"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="orgaoEmissorRg" texto="Órgão Emissor" />
                  <Input
                    type="text"
                    id="orgaoEmissorRg"
                    name="orgaoEmissorRg"
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
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <Label htmlFor="naturalidade" texto="Naturalidade" />
                  <Input
                    type="text"
                    id="naturalidade"
                    name="naturalidade"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-black font-bold text-lg">Filiação</p>
                <div className="flex gap-6">
                  <div className="flex flex-col w-1/2">
                    <Label htmlFor="nomePai" texto="Nome do Pai" />
                    <Input type="text" id="nomePai" name="nomePai" />
                  </div>

                  <div className="flex flex-col w-1/2">
                    <Label htmlFor="nomeMae" texto="Nome da Mãe" />
                    <Input type="text" id="nomeMae" name="nomeMae" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="responsavel" texto="Nome do Responsável" />
                <Input type="text" id="responsavel" name="responsavel" />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="ultimoEndereco"
                  texto="Último endereço do acolhido"
                />
                <Input type="text" id="ultimoEndereco" name="ultimoEndereco" />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="cidade" texto="Cidade / UF" />
                <Input type="text" id="cidade" name="cidade" />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="contato" texto="Contato" />
                <Input type="text" id="contato" name="contato" />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <Label
                    htmlFor="certidaoNascimento"
                    texto="Nº da Certidão de Nascimento"
                  />
                  <Input
                    type="text"
                    id="certidaoNascimento"
                    name="certidaoNascimento"
                  />
                </div>

                <div className="flex flex-col w-1/3 mt-6">
                  <Label htmlFor="folhaCertidao" texto="Folha" />
                  <Input type="text" id="folhaCertidao" name="folhaCertidao" />
                </div>

                <div className="flex flex-col w-1/3 mt-6">
                  <Label htmlFor="livroCertidao" texto="Livro" />
                  <Input
                    type="text"
                    id="livroCertidao"
                    name="livroCertidao"
                    className="w-1/1"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="cartorio" texto="Cartório" />
                <Input type="text" id="cartorio" name="cartorio" />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <Label htmlFor="ctps" texto="CTPS" />
                  <Input type="text" id="ctps" name="ctps" />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="serieCtps" texto="Série" />
                  <Input type="text" id="serieCtps" name="serieCtps" />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="pis" texto="PIS" />
                  <Input type="text" id="pis" name="pis" className="w-1/1" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <Label htmlFor="tituloEleitor" texto="Título de Eleitor" />
                  <Input type="text" id="tituloEleitor" name="tituloEleitor" />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="zonaTituloEleitor" texto="Zona" />
                  <Input
                    type="text"
                    id="zonaTituloEleitor"
                    name="zonaTituloEleitor"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="secaoTituloEleitor" texto="Seção" />
                  <Input
                    type="text"
                    id="secaoTituloEleitor"
                    name="secaoTituloEleitor"
                    className="w-1/1"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="observacoesDadosPessoais" texto="Observações" />
                <Textarea
                  id="observacoesDadosPessoais"
                  name="observacoesDadosPessoais"
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
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="encaminhadoPor" texto="Encaminhado por" />
                  <Input
                    type="text"
                    id="encaminhadoPor"
                    name="encaminhadoPor"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="motivoAcolhimento"
                  texto="Motivo do Acolhimento conforme o órgão encaminhador"
                />
                <Textarea
                  id="motivoAcolhimento"
                  name="motivoAcolhimento"
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="documentosRecebidos"
                  texto="Documentos Recebidos"
                />
                <Input
                  type="text"
                  id="documentosRecebidos"
                  name="documentosRecebidos"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="condicoesOcorreuRetirada"
                  texto="Condições em que ocorreu a retirada do idoso da família"
                />
                <Textarea
                  id="condicoesOcorreuRetirada"
                  name="condicoesOcorreuRetirada"
                  required
                />
              </div>

              <h4 className="text-black font-bold text-xl">
                Condições do idoso no momento do acolhimento:
              </h4>

              <div className="flex flex-col">
                <Label htmlFor="higiene" texto="Higiene" />
                <Textarea id="higiene" name="higiene" required />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="reacoesComportamentos"
                  texto="Reações e comportamentos"
                />
                <Textarea
                  id="reacoesComportamentos"
                  name="reacoesComportamentos"
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="sinaisViolencia" texto="Sinais de violência" />
                <Textarea
                  id="sinaisViolencia"
                  name="sinaisViolencia"
                  required
                />
              </div>

              <h4 className="text-black font-bold text-xl">
                Acolhimento anterior:
              </h4>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/3">
                  <Label htmlFor="instituicaoAnterior" texto="Instituição" />
                  <Input
                    type="text"
                    id="instituicaoAnterior"
                    name="instituicaoAnterior"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label
                    htmlFor="dataEntradaAnterior"
                    texto="Data de entrada"
                  />
                  <Input
                    type="date"
                    id="dataEntradaAnterior"
                    name="dataEntradaAnterior"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <Label htmlFor="dataSaidaAnterior" texto="Data da saída" />
                  <Input
                    type="date"
                    id="dataSaidaAnterior"
                    name="dataSaidaAnterior"
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
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="observacoesAcolhimento" texto="Observações" />
                <Textarea
                  id="observacoesAcolhimento"
                  name="observacoesAcolhimento"
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
                <Textarea id="arranjoFamiliar" name="arranjoFamiliar" />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="familiaAmpliada"
                  texto="Família extensa/ampliada (que não residem no domicilio, mas possui vínculos)"
                />
                <Textarea id="familiaAmpliada" name="familiaAmpliada" />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="interessadosIdoso"
                  texto="Há interessados no idoso?"
                />
                <Textarea id="interessadosIdoso" name="interessadosIdoso" />
              </div>

              <p className="text-black text-lg font-medium">
                A família é atendida por programa/benefício social?
              </p>

              <div className="flex">
                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="recebePrograma"
                    name="recebePrograma"
                  />
                  <Label
                    htmlFor="recebePrograma"
                    texto="Sim, é atendida por programa/benefício"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="naoRecebePrograma"
                    name="recebePrograma"
                  />
                  <Label
                    htmlFor="naoRecebePrograma"
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
                      name="programaTransferenciaRenda"
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
                      name="beneficioPrevidenciario "
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
                      name="programaHabitacao "
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
                      name="outroProgramaBeneficio "
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="quemRecebePrograma"
                    texto="Quem recebe o programa/benefício?"
                  />
                  <Input
                    type="text"
                    id="quemRecebePrograma"
                    name="quemRecebePrograma"
                  />
                </div>
              </div>

              <h4 className="text-black font-bold text-xl">
                Composição da renda familiar:
              </h4>

              <p className="text-black text-lg font-medium">
                Familiares possuem renda provenente de atividade laboral e/ou
                pensão alimentícia?
              </p>

              <div className="flex gap-20">
                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="seAplicaRenda"
                    name="aplicaRenda"
                    value="sim"
                    onChange={() => setAplica("sim")}
                  />
                  <Label htmlFor="seAplicaRenda" texto="Sim" />
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="naoSeAplicaRenda"
                    name="aplicaRenda"
                    value="nao"
                    onChange={() => setAplica("nao")}
                  />
                  <Label htmlFor="naoSeAplicaRenda" texto="Não" />
                </div>
              </div>

              {aplica === "sim" && <Campos campos={familiaRenda} />}

              <div className="flex flex-col">
                <Label htmlFor="infraestrutura" texto="Infraestrutura" />
                <Textarea id="infraestrutura" name="infraestrutura" />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="condicaoHabitabilidade"
                  texto="Condições de habitabilidade (higiene, organização, privacidade)"
                />
                <Textarea
                  id="condicaoHabitabilidade"
                  name="condicaoHabitabilidade"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="infraestruraComunidade"
                  texto="Infraestrutura da comunidade"
                />
                <Textarea
                  id="infraestruraComunidade"
                  name="infraestruraComunidade"
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
                    name="atendimentoSaude"
                  />
                  <Label htmlFor="temAtendimentoSaude" texto="Sim" />
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="naoTemAtendimentoSaude"
                    name="atendimentoSaude"
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
                      name="programaAtencaoBasica"
                    />
                    <Label
                      htmlFor="programaAtencaoBasica"
                      texto="Programa de saúde da família básica - atenção básica"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input type="checkbox" id="caps" name="caps" />
                    <Label htmlFor="caps" texto="CAPS" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input type="checkbox" id="capsAd" name="capsAd" />
                    <Label htmlFor="capsAd" texto="CAPS - AD" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input type="checkbox" id="capsi" name="capsi" />
                    <Label htmlFor="capsi" texto="CAPSI" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      id="alcoolDrogas"
                      name="alcoolDrogas"
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
                      name="outroProgramaSaude "
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="localProgramaSaude" texto="Local" />
                  <Input
                    type="text"
                    id="localProgramaSaude"
                    name="localProgramaSaude"
                  />
                </div>
              </div>

              <h4 className="text-black font-bold text-xl">
                Relações familiares:
              </h4>

              <div className="flex flex-col">
                <Label
                  htmlFor="relacaoFamilia"
                  texto="Como é a relação com a família? (fugas de casa, vínculos afetivos, indiferenças, brigas, etc)"
                />
                <Textarea id="relacaoFamilia" name="relacaoFamilia" />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="percepcaoFamilia"
                  texto="Percepção da família sobre o idoso"
                />
                <Textarea id="percepcaoFamilia" name="percepcaoFamilia" />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="percepcaoIdoso"
                  texto="Percepção do idoso sobre a família"
                />
                <Textarea id="percepcaoIdoso" name="percepcaoIdoso" />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="percepcaoEquipeTecnicaFamilia"
                  texto="Percepção da equipe técnica sobre as relações familiares"
                />
                <Textarea
                  id="percepcaoEquipeTecnicaFamilia"
                  name="percepcaoEquipeTecnicaFamilia"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="visita" texto="O idoso recebe visitas?" />
                <Input type="text" id="visita" name="visita" />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="comportamentoIdosoVisita"
                  texto="Comportamentos do idoso durante a visita"
                />
                <Textarea
                  id="comportamentoIdosoVisita"
                  name="comportamentoIdosoVisita"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="comportamentoFamiliarVisita"
                  texto="Comportamentos dos familiares durante a visita"
                />
                <Textarea
                  id="comportamentoFamiliarVisita"
                  name="comportamentoFamiliarVisita"
                />
              </div>

              <p className="text-black text-lg font-medium">
                Idoso tem irmões?
              </p>

              <div className="flex gap-20">
                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="temIrmao"
                    name="irmao"
                    value="sim"
                    onChange={() => setAplica("sim")}
                  />
                  <Label htmlFor="temIrmao" texto="Sim" />
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    id="naoTemIrmao"
                    name="irmao"
                    value="nao"
                    onChange={() => setAplica("nao")}
                  />
                  <Label htmlFor="naotemIrmao" texto="Não" />
                </div>
              </div>

              {aplica === "sim" && <Campos campos={irmoes} />}

              <div className="flex flex-col">
                <Label
                  htmlFor="parecerEquipeTecnicaIdoso"
                  texto="Parecer da equipe técnica"
                />
                <Textarea
                  id="parecerEquipeTecnicaIdoso"
                  name="parecerEquipeTecnicaIdoso"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="reavaliacao" texto="Prazo para reavaliação" />
                <Input type="reavaliacao" id="reavaliacao" name="reavaliacao" />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="observacoesFinal" texto="Obervações" />
                <Textarea id="observacoesFinal" name="observacoesFinal" />
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

            {etapa < 3 ? (
              <Botao
                tipo="button"
                onClick={proximaEtapa}
                texto="Próximo"
                className="bg-purple-500 text-white hover:bg-purple-600 ml-auto"
              />
            ) : (
              <Botao
                tipo="submit"
                texto="Salvar"
                className="bg-green-600 text-white hover:bg-green-700 ml-auto"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
