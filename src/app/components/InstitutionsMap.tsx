import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Instituicao } from "./mockData";

export function InstitutionsMap({ institutions, onDetails }: { institutions: Instituicao[]; onDetails: (id: string) => void }) {
  const points = institutions.filter((item) => item.coords);
  // O mapa vem de fora: mostra um esqueleto até o iframe terminar de carregar.
  const [mapaCarregado, setMapaCarregado] = useState(false);
  return <section className="mt-5 overflow-hidden rounded-2xl border border-[#B9D9DD]/60 bg-white shadow-sm">
    <div className="flex items-center gap-2 border-b border-[#DCEFF1] px-4 py-3"><MapPin size={18} className="text-[#087E8B]"/><div><p className="text-sm font-semibold text-[#243746]">Mapa das instituições</p><p className="text-xs text-[#607985]">Unidades exibidas conforme sua busca e filtros.</p></div></div>
    <div className="grid lg:grid-cols-[1fr_280px]"><div className="relative h-[320px] w-full">{!mapaCarregado && <div role="status" aria-label="Carregando o mapa" className="absolute inset-0 grid animate-pulse place-items-center bg-[#DCEFF1]/60"><span className="text-sm font-medium text-[#607985]">Carregando o mapa…</span></div>}<iframe onLoad={() => setMapaCarregado(true)} title="Mapa das instituições em Anápolis, Goiás" className="h-[320px] w-full border-0" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=-49.05%2C-16.40%2C-48.89%2C-16.27&amp;layer=mapnik"/></div><div className="max-h-[320px] overflow-y-auto border-t border-[#DCEFF1] p-3 lg:border-l lg:border-t-0">{points.map((item) => <button key={item.id} type="button" onClick={() => onDetails(item.id)} className="mb-2 flex w-full items-center gap-2 rounded-xl bg-[#F4F9FA] p-3 text-left hover:bg-[#DCEFF1]"><MapPin size={16} className="shrink-0 text-[#087E8B]"/><span><strong className="block text-sm text-[#243746]">{item.nome}</strong><small className="text-[#607985]">{item.endereco}</small></span></button>)}<a className="block px-1 pt-1 text-[10px] text-[#607985] underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></div></div>
  </section>;
}
