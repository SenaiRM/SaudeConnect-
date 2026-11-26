import type { Instituicao } from "../../components/mockData";

// Links públicos do Google Maps: funcionam sem chave de API.
// O mapa interativo com a Maps JavaScript API entra quando o faturamento do Google Cloud estiver ativo.

function place(unit: Pick<Instituicao, "nome" | "endereco" | "coords">) {
  return unit.coords ? `${unit.coords.lat},${unit.coords.lng}` : `${unit.nome}, ${unit.endereco}`;
}

export function mapsSearchUrl(unit: Pick<Instituicao, "nome" | "endereco" | "coords">) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place(unit))}`;
}

export function mapsDirectionsUrl(unit: Pick<Instituicao, "nome" | "endereco" | "coords">) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place(unit))}`;
}

export function mapsEmbedUrl(unit: Pick<Instituicao, "nome" | "endereco" | "coords">) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(place(unit))}&z=16&output=embed`;
}
