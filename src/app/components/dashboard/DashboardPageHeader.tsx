import type { ReactNode } from "react";

interface DashboardPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Cabeçalho de tela.
 *
 * O "eyebrow" virou etiqueta com um traço da marca: dá um ponto de cor no topo
 * de cada página sem precisar de uma faixa colorida inteira.
 */
export function DashboardPageHeader({ eyebrow, title, description, action }: DashboardPageHeaderProps) {
  return (
    <header className="easy-page-header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-lg:pr-14">
        {eyebrow && (
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#087E8B]">
            <span aria-hidden="true" className="h-[3px] w-6 rounded-full bg-gradient-to-r from-[#087E8B] to-[#065F68]" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-tight text-[#243746] sm:text-[2rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#607985]">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </header>
  );
}
