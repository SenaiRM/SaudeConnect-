/**
 * Converte uma data para "YYYY-MM-DD" no fuso LOCAL.
 *
 * `toISOString()` serializa em UTC: às 23h em UTC-3 ele devolve o dia seguinte,
 * o que deslocava a grade de horários inteira todo fim de noite.
 */
export function toLocalISODate(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** Interpreta "YYYY-MM-DD" ao meio-dia local, longe das viradas de fuso. */
export function parseLocalDate(data: string): Date {
  const [ano, mes, dia] = data.split("-").map(Number);
  return new Date(ano, mes - 1, dia, 12, 0, 0);
}

/** Momento exato de um agendamento, para comparar com "agora". */
export function appointmentTime(data: string, horario: string): number {
  const [ano, mes, dia] = data.split("-").map(Number);
  const [hora, minuto] = horario.split(":").map(Number);
  return new Date(ano, mes - 1, dia, hora, minuto, 0).getTime();
}

/** Diferença em dias inteiros entre duas datas "YYYY-MM-DD". */
export function diffEmDias(de: string, para: string): number {
  const umDia = 24 * 60 * 60 * 1000;
  return Math.round((parseLocalDate(para).getTime() - parseLocalDate(de).getTime()) / umDia);
}

/** Soma dias a uma data "YYYY-MM-DD", devolvendo outra data local. */
export function somarDias(data: string, dias: number): string {
  const base = parseLocalDate(data);
  base.setDate(base.getDate() + dias);
  return toLocalISODate(base);
}
