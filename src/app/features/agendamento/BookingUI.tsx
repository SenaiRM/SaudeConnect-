import type { ReactNode } from "react";
import { ArrowRight, Search } from "lucide-react";

/** Faixa clara logo abaixo do cabeçalho, com a busca da etapa. */
export function StepToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-[#B9D9DD]/45 bg-white px-4 py-3.5 sm:px-6 lg:mt-4 lg:rounded-[var(--raio-cartao)] lg:border lg:shadow-[var(--sombra-cartao)]">
      {children}
    </div>
  );
}

interface SearchFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ id, label, value, onChange }: SearchFieldProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">{label}</label>
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8BA2AB]" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="min-h-11 w-full rounded-full border border-[#B9D9DD] bg-[#F4F9FA] py-2 pl-11 pr-4 text-sm text-[#243746] outline-none transition-colors placeholder:text-[#8BA2AB] focus:border-[#087E8B] focus:bg-white focus:ring-2 focus:ring-[#087E8B]/20"
      />
    </div>
  );
}

/** Conteúdo da etapa à esquerda e "Resumo do agendamento" à direita no desktop. */
export function StepLayout({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className={`grid gap-5 px-4 pt-5 sm:px-6 lg:px-0 ${aside ? "lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start" : ""}`}>
      <div className="min-w-0">{children}</div>
      {aside}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#607985]">
      <span aria-hidden="true" className="h-[3px] w-4 rounded-full bg-[#B9D9DD]" />
      {children}
    </h2>
  );
}

interface OptionCardProps {
  title: string;
  onSelect: () => void;
  icon?: ReactNode;
  subtitle?: ReactNode;
  highlighted?: boolean;
  selected?: boolean;
  /** Conteúdo interativo extra (ex.: "Saber mais"), fica acima da área clicável do cartão. */
  extra?: ReactNode;
}

/**
 * Cartão de escolha do fluxo.
 *
 * O cartão inteiro é clicável (o pseudo-elemento do botão cobre a área), então
 * conteúdo interativo extra precisa de `z-10` para continuar alcançável.
 */
export function OptionCard({ title, onSelect, icon, subtitle, highlighted, selected, extra }: OptionCardProps) {
  return (
    <div
      className={`group relative flex min-h-[4.25rem] items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#087E8B]/45 hover:-translate-y-0.5 hover:border-[#087E8B]/45 hover:shadow-[var(--sombra-cartao)] ${
        selected
          ? "border-[#087E8B] bg-[#DCEFF1] shadow-[inset_0_0_0_1px_#087E8B]"
          : highlighted
            ? "border-[#B9D9DD]/60 bg-gradient-to-br from-[#F1F8F9] to-white"
            : "border-[#B9D9DD]/55 bg-white"
      }`}
    >
      {highlighted && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(8,126,139,0.1),transparent_65%)]"
        />
      )}
      {icon && (
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#DCEFF1] to-[#EAF5F6] text-[#087E8B] ring-1 ring-inset ring-[#B9D9DD]/50 transition-colors group-hover:from-[#087E8B] group-hover:to-[#065F68] group-hover:text-white">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onSelect}
          className="text-left text-[15px] font-semibold tracking-tight text-[#243746] outline-none after:absolute after:inset-0 after:content-['']"
        >
          {title}
        </button>
        {subtitle && <div className="mt-0.5 text-xs leading-snug text-[#607985]">{subtitle}</div>}
        {extra && <div className="relative z-10">{extra}</div>}
      </div>
      <ArrowRight
        size={19}
        className="pointer-events-none relative shrink-0 text-[#087E8B] transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </div>
  );
}
