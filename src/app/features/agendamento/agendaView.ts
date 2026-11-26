import { appointmentTime } from "./dates.ts";

type MomentoLike = { data: string; horario: string };
type AgendamentoLike = MomentoLike & { status: string };

/** Status que encerram o atendimento, independentemente da data. */
const STATUS_ENCERRADOS = ["cancelado", "realizado"];

/** O atendimento já aconteceu (ou o horário passou) em relação a `agora`. */
export function estaNoPassado(momento: MomentoLike, agora = new Date()): boolean {
  return appointmentTime(momento.data, momento.horario) <= agora.getTime();
}

/** Ordena do mais cedo para o mais tarde, considerando data E horário. */
export function ordenarPorMomento<T extends MomentoLike>(itens: T[]): T[] {
  return [...itens].sort((a, b) => appointmentTime(a.data, a.horario) - appointmentTime(b.data, b.horario));
}

/**
 * Separa a agenda entre o que ainda vai acontecer e o que já encerrou.
 *
 * Antes a divisão olhava só o `status`: um atendimento pendente cuja data venceu
 * continuava aparecendo como "próximo" para sempre, porque nada no app marca
 * `realizado` sozinho.
 */
export function separarAgenda<T extends AgendamentoLike>(agendamentos: T[], agora = new Date()) {
  const proximos: T[] = [];
  const historico: T[] = [];

  for (const agendamento of agendamentos) {
    const encerrado = STATUS_ENCERRADOS.includes(agendamento.status) || estaNoPassado(agendamento, agora);
    (encerrado ? historico : proximos).push(agendamento);
  }

  return {
    proximos: ordenarPorMomento(proximos),
    historico: ordenarPorMomento(historico).reverse(),
  };
}
