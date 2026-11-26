import { useState } from "react";
import { separarAgenda } from "../features/agendamento/agendaView.ts";
import { Building2, CalendarDays, CalendarPlus, ChevronRight, Clock, FlaskConical, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import type { Agendamento, AgendamentoTipo, Notificacao, Screen, User } from "./mockData";
import { formatDate, getInstituicaoNome, getProfissionalNome, getStatusLabel } from "./mockData";
import { DashboardPageHeader } from "./dashboard/DashboardPageHeader";
import { MetricCard } from "./dashboard/MetricCard";
import { SectionCard } from "./dashboard/SectionCard";
import { AvisosPanel } from "./AvisosPanel";
import { AppButton } from "./ui/AppButton";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface TelaHomeProps {
  user: User;
  agendamentos: Agendamento[];
  onStartBooking: (type: AgendamentoTipo) => void;
  onNavigate: (screen: Screen) => void;
  notifications: Notificacao[];
  onMarkRead: (id: string) => void;
  modoFacil?: boolean;
}

export function TelaHome({ user, agendamentos, onStartBooking, onNavigate, notifications, onMarkRead, modoFacil }: TelaHomeProps) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  // Só o que ainda vai acontecer: antes, um atendimento vencido continuava
  // sendo anunciado como "seu próximo compromisso" indefinidamente.
  const { proximos: upcoming } = separarAgenda(agendamentos);
  const proximo = upcoming[0];
  const consultas = upcoming.filter((item) => item.tipo === "consulta").length;
  const exames = upcoming.filter((item) => item.tipo === "exame").length;
  const recentes = upcoming.slice(0, 3);
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const primeiroNome = user.nome.split(" ")[0];
  const selectedAppointment = agendamentos.find((item) => item.id === selectedAppointmentId) ?? null;
  const selectedNotice = notifications.find((item) => item.agendamentoId === selectedAppointmentId) ?? null;

  // ─── Modo Fácil: tela inicial simplificada, poucos botões grandes ───────────
  if (modoFacil) {
    const menu = [
      { label: "Marcar consulta ou exame", icon: CalendarPlus, onClick: () => onNavigate("agendar"), destaque: true },
      { label: "Minha agenda", icon: CalendarDays, onClick: () => onNavigate("agenda") },
      { label: "Instituições perto de mim", icon: Building2, onClick: () => onNavigate("instituicoes") },
      { label: "Meus dados", icon: UserRound, onClick: () => onNavigate("perfil") },
    ];
    return (
      <div className="min-h-full bg-[#F4F9FA] px-5 pb-28 pt-6">
        <p className="text-lg font-semibold text-[#087E8B]">{saudacao},</p>
        <h1 className="text-3xl font-bold text-[#243746]">{primeiroNome}</h1>

        {proximo && (
          <div className="mt-5 rounded-2xl border-l-4 border-[#087E8B] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#607985]">Seu próximo atendimento</p>
            <p className="mt-2 text-2xl font-bold text-[#243746]">{proximo.tipo === "consulta" ? proximo.especialidade : proximo.tipoExame}</p>
            <p className="mt-1 flex items-center gap-2 text-lg text-[#243746]"><CalendarDays size={20} className="text-[#087E8B]" />{formatDate(proximo.data)} às {proximo.horario}</p>
            <p className="mt-1 text-base text-[#607985]">{getInstituicaoNome(proximo.instituicaoId)}</p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {menu.map(({ label, icon: Icon, onClick, destaque }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={`flex min-h-[76px] w-full items-center gap-4 rounded-2xl px-5 py-4 text-left shadow-sm transition-all active:scale-[0.98] ${destaque ? "bg-gradient-to-br from-[#087E8B] to-[#065F68] text-white" : "border border-[#B9D9DD] bg-white text-[#243746] hover:border-[#087E8B]"}`}
            >
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${destaque ? "bg-white/20 text-white" : "bg-[#DCEFF1] text-[#087E8B]"}`}><Icon size={28} /></span>
              <span className="flex-1 text-xl font-bold leading-tight">{label}</span>
              <ChevronRight size={26} className={destaque ? "text-white/80" : "text-[#087E8B]"} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-5 bg-[#F4F9FA] px-4 pb-24 pt-5 sm:px-5 lg:space-y-6 lg:bg-transparent lg:p-0">
      <DashboardPageHeader
        eyebrow="Visão geral"
        title={`${saudacao}, ${primeiroNome}`}
        description="Acompanhe seus próximos cuidados e encontre rapidamente o que precisa."
      />

      {upcoming.length === 0 ? (
        <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#B9D9DD]/55 bg-white px-5 py-4 shadow-[0_8px_26px_rgba(36,55,70,0.05)]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#DCEFF1] text-[#087E8B]"><ShieldCheck size={22} /></span>
          <div className="min-w-0 flex-1"><p className="font-semibold text-[#243746]">Você está em dia</p><p className="mt-0.5 text-sm text-[#607985]">Não há consultas ou exames programados no momento.</p></div>
          <AppButton onClick={() => onNavigate("agendar")}>Agendar agora</AppButton>
        </section>
      ) : (
        <section className="grid grid-cols-3 gap-2 sm:gap-3">
          <MetricCard label="Consultas" value={consultas} description="próximas consultas" icon={<Stethoscope size={18} />} />
          <MetricCard label="Exames" value={exames} description="próximos exames" icon={<FlaskConical size={18} />} />
          <MetricCard label="Agendamentos" value={upcoming.length} description="cuidados programados" icon={<CalendarDays size={18} />} />
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
        <SectionCard title="Próximo compromisso" description="Seu atendimento mais próximo">
          {proximo ? (
            <div className="relative overflow-hidden rounded-xl border border-[#DCEFF1] bg-[#F4F9FA] p-4 pl-5">
              <span className="absolute inset-y-0 left-0 w-1 bg-[#087E8B]" />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#DCEFF1] text-[#087E8B]">{proximo.tipo === "consulta" ? <Stethoscope size={19} /> : <FlaskConical size={19} />}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#243746]">{proximo.tipo === "consulta" ? proximo.especialidade : proximo.tipoExame}</p>
                    <p className="mt-1 text-sm text-[#607985]">{getInstituicaoNome(proximo.instituicaoId)}</p>
                    {proximo.profissionalId && <p className="text-sm text-[#607985]">{getProfissionalNome(proximo.profissionalId)}</p>}
                  </div>
                </div>
                <span className="rounded-full bg-[#DCEFF1] px-3 py-1 text-xs font-semibold text-[#087E8B]">{getStatusLabel(proximo.status)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-[#B9D9DD]/45 pt-3 text-sm text-[#243746]">
                <span className="flex items-center gap-2"><CalendarDays size={15} className="text-[#087E8B]" />{formatDate(proximo.data)}</span>
                <span className="flex items-center gap-2"><Clock size={15} className="text-[#087E8B]" />{proximo.horario}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#F4F9FA] p-6 text-center">
              <CalendarDays size={28} className="mx-auto text-[#B9D9DD]" />
              <p className="mt-2 text-sm font-medium text-[#243746]">Nenhum agendamento próximo</p>
              <p className="mt-1 text-xs text-[#607985]">Agende uma consulta ou exame.</p>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Ações rápidas" description="Comece um novo agendamento">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { type: "consulta" as const, label: "Agendar consulta", description: "Escolha especialidade e horário", icon: Stethoscope },
              { type: "exame" as const, label: "Agendar exame", description: "Encontre uma instituição disponível", icon: FlaskConical },
            ].map(({ type, label, description, icon: Icon }) => (
              <button key={label} type="button" onClick={() => onStartBooking(type)} className="group flex items-center gap-3 rounded-2xl border border-[#B9D9DD]/55 p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#087E8B]/40 hover:bg-[#F1F8F9] hover:shadow-[var(--sombra-cartao)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]/40">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#DCEFF1] to-[#EAF5F6] text-[#087E8B] ring-1 ring-inset ring-[#B9D9DD]/50 transition-colors group-hover:from-[#087E8B] group-hover:to-[#065F68] group-hover:text-white"><Icon size={19} /></span>
                <span className="min-w-0"><strong className="block text-sm font-semibold tracking-tight text-[#243746]">{label}</strong><small className="block truncate text-[#607985]">{description}</small></span>
                <ChevronRight size={17} className="ml-auto shrink-0 text-[#087E8B] transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </SectionCard>
      </section>

      <AvisosPanel notifications={notifications} onMarkRead={onMarkRead} onOpenAppointment={setSelectedAppointmentId} />

      {recentes.length > 0 && (
        <SectionCard title="Próximos agendamentos" description="Consultas e exames já programados" action={<button type="button" onClick={() => onNavigate("agenda")} className="flex items-center gap-1 text-sm font-semibold text-[#087E8B]">Ver todos <ChevronRight size={16} /></button>}>
          <div className="divide-y divide-[#DCEFF1]">
            {recentes.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F4F9FA] text-[#087E8B]">{item.tipo === "consulta" ? <Stethoscope size={17} /> : <FlaskConical size={17} />}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#243746]">{item.tipo === "consulta" ? item.especialidade : item.tipoExame}</p><p className="truncate text-xs text-[#607985]">{getInstituicaoNome(item.instituicaoId)}</p></div>
                <div className="shrink-0 text-right"><p className="text-xs font-semibold text-[#243746]">{formatDate(item.data)}</p><p className="text-xs text-[#607985]">{item.horario}</p></div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      <AlertDialog open={selectedAppointment !== null} onOpenChange={(open) => { if (!open) setSelectedAppointmentId(null); }}>
        <AlertDialogContent className="max-w-md rounded-2xl border-0 bg-white p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#243746]">Detalhes do atendimento</AlertDialogTitle>
            <AlertDialogDescription className="text-[#607985]">{selectedNotice?.titulo ?? "Atualização do seu agendamento"}</AlertDialogDescription>
          </AlertDialogHeader>
          {selectedAppointment && <div className="space-y-4 text-sm">
            <div className="rounded-xl bg-[#F4F9FA] p-4"><strong className="block text-base text-[#243746]">{selectedAppointment.tipo === "consulta" ? selectedAppointment.especialidade : selectedAppointment.tipoExame}</strong><span className="mt-1 block text-[#087E8B]">{getStatusLabel(selectedAppointment.status)}</span></div>
            <div className="grid gap-3 rounded-xl border border-[#DCEFF1] p-4"><div><span className="text-xs font-semibold uppercase tracking-wide text-[#607985]">Quando</span><strong className="mt-1 block text-[#243746]">{formatDate(selectedAppointment.data)} às {selectedAppointment.horario}</strong></div><div><span className="text-xs font-semibold uppercase tracking-wide text-[#607985]">Onde</span><strong className="mt-1 block text-[#243746]">{getInstituicaoNome(selectedAppointment.instituicaoId)}</strong>{selectedAppointment.profissionalId && <span className="mt-1 block text-[#607985]">{getProfissionalNome(selectedAppointment.profissionalId)}</span>}</div></div>
            {selectedNotice && <div className="rounded-xl bg-[#EFF6FF] p-4 text-sm leading-6 text-[#1D4ED8]">{selectedNotice.mensagem}</div>}
          </div>}
          <AlertDialogFooter><AlertDialogAction onClick={() => setSelectedAppointmentId(null)}>Fechar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
