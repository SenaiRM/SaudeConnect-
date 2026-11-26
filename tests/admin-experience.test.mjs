import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("secretaria signs into the management dashboard instead of patient home", async () => {
  const app = await readFile("src/app/App.tsx", "utf8");

  assert.match(app, /u\.role === "secretaria" \? "gestao" : "home"/);
});

test("secretaria sees her own unit agenda, not the whole network", async () => {
  const app = await readFile("src/app/App.tsx", "utf8");

  assert.match(app, /user\?\.role === "secretaria" \? agendaDaUnidade : userAgendamentos/);
  assert.match(app, /a\.instituicaoId === user\.instituicaoId/);
});

test("management uses the shared dashboard language", async () => {
  const screen = await readFile("src/app/components/TelaGestao.tsx", "utf8");

  assert.match(screen, /DashboardPageHeader/);
  assert.match(screen, /MetricCard/);
  assert.match(screen, /SectionCard/);
  assert.doesNotMatch(screen, /linear-gradient\(135deg, #243746, #3d5040\)/);
  assert.doesNotMatch(screen, /Meu perfil/);
});
