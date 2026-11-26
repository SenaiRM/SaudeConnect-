import { useEffect, useRef, useState } from "react";
import { History, LocateFixed, MapPin } from "lucide-react";
import type { Instituicao, User } from "../../../components/mockData";
import { AppButton } from "../../../components/ui/AppButton";
import type { BookingLocation } from "../bookingFlow";
import type { BookingDraft } from "../bookingTypes";
import { citiesOf, findNearestCity, normalizeSearch, searchByName, ufName, UFS } from "../bookingLocations";
import { locationLabel } from "../BookingSummary";
import { OptionCard, SearchField, SectionLabel, StepLayout, StepToolbar } from "../BookingUI";

export type LocationMode = "opcoes" | "estado" | "cidade";

interface BookingLocationStepProps {
  mode: LocationMode;
  uf: string;
  value: Pick<BookingDraft, "cidade" | "estado" | "latitude" | "longitude">;
  user?: User | null;
  institutions: Instituicao[];
  onModeChange: (mode: LocationMode) => void;
  onUfChange: (uf: string) => void;
  onContinue: (location: BookingLocation) => void;
}

type GeoStatus = "idle" | "loading" | "error";

export function BookingLocationStep({ mode, uf, value, user, institutions, onModeChange, onUfChange, onContinue }: BookingLocationStepProps) {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [search, setSearch] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [manualCity, setManualCity] = useState("");
  const geoRequest = useRef(0);
  const unitCities = new Set(institutions.map((unit) => normalizeSearch(unit.cidade ?? "")).filter(Boolean));

  useEffect(() => { setSearch(""); setManualOpen(false); }, [mode, uf]);
  // Uma resposta de GPS que chegue depois de sair da tela não pode avançar o fluxo.
  useEffect(() => () => { geoRequest.current += 1; }, []);

  function locateDevice() {
    if (!navigator.geolocation) { setGeoStatus("error"); return; }
    const request = ++geoRequest.current;
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (request !== geoRequest.current) return;
        const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        const nearest = findNearestCity(coords, institutions);
        setGeoStatus("idle");
        onContinue({ cidade: nearest?.cidade ?? "Sua localização", estado: nearest?.estado ?? "", ...coords });
      },
      () => { if (request === geoRequest.current) setGeoStatus("error"); },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  function chooseManually() {
    geoRequest.current += 1;
    setGeoStatus("idle");
    onModeChange("estado");
  }

  if (mode === "estado") {
    const states = UFS.filter((item) => searchByName([item.nome], search).length || normalizeSearch(item.sigla) === normalizeSearch(search));
    const home = user?.endereco;
    return <>
      <StepToolbar><SearchField id="booking-state-search" label="Buscar estado" value={search} onChange={setSearch}/></StepToolbar>
      <StepLayout>
        <div className="mx-auto max-w-3xl space-y-6">
          {home?.cidade && !search && <section>
            <SectionLabel>Sugestão para você</SectionLabel>
            <OptionCard title={home.cidade} subtitle={`${ufName(home.estado)} · Endereço cadastrado`} icon={<History size={20}/>} highlighted onSelect={() => onContinue({ cidade: home.cidade, estado: home.estado })}/>
          </section>}
          <section>
            <SectionLabel>Selecione o estado</SectionLabel>
            {states.length ? <div className="grid gap-3 sm:grid-cols-2">
              {states.map((item) => <OptionCard key={item.sigla} title={item.nome} subtitle={item.sigla} onSelect={() => { onUfChange(item.sigla); onModeChange("cidade"); }}/>)}
            </div> : <p className="rounded-xl bg-white p-4 text-sm text-[#607985]">Nenhum estado encontrado para “{search}”.</p>}
          </section>
        </div>
      </StepLayout>
    </>;
  }

  if (mode === "cidade") {
    const cities = searchByName(citiesOf(uf), search);
    return <>
      <StepToolbar><SearchField id="booking-city-search" label="Buscar região/cidade" value={search} onChange={setSearch}/></StepToolbar>
      <StepLayout>
        <div className="mx-auto max-w-3xl">
          <SectionLabel>Selecione a região/cidade</SectionLabel>
          {cities.length ? <div className="grid gap-3 sm:grid-cols-2">
            {cities.map((city) => <OptionCard key={city} title={city} subtitle={unitCities.has(normalizeSearch(city)) ? "Unidades SaúdeConnect+ na cidade" : undefined} onSelect={() => onContinue({ cidade: city, estado: uf })}/>)}
          </div> : <p className="rounded-xl bg-white p-4 text-sm text-[#607985]">Nenhuma cidade encontrada para “{search}”.</p>}
          <div className="mt-6 flex justify-center">
            {!manualOpen ? <AppButton variant="outline" className="rounded-full" onClick={() => { setManualOpen(true); setManualCity(search); }}>Não encontrei a cidade desejada</AppButton>
              : <form className="w-full rounded-2xl border border-[#DCEFF1] bg-white p-4" onSubmit={(event) => { event.preventDefault(); if (manualCity.trim()) onContinue({ cidade: manualCity.trim(), estado: uf }); }}>
                <label htmlFor="booking-manual-city" className="text-sm font-semibold text-[#243746]">Digite sua cidade em {ufName(uf)}</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input id="booking-manual-city" autoFocus autoComplete="address-level2" value={manualCity} onChange={(event) => setManualCity(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#B9D9DD] px-4 text-sm text-[#243746] outline-none focus:border-[#087E8B] focus:ring-2 focus:ring-[#087E8B]/20"/>
                  <AppButton type="submit" disabled={!manualCity.trim()}>Continuar</AppButton>
                </div>
              </form>}
          </div>
        </div>
      </StepLayout>
    </>;
  }

  const current = locationLabel(value);
  return <StepLayout>
    <div className="mx-auto max-w-3xl pt-2">
      <SectionLabel>Selecione uma opção</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        <OptionCard title={geoStatus === "loading" ? "Localizando…" : "Próximo a mim"} icon={<MapPin size={20}/>} subtitle="Usa a localização do seu aparelho" onSelect={locateDevice}/>
        <OptionCard title="Escolher local" icon={<LocateFixed size={20}/>} subtitle="Selecione estado e cidade" onSelect={chooseManually}/>
      </div>
      {geoStatus === "error" && <p role="alert" className="mt-4 rounded-xl border border-[#FCD9B6] bg-[#FFF7ED] p-3 text-sm text-[#9A3412]">Não foi possível usar sua localização. Toque em “Escolher local” para selecionar a cidade.</p>}
      {current && <div className="mt-6">
        <SectionLabel>Local selecionado</SectionLabel>
        <OptionCard title={current} icon={<History size={20}/>} subtitle="Continuar com este local" highlighted onSelect={() => onContinue({ ...value, cidade: value.cidade ?? "" })}/>
      </div>}
    </div>
  </StepLayout>;
}
