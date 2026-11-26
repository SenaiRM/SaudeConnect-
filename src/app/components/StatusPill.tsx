import type { AgendamentoStatus } from "./mockData";
import { getStatusBg, getStatusColor, getStatusLabel } from "./mockData";

/**
 * Selo de status.
 *
 * O ponto colorido à esquerda dá leitura imediata mesmo quando o texto é longo
 * ("Aguardando confirmação") ou quando a pessoa não distingue bem as cores.
 */
export function StatusPill({ status, className = "" }: { status: AgendamentoStatus; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${className}`}
      style={{ background: getStatusBg(status), color: getStatusColor(status) }}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
      {getStatusLabel(status)}
    </span>
  );
}
