import assert from "node:assert/strict";
import test from "node:test";
import {
  canEnterStep,
  createBookingDraft,
  getNextStep,
  getPreviousStep,
  updateLocation,
  updateSchedule,
  updateService,
  updateUnit,
} from "./bookingFlow.ts";

test("changes to a specialty clear unit and schedule", () => {
  const current = {
    ...createBookingDraft(),
    cidade: "São Paulo",
    tipo: "consulta" as const,
    service: "Cardiologia",
    instituicaoId: "i1",
    profissionalId: "p1",
    data: "2026-10-07",
    horario: "09:00",
  };

  assert.deepEqual(updateService(current, "Dermatologia"), {
    ...current,
    service: "Dermatologia",
    instituicaoId: "",
    profissionalId: "",
    data: "",
    horario: "",
  });
});

test("advances from location only after a city", () => {
  assert.equal(getNextStep({ ...createBookingDraft(), cidade: "São Paulo" }, "localizacao"), "servico");
  assert.equal(getNextStep(createBookingDraft(), "localizacao"), "localizacao");
});

test("changing location clears unit and schedule selections", () => {
  const current = {
    ...createBookingDraft(),
    cidade: "São Paulo",
    latitude: -23.55,
    longitude: -46.63,
    instituicaoId: "i1",
    profissionalId: "p1",
    data: "2026-10-07",
    horario: "09:00",
  };

  assert.deepEqual(updateLocation(current, { cidade: "Campinas" }), {
    ...current,
    cidade: "Campinas",
    latitude: null,
    longitude: null,
    instituicaoId: "",
    profissionalId: "",
    data: "",
    horario: "",
  });
});

test("changing unit clears professional and schedule selections", () => {
  const current = {
    ...createBookingDraft(),
    tipo: "consulta" as const,
    service: "Cardiologia",
    instituicaoId: "i1",
    profissionalId: "p1",
    data: "2026-10-07",
    horario: "09:00",
  };

  assert.deepEqual(updateUnit(current, "i2"), {
    ...current,
    instituicaoId: "i2",
    profissionalId: "",
    data: "",
    horario: "",
  });
});

test("updating schedule stores an optional professional with date and time", () => {
  assert.deepEqual(
    updateSchedule(createBookingDraft(), { profissionalId: "p1", data: "2026-10-07", horario: "09:00" }),
    { ...createBookingDraft(), profissionalId: "p1", data: "2026-10-07", horario: "09:00" },
  );
});

test("exam appointments can advance without a professional", () => {
  const draft = {
    ...createBookingDraft(),
    tipo: "exame" as const,
    cidade: "São Paulo",
    service: "Hemograma",
    instituicaoId: "i1",
    data: "2026-10-07",
    horario: "09:00",
  };

  assert.equal(getNextStep(draft, "agenda"), "confirmar");
});

test("consultations need a professional before confirmation", () => {
  const draft = {
    ...createBookingDraft(),
    tipo: "consulta" as const,
    cidade: "São Paulo",
    service: "Cardiologia",
    instituicaoId: "i1",
    data: "2026-10-07",
    horario: "09:00",
  };

  assert.equal(getNextStep(draft, "agenda"), "agenda");
  assert.equal(getNextStep({ ...draft, profissionalId: "p1" }, "agenda"), "confirmar");
});

test("step access requires every preceding choice and previous-step lookup is stable", () => {
  const draft = { ...createBookingDraft(), cidade: "São Paulo" };

  assert.equal(canEnterStep(draft, "localizacao"), true);
  assert.equal(canEnterStep(draft, "servico"), true);
  assert.equal(canEnterStep(draft, "unidade"), false);
  assert.equal(canEnterStep({ ...draft, tipo: "consulta", service: "Cardiologia" }, "unidade"), true);
  assert.equal(getPreviousStep("localizacao"), "localizacao");
  assert.equal(getPreviousStep("agenda"), "unidade");
});
