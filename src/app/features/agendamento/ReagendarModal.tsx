import { useMemo, useState } from "react";
import { CalendarDays, Clock, X } from "lucide-react";
import {
  formatDataChip,
  formatDate,
  getInstituicaoNome,
  profissionais,
  type Agendamento,
} from "../../components/mockData";
import { gerarDisponibilidade } from "./availability";
import { AppButton } from "../../components/ui/AppButton";
import { AceiteTermos } from "./AceiteTermos";
import { podeConfirmar } from "./termos.ts";

interface ReagendarModalProps {
  agendamento: Agendamento;
  agendamentos: Agendamento[];
  onClose: () => void;
  onConfirm: (data: string, horario: string) => void;
}

export function ReagendarModal({ agendamento, agendamentos, onClose, onConfirm }: ReagendarModalProps) {
  const [aceitou, setAceitou] = useState(false);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  const titulo = agendamento.tipo === "consulta" ? agendamento.especialidade : agendamento.tipoExame;

  // Consulta a disponibilidade REAL: nos dias em que o profissional atende (consulta)
  // ou dias úteis do laboratório (exame), já descontando horários ocupados e o próprio
  // agendamento que está sendo remarcado.
  const slots = useMemo(() => {
    const profissional = profissionais.find((p) => p.id === agendamento.profissionalId);
    return gerarDisponibilidade({
      tipo: agendamento.tipo,
      instituicaoId: agendamento.instituicaoId,
      profissionalId: agendamento.profissionalId,
      diasDisponiveis: profissional?.diasDisponiveis,
      agendamentos: agendamentos.filter((a) => a.id !== agendamento.id),
    });
  }, [agendamento, agendamentos]);

  const diaSelecionado = slots.find((s) => s.data === data);

  return (
    <div onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#243746]/35 p-2 sm:p-4">
      <section role="dialog" aria-modal="true" aria-label="Reagendar atendimento" className="max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#087E8B]">Reagendar</p>
            <h2 className="mt-1 text-xl font-bold text-[#243746]">{titulo}</h2>
            <p className="mt-1 text-sm text-[#607985]">{getInstituicaoNome(agendamento.instituicaoId)}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl text-[#607985] hover:bg-[#F4F9FA]" aria-label="Fechar"><X size={19} /></button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F4F9FA] px-4 py-3 text-sm text-[#607985]">
          <CalendarDays size={16} className="text-[#087E8B]" />
          <span>Atual: <strong className="text-[#243746]">{formatDate(agendamento.data)} às {agendamento.horario}</strong></span>
        </div>

        <p className="mt-3 rounded-xl border border-[#BBF7D0] bg-[#DCFCE7] px-4 py-3 text-xs leading-5 text-[#166534]">
          Escolha um dos horários disponíveis. Ao confirmar, sua agenda será atualizada imediatamente.
        </p>

        {slots.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[#B9D9DD] bg-white p-6 text-center">
            <CalendarDays size={28} className="mx-auto text-[#B9D9DD]" />
            <p className="mt-2 text-sm font-semibold text-[#243746]">Sem horários livres para reagendar</p>
            <p className="mt-1 text-xs text-[#607985]">Tente novamente mais tarde.</p>
          </div>
        ) : (
          <>
            <h3 className="mt-5 text-sm font-semibold text-[#243746]">Escolha a nova data</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s.data}
                  type="button"
                  onClick={() => { setData(s.data); setHorario(""); }}
                  className={`inline-flex min-h-10 items-center rounded-xl border px-3.5 py-2 text-sm transition-colors active:scale-[0.98] ${data === s.data ? "border-[#087E8B] bg-[#087E8B] text-white" : "border-[#B9D9DD] text-[#243746] hover:border-[#087E8B] hover:bg-[#F4F9FA]"}`}
                >
                  {formatDataChip(s.data)}
                </button>
              ))}
            </div>

            {diaSelecionado && (
              <>
                <h3 className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[#243746]"><Clock size={15} className="text-[#087E8B]" />Novo horário</h3>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {diaSelecionado.horarios.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHorario(h)}
                      className={`min-h-10 rounded-xl border py-2 text-sm transition-colors active:scale-[0.98] ${horario === h ? "border-[#087E8B] bg-[#087E8B] text-white" : "border-[#B9D9DD] text-[#243746] hover:border-[#087E8B] hover:bg-[#F4F9FA]"}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {data && horario && (
          <div className="mt-5">
            <AceiteTermos
              checked={aceitou}
              onChange={setAceitou}
              declaracao="Solicito a alteração deste atendimento para o novo horário selecionado e declaro que li e aceito os Termos de Atendimento."
            />
          </div>
        )}

        <AppButton
          size="lg"
          fullWidth
          disabled={!data || !horario || !podeConfirmar(aceitou)}
          onClick={() => onConfirm(data, horario)}
          className="mt-6"
        >
          Confirmar novo horário
        </AppButton>
      </section>
    </div>
  );
}
