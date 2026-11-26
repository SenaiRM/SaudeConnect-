import { Mail, Smartphone } from "lucide-react";
import type { User } from "../../components/mockData";
import { AppButton } from "../../components/ui/AppButton";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../components/ui/sheet";

interface ContactConfirmSheetProps {
  open: boolean;
  user: User;
  onConfirm: () => void;
  onEditProfile: () => void;
}

/** Antes de agendar, a pessoa confere o telefone e o e-mail usados para os avisos do agendamento. */
export function ContactConfirmSheet({ open, user, onConfirm, onEditProfile }: ContactConfirmSheetProps) {
  return <Sheet open={open} onOpenChange={(next) => { if (!next) onConfirm(); }}>
    <SheetContent side="right" className="w-full gap-0 bg-white sm:max-w-md">
      <SheetHeader className="border-b border-[#DCEFF1] p-5 pr-12">
        <SheetTitle className="text-lg text-[#243746]">Confirme seus dados de contato para o agendamento</SheetTitle>
        <SheetDescription className="text-[#607985]">Certifique-se de que os dados abaixo estão atualizados. Vamos usá-los para os avisos do seu agendamento.</SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="rounded-xl border border-[#DCEFF1] p-4">
          <p className="font-semibold text-[#243746]">{user.nome}</p>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-[#607985]">Paciente SaúdeConnect+</p>
          <span className="mt-2 inline-block rounded-full bg-[#DCEFF1] px-2.5 py-0.5 text-xs font-medium text-[#065F68]">Saúde</span>
        </div>
        <dl className="mt-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DCEFF1] text-[#087E8B]" aria-hidden="true"><Smartphone size={18}/></span>
            <div><dt className="font-semibold text-[#243746]">Celular</dt><dd className="text-sm text-[#607985]">{user.telefone}</dd></div>
          </div>
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DCEFF1] text-[#087E8B]" aria-hidden="true"><Mail size={18}/></span>
            <div className="min-w-0"><dt className="font-semibold text-[#243746]">E-mail</dt><dd className="break-all text-sm text-[#607985]">{user.email}</dd></div>
          </div>
        </dl>
      </div>
      <SheetFooter className="flex-row gap-3 border-t border-[#DCEFF1] p-5">
        <AppButton variant="outline" className="flex-1 rounded-full" onClick={onEditProfile}>Alterar dados pessoais</AppButton>
        <AppButton className="flex-1 rounded-full" onClick={onConfirm}>Confirmar e continuar</AppButton>
      </SheetFooter>
    </SheetContent>
  </Sheet>;
}
