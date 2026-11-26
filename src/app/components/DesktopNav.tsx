import { Building2, CalendarDays, Home, Repeat, UserRound } from "lucide-react";
import type { Screen, UserRole } from "./mockData";
import logoMark from "@/assets/saudeconnect-mark.png";

interface DesktopNavProps {
  activeTab: Screen;
  onNavigate: (screen: Screen) => void;
  role: UserRole;
  /** Volta à escolha entre paciente e secretaria. */
  onTrocarPerfil?: () => void;
}

const items: { screen: Screen; label: string; icon: typeof Home }[] = [
  { screen: "home", label: "Início", icon: Home },
  { screen: "agenda", label: "Agenda", icon: CalendarDays },
  { screen: "instituicoes", label: "Instituições", icon: Building2 },
  { screen: "perfil", label: "Perfil", icon: UserRound },
];

export function DesktopNav({ activeTab, onNavigate, role, onTrocarPerfil }: DesktopNavProps) {
  const navItems = role === "secretaria" ? [{ screen: "gestao" as Screen, label: "Painel", icon: Home }, { screen: "agenda" as Screen, label: "Agenda", icon: CalendarDays }, { screen: "instituicoes" as Screen, label: "Instituições", icon: Building2 }, { screen: "perfil" as Screen, label: "Perfil", icon: UserRound }] : items;
  return (
    <aside className="easy-desktop-nav hidden lg:flex min-h-screen sticky top-0 h-screen flex-col border-r border-[#B9D9DD]/40 bg-white">
      <button onClick={() => onNavigate(role === "secretaria" ? "gestao" : "home")} aria-label="Início SaúdeConnect" className="flex items-center justify-center gap-3 border-b border-[#B9D9DD]/35 px-4 py-5 text-left transition-colors hover:bg-[#F1F8F9] xl:px-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#087E8B] to-[#065F68] p-1.5 shadow-sm">
          <img src={logoMark} alt="SaúdeConnect+" className="h-full w-full object-contain" />
        </span>
        <strong className="truncate text-[#243746] text-lg font-bold tracking-tight xl:text-xl">SaúdeConnect+</strong>
      </button>
      <p className="mt-6 px-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9AA9B2]">Menu</p>
      <nav className="mt-3 space-y-1.5 px-3" aria-label="Navegação principal">
        {navItems.map(({ screen, label, icon: Icon }) => {
          const active = activeTab === screen;
          return <button key={screen} aria-label={label} title={label} onClick={() => onNavigate(screen)} className={`easy-nav-item relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all duration-150 ${active ? "bg-gradient-to-r from-[#DCEFF1] to-[#F1F8F9] font-semibold text-[#065F68] shadow-[inset_0_0_0_1px_rgba(8,126,139,0.14)]" : "font-medium text-[#607985] hover:bg-[#F4F9FA] hover:text-[#243746]"}`}>
            {active && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#087E8B] to-[#065F68]" />}
            <Icon size={19} className={active ? "text-[#087E8B]" : "text-[#94A3B0]"} /><span className="rotulo-nav">{label}</span>
          </button>;
        })}
      </nav>
      {onTrocarPerfil && <div className="mt-auto border-t border-[#B9D9DD]/35 p-3">
        <button type="button" onClick={onTrocarPerfil} className="easy-nav-item flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#607985] hover:bg-[#F4F9FA] hover:text-[#243746]">
          <Repeat size={19} className="text-[#94A3B0]" /><span className="rotulo-nav">Trocar perfil ({role === "secretaria" ? "Secretaria" : "Paciente"})</span>
        </button>
      </div>}
    </aside>
  );
}
