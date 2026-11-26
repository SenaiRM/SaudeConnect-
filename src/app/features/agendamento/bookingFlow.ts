import type { BookingDraft } from "./bookingTypes.ts";
export type { BookingDraft } from "./bookingTypes.ts";

export type BookingStep = "localizacao" | "servico" | "unidade" | "agenda" | "confirmar";

export interface BookingLocation {
  cidade: string;
  estado?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface BookingSchedule {
  profissionalId?: string;
  data: string;
  horario: string;
}

export function createBookingDraft(): BookingDraft {
  return {
    cidade: "",
    estado: "",
    latitude: null,
    longitude: null,
    tipo: null,
    service: "",
    instituicaoId: "",
    profissionalId: "",
    data: "",
    horario: "",
    preInstId: null,
  };
}

export function updateLocation(draft: BookingDraft, location: BookingLocation): BookingDraft {
  return {
    ...draft,
    cidade: location.cidade,
    estado: location.estado ?? "",
    latitude: location.latitude ?? null,
    longitude: location.longitude ?? null,
    instituicaoId: "",
    profissionalId: "",
    data: "",
    horario: "",
  };
}

export function updateService(draft: BookingDraft, service: string): BookingDraft {
  return { ...draft, service, instituicaoId: "", profissionalId: "", data: "", horario: "" };
}

export function updateUnit(draft: BookingDraft, instituicaoId: string): BookingDraft {
  return { ...draft, instituicaoId, profissionalId: "", data: "", horario: "" };
}

export function updateSchedule(draft: BookingDraft, schedule: BookingSchedule): BookingDraft {
  return {
    ...draft,
    profissionalId: schedule.profissionalId ?? "",
    data: schedule.data,
    horario: schedule.horario,
  };
}

export function getNextStep(draft: BookingDraft, step: BookingStep): BookingStep {
  if (step === "localizacao") return draft.cidade ? "servico" : step;
  if (step === "servico") return draft.tipo && draft.service ? "unidade" : step;
  if (step === "unidade") return draft.instituicaoId ? "agenda" : step;
  if (step === "agenda" && draft.data && draft.horario && (draft.tipo === "exame" || draft.profissionalId)) {
    return "confirmar";
  }
  return step;
}

export function getPreviousStep(step: BookingStep): BookingStep {
  if (step === "servico") return "localizacao";
  if (step === "unidade") return "servico";
  if (step === "agenda") return "unidade";
  if (step === "confirmar") return "agenda";
  return "localizacao";
}

export function canEnterStep(draft: BookingDraft, target: BookingStep): boolean {
  if (target === "localizacao") return true;
  if (!draft.cidade) return false;
  if (target === "servico") return true;
  if (!draft.tipo || !draft.service) return false;
  if (target === "unidade") return true;
  if (!draft.instituicaoId) return false;
  if (target === "agenda") return true;
  return Boolean(draft.data && draft.horario && (draft.tipo === "exame" || draft.profissionalId));
}
