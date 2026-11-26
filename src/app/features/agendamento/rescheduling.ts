export type AppointmentChange = {
  agendamentoId: string;
  tipo: "criado" | "reagendado" | "reagendamento_confirmado" | "confirmado" | "cancelado";
  responsavel: string;
  data: string;
  anterior: Record<string, string>;
  atual: Record<string, string>;
};

type SchedulableAppointment = {
  id: string;
  usuarioId: string;
  data: string;
  horario: string;
  status: string;
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function createAppointmentHistory<T extends SchedulableAppointment>(appointment: T, createdAt: string) {
  return {
    agendamentoId: appointment.id,
    tipo: "criado" as const,
    responsavel: "usuário",
    data: createdAt,
    anterior: {},
    atual: { data: appointment.data, horario: appointment.horario, status: appointment.status },
  } satisfies AppointmentChange;
}

export function rescheduleAppointment<T extends SchedulableAppointment>(appointment: T, data: string, horario: string, changedAt: string) {
  const request = getReschedulingRequest(appointment.data, appointment.horario, data, horario);
  return {
    appointment: { ...appointment, data, horario, status: request.status },
    event: {
      agendamentoId: appointment.id,
      tipo: "reagendado" as const,
      responsavel: "usuario",
      data: changedAt,
      anterior: { data: appointment.data, horario: appointment.horario },
      atual: { data, horario },
    } satisfies AppointmentChange,
  };
}

export function confirmReschedulingAppointment<T extends SchedulableAppointment>(appointment: T, changedAt: string) {
  return {
    appointment: { ...appointment, status: "confirmado" },
    event: {
      agendamentoId: appointment.id,
      tipo: "reagendamento_confirmado" as const,
      responsavel: "secretaria",
      data: changedAt,
      anterior: { status: appointment.status },
      atual: { data: appointment.data, horario: appointment.horario, status: "confirmado" },
    } satisfies AppointmentChange,
  };
}

export function cancelAppointmentByProfessional<T extends SchedulableAppointment>(appointment: T, professionalName: string, changedAt: string) {
  return {
    appointment: { ...appointment, status: "cancelado" },
    event: {
      agendamentoId: appointment.id,
      tipo: "cancelado" as const,
      responsavel: professionalName,
      data: changedAt,
      anterior: { status: appointment.status },
      atual: { status: "cancelado" },
    } satisfies AppointmentChange,
    notification: {
      usuarioId: appointment.usuarioId,
      agendamentoId: appointment.id,
      titulo: "Agendamento cancelado pelo profissional",
      mensagem: `Seu agendamento de ${formatDate(appointment.data)} às ${appointment.horario} foi cancelado por ${professionalName}. Escolha um novo horário quando puder.`,
      tipo: "cancelamento" as const,
    },
  };
}

export function getReschedulingRequest(oldDate: string, oldTime: string, newDate: string, newTime: string) {
  return {
    status: "reagendamento" as const,
    title: "Reagendamento enviado para confirmação",
    message: `Solicitação enviada: de ${formatDate(oldDate)} às ${oldTime} para ${formatDate(newDate)} às ${newTime}. Aguarde a confirmação da secretaria.`,
  };
}

/**
 * A secretaria confirma um agendamento que estava aguardando a unidade.
 *
 * Devolve `null` quando não há o que confirmar, para que clicar duas vezes não
 * gere um segundo evento no histórico nem um segundo aviso ao paciente.
 */
export function confirmAppointment<T extends SchedulableAppointment>(appointment: T, changedAt: string) {
  if (appointment.status !== "pendente") return null;
  return {
    appointment: { ...appointment, status: "confirmado" },
    event: {
      agendamentoId: appointment.id,
      tipo: "confirmado" as const,
      responsavel: "secretaria",
      data: changedAt,
      anterior: { status: appointment.status },
      atual: { data: appointment.data, horario: appointment.horario, status: "confirmado" },
    } satisfies AppointmentChange,
  };
}
