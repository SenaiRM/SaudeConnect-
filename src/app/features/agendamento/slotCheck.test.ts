import assert from "node:assert/strict";
import test from "node:test";

import { impedimentosParaConfirmar, isSlotDisponivel } from "./slotCheck.ts";

test("confirmação: médico que não atende no dia (29/10/2026 é quinta) é barrado; o próprio pedido não bloqueia", () => {
  const p = { id: "a1", tipo: "consulta" as const, instituicaoId: "i1", profissionalId: "p1", data: "2026-10-29", horario: "09:00" };
  const proprio = [{ ...p, status: "pendente" }];
  const medico = { nome: "Dr. X", disponivel: true, diasDisponiveis: ["Quinta"] };
  assert.deepEqual(impedimentosParaConfirmar(p, proprio, medico, new Date(2026, 9, 28)), []);
  assert.equal(impedimentosParaConfirmar(p, proprio, { ...medico, diasDisponiveis: ["Segunda"] }, new Date(2026, 9, 28)).length, 1);
  assert.equal(impedimentosParaConfirmar(p, [...proprio, { ...p, id: "a2", status: "confirmado" }], medico, new Date(2026, 9, 28)).length, 1);
});

const agora = new Date(2026, 9, 28, 10, 0);

const pedido = {
  tipo: "consulta" as const,
  instituicaoId: "i1",
  profissionalId: "p1",
  data: "2026-10-29",
  horario: "09:00",
};

test("horário livre é aceito", () => {
  assert.equal(isSlotDisponivel(pedido, [], agora), true);
});

test("horário tomado por OUTRO paciente é recusado", () => {
  const ocupado = [{ ...pedido, usuarioId: "u9", status: "confirmado" }];

  assert.equal(isSlotDisponivel(pedido, ocupado, agora), false);
});

test("horário de um agendamento cancelado volta a ficar livre", () => {
  const cancelado = [{ ...pedido, usuarioId: "u9", status: "cancelado" }];

  assert.equal(isSlotDisponivel(pedido, cancelado, agora), true);
});

test("exame ocupa a unidade inteira, independentemente do profissional", () => {
  const exame = { ...pedido, tipo: "exame" as const, profissionalId: undefined };
  const ocupado = [{ ...exame, profissionalId: "p7", usuarioId: "u9", status: "pendente" }];

  assert.equal(isSlotDisponivel(exame, ocupado, agora), false);
});

test("horário que já passou é recusado", () => {
  assert.equal(isSlotDisponivel({ ...pedido, data: "2026-10-28", horario: "09:00" }, [], agora), false);
});

test("o próprio agendamento pode ser ignorado ao reagendar", () => {
  const meu = [{ ...pedido, id: "a1", usuarioId: "u1", status: "confirmado" }];

  assert.equal(isSlotDisponivel(pedido, meu, agora, "a1"), true);
  assert.equal(isSlotDisponivel(pedido, meu, agora), false);
});
