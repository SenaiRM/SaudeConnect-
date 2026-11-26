import { agendaInstituicao, agendaProfissional, type Agendamento, type Instituicao, type Profissional } from "../../components/mockData.ts";
import { demoSlotsInTheFuture, getAvailableSlots, getCompatibleInstitutions } from "./availability.ts";
import { distanceKm } from "./bookingLocations.ts";
import type { BookingDraft } from "./bookingTypes.ts";

export function getBookableUnits(draft: BookingDraft, institutions: Instituicao[], professionals: Profissional[]): Instituicao[] {
  if (!draft.tipo || !draft.service) return [];
  return getCompatibleInstitutions(draft.tipo, draft.service, institutions)
    .filter((unit) => !draft.preInstId || unit.id === draft.preInstId)
    .filter((unit) => draft.tipo === "exame" || professionals.some((professional) =>
      professional.instituicaoId === unit.id && professional.disponivel && professional.especialidade === draft.service));
}

/** Serviços agendáveis de uma unidade: especialidades com profissional disponível e exames oferecidos. */
export function getUnitServices(unit: Instituicao, professionals: Profissional[]): Record<"consulta" | "exame", string[]> {
  const consulta = [...new Set(professionals
    .filter((professional) => professional.instituicaoId === unit.id && professional.disponivel && unit.especialidades.includes(professional.especialidade))
    .map((professional) => professional.especialidade))];
  return { consulta, exame: unit.examesOferecidos ?? [] };
}

/** Tudo que tem pelo menos uma unidade agendável: evita escolher algo sem nenhuma agenda. */
export function getNetworkServices(units: Instituicao[], professionals: Profissional[]): Record<"consulta" | "exame", string[]> {
  const services = units.filter((unit) => unit.ativo).map((unit) => getUnitServices(unit, professionals));
  return {
    consulta: [...new Set(services.flatMap((service) => service.consulta))],
    exame: [...new Set(services.flatMap((service) => service.exame))],
  };
}

export function getUnitDistanceKm(draft: BookingDraft, unit: Instituicao): number | null {
  if (draft.latitude == null || draft.longitude == null || !unit.coords) return null;
  return distanceKm({ latitude: draft.latitude, longitude: draft.longitude }, unit.coords);
}

export interface BookingScheduleGroup {
  data: string;
  providerName?: string;
  professionalId?: string;
  horarios: string[];
}

export function getScheduleGroups(
  draft: BookingDraft,
  professionals: Profissional[],
  appointments: Pick<Agendamento, "tipo" | "instituicaoId" | "profissionalId" | "data" | "horario" | "status">[],
  now = new Date(),
): BookingScheduleGroup[] {
  if (!draft.tipo || !draft.service || !draft.instituicaoId) return [];

  if (draft.tipo === "exame") {
    return getAvailableSlots({
      tipo: "exame",
      instituicaoId: draft.instituicaoId,
      slots: demoSlotsInTheFuture(agendaInstituicao[draft.instituicaoId] ?? [], now),
      agendamentos: appointments,
      now,
    });
  }

  return professionals
    .filter((professional) => professional.disponivel
      && professional.instituicaoId === draft.instituicaoId
      && professional.especialidade === draft.service)
    .flatMap((professional) => getAvailableSlots({
      tipo: "consulta",
      instituicaoId: draft.instituicaoId,
      profissionalId: professional.id,
      slots: demoSlotsInTheFuture(agendaProfissional[professional.id] ?? [], now),
      agendamentos: appointments,
      now,
    }).map((slot) => ({ ...slot, providerName: professional.nome, professionalId: professional.id })))
    .sort((a, b) => a.data.localeCompare(b.data) || a.providerName.localeCompare(b.providerName));
}
