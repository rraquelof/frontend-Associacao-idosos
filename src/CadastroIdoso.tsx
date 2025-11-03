import { useState } from "react";
import Botao from "./components/botao";

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
                <label
                  htmlFor="nome"
                  className="text-black font-medium text-lg mb-1"
                >
                  Nome completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />
              </div>

               <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="dataNascimento"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    id="dataNascimento"
                    name="dataNascimento"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="sexo"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Sexo
                  </label>
                  <select
                    id="sexo"
                    name="sexo"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="cpf"
                    className="text-black font-medium text-lg mb-1"
                  >
                    CPF
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="sus"
                    className="text-black font-medium text-lg mb-1"
                  >
                    SUS
                  </label>
                  <input
                    type="text"
                    id="sus"
                    name="sus"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="rg"
                    className="text-black font-medium text-lg mb-1"
                  >
                    RG
                  </label>
                  <input
                    type="text"
                    id="rg"
                    name="rg"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="dataEmissaoRg"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Data de Emissão
                  </label>
                  <input
                    type="date"
                    id="dataEmissaoRg"
                    name="dataEmissaoRg"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="orgaoEmissorRg"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Órgão Emissor
                  </label>
                  <input
                    type="text"
                    id="orgaoEmissorRg"
                    name="orgaoEmissorRg"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="nacionalidade"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Nacionalidade
                  </label>
                  <input
                    type="text"
                    id="nacionalidade"
                    name="nacionalidade"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="naturalidade"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Naturalidade
                  </label>
                  <input
                    type="text"
                    id="naturalidade"
                    name="naturalidade"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-black font-bold text-lg">Filiação</p>
                <div className="flex gap-6">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="nomePai"
                      className="text-black font-medium text-lg mb-1"
                    >
                      Nome do Pai
                    </label>
                    <input
                      type="text"
                      id="nomePai"
                      name="nomePai"
                      className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="nomeMae"
                      className="text-black font-medium text-lg mb-1"
                    >
                      Nome da Mãe
                    </label>
                    <input
                      type="text"
                      id="nomeMae"
                      name="nomeMae"
                      className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="responsavel"
                  className="text-black font-medium text-lg mb-1"
                >
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  id="responsavel"
                  name="responsavel"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="ultimoEndereco"
                  className="text-black font-medium text-lg mb-1"
                >
                  Último endereço do acolhido
                </label>
                <input
                  type="text"
                  id="ultimoEndereco"
                  name="ultimoEndereco"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="cidade"
                  className="text-black font-medium text-lg mb-1"
                >
                  Cidade / UF
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="contato"
                  className="text-black font-medium text-lg mb-1"
                >
                  Contato
                </label>
                <input
                  type="text"
                  id="contato"
                  name="contato"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="certidaoNascimento"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Nº da Certidão de Nascimento
                  </label>
                  <input
                    type="text"
                    id="certidaoNascimento"
                    name="certidaoNascimento"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="flex flex-col w-1/3 mt-6">
                  <label
                    htmlFor="folhaCertidao"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Folha
                  </label>
                  <input
                    type="text"
                    id="folhaCertidao"
                    name="folhaCertidao"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="flex flex-col w-1/3 mt-6">
                  <label
                    htmlFor="livroCertidao"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Livro
                  </label>
                  <input
                    type="text"
                    id="livroCertidao"
                    name="livroCertidao"
                    className="border p-3 rounded-lg text-lg w-1/1 text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="cartorio"
                  className="text-black font-medium text-lg mb-1"
                >
                  Cartório
                </label>
                <input
                  type="text"
                  id="cartorio"
                  name="cartorio"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

               <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="ctps"
                    className="text-black font-medium text-lg mb-1"
                  >
                    CTPS
                  </label>
                  <input
                    type="text"
                    id="ctps"
                    name="ctps"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="serieCtps"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Série
                  </label>
                  <input
                    type="text"
                    id="serieCtps"
                    name="serieCtps"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="pis"
                    className="text-black font-medium text-lg mb-1"
                  >
                    PIS
                  </label>
                  <input
                    type="text"
                    id="pis"
                    name="pis"
                    className="border p-3 rounded-lg text-lg w-1/1 text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>

               <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="tituloEleitor"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Título de Eleitor
                  </label>
                  <input
                    type="text"
                    id="tituloEleitor"
                    name="tituloEleitor"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="zonaTituloEleitor"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Zona
                  </label>
                  <input
                    type="text"
                    id="zonaTituloEleitor"
                    name="zonaTituloEleitor"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="secaoTituloEleitor"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Seção
                  </label>
                  <input
                    type="text"
                    id="secaoTituloEleitor"
                    name="secaoTituloEleitor"
                    className="border p-3 rounded-lg text-lg w-1/1 text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="observacoesDadosPessoais"
                  className="text-black font-medium text-lg mb-1"
                >
                  Observações
                </label>
                <textarea
                  id="observacoesDadosPessoais"
                  name="observacoesDadosPessoais"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                ></textarea>
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
                  <label
                    htmlFor="dataAcolhimento"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Data do Acolhimento
                  </label>
                  <input
                    type="date"
                    id="dataAcolhimento"
                    name="dataAcolhimento"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="localAcolhimento"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Local do Acolhimento
                  </label>
                  <input
                    type="text"
                    id="localAcolhimento"
                    name="localAcolhimento"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="encaminhadoPor"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Encaminhado por
                  </label>
                  <input
                    type="text"
                    id="encaminhadoPor"
                    name="encaminhadoPor"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="motivoAcolhimento"
                  className="text-black font-medium text-lg mb-1"
                >
                  Motivo do Acolhimento conforme o órgão encaminhador
                </label>

                <textarea
                  id="motivoAcolhimento"
                  name="motivoAcolhimento"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="documentosRecebidos"
                  className="text-black font-medium text-lg mb-1"
                >
                  Documentos Recebidos
                </label>
                <input
                  type="text"
                  id="documentosRecebidos"
                  name="documentosRecebidos"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="condicoesOcorreuRetirada"
                  className="text-black font-medium text-lg mb-1"
                >
                  Condições em que ocorreu a retirada do idoso da familia
                </label>
                <textarea
                  id="condicoesOcorreuRetirada"
                  name="condicoesOcorreuRetirada"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                ></textarea>
              </div>

              <h4 className="text-black font-bold text-xl">
                Condições do idoso no momento do acolhimento:
              </h4>

              <div className="flex flex-col">
                <label
                  htmlFor="higiene"
                  className="text-black font-medium text-lg mb-1"
                >
                  Higiene
                </label>
                <textarea
                  id="higiene"
                  name="higiene"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="reacoesComportamentos"
                  className="text-black font-medium text-lg mb-1"
                >
                  Reações e comportamentos
                </label>
                <textarea
                  id="reacoesComportamentos"
                  name="reacoesComportamentos"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="sinaisViolencia"
                  className="text-black font-medium text-lg mb-1"
                >
                  Sinais de violência
                </label>
                <textarea
                  id="sinaisViolencia"
                  name="sinaisViolencia"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                ></textarea>
              </div>

              <h4 className="text-black font-bold text-xl">
                Acolhimento anterior:
              </h4>

              <div className="flex gap-6">
                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="instituicaoAnterior"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Instituição
                  </label>
                  <input
                    type="text"
                    id="instituicaoAnterior"
                    name="instituicaoAnterior"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="dataEntradaAnterior"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Data de entrada
                  </label>
                  <input
                    type="date"
                    id="dataEntradaAnterior"
                    name="dataEntradaAnterior"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label
                    htmlFor="dataSaidaAnterior"
                    className="text-black font-medium text-lg mb-1"
                  >
                    Data da saída
                  </label>
                  <input
                    type="date"
                    id="dataSaidaAnterior"
                    name="dataSaidaAnterior"
                    className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="motivoAcompanhamentoAnterior"
                  className="text-black font-medium text-lg mb-1"
                >
                  Motivo do acompanhamento anterior
                </label>
                <textarea
                  id="motivoAcompanhamentoAnterior"
                  name="motivoAcompanhamentoAnterior"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="motivoDesacolhimentoAnterior"
                  className="text-black font-medium text-lg mb-1"
                >
                  Motivos do desacolhimento anterior
                </label>
                <textarea
                  id="motivoDesacolhimentoAnterior"
                  name="motivoDesacolhimentoAnterior"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="encaminhamentosFamiliaAnteriormenteAoAcolhimento"
                  className="text-black font-medium text-lg mb-1"
                >
                  Encaminhamentos dados á família e ao idoso ou responsável
                  anteriormente ao acolhimento institucional
                </label>
                <textarea
                  id="encaminhamentosFamiliaAnteriormenteAoAcolhimento"
                  name="encaminhamentosFamiliaAnteriormenteAoAcolhimento"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="observacoesAcolhimento"
                  className="text-black font-medium text-lg mb-1"
                >
                  Observações
                </label>
                <textarea
                  id="observacoesAcolhimento"
                  name="observacoesAcolhimento"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                ></textarea>
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
