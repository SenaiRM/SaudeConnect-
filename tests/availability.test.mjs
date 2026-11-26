import assert from "node:assert/strict";
import test from "node:test";
import { getAvailableSlots } from "../src/app/features/agendamento/availability.ts";

test("removes past and already booked consultation times", () => {
  const result = getAvailableSlots({
    tipo: "consulta",
    instituicaoId: "i1",
    profissionalId: "p1",
    slots: [{ data: "2026-09-16", horarios: ["09:00", "14:00"] }],
    agendamentos: [{ tipo: "consulta", instituicaoId: "i1", profissionalId: "p1", data: "2026-09-16", horario: "14:00", status: "confirmado" }],
    now: new Date("2026-09-16T10:00:00"),
  });

  assert.deepEqual(result, []);
});

test("filters exam reservations by institution without professional", () => {
  const result = getAvailableSlots({
    tipo: "exame",
    instituicaoId: "i3",
    slots: [{ data: "2026-09-17", horarios: ["08:00", "08:30"] }],
    agendamentos: [{ tipo: "exame", instituicaoId: "i3", data: "2026-09-17", horario: "08:00", status: "pendente" }],
    now: new Date("2026-09-16T12:00:00"),
  });

  assert.deepEqual(result, [{ data: "2026-09-17", horarios: ["08:30"] }]);
});
