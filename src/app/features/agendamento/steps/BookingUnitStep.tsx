import { useState, type ReactNode } from "react";
import { ArrowLeft, Building2, Info, MapPin } from "lucide-react";
import type { Instituicao, Profissional } from "../../../components/mockData";
import { AppButton } from "../../../components/ui/AppButton";
import { getBookableUnits, getUnitDistanceKm } from "../bookingOptions";
import { normalizeSearch, splitUnitsByCity } from "../bookingLocations";
import { locationLabel } from "../BookingSummary";
import type { BookingDraft } from "../bookingTypes";
import { SearchField, StepLayout, StepToolbar } from "../BookingUI";
import { mapsSearchUrl } from "../maps";

interface BookingUnitStepProps {
  draft: BookingDraft;
  institutions: Instituicao[];
  professionals: Profissional[];
  onSelect: (institutionId: string) => void;
  onBack: () => void;
  onEditLocation: () => void;
  aside?: ReactNode;
}

const unitTypeLabel: Record<Instituicao["tipo"], string> = {
  clinica: "Clínica",
  hospital: "Hospital",
  laboratorio: "Laboratório",
};

export function BookingUnitStep({ draft, institutions, professionals, onSelect, onBack, onEditLocation, aside }: BookingUnitStepProps) {
  const hasCoords = draft.latitude != null && draft.longitude != null;
  const [search, setSearch] = useState("");
  const [byDistance, setByDistance] = useState(hasCoords);
  const [showNearby, setShowNearby] = useState(false);

  const query = normalizeSearch(search);
  const bookable = getBookableUnits(draft, institutions, professionals)
    .filter((unit) => !query || normalizeSearch(`${unit.nome} ${unit.endereco}`).includes(query));
  const sort = (units: Instituicao[]) => byDistance
    ? [...units].sort((a, b) => (getUnitDistanceKm(draft, a) ?? Infinity) - (getUnitDistanceKm(draft, b) ?? Infinity))
    : units;
  // Vindo da página de uma unidade, ela aparece mesmo que a cidade escolhida seja outra.
  const { inCity, others } = draft.preInstId ? { inCity: bookable, others: [] } : splitUnitsByCity(bookable, draft);
  const noun = draft.tipo === "exame" ? "exame" : "consulta";

  function unitCard(unit: Instituicao) {
    const distance = getUnitDistanceKm(draft, unit);
    const selected = unit.id === draft.instituicaoId;
    return <article key={unit.id} className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--sombra-cartao)] ${selected ? "border-[#087E8B] shadow-[inset_0_0_0_1px_#087E8B]" : "border-[#B9D9DD]/55"}`}>
      <div className="flex-1 p-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-[#243746]">{unit.nome}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#F1F8F9] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#087E8B]">{unitTypeLabel[unit.tipo]}{distance !== null && ` · ${distance.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`}</p>
        <p className="mt-2.5 text-sm leading-6 text-[#607985]">{unit.endereco} - <a href={mapsSearchUrl(unit)} target="_blank" rel="noreferrer" className="font-semibold text-[#065F68] underline underline-offset-2 hover:text-[#087E8B]">ver no mapa<span className="sr-only"> (abre em nova aba)</span></a></p>
        <p className="mt-1 text-xs text-[#607985]">{unit.horarioFuncionamento}</p>
      </div>
      <div className="flex justify-end border-t border-[#B9D9DD]/40 bg-[#F8FCFC] px-4 py-3">
        <AppButton size="sm" className="rounded-full px-5" aria-label={`Agendar em ${unit.nome}`} onClick={() => onSelect(unit.id)}>Agendar</AppButton>
      </div>
    </article>;
  }

  return <>
    <StepToolbar>
      <div className="flex items-center gap-3">
        <SearchField id="booking-unit-search" label="Buscar unidade" value={search} onChange={setSearch}/>
        <button type="button" aria-pressed={byDistance} disabled={!hasCoords} onClick={() => setByDistance((value) => !value)} title={hasCoords ? "Ordenar por distância" : "Use “Próximo a mim” na localização para ordenar por distância"} className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B] disabled:cursor-not-allowed disabled:opacity-50 ${byDistance ? "bg-[#087E8B] text-white" : "bg-[#DCEFF1] text-[#065F68] hover:bg-[#c9e6e9]"}`}>Distância</button>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <MapPin size={20} className="shrink-0 text-[#087E8B]" aria-hidden="true"/>
        <p className="min-w-0 flex-1 leading-tight"><span className="block text-xs text-[#607985]">Localização selecionada</span><strong className="text-sm text-[#065F68]">{locationLabel(draft)}</strong></p>
        <button type="button" onClick={onEditLocation} className="text-sm font-semibold text-[#065F68] underline underline-offset-2 hover:text-[#087E8B]">Alterar</button>
      </div>
    </StepToolbar>

    <StepLayout aside={aside}>
      <section>
        <h2 className="text-base font-semibold text-[#243746]">Rede SaúdeConnect+</h2>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#DCEFF1] px-4 py-3 text-sm text-[#065F68]"><Info size={18} className="mt-0.5 shrink-0" aria-hidden="true"/>Escolha uma das unidades abaixo para agendar agora sua {noun}.</p>
        {inCity.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">{sort(inCity).map(unitCard)}</div>}
        {!inCity.length && <div className="mt-4 rounded-2xl border border-dashed border-[#B9D9DD] bg-white p-8 text-center">
          <Building2 size={30} className="mx-auto text-[#8BA2AB]" aria-hidden="true"/>
          <h3 className="mt-3 font-semibold text-[#243746]">{search ? `Nenhuma unidade encontrada para “${search}”` : `Nenhuma unidade com ${draft.service} em ${draft.cidade}`}</h3>
          <p className="mt-1 text-sm text-[#607985]">{others.length ? "Veja as unidades mais próximas ou altere a localização." : "Altere a especialidade, o exame ou a localização."}</p>
          {!others.length && <div className="mt-4"><AppButton variant="outline" onClick={onBack}><ArrowLeft size={16}/>Voltar</AppButton></div>}
        </div>}
        {others.length > 0 && !showNearby && <div className="mt-5 flex justify-end"><AppButton variant="outline" className="rounded-full" onClick={() => setShowNearby(true)}>Buscar unidades próximas</AppButton></div>}
        {others.length > 0 && showNearby && <div className="mt-6">
          <h2 className="text-base font-semibold text-[#243746]">Unidades próximas</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">{sort(others).map(unitCard)}</div>
        </div>}
      </section>
    </StepLayout>
  </>;
}
