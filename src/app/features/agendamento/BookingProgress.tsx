import { useEffect, useRef } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import type { AgendamentoTipo } from "../../components/mockData";
import type { BookingStep } from "./bookingFlow";

export const BOOKING_STEPS = [
  { id: "localizacao", label: "Localização" },
  { id: "servico", label: "Especialidade" },
  { id: "unidade", label: "Unidade" },
  { id: "agenda", label: "Profissional" },
  { id: "confirmar", label: "Confirmar" },
] as const;

export interface BookingHeaderCrumb {
  label: string;
  onClick?: () => void;
}

interface BookingProgressProps {
  current: BookingStep;
  tipo?: AgendamentoTipo | null;
  onBack: () => void;
  onClose: () => void;
  onGoTo: (step: BookingStep) => void;
  /** Subtelas (ex.: escolher estado/cidade) trocam as etapas por título e trilha próprios. */
  title?: string;
  crumbs?: BookingHeaderCrumb[];
}

function stepLabel(id: BookingStep, tipo?: AgendamentoTipo | null) {
  if (id === "agenda" && tipo === "exame") return "Horário";
  if (id === "servico" && tipo === "exame") return "Exame";
  return BOOKING_STEPS.find((step) => step.id === id)?.label ?? "";
}

export function bookingTitle(tipo?: AgendamentoTipo | null) {
  return tipo === "exame" ? "Agendar exame" : tipo === "consulta" ? "Agendar consulta" : "Agendar atendimento";
}

export function BookingProgress({ current, tipo, onBack, onClose, onGoTo, title, crumbs }: BookingProgressProps) {
  const activeIndex = Math.max(0, BOOKING_STEPS.findIndex((step) => step.id === current));
  const stepsRef = useRef<HTMLElement | null>(null);

  // No desktop as etapas rolam na horizontal: mantém a etapa atual visível.
  useEffect(() => {
    const nav = stepsRef.current;
    const active = nav?.querySelector<HTMLElement>("[aria-current=step]");
    if (nav && active) nav.scrollLeft = active.offsetLeft - nav.clientWidth / 2 + active.offsetWidth / 2;
  }, [activeIndex, crumbs]);

  return <header className="relative overflow-hidden bg-gradient-to-br from-[#0A8C9A] via-[#087E8B] to-[#065F68] px-4 pb-4 pt-4 text-white shadow-[0_10px_30px_-18px_rgba(8,126,139,0.9)] sm:px-6 lg:rounded-[var(--raio-cartao)]"><span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2">
      <button type="button" onClick={onBack} aria-label="Voltar para a etapa anterior" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-[420px]:w-auto min-[420px]:gap-1.5 min-[420px]:px-2.5"><ArrowLeft size={21}/><span className="hidden min-[420px]:inline">Voltar</span></button>
      <h1 className="min-w-0 text-center text-base font-semibold leading-tight sm:text-left sm:text-2xl">{title ?? bookingTitle(tipo)}</h1>
      <button type="button" onClick={onClose} aria-label="Sair do agendamento" className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X size={22}/></button>
    </div>

    {crumbs ? <nav aria-label="Trilha" className="mt-2 pl-[3.25rem] text-sm font-medium">
      {crumbs.map((crumb, index) => <span key={crumb.label}>
        {index > 0 && <span className="px-1.5 text-white/60">/</span>}
        {crumb.onClick ? <button type="button" onClick={crumb.onClick} className="underline underline-offset-2 hover:text-white/80">{crumb.label}</button> : <span className={index === crumbs.length - 1 ? "" : "text-white/80"}>{crumb.label}</span>}
      </span>)}
    </nav> : <>
      <section aria-label={`Etapa ${activeIndex + 1} de ${BOOKING_STEPS.length}`} className="relative mt-4 rounded-xl bg-white/15 px-3.5 py-3 ring-1 ring-inset ring-white/15 sm:hidden">
        <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">Etapa {activeIndex + 1} de {BOOKING_STEPS.length}</span><span className="text-sm font-semibold">{stepLabel(current, tipo)}</span></div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white transition-[width] duration-300" style={{ width: `${((activeIndex + 1) / BOOKING_STEPS.length) * 100}%` }}/></div>
      </section>
      <nav ref={stepsRef} aria-label="Etapas do agendamento" className="relative mt-3 hidden overflow-x-auto pl-[3.25rem] [scrollbar-width:none] sm:block [&::-webkit-scrollbar]:hidden">
      <ol className="flex w-max items-center gap-2">
        {BOOKING_STEPS.map((step, index) => {
          const completed = index < activeIndex;
          const active = index === activeIndex;
          return <li key={step.id} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className={`h-[2px] w-5 rounded-full sm:w-7 ${index <= activeIndex ? "bg-white" : "bg-white/35"}`}/>}
            <button type="button" onClick={() => onGoTo(step.id)} disabled={!completed} aria-current={active ? "step" : undefined} className={`flex items-center gap-2 rounded-full py-1 pr-1 text-sm font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${completed ? "hover:opacity-80" : "cursor-default"} ${!completed && !active ? "text-white/70" : "text-white"}`}>
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${completed ? "bg-white/90 text-[#065F68] ring-1 ring-inset ring-white" : active ? "bg-white text-[#087E8B] shadow-[0_0_0_4px_rgba(255,255,255,0.22)]" : "border border-white/55 text-white/85"}`}>
                {completed ? <Check size={14} strokeWidth={3} aria-hidden="true"/> : index + 1}
              </span>
              <span className={`whitespace-nowrap ${active ? "font-semibold" : ""}`}>{stepLabel(step.id, tipo)}</span>
              {completed && <span className="sr-only">(concluída)</span>}
            </button>
          </li>;
        })}
      </ol>
      </nav>
    </>}
  </header>;
}
