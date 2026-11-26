import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { examInfo, instituicoes, mockAgendamentos, profissionais, type Agendamento, type AgendamentoTipo, type Screen, type User } from "./mockData";
import { AppButton } from "./ui/AppButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { BookingProgress, type BookingHeaderCrumb } from "../features/agendamento/BookingProgress.tsx";
import { BookingSummary } from "../features/agendamento/BookingSummary";
import { ContactConfirmSheet } from "../features/agendamento/ContactConfirmSheet";
import { getNetworkServices, getUnitServices } from "../features/agendamento/bookingOptions";
import { canEnterStep, createBookingDraft, getPreviousStep, updateLocation, updateSchedule, updateService, updateUnit, type BookingDraft, type BookingLocation, type BookingSchedule, type BookingStep } from "../features/agendamento/bookingFlow";
import { BookingLocationStep, type LocationMode } from "../features/agendamento/steps/BookingLocationStep";
import { BookingServiceStep } from "../features/agendamento/steps/BookingServiceStep";
import { BookingUnitStep } from "../features/agendamento/steps/BookingUnitStep";
import { BookingScheduleStep } from "../features/agendamento/steps/BookingScheduleStep";
import { BookingConfirmationStep } from "../features/agendamento/steps/BookingConfirmationStep";
import { isSlotDisponivel } from "../features/agendamento/slotCheck.ts";
import { registrarAceite } from "../features/agendamento/termos.ts";

interface TelaAgendarProps {
  onNavigate: (screen: Screen) => void;
  onConfirmar: (agendamento: Omit<Agendamento, "id" | "usuarioId">) => void;
  agendamentos?: Agendamento[];
  preInstId?: string | null;
  preTipo?: AgendamentoTipo | null;
  user?: User | null;
  modoFacil?: boolean;
}

interface PendingReset {
  message: string;
  apply: () => void;
}

export function TelaAgendar({ onNavigate, onConfirmar, agendamentos = mockAgendamentos, preInstId, preTipo, user, modoFacil = false }: TelaAgendarProps) {
  const [draft, setDraft] = useState<BookingDraft>(() => ({ ...createBookingDraft(), tipo: preTipo ?? null, preInstId: preInstId ?? null }));
  const [step, setStep] = useState<BookingStep>("localizacao");
  const [locationMode, setLocationMode] = useState<LocationMode>("opcoes");
  const [uf, setUf] = useState(user?.endereco.estado ?? "SP");
  const [contactOpen, setContactOpen] = useState(Boolean(user));
  const [pendingReset, setPendingReset] = useState<PendingReset | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [slotIndisponivel, setSlotIndisponivel] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const resetTriggerRef = useRef<HTMLElement | null>(null);
  const bookingMainRef = useRef<HTMLElement | null>(null);
  const institution = instituicoes.find((item) => item.id === draft.instituicaoId);
  const professional = profissionais.find((item) => item.id === draft.profissionalId);
  const preselected = instituicoes.find((item) => item.id === preInstId);
  const bookableServices = preselected ? getUnitServices(preselected, profissionais) : getNetworkServices(instituicoes, profissionais);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [step, locationMode]);

  function requestReset(message: string, apply: () => void, losesSelection: boolean) {
    if (losesSelection) {
      resetTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPendingReset({ message, apply });
    }
    else apply();
  }

  function goTo(target: BookingStep) {
    if (target === "localizacao") setLocationMode("opcoes");
    setStep(target);
  }

  function chooseLocation(location: BookingLocation) {
    const changed = location.cidade !== draft.cidade || (location.estado ?? "") !== (draft.estado ?? "")
      || (location.latitude ?? null) !== (draft.latitude ?? null) || (location.longitude ?? null) !== (draft.longitude ?? null);
    const apply = () => {
      setDraft(changed ? updateLocation(draft, location) : draft);
      setLocationMode("opcoes");
      setStep("servico");
    };
    requestReset("Alterar a localização vai limpar a unidade e o horário escolhidos. Deseja continuar?", apply, changed && Boolean(draft.instituicaoId || draft.data || draft.horario));
  }

  function chooseService(tipo: AgendamentoTipo, service: string) {
    const changed = tipo !== draft.tipo || service !== draft.service;
    const apply = () => {
      setDraft(changed ? updateService({ ...draft, tipo }, service) : draft);
      setStep("unidade");
    };
    requestReset("Alterar o atendimento vai limpar a unidade e o horário escolhidos. Deseja continuar?", apply, changed && Boolean(draft.instituicaoId || draft.data || draft.horario));
  }

  function chooseUnit(institutionId: string) {
    const changed = institutionId !== draft.instituicaoId;
    const apply = () => {
      setDraft(changed ? updateUnit(draft, institutionId) : draft);
      setStep("agenda");
    };
    requestReset("Alterar a unidade vai limpar o profissional e horário escolhidos. Deseja continuar?", apply, changed && Boolean(draft.profissionalId || draft.data || draft.horario));
  }

  function chooseSchedule(schedule: BookingSchedule) {
    setSlotIndisponivel(false);
    setDraft(updateSchedule(draft, schedule));
    setStep("confirmar");
  }

  function exit() {
    onNavigate(preInstId ? "detalhes" : "home");
  }

  function goBack() {
    if (step !== "localizacao") setStep(getPreviousStep(step));
    else if (locationMode === "cidade") setLocationMode("estado");
    else if (locationMode === "estado") setLocationMode("opcoes");
    else exit();
  }

  function confirm() {
    if (step !== "confirmar" || !canEnterStep(draft, "confirmar") || !draft.tipo || !institution) return;
    // O horário é conferido de novo aqui: entre escolher e confirmar, ele pode ter
    // sido tomado por outra pessoa ou simplesmente ter passado.
    const livre = isSlotDisponivel({
      tipo: draft.tipo,
      instituicaoId: draft.instituicaoId,
      profissionalId: draft.tipo === "consulta" ? draft.profissionalId : undefined,
      data: draft.data,
      horario: draft.horario,
    }, agendamentos);
    if (!livre) {
      setSlotIndisponivel(true);
      setStep("agenda");
      return;
    }
    setEnviando(true);
    onConfirmar({
      tipo: draft.tipo,
      instituicaoId: draft.instituicaoId,
      profissionalId: draft.tipo === "consulta" ? draft.profissionalId : undefined,
      especialidade: draft.tipo === "consulta" ? draft.service : undefined,
      tipoExame: draft.tipo === "exame" ? draft.service : undefined,
      data: draft.data,
      horario: draft.horario,
      status: "pendente",
      observacoes: draft.tipo === "exame" ? examInfo[draft.service]?.preparo : undefined,
      termos: registrarAceite(),
    });
    setConfirmed(true);
  }

  if (confirmed) return <div className="flex min-h-full items-center justify-center px-5 pb-24 pt-10 lg:pb-8"><section className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm"><CheckCircle2 size={52} className="mx-auto text-[#087E8B]"/><h1 className="mt-4 text-2xl font-bold text-[#243746]">Pedido enviado</h1><p className="mt-2 text-[#607985]">Seu horário foi reservado e aguarda a confirmação da instituição.</p><AppButton size="lg" fullWidth onClick={() => onNavigate("agenda")} className="mt-6">Ver minha agenda</AppButton></section></div>;

  const header: { title?: string; crumbs?: BookingHeaderCrumb[] } = step !== "localizacao" || locationMode === "opcoes" ? {}
    : locationMode === "estado" ? { title: "Selecione o estado", crumbs: [{ label: "Estado" }] }
    : { title: "Selecione a região/cidade", crumbs: [{ label: "Estado", onClick: () => setLocationMode("estado") }, { label: "Cidade" }] };

  const summary = <BookingSummary draft={draft} user={user} institution={step === "confirmar" || step === "agenda" ? institution : undefined} professional={step === "confirmar" ? professional : undefined}
    onEditLocation={() => goTo("localizacao")} onEditService={() => goTo("servico")} onEditUnit={() => goTo("unidade")}/>;

  return <div className={`min-h-full bg-[#F4F9FA] pb-24 lg:bg-transparent lg:pb-8 ${modoFacil ? "modo-facil-agendamento" : ""}`}>
    <main ref={bookingMainRef} tabIndex={-1} className={`mx-auto outline-none ${modoFacil ? "max-w-4xl" : "max-w-6xl"}`}>
      {modoFacil && <p className="mx-4 mt-4 rounded-xl bg-[#DCEFF1] px-4 py-3 text-center text-sm font-medium text-[#243746] sm:mx-5">Modo Fácil: escolha uma opção por vez. Você poderá voltar e alterar qualquer etapa.</p>}
      <BookingProgress current={step} tipo={draft.tipo} onBack={goBack} onClose={exit} onGoTo={(target) => { if (canEnterStep(draft, target)) goTo(target); }} {...header}/>
      {step === "localizacao" && <BookingLocationStep mode={locationMode} uf={uf} value={draft} user={user} institutions={instituicoes} onModeChange={setLocationMode} onUfChange={setUf} onContinue={chooseLocation}/>}
      {step === "servico" && <BookingServiceStep key={`${draft.tipo ?? "none"}-${draft.service}`} tipo={draft.tipo} service={draft.service} onSelect={chooseService} limitTo={bookableServices} aside={summary}/>}
      {step === "unidade" && <BookingUnitStep draft={draft} institutions={instituicoes} professionals={profissionais} onSelect={chooseUnit} onBack={() => setStep("servico")} onEditLocation={() => goTo("localizacao")} aside={summary}/>}
      {step === "agenda" && slotIndisponivel && (
        <p role="alert" className="mx-4 mt-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C] sm:mx-5">
          Esse horário acabou de ser ocupado. Escolha outro, por favor.
        </p>
      )}
      {step === "agenda" && institution && <BookingScheduleStep draft={draft} institution={institution} professionals={profissionais} appointments={agendamentos} onSelect={chooseSchedule} onBack={() => setStep("unidade")} aside={summary}/>}
      {step === "confirmar" && institution && <BookingConfirmationStep draft={draft} institution={institution} professional={professional} user={user} onConfirm={confirm} enviando={enviando} onBack={() => setStep("agenda")}/>}
    </main>
    {user && <ContactConfirmSheet open={contactOpen} user={user} onConfirm={() => setContactOpen(false)} onEditProfile={() => onNavigate("perfil")}/>}
    <AlertDialog open={pendingReset !== null} onOpenChange={(open) => { if (!open) setPendingReset(null); }}>
      <AlertDialogContent
        className="w-full max-w-md rounded-2xl border-0 bg-white p-6 shadow-2xl sm:max-w-md"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          const trigger = resetTriggerRef.current;
          if (trigger?.isConnected) trigger.focus();
          else bookingMainRef.current?.focus();
          resetTriggerRef.current = null;
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left text-xl font-bold text-[#243746]">Alterar escolha?</AlertDialogTitle>
          <AlertDialogDescription className="text-left text-sm text-[#607985]">{pendingReset?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel asChild><AppButton variant="outline">Manter escolhas</AppButton></AlertDialogCancel>
          <AlertDialogAction asChild><AppButton onClick={() => pendingReset?.apply()}>Alterar e limpar</AppButton></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
}
