import type { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

// No celular o título e a ação ficam em linhas separadas, para o título não espremer.
export function SectionCard({ title, description, action, children, className = "" }: SectionCardProps) {
  return (
    <section
      className={`easy-card rounded-[var(--raio-cartao)] border border-[#B9D9DD]/50 bg-white p-4 shadow-[var(--sombra-cartao)] sm:p-5 ${className}`}
    >
      {(title || description || action) && (
        <div className="mb-4 flex flex-col items-start gap-2 border-b border-[#B9D9DD]/35 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold tracking-tight text-[#243746] sm:text-base">{title}</h2>}
            {description && <p className="mt-0.5 text-sm leading-snug text-[#607985]">{description}</p>}
          </div>
          {action && <div className="w-full sm:w-auto sm:shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
