import assert from "node:assert/strict";
import test from "node:test";
import { latestChangedUnit } from "./demoUnit.ts";

test("secretaria demo abre a unidade do reagendamento mais recente", () => {
  const appointments = [
    { id: "pendente", instituicaoId: "i1", status: "pendente" },
    { id: "remarcado", instituicaoId: "i3", status: "reagendamento" },
  ];
  const events = [{ agendamentoId: "remarcado", data: "2026-11-18T12:00:00Z" }];
  assert.equal(latestChangedUnit(appointments, events), "i3");
});
