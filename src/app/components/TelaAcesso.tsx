import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { User } from "./mockData";
import { mockUsers } from "./mockData";
import { AppButton } from "./ui/AppButton";
import logoMark from "@/assets/saudeconnect-mark.png";

interface TelaAcessoProps {
  onLogin: (user: User) => void;
  /** Unidade do último pedido pendente: a secretaria demo abre nela para ver o que o paciente marcou. */
  unidadeDemo?: string;
}

export function TelaAcesso({ onLogin, unidadeDemo }: TelaAcessoProps) {
  const [tab, setTab] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [entrando, setEntrando] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      setErro("E-mail não encontrado. Verifique seus dados.");
      return;
    }
    if (senha.length < 4) {
      setErro("Senha incorreta. Tente novamente.");
      return;
    }
    onLogin(user);
  }

  function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!nome || !email || !telefone || !senha) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setSucesso("Cadastro realizado! Faça seu login.");
    setTab("login");
    setEmail(email);
  }

  function loginDemo(role: "usuario" | "secretaria") {
    const user = mockUsers.find((u) => u.role === role)!;
    onLogin(role === "secretaria" && unidadeDemo ? { ...user, instituicaoId: unidadeDemo } : user);
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#F4F9FA] lg:flex lg:items-center lg:justify-center lg:p-8 xl:p-12">
      <div className="flex h-full flex-col overflow-hidden bg-white lg:mx-auto lg:h-[660px] lg:max-h-[calc(100dvh-40px)] lg:w-full lg:max-w-5xl lg:grid lg:grid-cols-[.9fr_1.1fr] lg:rounded-[28px] lg:shadow-[0_24px_70px_rgba(36,55,70,0.14)]">
      {/* Marca e contexto */}
      <div className="flex min-h-[84px] shrink-0 items-center bg-gradient-to-br from-[#087E8B] to-[#065F68] px-5 lg:h-auto lg:flex-col lg:items-start lg:justify-between lg:px-12 lg:py-12">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 p-1.5 shadow-lg lg:h-12 lg:w-12">
            <img src={logoMark} alt="SaúdeConnect+" className="h-full w-full object-contain" />
          </div>
          <div>
            <strong className="block text-base text-white lg:text-lg">SaúdeConnect+</strong>
            <p className="text-xs text-white/70">Portal do paciente</p>
          </div>
        </div>
        <div className="hidden lg:block lg:max-w-sm">
          <p className="text-3xl font-bold leading-tight tracking-tight text-white">Seu cuidado, organizado.</p>
          <p className="mt-4 text-base leading-7 text-white/80">Consultas, exames e seu histórico em um só lugar.</p>
        </div>
      </div>

      {/* Acesso */}
      <div className={`min-h-0 flex-1 bg-white px-6 py-4 overflow-y-auto lg:flex lg:flex-col lg:justify-center lg:px-14 xl:px-24`}>
        <div className="mx-auto w-full max-w-sm">
        <div className="mb-4 lg:mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#087E8B]">{tab === "login" ? "Bem-vindo de volta" : "Vamos começar"}</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#243746] lg:mt-2 lg:text-3xl">{tab === "login" ? "Acesse sua conta" : "Crie sua conta"}</h2>
          <p className="mt-1 text-sm text-[#607985] lg:mt-2">{tab === "login" ? "Entre para acompanhar sua saúde." : "Leva menos de um minuto."}</p>
        </div>
        {/* Tabs */}
        <div className="mb-4 flex rounded-xl bg-[#DCEFF1] p-1 lg:mb-5">
          {(["login", "cadastro"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setErro(""); setSucesso(""); }}
              className="flex-1 rounded-lg py-2 text-sm transition-all"
              style={{
                background: tab === t ? "#087E8B" : "transparent",
                color: tab === t ? "white" : "#243746",
                fontWeight: tab === t ? 600 : 400,
              }}
            >
              {t === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        {sucesso && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-700 text-sm">
            {sucesso}
          </div>
        )}
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-600 text-sm">
            {erro}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div>
              <label className="text-sm text-[#243746] mb-1.5 block">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-[#B9D9DD]/50 bg-white px-4 py-2.5 text-sm text-[#243746] outline-none transition-colors focus:border-[#087E8B]"
              />
            </div>
            <div>
              <label className="text-sm text-[#243746] mb-1.5 block">Senha</label>
              <div className="relative">
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#B9D9DD]/50 bg-white px-4 py-2.5 text-sm text-[#243746] outline-none transition-colors focus:border-[#087E8B]"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B9D9DD]"
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <AppButton type="submit" size="lg" fullWidth className="mt-1" loading={entrando} loadingLabel="Entrando…">Entrar</AppButton>
            <button type="button" className="mx-auto mt-0.5 rounded text-center text-xs text-[#087E8B] underline underline-offset-2 hover:text-[#065F68]">Esqueci minha senha</button>
          </form>
        ) : (
          <form onSubmit={handleCadastro} className="flex flex-col gap-2.5">
            {[
              { label: "Nome completo", val: nome, set: setNome, type: "text", ph: "Maria Silva" },
              { label: "E-mail", val: email, set: setEmail, type: "email", ph: "seu@email.com" },
              { label: "Telefone", val: telefone, set: setTelefone, type: "tel", ph: "(11) 99999-9999" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-sm text-[#243746] mb-1.5 block">{f.label}</label>
                <input
                  type={f.type}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.ph}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#B9D9DD]/50 bg-white text-[#243746] outline-none focus:border-[#087E8B] text-sm transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="text-sm text-[#243746] mb-1.5 block">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B9D9DD]/50 bg-white text-[#243746] outline-none focus:border-[#087E8B] text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-[#243746] mb-1.5 block">Confirmar Senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B9D9DD]/50 bg-white text-[#243746] outline-none focus:border-[#087E8B] text-sm transition-colors"
              />
            </div>
            <AppButton type="submit" size="md" fullWidth className="mt-1">Criar conta</AppButton>
          </form>
        )}

        {/* Demo quick access — somente no login */}
        {tab === "login" && (
          <div className="mt-4 border-t border-[#B9D9DD]/30 pt-3 lg:mt-5 lg:pt-4">
            <p className="mb-2 text-center text-xs text-[#607985]">Acesso rápido para demonstração</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <AppButton variant="outline" size="sm" fullWidth disabled={entrando} onClick={() => loginDemo("usuario")}>Entrar como Paciente</AppButton>
              <AppButton variant="outline" size="sm" fullWidth disabled={entrando} onClick={() => loginDemo("secretaria")}>Entrar como Secretaria</AppButton>
            </div>
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  );
}
