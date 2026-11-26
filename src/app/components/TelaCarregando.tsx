import { LoaderCircle } from "lucide-react";

interface TelaCarregandoProps {
  titulo?: string;
  descricao?: string;
}

/** Tela de carregamento usada entre trocas de contexto (entrar, abrir a área). */
export function TelaCarregando({ titulo = "Carregando…", descricao }: TelaCarregandoProps) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[100dvh] place-items-center bg-[#F4F9FA] px-6 text-center">
      <div className="mx-auto w-full max-w-xs">
        <LoaderCircle size={40} className="mx-auto animate-spin text-[#087E8B]" aria-hidden="true" />
        <p className="mt-4 text-base font-semibold text-[#243746]">{titulo}</p>
        {descricao && <p className="mt-1 text-sm text-[#607985]">{descricao}</p>}
      </div>
    </div>
  );
}
