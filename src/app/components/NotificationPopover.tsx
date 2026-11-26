import { Bell, Check, CheckCheck, CircleAlert, Info } from "lucide-react";
import type { Notificacao } from "./mockData";

const notificationStyles = {
  lembrete: { surface: "bg-[#FEF3C7]/55", icon: "bg-[#FEF3C7] text-[#B45309]", dot: "bg-[#D97706]", Icon: Bell },
  confirmacao: { surface: "bg-[#DCFCE7]/65", icon: "bg-[#DCFCE7] text-[#15803D]", dot: "bg-[#16A34A]", Icon: Check },
  info: { surface: "bg-[#DBEAFE]/60", icon: "bg-[#DBEAFE] text-[#2563EB]", dot: "bg-[#2563EB]", Icon: Info },
  cancelamento: { surface: "bg-[#FEE2E2]/65", icon: "bg-[#FEE2E2] text-[#DC2626]", dot: "bg-[#DC2626]", Icon: CircleAlert },
} as const;

interface NotificationPopoverProps {
  notifications: Notificacao[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onOpenAppointment?: (appointmentId: string) => void;
}

export function NotificationPopover({ notifications, onMarkRead, onMarkAllRead, onOpenAppointment }: NotificationPopoverProps) {
  const recentNotifications = notifications.slice(0, 4);
  const unread = notifications.filter((notification) => !notification.lida).length;

  return (
    <section role="dialog" aria-label="Notificações recentes" className="absolute right-0 top-14 z-30 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#B9D9DD]/65 bg-white text-left shadow-[0_18px_46px_rgba(36,55,70,0.18)]">
      <header className="flex items-center justify-between border-b border-[#DCEFF1] px-4 py-3">
        <div><p className="font-semibold text-[#243746]">Notificações</p><p className="text-xs text-[#607985]">{unread ? `${unread} não lida${unread === 1 ? "" : "s"}` : "Você está em dia"}</p></div>
        {unread > 0 && <button type="button" onClick={onMarkAllRead} className="inline-flex items-center gap-1 text-xs font-semibold text-[#087E8B]"><CheckCheck size={15} />Marcar todas</button>}
      </header>
      <div className="max-h-80 overflow-y-auto p-2">
        {recentNotifications.length === 0 ? (
          <div className="px-4 py-8 text-center"><Bell size={24} className="mx-auto text-[#B9D9DD]" /><p className="mt-2 text-sm font-medium text-[#243746]">Nenhum aviso por enquanto</p></div>
        ) : recentNotifications.map((notification) => {
          const style = notificationStyles[notification.tipo];
          const StatusIcon = style.Icon;
          return (
          <button key={notification.id} type="button" onClick={() => { onMarkRead(notification.id); if (notification.agendamentoId) onOpenAppointment?.(notification.agendamentoId); }} className={`flex w-full gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[#F4F9FA] ${notification.lida ? "bg-white" : style.surface}`}>
            <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${style.icon}`}><StatusIcon size={16} /></span>
            <span className="min-w-0 flex-1"><strong className="block text-sm text-[#243746]">{notification.titulo}</strong><span className="mt-0.5 block line-clamp-2 text-xs leading-5 text-[#607985]">{notification.mensagem}</span>{notification.agendamentoId && <span className="mt-1.5 block text-[11px] font-semibold text-[#087E8B]">Ver atendimento →</span>}</span>
            {!notification.lida && <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${style.dot}`} aria-label="Não lida" />}
          </button>
          );
        })}
      </div>
    </section>
  );
}
