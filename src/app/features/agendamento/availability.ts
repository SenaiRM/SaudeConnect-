import type { Agendamento, AgendamentoTipo, Instituicao, SlotDisponivel } from "../../components/mockData";
import { appointmentTime, toLocalISODate } from "./dates.ts";

export interface AvailabilityInput {
  tipo: AgendamentoTipo;
  instituicaoId: string;
  profissionalId?: string;
  slots: SlotDisponivel[];
  agendamentos: Pick<Agendamento, "tipo" | "instituicaoId" | "profissionalId" | "data" | "horario" | "status">[];
  now?: Date;
}

function isReserved(input: AvailabilityInput, data: string, horario: string) {
  return input.agendamentos.some((agendamento) =>
    agendamento.tipo === input.tipo &&
    agendamento.instituicaoId === input.instituicaoId &&
    (input.tipo === "exame" || agendamento.profissionalId === input.profissionalId) &&
    agendamento.data === data &&
    agendamento.horario === horario &&
    !["cancelado", "realizado"].includes(agendamento.status)
  );
}

function isFuture(data: string, horario: string, now: Date) {
  return appointmentTime(data, horario) > now.getTime();
}

export function getAvailableSlots(input: AvailabilityInput): SlotDisponivel[] {
  const now = input.now ?? new Date();
  return input.slots.flatMap(({ data, horarios }) => {
    const livres = horarios.filter((horario) => isFuture(data, horario, now) && !isReserved(input, data, horario));
    return livres.length ? [{ data, horarios: livres }] : [];
  });
}

export function getCompatibleInstitutions(tipo: AgendamentoTipo, service: string, instituicoes: Instituicao[]) {
  return instituicoes.filter((instituicao) =>
    instituicao.ativo &&
    (tipo === "consulta"
      ? instituicao.tipo !== "laboratorio" && instituicao.especialidades.includes(service)
      : instituicao.tipo === "laboratorio" && (instituicao.examesOferecidos ?? []).includes(service))
  );
}

// ─── Disponibilidade real por dia da semana (usada no Reagendamento) ─────────
const DIA_PARA_INDICE: Record<string, number> = {
  Domingo: 0, Segunda: 1, Terça: 2, Quarta: 3, Quinta: 4, Sexta: 5, Sábado: 6,
};
const HORARIOS_CONSULTA = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const HORARIOS_EXAME = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30"];

export interface DisponibilidadeInput {
  tipo: AgendamentoTipo;
  instituicaoId: string;
  profissionalId?: string;
  /** Dias em que o profissional atende (só para consulta). Ex.: ["Segunda", "Quarta"]. */
  diasDisponiveis?: string[];
  agendamentos: Pick<Agendamento, "tipo" | "instituicaoId" | "profissionalId" | "data" | "horario" | "status">[];
  now?: Date;
  maxDatas?: number;
}

/**
 * Gera os próximos dias/horários REALMENTE disponíveis, respeitando os dias em que
 * o profissional atende (consulta) ou dias úteis do laboratório (exame), e removendo
 * os horários já ocupados. Usado no reagendamento para "consultar" a agenda de verdade.
 */
export function gerarDisponibilidade(input: DisponibilidadeInput): SlotDisponivel[] {
  const now = input.now ?? new Date();
  const diasSemana =
    input.tipo === "consulta"
      ? (input.diasDisponiveis ?? []).map((d) => DIA_PARA_INDICE[d]).filter((n) => n !== undefined)
      : [1, 2, 3, 4, 5, 6]; // exame/laboratório: segunda a sábado
  if (!diasSemana.length) return [];

  const horariosBase = input.tipo === "consulta" ? HORARIOS_CONSULTA : HORARIOS_EXAME;
  const maxDatas = input.maxDatas ?? 6;
  const resultado: SlotDisponivel[] = [];

  for (let i = 1; i <= 60 && resultado.length < maxDatas; i += 1) {
    const dia = new Date(now);
    dia.setDate(dia.getDate() + i);
    if (!diasSemana.includes(dia.getDay())) continue;
    const data = toLocalISODate(dia);
    const livres = horariosBase.filter((horario) => {
      const ocupado = input.agendamentos.some((a) =>
        a.tipo === input.tipo &&
        a.instituicaoId === input.instituicaoId &&
        (input.tipo === "exame" || a.profissionalId === input.profissionalId) &&
        a.data === data &&
        a.horario === horario &&
        !["cancelado", "realizado"].includes(a.status),
      );
      return !ocupado;
    });
    if (livres.length) resultado.push({ data, horarios: livres });
  }
  return resultado;
}

export function demoSlotsInTheFuture(slots: SlotDisponivel[], now = new Date()): SlotDisponivel[] {
  return slots.map((slot, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() + index + 1);
    return { data: toLocalISODate(date), horarios: slot.horarios };
  });
}
