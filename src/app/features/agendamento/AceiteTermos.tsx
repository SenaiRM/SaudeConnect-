import { useId, useState } from "react";
import { Check, FileText, ShieldCheck } from "lucide-react";
import { TERMOS_TEXTO } from "./termos.ts";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";

interface AceiteTermosProps {
  checked: boolean;
  onChange: (aceito: boolean) => void;
  /** Frase da declaração; muda entre marcar e reagendar. */
  declaracao: string;
}

/**
 * Subconfirmação: o paciente declara, por vontade própria, que confirma o
 * atendimento e concorda com os termos — e pode ler o texto antes de marcar.
 *
 * A caixa de seleção nativa fica escondida (mas presente, para teclado e
 * leitores de tela) e o quadrado visível é desenhado, para acompanhar a
 * tipografia do app em vez do estilo do sistema operacional.
 */
export function AceiteTermos({ checked, onChange, declaracao }: AceiteTermosProps) {
  const [lendo, setLendo] = useState(false);
  const id = useId();

  return (
    <section className="easy-card overflow-hidden rounded-[var(--raio-cartao)] border border-[#B9D9DD]/60 bg-white shadow-[var(--sombra-cartao)]">
      <header className="flex items-center gap-2.5 border-b border-[#B9D9DD]/40 bg-[#F1F8F9] px-4 py-3 sm:px-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#087E8B] ring-1 ring-inset ring-[#B9D9DD]/60">
          <ShieldCheck size={17} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-[#243746]">Termo de aceite</h2>
          <p className="text-xs text-[#607985]">Marque a declaração abaixo para concluir a solicitação.</p>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-5">
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border-2 border-[#B9D9DD] bg-white text-white transition-colors peer-checked:border-[#087E8B] peer-checked:bg-[#087E8B] peer-focus-visible:ring-2 peer-focus-visible:ring-[#087E8B]/45 peer-focus-visible:ring-offset-2"
          >
            <Check size={13} strokeWidth={3.5} className={checked ? "opacity-100" : "opacity-0"} />
          </span>
          <span className="text-[13px] leading-6 text-[#243746] sm:text-sm">{declaracao}</span>
        </label>

        <div className="mt-4 border-t border-[#B9D9DD]/35 pt-3">
          <button
            type="button"
            onClick={() => setLendo(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-1 py-0.5 text-[13px] font-semibold text-[#087E8B] transition-colors hover:text-[#065F68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]/45"
          >
            <FileText size={15} aria-hidden="true" />
            Ler os termos de atendimento
          </button>
        </div>
      </div>

      <AlertDialog open={lendo} onOpenChange={setLendo}>
        <AlertDialogContent className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border-0 bg-white p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left text-lg font-bold tracking-tight text-[#243746]">Termos de atendimento</AlertDialogTitle>
            <AlertDialogDescription className="text-left text-sm text-[#607985]">
              Ao confirmar, você declara estar de acordo com os pontos abaixo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ol className="mt-3 space-y-3 text-[13px] leading-6 text-[#243746]">
            {TERMOS_TEXTO.map((clausula, indice) => (
              <li key={clausula} className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#DCEFF1] text-[11px] font-bold text-[#065F68]">{indice + 1}</span>
                <span>{clausula}</span>
              </li>
            ))}
          </ol>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction className="rounded-full bg-[#087E8B] px-6 text-white hover:bg-[#065F68]">Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
