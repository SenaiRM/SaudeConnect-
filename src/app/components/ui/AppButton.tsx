import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  /** Mostra "carregando" e impede um segundo clique enquanto a ação acontece. */
  loading?: boolean;
  /** Texto exibido no lugar do rótulo enquanto carrega. */
  loadingLabel?: string;
  children?: ReactNode;
}

/**
 * Botão padrão do SaúdeConnect+.
 * Mantém a paleta atual (teal #087E8B → #065F68, navy #243746) e a tipografia
 * do tema — só unifica formato, estados (hover/active/focus/disabled) e garante
 * alvo de toque de 44px no mobile.
 */
const base =
  "inline-flex min-w-0 select-none items-center justify-center gap-2 whitespace-normal rounded-xl font-semibold leading-none tracking-tight text-center " +
  "transition-all duration-150 active:scale-[0.98] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E8B]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-[#087E8B] to-[#065F68] text-white shadow-[0_1px_2px_rgba(36,55,70,0.08),0_8px_18px_-10px_rgba(8,126,139,0.65)] hover:shadow-[0_2px_4px_rgba(36,55,70,0.1),0_12px_24px_-10px_rgba(8,126,139,0.7)] hover:brightness-[1.04]",
  secondary:
    "border border-[#B9D9DD] bg-white text-[#243746] shadow-[0_1px_2px_rgba(36,55,70,0.04)] hover:border-[#087E8B] hover:bg-[#F1F8F9]",
  outline:
    "border border-[#087E8B]/40 bg-white text-[#087E8B] shadow-[0_1px_2px_rgba(36,55,70,0.04)] hover:border-[#087E8B] hover:bg-[#DCEFF1]",
  ghost: "text-[#087E8B] hover:bg-[#DCEFF1]",
  danger:
    "border border-[#FECACA] bg-white text-[#DC2626] hover:bg-[#FEF2F2]",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm",
};

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, loading = false, loadingLabel, className = "", type = "button", disabled, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`easy-button ${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <>
            <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
            {loadingLabel ?? "Carregando…"}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

AppButton.displayName = "AppButton";
