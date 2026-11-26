// Utilitários de geolocalização (MVP 2 — Geolocalização).

export interface Coordenada {
  lat: number;
  lng: number;
}

/** Distância aproximada em km entre duas coordenadas (fórmula de Haversine). */
export function haversineKm(a: Coordenada, b: Coordenada): number {
  const R = 6371; // raio da Terra em km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Formata a distância de forma amigável (ex.: "350 m", "1,2 km"). */
export function formatDistancia(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}
