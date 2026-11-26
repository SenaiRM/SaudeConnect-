import { useState, type ReactNode } from "react";
import { FlaskConical, Stethoscope } from "lucide-react";
import type { AgendamentoTipo } from "../../../components/mockData";
import { filterBookingServices, getMostSearched, groupByInitial, serviceDescription } from "../bookingStepOptions";
import { OptionCard, SearchField, SectionLabel, StepLayout, StepToolbar } from "../BookingUI";

interface BookingServiceStepProps {
  tipo: AgendamentoTipo | null;
  service?: string;
  onSelect: (tipo: AgendamentoTipo, service: string) => void;
  /** Só o que tem agenda: a rede toda ou, vindo da página de uma unidade, o que ela atende. */
  limitTo?: Record<AgendamentoTipo, string[]>;
  aside?: ReactNode;
}

const TYPES = [
  { id: "consulta", label: "Consulta", icon: Stethoscope },
  { id: "exame", label: "Exame", icon: FlaskConical },
] as const;

export function BookingServiceStep({ tipo: initialTipo, service, onSelect, limitTo, aside }: BookingServiceStepProps) {
  const [tipo, setTipo] = useState<AgendamentoTipo | null>(initialTipo);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const allowed = (item: string) => !limitTo || !tipo || limitTo[tipo].includes(item);
  const services = filterBookingServices(tipo, search).filter(allowed);
  const groups = groupByInitial(services);
  const mostSearched = search ? [] : getMostSearched(tipo).filter(allowed);
  const noun = tipo === "exame" ? "exame" : "especialidade";

  function card(item: string, highlighted = false) {
    const description = tipo ? serviceDescription(tipo, item) : undefined;
    const key = `${highlighted ? "top" : "all"}-${item}`;
    const open = expanded === key;
    return <OptionCard key={key} title={item} highlighted={highlighted} selected={!highlighted && item === service && tipo === initialTipo} onSelect={() => tipo && onSelect(tipo, item)}
      subtitle={open ? <span className="mt-1 block max-w-[34ch]">{description}</span> : undefined}
      extra={description && <button type="button" aria-expanded={open} onClick={() => setExpanded(open ? null : key)} className="mt-0.5 text-xs font-semibold text-[#065F68] underline underline-offset-2 hover:text-[#087E8B]">{open ? "Ver menos" : "Saber mais"}</button>}/>;
  }

  return <>
    {tipo && <StepToolbar>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#607985]">Trocar tipo de atendimento</p>
        <div className="flex rounded-xl border border-[#B9D9DD] bg-[#F4F9FA] p-1" role="group" aria-label="Tipo de atendimento">
          {TYPES.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={tipo === id} onClick={() => { setTipo(id); setSearch(""); setExpanded(null); }} className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B] ${tipo === id ? "bg-[#087E8B] text-white shadow-sm" : "text-[#607985] hover:text-[#087E8B]"}`}><Icon size={17} aria-hidden="true"/>{label}</button>)}
        </div>
      </div>
      <div className="mt-3"><SearchField id="booking-service-search" label={`Buscar ${noun}`} value={search} onChange={setSearch}/></div>
      {groups.length > 1 && <nav aria-label="Índice alfabético" className="-mx-1 mt-3 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map(({ letter }) => <a key={letter} href={`#letra-${letter}`} onClick={(event) => { event.preventDefault(); document.getElementById(`letra-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="grid h-8 min-w-8 place-items-center rounded-md text-sm font-medium text-[#087E8B] hover:bg-[#DCEFF1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]">{letter}</a>)}
      </nav>}
    </StepToolbar>}

    <StepLayout aside={aside}>
      {!tipo ? <section>
        <SectionLabel>O que você quer agendar?</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map(({ id, label, icon: Icon }) => <OptionCard key={id} title={label} icon={<Icon size={20}/>} subtitle={id === "consulta" ? "Atendimento com um especialista" : "Exames laboratoriais e de imagem"} onSelect={() => setTipo(id)}/>)}
        </div>
      </section> : <div className="space-y-7">
        {mostSearched.length > 0 && <section>
          <SectionLabel>Mais procurados</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-2">{mostSearched.map((item) => card(item, true))}</div>
        </section>}
        {groups.map(({ letter, items }) => <section key={letter} id={`letra-${letter}`} className="scroll-mt-4">
          <h2 className="mb-3 text-lg font-semibold text-[#087E8B]">{letter}</h2>
          <div className="grid gap-3 sm:grid-cols-2">{items.map((item) => card(item))}</div>
        </section>)}
        {!services.length && <p className="rounded-xl border border-[#DCEFF1] bg-white p-5 text-sm text-[#607985]">{search ? `Nenhum(a) ${noun} encontrado(a) para “${search}”. Tente outro termo.` : `Não há ${tipo === "exame" ? "exames" : "consultas"} com agenda disponível no momento. Troque o tipo de atendimento acima.`}</p>}
      </div>}
    </StepLayout>
  </>;
}
