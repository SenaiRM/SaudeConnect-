import { diffEmDias, somarDias, toLocalISODate } from "../agendamento/dates.ts";

export const DEMO_STATE_KEY = "saudeconnect-demo-state-v2";
export const LEGACY_DEMO_STATE_KEY = "saudeconnect-demo-state-v1";

/** Status em que o atendimento ainda vai acontecer. */
const STATUS_ATIVOS = ["pendente", "confirmado", "reagendamento", "indisponivel"];

type NotificacaoLike = { destinatario?: string; tipo?: string };
type HistoricoLike = { responsavel?: string; tipo?: string; anterior?: unknown; atual?: unknown };

// As telas indexam estilos por estes tipos; um valor fora da lista derrubava a página inteira.
const TIPOS_DE_AVISO = ["lembrete", "confirmacao", "cancelamento", "info"];
const TIPOS_DE_HISTORICO = ["criado", "reagendado", "reagendamento_confirmado", "confirmado", "cancelado"];
type AgendamentoLike = { data: string; status: string };

type DemoStateLike = {
  agendamentos: AgendamentoLike[];
  notificacoes: NotificacaoLike[];
  historicoAgendamentos: HistoricoLike[];
};

function isLista(valor: unknown): valor is unknown[] {
  return Array.isArray(valor);
}

/**
 * Converte o estado salvo na versão 1 para a versão 2.
 *
 * O papel "admin" virou "secretaria". Sem esta conversão, um estado antigo
 * deixaria avisos internos (`destinatario: "admin"`) visíveis para o paciente,
 * porque o filtro passa a procurar por "secretaria".
 *
 * Devolve `null` quando o conteúdo não tem o formato esperado.
 */
export function migrateDemoState<T extends DemoStateLike>(bruto: unknown): T | null {
  if (!bruto || typeof bruto !== "object") return null;
  const estado = bruto as Record<string, unknown>;
  if (!isLista(estado.agendamentos) || !isLista(estado.notificacoes) || !isLista(estado.historicoAgendamentos)) {
    return null;
  }

  return {
    ...estado,
    agendamentos: estado.agendamentos,
    notificacoes: estado.notificacoes.filter((item) => item && typeof item === "object").map((item) => {
      const bruta = item as NotificacaoLike;
      const notificacao = TIPOS_DE_AVISO.includes(bruta.tipo ?? "") ? bruta : { ...bruta, tipo: "info" };
      return notificacao.destinatario === "admin"
        ? { ...notificacao, destinatario: "secretaria" }
        : notificacao;
    }),
    historicoAgendamentos: estado.historicoAgendamentos.filter((item) => {
      const evento = item as HistoricoLike | null;
      return Boolean(evento && TIPOS_DE_HISTORICO.includes(evento.tipo ?? "") && evento.anterior && evento.atual);
    }).map((item) => {
      const evento = item as HistoricoLike;
      if (evento.responsavel === "admin") return { ...evento, responsavel: "secretaria" };
      // "usuário" e "usuario" conviviam no histórico gravado.
      if (evento.responsavel === "usuário") return { ...evento, responsavel: "usuario" };
      return evento;
    }),
  } as T;
}

/**
 * Traz para a frente os agendamentos ativos que venceram enquanto a demonstração
 * ficou parada, preservando o intervalo entre eles.
 *
 * As datas iniciais são relativas ao primeiro dia de uso e ficam congeladas no
 * armazenamento local; sem isto, quem reabre o app dias depois encontra a aba
 * "Próximos" vazia.
 */
export function rebaseDemoAppointments<T extends AgendamentoLike>(agendamentos: T[], hoje = new Date()): T[] {
  const hojeISO = toLocalISODate(hoje);
  const ativos = agendamentos.filter((item) => STATUS_ATIVOS.includes(item.status));
  if (!ativos.length) return agendamentos;

  const maisAntigo = ativos.reduce((menor, item) => (item.data < menor ? item.data : menor), ativos[0].data);
  if (maisAntigo > hojeISO) return agendamentos;

  // O mais antigo passa a ser amanhã; os demais mantêm a distância original.
  const deslocamento = diffEmDias(maisAntigo, hojeISO) + 1;
  return agendamentos.map((item) =>
    STATUS_ATIVOS.includes(item.status) ? { ...item, data: somarDias(item.data, deslocamento) } : item,
  );
}
