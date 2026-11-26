import type { AgendamentoTipo } from "../../components/mockData";

export interface BookingDraft {
  cidade?: string;
  estado?: string;
  latitude?: number | null;
  longitude?: number | null;
  tipo: AgendamentoTipo | null;
  service: string;
  instituicaoId: string;
  profissionalId: string;
  data: string;
  horario: string;
  preInstId?: string | null;
}
