import { ChevronLeft, MapPin, Phone, Clock, Stethoscope, FlaskConical, Building2, Hospital, Star, User } from "lucide-react";
import type { Screen } from "./mockData";
import { instituicoes, profissionais } from "./mockData";
import { AppButton } from "./ui/AppButton";

interface TelaDetalhesInstituicaoProps {
  instId: string;
  onBack: () => void;
  onAgendar: (instId: string) => void;
  modoFacil?: boolean;
}

function tipoIcon(tipo: string) {
  if (tipo === "hospital") return <Hospital size={22} color="#087E8B" />;
  if (tipo === "laboratorio") return <FlaskConical size={22} color="#087E8B" />;
  return <Building2 size={22} color="#087E8B" />;
}

function tipoLabel(tipo: string) {
  if (tipo === "hospital") return "Hospital";
  if (tipo === "laboratorio") return "Laboratório";
  return "Clínica";
}

export function TelaDetalhesInstituicao({ instId, onBack, onAgendar , modoFacil = false }: TelaDetalhesInstituicaoProps) {
  const inst = instituicoes.find((i) => i.id === instId);
  const profs = profissionais.filter((p) => p.instituicaoId === instId && p.disponivel);

  if (!inst) {
    return (
      <div className="flex flex-col h-full bg-[#F4F9FA] items-center justify-center px-6">
        <p className="text-[#243746] text-sm">Não foi possível carregar as informações. Tente novamente.</p>
        <AppButton variant="ghost" onClick={onBack} className="mt-4">Voltar</AppButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F4F9FA]">
      {/* Header */}
      <div className="px-5 pt-5 pb-5 sm:px-6 lg:rounded-2xl lg:px-8 lg:pt-7 lg:pb-7 bg-gradient-to-br from-[#087E8B] to-[#065F68]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
          >
            <ChevronLeft size={20} color="white" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-lg leading-tight lg:text-2xl font-bold">{inst.nome}</h2>
            <p className="text-white/70 text-xs">{tipoLabel(inst.tipo)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            {tipoIcon(inst.tipo)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={13} color="#FCD34D" fill="#FCD34D" />
              <span className="text-white text-sm font-bold">{inst.avaliacao}</span>
              <span className="text-white/60 text-xs">/ 5.0</span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${inst.ativo ? "bg-white/20 text-white ring-1 ring-inset ring-white/30" : "bg-[#DC2626]/25 text-white ring-1 ring-inset ring-white/25"}`}
            >
              <><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${inst.ativo ? "bg-[#86EFAC]" : "bg-[#FCA5A5]"}`} />{inst.ativo ? "Aberta" : "Fechada"}</>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 sm:px-6 lg:px-0 lg:pb-8"><div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:[&>*]:mb-0">

        {/* Info block */}
        <div className="rounded-[var(--raio-cartao)] border border-[#B9D9DD]/50 bg-white shadow-[var(--sombra-cartao)] mb-4">
          <div className="px-4 pt-4 pb-1">
            <p className="text-[#243746] text-xs mb-3 font-bold uppercase tracking-[0.1em]">
              Informações
            </p>
          </div>
          {[
            { icon: MapPin, label: "Endereço", val: inst.endereco },
            { icon: Phone, label: "Telefone", val: inst.telefone },
            { icon: Clock, label: "Horário", val: inst.horarioFuncionamento },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-start gap-3 px-4 pb-3.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#F4F9FA]">
                <Icon size={15} color="#087E8B" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#607985] text-xs">{label}</p>
                <p className="text-[#243746] text-sm leading-relaxed">{val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Specialties (clinics/hospitals) */}
        {inst.especialidades.length > 0 && (
          <div className="rounded-[var(--raio-cartao)] border border-[#B9D9DD]/50 bg-white shadow-[var(--sombra-cartao)] mb-4 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope size={16} color="#087E8B" />
              <p className="text-[#243746] text-xs font-bold uppercase tracking-[0.1em]">
                Especialidades
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {inst.especialidades.map((esp) => (
                <span key={esp} className="px-3 py-1.5 rounded-xl text-xs border bg-[#F4F9FA] text-[#243746] border-[#B9D9DD]/50">
                  {esp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Exams (labs) */}
        {inst.examesOferecidos && inst.examesOferecidos.length > 0 && (
          <div className="rounded-[var(--raio-cartao)] border border-[#B9D9DD]/50 bg-white shadow-[var(--sombra-cartao)] mb-4 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical size={16} color="#087E8B" />
              <p className="text-[#243746] text-xs font-bold uppercase tracking-[0.1em]">
                Exames disponíveis
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {inst.examesOferecidos.map((ex) => (
                <span key={ex} className="px-3 py-1.5 rounded-xl text-xs border bg-[#F4F9FA] text-[#243746] border-[#B9D9DD]/50">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Professionals */}
        {profs.length > 0 && (
          <div className="mb-4">
            <p className="text-[#243746] text-xs mb-3 font-bold uppercase tracking-[0.1em]">
              Profissionais disponíveis
            </p>
            <div className="flex flex-col gap-2.5">
              {profs.map((prof) => (
                <div key={prof.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm bg-gradient-to-br from-[#087E8B] to-[#065F68] font-bold"
                  >
                    {prof.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#243746] text-sm font-semibold">{prof.nome}</p>
                    <p className="text-[#087E8B] text-xs">{prof.especialidade}</p>
                    <p className="text-[#607985] text-[11px] mt-0.5">
                      {prof.diasDisponiveis.slice(0, 3).join(", ")}{prof.diasDisponiveis.length > 3 ? "..." : ""}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Fixed bottom CTA */}
      {inst.ativo && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#DCEFF1] px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:static lg:mt-5 lg:rounded-2xl lg:border lg:px-6 lg:shadow-sm">
          <AppButton size="lg" fullWidth onClick={() => onAgendar(inst.id)} className="shadow-md">Agendar nesta instituição</AppButton>
        </div>
      )}
    </div>
  );
}
