import { useState, useEffect, useMemo, useRef } from "react";
import { BottomNav } from "./components/BottomNav";
import { TelaAcesso } from "./components/TelaAcesso";
import { TelaHome } from "./components/TelaHome";
import { TelaAgenda } from "./components/TelaAgenda";
import { TelaAgendar } from "./components/TelaAgendar";
import { TelaInstituicoes } from "./components/TelaInstituicoes";
import { TelaDetalhesInstituicao } from "./components/TelaDetalhesInstituicao";
import { TelaPerfil } from "./components/TelaPerfil";
import { TelaGestao } from "./components/TelaGestao";
import { AppShell } from "./components/AppShell";
import { TelaCarregando } from "./components/TelaCarregando";
import type { User, Screen, Agendamento, AgendamentoHistorico, AgendamentoTipo, Notificacao } from "./components/mockData";
import { formatDate, getInstituicaoNome, getProfissionalNome, mockAgendamentos, mockNotificacoes, mockUsers } from "./components/mockData";
import { cancelAppointmentByProfessional, confirmAppointment, confirmReschedulingAppointment, createAppointmentHistory, getReschedulingRequest, rescheduleAppointment } from "./features/agendamento/rescheduling";
import { DEMO_STATE_KEY, LEGACY_DEMO_STATE_KEY, migrateDemoState, rebaseDemoAppointments } from "./features/demo/demoState";
import { latestChangedUnit } from "./features/demo/demoUnit";
import { criarGeradorDeId, filtrarPorPapel, marcarTodasLidas } from "./features/avisos/avisos";

type DemoState = {
  agendamentos: Agendamento[];
  notificacoes: Notificacao[];
  historicoAgendamentos: AgendamentoHistorico[];
};

/**
 * Carrega o estado da demonstração, convertendo o formato da versão anterior.
 *
 * Chamada UMA vez por montagem: ler três vezes (uma por `useState`) podia trazer
 * pedaços de versões diferentes se outra aba gravasse no meio do caminho.
 */
function loadDemoState(): DemoState {
  try {
    const atual = localStorage.getItem(DEMO_STATE_KEY);
    const migrado = migrateDemoState<DemoState>(atual ? JSON.parse(atual) : null);
    if (migrado) return { ...migrado, agendamentos: rebaseDemoAppointments(migrado.agendamentos) };

    const anterior = localStorage.getItem(LEGACY_DEMO_STATE_KEY);
    const convertido = migrateDemoState<DemoState>(anterior ? JSON.parse(anterior) : null);
    if (convertido) return { ...convertido, agendamentos: rebaseDemoAppointments(convertido.agendamentos) };
  } catch { /* inicia a demonstração com os dados padrão */ }
  return {
    agendamentos: rebaseDemoAppointments([...mockAgendamentos]),
    notificacoes: [...mockNotificacoes],
    historicoAgendamentos: [],
  };
}

// Abas fixas da barra inferior (Agendar não é mais uma aba principal)
const MAIN_TABS: Screen[] = ["home", "agenda", "instituicoes", "perfil"];

// Telas que exibem a barra inferior
const BOTTOM_NAV_SCREENS: Screen[] = [
  "home", "agenda", "agendar", "instituicoes", "detalhes",
  "perfil", "gestao",
];

// Telas que só fazem sentido para o paciente: a secretaria é devolvida ao painel.
const SCREENS_SO_DO_PACIENTE: Screen[] = ["home", "agendar", "detalhes"];

// Mapeia qualquer tela para a aba principal mais próxima
function resolveActiveTab(screen: Screen): Screen {
  // "Agendar" deixou de ser aba própria — o fluxo de marcar vive dentro da Agenda,
  // então mantemos a aba Agenda destacada enquanto o usuário cria um agendamento.
  if (screen === "agendar") return "agenda";
  const map: Partial<Record<Screen, Screen>> = {
    detalhes: "instituicoes",
    gestao: "gestao",
  };
  return map[screen] ?? screen;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>("acesso");
  // Uma leitura só, compartilhada pelos três estados, para não misturar versões.
  const [estadoInicial] = useState<DemoState>(loadDemoState);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(estadoInicial.agendamentos);
  const [historicoAgendamentos, setHistoricoAgendamentos] = useState<AgendamentoHistorico[]>(estadoInicial.historicoAgendamentos);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(estadoInicial.notificacoes);
  const [focusedAdminAppointmentId, setFocusedAdminAppointmentId] = useState<string | null>(null);
  const [carregandoArea, setCarregandoArea] = useState(false);
  // Ids únicos por sessão, já cientes do que existe: `Date.now()` repetia quando
  // duas ações caíam no mesmo milissegundo.
  const gerarIdAviso = useMemo(() => criarGeradorDeId("n", estadoInicial.notificacoes.map((item) => item.id)), [estadoInicial]);
  const gerarIdAgendamento = useMemo(() => criarGeradorDeId("a", estadoInicial.agendamentos.map((item) => item.id)), [estadoInicial]);
  // Modo Fácil (MVP 2 — acessibilidade): textos e botões maiores, persistido no dispositivo.
  const [modoFacil, setModoFacil] = useState<boolean>(() => {
    try { return localStorage.getItem("modoFacil") === "1"; } catch { return false; }
  });
  function toggleModoFacil() {
    setModoFacil((v) => {
      const novo = !v;
      try { localStorage.setItem("modoFacil", novo ? "1" : "0"); } catch { /* ignore */ }
      return novo;
    });
  }
  // Aplica o Modo Fácil na raiz do documento (escala a fonte de todo o app).
  useEffect(() => {
    document.documentElement.classList.toggle("modo-facil", modoFacil);
  }, [modoFacil]);
  useEffect(() => {
    try { localStorage.setItem(DEMO_STATE_KEY, JSON.stringify({ agendamentos, notificacoes, historicoAgendamentos })); } catch { /* sem armazenamento disponível */ }
  }, [agendamentos, notificacoes, historicoAgendamentos]);
  /** Adota o estado vindo de outra aba ou do servidor local. Devolve `false` se o formato for inválido. */
  function aplicarEstadoExterno(bruto: unknown): boolean {
    const next = migrateDemoState<DemoState>(bruto);
    if (!next) return false;
    setAgendamentos(rebaseDemoAppointments(next.agendamentos));
    setNotificacoes(next.notificacoes);
    setHistoricoAgendamentos(next.historicoAgendamentos);
    // shortcut: a secretaria da demonstração acompanha a unidade da última alteração feita
    // em outra aba (igual ao login); trocar por unidade fixa quando houver login real por unidade.
    const unidade = latestChangedUnit(next.agendamentos, next.historicoAgendamentos);
    if (unidade) setUser((atual) => (atual?.role === "secretaria" ? { ...atual, instituicaoId: unidade } : atual));
    return true;
  }
  useEffect(() => {
    const syncDemoState = (event: StorageEvent) => {
      if (event.key !== DEMO_STATE_KEY || !event.newValue) return;
      try { aplicarEstadoExterno(JSON.parse(event.newValue)); } catch { /* ignora dados inválidos */ }
    };
    window.addEventListener("storage", syncDemoState);
    return () => window.removeEventListener("storage", syncDemoState);
  }, []);
  // Estado compartilhado pelo servidor de desenvolvimento: paciente e secretaria ficam
  // alinhados mesmo em navegadores, janelas anônimas ou portas diferentes do mesmo computador.
  // shortcut: última gravação vence (duas ações no mesmo ~1,5 s podem perder uma); trocar por backend real.
  const ultimoCompartilhado = useRef("");
  const enviando = useRef(0);
  const [compartilhadoPronto, setCompartilhadoPronto] = useState(false);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let ativo = true;
    const receber = async () => {
      if (enviando.current) return;
      const antes = ultimoCompartilhado.current;
      try {
        const resposta = await fetch("/api/demo-state", { cache: "no-store" });
        if (!resposta.ok) return;
        const texto = await resposta.text();
        // Uma alteração local feita durante a leitura é mais nova que a resposta: descarta.
        if (!ativo || enviando.current || ultimoCompartilhado.current !== antes || texto === antes) return;
        if (aplicarEstadoExterno(JSON.parse(texto))) ultimoCompartilhado.current = texto;
      } catch { /* servidor compartilhado indisponível: segue só neste navegador */ }
    };
    void receber().finally(() => { if (ativo) setCompartilhadoPronto(true); });
    const timer = window.setInterval(receber, 1500);
    return () => { ativo = false; window.clearInterval(timer); };
  }, []);
  useEffect(() => {
    if (!compartilhadoPronto) return;
    const texto = JSON.stringify({ agendamentos, notificacoes, historicoAgendamentos });
    if (texto === ultimoCompartilhado.current) return;
    ultimoCompartilhado.current = texto;
    enviando.current += 1;
    void fetch("/api/demo-state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: texto })
      .catch(() => { /* continua disponível neste navegador */ })
      .finally(() => { enviando.current -= 1; });
  }, [compartilhadoPronto, agendamentos, notificacoes, historicoAgendamentos]);

  // Instituição selecionada para fluxo detalhes → agendar
  const [instSelecionadaId, setInstSelecionadaId] = useState<string | null>(null);
  // Tela de origem para que a seta de voltar em "Novo Agendamento" retorne ao lugar certo
  const [agendarTipo, setAgendarTipo] = useState<AgendamentoTipo | null>(null);

  // ─── Auth ─────────────────────────────────────────────────
  function handleLogin(u: User) {
    // Mostra a tela de carregamento enquanto a área da pessoa é montada.
    setCarregandoArea(true);
    setUser(u);
    setScreen(u.role === "secretaria" ? "gestao" : "home");
    window.setTimeout(() => setCarregandoArea(false), 600);
  }

  function handleLogout() {
    setUser(null);
    setScreen("acesso");
    setInstSelecionadaId(null);
  }

  // ─── Agenda actions ───────────────────────────────────────
  function handleCancelar(id: string) {
    const appointment = agendamentos.find((item) => item.id === id);
    if (!appointment) return;
    const changedAt = new Date().toISOString();
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelado" } : a))
    );
    setHistoricoAgendamentos((prev) => [{
      agendamentoId: id,
      tipo: "cancelado",
      responsavel: "usuário",
      data: changedAt,
      anterior: { status: appointment.status },
      atual: { status: "cancelado" },
    }, ...prev]);
    const notif: Notificacao = {
      id: gerarIdAviso(),
      titulo: "Agendamento cancelado",
      mensagem: `Seu agendamento de ${formatDate(appointment.data)} às ${appointment.horario} foi cancelado com sucesso.`,
      tipo: "cancelamento",
      data: new Date().toISOString(),
      lida: false,
      agendamentoId: id,
      usuarioId: appointment.usuarioId,
      destinatario: "paciente",
    };
    setNotificacoes((prev) => [{
      id: gerarIdAviso(), titulo: "Agendamento cancelado pelo paciente", mensagem: `${mockUsers.find((item) => item.id === appointment.usuarioId)?.nome ?? "Paciente"} cancelou ${(appointment.tipo === "consulta" ? appointment.especialidade : appointment.tipoExame) ?? "o atendimento"} agendado para ${formatDate(appointment.data)} às ${appointment.horario}. O horário foi liberado na agenda.`, tipo: "cancelamento", data: new Date().toISOString(), lida: false, agendamentoId: id, usuarioId: appointment.usuarioId, destinatario: "secretaria", instituicaoId: appointment.instituicaoId,
    }, notif, ...prev]);
  }

  // ─── Reagendamento (MVP 2) ────────────────────────────────
  // O horário mostrado no seletor já é livre, então a alteração é confirmada na hora.
  function handleReagendar(id: string, data: string, horario: string) {
    const appointment = agendamentos.find((item) => item.id === id);
    if (!appointment) return;
    const changedAt = new Date().toISOString();
    const result = rescheduleAppointment(appointment, data, horario, changedAt);
    const request = getReschedulingRequest(appointment.data, appointment.horario, data, horario);
    const descricao = appointment.tipo === "consulta" ? appointment.especialidade : appointment.tipoExame;
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? result.appointment : a))
    );
    setHistoricoAgendamentos((prev) => [result.event, ...prev]);
    const notif: Notificacao = {
      id: gerarIdAviso(),
      titulo: request.title,
      mensagem: request.message,
      tipo: "info",
      data: new Date().toISOString(),
      lida: false,
      agendamentoId: id,
      usuarioId: appointment.usuarioId,
      destinatario: "paciente",
    };
    setNotificacoes((prev) => [{
      id: gerarIdAviso(), titulo: "Reagendamento aguardando confirmação", mensagem: `${mockUsers.find((item) => item.id === appointment.usuarioId)?.nome ?? "Paciente"} solicitou novo horário para ${descricao ?? "o atendimento"}: ${formatDate(appointment.data)} às ${appointment.horario} → ${formatDate(data)} às ${horario}. Confirme no painel de agendamentos.`, tipo: "info", data: changedAt, lida: false, agendamentoId: id, usuarioId: appointment.usuarioId, destinatario: "secretaria", instituicaoId: appointment.instituicaoId,
    }, notif, ...prev.filter((item) => !(item.agendamentoId === id && item.titulo === "Reagendamento Confirmado"))]);
  }

  function handleConfirmarReagendamento(id: string) {
    const appointment = agendamentos.find((item) => item.id === id && item.status === "reagendamento");
    if (!appointment) return;
    const changedAt = new Date().toISOString();
    const result = confirmReschedulingAppointment(appointment, changedAt);
    const request = historicoAgendamentos.find((event) => event.agendamentoId === id && event.tipo === "reagendado");
    const oldDate = request?.anterior.data ?? appointment.data;
    const oldTime = request?.anterior.horario ?? appointment.horario;
    const descricao = appointment.tipo === "consulta" ? appointment.especialidade : appointment.tipoExame;
    setAgendamentos((prev) => prev.map((item) => item.id === id ? result.appointment : item));
    setHistoricoAgendamentos((prev) => [result.event, ...prev]);
    setNotificacoes((prev) => [{
      id: gerarIdAviso(),
      titulo: "Novo horário confirmado",
      mensagem: `Seu novo horário para ${descricao ?? "o atendimento"} foi confirmado: ${formatDate(oldDate)} às ${oldTime} → ${formatDate(appointment.data)} às ${appointment.horario}.`,
      tipo: "confirmacao",
      data: changedAt,
      lida: false,
      agendamentoId: id,
      usuarioId: appointment.usuarioId,
      destinatario: "paciente",
    }, ...prev]);
  }

  // ─── Confirmação do agendamento pela secretaria ───────────
  // Fecha o ciclo que o aviso ao paciente sempre prometeu: o pedido nascia
  // "pendente" e não existia nenhuma ação capaz de confirmá-lo.
  function handleConfirmarAgendamento(id: string) {
    const appointment = agendamentos.find((item) => item.id === id);
    if (!appointment) return;
    const changedAt = new Date().toISOString();
    const result = confirmAppointment(appointment, changedAt);
    if (!result) return;
    const descricao = appointment.tipo === "consulta" ? appointment.especialidade : appointment.tipoExame;
    setAgendamentos((prev) => prev.map((item) => (item.id === id ? result.appointment : item)));
    setHistoricoAgendamentos((prev) => [result.event, ...prev]);
    setNotificacoes((prev) => [{
      id: gerarIdAviso(),
      titulo: "Agendamento confirmado",
      mensagem: `${descricao ?? "Seu atendimento"} em ${getInstituicaoNome(appointment.instituicaoId)} foi confirmado para ${formatDate(appointment.data)} às ${appointment.horario}.`,
      tipo: "confirmacao",
      data: changedAt,
      lida: false,
      agendamentoId: id,
      usuarioId: appointment.usuarioId,
      destinatario: "paciente",
    }, ...prev]);
  }

  function handleCancelarPorProfissional(id: string) {
    const appointment = agendamentos.find((item) => item.id === id);
    if (!appointment) return;
    const professionalName = appointment.profissionalId
      ? getProfissionalNome(appointment.profissionalId)
      : "Instituição responsável";
    const changedAt = new Date().toISOString();
    const result = cancelAppointmentByProfessional(appointment, professionalName, changedAt);
    setAgendamentos((prev) => prev.map((item) => item.id === id ? result.appointment : item));
    setHistoricoAgendamentos((prev) => [result.event, ...prev]);
    const descricao = appointment.tipo === "consulta" ? appointment.especialidade : appointment.tipoExame;
    setNotificacoes((prev) => [{
      id: gerarIdAviso(),
      titulo: "Cancelamento confirmado",
      mensagem: `${professionalName} cancelou ${descricao ?? "o atendimento"} de ${mockUsers.find((item) => item.id === appointment.usuarioId)?.nome ?? "paciente"}, em ${formatDate(appointment.data)} às ${appointment.horario}.`,
      tipo: "cancelamento",
      data: changedAt,
      lida: false,
      agendamentoId: id,
      usuarioId: appointment.usuarioId,
      destinatario: "secretaria", instituicaoId: appointment.instituicaoId,
    }, {
      id: gerarIdAviso(),
      ...result.notification,
      data: changedAt,
      lida: false,
      destinatario: "paciente",
    }, ...prev]);
  }

  function handleConfirmar(ag: Omit<Agendamento, "id" | "usuarioId">) {
    const novo: Agendamento = { ...ag, id: gerarIdAgendamento(), usuarioId: user!.id };
    const createdAt = new Date().toISOString();
    setAgendamentos((prev) => [...prev, novo]);
    setHistoricoAgendamentos((prev) => [createAppointmentHistory(novo, createdAt), ...prev]);
    const notif: Notificacao = {
      id: gerarIdAviso(),
      titulo: ag.tipo === "consulta" ? "Consulta solicitada" : "Exame solicitado",
      mensagem: `Sua solicitação para ${formatDate(ag.data)} às ${ag.horario} foi enviada a ${getInstituicaoNome(ag.instituicaoId)}. Você será avisado assim que a unidade confirmar.`,
      tipo: "info",
      data: createdAt,
      lida: false,
      agendamentoId: novo.id,
      usuarioId: novo.usuarioId,
      destinatario: "paciente",
    };
    setNotificacoes((prev) => [{
      id: gerarIdAviso(), titulo: "Novo agendamento solicitado", mensagem: `${user?.nome ?? "Paciente"} solicitou ${ag.tipo === "consulta" ? ag.especialidade : ag.tipoExame} para ${formatDate(ag.data)} às ${ag.horario} em ${getInstituicaoNome(ag.instituicaoId)}.`, tipo: "info", data: createdAt, lida: false, agendamentoId: novo.id, usuarioId: novo.usuarioId, destinatario: "secretaria", instituicaoId: novo.instituicaoId,
    }, notif, ...prev]);
  }

  // ─── Notifications ────────────────────────────────────────
  function handleMarcarLida(id: string) {
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }

  function handleOpenNotificationAppointment(appointmentId: string) {
    if (user?.role === "secretaria") {
      setFocusedAdminAppointmentId(appointmentId);
      setScreen("gestao");
      return;
    }
    setScreen("agenda");
  }

  function handleMarcarTodasLidas() {
    // Só os avisos que este papel realmente vê.
    setNotificacoes((prev) => marcarTodasLidas(prev, visibleNotifications));
  }

  // ─── Navegação para Agendar (preserva origem) ─────────────
  function navigateToAgendar(instId: string | null, tipo: AgendamentoTipo | null = null) {
    setInstSelecionadaId(instId);
    setAgendarTipo(tipo);
    setScreen("agendar");
  }

  function navigateToDetalhes(instId: string) {
    setInstSelecionadaId(instId);
    setScreen("detalhes");
  }

  // ─── Derived ──────────────────────────────────────────────
  const userAgendamentos = agendamentos.filter((a) => !user || a.usuarioId === user.id);
  // A secretaria enxerga a agenda da unidade dela, não a rede inteira.
  const agendaDaUnidade = agendamentos.filter((a) => !user?.instituicaoId || a.instituicaoId === user.instituicaoId);
  const agendaAppointments = user?.role === "secretaria" ? agendaDaUnidade : userAgendamentos;
  const visibleNotifications = filtrarPorPapel(notificacoes, {
    papel: user?.role === "secretaria" ? "secretaria" : "usuario",
    usuarioId: user?.id,
    instituicaoId: user?.role === "secretaria" ? user.instituicaoId : undefined,
  });
  const naoLidas = visibleNotifications.filter((n) => !n.lida).length;
  const showBottomNav = user && BOTTOM_NAV_SCREENS.includes(screen);
  const activeTab = resolveActiveTab(user?.role === "secretaria" && SCREENS_SO_DO_PACIENTE.includes(screen) ? "gestao" : screen);

  // ─── Render ───────────────────────────────────────────────
  const renderScreen = () => {
    if (!user) return <TelaAcesso onLogin={handleLogin} unidadeDemo={latestChangedUnit(agendamentos, historicoAgendamentos)} />;

    // A secretaria não marca consulta nem exame para si: o lugar dela é o painel.
    const telaEfetiva = user.role === "secretaria" && SCREENS_SO_DO_PACIENTE.includes(screen) ? "gestao" : screen;

    switch (telaEfetiva) {
      case "home":
        return (
          <TelaHome
            user={user}
            agendamentos={agendaAppointments}
            onStartBooking={(tipo) => navigateToAgendar(null, tipo)}
            onNavigate={(s) => {
              if (s === "agendar") navigateToAgendar(null);
              else setScreen(s);
            }}
            notifications={visibleNotifications}
            onMarkRead={handleMarcarLida}
            modoFacil={modoFacil}
          />
        );

      case "agenda":
        return (
          <TelaAgenda
            agendamentos={agendaAppointments}
            todosAgendamentos={agendamentos}
            somenteLeitura={user.role === "secretaria"}
            onNavigate={(s) => {
              if (s === "agendar") navigateToAgendar(null);
              else setScreen(s);
            }}
            onCancelar={handleCancelar}
            onReagendar={handleReagendar}
            historicoAlteracoes={historicoAgendamentos.filter((evento) => agendaAppointments.some((agendamento) => agendamento.id === evento.agendamentoId))}
            notificacoesNaoLidas={naoLidas}
            modoFacil={modoFacil}
          />
        );

      case "agendar":
        return (
          <TelaAgendar
            onNavigate={setScreen}
            onConfirmar={handleConfirmar}
            /* A agenda da rede inteira: sem ela, dois pacientes marcam o mesmo horário. */
            agendamentos={agendamentos}
            preInstId={instSelecionadaId}
            preTipo={agendarTipo}
            user={user}
            modoFacil={modoFacil}
          />
        );

      case "instituicoes":
        return (
          <TelaInstituicoes
            podeAgendar={user.role !== "secretaria"}
            onNavigate={setScreen}
            onDetalhes={navigateToDetalhes}
            onAgendar={(instId) => navigateToAgendar(instId)}
            modoFacil={modoFacil}
          />
        );

      case "detalhes":
        return (
          <TelaDetalhesInstituicao
            instId={instSelecionadaId ?? ""}
            modoFacil={modoFacil}
            onBack={() => setScreen("instituicoes")}
            onAgendar={(instId) => navigateToAgendar(instId)}
          />
        );

      case "perfil":
        return (
          <TelaPerfil
            user={user}
            onNavigate={(s) => {
              if (s === "agendar") navigateToAgendar(null);
              else setScreen(s);
            }}
            onLogout={handleLogout}
            onUpdateUser={setUser}
            modoFacil={modoFacil}
            onToggleModoFacil={toggleModoFacil}
          />
        );

      case "gestao":
        return user.role === "secretaria" ? (
          <TelaGestao key={user.instituicaoId} notifications={visibleNotifications} onMarkRead={handleMarcarLida} agendamentos={agendaDaUnidade} historicoAlteracoes={historicoAgendamentos} modoFacil={modoFacil} onCancelarPorProfissional={handleCancelarPorProfissional} onConfirmarReagendamento={handleConfirmarReagendamento} onConfirmarAgendamento={handleConfirmarAgendamento} focusedAppointmentId={focusedAdminAppointmentId} unidadeNome={user.instituicaoId ? getInstituicaoNome(user.instituicaoId) : undefined} instituicaoId={user.instituicaoId} />
        ) : (
          <TelaHome
            user={user}
            agendamentos={userAgendamentos}
            onStartBooking={(tipo) => navigateToAgendar(null, tipo)}
            onNavigate={setScreen}
            notifications={visibleNotifications}
            onMarkRead={handleMarcarLida}
          />
        );

      default:
        return (
          <TelaHome
            user={user}
            agendamentos={userAgendamentos}
            onStartBooking={(tipo) => navigateToAgendar(null, tipo)}
            onNavigate={setScreen}
            notifications={visibleNotifications}
            onMarkRead={handleMarcarLida}
          />
        );
    }
  };

  if (carregandoArea && user) {
    return <div className={modoFacil ? "modo-facil" : ""}>
      <TelaCarregando titulo="Preparando sua área" descricao={user.role === "secretaria" ? "Carregando os agendamentos da unidade." : "Carregando seus atendimentos."} />
    </div>;
  }

  if (!user) {
    return <div className={`min-h-screen bg-[#F4F9FA] ${modoFacil ? "modo-facil" : ""}`}>{renderScreen()}</div>;
  }

  return <div className={modoFacil ? "modo-facil" : ""}>
    <AppShell activeTab={activeTab} user={user} unread={naoLidas} notifications={visibleNotifications} onMarkRead={handleMarcarLida} onMarkAllRead={handleMarcarTodasLidas} onOpenAppointment={handleOpenNotificationAppointment} showNotifications={screen !== "detalhes" && screen !== "agendar"} modoFacil={modoFacil} onToggleModoFacil={toggleModoFacil} onTrocarPerfil={handleLogout} onNavigate={(target) => target === "agendar" ? navigateToAgendar(null) : setScreen(target)}>
      <div className="min-h-screen lg:min-h-0">{renderScreen()}</div>
      {/* No celular não há menu lateral: o botão fica flutuando acima da barra inferior. */}
      <button type="button" onClick={handleLogout} className="fixed bottom-24 right-4 z-40 rounded-full border border-[#B9D9DD] bg-white px-4 py-2 text-sm font-semibold text-[#087E8B] shadow-md hover:bg-[#DCEFF1] lg:hidden">Trocar perfil ({user.role === "secretaria" ? "Secretaria" : "Paciente"})</button>
      {showBottomNav && <BottomNav activeTab={activeTab} role={user.role} onNavigate={setScreen} />}
    </AppShell>
  </div>;
}
