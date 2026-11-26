import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("dashboard primitives preserve the Sprint 1 surfaces", async () => {
  const paths = [
    "src/app/components/dashboard/DashboardPageHeader.tsx",
    "src/app/components/dashboard/MetricCard.tsx",
    "src/app/components/dashboard/SectionCard.tsx",
  ];

  for (const path of paths) {
    assert.equal(existsSync(path), true, `${path} precisa existir`);
  }

  const files = await Promise.all(paths.map((path) => readFile(path, "utf8")));
  const source = files.join("\n");
  assert.match(source, /#087E8B/i);
  assert.match(source, /bg-white/);
  assert.match(source, /#243746/i);
});

test("home uses the approved dashboard hierarchy", async () => {
  const source = await readFile("src/app/components/TelaHome.tsx", "utf8");
  assert.match(source, /DashboardPageHeader/);
  assert.match(source, /MetricCard/);
  assert.match(source, /lg:grid-cols-\[minmax\(0,1\.35fr\)_minmax\(280px,\.65fr\)\]/);
  assert.doesNotMatch(source, /linear-gradient\(135deg, #087E8B, #065F68\)/);
});

test("patient screens share the dashboard header and card surfaces", async () => {
  const screens = ["TelaAgenda", "TelaAgendar", "TelaInstituicoes", "TelaNotificacoes", "TelaPerfil"];
  for (const screen of screens) {
    const source = await readFile(`src/app/components/${screen}.tsx`, "utf8");
    assert.match(source, /DashboardPageHeader/, `${screen} sem cabeçalho compartilhado`);
    assert.match(source, /bg-white|SectionCard/, `${screen} sem superfície branca`);
  }
});

test("dashboard keeps the approved workspace and card colors", async () => {
  const shell = await readFile("src/app/components/AppShell.tsx", "utf8");
  const cards = await readFile("src/app/components/dashboard/SectionCard.tsx", "utf8");
  assert.match(shell, /#F4F9FA/i);
  assert.match(cards, /bg-white/);
  assert.match(cards, /#B9D9DD/i);
});

test("agenda follows the compact calendar and daily schedule layout", async () => {
  const agenda = await readFile("src/app/components/TelaAgenda.tsx", "utf8");

  assert.match(agenda, /Minha agenda/);
  assert.match(agenda, /Agenda do dia/);
  assert.match(agenda, /lg:grid-cols-\[minmax\(280px,\.8fr\)_minmax\(0,1\.2fr\)\]/);
  assert.match(agenda, /Próximos/);
});

test("agenda keeps its primary action beside the daily schedule instead of the global header", async () => {
  const agenda = await readFile("src/app/components/TelaAgenda.tsx", "utf8");

  assert.match(agenda, /SectionCard title="Agenda do dia"[\s\S]*action=\{<button[\s\S]*Novo agendamento/);
  assert.doesNotMatch(agenda, /DashboardPageHeader[^>]*action=/);
});

test("agenda exposes a mobile new-appointment action above the calendar without a floating footer collision", async () => {
  const agenda = await readFile("src/app/components/TelaAgenda.tsx", "utf8");

  assert.match(agenda, /lg:hidden[\s\S]*Novo agendamento/);
  assert.doesNotMatch(agenda, /fixed bottom-5 right-5/);
});

test("agenda constrains its mobile card grid to the viewport", async () => {
  const agenda = await readFile("src/app/components/TelaAgenda.tsx", "utf8");

  assert.match(agenda, /grid-cols-\[minmax\(0,1fr\)\][\s\S]*lg:grid-cols-\[minmax\(280px,\.8fr\)_minmax\(0,1\.2fr\)\]/);
});

test("booking uses compact mobile spacing without a redundant back action", async () => {
  const booking = await readFile("src/app/components/TelaAgendar.tsx", "utf8");

  assert.match(booking, /space-y-4[\s\S]*lg:space-y-6/);
  assert.doesNotMatch(booking, /onBack|Voltar/);
});

test("profile relies on the global notification action and keeps management access in the card system", async () => {
  const perfil = await readFile("src/app/components/TelaPerfil.tsx", "utf8");

  assert.doesNotMatch(perfil, /DashboardPageHeader[^>]*action=/);
  assert.doesNotMatch(perfil, /bg-\[\#243746\]/);
});

test("institutions list does not consume a grid cell with the result count", async () => {
  const instituicoes = await readFile("src/app/components/TelaInstituicoes.tsx", "utf8");

  assert.doesNotMatch(instituicoes, /instituição\{lista\.length !== 1 \? "s" : ""\} encontrada/);
  assert.match(instituicoes, /<div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">\s*\{lista\.map/);
});

test("patient home leaves notifications to the shared workspace topbar", async () => {
  const home = await readFile("src/app/components/TelaHome.tsx", "utf8");

  assert.doesNotMatch(home, /NotificationPopover/);
  assert.doesNotMatch(home, /action=\{\(/);
});
