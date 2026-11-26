export interface BookingProgressInput {
  cidade?: string;
  tipo: string | null;
  service: string;
  instituicaoId: string;
  profissionalId?: string;
  data: string;
  horario: string;
}

export function getBookingProgress(input: BookingProgressInput) {
  if (!input.cidade) {
    return { current: 1, total: 5, label: "Informe sua localização" };
  }
  if (!input.tipo || !input.service) {
    return { current: 2, total: 5, label: "Escolha o atendimento" };
  }
  if (!input.instituicaoId) {
    return { current: 3, total: 5, label: "Escolha a unidade" };
  }
  if (!input.data || !input.horario || (input.tipo === "consulta" && !input.profissionalId)) {
    return { current: 4, total: 5, label: input.tipo === "exame" ? "Escolha o horário" : "Escolha o profissional e horário" };
  }
  return { current: 5, total: 5, label: "Confirme seu agendamento" };
}
