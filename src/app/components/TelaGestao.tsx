import { useEffect, useState } from "react";
import { Building2, CalendarDays, Check, Plus, ToggleLeft, ToggleRight, UserRound, XCircle } from "lucide-react";
import { instituicoes as initialInstitutions, mockUsers, profissionais as initialProfessionals } from "./mockData";
import type { Agendamento, AgendamentoHistorico, Notificacao } from "./mockData";
import { formatDate, getProfissionalNome, getStatusLabel } from "./mockData";
import { DashboardPageHeader } from "./dashboard/DashboardPageHeader";
import { MetricCard } from "./dashboard/MetricCard";
import { SectionCard } from "./dashboard/SectionCard";
import { AvisosPanel } from "./AvisosPanel";
import { AppButton } from "./ui/AppButton";
import { AlteracoesHistorico } from "./TelaAgenda";
import { impedimentosParaConfirmar } from "../features/agendamento/slotCheck";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

type Tab = "instituicoes" | "profissionais" | "disponibilidade" | "agendamentos";
const week = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

interface TelaGestaoProps {
  notifications: Notificacao[];
  onMarkRead: (id: string) => void;
  agendamentos: Agendamento[];
  historicoAlteracoes: AgendamentoHistorico[];
  onCancelarPorProfissional: (id: string) => void;
  onConfirmarReagendamento: (id: string) => void;
  onConfirmarAgendamento: (id: string) => void;
  focusedAppointmentId?: string | null;
  /** Nome da unidade da secretaria, mostrado no cabeçalho. */
  unidadeNome?: string;
  /** Unidade da secretaria: tudo no painel é filtrado por ela. */
  instituicaoId?: string;
  modoFacil?: boolean;
}

export function TelaGestao({ notifications, onMarkRead, agendamentos, historicoAlteracoes, onCancelarPorProfissional, onConfirmarReagendamento, onConfirmarAgendamento, focusedAppointmentId, unidadeNome, instituicaoId }: TelaGestaoProps) {
  const [tab, setTab] = useState<Tab>("agendamentos");
  // A secretaria responde por UMA unidade: instituições e profissionais da rede
  // inteira não são assunto dela.
  const institutions = instituicaoId ? initialInstitutions.filter((item) => item.id === instituicaoId) : initialInstitutions;
  const [professionals, setProfessionals] = useState(() =>
    instituicaoId ? initialProfessionals.filter((item) => item.instituicaoId === instituicaoId) : [...initialProfessionals],
  );
  const [selectedProfessionalId, setSelectedProfessionalId] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [notice, setNotice] = useState("");
  const [appointmentToCancel, setAppointmentToCancel] = useState<Agendamento | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  useEffect(() => {
    if (!focusedAppointmentId) return;
    setTab("agendamentos");
    setSelectedAppointmentId(focusedAppointmentId);
  }, [focusedAppointmentId]);
  const aguardandoConfirmacao = agendamentos.filter((item) => item.status === "pendente" || item.status === "reagendamento").length;
  const availableProfessionals = professionals.filter((item) => item.disponivel).length;
  const selectedProfessional = professionals.find((item) => item.id === selectedProfessionalId) ?? professionals[0];
  const activityAt = (appointment: Agendamento) => {
    const latestEvent = historicoAlteracoes.find((event) => event.agendamentoId === appointment.id);
    return latestEvent ? new Date(latestEvent.data).getTime() : 0;
  };
  const appointmentsByLatestActivity = [...agendamentos].sort((a, b) => activityAt(b) - activityAt(a));
  const pendingReschedules = appointmentsByLatestActivity.filter((item) => item.status === "reagendamento");
  const selectedAppointment = agendamentos.find((item) => item.id === selectedAppointmentId) ?? null;
  const selectedPatient = selectedAppointment ? mockUsers.find((user) => user.id === selectedAppointment.usuarioId) : null;
  const selectedRequest = selectedAppointment ? historicoAlteracoes.find((event) => event.agendamentoId === selectedAppointment.id && event.tipo === "reagendado") : null;
  const selectedProfessionalOfAppointment = selectedAppointment?.profissionalId ? professionals.find((item) => item.id === selectedAppointment.profissionalId) : undefined;
  const impedimentos = selectedAppointment ? impedimentosParaConfirmar(selectedAppointment, agendamentos, selectedProfessionalOfAppointment) : [];
  const podeConfirmarSelecionado = selectedAppointment?.status === "pendente" || selectedAppointment?.status === "reagendamento";
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2800); };
  const addProfessional = () => { if (!name || !specialty) return notify("Informe nome e especialidade."); setProfessionals((items) => [...items, { id: `p${Date.now()}`, nome: name, especialidade: specialty, crm: "A definir", instituicaoId: instituicaoId ?? institutions[0]?.id ?? "", diasDisponiveis: [], disponivel: true }]); setName(""); setSpecialty(""); setShowAdd(false); notify("Profissional adicionado."); };

  const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [{ id: "agendamentos", label: "Agendamentos", icon: CalendarDays }, { id: "profissionais", label: "Profissionais", icon: UserRound }, { id: "disponibilidade", label: "Disponibilidade", icon: CalendarDays }, { id: "instituicoes", label: "Minha unidade", icon: Building2 }];
  return <div className="min-h-full space-y-5 bg-[#F4F9FA] px-4 pb-24 pt-5 sm:px-5 lg:bg-transparent lg:p-0 lg:pb-8">
    <DashboardPageHeader eyebrow="Secretaria" title={unidadeNome ? `Painel · ${unidadeNome}` : "Painel da secretaria"} description="Agendamentos, profissionais e disponibilidade da sua unidade." />
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3"><MetricCard destaque className="col-span-2 sm:col-span-1" label="Aguardando você" value={aguardandoConfirmacao} description={aguardandoConfirmacao === 1 ? "pedido para confirmar" : "pedidos para confirmar"} icon={<CalendarDays size={18}/>} /><MetricCard label="Profissionais" value={availableProfessionals} description={`${professionals.length} na unidade`} icon={<UserRound size={18}/>} /><MetricCard label="Disponibilidade" value={`${selectedProfessional?.diasDisponiveis.length ?? 0}/${week.length}`} description={selectedProfessional ? `dias de ${selectedProfessional.nome.split(" ").slice(0, 2).join(" ")}` : "selecione um profissional"} icon={<CalendarDays size={18}/>} /></section>
    <AvisosPanel notifications={notifications} onMarkRead={onMarkRead} onOpenAppointment={(appointmentId) => { setTab("agendamentos"); setSelectedAppointmentId(appointmentId); }} />
    <nav className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-2 shadow-sm sm:flex">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setTab(id)} className={`easy-nav-item flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold sm:shrink-0 sm:justify-start sm:px-4 ${tab === id ? "bg-[#087E8B] text-white" : "text-[#607985] hover:bg-[#F4F9FA]"}`}><Icon size={17}/>{label}</button>)}</nav>
    {notice && <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#DCFCE7] px-4 py-3 text-sm text-[#166534]"><Check size={16}/>{notice}</div>}
    {tab === "instituicoes" && <SectionCard title="Minha unidade" description="Os dados que os pacientes veem ao escolher esta unidade."><div className="grid gap-3 lg:grid-cols-2">{institutions.map((institution) => <article key={institution.id} className="flex items-start gap-3 rounded-2xl border border-[#B9D9DD]/55 p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#DCEFF1] text-[#087E8B]"><Building2 size={19}/></span><div className="min-w-0 flex-1"><h3 className="font-semibold text-[#243746]">{institution.nome}</h3><p className="mt-0.5 text-sm text-[#607985]">{institution.endereco}</p><p className="mt-0.5 text-sm text-[#607985]">{institution.telefone}</p><p className="mt-0.5 text-sm text-[#607985]">{institution.horarioFuncionamento}</p><div className="mt-2 flex flex-wrap gap-1">{institution.especialidades.map((item) => <span key={item} className="rounded-full bg-[#F4F9FA] px-2 py-0.5 text-[11px] text-[#607985]">{item}</span>)}</div></div><span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${institution.ativo ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>{institution.ativo ? "Ativa" : "Inativa"}</span></article>)}</div></SectionCard>}
    {tab === "profissionais" && <SectionCard title="Profissionais" description="Defina quem pode receber novos atendimentos." action={<AppButton onClick={() => setShowAdd((value) => !value)}><Plus size={16}/>Adicionar</AppButton>}>{showAdd && <div className="mb-4 grid gap-3 rounded-xl border border-[#B9D9DD] bg-[#F4F9FA] p-4 sm:grid-cols-[1fr_1fr_auto]"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome completo" className="rounded-xl border border-[#B9D9DD] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087E8B]"/><input value={specialty} onChange={(event) => setSpecialty(event.target.value)} placeholder="Especialidade" className="rounded-xl border border-[#B9D9DD] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087E8B]"/><AppButton onClick={addProfessional}>Salvar</AppButton></div>}<div className="divide-y divide-[#DCEFF1]">{professionals.map((professional) => <div key={professional.id} className="flex items-center gap-3 py-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#DCEFF1] font-semibold text-[#087E8B]">{professional.nome.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div className="min-w-0 flex-1"><strong className="block text-sm text-[#243746]">{professional.nome}</strong><small className="text-[#607985]">{professional.especialidade} · {institutions.find((item) => item.id === professional.instituicaoId)?.nome}</small></div><button type="button" onClick={() => { setProfessionals((items) => items.map((item) => item.id === professional.id ? { ...item, disponivel: !item.disponivel } : item)); }} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${professional.disponivel ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>{professional.disponivel ? <ToggleRight size={15}/> : <ToggleLeft size={15}/>}{professional.disponivel ? "Disponível" : "Indisponível"}</button></div>)}</div></SectionCard>}
    {tab === "disponibilidade" && <SectionCard title="Disponibilidade por profissional" description="Cada médico possui sua própria agenda semanal. Alterações não afetam os demais profissionais.">
      <div className="grid gap-5 lg:grid-cols-[minmax(220px,.38fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-[#DCEFF1] bg-[#F8FBFC] p-4">
          <label htmlFor="availability-professional" className="text-sm font-semibold text-[#243746]">Profissional</label>
          <select id="availability-professional" value={selectedProfessional?.id ?? ""} onChange={(event) => setSelectedProfessionalId(event.target.value)} className="mt-2 w-full rounded-xl border border-[#B9D9DD] bg-white px-3 py-2.5 text-sm font-medium text-[#243746] outline-none focus:border-[#087E8B]">
            {professionals.map((professional) => <option key={professional.id} value={professional.id}>{professional.nome} · {professional.especialidade}</option>)}
          </select>
          {selectedProfessional && <div className="mt-4 rounded-lg bg-white p-3 text-sm"><strong className="block text-[#243746]">{selectedProfessional.nome}</strong><span className="text-[#607985]">{selectedProfessional.especialidade} · {selectedProfessional.crm}</span><span className="mt-2 block text-xs text-[#607985]">{institutions.find((item) => item.id === selectedProfessional.instituicaoId)?.nome}</span></div>}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#243746]">Agenda semanal de {selectedProfessional?.nome ?? "profissional"}</h3>
          <p className="mt-1 text-sm text-[#607985]">Toque em um dia para liberar ou bloquear somente a agenda deste médico.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{week.map((day) => { const available = selectedProfessional?.diasDisponiveis.includes(day) ?? false; return <button key={day} type="button" disabled={!selectedProfessional} onClick={() => selectedProfessional && setProfessionals((items) => items.map((item) => item.id === selectedProfessional.id ? { ...item, diasDisponiveis: available ? item.diasDisponiveis.filter((itemDay) => itemDay !== day) : [...item.diasDisponiveis, day] } : item))} className={`rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed ${available ? "border-[#BBF7D0] bg-[#F0FDF4]" : "border-[#FECACA] bg-[#FEF2F2]"}`}><span className="block text-sm font-semibold text-[#243746]">{day}</span><small className={available ? "text-[#166534]" : "text-[#DC2626]"}>{available ? "Liberado — toque para bloquear" : "Bloqueado — toque para liberar"}</small></button>; })}</div>
        </div>
      </div>
    </SectionCard>}
    {tab === "agendamentos" && <div id="admin-agendamentos" className="space-y-5">
      {pendingReschedules.length > 0 && <SectionCard title="Solicitações de reagendamento" description={`${pendingReschedules.length} solicitação${pendingReschedules.length === 1 ? "" : "ões"} aguardando sua confirmação.`}><div className="space-y-3">{pendingReschedules.map((item) => { const request = historicoAlteracoes.find((event) => event.agendamentoId === item.id && event.tipo === "reagendado"); const patient = mockUsers.find((user) => user.id === item.usuarioId); return <article key={item.id} className="rounded-2xl border border-[#FCD9B6] bg-gradient-to-br from-[#FFF7ED] to-white p-4 shadow-[var(--sombra-cartao)]"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong className="block text-[15px] font-semibold tracking-tight text-[#243746]">{item.tipo === "consulta" ? item.especialidade : item.tipoExame}</strong><small className="text-[#607985]">Paciente: {patient?.nome ?? "Paciente"}</small></div><span className="rounded-full bg-[#FFEDD5] px-2.5 py-1 text-xs font-semibold text-[#9A3412]">Aguardando confirmação</span></div><p className="mt-3 text-sm text-[#607985]">Pedido: <strong className="text-[#243746]">{request?.anterior.data ? `${formatDate(request.anterior.data)} às ${request.anterior.horario}` : "horário anterior"}</strong> → <strong className="text-[#243746]">{formatDate(item.data)} às {item.horario}</strong></p><div className="mt-4 flex justify-end"><AppButton size="sm" onClick={() => { onConfirmarReagendamento(item.id); notify("Novo horário confirmado. A paciente foi avisada."); }}><Check size={16}/>Confirmar novo horário</AppButton></div></article>; })}</div></SectionCard>}
      <SectionCard title="Agendamentos ativos" description="Mais recentes primeiro. Abra os detalhes para ver quem marcou e cancele quando o profissional não puder realizar o atendimento."><div className="space-y-3">{appointmentsByLatestActivity.filter((item) => item.status !== "cancelado" && item.status !== "realizado" && item.status !== "reagendamento").map((item) => <article key={item.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#B9D9DD]/55 p-4 transition-all duration-200 hover:border-[#087E8B]/35 hover:shadow-[var(--sombra-cartao)]"><div className="min-w-0 flex-1"><strong className="block text-[15px] font-semibold tracking-tight text-[#243746]">{item.tipo === "consulta" ? item.especialidade : item.tipoExame}</strong><small className="mt-1 inline-flex items-center rounded-full bg-[#F1F8F9] px-2 py-0.5 text-[11px] font-semibold text-[#087E8B]">Paciente: {mockUsers.find((user) => user.id === item.usuarioId)?.nome ?? "Paciente"}</small><small className="mt-0.5 block text-[#607985]">{getStatusLabel(item.status)} · {formatDate(item.data)} às {item.horario}{item.profissionalId ? ` · ${getProfissionalNome(item.profissionalId)}` : ""}</small></div><div className="flex w-full flex-wrap gap-2 sm:w-auto">{item.status === "pendente" && <AppButton size="sm" className="flex-1 sm:flex-none" onClick={() => setSelectedAppointmentId(item.id)}><Check size={15}/>Verificar e confirmar</AppButton>}<AppButton variant="secondary" size="sm" className="flex-1 sm:flex-none" onClick={() => setSelectedAppointmentId(item.id)}>Ver detalhes</AppButton><AppButton variant="danger" size="sm" className="flex-1 sm:flex-none" onClick={() => setAppointmentToCancel(item)}><XCircle size={15}/>Cancelar</AppButton></div></article>)}</div></SectionCard>
    </div>}
    <AlertDialog open={appointmentToCancel !== null} onOpenChange={(open) => { if (!open) setAppointmentToCancel(null); }}>
      <AlertDialogContent className="max-w-md rounded-2xl border-0 bg-white p-6 shadow-2xl">
        <AlertDialogHeader><AlertDialogTitle className="text-[#243746]">Confirmar cancelamento?</AlertDialogTitle><AlertDialogDescription className="leading-6 text-[#607985]">{appointmentToCancel && <>Você cancelará <strong>{appointmentToCancel.tipo === "consulta" ? appointmentToCancel.especialidade : appointmentToCancel.tipoExame}</strong> de <strong>{mockUsers.find((user) => user.id === appointmentToCancel.usuarioId)?.nome ?? "paciente"}</strong>, marcada para <strong>{formatDate(appointmentToCancel.data)} às {appointmentToCancel.horario}</strong>. A paciente receberá uma notificação e o histórico será atualizado.</>}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel onClick={() => setAppointmentToCancel(null)}>Voltar</AlertDialogCancel><AlertDialogAction className="bg-[#DC2626] text-white hover:bg-[#B91C1C]" onClick={() => { if (appointmentToCancel) { onCancelarPorProfissional(appointmentToCancel.id); notify("Cancelamento registrado. A paciente foi notificada."); } setAppointmentToCancel(null); }}>Confirmar cancelamento</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <AlertDialog open={selectedAppointment !== null} onOpenChange={(open) => { if (!open) setSelectedAppointmentId(null); }}>
      <AlertDialogContent className="max-h-[calc(100dvh-2rem)] max-w-md overflow-y-auto overscroll-contain rounded-2xl border-0 bg-white p-6 shadow-2xl">
        <AlertDialogHeader><AlertDialogTitle className="text-[#243746]">Detalhes da solicitação</AlertDialogTitle><AlertDialogDescription className="text-[#607985]">Informações da pessoa que marcou o atendimento.</AlertDialogDescription></AlertDialogHeader>
        {selectedAppointment && <div className="space-y-4 text-sm">
          <div className="rounded-xl bg-[#F4F9FA] p-4"><strong className="block text-base text-[#243746]">{selectedPatient?.nome ?? "Paciente"}</strong><span className="mt-1 block text-[#607985]">Paciente SaúdeConnect+</span></div>
          <dl className="grid gap-3 rounded-xl border border-[#DCEFF1] p-4"><div><dt className="text-xs font-semibold uppercase tracking-wide text-[#607985]">E-mail</dt><dd className="mt-1 font-medium text-[#243746]">{selectedPatient?.email ?? "Não informado"}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wide text-[#607985]">Celular</dt><dd className="mt-1 font-medium text-[#243746]">{selectedPatient?.telefone ?? "Não informado"}</dd></div></dl>
          <div className="rounded-xl border border-[#DCEFF1] p-4"><strong className="block text-[#243746]">{selectedAppointment.tipo === "consulta" ? selectedAppointment.especialidade : selectedAppointment.tipoExame}</strong><span className="mt-1 block text-[#607985]">{formatDate(selectedAppointment.data)} às {selectedAppointment.horario}</span>{selectedRequest?.anterior.data && <span className="mt-2 block text-xs text-[#607985]">Horário anterior: {formatDate(selectedRequest.anterior.data)} às {selectedRequest.anterior.horario}</span>}<span className="mt-2 block text-xs text-[#607985]">{selectedProfessionalOfAppointment ? `Profissional: ${selectedProfessionalOfAppointment.nome}` : "Exame realizado pela unidade"} · {getStatusLabel(selectedAppointment.status)}</span></div>
          <AlteracoesHistorico eventos={historicoAlteracoes.filter((event) => event.agendamentoId === selectedAppointment.id)} agendamentos={[selectedAppointment]} />
          {podeConfirmarSelecionado && (impedimentos.length === 0
            ? <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-[#166534]"><Check size={16}/>Agenda verificada: horário livre{selectedProfessionalOfAppointment ? " e profissional disponível no dia" : " na unidade"}.</div>
            : <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3 text-[#DC2626]"><strong className="block">Não é possível confirmar:</strong>{impedimentos.map((motivo) => <span key={motivo} className="mt-1 block">{motivo}</span>)}</div>)}
        </div>}
        <AlertDialogFooter>{podeConfirmarSelecionado && <AppButton disabled={impedimentos.length > 0} onClick={() => { if (!selectedAppointment) return; if (selectedAppointment.status === "reagendamento") onConfirmarReagendamento(selectedAppointment.id); else onConfirmarAgendamento(selectedAppointment.id); notify("Agendamento confirmado. O paciente foi avisado."); setSelectedAppointmentId(null); }}><Check size={16}/>Confirmar agendamento</AppButton>}<AlertDialogCancel onClick={() => setSelectedAppointmentId(null)}>Fechar</AlertDialogCancel></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
}
