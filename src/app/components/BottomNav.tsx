import { Home, CalendarDays, Building2, ClipboardList, User } from "lucide-react";
import type { Screen, UserRole } from "./mockData";

interface BottomNavProps {
  activeTab: Screen;
  onNavigate: (s: Screen) => void;
  role?: UserRole;
}

const itensDoPaciente = [
  { screen: "home" as Screen, label: "Início", icon: Home },
  { screen: "agenda" as Screen, label: "Agenda", icon: CalendarDays },
  { screen: "instituicoes" as Screen, label: "Instituições", icon: Building2 },
  { screen: "perfil" as Screen, label: "Perfil", icon: User },
];

// A secretaria não tem "Início" de paciente nem atalho para marcar.
const itensDaSecretaria = [
  { screen: "gestao" as Screen, label: "Painel", icon: ClipboardList },
  { screen: "agenda" as Screen, label: "Agenda", icon: CalendarDays },
  { screen: "instituicoes" as Screen, label: "Instituições", icon: Building2 },
  { screen: "perfil" as Screen, label: "Perfil", icon: User },
];

export function BottomNav({ activeTab, onNavigate, role = "usuario" }: BottomNavProps) {
  const items = role === "secretaria" ? itensDaSecretaria : itensDoPaciente;
  return (
    <div className="easy-bottom-nav fixed bottom-0 left-0 right-0 z-50 flex items-center border-t border-[#B9D9DD]/40 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-2px_16px_rgba(36,55,70,0.08)] backdrop-blur lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.screen;
        return (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className="easy-nav-item flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2"
          >
            <span className={`grid h-8 w-14 place-items-center rounded-full transition-colors ${isActive ? "bg-[#DCEFF1]" : "bg-transparent"}`}>
              <Icon
                size={21}
                color={isActive ? "#087E8B" : "#607985"}
                strokeWidth={isActive ? 2.4 : 2}
              />
            </span>
            <span
              className="rotulo-nav max-w-full text-center text-[11px] leading-tight"
              style={{
                color: isActive ? "#087E8B" : "#607985",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
