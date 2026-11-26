import type { AgendamentoTipo } from "../../components/mockData";
import { appointmentTime } from "./dates.ts";

export interface SlotPedido {
  tipo: AgendamentoTipo;
  instituicaoId: string;
  profissionalId?: string;
  data: string;
  horario: string;
}

type OcupacaoLike = {
  id?: string;
  tipo: string;
  instituicaoId: string;
  profissionalId?: string;
  data: string;
  horario: string;
  status: string;
};

const STATUS_LIBERAM = ["cancelado", "realizado"];

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/**
 * O que a secretaria precisa saber antes de confirmar: devolve os impedimentos
 * (lista vazia = pode confirmar). `profissional` vem do painel, com a agenda semanal atual.
 */
export function impedimentosParaConfirmar(
  pedido: SlotPedido & { id: string },
  agendamentos: OcupacaoLike[],
  profissional?: { nome: string; disponivel: boolean; diasDisponiveis: string[] },
  agora = new Date(),
): string[] {
  const motivos: string[] = [];
  if (profissional) {
    const dia = DIAS[new Date(`${pedido.data}T12:00:00`).getDay()];
    if (!profissional.disponivel) motivos.push(`${profissional.nome} está marcado(a) como indisponível.`);
    else if (!profissional.diasDisponiveis.includes(dia)) motivos.push(`${profissional.nome} não atende às ${dia.toLowerCase()}s.`);
  }
  if (!isSlotDisponivel(pedido, agendamentos, agora, pedido.id)) motivos.push("O horário já passou ou está ocupado por outro agendamento.");
  return motivos;
}

/**
 * O horário continua livre para este pedido?
 *
 * Recebe a agenda COMPLETA (de todos os pacientes) de propósito: a verificação
 * só devolve um booleano, nunca expõe quem reservou. Checar apenas a agenda do
 * próprio usuário era o que permitia duas pessoas marcarem o mesmo horário.
 *
 * `ignorarAgendamentoId` serve ao reagendamento, em que o horário atual do
 * próprio atendimento não deve bloquear a troca.
 */
export function isSlotDisponivel(
  pedido: SlotPedido,
  agendamentos: OcupacaoLike[],
  agora = new Date(),
  ignorarAgendamentoId?: string,
): boolean {
  if (appointmentTime(pedido.data, pedido.horario) <= agora.getTime()) return false;

  return !agendamentos.some((agendamento) =>
    // Só ignora quando um id foi realmente informado: comparar dois `undefined`
    // daria "igual" e faria qualquer reserva sem id passar batida.
    !(ignorarAgendamentoId !== undefined && agendamento.id === ignorarAgendamentoId) &&
    agendamento.tipo === pedido.tipo &&
    agendamento.instituicaoId === pedido.instituicaoId &&
    // Um exame ocupa o horário da unidade; uma consulta ocupa o do profissional.
    (pedido.tipo === "exame" || agendamento.profissionalId === pedido.profissionalId) &&
    agendamento.data === pedido.data &&
    agendamento.horario === pedido.horario &&
    !STATUS_LIBERAM.includes(agendamento.status),
  );
}
