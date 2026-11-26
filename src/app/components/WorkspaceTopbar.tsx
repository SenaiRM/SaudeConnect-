import { useState } from "react";
import { Bell, Type } from "lucide-react";
import type { Notificacao } from "./mockData";
import { NotificationPopover } from "./NotificationPopover";

interface WorkspaceTopbarProps {
  unread: number;
  notifications: Notificacao[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onOpenAppointment?: (appointmentId: string) => void;
  modoFacil?: boolean;
  onToggleModoFacil?: () => void;
}

export function WorkspaceTopbar({ unread, notifications, onMarkRead, onMarkAllRead, onOpenAppointment, modoFacil = false, onToggleModoFacil }: WorkspaceTopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return <header className="absolute right-0 top-8 z-40 max-lg:fixed max-lg:right-3 max-lg:top-3">
    <div>
      <div className="relative">
        <button type="button" aria-label="Notificações" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)} className="relative grid h-11 w-11 place-items-center rounded-xl text-[#087E8B] transition hover:bg-white hover:shadow-sm max-lg:bg-white max-lg:shadow-sm">
          <Bell size={20}/>
          {unread > 0 && <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#DC2626] px-1 text-[9px] font-bold text-white">{unread}</span>}
        </button>
        {notificationsOpen && <NotificationPopover notifications={notifications} onMarkRead={onMarkRead} onMarkAllRead={onMarkAllRead} onOpenAppointment={(appointmentId) => { setNotificationsOpen(false); onOpenAppointment?.(appointmentId); }} />}
      </div>
    </div>
  </header>;
}
