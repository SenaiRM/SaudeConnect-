import { toLocalISODate } from "../features/agendamento/dates.ts";
export type Screen =
  | "acesso"
  | "home"
  | "agenda"
  | "agendar"
  | "instituicoes"
  | "detalhes"
  | "perfil"
  | "gestao";

export type UserRole = "usuario" | "secretaria";
export type AgendamentoStatus =
  | "pendente"
  | "confirmado"
  | "cancelado"
  | "realizado"
  | "reagendamento"
  | "indisponivel";
export type AgendamentoTipo = "consulta" | "exame";

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  role: UserRole;
  /** Unidade em que a secretaria trabalha. Pacientes não têm. */
  instituicaoId?: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export interface Instituicao {
  id: string;
  nome: string;
  tipo: "clinica" | "hospital" | "laboratorio";
  endereco: string;
  telefone: string;
  horarioFuncionamento: string;
  especialidades: string[];
  examesOferecidos?: string[];
  ativo: boolean;
  avaliacao: number;
  /** Coordenadas para geolocalização (MVP 2). */
  coords?: { lat: number; lng: number };
  /** Cidade/UF usadas no filtro de localização do agendamento. */
  cidade?: string;
  uf?: string;
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
  instituicaoId: string;
  diasDisponiveis: string[];
  disponivel: boolean;
}

export interface Agendamento {
  id: string;
  tipo: AgendamentoTipo;
  usuarioId: string;
  data: string;
  horario: string;
  instituicaoId: string;
  profissionalId?: string;
  especialidade?: string;
  tipoExame?: string;
  status: AgendamentoStatus;
  observacoes?: string;
  /** Aceite dos termos no momento da confirmação (opcional: agendamentos antigos não têm). */
  termos?: { aceito: boolean; aceitoEm: string; versao: string };
}

export interface AgendamentoHistorico {
  agendamentoId: string;
  tipo: "criado" | "reagendado" | "reagendamento_confirmado" | "confirmado" | "cancelado";
  responsavel: string;
  data: string;
  anterior: Partial<Pick<Agendamento, "data" | "horario" | "status">>;
  atual: Partial<Pick<Agendamento, "data" | "horario" | "status">>;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "lembrete" | "confirmacao" | "cancelamento" | "info";
  data: string;
  lida: boolean;
  agendamentoId?: string;
  usuarioId?: string;
  destinatario?: "paciente" | "secretaria";
  /** Unidade responsável, para o aviso chegar só à secretaria daquela unidade. */
  instituicaoId?: string;
}

export interface SlotDisponivel {
  data: string;
  horarios: string[];
}

export interface ExamInfo {
  preparo: string;
  duracao: string;
  jejum: boolean;
}

// ─── Mock Users ───────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: "u1",
    nome: "Maria Silva",
    email: "maria.silva@email.com",
    telefone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    dataNascimento: "1990-06-15",
    role: "usuario",
    endereco: { rua: "Rua das Flores", numero: "123", bairro: "Jardim Primavera", cidade: "São Paulo", estado: "SP", cep: "01234-567" },
  },
  {
    id: "u2",
    nome: "Ana Souza",
    email: "ana.souza@saudeconnect.com",
    telefone: "(62) 91234-5678",
    cpf: "987.654.321-00",
    dataNascimento: "1985-03-22",
    role: "secretaria",
    instituicaoId: "i1",
    endereco: { rua: "Av. Goiás", numero: "800", bairro: "Centro", cidade: "Anápolis", estado: "GO", cep: "75020-010" },
  },
  // Demais pacientes da unidade, para o painel da secretaria ter movimento real.
  {
    id: "u3",
    nome: "Carlos Nunes",
    email: "carlos.nunes@email.com",
    telefone: "(62) 98888-1122",
    cpf: "321.654.987-00",
    dataNascimento: "1978-11-02",
    role: "usuario",
    endereco: { rua: "Rua 14 de Julho", numero: "45", bairro: "Jundiaí", cidade: "Anápolis", estado: "GO", cep: "75110-020" },
  },
  {
    id: "u4",
    nome: "Helena Dias",
    email: "helena.dias@email.com",
    telefone: "(62) 97777-3344",
    cpf: "456.789.123-00",
    dataNascimento: "1995-07-19",
    role: "usuario",
    endereco: { rua: "Rua Engenheiro Portela", numero: "210", bairro: "Centro", cidade: "Anápolis", estado: "GO", cep: "75020-090" },
  },
  // Cada unidade tem a sua secretaria; só a da Clínica Saúde Plena entra na demonstração.
  {
    id: "u5", nome: "Marta Ribeiro", email: "marta.ribeiro@saudeconnect.com",
    telefone: "(11) 95555-1010", cpf: "111.222.333-00", dataNascimento: "1982-02-10",
    role: "secretaria", instituicaoId: "i2",
    endereco: { rua: "Av. Paulista", numero: "1000", bairro: "Bela Vista", cidade: "São Paulo", estado: "SP", cep: "01310-100" },
  },
  {
    id: "u6", nome: "Rogério Lima", email: "rogerio.lima@saudeconnect.com",
    telefone: "(62) 94444-2020", cpf: "222.333.444-00", dataNascimento: "1979-09-05",
    role: "secretaria", instituicaoId: "i3",
    endereco: { rua: "Av. Brasil", numero: "320", bairro: "Centro", cidade: "Anápolis", estado: "GO", cep: "75020-040" },
  },
  {
    id: "u7", nome: "Patrícia Gomes", email: "patricia.gomes@saudeconnect.com",
    telefone: "(62) 93333-3030", cpf: "333.444.555-00", dataNascimento: "1990-12-01",
    role: "secretaria", instituicaoId: "i4",
    endereco: { rua: "Rua Barão de Cotegipe", numero: "77", bairro: "Centro", cidade: "Anápolis", estado: "GO", cep: "75020-070" },
  },
];

// ─── Instituições ─────────────────────────────────────────────
export const instituicoes: Instituicao[] = [
  {
    id: "i1",
    nome: "Clínica Saúde Plena",
    tipo: "clinica",
    endereco: "Av. Goiás, 800 - Centro, Anápolis - GO",
    telefone: "(62) 3333-1111",
    horarioFuncionamento: "Seg–Sex: 07h–19h | Sáb: 08h–13h",
    especialidades: ["Cardiologia", "Ortopedia", "Clínica Geral"],
    ativo: true,
    avaliacao: 4.8,
    coords: { lat: -16.3285, lng: -48.9530 },
    cidade: "Anápolis",
    uf: "GO",
  },
  {
    id: "i2",
    nome: "Hospital São Lucas",
    tipo: "hospital",
    endereco: "Av. Brasil Sul, 1450 - Jundiaí, Anápolis - GO",
    telefone: "(62) 3333-2222",
    horarioFuncionamento: "24 horas",
    especialidades: ["Neurologia", "Clínica Geral", "Pediatria", "Ginecologia"],
    ativo: true,
    avaliacao: 4.6,
    coords: { lat: -16.3366, lng: -48.9450 },
    cidade: "Anápolis",
    uf: "GO",
  },
  {
    id: "i3",
    nome: "Laboratório Vida",
    tipo: "laboratorio",
    endereco: "Rua 14 de Julho, 220 - Centro, Anápolis - GO",
    telefone: "(62) 3333-3333",
    horarioFuncionamento: "Seg–Sáb: 06h30–12h",
    especialidades: [],
    examesOferecidos: ["Hemograma Completo", "Glicemia em Jejum", "Colesterol Total", "Triglicerídeos", "TSH / T4", "Ureia e Creatinina", "Eletrocardiograma"],
    ativo: true,
    avaliacao: 4.9,
    coords: { lat: -16.3309, lng: -48.9491 },
    cidade: "Anápolis",
    uf: "GO",
  },
  {
    id: "i4",
    nome: "Clínica Bem Estar",
    tipo: "clinica",
    endereco: "Av. Universitária, 680 - Vila Santa Isabel, Anápolis - GO",
    telefone: "(62) 3333-4444",
    horarioFuncionamento: "Seg–Sex: 08h–18h",
    especialidades: ["Dermatologia", "Psicologia", "Nutrição"],
    ativo: true,
    avaliacao: 4.7,
    coords: { lat: -16.3164, lng: -48.9406 },
    cidade: "Anápolis",
    uf: "GO",
  },
  { id: "i5", nome: "Clínica Horizonte", tipo: "clinica", endereco: "Rua Barão do Rio Branco, 510 - Centro, Anápolis - GO", telefone: "(62) 3333-5555", horarioFuncionamento: "Seg–Sex: 07h–20h", especialidades: ["Pediatria", "Ginecologia", "Clínica Geral"], ativo: true, avaliacao: 4.7, coords: { lat: -16.3252, lng: -48.9568 }, cidade: "Anápolis", uf: "GO" },
  { id: "i6", nome: "Hospital Central de Anápolis", tipo: "hospital", endereco: "Av. Presidente Kennedy, 1250 - Maracanã, Anápolis - GO", telefone: "(62) 3333-6666", horarioFuncionamento: "24 horas", especialidades: ["Cardiologia", "Ortopedia", "Pediatria"], ativo: true, avaliacao: 4.8, coords: { lat: -16.3440, lng: -48.9625 }, cidade: "Anápolis", uf: "GO" },
  { id: "i7", nome: "Hospital Jardim das Américas", tipo: "hospital", endereco: "Av. Pedro Ludovico, 930 - Vila Jaiara, Anápolis - GO", telefone: "(62) 3333-7777", horarioFuncionamento: "24 horas", especialidades: ["Neurologia", "Dermatologia", "Clínica Geral"], ativo: true, avaliacao: 4.5, coords: { lat: -16.3072, lng: -48.9658 }, cidade: "Anápolis", uf: "GO" },
  { id: "i8", nome: "Laboratório Diagnóstico", tipo: "laboratorio", endereco: "Av. São Francisco, 360 - Jundiaí, Anápolis - GO", telefone: "(62) 3333-8888", horarioFuncionamento: "Seg–Sáb: 06h–17h", especialidades: [], examesOferecidos: ["Hemograma Completo", "Raio-X", "Ultrassom"], ativo: true, avaliacao: 4.8, coords: { lat: -16.3388, lng: -48.9422 }, cidade: "Anápolis", uf: "GO" },
  { id: "i9", nome: "Laboratório Anápolis", tipo: "laboratorio", endereco: "Rua Engenheiro Portela, 410 - Centro, Anápolis - GO", telefone: "(62) 3333-9999", horarioFuncionamento: "Seg–Sáb: 06h–16h", especialidades: [], examesOferecidos: ["Glicemia em Jejum", "Tomografia Computadorizada", "Eletrocardiograma"], ativo: true, avaliacao: 4.6, coords: { lat: -16.3335, lng: -48.9570 }, cidade: "Anápolis", uf: "GO" },
  { id: "i10", nome: "Laboratório Paulista", tipo: "laboratorio", endereco: "Rua Vergueiro, 1250 - Vila Mariana, São Paulo - SP", telefone: "(11) 3255-1010", horarioFuncionamento: "Seg–Sáb: 06h–18h", especialidades: [], examesOferecidos: ["Hemograma Completo", "Ultrassom", "Eletrocardiograma"], ativo: true, avaliacao: 4.8, coords: { lat: -23.5843, lng: -46.6353 }, cidade: "São Paulo", uf: "SP" },
  { id: "i11", nome: "Diagnósticos Campinas", tipo: "laboratorio", endereco: "Av. Orosimbo Maia, 680 - Centro, Campinas - SP", telefone: "(19) 3262-2020", horarioFuncionamento: "Seg–Sáb: 06h–17h", especialidades: [], examesOferecidos: ["Glicemia em Jejum", "Colesterol Total", "Raio-X"], ativo: true, avaliacao: 4.7, coords: { lat: -22.8999, lng: -47.0608 }, cidade: "Campinas", uf: "SP" },
  { id: "i12", nome: "Laboratório Cerrado", tipo: "laboratorio", endereco: "Av. T-63, 920 - Setor Bueno, Goiânia - GO", telefone: "(62) 3093-3030", horarioFuncionamento: "Seg–Sáb: 06h–17h", especialidades: [], examesOferecidos: ["Hemograma Completo", "Tomografia Computadorizada", "TSH / T4"], ativo: true, avaliacao: 4.9, coords: { lat: -16.7036, lng: -49.2643 }, cidade: "Goiânia", uf: "GO" },
  { id: "i13", nome: "Centro Diagnóstico Brasília", tipo: "laboratorio", endereco: "SGAS 915, Asa Sul, Brasília - DF", telefone: "(61) 3224-4040", horarioFuncionamento: "Seg–Sáb: 06h–18h", especialidades: [], examesOferecidos: ["Hemograma Completo", "Ultrassom", "Triglicerídeos"], ativo: true, avaliacao: 4.8, coords: { lat: -15.8147, lng: -47.9102 }, cidade: "Brasília", uf: "DF" },
  { id: "i14", nome: "Clínica Litoral", tipo: "clinica", endereco: "Av. Ana Costa, 420 - Gonzaga, Santos - SP", telefone: "(13) 3289-5050", horarioFuncionamento: "Seg–Sex: 08h–19h", especialidades: ["Clínica Geral"], ativo: true, avaliacao: 4.6, coords: { lat: -23.9662, lng: -46.3272 }, cidade: "Santos", uf: "SP" },
];

// ─── Profissionais ────────────────────────────────────────────
export const profissionais: Profissional[] = [
  { id: "p1", nome: "Dr. Carlos Mendes", especialidade: "Cardiologia", crm: "CRM-SP 12345", instituicaoId: "i1", diasDisponiveis: ["Segunda", "Quarta", "Quinta"], disponivel: true },
  { id: "p8", nome: "Dra. Beatriz Oliveira", especialidade: "Cardiologia", crm: "CRM-GO 48291", instituicaoId: "i1", diasDisponiveis: ["Terça", "Quinta"], disponivel: true },
  { id: "p9", nome: "Dr. Felipe Azevedo", especialidade: "Cardiologia", crm: "CRM-GO 63917", instituicaoId: "i1", diasDisponiveis: ["Segunda", "Sexta"], disponivel: true },
  { id: "p2", nome: "Dra. Ana Lima", especialidade: "Clínica Geral", crm: "CRM-SP 23456", instituicaoId: "i2", diasDisponiveis: ["Segunda", "Terça", "Sábado"], disponivel: true },
  { id: "p3", nome: "Dr. Roberto Santos", especialidade: "Ortopedia", crm: "CRM-SP 34567", instituicaoId: "i1", diasDisponiveis: ["Terça", "Quinta", "Sexta"], disponivel: true },
  { id: "p4", nome: "Dra. Maria Costa", especialidade: "Dermatologia", crm: "CRM-SP 45678", instituicaoId: "i4", diasDisponiveis: ["Segunda", "Quarta"], disponivel: true },
  { id: "p5", nome: "Dr. João Ferreira", especialidade: "Neurologia", crm: "CRM-SP 56789", instituicaoId: "i2", diasDisponiveis: [], disponivel: false },
  { id: "p6", nome: "Dra. Luciana Rocha", especialidade: "Ginecologia", crm: "CRM-SP 67890", instituicaoId: "i2", diasDisponiveis: ["Terça", "Sexta"], disponivel: true },
  { id: "p7", nome: "Dr. Paulo Nascimento", especialidade: "Psicologia", crm: "CRP-SP 11111", instituicaoId: "i4", diasDisponiveis: ["Segunda", "Quarta", "Sexta"], disponivel: true },
  { id: "p10", nome: "Dra. Renata Moura", especialidade: "Clínica Geral", crm: "CRM-SP 74125", instituicaoId: "i14", diasDisponiveis: ["Terça", "Quinta", "Sexta"], disponivel: true },
];

export const especialidades = [
  "Cardiologia", "Clínica Geral", "Dermatologia", "Ginecologia",
  "Neurologia", "Ortopedia", "Pediatria", "Psicologia", "Nutrição",
];

export const tiposExame = [
  "Hemograma Completo", "Glicemia em Jejum", "Colesterol Total",
  "Raio-X", "Tomografia Computadorizada", "Ultrassom", "Eletrocardiograma",
  "Triglicerídeos", "TSH / T4", "Ureia e Creatinina",
];

// ─── Exam info ────────────────────────────────────────────────
export const examInfo: Record<string, ExamInfo> = {
  "Hemograma Completo": { preparo: "Nenhum preparo especial necessário.", duracao: "15 min", jejum: false },
  "Glicemia em Jejum": { preparo: "Jejum de 8 a 12 horas.", duracao: "10 min", jejum: true },
  "Colesterol Total": { preparo: "Jejum de 12 horas.", duracao: "10 min", jejum: true },
  "Raio-X": { preparo: "Remover acessórios metálicos.", duracao: "20 min", jejum: false },
  "Tomografia Computadorizada": { preparo: "Jejum de 4 horas. Pode exigir contraste.", duracao: "30 min", jejum: true },
  "Ultrassom": { preparo: "Bexiga cheia (para exames abdominais).", duracao: "30 min", jejum: false },
  "Eletrocardiograma": { preparo: "Nenhum preparo necessário.", duracao: "20 min", jejum: false },
  "Triglicerídeos": { preparo: "Jejum de 12 horas.", duracao: "10 min", jejum: true },
  "TSH / T4": { preparo: "Coleta preferencial pela manhã.", duracao: "10 min", jejum: false },
  "Ureia e Creatinina": { preparo: "Evitar exercício intenso 24h antes.", duracao: "10 min", jejum: false },
};

// ─── Agenda disponível por profissional ───────────────────────
export const agendaProfissional: Record<string, SlotDisponivel[]> = {
  p1: [
    { data: "2026-05-20", horarios: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
    { data: "2026-05-21", horarios: ["09:00", "10:00", "11:30"] },
    { data: "2026-05-27", horarios: ["14:00", "15:00", "16:00"] },
    { data: "2026-05-28", horarios: ["09:00", "10:00"] },
    { data: "2026-06-03", horarios: ["09:00", "10:00", "11:00"] },
  ],
  p8: [
    { data: "2026-05-19", horarios: ["08:00", "09:00", "10:00"] },
    { data: "2026-05-21", horarios: ["13:00", "14:00", "15:00"] },
    { data: "2026-05-26", horarios: ["08:30", "09:30", "10:30"] },
    { data: "2026-06-02", horarios: ["14:00", "15:00"] },
  ],
  p9: [
    { data: "2026-05-18", horarios: ["09:00", "10:00", "11:00"] },
    { data: "2026-05-22", horarios: ["13:00", "14:00", "15:00"] },
    { data: "2026-05-25", horarios: ["08:00", "09:00", "10:00"] },
    { data: "2026-06-05", horarios: ["09:00", "10:00"] },
  ],
  p2: [
    { data: "2026-05-16", horarios: ["08:00", "09:00", "10:00"] },
    { data: "2026-05-19", horarios: ["14:00", "15:00", "16:00"] },
    { data: "2026-05-23", horarios: ["08:00", "09:00", "10:00", "11:00"] },
    { data: "2026-05-26", horarios: ["08:00", "09:00"] },
    { data: "2026-06-02", horarios: ["09:00", "10:00", "11:00"] },
  ],
  p3: [
    { data: "2026-05-15", horarios: ["10:00", "11:00", "14:00", "15:00"] },
    { data: "2026-05-22", horarios: ["09:00", "10:00", "11:00"] },
    { data: "2026-05-29", horarios: ["10:00", "11:00", "14:00"] },
    { data: "2026-06-05", horarios: ["09:00", "10:00"] },
  ],
  p4: [
    { data: "2026-05-18", horarios: ["14:00", "15:00", "16:00"] },
    { data: "2026-05-25", horarios: ["09:00", "10:00", "11:00"] },
    { data: "2026-06-01", horarios: ["14:00", "15:00"] },
    { data: "2026-06-08", horarios: ["09:00", "10:00", "11:00"] },
  ],
  p6: [
    { data: "2026-05-19", horarios: ["14:00", "15:00"] },
    { data: "2026-05-22", horarios: ["09:00", "10:00"] },
    { data: "2026-05-26", horarios: ["14:00", "15:00", "16:00"] },
    { data: "2026-06-02", horarios: ["09:00", "10:00"] },
  ],
  p7: [
    { data: "2026-05-15", horarios: ["15:00", "16:00", "17:00"] },
    { data: "2026-05-18", horarios: ["10:00", "11:00"] },
    { data: "2026-05-25", horarios: ["15:00", "16:00", "17:00"] },
    { data: "2026-06-01", horarios: ["10:00", "11:00", "15:00"] },
  ],
  p10: [
    { data: "2026-05-20", horarios: ["09:00", "10:00", "14:00"] },
    { data: "2026-05-22", horarios: ["08:00", "09:00", "10:00"] },
    { data: "2026-05-27", horarios: ["14:00", "15:00", "16:00"] },
  ],
};

// ─── Agenda disponível por instituição (exames) ───────────────
export const agendaInstituicao: Record<string, SlotDisponivel[]> = {
  i3: [
    { data: "2026-05-16", horarios: ["07:00", "07:30", "08:00", "08:30", "09:00"] },
    { data: "2026-05-19", horarios: ["07:00", "07:30", "08:00", "08:30"] },
    { data: "2026-05-21", horarios: ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30"] },
    { data: "2026-05-23", horarios: ["07:00", "07:30", "08:00"] },
    { data: "2026-05-26", horarios: ["07:00", "07:30", "08:00", "08:30", "09:00"] },
    { data: "2026-05-28", horarios: ["07:00", "07:30", "08:00"] },
    { data: "2026-06-02", horarios: ["07:00", "07:30", "08:00", "08:30"] },
    { data: "2026-06-04", horarios: ["07:00", "07:30", "08:00", "08:30", "09:00"] },
  ],
  i10: [
    { data: "2026-05-19", horarios: ["07:00", "07:30", "08:00", "08:30"] },
    { data: "2026-05-21", horarios: ["07:00", "08:00", "08:30", "09:00"] },
    { data: "2026-05-24", horarios: ["07:30", "08:00", "08:30"] },
  ],
  i11: [
    { data: "2026-05-20", horarios: ["07:00", "07:30", "08:00", "09:00"] },
    { data: "2026-05-22", horarios: ["07:00", "07:30", "08:30", "09:00"] },
    { data: "2026-05-26", horarios: ["07:00", "08:00", "08:30"] },
  ],
  i12: [
    { data: "2026-05-19", horarios: ["07:00", "07:30", "08:00", "08:30"] },
    { data: "2026-05-21", horarios: ["07:00", "08:00", "08:30", "09:00"] },
    { data: "2026-05-23", horarios: ["07:30", "08:00", "09:00"] },
  ],
  i13: [
    { data: "2026-05-20", horarios: ["07:00", "07:30", "08:00", "08:30"] },
    { data: "2026-05-22", horarios: ["07:00", "08:00", "08:30", "09:00"] },
    { data: "2026-05-25", horarios: ["07:30", "08:00", "08:30"] },
  ],
};

// ─── Mock Agendamentos ────────────────────────────────────────
// Datas relativas ao dia atual para que os agendamentos de demonstração
// sempre apareçam coerentes com o calendário (futuros = ativos, passados = histórico).
const _hojeBase = new Date();
function emDias(n: number): string {
  const d = new Date(_hojeBase);
  d.setDate(d.getDate() + n);
  return toLocalISODate(d);
}

/** Data/hora ISO relativa a hoje, para os avisos de exemplo nunca nascerem velhos. */
function emDiasISO(n: number): string {
  const d = new Date(_hojeBase);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const mockAgendamentos: Agendamento[] = [
  {
    id: "a1", tipo: "consulta", usuarioId: "u1",
    data: emDias(2), horario: "10:00", instituicaoId: "i1",
    profissionalId: "p1", especialidade: "Cardiologia", status: "confirmado",
  },
  {
    id: "a2", tipo: "exame", usuarioId: "u1",
    data: emDias(3), horario: "08:00", instituicaoId: "i3",
    tipoExame: "Hemograma Completo", status: "pendente",
    observacoes: "Comparecer em jejum de 12 horas",
  },
  {
    id: "a3", tipo: "consulta", usuarioId: "u1",
    data: emDias(6), horario: "09:00", instituicaoId: "i4",
    profissionalId: "p4", especialidade: "Dermatologia", status: "pendente",
  },
  {
    id: "a4", tipo: "exame", usuarioId: "u1",
    data: emDias(9), horario: "07:00", instituicaoId: "i3",
    tipoExame: "Glicemia em Jejum", status: "pendente",
    observacoes: "Jejum de 8 horas",
  },
  {
    id: "a5", tipo: "consulta", usuarioId: "u1",
    data: emDias(-18), horario: "09:00", instituicaoId: "i2",
    profissionalId: "p2", especialidade: "Clínica Geral", status: "realizado",
  },
  {
    id: "a6", tipo: "exame", usuarioId: "u1",
    data: emDias(-30), horario: "07:30", instituicaoId: "i3",
    tipoExame: "Colesterol Total", status: "realizado",
  },
  {
    id: "a8", tipo: "consulta", usuarioId: "u3",
    data: emDias(1), horario: "14:00", instituicaoId: "i1",
    profissionalId: "p3", especialidade: "Ortopedia", status: "pendente",
  },
  {
    id: "a9", tipo: "consulta", usuarioId: "u4",
    data: emDias(4), horario: "09:00", instituicaoId: "i1",
    profissionalId: "p8", especialidade: "Cardiologia", status: "confirmado",
  },
  {
    id: "a7", tipo: "consulta", usuarioId: "u1",
    data: emDias(-45), horario: "14:00", instituicaoId: "i1",
    profissionalId: "p3", especialidade: "Ortopedia", status: "cancelado",
  },
];

// ─── Mock Notificações ─────────────────────────────────────────
export const mockNotificacoes: Notificacao[] = [
  // Todos os avisos de exemplo têm dono e destinatário: sem isso eles apareciam
  // para os dois papéis e para qualquer paciente.
  {
    id: "n1", titulo: "Lembrete de Consulta",
    mensagem: "Você tem uma consulta de Cardiologia em breve na Clínica Saúde Plena.",
    tipo: "lembrete", data: emDiasISO(-1), lida: false, agendamentoId: "a1",
    usuarioId: "u1", destinatario: "paciente",
  },
  {
    id: "n2", titulo: "Exame Confirmado",
    mensagem: "Seu Hemograma Completo foi confirmado no Laboratório Vida. Compareça em jejum.",
    tipo: "confirmacao", data: emDiasISO(-2), lida: false, agendamentoId: "a2",
    usuarioId: "u1", destinatario: "paciente",
  },
  {
    id: "n3", titulo: "Lembrete de Exame",
    mensagem: "Seu exame de sangue requer jejum de 12 horas. Não esqueça!",
    tipo: "lembrete", data: emDiasISO(-3), lida: true, agendamentoId: "a2",
    usuarioId: "u1", destinatario: "paciente",
  },
  {
    id: "n4", titulo: "Consulta Solicitada",
    mensagem: "Sua consulta de Dermatologia foi solicitada. Aguarde confirmação.",
    tipo: "info", data: emDiasISO(-4), lida: true, agendamentoId: "a3",
    usuarioId: "u1", destinatario: "paciente",
  },
  {
    id: "n5", titulo: "Novo agendamento solicitado",
    mensagem: "Carlos Nunes solicitou Ortopedia com Dr. Roberto Santos. Confirme no painel de agendamentos.",
    tipo: "info", data: emDiasISO(-1), lida: false, agendamentoId: "a8",
    usuarioId: "u3", destinatario: "secretaria", instituicaoId: "i1",
  },
];

// ─── Helpers ──────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDataChip(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")}/${meses[d.getMonth()]}`;
}

export function getInstituicaoNome(id: string): string {
  return instituicoes.find((i) => i.id === id)?.nome ?? "";
}

export function getProfissionalNome(id: string): string {
  return profissionais.find((p) => p.id === id)?.nome ?? "";
}

export function getStatusColor(status: AgendamentoStatus): string {
  switch (status) {
    case "confirmado":    return "#16A34A";
    case "pendente":      return "#D97706";
    case "realizado":     return "#6B7280";
    case "cancelado":     return "#DC2626";
    case "reagendamento": return "#EA580C";
    case "indisponivel":  return "#607985";
  }
}

export function getStatusBg(status: AgendamentoStatus): string {
  switch (status) {
    case "confirmado":    return "#DCFCE7";
    case "pendente":      return "#FEF3C7";
    case "realizado":     return "#F3F4F6";
    case "cancelado":     return "#FEE2E2";
    case "reagendamento": return "#FFEDD5";
    case "indisponivel":  return "#F9FAFB";
  }
}

export function getStatusLabel(status: AgendamentoStatus): string {
  switch (status) {
    case "confirmado":    return "Confirmado";
    case "pendente":      return "Pendente";
    case "realizado":     return "Realizado";
    case "cancelado":     return "Cancelado";
    case "reagendamento": return "Aguardando confirmação";
    case "indisponivel":  return "Indisponível";
  }
}
