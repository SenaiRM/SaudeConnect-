import assert from "node:assert/strict";
import test from "node:test";
import { historyLabels } from "./historyView.ts";

test("todos os eventos compartilhados entre paciente e secretaria têm apresentação", () => {
  for (const type of ["criado", "confirmado", "reagendado", "reagendamento_confirmado", "cancelado"] as const) {
    assert.ok(historyLabels[type].title);
    assert.ok(historyLabels[type].description);
  }
});
