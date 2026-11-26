import assert from "node:assert/strict";
import test from "node:test";

import { estaNoPassado, ordenarPorMomento, separarAgenda } from "./agendaView.ts";

const agora = new Date(2026, 9, 28, 10, 0);

const base = { tipo: "consulta" as const, instituicaoId: "i1", profissionalId: "p1" };

test("um atendimento cujo horário já passou hoje conta como passado", () => {
  assert.equal(estaNoPassado({ data: "2026-10-28", horario: "09:00" }, agora), true);
  assert.equal(estaNoPassado({ data: "2026-10-28", horario: "11:00" }, agora), false);
});

test("próximos não inclui agendamento ativo com data vencida", () => {
  const { proximos, historico } = separarAgenda([
    { ...base, id: "a1", data: "2026-10-20", horario: "09:00", status: "confirmado" },
    { ...base, id: "a2", data: "2026-10-29", horario: "09:00", status: "confirmado" },
  ], agora);

  assert.deepEqual(proximos.map((a) => a.id), ["a2"]);
  assert.deepEqual(historico.map((a) => a.id), ["a1"]);
});

test("cancelado e realizado vão para o histórico mesmo no futuro", () => {
  const { proximos, historico } = separarAgenda([
    { ...base, id: "a1", data: "2026-11-10", horario: "09:00", status: "cancelado" },
    { ...base, id: "a2", data: "2026-11-11", horario: "09:00", status: "realizado" },
  ], agora);

  assert.deepEqual(proximos, []);
  // O histórico sai do mais recente para o mais antigo.
  assert.deepEqual(historico.map((a) => a.id), ["a2", "a1"]);
});

test("próximos saem do mais cedo para o mais tarde", () => {
  const { proximos } = separarAgenda([
    { ...base, id: "a2", data: "2026-10-30", horario: "08:00", status: "confirmado" },
    { ...base, id: "a1", data: "2026-10-29", horario: "16:00", status: "pendente" },
  ], agora);

  assert.deepEqual(proximos.map((a) => a.id), ["a1", "a2"]);
});

test("o histórico desempata pelo horário, não só pela data", () => {
  const { historico } = separarAgenda([
    { ...base, id: "manha", data: "2026-10-20", horario: "08:00", status: "realizado" },
    { ...base, id: "tarde", data: "2026-10-20", horario: "15:00", status: "realizado" },
  ], agora);

  assert.deepEqual(historico.map((a) => a.id), ["tarde", "manha"]);
});

test("ordenar por momento é estável e crescente", () => {
  const ordenado = ordenarPorMomento([
    { data: "2026-10-29", horario: "14:00" },
    { data: "2026-10-29", horario: "09:00" },
    { data: "2026-10-28", horario: "23:00" },
  ]);

  assert.deepEqual(ordenado.map((a) => `${a.data} ${a.horario}`), [
    "2026-10-28 23:00",
    "2026-10-29 09:00",
    "2026-10-29 14:00",
  ]);
});
