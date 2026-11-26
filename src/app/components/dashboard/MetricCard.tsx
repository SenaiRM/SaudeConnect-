import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  /** Destaca o cartão quando o número pede ação (ex.: pedidos aguardando). */
  destaque?: boolean;
  className?: string;
}

/**
 * Cartão de número do painel.
 *
 * O ícone fica atrás do conteúdo, em tom bem claro, para dar textura sem
 * competir com o número — que é a única coisa que precisa ser lida de longe.
 */
export function MetricCard({ label, value, description, icon, destaque = false, className = "" }: MetricCardProps) {
  return (
    <article
      className={`easy-card group relative isolate overflow-hidden rounded-[var(--raio-cartao)] border bg-white p-3 transition-shadow duration-200 hover:shadow-[var(--sombra-cartao)] min-[420px]:p-4 sm:p-5 ${
        destaque ? "border-[#087E8B]/35 bg-gradient-to-br from-white to-[#F1F8F9]" : "border-[#B9D9DD]/50"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-4 -z-10 hidden h-20 w-20 place-items-center rounded-full bg-[#DCEFF1]/50 text-[#087E8B]/35 min-[420px]:grid [&>svg]:h-6 [&>svg]:w-6 min-[420px]:[&>svg]:h-7 min-[420px]:[&>svg]:w-7"
      >
        {icon}
      </span>
      <p className="text-[10px] font-semibold uppercase leading-tight tracking-[0.08em] text-[#607985] min-[420px]:text-[11px] min-[420px]:tracking-[0.1em]">{label}</p>
      <p className="mt-2 text-2xl font-bold leading-none tracking-tight text-[#243746] min-[420px]:mt-3 min-[420px]:text-[2rem] sm:text-[2.25rem]">{value}</p>
      {description && <p className="mt-1.5 hidden text-xs leading-snug text-[#607985] min-[420px]:mt-2 min-[420px]:block">{description}</p>}
      {destaque && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#087E8B] to-[#065F68]" />}
    </article>
  );
}
