import type { AgendamentoHistorico } from "../../components/mockData";

export const historyLabels: Record<AgendamentoHistorico["tipo"], { title: string; description: string }> = {
  criado: { title: "Agendamento criado", description: "Atendimento registrado" },
  confirmado: { title: "Agendamento confirmado", description: "Confirmado pela secretaria" },
  reagendado: { title: "Reagendamento solicitado", description: "Aguardando confirmação da secretaria" },
  reagendamento_confirmado: { title: "Novo horário confirmado", description: "Confirmado pela secretaria" },
  cancelado: { title: "Atendimento cancelado", description: "Cancelamento registrado" },
};
