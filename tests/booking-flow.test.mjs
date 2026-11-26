import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("booking filters present one guided stage at a time", async () => {
  const filters = await readFile("src/app/features/agendamento/BookingFilters.tsx", "utf8");

  assert.match(filters, /Etapa \{step\} de 4/);
  assert.match(filters, /Etapa concluída/);
  assert.match(filters, /Alterar/);
});

test("quick actions and mobile navigation start booking directly", async () => {
  const home = await readFile("src/app/components/TelaHome.tsx", "utf8");
  const app = await readFile("src/app/App.tsx", "utf8");
  const nav = await readFile("src/app/components/BottomNav.tsx", "utf8");

  assert.match(home, /onStartBooking/);
  assert.match(home, /onStartBooking\(type\)/);
  assert.match(app, /preTipo/);
  assert.match(nav, /label: "Agendar"/);
});

test("booking relies on the app navigation and does not render a redundant back action", async () => {
  const booking = await readFile("src/app/components/TelaAgendar.tsx", "utf8");

  assert.doesNotMatch(booking, /onBack/);
  assert.doesNotMatch(booking, /Voltar/);
  assert.doesNotMatch(booking, /DashboardPageHeader[^>]*action=/);
});
