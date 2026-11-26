import assert from "node:assert/strict";
import test from "node:test";
import { getBookingProgress } from "./bookingProgress.ts";

test("reports each of the five steps as booking choices become complete", () => {
  const initial = { cidade: "", tipo: null, service: "", instituicaoId: "", profissionalId: "", data: "", horario: "" };

  assert.deepEqual(getBookingProgress(initial), { current: 1, total: 5, label: "Informe sua localização" });
  assert.deepEqual(getBookingProgress({ ...initial, cidade: "São Paulo" }), { current: 2, total: 5, label: "Escolha o atendimento" });
  assert.deepEqual(getBookingProgress({ ...initial, cidade: "São Paulo", tipo: "exame", service: "Hemograma Completo" }), { current: 3, total: 5, label: "Escolha a unidade" });
  assert.deepEqual(getBookingProgress({ ...initial, cidade: "São Paulo", tipo: "exame", service: "Hemograma Completo", instituicaoId: "i3" }), { current: 4, total: 5, label: "Escolha o horário" });
});

test("reports confirmation only after complete consultation selection", () => {
  const selected = { cidade: "São Paulo", tipo: "consulta", service: "Cardiologia", instituicaoId: "i1", profissionalId: "p1", data: "2026-10-07", horario: "09:00" };

  assert.deepEqual(getBookingProgress(selected), { current: 5, total: 5, label: "Confirme seu agendamento" });
  assert.deepEqual(getBookingProgress({ ...selected, profissionalId: "" }), { current: 4, total: 5, label: "Escolha o profissional e horário" });
});
