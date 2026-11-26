import assert from "node:assert/strict";
import test from "node:test";

import { appointmentTime, diffEmDias, parseLocalDate, somarDias, toLocalISODate } from "./dates.ts";

test("às 23h a data local não vira o dia seguinte", () => {
  assert.equal(toLocalISODate(new Date(2026, 9, 28, 23, 30)), "2026-10-28");
});

test("à meia-noite a data local é o novo dia", () => {
  assert.equal(toLocalISODate(new Date(2026, 9, 29, 0, 5)), "2026-10-29");
});

test("dia e mês saem com dois dígitos", () => {
  assert.equal(toLocalISODate(new Date(2026, 0, 3)), "2026-01-03");
});

test("a data é interpretada ao meio-dia local", () => {
  const data = parseLocalDate("2026-10-28");
  assert.equal(data.getDate(), 28);
  assert.equal(data.getMonth(), 9);
  assert.equal(data.getHours(), 12);
});

test("o momento do agendamento junta data e horário", () => {
  assert.equal(appointmentTime("2026-10-28", "14:30"), new Date(2026, 9, 28, 14, 30).getTime());
});

test("a diferença em dias atravessa a virada de mês", () => {
  assert.equal(diffEmDias("2026-10-28", "2026-11-02"), 5);
  assert.equal(diffEmDias("2026-11-02", "2026-10-28"), -5);
});

test("somar dias atravessa a virada de mês", () => {
  assert.equal(somarDias("2026-10-30", 3), "2026-11-02");
});
