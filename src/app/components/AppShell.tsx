import type { ReactNode } from "react";
import type { Notificacao, Screen, User } from "./mockData";
import { DesktopNav } from "./DesktopNav";
import { WorkspaceTopbar } from "./WorkspaceTopbar";

interface AppShellProps {
  activeTab: Screen;
  onNavigate: (screen: Screen) => void;
  user: User;
  unread: number;
  notifications: Notificacao[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onOpenAppointment?: (appointmentId: string) => void;
  showNotifications?: boolean;
  modoFacil?: boolean;
  onToggleModoFacil?: () => void;
  onTrocarPerfil?: () => void;
  children: ReactNode;
}

export function AppShell({ activeTab, onNavigate, user, unread, notifications, onMarkRead, onMarkAllRead, onOpenAppointment, showNotifications = true, modoFacil = false, onToggleModoFacil, onTrocarPerfil, children }: AppShellProps) {
  return <main className={`min-h-screen bg-[#F4F9FA] bg-[radial-gradient(1100px_520px_at_18%_-8%,rgba(8,126,139,0.07),transparent_60%)] lg:grid lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] ${modoFacil ? "modo-facil-shell" : ""}`}>
    <DesktopNav activeTab={activeTab} onNavigate={onNavigate} role={user.role} onTrocarPerfil={onTrocarPerfil} />
    <section className="min-w-0 min-h-screen lg:px-6 lg:pb-6 lg:pt-6 xl:px-8 xl:pb-8 2xl:px-10 2xl:pb-10">
      <div className={`relative mx-auto w-full max-w-[1440px] ${modoFacil ? "lg:max-w-[1180px]" : ""}`}>{showNotifications && <WorkspaceTopbar unread={unread} notifications={notifications} onMarkRead={onMarkRead} onMarkAllRead={onMarkAllRead} onOpenAppointment={onOpenAppointment} modoFacil={modoFacil} onToggleModoFacil={onToggleModoFacil} />}{children}</div>
    </section>
  </main>;
}
