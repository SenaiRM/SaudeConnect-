export interface Uf {
  sigla: string;
  nome: string;
}

export const UFS: Uf[] = [
  { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" }, { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" }, { sigla: "ES", nome: "Espírito Santo" }, { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" }, { sigla: "MT", nome: "Mato Grosso" }, { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" }, { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" }, { sigla: "PE", nome: "Pernambuco" }, { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" }, { sigla: "RN", nome: "Rio Grande do Norte" }, { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" }, { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" }, { sigla: "SE", nome: "Sergipe" }, { sigla: "TO", nome: "Tocantins" },
];

const CIDADES: Record<string, string[]> = {
  AC: ["Rio Branco"], AL: ["Maceió"], AP: ["Macapá"], AM: ["Manaus"], BA: ["Salvador", "Feira de Santana"],
  CE: ["Fortaleza"], DF: ["Brasília"], ES: ["Vitória", "Vila Velha"], GO: ["Goiânia", "Anápolis"],
  MA: ["São Luís"], MT: ["Cuiabá"], MS: ["Campo Grande"], MG: ["Belo Horizonte", "Uberlândia"],
  PA: ["Belém"], PB: ["João Pessoa"], PR: ["Curitiba", "Londrina"], PE: ["Recife"], PI: ["Teresina"],
  RJ: ["Rio de Janeiro", "Niterói"], RN: ["Natal"], RS: ["Porto Alegre"], RO: ["Porto Velho"], RR: ["Boa Vista"],
  SC: ["Florianópolis", "Joinville"], SP: ["São Paulo", "Campinas", "Guarulhos", "Osasco", "Santo André", "Santos"],
  SE: ["Aracaju"], TO: ["Palmas"],
};

export function citiesOf(uf: string): string[] {
  return CIDADES[uf] ?? [];
}

export function ufName(sigla?: string): string {
  return UFS.find((uf) => uf.sigla === sigla)?.nome ?? sigla ?? "";
}

export function normalizeSearch(value: string): string {
  return value.trim().normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("pt-BR");
}

export function searchByName(names: string[], query: string): string[] {
  const search = normalizeSearch(query);
  return names.filter((name) => normalizeSearch(name).includes(search));
}

interface LocatedUnit {
  cidade?: string;
  uf?: string;
  coords?: { lat: number; lng: number };
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function distanceKm(from: Coordinates, to: { lat: number; lng: number }): number {
  const radians = Math.PI / 180;
  const latitudeDifference = (to.lat - from.latitude) * radians;
  const longitudeDifference = (to.lng - from.longitude) * radians;
  const arc = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(from.latitude * radians) * Math.cos(to.lat * radians) * Math.sin(longitudeDifference / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(arc));
}

/** Cidade da unidade mais próxima do aparelho, se estiver a até `maxKm`. */
export function findNearestCity(position: Coordinates, units: LocatedUnit[], maxKm = 80): { cidade: string; estado: string } | null {
  const nearest = units
    .filter((unit): unit is LocatedUnit & { cidade: string; uf: string; coords: { lat: number; lng: number } } => Boolean(unit.cidade && unit.uf && unit.coords))
    .map((unit) => ({ unit, km: distanceKm(position, unit.coords) }))
    .sort((a, b) => a.km - b.km)[0];
  return nearest && nearest.km <= maxKm ? { cidade: nearest.unit.cidade, estado: nearest.unit.uf } : null;
}

interface CityFilter {
  cidade?: string;
  estado?: string;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Separa as unidades da cidade escolhida das demais ("Buscar unidades próximas").
 * Com localização do aparelho todas ficam na lista principal, ordenadas por distância na tela.
 * Unidades sem cidade cadastrada nunca são escondidas.
 */
export function splitUnitsByCity<T extends LocatedUnit>(units: T[], location: CityFilter): { inCity: T[]; others: T[] } {
  if (location.latitude != null && location.longitude != null) return { inCity: units, others: [] };
  const cidade = normalizeSearch(location.cidade ?? "");
  const matches = (unit: T) => !unit.cidade || !cidade || normalizeSearch(unit.cidade) === cidade;
  return { inCity: units.filter(matches), others: units.filter((unit) => !matches(unit)) };
}
