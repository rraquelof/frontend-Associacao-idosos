import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampoDetalhesIdoso from "../componentes/campo-detalhes-idoso/CampoDetalhesIdoso";
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
    return <div className="min-h-screen bg-gray-200 flex justify-center items-center font-medium">Carregando detalhes...</div>;
  }

  if (erro) {
    return <div className="min-h-screen bg-gray-200 flex justify-center items-center text-red-500 font-bold">Erro: {erro}</div>;
  }

  if (!idoso) {
    return <div className="min-h-screen bg-gray-200 flex justify-center items-center text-gray-500 font-bold">Idoso não encontrado.</div>;
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
          className="absolute left-6 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
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
          <CampoDetalhesIdoso label="CPF" valor={idoso.cpf} />
          <CampoDetalhesIdoso label="RG" valor={idoso.rg} />
          <CampoDetalhesIdoso
            label="Data de emissão do RG"
            valor={formatarDataBR(idoso.dataEmissaoRg)}
          />
          <CampoDetalhesIdoso
            label="Orgão Emissor do Rg"
            valor={idoso.orgaoEmissorRg}
          />
          <CampoDetalhesIdoso label="SUS" valor={idoso.sus} />
          <CampoDetalhesIdoso label="Sexo" valor={idoso.sexo} />
          <CampoDetalhesIdoso label="Naturalidade" valor={idoso.naturalidade} />
          <CampoDetalhesIdoso label="Nome do Pai" valor={idoso.nomePai} />
          <CampoDetalhesIdoso label="Nome da Mãe" valor={idoso.nomeMae} />
          <CampoDetalhesIdoso label="Responsável" valor={idoso.responsavel} />
          <CampoDetalhesIdoso
            label="Último Endereço do Acolhido"
            valor={idoso.ultimoEnderecoDoAcolhido}
          />
          <CampoDetalhesIdoso label="Cidade" valor={idoso.cidade} />
          <CampoDetalhesIdoso label="Contato" valor={idoso.contato} />
          <CampoDetalhesIdoso
            label="Número da Certidão de Nascimento"
            valor={idoso.numCertidaoNascimento}
          />
          <CampoDetalhesIdoso label="Folha" valor={idoso.folha} />
          <CampoDetalhesIdoso label="Livro" valor={idoso.livro} />
          <CampoDetalhesIdoso label="Cartório" valor={idoso.cartorio} />
          <CampoDetalhesIdoso label="CTPS" valor={idoso.ctps} />
          <CampoDetalhesIdoso label="Série" valor={idoso.serie} />
          <CampoDetalhesIdoso label="PIS" valor={idoso.pis} />
          <CampoDetalhesIdoso
            label="Título de Eleitor"
            valor={idoso.tituloEleitor}
          />
          <CampoDetalhesIdoso
            label="Zona do Título de Eleitor"
            valor={idoso.zonaTituloEleitor}
          />
          <CampoDetalhesIdoso
            label="Seção do Título de Eleitor"
            valor={idoso.secaoTituloEleitor}
          />
          <CampoDetalhesIdoso
            label="Observações (Dados Pessoais)"
            valor={idoso.observacoesDadosPessoais}
          />
          <CampoDetalhesIdoso
            label="Data de Acolhimento"
            valor={formatarDataBR(idoso.dataAcolhimento)}
          />
          <CampoDetalhesIdoso
            label="Local de Acolhimento"
            valor={idoso.localAcolhimento}
          />
          <CampoDetalhesIdoso
            label="Encaminhado por"
            valor={idoso.encaminhadoPor}
          />
          <CampoDetalhesIdoso
            label="Motivo do Acolhimento conforme Órgão Emissor"
            valor={idoso.motivoDoAcolhimentoConformeOrgaoEmissor}
          />
          <CampoDetalhesIdoso
            label="Documentação Recebida"
            valor={idoso.documentacaoRecebida}
          />
          <CampoDetalhesIdoso
            label="Condições em que Ocorreu Retirada da Família"
            valor={idoso.condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia}
          />
          <CampoDetalhesIdoso
            label="Condições de Higiene no Momento do Acolhimento"
            valor={idoso.condicoesDeHigieneNoMomentoDoAcolhimento}
          />
          <CampoDetalhesIdoso
            label="Reações e Comportamentos"
            valor={idoso.reacoesEComportamentos}
          />
          <CampoDetalhesIdoso
            label="Sinais de Violência"
            valor={idoso.sinasDeViolencia}
          />
          <CampoDetalhesIdoso
            label="Instituição de Acolhimento Anterior"
            valor={idoso.instituicaoAcolhimentoAnterior}
          />
          <CampoDetalhesIdoso
            label="Data de Entrada no Acolhimento Anterior"
            valor={formatarDataBR(idoso.dataEntradaAcolhimentoAnterior)}
          />
          <CampoDetalhesIdoso
            label="Data de Saída do Acolhimento Anterior"
            valor={formatarDataBR(idoso.dataSaidaAcolhimentoAnterior)}
          />
          <CampoDetalhesIdoso
            label="Motivo do Acolhimento Anterior"
            valor={idoso.motivoAcolhimentoAnterior}
          />
          <CampoDetalhesIdoso
            label="Motivo do Desacolhimento Anterior"
            valor={idoso.motivoDesacolhimentoAnterior}
          />
          <CampoDetalhesIdoso
            label="Encaminhamentos da Família Antes do Acolhimento"
            valor={idoso.encaminhamentosFamiliaAnteriormenteAoAcolhimento}
          />
          <CampoDetalhesIdoso
            label="Observações sobre o Acolhimento"
            valor={idoso.observacoesAcolhimento}
          />
          <CampoDetalhesIdoso
            label="Arranjo Familiar"
            valor={idoso.arranjoFamiliar}
          />
          <CampoDetalhesIdoso
            label="Família Ampliada"
            valor={idoso.familiaAmpliada}
          />
          <CampoDetalhesIdoso
            label="Interessados no Idoso"
            valor={idoso.interessadosNoIdoso}
          />
          <CampoDetalhesIdoso
            label="Família Atendida por Programa Social"
            valor={idoso.familiaAtendidaPorProgramaSocial}
          />
          <CampoDetalhesIdoso
            label="Programa Social da Família"
            valor={idoso.programaSocialDaFamilia}
          />
          <CampoDetalhesIdoso
            label="Quem é Atendido no Programa Social da Família"
            valor={idoso.quemEAtendidoNoProgramaSocialDaFamilia}
          />
          <CampoDetalhesIdoso
            label="Renda de Atividade Laboral ou Pensão Alimentícia"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia
            }
          />
          <CampoDetalhesIdoso
            label="Nome"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaNome
            }
          />
          <CampoDetalhesIdoso
            label="Idade"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaIdade
            }
          />
          <CampoDetalhesIdoso
            label="Parentesco"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaParentesco
            }
          />
          <CampoDetalhesIdoso
            label="Profissão"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaProfisao
            }
          />
          <CampoDetalhesIdoso
            label="Religião"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaReligiao
            }
          />
          <CampoDetalhesIdoso
            label="Escolaridade"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaEscolaridade
            }
          />
          <CampoDetalhesIdoso
            label="Contato"
            valor={
              idoso.familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaContato
            }
          />
          <CampoDetalhesIdoso
            label="Infraestrutura"
            valor={idoso.infraestutura}
          />
          <CampoDetalhesIdoso
            label="Família Atendida por Programa de Saúde"
            valor={idoso.familiaAtendidaPorProgramaSaude}
          />
          <CampoDetalhesIdoso
            label="Serviço de Saúde que Atende a Família"
            valor={idoso.servicoDeSaudeQueAtendeAFamilia}
          />
          <CampoDetalhesIdoso
            label="Local do Serviço de Saúde"
            valor={idoso.localServicoDeSaudeQueAtendeAFamilia}
          />
          <CampoDetalhesIdoso
            label="Quem é Atendido no Serviço de Saúde"
            valor={idoso.quemServicoDeSaudeQueAtendeAFamilia}
          />
          <CampoDetalhesIdoso
            label="Observações sobre o Serviço de Saúde"
            valor={idoso.observacoesServicoDeSaude}
          />
          <CampoDetalhesIdoso
            label="Condições de Habilidade"
            valor={idoso.condicoesDeHabilidade}
          />
          <CampoDetalhesIdoso
            label="Infraestrutura da Comunidade"
            valor={idoso.infraestruturaDeComunidade}
          />
          <CampoDetalhesIdoso
            label="Relação com a Família"
            valor={idoso.relacaoComFamilia}
          />
          <CampoDetalhesIdoso
            label="Percepção da Família sobre o Idoso"
            valor={idoso.percepcaoDaFamiliaSobreIdoso}
          />
          <CampoDetalhesIdoso
            label="Percepção do Idoso sobre a Família"
            valor={idoso.percepcaoIdosoSobreFamilia}
          />
          <CampoDetalhesIdoso
            label="Percepção da Equipe Técnica sobre a Relação Familiar"
            valor={idoso.percepcaoEquipeTecnicaSobreRelacaoFamiliar}
          />
          <CampoDetalhesIdoso
            label="Observações sobre a Relação Familiar"
            valor={idoso.observacoesRelacaoFamiliar}
          />
          <CampoDetalhesIdoso
            label="Idoso Recebe Visita"
            valor={idoso.IdosoRecebeVisita}
          />
          <CampoDetalhesIdoso
            label="Comportamentos do Idoso Durante a Visita"
            valor={idoso.comportamentosIdosoDuranteVisita}
          />
          <CampoDetalhesIdoso
            label="Comportamentos dos Familiares Durante a Visita"
            valor={idoso.comportamentosFamiliaresDuranteVisita}
          />
          <CampoDetalhesIdoso
            label="Idoso Tem Irmãos"
            valor={idoso.idosoTemIrmaos}
          />
          <CampoDetalhesIdoso label="Nome dos Irmãos" valor={idoso.nomeIrmaos} />
          <CampoDetalhesIdoso
            label="Idade dos Irmãos"
            valor={idoso.idadeIrmaos}
          />
          <CampoDetalhesIdoso
            label="Local dos Irmãos"
            valor={idoso.localIrmaos}
          />
          <CampoDetalhesIdoso
            label="Parecer da Equipe Técnica"
            valor={idoso.parecerEquipeTecnica}
          />
          <CampoDetalhesIdoso label="Reavaliação" valor={idoso.reavaliacao} />
        </div>
      </div>

      <div className="flex gap-6 mt-8 mb-8">
        <Botao
          texto="Atualizar"
          variant="update"
          onClick={() => navegacao(`/atualizar/idoso/${idoso.id}`)}
          className="px-8 py-3"
        />
        <Botao
          texto="Deletar"
          variant="delete"
          onClick={() => navegacao(`/deletar/idoso/${idoso.id}`)}
          className="px-8 py-3 bg-red-600 text-white hover:bg-red-700"
        />
      </div>
    </div>
  );
}