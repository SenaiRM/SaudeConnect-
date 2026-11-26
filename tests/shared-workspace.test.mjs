import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("patient and secretaria share a workspace shell with role-aware navigation", async () => {
  const shell = await readFile("src/app/components/AppShell.tsx", "utf8");
  const nav = await readFile("src/app/components/DesktopNav.tsx", "utf8");

  assert.match(shell, /WorkspaceTopbar/);
  assert.match(shell, /user: User/);
  assert.match(nav, /role === "secretaria"/);
  assert.match(nav, /Painel/);
  assert.doesNotMatch(nav, /Precisa de ajuda/);
});

test("secretaria keeps access to the agenda, limited to her unit", async () => {
  const nav = await readFile("src/app/components/DesktopNav.tsx", "utf8");
  const app = await readFile("src/app/App.tsx", "utf8");
  const agenda = await readFile("src/app/components/TelaAgenda.tsx", "utf8");

  assert.match(nav, /screen: "agenda" as Screen, label: "Agenda"/);
  assert.match(app, /user\?\.role === "secretaria" \? agendaDaUnidade : userAgendamentos/);
  assert.match(agenda, /Novo agendamento/);
});

test("workspace header keeps only the global notification action", async () => {
  const topbar = await readFile("src/app/components/WorkspaceTopbar.tsx", "utf8");
  const nav = await readFile("src/app/components/DesktopNav.tsx", "utf8");
  const shell = await readFile("src/app/components/AppShell.tsx", "utf8");

  assert.doesNotMatch(topbar, /Buscar clínicas, especialidades ou exames/);
  assert.doesNotMatch(topbar, /\bSearch\b/);
  assert.doesNotMatch(topbar, /onProfile/);
  assert.doesNotMatch(topbar, /Meu perfil/);
  assert.doesNotMatch(topbar, /ChevronDown/);
  assert.match(topbar, /absolute right-0 top-8/);
  assert.doesNotMatch(topbar, /border-b/);
  assert.match(shell, /lg:pt-6/);
  assert.doesNotMatch(nav, /<strong className="block text-sm text\[\#243746\]">Meu perfil<\/strong>/);
});
