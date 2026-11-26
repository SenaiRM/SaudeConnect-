import { CalendarDays } from "lucide-react";
import { formatDataChip, type SlotDisponivel } from "../../components/mockData";
import type { BookingDraft } from "./bookingTypes";

interface AvailabilityPickerProps { slots: SlotDisponivel[]; draft: BookingDraft; ready: boolean; onChange: (patch: Partial<BookingDraft>) => void; }

export function AvailabilityPicker({ slots, draft, ready, onChange }: AvailabilityPickerProps) {
  if (!ready) return <section className="rounded-2xl border border-dashed border-[#B9D9DD] bg-white/60 p-5 text-sm text-[#607985]">Escolha as opções acima para ver horários disponíveis.</section>;
  if (!slots.length) return <section className="rounded-2xl bg-white p-5 text-center"><CalendarDays className="mx-auto text-[#B9D9DD]" size={32}/><h3 className="mt-3 font-bold text-[#243746]">Não há horários livres</h3><p className="mt-1 text-sm text-[#607985]">Tente outra instituição ou outro profissional.</p></section>;
  const selectedDay = slots.find((slot) => slot.data === draft.data);
  return <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="text-lg font-bold text-[#243746]">Escolha um horário</h2><p className="mt-1 text-sm text-[#607985]">Só mostramos datas e horários que ainda estão livres.</p><div className="mt-4 flex flex-wrap gap-2">{slots.map((slot) => <button key={slot.data} onClick={() => onChange({ data: slot.data, horario: "" })} className={`rounded-xl border px-3 py-2 text-sm ${draft.data === slot.data ? "border-[#087E8B] bg-[#087E8B] text-white" : "border-[#B9D9DD] text-[#243746]"}`}>{formatDataChip(slot.data)}</button>)}</div>{selectedDay && <div className="mt-5"><h3 className="font-semibold text-[#243746]">Horários em {formatDataChip(selectedDay.data)}</h3><div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">{selectedDay.horarios.map((horario) => <button key={horario} onClick={() => onChange({ horario })} className={`rounded-xl border py-2 text-sm ${draft.horario === horario ? "border-[#087E8B] bg-[#087E8B] text-white" : "border-[#B9D9DD] text-[#243746]"}`}>{horario}</button>)}</div></div>}</section>;
}
