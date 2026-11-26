import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("desktop shell adapts sidebar width for compact notebooks", async () => {
  const source = await readFile("src/app/components/AppShell.tsx", "utf8");
  assert.match(source, /lg:grid-cols-\[220px_minmax\(0,1fr\)\]/);
  assert.match(source, /xl:grid-cols-\[260px_minmax\(0,1fr\)\]/);
});

test("desktop navigation keeps patient labels on large screens", async () => {
  const source = await readFile("src/app/components/DesktopNav.tsx", "utf8");
  assert.match(source, /Início/);
  assert.match(source, /Agenda/);
  assert.match(source, /Instituições/);
  assert.match(source, /Perfil/);
});

test("mobile booking keeps time choices and actions inside narrow screens", async () => {
  const [schedule, button, styles] = await Promise.all([
    readFile("src/app/features/agendamento/steps/BookingScheduleStep.tsx", "utf8"),
    readFile("src/app/components/ui/AppButton.tsx", "utf8"),
    readFile("src/styles/theme.css", "utf8"),
  ]);

  // A grade de horários começa estreita e só adensa quando há largura.
  assert.match(schedule, /grid-cols-3 gap-2[\s\S]*min-\[420px\]:grid-cols-4 sm:grid-cols-6/);
  assert.match(button, /min-w-0[\s\S]*whitespace-normal/);
  assert.match(styles, /overflow-x: clip/);
});

test("mobile booking presents one named step at a time with visible progress", async () => {
  const progress = await readFile("src/app/features/agendamento/BookingProgress.tsx", "utf8");

  assert.match(progress, /sm:hidden/);
  assert.match(progress, /Etapa \{activeIndex \+ 1\} de \{BOOKING_STEPS\.length\}/);
  assert.match(progress, /stepLabel\(current, tipo\)/);
  assert.match(progress, /sm:block/);
});

test("agenda preserves appointment details instead of truncating them on narrow screens", async () => {
  const agenda = await readFile("src/app/components/TelaAgenda.tsx", "utf8");

  assert.match(agenda, /hidden[\s\S]*sm:grid/);
  assert.match(agenda, /line-clamp-2[\s\S]*sm:truncate/);
  assert.match(agenda, /sm:hidden[\s\S]*toLocaleDateString/);
});

test("patient cancellation uses the detailed in-app confirmation dialog", async () => {
  const agenda = await readFile("src/app/components/TelaAgenda.tsx", "utf8");

  assert.doesNotMatch(agenda, /window\.confirm/);
  assert.match(agenda, /Confirmar cancelamento\?/);
  assert.match(agenda, /Confirmar cancelamento/);
  assert.match(agenda, /atualizará seu histórico/);
});

test("booking has one labeled back control that returns through every step", async () => {
  const [progress, serviceStep, bookingPage] = await Promise.all([
    readFile("src/app/features/agendamento/BookingProgress.tsx", "utf8"),
    readFile("src/app/features/agendamento/steps/BookingServiceStep.tsx", "utf8"),
    readFile("src/app/components/TelaAgendar.tsx", "utf8"),
  ]);

  assert.match(progress, /ArrowLeft[\s\S]*Voltar/);
  assert.doesNotMatch(serviceStep, /Voltar para localização/);
  assert.match(bookingPage, /function goBack\(\)[\s\S]*getPreviousStep\(step\)/);
});

test("admin availability is managed per selected professional", async () => {
  const management = await readFile("src/app/components/TelaGestao.tsx", "utf8");

  assert.match(management, /selectedProfessionalId/);
  assert.match(management, /Disponibilidade por profissional/);
  assert.match(management, /Agenda semanal de/);
  assert.match(management, /diasDisponiveis/);
});

test("admin notice opens the appointment queue ordered by latest activity", async () => {
  const [notices, management] = await Promise.all([
    readFile("src/app/components/AvisosPanel.tsx", "utf8"),
    readFile("src/app/components/TelaGestao.tsx", "utf8"),
  ]);

  assert.match(notices, /onOpenAppointment/);
  assert.match(management, /setTab\("agendamentos"\)/);
  assert.match(management, /sort\(\(a, b\) => activityAt\(b\) - activityAt\(a\)\)/);
});

test("admin notice opens the requesting patient's details", async () => {
  const management = await readFile("src/app/components/TelaGestao.tsx", "utf8");

  assert.match(management, /selectedAppointmentId/);
  assert.match(management, /Detalhes da solicitação/);
  assert.match(management, /E-mail/);
  assert.match(management, /Celular/);
});

test("appointment history presents a visual timeline with clear before and after states", async () => {
  const agenda = await readFile("src/app/components/TelaAgenda.tsx", "utf8");

  assert.match(agenda, /Linha do tempo do agendamento/);
  assert.match(agenda, /Antes/);
  assert.match(agenda, /Depois/);
  assert.match(agenda, /Aguardando confirmação/);
});

test("admin active appointments prioritize recorded activity and expose their details", async () => {
  const management = await readFile("src/app/components/TelaGestao.tsx", "utf8");

  assert.match(management, /latestEvent \? new Date\(latestEvent\.data\)\.getTime\(\) : 0/);
  assert.match(management, /Ver detalhes/);
  assert.match(management, /setSelectedAppointmentId\(item\.id\)/);
});

test("admin active appointment cards identify the patient before opening details", async () => {
  const management = await readFile("src/app/components/TelaGestao.tsx", "utf8");

  assert.match(management, /Paciente: \{mockUsers\.find\(\(user\) => user\.id === item\.usuarioId\)\?\.nome/);
});
