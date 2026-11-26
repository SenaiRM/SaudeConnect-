import { useState } from "react";
import { ChevronLeft, Bell, BellOff, Check } from "lucide-react";
import type { Notificacao, Screen } from "./mockData";
import { DashboardPageHeader } from "./dashboard/DashboardPageHeader";

interface TelaNotificacoesProps {
  notificacoes: Notificacao[];
  onNavigate: (s: Screen) => void;
  onMarcarLida: (id: string) => void;
  onMarcarTodasLidas: () => void;
}

function formatNotifDate(dateStr: string): string {
  const d = new Date(dateStr);
  const hoje = new Date();
  const diff = hoje.getTime() - d.getTime();
  const minutos = Math.floor(diff / 60000);
  if (minutos < 60) return `${minutos} min atrás`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas}h atrás`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

const tipoConfig = {
  lembrete: { bg: "#FEF9C3", border: "#FDE68A", icon: "🔔", color: "#92400E" },
  confirmacao: { bg: "#DCFCE7", border: "#BBF7D0", icon: "✅", color: "#166534" },
  cancelamento: { bg: "#FEE2E2", border: "#FECACA", icon: "❌", color: "#991B1B" },
  info: { bg: "#DBEAFE", border: "#BFDBFE", icon: "ℹ️", color: "#1E40AF" },
};

export function TelaNotificacoes({ notificacoes, onNavigate, onMarcarLida, onMarcarTodasLidas }: TelaNotificacoesProps) {
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="flex min-h-full flex-col bg-[#F4F9FA] px-4 pb-24 pt-5 sm:px-5 lg:p-0">
      <DashboardPageHeader eyebrow="Central de avisos" title="Notificações" description={naoLidas > 0 ? `${naoLidas} aviso${naoLidas === 1 ? "" : "s"} ainda não lido${naoLidas === 1 ? "" : "s"}.` : "Você está em dia com seus avisos."} action={<div className="flex gap-2"><button onClick={() => onNavigate("home")} className="grid h-10 w-10 place-items-center rounded-xl border border-[#B9D9DD]/55 bg-white text-[#087E8B]"><ChevronLeft size={19}/></button>{naoLidas > 0 && <button onClick={onMarcarTodasLidas} className="flex items-center gap-2 rounded-xl bg-[#087E8B] px-4 py-2 text-sm font-semibold text-white"><Check size={15}/>Marcar todas</button>}</div>} />

      {/* Content */}
      <div className="flex-1 pt-5 lg:pt-6">
        {notificacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#DCEFF1] flex items-center justify-center mb-4">
              <BellOff size={28} color="#B9D9DD" />
            </div>
            <p className="text-[#243746] text-sm" style={{ fontWeight: 500 }}>Sem notificações</p>
            <p className="text-[#607985] text-xs mt-1">Você está em dia com tudo!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {notificacoes.map((n) => {
              const cfg = tipoConfig[n.tipo];
              return (
                <div
                  key={n.id}
                  onClick={() => !n.lida && onMarcarLida(n.id)}
                  className="rounded-2xl p-4 cursor-pointer active:opacity-80 transition-all"
                  style={{
                    background: n.lida ? "white" : cfg.bg,
                    border: `1px solid ${n.lida ? "#F4F9FA" : cfg.border}`,
                    opacity: n.lida ? 0.75 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="text-sm truncate"
                          style={{
                            color: n.lida ? "#243746" : cfg.color,
                            fontWeight: n.lida ? 400 : 600,
                          }}
                        >
                          {n.titulo}
                        </p>
                        {!n.lida && (
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#087E8B" }} />
                        )}
                      </div>
                      <p className="text-[#243746] text-xs mt-0.5 leading-relaxed">{n.mensagem}</p>
                      <p className="text-[#607985] text-xs mt-1.5">{formatNotifDate(n.data)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
