import { especialidades, examInfo, tiposExame, type AgendamentoTipo } from "../../components/mockData.ts";
import { normalizeSearch } from "./bookingLocations.ts";

export function filterBookingServices(tipo: AgendamentoTipo | null, query: string): string[] {
  const services = tipo === "consulta" ? especialidades : tipo === "exame" ? tiposExame : [];
  const search = normalizeSearch(query);
  return services.filter((service) => normalizeSearch(service).includes(search));
}

export function groupByInitial(items: string[]): { letter: string; items: string[] }[] {
  const groups = new Map<string, string[]>();
  [...items].sort((a, b) => a.localeCompare(b, "pt-BR")).forEach((item) => {
    const letter = normalizeSearch(item).charAt(0).toLocaleUpperCase("pt-BR");
    groups.set(letter, [...(groups.get(letter) ?? []), item]);
  });
  return [...groups].map(([letter, groupItems]) => ({ letter, items: groupItems }));
}

const MOST_SEARCHED: Record<AgendamentoTipo, string[]> = {
  consulta: ["Clínica Geral", "Cardiologia", "Pediatria", "Ginecologia", "Dermatologia"],
  exame: ["Hemograma Completo", "Glicemia em Jejum", "Ultrassom", "Raio-X"],
};

export function getMostSearched(tipo: AgendamentoTipo | null): string[] {
  if (!tipo) return [];
  const available = filterBookingServices(tipo, "");
  return MOST_SEARCHED[tipo].filter((item) => available.includes(item));
}

const SPECIALTY_DESCRIPTIONS: Record<string, string> = {
  "Cardiologia": "Cuida do coração e da circulação: pressão alta, arritmias e check-up cardíaco.",
  "Clínica Geral": "Primeiro atendimento para sintomas gerais, check-up e encaminhamentos.",
  "Dermatologia": "Pele, cabelos e unhas: manchas, alergias, acne e prevenção do câncer de pele.",
  "Ginecologia": "Saúde da mulher: exames preventivos, ciclo menstrual e planejamento familiar.",
  "Neurologia": "Cérebro e nervos: dores de cabeça frequentes, tonturas e formigamentos.",
  "Ortopedia": "Ossos, articulações e músculos: dores nas costas, lesões e fraturas.",
  "Pediatria": "Acompanhamento da saúde de bebês, crianças e adolescentes.",
  "Psicologia": "Apoio emocional, ansiedade, estresse e acompanhamento terapêutico.",
  "Nutrição": "Orientação alimentar para emagrecimento, doenças crônicas e bem-estar.",
};

export function serviceDescription(tipo: AgendamentoTipo, service: string): string | undefined {
  if (tipo === "exame") {
    const info = examInfo[service];
    return info ? `${info.preparo} Duração aproximada: ${info.duracao}.` : undefined;
  }
  return SPECIALTY_DESCRIPTIONS[service];
}
