import { useState } from "react";
import Botao from "./componentes/Botao";
import Input from "./componentes/Input";
import Label from "./componentes/Label";
import Select from "./componentes/Select";
import Option from "./componentes/Option";
import Textarea from "./componentes/Textarea";

export default function CadastroIdoso() {
  const [etapa, setEtapa] = useState(1);

  const proximaEtapa = () => setEtapa((prev) => prev + 1);
  const etapaAnterior = () => setEtapa((prev) => prev - 1);

  return (
    <div className="w-screen min-h-screen bg-gray-200 box-border flex flex-col items-center">
      <div className="text-black p-6">
        <h1 className="text-3xl font-bold text-center">
          Plano Individual de Atendimento - PIA
        </h1>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl mx-auto mt-4 p-8 fixed top-24 overflow-hidden">
        <form className="flex flex-col gap-6 h-[70vh] overflow-y-auto pr-2">
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
            </>
          )}

          <div className="flex justify-between mt-6">
            {etapa > 1 && (
              <Botao
                onClick={etapaAnterior}
                texto="Voltar"
                className="bg-gray-400 text-white hover:bg-gray-500"
              />
            )}

            {etapa < 3 ? (
              <Botao
                onClick={proximaEtapa}
                texto="Próximo"
                className="bg-purple-500 text-white hover:bg-purple-600 ml-auto"
              />
            ) : (
              <Botao
                tipo="submit"
                texto="Enviar"
                className="bg-green-600 text-white hover:bg-green-700 ml-auto"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
