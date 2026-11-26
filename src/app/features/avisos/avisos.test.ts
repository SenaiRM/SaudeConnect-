import assert from "node:assert/strict";
import test from "node:test";

import { criarGeradorDeId, filtrarPorPapel, marcarTodasLidas } from "./avisos.ts";

const aviso = (extra: Record<string, unknown>) => ({
  id: "n0", titulo: "t", mensagem: "m", tipo: "info", data: "2026-10-28", lida: false, ...extra,
});

test("o gerador nunca repete um id, mesmo no mesmo milissegundo", () => {
  const gerar = criarGeradorDeId("n");
  const ids = [gerar(), gerar(), gerar()];

  assert.equal(new Set(ids).size, 3);
});

test("o gerador não colide com os ids que já existem", () => {
  const gerar = criarGeradorDeId("a", ["a1", "a2", "a3"]);

  assert.ok(!["a1", "a2", "a3"].includes(gerar()));
});

test("dois geradores independentes não produzem o mesmo id", () => {
  const umaAba = criarGeradorDeId("n");
  const outraAba = criarGeradorDeId("n");

  assert.notEqual(umaAba(), outraAba());
});

test("a secretaria não vê os avisos do paciente", () => {
  const avisos = [
    aviso({ id: "n1", destinatario: "paciente", usuarioId: "u1" }),
    aviso({ id: "n2", destinatario: "secretaria" }),
  ];

  assert.deepEqual(filtrarPorPapel(avisos, { papel: "secretaria" }).map((n) => n.id), ["n2"]);
});

test("um aviso sem destinatário não vaza para a secretaria", () => {
  const avisos = [aviso({ id: "n1", usuarioId: "u1" })];

  assert.deepEqual(filtrarPorPapel(avisos, { papel: "secretaria" }), []);
});

test("o paciente só vê os avisos dele", () => {
  const avisos = [
    aviso({ id: "n1", destinatario: "paciente", usuarioId: "u1" }),
    aviso({ id: "n2", destinatario: "paciente", usuarioId: "u9" }),
    aviso({ id: "n3", destinatario: "secretaria" }),
  ];

  assert.deepEqual(filtrarPorPapel(avisos, { papel: "usuario", usuarioId: "u1" }).map((n) => n.id), ["n1"]);
});

test("um aviso sem dono não é entregue a qualquer paciente", () => {
  const avisos = [aviso({ id: "n1", destinatario: "paciente" })];

  assert.deepEqual(filtrarPorPapel(avisos, { papel: "usuario", usuarioId: "u1" }), []);
});

test("a secretaria só vê os avisos da unidade dela", () => {
  const avisos = [
    aviso({ id: "n1", destinatario: "secretaria", instituicaoId: "i1" }),
    aviso({ id: "n2", destinatario: "secretaria", instituicaoId: "i3" }),
  ];

  assert.deepEqual(filtrarPorPapel(avisos, { papel: "secretaria", instituicaoId: "i1" }).map((n) => n.id), ["n1"]);
});

test("marcar todas como lidas não toca nos avisos do outro papel", () => {
  const avisos = [
    aviso({ id: "n1", destinatario: "paciente", usuarioId: "u1" }),
    aviso({ id: "n2", destinatario: "secretaria" }),
  ];
  const visiveis = filtrarPorPapel(avisos, { papel: "usuario", usuarioId: "u1" });

  const resultado = marcarTodasLidas(avisos, visiveis);

  assert.equal(resultado.find((n) => n.id === "n1")?.lida, true);
  assert.equal(resultado.find((n) => n.id === "n2")?.lida, false);
});
