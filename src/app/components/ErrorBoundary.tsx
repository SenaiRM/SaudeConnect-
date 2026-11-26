import { Component, type ReactNode } from "react";
import { DEMO_STATE_KEY } from "../features/demo/demoState";

/** Troca a página em branco por uma tela de recuperação quando alguma tela quebra. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { erro: Error | null }> {
  state = { erro: null as Error | null };

  static getDerivedStateFromError(erro: Error) {
    return { erro };
  }

  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div role="alert" className="grid min-h-screen place-items-center bg-[#F4F9FA] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg">
          <h1 className="text-lg font-bold text-[#243746]">Algo deu errado nesta tela</h1>
          <p className="mt-2 text-sm text-[#607985]">Seus dados continuam salvos. Recarregue a página para continuar.</p>
          <p className="mt-3 break-words rounded-lg bg-[#F4F9FA] px-3 py-2 text-left font-mono text-xs text-[#607985]">{this.state.erro.message}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => window.location.reload()} className="min-h-11 flex-1 rounded-xl bg-[#087E8B] px-4 text-sm font-semibold text-white hover:bg-[#065F68]">Recarregar</button>
            <button type="button" onClick={() => { try { localStorage.removeItem(DEMO_STATE_KEY); } catch { /* sem armazenamento */ } window.location.reload(); }} className="min-h-11 flex-1 rounded-xl border border-[#B9D9DD] px-4 text-sm font-semibold text-[#087E8B] hover:bg-[#DCEFF1]">Restaurar demonstração</button>
          </div>
        </div>
      </div>
    );
  }
}
