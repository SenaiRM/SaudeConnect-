import { useEffect, useState } from "react";
import { Search, Building2, FlaskConical, Hospital, MapPin, Star, Navigation, LoaderCircle, Map as MapIcon } from "lucide-react";
import type { Screen, Instituicao } from "./mockData";
import { instituicoes } from "./mockData";
import { DashboardPageHeader } from "./dashboard/DashboardPageHeader";
import { SectionCard } from "./dashboard/SectionCard";
import { AppButton } from "./ui/AppButton";
import { haversineKm, formatDistancia } from "../features/geo/distance";
import { InstitutionsMap } from "./InstitutionsMap";
import { getEasyModeServices } from "../features/accessibility/easyMode";

interface TelaInstituicoesProps {
  onNavigate: (s: Screen) => void;
  onDetalhes: (instId: string) => void;
  onAgendar: (instId: string) => void;
  /** A secretaria consulta as unidades, mas não marca atendimento por aqui. */
  podeAgendar?: boolean;
  modoFacil?: boolean;
}

type Filtro = "todos" | "clinica" | "hospital" | "laboratorio";

// Referência da rede demonstrada neste MVP. Evita que uma localização fora de
// Goiás mostre unidades como se estivessem a centenas de quilômetros do usuário.
const REFERENCIA_ANAPOLIS = { lat: -16.3285, lng: -48.9530 };

const filtroLabels: { key: Filtro; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "clinica", label: "Clínica" },
  { key: "hospital", label: "Hospital" },
  { key: "laboratorio", label: "Laboratório" },
];

function tipoIcon(tipo: Instituicao["tipo"]) {
  if (tipo === "hospital") return <Hospital size={20} color="#087E8B" />;
  if (tipo === "laboratorio") return <FlaskConical size={20} color="#087E8B" />;
  return <Building2 size={20} color="#087E8B" />;
}

function tipoLabel(tipo: Instituicao["tipo"]) {
  if (tipo === "hospital") return "Hospital";
  if (tipo === "laboratorio") return "Laboratório";
  return "Clínica";
}

export function TelaInstituicoes({ onDetalhes, onAgendar, podeAgendar = true, modoFacil = false }: TelaInstituicoesProps) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  // Abas: "todas" (lista normal) ou "perto" (geolocalização — MVP 2).
  const [aba, setAba] = useState<"todas" | "perto">(modoFacil ? "perto" : "todas");
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "ok" | "referencia">("idle");

  function usarLocalizacao() {
    if (!("geolocation" in navigator)) { setUserPos(REFERENCIA_ANAPOLIS); setGeoStatus("referencia"); return; }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const localizacao = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (haversineKm(localizacao, REFERENCIA_ANAPOLIS) <= 100) {
          setUserPos(localizacao);
          setGeoStatus("ok");
        } else {
          setUserPos(REFERENCIA_ANAPOLIS);
          setGeoStatus("referencia");
        }
      },
      () => { setUserPos(REFERENCIA_ANAPOLIS); setGeoStatus("referencia"); },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  function abrirAba(nova: "todas" | "perto") {
    setAba(nova);
    if (nova === "perto" && !userPos && geoStatus !== "loading") usarLocalizacao();
  }

  useEffect(() => {
    if (modoFacil && aba === "perto" && !userPos && geoStatus !== "loading") usarLocalizacao();
  }, [modoFacil, aba, userPos, geoStatus]);

  const perto = aba === "perto";

  const filtrada = instituicoes.filter((i) => {
    const matchFiltro = filtro === "todos" || i.tipo === filtro;
    const matchBusca =
      busca === "" ||
      i.nome.toLowerCase().includes(busca.toLowerCase()) ||
      i.endereco.toLowerCase().includes(busca.toLowerCase()) ||
      i.especialidades.some((e) => e.toLowerCase().includes(busca.toLowerCase()));
    return matchFiltro && matchBusca;
  });

  // Na aba "Perto de mim", calcula a distância e ordena da mais próxima para a mais distante.
  const lista = filtrada
    .map((i) => ({ inst: i, distancia: perto && userPos && i.coords ? haversineKm(userPos, i.coords) : null }))
    .sort((a, b) => (a.distancia ?? Infinity) - (b.distancia ?? Infinity));

  return (
    <div className="flex min-h-full flex-col bg-[#F4F9FA] px-4 pb-24 pt-5 sm:px-5 lg:p-0">
      <DashboardPageHeader eyebrow="Rede de atendimento" title="Instituições" description="Encontre clínicas, hospitais e laboratórios disponíveis." />
      <SectionCard className="mt-5 lg:mt-6">
        <div className="flex items-center gap-2 rounded-xl border border-[#B9D9DD]/55 bg-white px-3 py-2.5">
          <Search size={17} className="text-[#087E8B]" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, endereço ou serviço..."
            className="flex-1 bg-transparent text-[#243746] text-sm outline-none placeholder:text-[#607985]"
          />
          {busca && (
            <button onClick={() => setBusca("")} className="text-[#607985] text-xs">✕</button>
          )}
        </div>
      </SectionCard>

      {modoFacil ? (
        <section className="mt-4 rounded-2xl border-2 border-[#B9D9DD] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#087E8B]">Modo Fácil ativo</p>
          <h2 className="mt-1 text-lg font-bold text-[#243746]">Unidades perto de Anápolis, GO</h2>
          <p className="mt-1 text-sm text-[#607985]">Escolha o tipo de atendimento ou toque em uma unidade para agendar.</p>
          <label className="mt-4 block text-sm font-semibold text-[#243746]">Tipo de unidade
            <select value={filtro} onChange={(event) => setFiltro(event.target.value as Filtro)} className="mt-2 min-h-12 w-full rounded-xl border-2 border-[#B9D9DD] bg-white px-3 text-base text-[#243746] outline-none focus:border-[#087E8B]">
              {filtroLabels.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </label>
          <AppButton variant="secondary" size="lg" fullWidth className="mt-3" onClick={() => abrirAba("perto")}>Atualizar unidades próximas</AppButton>
        </section>
      ) : <>
      {/* Abas: Todas | Perto de mim (geolocalização) */}
      <div className="mt-4 flex rounded-xl bg-[#DCEFF1] p-1" role="tablist">
        <button
          role="tab"
          aria-selected={!perto}
          onClick={() => abrirAba("todas")}
          className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg text-sm transition ${!perto ? "bg-white font-semibold text-[#087E8B] shadow-sm" : "text-[#607985]"}`}
        >
          Todas
        </button>
        <button
          role="tab"
          aria-selected={perto}
          onClick={() => abrirAba("perto")}
          className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg text-sm transition ${perto ? "bg-white font-semibold text-[#087E8B] shadow-sm" : "text-[#607985]"}`}
        >
          {geoStatus === "loading" && perto ? <LoaderCircle size={15} className="animate-spin" /> : <Navigation size={15} />}
          Perto de mim
        </button>
      </div>

      {perto && geoStatus === "ok" && <p className="mt-2 text-xs text-[#607985]">Instituições ordenadas da mais próxima de você.</p>}
      {perto && geoStatus === "referencia" && <p className="mt-2 text-xs font-medium text-[#087E8B]">Mostrando unidades próximas de Anápolis, GO.</p>}

      {/* Filtros por tipo */}
      <div className="flex flex-wrap gap-2 py-3">
        {filtroLabels.map((f) => {
          const ativo = filtro === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`inline-flex min-h-9 items-center rounded-full border px-4 text-xs transition-colors active:scale-[0.98] ${ativo ? "border-[#087E8B] bg-[#087E8B] font-semibold text-white" : "border-[#B9D9DD] bg-white text-[#243746] hover:border-[#087E8B] hover:bg-[#F4F9FA]"}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      </>}

      {/* List */}
      <div className="flex-1 pt-2">
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Building2 size={40} color="#B9D9DD" className="mb-3" />
            <p className="text-[#243746] text-sm" style={{ fontWeight: 500 }}>
              Não encontramos instituições com esses filtros.
            </p>
            <p className="text-[#607985] text-xs mt-1">Tente outro tipo ou limpe a busca.</p>
          </div>
        ) : (
          <div className={`grid gap-4 md:grid-cols-2 ${modoFacil ? "2xl:grid-cols-3" : "xl:grid-cols-3"}`}>
            {lista.map(({ inst, distancia }) => modoFacil ? (
              <article key={inst.id} className="rounded-2xl border-2 border-[#B9D9DD] bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#DCEFF1]">{tipoIcon(inst.tipo)}</div>
                  <div className="min-w-0 flex-1"><p className="text-lg font-bold text-[#243746]">{inst.nome}</p><p className="mt-1 text-sm font-medium text-[#087E8B]">{tipoLabel(inst.tipo)} · ★ {inst.avaliacao}</p></div>
                </div>
                <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#243746]"><MapPin size={17} className="mt-0.5 shrink-0 text-[#087E8B]" />{inst.endereco}</p>
                {distancia !== null && <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#DCEFF1] px-3 py-1.5 text-sm font-semibold text-[#087E8B]"><Navigation size={14} />a {formatDistancia(distancia)} de você</p>}
                <p className="mt-3 text-sm text-[#607985]">{[...inst.especialidades, ...(inst.examesOferecidos ?? [])][0] ?? "Atendimento disponível"}</p>
                <div className={`mt-4 grid gap-2 ${podeAgendar ? "sm:grid-cols-2" : ""}`}>{podeAgendar && <AppButton size="lg" fullWidth onClick={() => onAgendar(inst.id)}>Agendar nesta unidade</AppButton>}<AppButton variant="secondary" size="lg" fullWidth onClick={() => onDetalhes(inst.id)}>Ver detalhes</AppButton></div>
              </article>
            ) : (
              <div key={inst.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#DCEFF1" }}>
                      {tipoIcon(inst.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[#243746] text-sm leading-tight" style={{ fontWeight: 700 }}>{inst.nome}</p>
                        <span
                          className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full mt-0.5"
                          style={{ background: "#DCEFF1", color: "#243746", fontWeight: 500 }}
                        >
                          {tipoLabel(inst.tipo)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={11} color="#F59E0B" fill="#F59E0B" />
                        <span className="text-[#243746] text-xs" style={{ fontWeight: 500 }}>{inst.avaliacao}</span>
                        <span className="text-[#B9D9DD] text-xs mx-1">•</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${inst.ativo ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`} style={{ fontWeight: 500 }}>
                          {inst.ativo ? "Aberta" : "Fechada"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 mt-3">
                    <MapPin size={13} color="#B9D9DD" className="mt-0.5 flex-shrink-0" />
                    <p className="text-[#243746] text-xs leading-relaxed">{inst.endereco}</p>
                  </div>
                  {distancia !== null && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#DCEFF1] px-2.5 py-1 text-[11px] font-semibold text-[#087E8B]">
                      <Navigation size={11} />a ~{formatDistancia(distancia)} de você
                    </div>
                  )}

                  {/* Services */}
                  {(inst.especialidades.length > 0 || (inst.examesOferecidos && inst.examesOferecidos.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(modoFacil ? getEasyModeServices([...inst.especialidades, ...(inst.examesOferecidos ?? [])]) : [...inst.especialidades, ...(inst.examesOferecidos ?? [])].slice(0, 3)).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#F4F9FA", color: "#243746" }}>
                          {s}
                        </span>
                      ))}
                      {(inst.especialidades.length + (inst.examesOferecidos?.length ?? 0)) > (modoFacil ? 1 : 3) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#F4F9FA", color: "#607985" }}>
                          +{(inst.especialidades.length + (inst.examesOferecidos?.length ?? 0)) - (modoFacil ? 1 : 3)} mais
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 px-4 pb-4">
                  <AppButton variant="secondary" size={modoFacil ? "lg" : "sm"} onClick={() => onDetalhes(inst.id)} className="flex-1">Ver detalhes</AppButton>
                  {podeAgendar && <AppButton size={modoFacil ? "lg" : "sm"} onClick={() => onAgendar(inst.id)} className="grow-[2] basis-0">Agendar</AppButton>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <InstitutionsMap institutions={lista.map(({ inst }) => inst)} onDetails={onDetalhes} />
    </div>
  );
}
