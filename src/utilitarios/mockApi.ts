import type Idoso from "../modelo/Idoso";
import type RegistroSaudeIdoso from "../modelo/RegistroSaudeIdoso";
import type Usuario from "../modelo/Usuario";
import type Visita from "../modelo/Visita";
import { processarAgenteComApiSistema } from "./agenteIA";

const API_BASE = "https://api-associacao-idosos.onrender.com/api";

const STORAGE_KEYS = {
  usuarios: "sigaai_mock_usuarios_v1",
  idosos: "sigaai_mock_idosos_v1",
  saude: "sigaai_mock_saude_v1",
  eventos: "sigaai_mock_eventos_v1",
  visitas: "sigaai_mock_visitas_v1",
};

export function gerarTokenMock(id: string, tipo: string): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      id,
      tipo,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    })
  );
  return `${header}.${payload}.mock-signature`;
}

function isoComOffsetDias(diasOffset: number, hora = 10, minuto = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + diasOffset);
  d.setHours(hora, minuto, 0, 0);
  return d.toISOString();
}

const USUARIOS_INICIAIS: (Usuario & { _id: string; senha?: string })[] = [
  {
    _id: "usr-coord-01",
    id: "usr-coord-01",
    nome: "Ana Beatriz Albuquerque",
    email: "coordenador@lucazorn.org",
    cpf: "124.589.632-10",
    tipo: "coordenador",
    sexo: "feminino",
    endereco: "Rua Padre Rolim, 412, Centro - Cajazeiras/PB",
    telefone: "(83) 99812-4401",
  },
  {
    _id: "usr-enf-01",
    id: "usr-enf-01",
    nome: "Dr. Carlos Eduardo Mendes",
    email: "enfermeiro@lucazorn.org",
    cpf: "358.741.963-25",
    tipo: "enfermeiro",
    sexo: "masculino",
    endereco: "Av. Engenheiro Carlos Pires de Sá, 890 - Cajazeiras/PB",
    telefone: "(83) 99645-8820",
  },
  {
    _id: "usr-vol-01",
    id: "usr-vol-01",
    nome: "Mariana Costa Ferreira",
    email: "voluntario@lucazorn.org",
    cpf: "741.852.963-04",
    tipo: "voluntario",
    sexo: "feminino",
    endereco: "Rua Coronel Juvêncio Carneiro, 155 - Cajazeiras/PB",
    telefone: "(83) 99104-3319",
  },
  {
    _id: "usr-fam-01",
    id: "usr-fam-01",
    nome: "Roberto Gonçalves Moreira",
    email: "familiar@lucazorn.org",
    cpf: "852.963.147-88",
    tipo: "familiar",
    sexo: "masculino",
    endereco: "Rua Victor Jurema, 230 - Cajazeiras/PB",
    telefone: "(83) 99321-7754",
    idosoVinculado: "idoso-01",
  },
];

const IDOSOS_INICIAIS: Idoso[] = [
  {
    _id: "idoso-01",
    nome: "Maria das Graças Moreira",
    cpf: "145.236.987-01",
    rg: "1.452.890",
    dataEmissaoRg: new Date("1982-04-15"),
    orgaoEmissorRg: "SSP/PB",
    sus: "704501289632145",
    dataNascimento: new Date("1944-05-12"),
    sexo: "Feminino",
    nacionalidade: "Brasil",
    naturalidade: "Cajazeiras - PB",
    nomePai: "Antônio Joaquim Moreira",
    nomeMae: "Francisca das Chagas Moreira",
    responsavel: "Roberto Gonçalves Moreira (Filho)",
    ultimoEnderecoDoAcolhido: "Rua Sebastião Bandeira, 118, Bela Vista",
    cidade: "Cajazeiras - PB",
    contato: "(83) 99321-7754",
    numCertidaoNascimento: "45821",
    folha: "112-V",
    livro: "A-24",
    cartorio: "1º Ofício de Registro Civil de Cajazeiras",
    ctps: "45892",
    serie: "0012-PB",
    pis: "120.4589.741-2",
    tituloEleitor: "0145 8963 0412",
    zonaTituloEleitor: "042",
    secaoTituloEleitor: "0108",
    observacoesDadosPessoais: "Aposentada rural. Gosta de música regional, crochê e jardinagem.",
    dataAcolhimento: new Date("2023-03-10"),
    localAcolhimento: "Abrigo Luca Zorn — Ala Jardim",
    encaminhadoPor: "CREAS Cajazeiras / Solicitação Familiar",
    motivoDoAcolhimentoConformeOrgaoEmissor: "Necessidade de acompanhamento contínuo em tempo integral e suporte multiprofissional de saúde.",
    documentacaoRecebida: "RG, CPF, Cartão SUS, Certidão de Nascimento, Comprovante de Benefício INSS e Receituário Médico.",
    condicoesEmQueOcorreuRetiradaDoIdosoDaFamilia: "Transição consensual e acompanhada pela equipe psicossocial junto ao filho.",
    condicoesDeHigieneNoMomentoDoAcolhimento: "Satisfatórias, bem cuidada.",
    reacoesEComportamentos: "Comunicativa, tranquila e receptiva com a equipe de enfermagem e demais residentes.",
    sinasDeViolencia: "Não constatados.",
    instituicaoAcolhimentoAnterior: "Não houve",
    observacoesAcolhimento: "Adaptação excelente nas primeiras semanas.",
    arranjoFamiliar: "Possui dois filhos adultos que residem na região.",
    familiaAmpliada: "Sobrinhas e netos participativos nas festividades do abrigo.",
    interessadosNoIdoso: "Roberto Gonçalves Moreira (Filho) e Lúcia Moreira (Neta).",
    familiaAtendidaPorProgramaSocial: "Não",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticia: "Sim",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaNome: "Roberto Gonçalves Moreira",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaIdade: "52",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaParentesco: "Filho",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaProfisao: "Comerciante",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaReligiao: "Católica",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaEscolaridade: "Ensino Médio Completo",
    familiaresPossuemRendaDeAtividadeLaboralOuPensaoAlimenticiaContato: "(83) 99321-7754",
    infraestutura: "Casa de alvenaria com saneamento completo.",
    familiaAtendidaPorProgramaSaude: "Sim",
    servicoDeSaudeQueAtendeAFamilia: "ESF Bela Vista / Policlínica Municipal",
    localServicoDeSaudeQueAtendeAFamilia: "Cajazeiras - PB",
    quemServicoDeSaudeQueAtendeAFamilia: "Núcleo familiar",
    observacoesServicoDeSaude: "Realiza exames cardiológicos semestrais.",
    condicoesDeHabilidade: "Deambula de forma independente, lúcida e orientada.",
    infraestruturaDeComunidade: "Bairro urbanizado com acesso a transporte e posto de saúde.",
    relacaoComFamilia: "Vínculo afetivo preservado e harmonioso.",
    percepcaoDaFamiliaSobreIdoso: "Carinhosa, preocupada com o bem-estar e segurança da idosa.",
    percepcaoIdosoSobreFamilia: "Sente-se amada e aguarda com alegria as visitas semanais.",
    percepcaoEquipeTecnicaSobreRelacaoFamiliar: "Família colaborativa com o Plano Individual de Atendimento (PIA).",
    observacoesRelacaoFamiliar: "Visitas regulares aos finais de semana.",
    IdosoRecebeVisita: "Sim",
    comportamentosIdosoDuranteVisita: "Alegre, conversadeira e afetuosa.",
    comportamentosFamiliaresDuranteVisita: "Atenciosos e prestativos.",
    idosoTemIrmaos: "Sim",
    nomeIrmaos: "Severina Moreira de Sousa",
    idadeIrmaos: "78 anos",
    localIrmaos: "Sousa - PB",
    parecerEquipeTecnica: "Idosa bem adaptada à rotina institucional, participativa nas oficinas terapêuticas e com quadro clínico estável.",
    reavaliacao: "Semestral — Última revisão realizada com parecer favorável à manutenção das atividades atuais.",
  },
  {
    _id: "idoso-02",
    nome: "José Raimundo Cavalcante",
    cpf: "268.951.753-40",
    rg: "985.412",
    dataEmissaoRg: new Date("1978-09-20"),
    orgaoEmissorRg: "SSP/PB",
    sus: "706809874123650",
    dataNascimento: new Date("1939-11-03"),
    sexo: "Masculino",
    nacionalidade: "Brasil",
    naturalidade: "Sousa - PB",
    nomePai: "Raimundo Nonato Cavalcante",
    nomeMae: "Josefa Batista Cavalcante",
    responsavel: "Helena Cavalcante (Sobrinha)",
    ultimoEnderecoDoAcolhido: "Sítio São José, Zona Rural",
    cidade: "Sousa - PB",
    contato: "(83) 99844-1120",
    observacoesDadosPessoais: "Ex-agricultor e tocador de sanfona. Adora rodas de conversa e dominó.",
    dataAcolhimento: new Date("2022-07-18"),
    localAcolhimento: "Abrigo Luca Zorn — Ala Sol Nascente",
    encaminhadoPor: "Assistência Social Municipal",
    motivoDoAcolhimentoConformeOrgaoEmissor: "Morava sozinho na zona rural com dificuldades de locomoção e preparo de refeições.",
    documentacaoRecebida: "RG, CPF, Cartão SUS e Cartão do Aposentado.",
    condicoesDeHigieneNoMomentoDoAcolhimento: "Regulares.",
    reacoesEComportamentos: "Bem-humorado, colaborativo e muito querido pelos colegas.",
    sinasDeViolencia: "Não constatados.",
    IdosoRecebeVisita: "Sim",
    parecerEquipeTecnica: "Quadro hipertensivo controlado com medicação diária e acompanhamento nutricional.",
    reavaliacao: "Trimestral.",
  },
  {
    _id: "idoso-03",
    nome: "Francisca das Chagas Bezerra",
    cpf: "389.412.658-92",
    rg: "1.124.785",
    dataEmissaoRg: new Date("1985-02-11"),
    orgaoEmissorRg: "SSP/PB",
    sus: "701204589632587",
    dataNascimento: new Date("1941-08-24"),
    sexo: "Feminino",
    nacionalidade: "Brasil",
    naturalidade: "Cajazeiras - PB",
    nomePai: "Manoel Bezerra da Silva",
    nomeMae: "Luzia Gomes Bezerra",
    responsavel: "Paulo Bezerra (Irmão)",
    ultimoEnderecoDoAcolhido: "Rua Padre Ibiapina, 304, Centro",
    cidade: "Cajazeiras - PB",
    contato: "(83) 99610-5590",
    observacoesDadosPessoais: "Ex-costureira. Participa ativamente das atividades religiosas e oficinas de memória.",
    dataAcolhimento: new Date("2023-08-05"),
    localAcolhimento: "Abrigo Luca Zorn — Ala Jardim",
    encaminhadoPor: "CREAS Cajazeiras",
    motivoDoAcolhimentoConformeOrgaoEmissor: "Fragilidade clínica e necessidade de supervisão de enfermagem 24h.",
    documentacaoRecebida: "Documentação civil completa e laudo médico.",
    condicoesDeHigieneNoMomentoDoAcolhimento: "Boas.",
    reacoesEComportamentos: "Calma, educada e participativa.",
    sinasDeViolencia: "Não constatados.",
    IdosoRecebeVisita: "Sim",
    parecerEquipeTecnica: "Excelente evolução motora após início das sessões de fisioterapia no abrigo.",
    reavaliacao: "Semestral.",
  },
  {
    _id: "idoso-04",
    nome: "Antônio Ferreira de Andrade",
    cpf: "412.753.951-18",
    rg: "1.698.321",
    dataEmissaoRg: new Date("1980-06-30"),
    orgaoEmissorRg: "SSP/PB",
    sus: "708903214569874",
    dataNascimento: new Date("1946-02-19"),
    sexo: "Masculino",
    nacionalidade: "Brasil",
    naturalidade: "São João do Rio do Peixe - PB",
    nomePai: "Sebastião Ferreira de Andrade",
    nomeMae: "Maria Nazaré de Andrade",
    responsavel: "Marcos Vinícius de Andrade (Filho)",
    ultimoEnderecoDoAcolhido: "Rua Sete de Setembro, 89",
    cidade: "São João do Rio do Peixe - PB",
    contato: "(83) 99188-2040",
    observacoesDadosPessoais: "Ex-ferroviário. Gosta de leitura de jornais e caminhadas matinais no pátio.",
    dataAcolhimento: new Date("2024-01-22"),
    localAcolhimento: "Abrigo Luca Zorn — Ala Sol Nascente",
    encaminhadoPor: "Demanda Espontânea / Família",
    motivoDoAcolhimentoConformeOrgaoEmissor: "Necessidade de cuidados diários e controle glicêmico rigoroso.",
    documentacaoRecebida: "RG, CPF, SUS, CTPS e exames laboratoriais.",
    condicoesDeHigieneNoMomentoDoAcolhimento: "Ótimas.",
    reacoesEComportamentos: "Ativo, lúcido e prestativo.",
    sinasDeViolencia: "Não constatados.",
    IdosoRecebeVisita: "Sim",
    parecerEquipeTecnica: "Residente com ótima autonomia funcional; glicemia monitorada regularmente.",
    reavaliacao: "Semestral.",
  },
  {
    _id: "idoso-05",
    nome: "Terezinha de Jesus Nogueira",
    cpf: "591.357.486-63",
    rg: "1.845.102",
    dataEmissaoRg: new Date("1988-10-14"),
    orgaoEmissorRg: "SSP/PB",
    sus: "703305478961230",
    dataNascimento: new Date("1948-10-08"),
    sexo: "Feminino",
    nacionalidade: "Brasil",
    naturalidade: "Patos - PB",
    nomePai: "Joaquim Nogueira Leite",
    nomeMae: "Rita de Cássia Nogueira",
    responsavel: "Camila Nogueira (Sobrinha)",
    ultimoEnderecoDoAcolhido: "Av. Epitácio Pessoa, 512",
    cidade: "Patos - PB",
    contato: "(83) 99912-6070",
    observacoesDadosPessoais: "Professora aposentada. Coordena o clube de leitura entre os residentes.",
    dataAcolhimento: new Date("2024-04-12"),
    localAcolhimento: "Abrigo Luca Zorn — Ala Jardim",
    encaminhadoPor: "Defensoria Pública / Assistência Social",
    motivoDoAcolhimentoConformeOrgaoEmissor: "Ausência de rede de apoio domiciliar diurna.",
    documentacaoRecebida: "RG, CPF, Cartão SUS e Título de Eleitor.",
    condicoesDeHigieneNoMomentoDoAcolhimento: "Satisfatórias.",
    reacoesEComportamentos: "Muito comunicativa, afetuosa e integrada às atividades culturais.",
    sinasDeViolencia: "Não constatados.",
    IdosoRecebeVisita: "Sim",
    parecerEquipeTecnica: "Plena adaptação social e estabilidade clínica.",
    reavaliacao: "Semestral.",
  },
];

function criarRegistrosSaudeIniciais(): RegistroSaudeIdoso[] {
  const enfermeiro = { _id: "usr-enf-01", nome: "Dr. Carlos Eduardo Mendes" };
  return [
    // Maria das Graças (idoso-01) — histórico + consulta hoje
    {
      _id: "saude-01",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-01", nome: "Maria das Graças Moreira" },
      dataConsulta: new Date(isoComOffsetDias(-90, 9, 0)),
      altura: 1.58,
      peso: 61.2,
      pressao: "130/80",
      glicemia: 98,
      estadoNutricional: "normal",
      alergias: ["Dipirona"],
      doencasCronicas: ["Hipertensão arterial"],
    },
    {
      _id: "saude-02",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-01", nome: "Maria das Graças Moreira" },
      dataConsulta: new Date(isoComOffsetDias(-60, 9, 30)),
      altura: 1.58,
      peso: 61.8,
      pressao: "125/80",
      glicemia: 94,
      estadoNutricional: "normal",
      alergias: ["Dipirona"],
      doencasCronicas: ["Hipertensão arterial"],
    },
    {
      _id: "saude-03",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-01", nome: "Maria das Graças Moreira" },
      dataConsulta: new Date(isoComOffsetDias(-30, 10, 0)),
      altura: 1.58,
      peso: 62.1,
      pressao: "120/80",
      glicemia: 92,
      estadoNutricional: "normal",
      alergias: ["Dipirona"],
      doencasCronicas: ["Hipertensão arterial"],
    },
    {
      _id: "saude-04",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-01", nome: "Maria das Graças Moreira" },
      dataConsulta: new Date(isoComOffsetDias(0, 8, 30)), // HOJE
      altura: 1.58,
      peso: 62.4,
      pressao: "120/78",
      glicemia: 90,
      estadoNutricional: "normal",
      alergias: ["Dipirona"],
      doencasCronicas: ["Hipertensão arterial"],
    },

    // José Raimundo (idoso-02) — histórico + consulta hoje
    {
      _id: "saude-05",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-02", nome: "José Raimundo Cavalcante" },
      dataConsulta: new Date(isoComOffsetDias(-60, 10, 15)),
      altura: 1.68,
      peso: 71.0,
      pressao: "135/85",
      glicemia: 108,
      estadoNutricional: "normal",
      alergias: ["Penicilina"],
      doencasCronicas: ["Hipertensão arterial", "Artrose"],
    },
    {
      _id: "saude-06",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-02", nome: "José Raimundo Cavalcante" },
      dataConsulta: new Date(isoComOffsetDias(-30, 10, 45)),
      altura: 1.68,
      peso: 70.6,
      pressao: "130/80",
      glicemia: 102,
      estadoNutricional: "normal",
      alergias: ["Penicilina"],
      doencasCronicas: ["Hipertensão arterial", "Artrose"],
    },
    {
      _id: "saude-07",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-02", nome: "José Raimundo Cavalcante" },
      dataConsulta: new Date(isoComOffsetDias(0, 9, 15)), // HOJE
      altura: 1.68,
      peso: 70.8,
      pressao: "128/80",
      glicemia: 99,
      estadoNutricional: "normal",
      alergias: ["Penicilina"],
      doencasCronicas: ["Hipertensão arterial", "Artrose"],
    },

    // Francisca das Chagas (idoso-03) — histórico + consulta hoje
    {
      _id: "saude-08",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-03", nome: "Francisca das Chagas Bezerra" },
      dataConsulta: new Date(isoComOffsetDias(-45, 14, 0)),
      altura: 1.54,
      peso: 53.5,
      pressao: "118/75",
      glicemia: 88,
      estadoNutricional: "baixo peso",
      alergias: [],
      doencasCronicas: ["Osteoporose"],
    },
    {
      _id: "saude-09",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-03", nome: "Francisca das Chagas Bezerra" },
      dataConsulta: new Date(isoComOffsetDias(0, 10, 0)), // HOJE
      altura: 1.54,
      peso: 55.1,
      pressao: "120/76",
      glicemia: 86,
      estadoNutricional: "normal",
      alergias: [],
      doencasCronicas: ["Osteoporose"],
    },

    // Antônio Ferreira (idoso-04) — histórico anterior
    {
      _id: "saude-10",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-04", nome: "Antônio Ferreira de Andrade" },
      dataConsulta: new Date(isoComOffsetDias(-40, 11, 0)),
      altura: 1.72,
      peso: 79.4,
      pressao: "130/82",
      glicemia: 126,
      estadoNutricional: "sobrepeso",
      alergias: ["Sulfa"],
      doencasCronicas: ["Diabetes Tipo 2", "Hipertensão arterial"],
    },
    {
      _id: "saude-11",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-04", nome: "Antônio Ferreira de Andrade" },
      dataConsulta: new Date(isoComOffsetDias(-10, 11, 0)),
      altura: 1.72,
      peso: 77.8,
      pressao: "124/80",
      glicemia: 112,
      estadoNutricional: "normal",
      alergias: ["Sulfa"],
      doencasCronicas: ["Diabetes Tipo 2", "Hipertensão arterial"],
    },

    // Terezinha de Jesus (idoso-05) — histórico anterior
    {
      _id: "saude-12",
      usuarioId: enfermeiro,
      idosoId: { _id: "idoso-05", nome: "Terezinha de Jesus Nogueira" },
      dataConsulta: new Date(isoComOffsetDias(-20, 15, 30)),
      altura: 1.6,
      peso: 63.0,
      pressao: "120/80",
      glicemia: 91,
      estadoNutricional: "normal",
      alergias: ["Látex"],
      doencasCronicas: ["Hipotireoidismo"],
    },
  ];
}

function criarEventosIniciais() {
  return [
    {
      _id: "evento-01",
      nome: "Oficina de Música e Forró Pé de Serra",
      descricao:
        "Tarde musical no pátio principal com sanfoneiro convidado, cantoria de clássicos nordestinos e integração entre residentes e voluntários.",
      data: isoComOffsetDias(0, 15, 30), // HOJE
      local: {
        type: "Point",
        coordinates: [-38.5586, -6.8894],
      },
      idosos: ["idoso-01", "idoso-02", "idoso-03", "idoso-05"],
    },
    {
      _id: "evento-02",
      nome: "Roda de Fisioterapia e Alongamento Matinal",
      descricao:
        "Atividade coletiva guiada pela equipe de saúde no jardim do Abrigo Luca Zorn para estímulo da mobilidade, equilíbrio e bem-estar.",
      data: isoComOffsetDias(0, 8, 30), // HOJE
      local: {
        type: "Point",
        coordinates: [-38.5592, -6.8889],
      },
      idosos: ["idoso-01", "idoso-02", "idoso-03", "idoso-04", "idoso-05"],
    },
    {
      _id: "evento-03",
      nome: "Oficina de Artesanato e Pintura em Tela",
      descricao:
        "Atividade de terapia ocupacional voltada à coordenação motora fina e expressão artística dos residentes.",
      data: isoComOffsetDias(2, 14, 0),
      local: {
        type: "Point",
        coordinates: [-38.5586, -6.8894],
      },
      idosos: ["idoso-01", "idoso-03", "idoso-05"],
    },
    {
      _id: "evento-04",
      nome: "Bingo Solidário e Lanche Compartilhado",
      descricao:
        "Encontro recreativo mensal com a presença dos familiares, sorteio de brindes simbólicos e bolo de milho tradicional.",
      data: isoComOffsetDias(5, 16, 0),
      local: {
        type: "Point",
        coordinates: [-38.5578, -6.8901],
      },
      idosos: ["idoso-01", "idoso-02", "idoso-04", "idoso-05"],
    },
    {
      _id: "evento-05",
      nome: "Celebração Ecumênica de Ação de Graças",
      descricao:
        "Momento de espiritualidade, cânticos e bênção na capela do abrigo aberto à comunidade e familiares.",
      data: isoComOffsetDias(-3, 17, 0),
      local: {
        type: "Point",
        coordinates: [-38.5586, -6.8894],
      },
      idosos: ["idoso-01", "idoso-02", "idoso-03"],
    },
  ];
}

function criarVisitasIniciais(): Visita[] {
  return [
    {
      _id: "visita-01",
      nome: "Roberto Gonçalves Moreira (Filho de D. Maria das Graças)",
      data: isoComOffsetDias(0, 14, 0), // HOJE
      createdAt: isoComOffsetDias(-2, 10, 0),
      updatedAt: isoComOffsetDias(-2, 10, 0),
    },
    {
      _id: "visita-02",
      nome: "Helena Cavalcante (Sobrinha de Sr. José Raimundo)",
      data: isoComOffsetDias(0, 15, 30), // HOJE
      createdAt: isoComOffsetDias(-1, 11, 20),
      updatedAt: isoComOffsetDias(-1, 11, 20),
    },
    {
      _id: "visita-03",
      nome: "Marcos Vinícius de Andrade (Filho de Sr. Antônio Ferreira)",
      data: isoComOffsetDias(0, 16, 0), // HOJE
      createdAt: isoComOffsetDias(-1, 16, 0),
      updatedAt: isoComOffsetDias(-1, 16, 0),
    },
    {
      _id: "visita-04",
      nome: "Camila Nogueira (Sobrinha de D. Terezinha)",
      data: isoComOffsetDias(-2, 14, 30),
      createdAt: isoComOffsetDias(-4, 9, 0),
      updatedAt: isoComOffsetDias(-4, 9, 0),
    },
    {
      _id: "visita-05",
      nome: "Paulo Bezerra (Irmão de D. Francisca das Chagas)",
      data: isoComOffsetDias(-5, 10, 0),
      createdAt: isoComOffsetDias(-6, 15, 0),
      updatedAt: isoComOffsetDias(-6, 15, 0),
    },
  ];
}

function carregarColecao<T>(chave: string, padrao: () => T): T {
  try {
    const salvo = localStorage.getItem(chave);
    if (salvo) {
      return JSON.parse(salvo) as T;
    }
  } catch {
    // fallback para o padrão
  }
  const inicial = padrao();
  localStorage.setItem(chave, JSON.stringify(inicial));
  return inicial;
}

function salvarColecao<T>(chave: string, dados: T): void {
  localStorage.setItem(chave, JSON.stringify(dados));
}

export function resetarDadosSimulacao(): void {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  carregarColecao(STORAGE_KEYS.usuarios, () => USUARIOS_INICIAIS);
  carregarColecao(STORAGE_KEYS.idosos, () => IDOSOS_INICIAIS);
  carregarColecao(STORAGE_KEYS.saude, criarRegistrosSaudeIniciais);
  carregarColecao(STORAGE_KEYS.eventos, criarEventosIniciais);
  carregarColecao(STORAGE_KEYS.visitas, criarVisitasIniciais);
}

function criarRespostaJson(dados: unknown, status = 200): Response {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function extrairCorpo(init?: RequestInit): Promise<Record<string, any>> {
  if (!init?.body) return {};
  if (typeof init.body === "string") {
    try {
      return JSON.parse(init.body);
    } catch {
      return {};
    }
  }
  if (init.body instanceof FormData) {
    const obj: Record<string, any> = {};
    for (const [key, value] of init.body.entries()) {
      if (value instanceof File) {
        if (value.size > 0) {
          obj[key] = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => resolve("");
            reader.readAsDataURL(value);
          });
        }
      } else if (key === "local") {
        try {
          obj[key] = JSON.parse(String(value));
        } catch {
          obj[key] = value;
        }
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }
  return {};
}

export function inicializarMockApi(): void {
  // Inicializa coleções no localStorage caso ainda não existam
  const usuarios = carregarColecao(STORAGE_KEYS.usuarios, () => USUARIOS_INICIAIS);
  carregarColecao(STORAGE_KEYS.idosos, () => IDOSOS_INICIAIS);
  carregarColecao(STORAGE_KEYS.saude, criarRegistrosSaudeIniciais);
  carregarColecao(STORAGE_KEYS.eventos, criarEventosIniciais);
  carregarColecao(STORAGE_KEYS.visitas, criarVisitasIniciais);

  // Garante que exista um token válido por padrão para facilitar navegação direta
  if (!localStorage.getItem("token") && usuarios.length > 0) {
    const padrao = usuarios[0];
    localStorage.setItem("token", gerarTokenMock(padrao.id, padrao.tipo));
  }

  const fetchOriginal = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlStr =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.toString()
        : input.url;

    if (!urlStr.startsWith(API_BASE)) {
      return fetchOriginal(input, init);
    }

    const metodo = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
    const caminho = urlStr.slice(API_BASE.length).split("?")[0];
    const corpo = await extrairCorpo(init);

    // Pequeno delay para simular feedback visual natural
    await new Promise((r) => setTimeout(r, 120));

    const listaUsuarios = carregarColecao(STORAGE_KEYS.usuarios, () => USUARIOS_INICIAIS);
    const listaIdosos = carregarColecao(STORAGE_KEYS.idosos, () => IDOSOS_INICIAIS);
    const listaSaude = carregarColecao(STORAGE_KEYS.saude, criarRegistrosSaudeIniciais);
    const listaEventos = carregarColecao<any[]>(STORAGE_KEYS.eventos, criarEventosIniciais);
    const listaVisitas = carregarColecao(STORAGE_KEYS.visitas, criarVisitasIniciais);

    // 1. AUTENTICAÇÃO E USUÁRIOS
    if (caminho === "/login" && metodo === "POST") {
      const email = String(corpo.email || "").toLowerCase().trim();
      let usuario = listaUsuarios.find((u) => u.email.toLowerCase() === email);

      if (!usuario) {
        if (email.includes("enfermeir")) {
          usuario = listaUsuarios.find((u) => u.tipo === "enfermeiro");
        } else if (email.includes("voluntari")) {
          usuario = listaUsuarios.find((u) => u.tipo === "voluntario");
        } else if (email.includes("familia")) {
          usuario = listaUsuarios.find((u) => u.tipo === "familiar");
        } else {
          usuario = listaUsuarios[0];
        }
      }

      const escolhido = usuario || USUARIOS_INICIAIS[0];
      const token = gerarTokenMock(escolhido.id, escolhido.tipo);
      return criarRespostaJson({
        message: `Bem-vindo(a), ${escolhido.nome}!`,
        token,
        usuario: escolhido,
      });
    }

    if (caminho === "/cadastrarUsuario" && metodo === "POST") {
      const novoId = `usr-${Date.now()}`;
      const novoUsuario = {
        _id: novoId,
        id: novoId,
        nome: corpo.nome || "Novo Usuário",
        email: corpo.email || `usuario${Date.now()}@lucazorn.org`,
        cpf: corpo.cpf || "000.000.000-00",
        tipo: corpo.tipo || "coordenador",
        sexo: corpo.sexo || "feminino",
        endereco: corpo.endereco || "Cajazeiras - PB",
        telefone: corpo.telefone || "(83) 99999-0000",
      };
      listaUsuarios.push(novoUsuario);
      salvarColecao(STORAGE_KEYS.usuarios, listaUsuarios);
      return criarRespostaJson(
        { message: "Usuário cadastrado com sucesso!", usuario: novoUsuario },
        201
      );
    }

    const matchUsuario = caminho.match(/^\/usuario\/([^/]+)$/);
    if (matchUsuario) {
      const id = matchUsuario[1];
      const idx = listaUsuarios.findIndex((u) => u.id === id || u._id === id);

      if (metodo === "GET") {
        const encontrado = idx >= 0 ? listaUsuarios[idx] : listaUsuarios[0];
        return criarRespostaJson(encontrado);
      }

      if (metodo === "PUT") {
        const alvoIdx = idx >= 0 ? idx : 0;
        listaUsuarios[alvoIdx] = {
          ...listaUsuarios[alvoIdx],
          ...corpo,
          id: listaUsuarios[alvoIdx].id,
          _id: listaUsuarios[alvoIdx]._id,
        };
        salvarColecao(STORAGE_KEYS.usuarios, listaUsuarios);
        return criarRespostaJson({
          message: "Perfil atualizado com sucesso!",
          ...listaUsuarios[alvoIdx],
        });
      }

      if (metodo === "DELETE") {
        if (idx >= 0) {
          listaUsuarios.splice(idx, 1);
          salvarColecao(STORAGE_KEYS.usuarios, listaUsuarios);
        }
        return criarRespostaJson({ message: "Perfil excluído com sucesso." });
      }
    }

    // 2. IDOSOS
    if (caminho === "/idosos" && metodo === "GET") {
      return criarRespostaJson(listaIdosos);
    }

    if (caminho === "/cadastrarIdoso" && metodo === "POST") {
      const novoId = `idoso-${Date.now()}`;
      const novoIdoso: Idoso = {
        ...(corpo as Idoso),
        _id: novoId,
        nome: corpo.nome || "Novo Residente",
        cpf: corpo.cpf || "000.000.000-00",
        rg: corpo.rg || "0.000.000",
        sus: corpo.sus || "700000000000000",
        dataNascimento: corpo.dataNascimento ? new Date(corpo.dataNascimento) : new Date("1945-01-01"),
        sexo: corpo.sexo || "Feminino",
        nacionalidade: corpo.nacionalidade || "Brasil",
        naturalidade: corpo.naturalidade || "Cajazeiras - PB",
      };
      listaIdosos.push(novoIdoso);
      salvarColecao(STORAGE_KEYS.idosos, listaIdosos);
      return criarRespostaJson(
        { message: "Idoso cadastrado com sucesso!", idoso: novoIdoso },
        201
      );
    }

    const matchIdoso = caminho.match(/^\/idoso\/([^/]+)$/);
    if (matchIdoso) {
      const id = matchIdoso[1];
      const idx = listaIdosos.findIndex((i) => i._id === id);

      if (metodo === "GET") {
        if (idx < 0) return criarRespostaJson({ message: "Idoso não encontrado" }, 404);
        return criarRespostaJson(listaIdosos[idx]);
      }

      if (metodo === "PUT") {
        if (idx < 0) return criarRespostaJson({ message: "Idoso não encontrado" }, 404);
        listaIdosos[idx] = {
          ...listaIdosos[idx],
          ...corpo,
          _id: listaIdosos[idx]._id,
        };
        salvarColecao(STORAGE_KEYS.idosos, listaIdosos);
        return criarRespostaJson({
          message: "Dados do idoso atualizados com sucesso!",
          idoso: listaIdosos[idx],
        });
      }

      if (metodo === "DELETE") {
        if (idx >= 0) {
          listaIdosos.splice(idx, 1);
          salvarColecao(STORAGE_KEYS.idosos, listaIdosos);
        }
        return criarRespostaJson({ message: "Idoso excluído com sucesso!" });
      }
    }

    // 3. REGISTROS DE SAÚDE
    if (caminho === "/saudeIdoso" && metodo === "GET") {
      return criarRespostaJson(listaSaude);
    }

    if (caminho === "/cadastrarConsulta" && metodo === "POST") {
      const idosoObj = listaIdosos.find((i) => i._id === corpo.idosoId) || {
        _id: String(corpo.idosoId || "idoso-01"),
        nome: "Residente",
      };
      const usuarioObj = listaUsuarios.find(
        (u) => u.id === corpo.usuarioId || u._id === corpo.usuarioId
      ) || {
        _id: "usr-enf-01",
        nome: "Dr. Carlos Eduardo Mendes",
      };

      const novoRegistro: RegistroSaudeIdoso = {
        _id: `saude-${Date.now()}`,
        idosoId: { _id: idosoObj._id, nome: idosoObj.nome },
        usuarioId: { _id: usuarioObj._id, nome: usuarioObj.nome },
        dataConsulta: new Date(),
        altura: Number(corpo.altura) || 1.65,
        peso: Number(corpo.peso) || 65,
        pressao: corpo.pressao || "120/80",
        glicemia: Number(corpo.glicemia) || 95,
        estadoNutricional: corpo.estadoNutricional || "normal",
        alergias: Array.isArray(corpo.alergias) ? corpo.alergias : [],
        doencasCronicas: Array.isArray(corpo.doencasCronicas) ? corpo.doencasCronicas : [],
      };

      listaSaude.push(novoRegistro);
      salvarColecao(STORAGE_KEYS.saude, listaSaude);
      return criarRespostaJson(
        { message: "Acompanhamento de saúde salvo com sucesso!", registro: novoRegistro },
        201
      );
    }

    const matchSaude = caminho.match(/^\/saudeIdoso\/([^/]+)$/);
    if (matchSaude) {
      const id = matchSaude[1];
      const idx = listaSaude.findIndex((r) => r._id === id);

      if (metodo === "GET") {
        if (idx < 0) return criarRespostaJson({ message: "Registro não encontrado" }, 404);
        return criarRespostaJson(listaSaude[idx]);
      }

      if (metodo === "PUT") {
        if (idx < 0) return criarRespostaJson({ message: "Registro não encontrado" }, 404);
        const idosoObj =
          listaIdosos.find((i) => i._id === corpo.idosoId) || listaSaude[idx].idosoId;
        const usuarioObj =
          listaUsuarios.find((u) => u.id === corpo.usuarioId || u._id === corpo.usuarioId) ||
          listaSaude[idx].usuarioId;

        listaSaude[idx] = {
          ...listaSaude[idx],
          idosoId: { _id: idosoObj._id, nome: idosoObj.nome },
          usuarioId: { _id: usuarioObj._id, nome: usuarioObj.nome },
          altura: Number(corpo.altura) || listaSaude[idx].altura,
          peso: Number(corpo.peso) || listaSaude[idx].peso,
          pressao: corpo.pressao || listaSaude[idx].pressao,
          glicemia: Number(corpo.glicemia) || listaSaude[idx].glicemia,
          estadoNutricional: corpo.estadoNutricional || listaSaude[idx].estadoNutricional,
          alergias: Array.isArray(corpo.alergias) ? corpo.alergias : listaSaude[idx].alergias,
          doencasCronicas: Array.isArray(corpo.doencasCronicas)
            ? corpo.doencasCronicas
            : listaSaude[idx].doencasCronicas,
        };
        salvarColecao(STORAGE_KEYS.saude, listaSaude);
        return criarRespostaJson({
          message: "Registro atualizado com sucesso!",
          registro: listaSaude[idx],
        });
      }

      if (metodo === "DELETE") {
        if (idx >= 0) {
          listaSaude.splice(idx, 1);
          salvarColecao(STORAGE_KEYS.saude, listaSaude);
        }
        return criarRespostaJson({ message: "Registro excluído com sucesso!" });
      }
    }

    // 4. EVENTOS
    if (caminho === "/eventos" && metodo === "GET") {
      return criarRespostaJson(listaEventos);
    }

    if (caminho === "/cadastroEvento" && metodo === "POST") {
      const novoEvento = {
        _id: `evento-${Date.now()}`,
        nome: corpo.nome || "Novo Evento",
        descricao: corpo.descricao || "",
        data: corpo.data || new Date().toISOString(),
        imagem: corpo.imagem || "",
        local: corpo.local || {
          type: "Point",
          coordinates: [-38.5586, -6.8894],
        },
        idosos: [],
      };
      listaEventos.push(novoEvento);
      salvarColecao(STORAGE_KEYS.eventos, listaEventos);
      return criarRespostaJson(
        { message: "Evento criado com sucesso!", evento: novoEvento },
        201
      );
    }

    const matchEventoIdosos = caminho.match(/^\/eventos\/([^/]+)\/idosos$/);
    if (matchEventoIdosos && metodo === "PUT") {
      const id = matchEventoIdosos[1];
      const idx = listaEventos.findIndex((e) => e._id === id);
      if (idx < 0) return criarRespostaJson({ message: "Evento não encontrado" }, 404);
      listaEventos[idx].idosos = Array.isArray(corpo.idosos) ? corpo.idosos : [];
      salvarColecao(STORAGE_KEYS.eventos, listaEventos);
      return criarRespostaJson({
        message: "Participantes atualizados com sucesso!",
        evento: listaEventos[idx],
      });
    }

    const matchEvento = caminho.match(/^\/eventos\/([^/]+)$/);
    if (matchEvento) {
      const id = matchEvento[1];
      const idx = listaEventos.findIndex((e) => e._id === id);

      if (metodo === "GET") {
        if (idx < 0) return criarRespostaJson({ message: "Evento não encontrado" }, 404);
        return criarRespostaJson(listaEventos[idx]);
      }

      if (metodo === "PUT") {
        if (idx < 0) return criarRespostaJson({ message: "Evento não encontrado" }, 404);
        listaEventos[idx] = {
          ...listaEventos[idx],
          nome: corpo.nome ?? listaEventos[idx].nome,
          descricao: corpo.descricao ?? listaEventos[idx].descricao,
          data: corpo.data ?? listaEventos[idx].data,
          local: corpo.local ?? listaEventos[idx].local,
          imagem: corpo.imagem || listaEventos[idx].imagem,
        };
        salvarColecao(STORAGE_KEYS.eventos, listaEventos);
        return criarRespostaJson({
          message: "Evento atualizado com sucesso!",
          evento: listaEventos[idx],
        });
      }

      if (metodo === "DELETE") {
        if (idx >= 0) {
          listaEventos.splice(idx, 1);
          salvarColecao(STORAGE_KEYS.eventos, listaEventos);
        }
        return criarRespostaJson({ message: "Evento deletado com sucesso!" });
      }
    }

    // 5. VISITAS
    if (caminho === "/visitas" && metodo === "GET") {
      return criarRespostaJson(listaVisitas);
    }

    if (caminho === "/visita" && metodo === "POST") {
      const novaVisita: Visita = {
        _id: `visita-${Date.now()}`,
        nome: corpo.nome || "Visitante",
        data: corpo.data || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      listaVisitas.push(novaVisita);
      salvarColecao(STORAGE_KEYS.visitas, listaVisitas);
      return criarRespostaJson(
        { message: "Visita registrada com sucesso!", visita: novaVisita },
        201
      );
    }

    const matchVisita = caminho.match(/^\/visita\/([^/]+)$/);
    if (matchVisita) {
      const id = matchVisita[1];
      const idx = listaVisitas.findIndex((v) => v._id === id);

      if (metodo === "GET") {
        if (idx < 0) return criarRespostaJson({ message: "Visita não encontrada" }, 404);
        return criarRespostaJson(listaVisitas[idx]);
      }

      if (metodo === "PUT") {
        if (idx < 0) return criarRespostaJson({ message: "Visita não encontrada" }, 404);
        listaVisitas[idx] = {
          ...listaVisitas[idx],
          nome: corpo.nome ?? listaVisitas[idx].nome,
          data: corpo.data ?? listaVisitas[idx].data,
          updatedAt: new Date().toISOString(),
        };
        salvarColecao(STORAGE_KEYS.visitas, listaVisitas);
        return criarRespostaJson({
          message: "Visita atualizada com sucesso!",
          visita: listaVisitas[idx],
        });
      }

      if (metodo === "DELETE") {
        if (idx >= 0) {
          listaVisitas.splice(idx, 1);
          salvarColecao(STORAGE_KEYS.visitas, listaVisitas);
        }
        return criarRespostaJson({ message: "Visita excluída com sucesso!" });
      }
    }

    // 6. AGENTE DE IA (GEMINI FREE TIER)
    if (caminho === "/agente" && metodo === "POST") {
      const headersInit = init?.headers;
      let chaveHeader = "";
      if (headersInit instanceof Headers) {
        chaveHeader = headersInit.get("x-gemini-api-key") || "";
      } else if (Array.isArray(headersInit)) {
        const par = headersInit.find(([k]) => k.toLowerCase() === "x-gemini-api-key");
        chaveHeader = par?.[1] || "";
      } else if (headersInit && typeof headersInit === "object") {
        const encontrada = Object.entries(headersInit).find(
          ([k]) => k.toLowerCase() === "x-gemini-api-key"
        );
        chaveHeader = String(encontrada?.[1] || "");
      }

      const resultado = await processarAgenteComApiSistema({
        mensagem: corpo.mensagem,
        historico: corpo.historico,
        confirmacaoExecucao: corpo.confirmacaoExecucao,
        apiKeyOverride: chaveHeader,
      });

      return criarRespostaJson(resultado.body, resultado.status);
    }

    return criarRespostaJson({ message: "Rota simulada com sucesso" }, 200);
  };
}
