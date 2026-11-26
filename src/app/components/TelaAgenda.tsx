import { useState } from "react";
import { ArrowRight, CalendarClock, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, Clock, FlaskConical, Plus, Stethoscope, X } from "lucide-react";
import type { Agendamento, AgendamentoHistorico, Screen } from "./mockData";
import { getInstituicaoNome, getProfissionalNome, getStatusLabel, mockUsers } from "./mockData";
import { StatusPill } from "./StatusPill";

function nomeDoPaciente(usuarioId: string) {
  return mockUsers.find((user) => user.id === usuarioId)?.nome ?? "Paciente";
}
import { DashboardPageHeader } from "./dashboard/DashboardPageHeader";
import { SectionCard } from "./dashboard/SectionCard";
import { AppButton } from "./ui/AppButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { ReagendarModal } from "../features/agendamento/ReagendarModal";
import { getEasyModeTabs } from "../features/accessibility/easyMode";
import { separarAgenda } from "../features/agendamento/agendaView.ts";
import { historyLabels } from "../features/agendamento/historyView.ts";

interface TelaAgendaProps {
  agendamentos: Agendamento[];
  /** Agenda completa da rede, usada só para saber quais horários já estão ocupados. */
  todosAgendamentos?: Agendamento[];
  /** A secretaria apenas acompanha: sem marcar, reagendar ou cancelar. */
  somenteLeitura?: boolean;
  onNavigate: (s: Screen) => void;
  onCancelar: (id: string) => void;
  onReagendar: (id: string, data: string, horario: string) => void;
  historicoAlteracoes: AgendamentoHistorico[];
  notificacoesNaoLidas: number;
  modoFacil?: boolean;
}

const STATUS_ATIVOS: Agendamento["status"][] = ["pendente", "confirmado", "reagendamento"];

type TabAgenda = "todos" | "consultas" | "exames" | "historico";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function CalendarioMini({ agendamentos }: { agendamentos: Agendamento[] }) {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const diasComAgenda = new Set(agendamentos.filter((ag) => {
    const data = new Date(`${ag.data}T00:00:00`);
    return data.getMonth() === mes && data.getFullYear() === ano && ag.status !== "cancelado";
  }).map((ag) => Number(ag.data.split("-")[2])));
  const celulas: Array<number | null> = Array(primeiroDia).fill(null);
  for (let dia = 1; dia <= totalDias; dia += 1) celulas.push(dia);
  while (celulas.length % 7 !== 0) celulas.push(null);
  const trocarMes = (direcao: number) => {
    const proximo = new Date(ano, mes + direcao, 1);
    setMes(proximo.getMonth());
    setAno(proximo.getFullYear());
  };

  return (
    <div className="p-1">
      <div className="mb-3 flex items-center justify-between">
        <button aria-label="Mês anterior" onClick={() => trocarMes(-1)} className="grid h-8 w-8 place-items-center rounded-full bg-[#F4F9FA] text-[#087E8B]"><ChevronLeft size={16} /></button>
        <p className="text-sm font-semibold text-[#243746]">{MESES[mes]} {ano}</p>
        <button aria-label="Próximo mês" onClick={() => trocarMes(1)} className="grid h-8 w-8 place-items-center rounded-full bg-[#F4F9FA] text-[#087E8B]"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-[10px] text-[#607985]">
        {DIAS_SEMANA.map((dia) => <span key={dia} className="py-1 font-medium">{dia}</span>)}
      </div>
      <div className="grid grid-cols-7 text-center">
        {celulas.map((dia, index) => {
          if (!dia) return <span key={`empty-${index}`} className="h-8" />;
          const selecionado = dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
          return <span key={`${dia}-${index}`} className="relative grid h-8 place-items-center text-xs text-[#243746]">
            <span className={`grid h-7 w-7 place-items-center rounded-full ${selecionado ? "bg-[#087E8B] font-bold text-white" : ""}`}>{dia}</span>
            {!selecionado && diasComAgenda.has(dia) && <i className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#087E8B]" />}
          </span>;
        })}
      </div>
    </div>
  );
}

function IconeAgendamento({ tipo }: { tipo: Agendamento["tipo"] }) {
  return <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#DCEFF1] text-[#087E8B] ring-1 ring-inset ring-[#B9D9DD]/40">
    {tipo === "consulta" ? <Stethoscope size={19} /> : <FlaskConical size={19} />}
  </div>;
}

function LinhaAgendamento({ ag, compact = false, paciente, onReagendar, onCancelar }: { ag: Agendamento; compact?: boolean; paciente?: string; onReagendar?: () => void; onCancelar?: () => void }) {
  const data = new Date(`${ag.data}T00:00:00`);
  const titulo = ag.tipo === "consulta" ? ag.especialidade : ag.tipoExame;
  const responsavel = ag.profissionalId ? getProfissionalNome(ag.profissionalId) : getInstituicaoNome(ag.instituicaoId);
  const mostrarAcoes = !compact && STATUS_ATIVOS.includes(ag.status) && (onReagendar || onCancelar);
  return <article className={`group rounded-2xl border border-[#B9D9DD]/55 bg-white transition-all duration-200 hover:border-[#087E8B]/40 hover:shadow-[var(--sombra-cartao)] ${compact ? "p-3" : "p-3.5 sm:p-4"}`}>
    <div className="flex items-start gap-3">
      {!compact && <div className="hidden h-12 w-12 shrink-0 flex-col place-items-center justify-center rounded-2xl bg-gradient-to-br from-[#DCEFF1] to-[#EAF5F6] text-center leading-none text-[#087E8B] ring-1 ring-inset ring-[#B9D9DD]/50 sm:flex"><strong className="text-lg font-bold tracking-tight">{data.getDate()}</strong><span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide">{MESES[data.getMonth()].slice(0, 3)}</span></div>}
      <IconeAgendamento tipo={ag.tipo} />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-[#243746] sm:truncate">{titulo}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-[#607985] sm:truncate">{compact ? `${responsavel} · ${getInstituicaoNome(ag.instituicaoId)}` : `${responsavel} · ${getInstituicaoNome(ag.instituicaoId)}`}</p>
        {paciente && <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#F1F8F9] px-2 py-0.5 text-[11px] font-semibold text-[#087E8B]">Paciente: {paciente}</p>}
        {!compact && <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#607985] sm:hidden"><Clock size={13} />{data.toLocaleDateString("pt-BR")} às {ag.horario}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusPill status={ag.status} />
        <span className="hidden items-center gap-1 text-xs font-semibold text-[#243746] sm:flex"><Clock size={13} className="text-[#607985]" />{ag.horario}</span>
      </div>
    </div>
    {mostrarAcoes && (
      <div className="mt-3.5 flex gap-2 border-t border-[#B9D9DD]/35 pt-3">
        {onReagendar && ag.status !== "reagendamento" && <AppButton variant="secondary" size="sm" onClick={onReagendar} className="flex-1"><CalendarClock size={15} />Reagendar</AppButton>}
        {onCancelar && <AppButton variant="danger" size="sm" onClick={onCancelar} className="flex-1"><X size={15} />Cancelar</AppButton>}
      </div>
    )}
  </article>;
}

export function AlteracoesHistorico({ eventos, agendamentos }: { eventos: AgendamentoHistorico[]; agendamentos: Agendamento[] }) {
  if (!eventos.length) return null;
  const eventVisual = {
    criado: { title: "Agendamento criado", description: "Seu atendimento foi registrado.", icon: CalendarDays, color: "bg-[#EAF5F6] text-[#087E8B]", line: "border-[#9AD5DA]" },
    confirmado: { title: "Agendamento confirmado", description: "Confirmado pela secretaria", icon: CheckCircle2, color: "bg-[#DCFCE7] text-[#15803D]", line: "border-[#86EFAC]" },
    reagendado: { title: "Reagendamento solicitado", description: "Aguardando confirmação", icon: CalendarClock, color: "bg-[#FFF1D6] text-[#B45309]", line: "border-[#F7C982]" },
    reagendamento_confirmado: { title: "Novo horário confirmado", description: "Confirmado pela secretaria", icon: CheckCircle2, color: "bg-[#DCFCE7] text-[#15803D]", line: "border-[#86EFAC]" },
    cancelado: { title: "Atendimento cancelado", description: "Cancelamento registrado", icon: CircleAlert, color: "bg-[#FEE2E2] text-[#DC2626]", line: "border-[#FCA5A5]" },
  } as const;
  return <div className="mb-5 overflow-hidden rounded-2xl border border-[#D7E9EB] bg-white shadow-[0_8px_24px_rgba(8,126,139,0.06)]">
    <div className="border-b border-[#DCEFF1] bg-gradient-to-r from-[#F2FBFC] to-white px-4 py-4 sm:px-5">
      <h3 className="text-base font-semibold text-[#243746]">Linha do tempo do agendamento</h3>
      <p className="mt-1 text-xs text-[#607985]">Todas as mudanças ficam registradas para você acompanhar.</p>
    </div>
    <div className="space-y-0 px-4 py-2 sm:px-5">
      {eventos.map((evento, index) => {
        const anterior = evento.anterior.data && evento.anterior.horario ? `${new Date(`${evento.anterior.data}T00:00:00`).toLocaleDateString("pt-BR")} às ${evento.anterior.horario}` : "agendamento ativo";
        const atual = evento.atual.data && evento.atual.horario ? `${new Date(`${evento.atual.data}T00:00:00`).toLocaleDateString("pt-BR")} às ${evento.atual.horario}` : "cancelado";
        const visual = eventVisual[evento.tipo];
        const agendamento = agendamentos.find((item) => item.id === evento.agendamentoId);
        const Icon = visual.icon;
        const hasChange = evento.tipo === "reagendado" || evento.tipo === "cancelado";
        return <div key={`${evento.agendamentoId}-${evento.data}-${index}`} className={`relative flex gap-3 border-l-2 ${visual.line} py-4 pl-5 last:border-transparent`}>
          <span className={`absolute -left-[17px] top-4 grid h-8 w-8 place-items-center rounded-full ring-4 ring-white ${visual.color}`}><Icon size={16} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="font-semibold text-[#243746]">{historyLabels[evento.tipo].title}</p>
              <time className="text-[11px] text-[#607985]">{new Date(evento.data).toLocaleString("pt-BR")}</time>
            </div>
            {agendamento && <p className="mt-1 text-xs font-semibold text-[#243746]">{agendamento.tipo === "consulta" ? agendamento.especialidade : agendamento.tipoExame} · {getInstituicaoNome(agendamento.instituicaoId)}</p>}
            <p className={`mt-1 text-xs font-medium ${visual.color.split(" ")[1]}`}>{historyLabels[evento.tipo].description}</p>
            {hasChange ? <div className="mt-3 grid gap-2 text-xs sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-lg bg-[#F4F9FA] px-3 py-2"><span className="block text-[10px] font-bold uppercase tracking-wide text-[#607985]">Antes</span><strong className="mt-0.5 block text-[#243746]">{anterior}</strong></div>
              <ArrowRight className="mx-auto hidden text-[#087E8B] sm:block" size={16} />
              <div className={`rounded-lg px-3 py-2 ${evento.tipo === "cancelado" ? "bg-[#FEF2F2]" : "bg-[#FFF7ED]"}`}><span className="block text-[10px] font-bold uppercase tracking-wide text-[#607985]">Depois</span><strong className="mt-0.5 block text-[#243746]">{atual}</strong></div>
            </div> : <p className="mt-2 text-xs leading-5 text-[#607985]">{evento.tipo === "criado" ? `Novo horário registrado para ${atual}.` : evento.tipo === "confirmado" ? `Atendimento de ${atual} confirmado pela secretaria.` : `Seu novo horário ${atual} foi confirmado pela secretaria.`}</p>}
            <p className="mt-2 text-[11px] text-[#607985]">Registrado por {evento.responsavel}.</p>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

function ConfirmarCancelamentoDialog({ agendamento, onClose, onConfirm }: { agendamento: Agendamento | null; onClose: () => void; onConfirm: () => void }) {
  if (!agendamento) return null;
  const titulo = agendamento.tipo === "consulta" ? agendamento.especialidade : agendamento.tipoExame;
  const quando = `${new Date(`${agendamento.data}T00:00:00`).toLocaleDateString("pt-BR")} às ${agendamento.horario}`;
  return <AlertDialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <AlertDialogContent className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-[#243746]">Confirmar cancelamento?</AlertDialogTitle>
        <AlertDialogDescription className="leading-6 text-[#607985]">Você vai cancelar <strong>{titulo}</strong>, marcado para <strong>{quando}</strong>. Esta ação atualizará seu histórico.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="gap-2 sm:gap-0">
        <AlertDialogCancel onClick={onClose}>Voltar</AlertDialogCancel>
        <AlertDialogAction className="bg-[#DC2626] text-white hover:bg-[#B91C1C]" onClick={onConfirm}>Confirmar cancelamento</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}

export function TelaAgenda({ agendamentos, todosAgendamentos, somenteLeitura = false, onNavigate, onCancelar, onReagendar, historicoAlteracoes, modoFacil = false }: TelaAgendaProps) {
  const [tab, setTab] = useState<TabAgenda>("todos");
  const [reagendarAg, setReagendarAg] = useState<Agendamento | null>(null);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState<Agendamento | null>(null);
  const [avisoMsg, setAvisoMsg] = useState("");
  const cancelarComConfirmacao = (ag: Agendamento) => setAgendamentoParaCancelar(ag);
  const confirmarCancelamento = () => {
    if (agendamentoParaCancelar) onCancelar(agendamentoParaCancelar.id);
    setAgendamentoParaCancelar(null);
  };
  // Um atendimento vencido sai de "Próximos" mesmo que ninguém tenha mudado o status.
  const { proximos: ativos, historico } = separarAgenda(agendamentos);
  // O seletor de reagendamento precisa ver a agenda da rede inteira para não
  // oferecer um horário que outro paciente já reservou.
  const agendaDaRede = todosAgendamentos ?? agendamentos;
  const listas = { todos: ativos, consultas: ativos.filter((ag) => ag.tipo === "consulta"), exames: ativos.filter((ag) => ag.tipo === "exame"), historico };
  const tabs: Array<{ key: TabAgenda; label: string }> = [{ key: "todos", label: "Próximos" }, { key: "consultas", label: "Consultas" }, { key: "exames", label: "Exames" }, { key: "historico", label: "Histórico" }];
  const agendaDoDia = ativos.slice(0, 3);
  const pendingReschedules = ativos.filter((ag) => ag.status === "reagendamento");

  if (modoFacil) return <div className="min-h-full bg-[#F4F9FA] px-4 pb-8 pt-5 sm:px-5 lg:p-0">
    <DashboardPageHeader eyebrow="Modo Fácil" title="Minha agenda" description="Veja seus atendimentos e escolha uma ação por vez." />
    {avisoMsg && <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#DCFCE7] px-4 py-3 text-sm font-medium text-[#166534]"><CalendarClock size={17} />{avisoMsg}</div>}
    <div className="mt-5"><AppButton size="lg" onClick={() => onNavigate("agendar")} fullWidth><Plus size={19} />Novo agendamento</AppButton></div>
    <SectionCard className="mt-5" title="Próximo atendimento" description="Use os botões abaixo se precisar alterar ou cancelar.">
      {ativos.length ? <LinhaAgendamento ag={ativos[0]} onReagendar={() => setReagendarAg(ativos[0])} onCancelar={() => cancelarComConfirmacao(ativos[0])} /> : <div className="grid min-h-36 place-items-center text-center"><div><CalendarDays className="mx-auto mb-2 text-[#B9D9DD]" size={30} /><p className="text-sm font-medium text-[#243746]">Nenhum atendimento próximo</p><p className="mt-1 text-xs text-[#607985]">Quando precisar, toque em “Novo agendamento”.</p></div></div>}
    </SectionCard>
    <SectionCard className="mt-5" title="Outros atendimentos" description={getEasyModeTabs().join(" e ") + "."}>
      <div className="space-y-2.5">{[...ativos.slice(1), ...historico].length ? [...ativos.slice(1), ...historico].map((ag) => <LinhaAgendamento key={ag.id} ag={ag} onReagendar={() => setReagendarAg(ag)} onCancelar={() => cancelarComConfirmacao(ag)} />) : <p className="py-3 text-center text-sm text-[#607985]">Não há outros atendimentos.</p>}</div>
    </SectionCard>
    {reagendarAg && <ReagendarModal agendamento={reagendarAg} agendamentos={agendaDaRede} onClose={() => setReagendarAg(null)} onConfirm={(data, horario) => { const anterior = `${new Date(`${reagendarAg.data}T00:00:00`).toLocaleDateString("pt-BR")} às ${reagendarAg.horario}`; const atual = `${new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR")} às ${horario}`; onReagendar(reagendarAg.id, data, horario); setReagendarAg(null); setAvisoMsg(`Pedido enviado: ${anterior} → ${atual}. Aguarde a confirmação da secretaria.`); window.setTimeout(() => setAvisoMsg(""), 8000); }} />}
    <ConfirmarCancelamentoDialog agendamento={agendamentoParaCancelar} onClose={() => setAgendamentoParaCancelar(null)} onConfirm={confirmarCancelamento} />
  </div>;

  return <div className="min-h-full bg-[#F4F9FA] px-4 pb-8 pt-5 sm:px-5 lg:p-0">
    <DashboardPageHeader eyebrow={somenteLeitura ? "Secretaria" : "Meus cuidados"} title={somenteLeitura ? "Agenda da unidade" : "Minha agenda"} description={somenteLeitura ? "Acompanhe o que os pacientes marcam, remarcam e cancelam." : "Visualize seus atendimentos, consultas e exames."} />

    {avisoMsg && (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#DCFCE7] px-4 py-3 text-sm font-medium text-[#166534]">
        <CalendarClock size={17} />{avisoMsg}
      </div>
    )}

    {pendingReschedules.length > 0 && <div className="mt-4 rounded-xl border border-[#FCD9B6] bg-[#FFF7ED] px-4 py-3 text-sm text-[#9A3412]"><strong className="block">Reagendamento aguardando confirmação</strong><span className="mt-1 block">Seu pedido para {new Date(`${pendingReschedules[0].data}T00:00:00`).toLocaleDateString("pt-BR")} às {pendingReschedules[0].horario} foi enviado à secretaria da unidade. Você receberá um aviso assim que ele confirmar.</span></div>}

    {!somenteLeitura && <div className="mt-4 lg:hidden"><AppButton onClick={() => onNavigate("agendar")} fullWidth><Plus size={17} />Novo agendamento</AppButton></div>}

    <div className="pt-4 lg:pt-6">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(280px,.8fr)_minmax(0,1.2fr)]">
        <SectionCard title="Calendário" description="Selecione uma data para consultar seus horários."><CalendarioMini agendamentos={agendamentos} /></SectionCard>
        <SectionCard className="hidden lg:block" title="Agenda do dia" description={somenteLeitura ? "Próximos atendimentos da unidade." : "Seus próximos atendimentos confirmados."} action={somenteLeitura ? undefined : <AppButton onClick={() => onNavigate("agendar")}><Plus size={17} />Novo agendamento</AppButton>}>
          <div className="space-y-2.5">
            {agendaDoDia.length ? agendaDoDia.map((ag) => <LinhaAgendamento key={ag.id} ag={ag} compact />) : <div className="grid min-h-40 place-items-center rounded-xl bg-[#F4F9FA] text-center"><div><CalendarDays className="mx-auto mb-2 text-[#B9D9DD]" size={28} /><p className="text-sm font-medium text-[#243746]">Nenhum atendimento próximo</p><p className="mt-1 text-xs text-[#607985]">Quando houver um agendamento, ele aparecerá aqui.</p></div></div>}
          </div>
        </SectionCard>
      </div>

      <div className="mt-5 flex rounded-xl bg-[#DCEFF1] p-1" role="tablist">
        {tabs.map((item) => <button key={item.key} role="tab" aria-selected={tab === item.key} onClick={() => setTab(item.key)} className={`min-h-[44px] min-w-0 flex-1 rounded-lg px-1.5 py-2.5 text-[11px] leading-tight transition sm:px-3 sm:text-sm ${tab === item.key ? "bg-[#087E8B] font-semibold text-white shadow-sm" : "text-[#243746]"}`}>{item.label}</button>)}
      </div>

      <SectionCard className="mt-5" title={tab === "todos" ? "Próximos compromissos" : tabs.find((item) => item.key === tab)?.label ?? "Agenda"} description={tab === "historico" ? "Atendimentos concluídos e cancelados." : "Acompanhe os detalhes de cada atendimento."}>
        <div className="space-y-2.5">
          {tab === "historico" && <AlteracoesHistorico eventos={historicoAlteracoes} agendamentos={agendamentos} />}
          {listas[tab].length ? listas[tab].map((ag) => <LinhaAgendamento key={ag.id} ag={ag} paciente={somenteLeitura ? nomeDoPaciente(ag.usuarioId) : undefined} onReagendar={somenteLeitura ? undefined : () => setReagendarAg(ag)} onCancelar={somenteLeitura ? undefined : () => cancelarComConfirmacao(ag)} />) : <div className="grid min-h-36 place-items-center text-center"><div><CalendarDays className="mx-auto mb-2 text-[#B9D9DD]" size={30} /><p className="text-sm font-medium text-[#243746]">Nenhum agendamento encontrado</p><p className="mt-1 text-xs text-[#607985]">{somenteLeitura ? "Quando um paciente marcar, o atendimento aparece aqui." : "Agende uma consulta ou exame quando precisar."}</p></div></div>}
        </div>
      </SectionCard>
    </div>

    {reagendarAg && (
      <ReagendarModal
        agendamento={reagendarAg}
        agendamentos={agendaDaRede}
        onClose={() => setReagendarAg(null)}
        onConfirm={(data, horario) => { const anterior = `${new Date(`${reagendarAg.data}T00:00:00`).toLocaleDateString("pt-BR")} às ${reagendarAg.horario}`; const atual = `${new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR")} às ${horario}`; onReagendar(reagendarAg.id, data, horario); setReagendarAg(null); setAvisoMsg(`Pedido enviado: ${anterior} → ${atual}. Aguarde a confirmação da secretaria.`); window.setTimeout(() => setAvisoMsg(""), 8000); }}
      />
    )}
    <ConfirmarCancelamentoDialog agendamento={agendamentoParaCancelar} onClose={() => setAgendamentoParaCancelar(null)} onConfirm={confirmarCancelamento} />
  </div>;
}
