type Appointment = { id: string; instituicaoId: string; status: string };
type Change = { agendamentoId: string; data: string };

export function latestChangedUnit(appointments: Appointment[], changes: Change[]): string | undefined {
  const latest = [...changes].sort((a, b) => b.data.localeCompare(a.data))
    .map((change) => appointments.find((appointment) => appointment.id === change.agendamentoId))
    .find(Boolean);
  return latest?.instituicaoId ?? [...appointments].reverse().find((appointment) => appointment.status === "pendente")?.instituicaoId;
}
