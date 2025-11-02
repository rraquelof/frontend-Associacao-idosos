import { useState } from "react";

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
              <h3 className="text-black font-bold text-xl">I - DADOS PESSOAIS</h3>

              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />

              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />

              <div className="flex gap-6">
                <input
                  type="text"
                  name="rg"
                  placeholder="RG"
                  className="border p-3 rounded-lg text-lg text-black mt-8 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />

                <div className="flex flex-col">
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
                  />
                </div>

                <input
                  type="text"
                  name="orgaoEmissorRg"
                  placeholder="Órgão Emissor"
                  className="border p-3 rounded-lg text-lg text-black mt-8 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col">
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

                <div className="mt-8">
                  <select
                    name="sexo"
                    className="border p-3 rounded-lg text-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  >
                    <option value="">Sexo</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <input
                  type="text"
                  name="nacionalidade"
                  placeholder="Nacionalidade"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />

                <input
                  type="text"
                  name="naturalidade"
                  placeholder="Naturalidade"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />
              </div>

              <div className="flex gap-6">
                <p className="text-black font-bold text-lg text-center mt-3">
                  Filiação:
                </p>

                <input
                  type="text"
                  name="nomePai"
                  placeholder="Nome do Pai"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                />

                <input
                  type="text"
                  name="nomeMae"
                  placeholder="Nome da Mãe"
                  className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <input
                type="text"
                name="responsavel"
                placeholder="Nome do Responsável"
                className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
              />

              <input
                type="text"
                name="ultimoEndereco"
                placeholder="Último endereço do acolhido"
                className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
              />

              <input
                type="text"
                name="cidade"
                placeholder="Cidade/UF"
                className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
              />

              <input
                type="text"
                name="contato"
                placeholder="Contato"
                className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
              />

              <div className="flex gap-4">
                <input
                  type="text"
                  name="certidaoNascimento"
                  placeholder="Nº da Certidão de Nascimento"
                  className="border p-3 rounded-lg text-lg text-black w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />

                <input
                  type="text"
                  name="folhaCertidao"
                  placeholder="Folha"
                  className="border p-3 rounded-lg text-lg  text-black w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />

                <input
                  type="text"
                  name="livroCertidao"
                  placeholder="Livro"
                  className="border p-3 rounded-lg text-lg text-black w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <input
                type="text"
                name="cartorio"
                placeholder="Cartório"
                className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
              />

              <textarea
                name="observacao"
                id="observacao"
                placeholder="Observações"
                className="border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
              ></textarea>
            </>
          )}

      
          {etapa === 2 && (
            <>
              <h3 className="text-black font-bold text-xl">II - DADOS DO ACOLHIMENTO</h3>

            </>
          )}

          {etapa === 3 && (
            <>
              <h3 className="text-black font-bold text-xl">III - FAMÍLIA</h3>
              
            </>
          )}

          <div className="flex justify-between mt-6">
            {etapa > 1 && (
              <button
                type="button"
                onClick={etapaAnterior}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Voltar
              </button>
            )}

            {etapa < 3 ? (
              <button
                type="button"
                onClick={proximaEtapa}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition ml-auto"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition ml-auto"
              >
                Enviar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
