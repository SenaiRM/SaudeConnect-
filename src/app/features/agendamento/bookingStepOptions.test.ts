import assert from "node:assert/strict";
import test from "node:test";
import { filterBookingServices, getMostSearched, groupByInitial, serviceDescription } from "./bookingStepOptions.ts";

test("service search ignores case and accents within the selected type", () => {
  assert.deepEqual(filterBookingServices("consulta", "clinica"), ["Clínica Geral"]);
  assert.deepEqual(filterBookingServices("exame", "RAIO"), ["Raio-X"]);
});

test("service list stays empty before selecting a type", () => {
  assert.deepEqual(filterBookingServices(null, ""), []);
});

test("services are grouped alphabetically by initial letter", () => {
  assert.deepEqual(groupByInitial(["Pediatria", "Cardiologia", "Clínica Geral", "Ortopedia"]), [
    { letter: "C", items: ["Cardiologia", "Clínica Geral"] },
    { letter: "O", items: ["Ortopedia"] },
    { letter: "P", items: ["Pediatria"] },
  ]);
});

test("accented initials share the plain letter group", () => {
  assert.deepEqual(groupByInitial(["Úlcera", "Ultrassom"]).map((group) => group.letter), ["U"]);
});

test("most searched keeps only services that exist for the type", () => {
  assert.ok(getMostSearched("consulta").every((item) => filterBookingServices("consulta", "").includes(item)));
  assert.ok(getMostSearched("exame").length > 0);
  assert.deepEqual(getMostSearched(null), []);
});

test("every consultation and exam has a short description", () => {
  assert.ok(filterBookingServices("consulta", "").every((item) => serviceDescription("consulta", item)));
  assert.ok(filterBookingServices("exame", "").every((item) => serviceDescription("exame", item)));
});
