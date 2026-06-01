import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampoDetalhes from "../componentes/campo-detalhes-idoso/CampoDetalhes";
import type Idoso from "../modelo/Idoso";
import Botao from "../componentes/botao/Botao";
import { ChevronLeftIcon, User } from "lucide-react";
import { formatarDataBR } from "../formatacao/formatarDataBr";

export default function DetalharIdoso() {
  const { id } = useParams();
  const [idoso, setIdoso] = useState<Idoso | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navegacao = useNavigate();

  useEffect(() => {
    const buscarIdoso = async () => {
      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch(
          `https://api-associacao-idosos.onrender.com/api/idoso/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar dados do idoso");
        }

        const dados = await resposta.json();
        setIdoso({ ...dados, id: dados.id ?? dados._id });
      } catch (err) {
        setErro((err as Error).message);
      } finally {
        setCarregando(false);
      }
    };

    if (id) buscarIdoso();
  }, [id]);

  if (carregando) {
    return <div className="min-h-screen bg-gray-200 flex justify-center items-center text-blue-500 font-medium">Carregando detalhes...</div>;
  }

  if (erro) {
    return <div className="min-h-screen bg-gray-200 flex justify-center items-center text-red-500 font-bold">Erro: {erro}</div>;
  }

  if (!idoso) {
    return <div className="min-h-screen bg-gray-200 flex justify-center items-center text-red-500 font-bold">Idoso não encontrado.</div>;
  }

  const obterUrlImagem = (caminhoImagem?: string) => {
    if (!caminhoImagem) return "";
    if (caminhoImagem.startsWith("http")) return caminhoImagem;
    const urlServidor = "https://api-associacao-idosos.onrender.com";
    return caminhoImagem.startsWith("/") ? `${urlServidor}${caminhoImagem}` : `${urlServidor}/${caminhoImagem}`;
  };

  return (
    <div className="w-screen min-h-screen bg-gray-200 box-border flex flex-col items-center">
      <div className="text-black p-6 w-full max-w-4xl flex items-center relative mt-4">
        <Botao
          className="absolute left-0 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
          onClick={() => navegacao("/lista/idosos")}
        >
          <ChevronLeftIcon />
        </Botao>
        <h1 className="text-3xl font-bold text-center w-full">
          Perfil do Idoso
        </h1>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl max-h-[75vh] overflow-y-auto flex flex-col">

        <div className="w-full flex flex-col items-center pt-10 pb-6 border-b border-gray-100 bg-gray-50">
          {idoso.foto ? (
            <img
              src={obterUrlImagem(idoso.foto)}
              alt={`Foto de ${idoso.nome}`}
              className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg bg-gray-200"
            />
          ) : (
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-gray-400">
              <User size={64} />
            </div>
          )}
          <h2 className="text-3xl font-extrabold text-gray-900 mt-4">{idoso.nome}</h2>
          <p className="text-gray-500 font-medium">{idoso.nacionalidade} • {formatarDataBR(idoso.dataNascimento)}</p>
        </div>

        <div className="p-8 flex flex-wrap gap-4 content-start">
          <CampoDetalhes label="CPF" valor={idoso.cpf} />
          <CampoDetalhes label="RG" valor={idoso.rg} />
          <CampoDetalhes
            label="Data de emissão do RG"
            valor={formatarDataBR(idoso.dataEmissaoRg)}
          />
          <CampoDetalhes
            label="Orgão Emissor do Rg"
            valor={idoso.orgaoEmissorRg}
          />
          <CampoDetalhes label="SUS" valor={idoso.sus} />
          <CampoDetalhes label="Sexo" valor={idoso.sexo} />
          <CampoDetalhes label="Naturalidade" valor={idoso.naturalidade} />
          <CampoDetalhes label="Nome do Pai" valor={idoso.nomePai} />
          <CampoDetalhes label="Nome da Mãe" valor={idoso.nomeMae} />
          <CampoDetalhes label="Responsável" valor={idoso.responsavel} />
          <CampoDetalhes
            label="Último Endereço do Acolhido"
            valor={idoso.ultimoEnderecoDoAcolhido}
          />
          <CampoDetalhes label="Cidade" valor={idoso.cidade} />
          <CampoDetalhes label="Contato" valor={idoso.contato} />
          <CampoDetalhes
            label="Número da Certidão de Nascimento"
            valor={idoso.numCertidaoNascimento}
          />
          <CampoDetalhes label="Folha" valor={idoso.folha} />
          <CampoDetalhes label="Livro" valor={idoso.livro} />
          <CampoDetalhes label="Cartório" valor={idoso.cartorio} />
          <CampoDetalhes label="CTPS" valor={idoso.ctps} />
          <CampoDetalhes label="Série" valor={idoso.serie} />
          <CampoDetalhes label="PIS" valor={idoso.pis} />
          <CampoDetalhes
            label="Título de Eleitor"
            valor={idoso.tituloEleitor}
          />
          <CampoDetalhes
            label="Zona do Título de Eleitor"
            valor={idoso.zonaTituloEleitor}
          />
          <CampoDetalhes
            label="Seção do Título de Eleitor"
            valor={idoso.secaoTituloEleitor}
          />
          <CampoDetalhes
            label="Observações (Dados Pessoais)"
            valor={idoso.observacoesDadosPessoais}
          />
          <CampoDetalhes
            label="Data de Acolhimento"
            valor={formatarDataBR(idoso.dataAcolhimento)}
          />
          <CampoDetalhes
            label="Local de Acolhimento"
            valor={idoso.localAcolhimento}
          />
          <CampoDetalhes
            label="Encaminhado por"
            valor={idoso.encaminhadoPor}
          />
          <CampoDetalhes
            label="Motivo do Acolhimento conforme Órgão Emissor"
            valor={idoso.motivoDoAcolhimentoConformeOrgaoEmissor}
          />
          <CampoDetalhes
            label="Documentação Recebida"
            valor={idoso.documentacaoRecebida}
          />
          <CampoDetalhes
            label="Condições em que Ocorreu Retirada da Família"
            valor={idoso.condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia}
          />
          <CampoDetalhes
            label="Condições de Higiene no Momento do Acolhimento"
            valor={idoso.condicoesDeHigieneNoMomentoDoAcolhimento}
          />
          <CampoDetalhes
            label="Reações e Comportamentos"
            valor={idoso.reacoesEComportamentos}
          />
          <CampoDetalhes
            label="Sinais de Violência"
            valor={idoso.sinasDeViolencia}
          />
          <CampoDetalhes
            label="Instituição de Acolhimento Anterior"
            valor={idoso.instituicaoAcolhimentoAnterior}
          />
          <CampoDetalhes
            label="Data de Entrada no Acolhimento Anterior"
            valor={formatarDataBR(idoso.dataEntradaAcolhimentoAnterior)}
          />
          <CampoDetalhes
            label="Data de Saída do Acolhimento Anterior"
            valor={formatarDataBR(idoso.dataSaidaAcolhimentoAnterior)}
          />
          <CampoDetalhes
            label="Motivo do Acolhimento Anterior"
            valor={idoso.motivoAcolhimentoAnterior}
          />
          <CampoDetalhes
            label="Motivo do Desacolhimento Anterior"
            valor={idoso.motivoDesacolhimentoAnterior}
          />
          <CampoDetalhes
            label="Encaminhamentos da Família Antes do Acolhimento"
            valor={idoso.encaminhamentosFamiliaAnteriormenteAoAcolhimento}
          />
          <CampoDetalhes
            label="Observações sobre o Acolhimento"
            valor={idoso.observacoesAcolhimento}
          />
          <CampoDetalhes
            label="Arranjo Familiar"
            valor={idoso.arranjoFamiliar}
          />
          <CampoDetalhes
            label="Família Ampliada"
            valor={idoso.familiaAmpliada}
          />
          <CampoDetalhes
            label="Interessados no Idoso"
            valor={idoso.interessadosNoIdoso}
          />
          <CampoDetalhes
            label="Família Atendida por Programa Social"
            valor={idoso.familiaAtendidaPorProgramaSocial}
          />
          <CampoDetalhes
            label="Programa Social da Família"
            valor={idoso.programaSocialDaFamilia}
          />
          <CampoDetalhes
            label="Quem é Atendido no Programa Social da Família"
            valor={idoso.quemEAtendidoNoProgramaSocialDaFamilia}
          />
          <CampoDetalhes
            label="Renda de Atividade Laboral ou Pensão Alimentícia"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia
            }
          />
          <CampoDetalhes
            label="Nome"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaNome
            }
          />
          <CampoDetalhes
            label="Idade"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaIdade
            }
          />
          <CampoDetalhes
            label="Parentesco"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaParentesco
            }
          />
          <CampoDetalhes
            label="Profissão"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaProfisao
            }
          />
          <CampoDetalhes
            label="Religião"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaReligiao
            }
          />
          <CampoDetalhes
            label="Escolaridade"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaEscolaridade
            }
          />
          <CampoDetalhes
            label="Contato"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaContato
            }
          />
          <CampoDetalhes
            label="Infraestrutura"
            valor={idoso.infraestutura}
          />
          <CampoDetalhes
            label="Família Atendida por Programa de Saúde"
            valor={idoso.familiaAtendidaPorProgramaSaude}
          />
          <CampoDetalhes
            label="Serviço de Saúde que Atende a Família"
            valor={idoso.servicoDeSaudeQueAtendeAFamilia}
          />
          <CampoDetalhes
            label="Local do Serviço de Saúde"
            valor={idoso.localServicoDeSaudeQueAtendeAFamilia}
          />
          <CampoDetalhes
            label="Quem é Atendido no Serviço de Saúde"
            valor={idoso.quemServicoDeSaudeQueAtendeAFamilia}
          />
          <CampoDetalhes
            label="Observações sobre o Serviço de Saúde"
            valor={idoso.observacoesServicoDeSaude}
          />
          <CampoDetalhes
            label="Condições de Habilidade"
            valor={idoso.condicoesDeHabilidade}
          />
          <CampoDetalhes
            label="Infraestrutura da Comunidade"
            valor={idoso.infraestruturaDeComunidade}
          />
          <CampoDetalhes
            label="Relação com a Família"
            valor={idoso.relacaoComFamilia}
          />
          <CampoDetalhes
            label="Percepção da Família sobre o Idoso"
            valor={idoso.percepcaoDaFamiliaSobreIdoso}
          />
          <CampoDetalhes
            label="Percepção do Idoso sobre a Família"
            valor={idoso.percepcaoIdosoSobreFamilia}
          />
          <CampoDetalhes
            label="Percepção da Equipe Técnica sobre a Relação Familiar"
            valor={idoso.percepcaoEquipeTecnicaSobreRelacaoFamiliar}
          />
          <CampoDetalhes
            label="Observações sobre a Relação Familiar"
            valor={idoso.observacoesRelacaoFamiliar}
          />
          <CampoDetalhes
            label="Idoso Recebe Visita"
            valor={idoso.IdosoRecebeVisita}
          />
          <CampoDetalhes
            label="Comportamentos do Idoso Durante a Visita"
            valor={idoso.comportamentosIdosoDuranteVisita}
          />
          <CampoDetalhes
            label="Comportamentos dos Familiares Durante a Visita"
            valor={idoso.comportamentosFamiliaresDuranteVisita}
          />
          <CampoDetalhes
            label="Idoso Tem Irmãos"
            valor={idoso.idosoTemIrmaos}
          />
          <CampoDetalhes label="Nome dos Irmãos" valor={idoso.nomeIrmaos} />
          <CampoDetalhes
            label="Idade dos Irmãos"
            valor={idoso.idadeIrmaos}
          />
          <CampoDetalhes
            label="Local dos Irmãos"
            valor={idoso.localIrmaos}
          />
          <CampoDetalhes
            label="Parecer da Equipe Técnica"
            valor={idoso.parecerEquipeTecnica}
          />
          <CampoDetalhes label="Reavaliação" valor={idoso.reavaliacao} />
        </div>
      </div>

      <div className="flex gap-6 mt-8 mb-8">
        <Botao
          texto="Atualizar"
          variant="update"
          onClick={() => navegacao(`/atualizar/idoso/${idoso._id}`)}
          className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md rounded-xl transition"
        />
        <Botao
          texto="Deletar"
          variant="delete"
          onClick={() => navegacao(`/deletar/idoso/${idoso._id}`)}
          className="px-8 py-3 bg-red-600 text-white hover:bg-red-700 font-semibold shadow-md rounded-xl transition"
        />
      </div>
    </div>
  );
}