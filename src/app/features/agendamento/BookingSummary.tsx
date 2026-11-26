import type { ReactNode } from "react";
import { Building2, CalendarDays, Clock, FlaskConical, Mail, MapPin, Smartphone, Stethoscope, UserRound } from "lucide-react";
import { formatDate, type Instituicao, type Profissional, type User } from "../../components/mockData";
import type { BookingDraft } from "./bookingTypes";

interface BookingSummaryProps {
  draft: BookingDraft;
  user?: User | null;
  institution?: Instituicao;
  professional?: Profissional;
  onEditLocation?: () => void;
  onEditService?: () => void;
  onEditUnit?: () => void;
}

export function locationLabel(draft: Pick<BookingDraft, "cidade" | "estado" | "latitude" | "longitude">) {
  const city = [draft.cidade, draft.estado].filter(Boolean).join("/");
  // Sem unidade por perto não há cidade/UF identificada: mostra só "Próximo a mim".
  return draft.latitude != null && draft.longitude != null ? `Próximo a mim${draft.estado ? ` · ${city}` : ""}` : city;
}

function Section({ title, onEdit, editLabel, children }: { title: string; onEdit?: () => void; editLabel: string; children: ReactNode }) {
  return <div className="border-t border-[#DCEFF1] py-4">
    <div className="mb-2 flex items-center justify-between gap-2">
      <h3 className="text-sm font-medium text-[#607985]">{title}</h3>
      {onEdit && <button type="button" onClick={onEdit} aria-label={editLabel} className="rounded-md px-2 py-1 text-sm font-semibold text-[#087E8B] hover:bg-[#DCEFF1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]">Alterar</button>}
    </div>
    {children}
  </div>;
}

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <p className="flex items-start gap-3 py-1 text-[15px] text-[#243746]"><span className="mt-0.5 shrink-0 text-[#087E8B]" aria-hidden="true">{icon}</span><span className="min-w-0">{children}</span></p>;
}

export function BookingSummary({ draft, user, institution, professional, onEditLocation, onEditService, onEditUnit }: BookingSummaryProps) {
  const isExam = draft.tipo === "exame";
  const location = locationLabel(draft);

  return <aside aria-label="Resumo do agendamento" className="rounded-2xl border border-[#DCEFF1] bg-white shadow-sm lg:sticky lg:top-6">
    <h2 className="border-b border-[#DCEFF1] px-5 py-4 text-lg font-semibold text-[#243746]">Resumo do agendamento</h2>
    <div className="px-5 pb-1">
      {user && <>
        <div className="py-4">
          <p className="text-[15px] text-[#243746]">{user.nome}</p>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-[#607985]">Paciente SaúdeConnect+</p>
          <span className="mt-2 inline-block rounded-full bg-[#DCEFF1] px-2.5 py-0.5 text-xs font-medium text-[#065F68]">Saúde</span>
        </div>
        <Section title="Informações de contato" editLabel="">
          <Row icon={<Smartphone size={18}/>}>{user.telefone}</Row>
          <Row icon={<Mail size={18}/>}><span className="break-all">{user.email}</span></Row>
        </Section>
      </>}
      {draft.service && <Section title={isExam ? "Exame" : "Especialidade"} onEdit={onEditService} editLabel={isExam ? "Alterar exame" : "Alterar especialidade"}>
        <Row icon={isExam ? <FlaskConical size={18}/> : <Stethoscope size={18}/>}>{draft.service}</Row>
      </Section>}
      {location && <Section title="Local de atendimento" onEdit={onEditLocation} editLabel="Alterar local de atendimento">
        <Row icon={<MapPin size={18}/>}>{location}</Row>
      </Section>}
      {institution && <Section title="Unidade" onEdit={onEditUnit} editLabel="Alterar unidade">
        <Row icon={<Building2 size={18}/>}>{institution.nome}</Row>
      </Section>}
      {(professional || draft.data) && <Section title={isExam ? "Horário" : "Profissional e horário"} editLabel="">
        {professional && <Row icon={<UserRound size={18}/>}>{professional.nome}</Row>}
        {draft.data && <Row icon={<CalendarDays size={18}/>}>{formatDate(draft.data)}</Row>}
        {draft.horario && <Row icon={<Clock size={18}/>}>{draft.horario}</Row>}
      </Section>}
    </div>
  </aside>;
}
