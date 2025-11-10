import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Idoso {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  dataEmissaoRg: string;
  orgaoEmissorRg: string;
  sus: string;
  data_nascimento: string;
  sexo: string;
  nacionalidade: string;
  naturalidade: string;
  foto: string;
  nomePai: string;
  nomeMae: string;
  responsavel: string;
  ultimoEnderecoDoAcolhido: string;
  cidade: string;
  contato: string;
  numCertidaoNascimento: string;
  folha: string;
  livro: string;
  cartorio: string;
  ctps: string;
  serie: string;
  pis: string;
  tituloEleitor: string;
  zonaTituloEleitor: string;
  secaoTituloEleitor: string;
  observacoesDadosPessoais: string;
  dataAcolhimento: string;
  localAcolhimento: string;
  encaminhadoPor: string;
  motivoDoAcolhimentoConformeOrgaoEmissor: string;
  documentacaoRecebida: string;
  condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia: string;
  condicoesDeHigieneNoMomentoDoAcolhimento: string;
  reacoesEComportamentos: string;
  sinasDeViolencia: string;
  instituicaoAcolhimentoAnterior: string;
  dataEntradaAcolhimentoAnterior: string;
  dataSaidaAcolhimentoAnterior: string;
  motivoAcolhimentoAnterior: string;
  motivoDesacolhimentoAnterior: string;
  encaminhamentosFamiliaAnteriormenteAoAcolhimento: string;
  observacoesAcolhimento: string;
  arranjoFamiliar: string;
  familiaAmpliada: string;
  interessadosNoIdoso: string;
  familiaAtendidaPorProgramaSocial: string;
  programaSocialDaFamilia: string;
  quemEAtendidoNoProgramaSocialDaFamilia: string;
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia: string;
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaNome: string;
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaIdade: string;
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaParentesco: string;
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaProfisao: string;
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaReligiao: string;
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaEscolaridade: string;
  familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaContato: string;
  infraestutura: string;
  familiaAtendidaPorProgramaSaude: string;
  servicoDeSaudeQueAtendeAFamilia: string;
  localServicoDeSaudeQueAtendeAFamilia: string;
  quemServicoDeSaudeQueAtendeAFamilia: string;
  observacoesServicoDeSaude: string;
  condicoesDeHabilidade: string;
  infraestruturaDeComunidade: string;
  relacaoComFamilia: string;
  percepcaoDaFamiliaSobreIdoso: string;
  percepcaoIdosoSobreFamilia: string;
  percepcaoEquipeTecnicaSobreRelacaoFamiliar: string;
  observacoesRelacaoFamiliar: string;
  IdosoRecebeVisita: string;
  comportamentosIdosoDuranteVisita: string;
  comportamentosFamiliaresDuranteVisita: string;
  idosoTemIrmaos: string;
  nomeIrmaos: string;
  idadeIrmaos: string;
  localIrmaos: string;
  parecerEquipeTecnica: string;
  reavaliacao: string;
}

export default function DetalharIdoso() {
  const { id } = useParams(); // pega o id da rota /idosos/:id
  const [idoso, setIdoso] = useState<Idoso | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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
      setIdoso(dados);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  if (id) buscarIdoso();
}, [id]);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p className="text-red-500">Erro: {erro}</p>;
  }

  if (!idoso) {
    return <p>Idoso não encontrado.</p>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-purple-600">
        Detalhes do Idoso
      </h1>

      <p><strong>Nome:</strong> {idoso.nome}</p>
      <p><strong>CPF:</strong> {idoso.cpf}</p>
      <p><strong>RG:</strong> {idoso.rg}</p>
      <p><strong>Data de nascimento:</strong> {idoso.data_nascimento}</p>
    </div>
  );
}
