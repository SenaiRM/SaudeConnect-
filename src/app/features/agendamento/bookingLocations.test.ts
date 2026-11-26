import assert from "node:assert/strict";
import test from "node:test";
import { citiesOf, findNearestCity, normalizeSearch, searchByName, splitUnitsByCity, UFS } from "./bookingLocations.ts";

const units = [
  { id: "i1", cidade: "São Paulo", uf: "SP", coords: { lat: -23.5616, lng: -46.656 } },
  { id: "i2", cidade: "Campinas", uf: "SP", coords: { lat: -22.9056, lng: -47.0608 } },
  { id: "i3" },
];

test("lists every Brazilian state once", () => {
  assert.equal(UFS.length, 27);
  assert.equal(new Set(UFS.map((uf) => uf.sigla)).size, 27);
});

test("each state offers at least its capital", () => {
  assert.ok(UFS.every((uf) => citiesOf(uf.sigla).length > 0));
  assert.ok(citiesOf("SP").includes("São Paulo"));
});

test("search ignores accents and case", () => {
  assert.equal(normalizeSearch("  São PAULO "), "sao paulo");
  assert.deepEqual(searchByName(["São Paulo", "Santos", "Campinas"], "sao"), ["São Paulo"]);
  assert.deepEqual(searchByName(["São Paulo", "Santos"], ""), ["São Paulo", "Santos"]);
});

test("nearest city comes from the closest unit within range", () => {
  assert.deepEqual(findNearestCity({ latitude: -23.55, longitude: -46.64 }, units), { cidade: "São Paulo", estado: "SP" });
  assert.equal(findNearestCity({ latitude: -3.1, longitude: -60.0 }, units), null);
});

test("units are split between the chosen city and other locations", () => {
  const { inCity, others } = splitUnitsByCity(units, { cidade: "Campinas", estado: "SP" });
  assert.deepEqual(inCity.map((unit) => unit.id), ["i2", "i3"]);
  assert.deepEqual(others.map((unit) => unit.id), ["i1"]);
});

test("device location keeps every unit in the main list", () => {
  const { inCity, others } = splitUnitsByCity(units, { cidade: "São Paulo", estado: "SP", latitude: -23.55, longitude: -46.64 });
  assert.equal(inCity.length, 3);
  assert.equal(others.length, 0);
});
