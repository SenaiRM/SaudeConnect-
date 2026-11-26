import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("booking centers available providers and times instead of a multi-step form", async () => {
  const screen = await readFile("src/app/components/TelaAgendar.tsx", "utf8");

  assert.match(screen, /Resultados disponíveis/);
  assert.match(screen, /availableResults/);
  assert.match(screen, /Confirmar este horário/);
  assert.doesNotMatch(screen, /BookingFilters/);
  assert.doesNotMatch(screen, /BookingSummary/);
});

test("booking confirmation is presented in a compact dialog", async () => {
  const screen = await readFile("src/app/components/TelaAgendar.tsx", "utf8");

  assert.match(screen, /role="dialog"/);
  assert.match(screen, /Confirmar agendamento/);
});

test("booking uses a compact search-and-results hierarchy", async () => {
  const screen = await readFile("src/app/components/TelaAgendar.tsx", "utf8");

  assert.match(screen, /Buscar especialidade, profissional ou local/);
  assert.match(screen, /Resultados disponíveis/);
  assert.match(screen, /searchTerm/);
});
