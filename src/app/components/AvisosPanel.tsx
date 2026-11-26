import { useState } from "react";
import { Bell, Check, CircleAlert, Clock3, Info } from "lucide-react";
import type { Notificacao } from "./mockData";
import { SectionCard } from "./dashboard/SectionCard";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

const noticeStyles = {
  lembrete: { surface: "bg-[#FFF8DC]", icon: "bg-[#FEF3C7] text-[#B45309]", Icon: Bell },
  confirmacao: { surface: "bg-[#F0FDF4]", icon: "bg-[#DCFCE7] text-[#15803D]", Icon: Check },
  info: { surface: "bg-[#EFF6FF]", icon: "bg-[#DBEAFE] text-[#2563EB]", Icon: Info },
  cancelamento: { surface: "bg-[#FEF2F2]", icon: "bg-[#FEE2E2] text-[#DC2626]", Icon: CircleAlert },
} as const;

interface AvisosPanelProps {
  notifications: Notificacao[];
  onMarkRead: (id: string) => void;
  onOpenAppointment?: (appointmentId: string) => void;
}

function AvisoCard({ notification, onOpen }: { notification: Notificacao; onOpen: () => void }) {
  const style = noticeStyles[notification.tipo];
  const Icon = style.Icon;
  return <button
    type="button"
    onClick={onOpen}
    className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:brightness-[0.98] ${notification.lida ? "bg-[#F8FBFC]" : style.surface}`}
  >
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${style.icon}`}><Icon size={17} /></span>
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-2">
        <strong className="block text-sm text-[#243746]">{notification.titulo}</strong>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${notification.lida ? "bg-[#EAF5F6] text-[#607985]" : "bg-white/70 text-[#087E8B]"}`}>{notification.lida ? "Lido" : "Novo"}</span>
      </span>
      <span className="mt-0.5 block line-clamp-3 text-xs leading-5 text-[#607985]">{notification.mensagem}</span>
      <span className="mt-1.5 flex items-center gap-1 text-[11px] text-[#607985]"><Clock3 size={12} />{new Date(notification.data).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
    </span>
    {!notification.lida && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#087E8B]" aria-label="Não lida" />}
  </button>;
}

export function AvisosPanel({ notifications, onMarkRead, onOpenAppointment }: AvisosPanelProps) {
  const [allNotificationsOpen, setAllNotificationsOpen] = useState(false);
  const seen = new Set<string>();
  const allImportant = [...notifications]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .filter((notification) => {
      const key = `${notification.titulo}:${notification.mensagem}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const important = allImportant.slice(0, 3);
  const unread = important.filter((notification) => !notification.lida).length;
  const openNotification = (notification: Notificacao) => {
    onMarkRead(notification.id);
    setAllNotificationsOpen(false);
    if (notification.agendamentoId) onOpenAppointment?.(notification.agendamentoId);
  };

  return (
    <SectionCard title="Avisos importantes" description={unread ? `${unread} ${unread === 1 ? "atualização que precisa" : "atualizações que precisam"} da sua atenção.` : "Lembretes e atualizações sobre seus atendimentos."} action={allImportant.length > 0 ? <button type="button" onClick={() => setAllNotificationsOpen(true)} className="text-sm font-semibold text-[#087E8B] hover:underline">Ver todas as notificações</button> : undefined}>
      {important.length === 0 ? (
        <div className="rounded-xl bg-[#F4F9FA] px-4 py-6 text-center">
          <Check size={22} className="mx-auto text-[#087E8B]" />
          <p className="mt-2 text-sm font-semibold text-[#243746]">Você está em dia</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {important.map((notification) => <AvisoCard key={notification.id} notification={notification} onOpen={() => openNotification(notification)} />)}
        </div>
      )}
      <AlertDialog open={allNotificationsOpen} onOpenChange={setAllNotificationsOpen}>
        <AlertDialogContent className="max-h-[85vh] max-w-xl overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl">
          <AlertDialogHeader className="border-b border-[#DCEFF1] px-5 py-4 sm:px-6"><AlertDialogTitle className="text-[#243746]">Todas as notificações</AlertDialogTitle><AlertDialogDescription className="text-[#607985]">{allImportant.length} aviso{allImportant.length === 1 ? "" : "s"} em ordem do mais recente para o mais antigo.</AlertDialogDescription></AlertDialogHeader>
          <div className="max-h-[55vh] space-y-2 overflow-y-auto px-5 py-4 sm:px-6">{allImportant.map((notification) => <AvisoCard key={notification.id} notification={notification} onOpen={() => openNotification(notification)} />)}</div>
          <AlertDialogFooter className="border-t border-[#DCEFF1] px-5 py-4 sm:px-6"><AlertDialogAction onClick={() => setAllNotificationsOpen(false)}>Fechar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}
