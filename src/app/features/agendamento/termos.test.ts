import assert from "node:assert/strict";
import test from "node:test";

import { TERMOS_TEXTO, TERMOS_VERSAO, podeConfirmar, registrarAceite } from "./termos.ts";

test("o aceite guarda versão e momento", () => {
  const aceite = registrarAceite(new Date(2026, 9, 28, 14, 30));

  assert.equal(aceite.aceito, true);
  assert.equal(aceite.versao, TERMOS_VERSAO);
  assert.equal(aceite.aceitoEm, new Date(2026, 9, 28, 14, 30).toISOString());
});

test("sem marcar a caixa não dá para confirmar", () => {
  assert.equal(podeConfirmar(false), false);
  assert.equal(podeConfirmar(true), true);
});

test("os termos têm cláusulas e falam de livre e espontânea vontade", () => {
  assert.ok(TERMOS_TEXTO.length >= 3);
  assert.ok(TERMOS_TEXTO.every((clausula) => clausula.trim().length > 0));
});
