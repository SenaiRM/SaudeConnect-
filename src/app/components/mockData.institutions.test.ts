import assert from "node:assert/strict";
import test from "node:test";
import { agendaInstituicao, instituicoes } from "./mockData.ts";

test("offers exam laboratories in several cities while preserving a city without exams", () => {
  const citiesWithExams = new Set(instituicoes
    .filter((unit) => unit.tipo === "laboratorio" && (unit.examesOferecidos?.length ?? 0) > 0)
    .map((unit) => unit.cidade));

  assert.deepEqual(citiesWithExams, new Set(["Anápolis", "São Paulo", "Campinas", "Goiânia", "Brasília"]));
  assert.equal(instituicoes.some((unit) => unit.cidade === "Santos"), true);
  assert.equal(instituicoes.filter((unit) => unit.cidade === "Santos").some((unit) => (unit.examesOferecidos?.length ?? 0) > 0), false);
  assert.equal(["i3", "i10", "i11", "i12", "i13"].every((id) => agendaInstituicao[id]?.length), true);
  assert.equal(instituicoes.every((unit) => unit.ativo && Boolean(unit.coords)), true);
});
