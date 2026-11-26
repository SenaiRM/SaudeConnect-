import { useState } from "react";
import { CalendarDays, Clock, Info, Map as MapIcon, MapPin, Phone, UserRound } from "lucide-react";
import { examInfo, formatDate, type Instituicao, type Profissional, type User } from "../../../components/mockData";
import { AppButton } from "../../../components/ui/AppButton";
import type { BookingDraft } from "../bookingTypes";
import { mapsDirectionsUrl, mapsEmbedUrl } from "../maps";
import { AceiteTermos } from "../AceiteTermos";
import { podeConfirmar } from "../termos.ts";

interface BookingConfirmationStepProps {
  draft: BookingDraft;
  institution: Instituicao;
  professional?: Profissional;
  user?: User | null;
  onConfirm: () => void;
  enviando?: boolean;
  onBack: () => void;
}

export function BookingConfirmationStep({ draft, institution, professional, user, onConfirm, onBack , enviando = false }: BookingConfirmationStepProps) {
  const [aceitou, setAceitou] = useState(false);
  const isExam = draft.tipo === "exame";
  const preparation = isExam ? examInfo[draft.service]?.preparo : undefined;

  return <div className="px-4 pb-4 pt-5 sm:px-6 lg:px-0">
    <section aria-labelledby="booking-review-title" className="mx-auto max-w-xl rounded-2xl border border-[#DCEFF1] bg-white p-5 shadow-sm sm:p-6">
      <h2 id="booking-review-title" className="sr-only">Revise seu agendamento</h2>
      {user && <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#DCEFF1] text-[#087E8B]"><UserRound size={20} aria-hidden="true"/></span>
        <div className="min-w-0"><p className="font-semibold text-[#243746]">{user.nome}</p><p className="text-sm text-[#607985]">Paciente SaúdeConnect+</p></div>
      </div>}

      <div className={`space-y-4 border-l-4 border-[#087E8B] pl-4 ${user ? "mt-5" : ""}`}>
        <div>
          <p className="font-semibold text-[#243746]">{isExam ? draft.service : professional?.nome}</p>
          <p className="text-sm text-[#607985]">{isExam ? "Exame" : draft.service}</p>
        </div>
        <div>
          <p className="font-semibold text-[#243746]">{institution.nome}</p>
          <p className="text-sm text-[#607985]">{isExam ? "Exame presencial" : "Consulta presencial"}</p>
        </div>
        <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#243746]">
          <span className="inline-flex items-center gap-2"><CalendarDays size={17} className="text-[#087E8B]" aria-hidden="true"/>{formatDate(draft.data)}</span>
          <span className="inline-flex items-center gap-2"><Clock size={17} className="text-[#087E8B]" aria-hidden="true"/>{draft.horario}</span>
        </p>
      </div>

      {preparation && <p className="mt-5 flex items-start gap-2 rounded-xl bg-[#FFF7ED] px-4 py-3 text-sm text-[#9A3412]"><Info size={18} className="mt-0.5 shrink-0" aria-hidden="true"/><span><strong className="block">Preparo do exame</strong>{preparation}</span></p>}

      <h3 className="mt-6 text-sm font-medium text-[#607985]">Endereço</h3>
      <p className="mt-2 flex items-start gap-2 text-sm text-[#243746]"><MapPin size={18} className="mt-0.5 shrink-0 text-[#087E8B]" aria-hidden="true"/>{institution.endereco}</p>
      <p className="mt-1 flex items-center gap-2 pl-[26px] text-sm text-[#607985]"><Phone size={14} aria-hidden="true"/>{institution.telefone}</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-[#DCEFF1] bg-[#F4F9FA]">
        <iframe title={`Mapa: ${institution.nome}`} src={mapsEmbedUrl(institution)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block h-48 w-full border-0"/>
      </div>
      <a href={mapsDirectionsUrl(institution)} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#087E8B]/45 px-4 text-sm font-semibold text-[#087E8B] hover:bg-[#DCEFF1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]">Ver como chegar<MapIcon size={17} aria-hidden="true"/><span className="sr-only"> (abre em nova aba)</span></a>

      {/* O aceite fica no mesmo quadro do resumo: a pessoa confirma o que acabou de revisar. */}
      <div className="mt-6">
        <AceiteTermos
          checked={aceitou}
          onChange={setAceitou}
          declaracao="Confirmo que as informações deste agendamento estão corretas e declaro que li e aceito os Termos de Atendimento."
        />
      </div>
    </section>

    <div className="mx-auto mt-5 flex max-w-xl flex-wrap justify-end gap-3">
      <AppButton variant="outline" className="rounded-full px-6" onClick={onBack}>Voltar</AppButton>
      <AppButton
        size="lg"
        className="rounded-full px-6"
        disabled={!podeConfirmar(aceitou)}
        loading={enviando}
        loadingLabel="Enviando pedido…"
        title={podeConfirmar(aceitou) ? undefined : "Marque a confirmação final para continuar"}
        onClick={onConfirm}
      >
        Confirmar agendamento
      </AppButton>
    </div>
  </div>;
}
