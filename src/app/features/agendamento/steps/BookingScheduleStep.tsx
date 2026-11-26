import { useState, type ReactNode } from "react";
import { ArrowLeft, CalendarDays, Heart, Pencil, SlidersHorizontal } from "lucide-react";
import type { Agendamento, Instituicao, Profissional } from "../../../components/mockData";
import { AppButton } from "../../../components/ui/AppButton";
import type { BookingSchedule } from "../bookingFlow";
import { normalizeSearch } from "../bookingLocations";
import { getScheduleGroups } from "../bookingOptions";
import type { BookingDraft } from "../bookingTypes";
import { SearchField, StepLayout, StepToolbar } from "../BookingUI";

interface BookingScheduleStepProps {
  draft: BookingDraft;
  institution: Instituicao;
  professionals: Profissional[];
  appointments: Agendamento[];
  onSelect: (schedule: BookingSchedule) => void;
  onBack: () => void;
  aside?: ReactNode;
}

type Period = "todos" | "manha" | "tarde";
const FAVORITES_KEY = "saudeconnect:profissionais-favoritos";

function readFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]"); } catch { return []; }
}

function writeFavorites(ids: string[]) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)); } catch { /* armazenamento indisponível: favorito vale só nesta sessão */ }
}

function toDate(data: string) {
  return new Date(`${data}T12:00:00`);
}

function DateHeading({ data }: { data: string }) {
  const weekday = toDate(data).toLocaleDateString("pt-BR", { weekday: "long" });
  const rest = toDate(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return <h2 className="text-[15px] text-[#243746]"><strong className="font-semibold">{weekday.charAt(0).toLocaleUpperCase("pt-BR") + weekday.slice(1)}</strong>, {rest}</h2>;
}

function inPeriod(horario: string, period: Period) {
  if (period === "todos") return true;
  return period === "manha" ? horario < "12:00" : horario >= "12:00";
}

const chip = (active: boolean) => `min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B] ${active ? "border-[#087E8B] bg-gradient-to-br from-[#087E8B] to-[#065F68] text-white shadow-[0_6px_14px_-8px_rgba(8,126,139,0.9)]" : "border-[#B9D9DD]/70 bg-white text-[#065F68] hover:border-[#087E8B] hover:bg-[#F1F8F9]"}`;

export function BookingScheduleStep({ draft, institution, professionals, appointments, onSelect, onBack, aside }: BookingScheduleStepProps) {
  const isExam = draft.tipo === "exame";
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<"datas" | "filtros" | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("todos");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [notice, setNotice] = useState("");

  const allGroups = getScheduleGroups(draft, professionals, appointments);
  const dates = [...new Set(allGroups.map((group) => group.data))];
  const query = normalizeSearch(search);
  const groups = allGroups
    .filter((group) => !fromDate || group.data >= fromDate)
    .filter((group) => !query || normalizeSearch(group.providerName ?? "").includes(query))
    .filter((group) => !onlyFavorites || (group.professionalId && favorites.includes(group.professionalId)))
    .map((group) => ({ ...group, horarios: group.horarios.filter((horario) => inPeriod(horario, period)) }))
    .filter((group) => group.horarios.length > 0);
  const visibleDates = [...new Set(groups.map((group) => group.data))];
  const activeFilters = (period !== "todos" ? 1 : 0) + (onlyFavorites ? 1 : 0);

  function toggleFavorite(id: string, name: string) {
    const isFavorite = favorites.includes(id);
    const next = isFavorite ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next);
    writeFavorites(next);
    setNotice(isFavorite ? `${name} removido(a) dos favoritos.` : `${name} foi salvo(a) nos favoritos para seus próximos agendamentos.`);
  }

  function clearFilters() {
    setSearch(""); setFromDate(null); setPeriod("todos"); setOnlyFavorites(false);
  }

  return <>
    <StepToolbar>
      {!isExam && <SearchField id="booking-professional-search" label="Buscar profissional" value={search} onChange={setSearch}/>}
      <div className={`flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 ${isExam ? "" : "mt-3"}`}>
        <button type="button" aria-expanded={panel === "datas"} onClick={() => setPanel(panel === "datas" ? null : "datas")} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-left text-sm font-semibold text-[#065F68] hover:bg-[#DCEFF1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]">
          {fromDate ? `A partir de ${toDate(fromDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}` : "Datas mais próximas"}<Pencil size={15} aria-hidden="true"/>
        </button>
        <button type="button" aria-expanded={panel === "filtros"} onClick={() => setPanel(panel === "filtros" ? null : "filtros")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#DCEFF1] px-4 text-sm font-semibold text-[#065F68] hover:bg-[#c9e6e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B] sm:w-auto">
          <SlidersHorizontal size={15} aria-hidden="true"/>Filtrar{activeFilters > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#087E8B] px-1 text-xs text-white">{activeFilters}</span>}
        </button>
      </div>
      {panel === "datas" && <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Mostrar a partir da data">
        <button type="button" aria-pressed={!fromDate} onClick={() => setFromDate(null)} className={chip(!fromDate)}>Mais próximas</button>
        {dates.map((date) => <button key={date} type="button" aria-pressed={fromDate === date} onClick={() => setFromDate(date)} className={chip(fromDate === date)}>{toDate(date).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}</button>)}
      </div>}
      {panel === "filtros" && <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-[#607985]">Período:</span>
        {([["todos", "Todos"], ["manha", "Manhã"], ["tarde", "Tarde"]] as const).map(([id, label]) => <button key={id} type="button" aria-pressed={period === id} onClick={() => setPeriod(id)} className={chip(period === id)}>{label}</button>)}
        {!isExam && <label className="ml-auto inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium text-[#243746]"><input type="checkbox" checked={onlyFavorites} onChange={(event) => setOnlyFavorites(event.target.checked)} className="h-4 w-4 accent-[#087E8B]"/>Somente favoritos</label>}
      </div>}
    </StepToolbar>

    <StepLayout aside={aside}>
      <p role="status" className={notice ? "mb-4 rounded-xl bg-[#DCEFF1] px-4 py-3 text-sm text-[#065F68]" : "sr-only"}>{notice}</p>
      {visibleDates.length ? <div className="space-y-6">
        {visibleDates.map((date) => <section key={date}>
          <DateHeading data={date}/>
          <div className="mt-3 space-y-3">
            {groups.filter((group) => group.data === date).map((group) => {
              const professional = professionals.find((item) => item.id === group.professionalId);
              const favorite = Boolean(group.professionalId && favorites.includes(group.professionalId));
              return <article key={`${date}-${group.professionalId ?? "exame"}`} className="rounded-2xl border border-[#B9D9DD]/55 bg-white p-3.5 shadow-[var(--sombra-cartao)] transition-colors hover:border-[#087E8B]/35 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[17px] font-semibold tracking-tight text-[#243746]">{group.providerName ?? institution.nome}</h3>
                    <p className="mt-0.5 text-xs text-[#607985]">{professional ? `${professional.especialidade} · ${professional.crm}` : `${draft.service} · ${institution.nome}`}</p>
                  </div>
                  {group.professionalId && group.providerName && <button type="button" aria-pressed={favorite} aria-label={favorite ? `Remover ${group.providerName} dos favoritos` : `Favoritar ${group.providerName}`} onClick={() => toggleFavorite(group.professionalId!, group.providerName!)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#607985] hover:bg-[#F4F9FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]">
                    <Heart size={20} className={favorite ? "fill-[#E5484D] text-[#E5484D]" : ""} aria-hidden="true"/>
                  </button>}
                </div>
                <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-[#B9D9DD]/35 pt-3.5 min-[420px]:grid-cols-4 sm:grid-cols-6">
                  {group.horarios.map((horario) => {
                    const selected = draft.data === date && draft.horario === horario && (isExam || draft.profissionalId === group.professionalId);
                    return <button key={horario} type="button" aria-pressed={selected} onClick={() => onSelect({ profissionalId: group.professionalId, data: date, horario })} aria-label={`${horario}, ${toDate(date).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}${group.providerName ? `, ${group.providerName}` : ""}`} className={`min-h-11 min-w-0 rounded-xl border px-2 text-sm font-semibold tabular-nums transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]/45 ${selected ? "border-[#087E8B] bg-gradient-to-br from-[#087E8B] to-[#065F68] text-white shadow-[0_6px_14px_-8px_rgba(8,126,139,0.9)]" : "border-[#B9D9DD]/70 bg-[#F8FCFC] text-[#065F68] hover:-translate-y-0.5 hover:border-[#087E8B] hover:bg-white hover:shadow-[var(--sombra-cartao)]"}`}>{horario}</button>;
                  })}
                </div>
              </article>;
            })}
          </div>
        </section>)}
      </div> : <div className="rounded-2xl border border-dashed border-[#B9D9DD] bg-white p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F1F8F9] text-[#087E8B]"><CalendarDays size={26} aria-hidden="true"/></span>
        <h3 className="mt-4 text-base font-semibold tracking-tight text-[#243746]">{allGroups.length ? "Nenhum horário com esses filtros" : "Nenhum horário disponível nesta unidade"}</h3>
        <p className="mt-1 text-sm text-[#607985]">{allGroups.length ? "Limpe os filtros para ver todos os horários." : "Escolha outra unidade ou altere o atendimento."}</p>
        <div className="mt-4">{allGroups.length ? <AppButton variant="outline" onClick={clearFilters}>Limpar filtros</AppButton> : <AppButton variant="outline" onClick={onBack}><ArrowLeft size={16}/>Escolher outra unidade</AppButton>}</div>
      </div>}
    </StepLayout>
  </>;
}
