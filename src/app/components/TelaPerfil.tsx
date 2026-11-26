import { useState } from "react";
import { Bell, ChevronRight, LogOut, User, Phone, MapPin, Lock, ShieldCheck, Check, ALargeSmall } from "lucide-react";
import type { User as UserType, Screen } from "./mockData";
import { DashboardPageHeader } from "./dashboard/DashboardPageHeader";
import { AppButton } from "./ui/AppButton";

interface TelaPerfilProps {
  user: UserType;
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
  onUpdateUser: (u: UserType) => void;
  modoFacil: boolean;
  onToggleModoFacil: () => void;
}

type Section = "dados" | "contato" | "endereco" | "senha" | "notif" | null;

export function TelaPerfil({ user, onNavigate, onLogout, onUpdateUser, modoFacil, onToggleModoFacil }: TelaPerfilProps) {
  const [editSection, setEditSection] = useState<Section>(null);
  const [formData, setFormData] = useState({ ...user });
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [notifConsulta, setNotifConsulta] = useState(true);
  const [notifExame, setNotifExame] = useState(true);
  const [notifInfo, setNotifInfo] = useState(false);
  const [senhaErro, setSenhaErro] = useState("");
  const [salvoMsg, setSalvoMsg] = useState("");

  function salvar() {
    onUpdateUser({ ...user, ...formData });
    setSalvoMsg("Alterações salvas com sucesso.");
    setEditSection(null);
    setTimeout(() => setSalvoMsg(""), 3000);
  }

  function salvarSenha() {
    setSenhaErro("");
    if (!senhaAtual) { setSenhaErro("Informe a senha atual."); return; }
    if (novaSenha.length < 6) { setSenhaErro("A nova senha deve ter mínimo 6 caracteres."); return; }
    if (novaSenha !== confirmarSenha) { setSenhaErro("As senhas não coincidem."); return; }
    setSalvoMsg("Senha alterada com sucesso.");
    setEditSection(null);
    setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha("");
    setTimeout(() => setSalvoMsg(""), 3000);
  }

  const iniciais = user.nome.split(" ").map(n => n[0]).slice(0, 2).join("");

  const sectionItems = [
    {
      key: "dados" as Section,
      icon: User,
      title: "Dados pessoais",
      desc: user.nome,
    },
    {
      key: "contato" as Section,
      icon: Phone,
      title: "Contato",
      desc: user.telefone,
    },
    {
      key: "endereco" as Section,
      icon: MapPin,
      title: "Endereço",
      desc: `${user.endereco.cidade}, ${user.endereco.estado}`,
    },
    {
      key: "senha" as Section,
      icon: Lock,
      title: "Senha",
      desc: "Alterar senha",
    },
    {
      key: "notif" as Section,
      icon: Bell,
      title: "Notificações",
      desc: "Preferências de aviso",
    },
  ];

  return (
    <div className="flex min-h-full flex-col bg-[#F4F9FA] px-4 pb-24 pt-5 sm:px-5 lg:p-0">
      <DashboardPageHeader eyebrow="Minha conta" title="Perfil" description="Gerencie seus dados, segurança e preferências." />
      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#B9D9DD]/45 bg-white p-5 shadow-sm lg:mt-6">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[#DCEFF1] text-xl font-bold text-[#087E8B]">{iniciais}</div>
        <div><p className="font-semibold text-[#243746]">{user.nome}</p><p className="text-sm text-[#607985]">{user.email}</p><span className="mt-1 inline-block rounded-full bg-[#F4F9FA] px-2.5 py-0.5 text-[10px] font-semibold text-[#087E8B]">{user.role === "secretaria" ? "Secretaria" : "Paciente"}</span></div>
      </div>

      {/* Modo Fácil (acessibilidade) */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#B9D9DD]/45 bg-white p-4 shadow-sm">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#DCEFF1] text-[#087E8B]"><ALargeSmall size={22} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#243746]">Modo Simples</p>
          <p className="text-xs text-[#607985]">Tela mais limpa, com textos e botões maiores.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={modoFacil}
          aria-label="Ativar Modo Simples"
          onClick={onToggleModoFacil}
          className="flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors"
          style={{ background: modoFacil ? "#087E8B" : "#B9D9DD" }}
        >
          <span className="h-5 w-5 rounded-full bg-white shadow transition-transform" style={{ transform: modoFacil ? "translateX(20px)" : "translateX(0)" }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 pt-5">
        {salvoMsg && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <Check size={16} color="#16A34A" />
            <p className="text-green-700 text-sm">{salvoMsg}</p>
          </div>
        )}

        {/* Admin card */}
        {user.role === "secretaria" && (
          <button
            onClick={() => onNavigate("gestao")}
            className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-[#B9D9DD]/60 bg-white p-4 text-left shadow-sm transition-colors hover:bg-[#F4F9FA]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#087E8B] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} color="white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[#243746]">Painel da unidade</p>
              <p className="text-xs text-[#607985]">Agendamentos, profissionais e disponibilidade da sua unidade</p>
            </div>
            <ChevronRight size={18} className="text-[#087E8B]" />
          </button>
        )}

        {/* Sections */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
          {sectionItems.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = editSection === item.key;
            return (
              <div key={item.key}>
                {idx > 0 && <div className="h-px bg-[#F4F9FA] mx-4" />}
                <button
                  onClick={() => setEditSection(isOpen ? null : item.key)}
                  className="w-full px-4 py-3.5 flex items-center gap-3 active:bg-[#F9F8F4] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#F4F9FA" }}>
                    <Icon size={17} color="#087E8B" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[#243746] text-sm" style={{ fontWeight: 500 }}>{item.title}</p>
                    <p className="text-[#607985] text-xs">{item.desc}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    color="#B9D9DD"
                    className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Edit forms */}
                {isOpen && (
                  <div className="px-4 pb-4 bg-[#FAFAF8]">
                    {item.key === "dados" && (
                      <div className="flex flex-col gap-3">
                        {[
                          { label: "Nome completo", field: "nome" as keyof typeof formData },
                          { label: "CPF", field: "cpf" as keyof typeof formData },
                          { label: "Data de nascimento", field: "dataNascimento" as keyof typeof formData },
                        ].map((f) => (
                          <div key={f.field}>
                            <label className="text-xs text-[#243746] mb-1 block">{f.label}</label>
                            <input
                              value={formData[f.field] as string}
                              onChange={(e) => setFormData({ ...formData, [f.field]: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-[#B9D9DD]/50 bg-white text-[#243746] outline-none focus:border-[#087E8B] text-sm"
                            />
                          </div>
                        ))}
                        <AppButton onClick={salvar} fullWidth className="mt-1">Salvar</AppButton>
                      </div>
                    )}
                    {item.key === "contato" && (
                      <div className="flex flex-col gap-3">
                        {[
                          { label: "E-mail", field: "email" as keyof typeof formData },
                          { label: "Telefone", field: "telefone" as keyof typeof formData },
                        ].map((f) => (
                          <div key={f.field}>
                            <label className="text-xs text-[#243746] mb-1 block">{f.label}</label>
                            <input
                              value={formData[f.field] as string}
                              onChange={(e) => setFormData({ ...formData, [f.field]: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-[#B9D9DD]/50 bg-white text-[#243746] outline-none focus:border-[#087E8B] text-sm"
                            />
                          </div>
                        ))}
                        <AppButton onClick={salvar} fullWidth className="mt-1">Salvar</AppButton>
                      </div>
                    )}
                    {item.key === "endereco" && (
                      <div className="flex flex-col gap-3">
                        {[
                          { label: "Rua", field: "rua" },
                          { label: "Número", field: "numero" },
                          { label: "Bairro", field: "bairro" },
                          { label: "Cidade", field: "cidade" },
                          { label: "Estado", field: "estado" },
                          { label: "CEP", field: "cep" },
                        ].map((f) => (
                          <div key={f.field}>
                            <label className="text-xs text-[#243746] mb-1 block">{f.label}</label>
                            <input
                              value={(formData.endereco as any)[f.field]}
                              onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, [f.field]: e.target.value } })}
                              className="w-full px-3 py-2.5 rounded-xl border border-[#B9D9DD]/50 bg-white text-[#243746] outline-none focus:border-[#087E8B] text-sm"
                            />
                          </div>
                        ))}
                        <AppButton onClick={salvar} fullWidth className="mt-1">Salvar</AppButton>
                      </div>
                    )}
                    {item.key === "senha" && (
                      <div className="flex flex-col gap-3">
                        {senhaErro && <p className="text-red-500 text-xs">{senhaErro}</p>}
                        {[
                          { label: "Senha atual", val: senhaAtual, set: setSenhaAtual },
                          { label: "Nova senha", val: novaSenha, set: setNovaSenha },
                          { label: "Confirmar nova senha", val: confirmarSenha, set: setConfirmarSenha },
                        ].map((f) => (
                          <div key={f.label}>
                            <label className="text-xs text-[#243746] mb-1 block">{f.label}</label>
                            <input
                              type="password"
                              value={f.val}
                              onChange={(e) => f.set(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-[#B9D9DD]/50 bg-white text-[#243746] outline-none focus:border-[#087E8B] text-sm"
                            />
                          </div>
                        ))}
                        <AppButton onClick={salvarSenha} fullWidth className="mt-1">Alterar senha</AppButton>
                      </div>
                    )}
                    {item.key === "notif" && (
                      <div className="flex flex-col gap-3">
                        {[
                          { label: "Lembretes de consulta", val: notifConsulta, set: setNotifConsulta },
                          { label: "Lembretes de exame", val: notifExame, set: setNotifExame },
                          { label: "Avisos informativos", val: notifInfo, set: setNotifInfo },
                        ].map((opt) => (
                          <div key={opt.label} className="flex items-center justify-between py-1">
                            <p className="text-[#243746] text-sm">{opt.label}</p>
                            <button
                              onClick={() => opt.set(!opt.val)}
                              className="w-10 h-6 rounded-full transition-all flex items-center"
                              style={{ background: opt.val ? "#087E8B" : "#B9D9DD", padding: "2px" }}
                            >
                              <div
                                className="w-5 h-5 bg-white rounded-full shadow transition-transform"
                                style={{ transform: opt.val ? "translateX(16px)" : "translateX(0)" }}
                              />
                            </button>
                          </div>
                        ))}
                        <AppButton onClick={() => { setSalvoMsg("Preferências salvas."); setEditSection(null); setTimeout(() => setSalvoMsg(""), 3000); }} fullWidth className="mt-1">Salvar</AppButton>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm active:opacity-70 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <LogOut size={17} color="#EF4444" />
          </div>
          <p className="text-red-500 text-sm" style={{ fontWeight: 500 }}>Sair da conta</p>
        </button>

        <p className="text-center text-[#B9D9DD] text-xs mt-6">SaúdeConnect+ v1.0.0</p>
      </div>
    </div>
  );
}
