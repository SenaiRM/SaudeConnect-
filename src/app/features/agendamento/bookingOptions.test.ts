import assert from "node:assert/strict";
import test from "node:test";
import { profissionais as networkProfessionals, type Instituicao, type Profissional } from "../../components/mockData.ts";
import { createBookingDraft } from "./bookingFlow.ts";
import { getBookableUnits, getScheduleGroups, getNetworkServices, getUnitDistanceKm, getUnitServices } from "./bookingOptions.ts";

const institutions: Instituicao[] = [
  { id: "i1", nome: "Clínica A", tipo: "clinica", endereco: "Rua A", telefone: "", horarioFuncionamento: "08h–18h", especialidades: ["Cardiologia"], ativo: true, avaliacao: 4 },
  { id: "i2", nome: "Clínica B", tipo: "clinica", endereco: "Rua B", telefone: "", horarioFuncionamento: "08h–18h", especialidades: ["Cardiologia"], ativo: true, avaliacao: 4 },
  { id: "i3", nome: "Laboratório A", tipo: "laboratorio", endereco: "Rua C", telefone: "", horarioFuncionamento: "07h–12h", especialidades: [], examesOferecidos: ["Hemograma"], ativo: true, avaliacao: 4 },
  { id: "i4", nome: "Laboratório B", tipo: "laboratorio", endereco: "Rua D", telefone: "", horarioFuncionamento: "07h–12h", especialidades: [], examesOferecidos: ["Hemograma"], ativo: true, avaliacao: 4 },
];
const professionals: Profissional[] = [
  { id: "p1", nome: "Dra. A", especialidade: "Cardiologia", crm: "CRM 1", instituicaoId: "i1", diasDisponiveis: ["Segunda"], disponivel: true },
  { id: "p2", nome: "Dr. B", especialidade: "Cardiologia", crm: "CRM 2", instituicaoId: "i2", diasDisponiveis: ["Terça"], disponivel: false },
];

test("omits a consultation unit with no available matching professional", () => {
  const draft = { ...createBookingDraft(), tipo: "consulta" as const, service: "Cardiologia" };
  assert.deepEqual(getBookableUnits(draft, institutions, [{ ...professionals[0], especialidade: "Dermatologia" }]).map((unit) => unit.id), []);
});

test("includes only compatible consultation units with an available specialist", () => {
  const draft = { ...createBookingDraft(), tipo: "consulta" as const, service: "Cardiologia" };
  assert.deepEqual(getBookableUnits(draft, institutions, professionals).map((unit) => unit.id), ["i1"]);
});

test("keeps only the preselected detail-page unit for exams", () => {
  const draft = { ...createBookingDraft(), tipo: "exame" as const, service: "Hemograma", preInstId: "i3" };
  assert.deepEqual(getBookableUnits(draft, institutions, professionals).map((unit) => unit.id), ["i3"]);
});

test("a preselected incompatible unit yields no options", () => {
  const draft = { ...createBookingDraft(), tipo: "exame" as const, service: "Hemograma", preInstId: "i1" };
  assert.deepEqual(getBookableUnits(draft, institutions, professionals), []);
});

test("unit filtering works without coordinates and requires a selected service", () => {
  const draft = { ...createBookingDraft(), cidade: "Campinas", tipo: "exame" as const, service: "Hemograma", latitude: null, longitude: null };
  assert.deepEqual(getBookableUnits(draft, institutions, professionals).map((unit) => unit.id), ["i3", "i4"]);
  assert.deepEqual(getBookableUnits({ ...draft, service: "" }, institutions, professionals), []);
});

test("distance is absent without both coordinate pairs and does not affect unit options", () => {
  const unit = { ...institutions[2], coords: { lat: -23.55, lng: -46.65 } };
  const draft = { ...createBookingDraft(), tipo: "exame" as const, service: "Hemograma", latitude: null, longitude: null };
  assert.equal(getUnitDistanceKm(draft, unit), null);
  assert.deepEqual(getBookableUnits(draft, [unit], professionals).map((item) => item.id), ["i3"]);
});

test("distance is calculated for a unit with coordinates", () => {
  const unit = { ...institutions[2], coords: { lat: 0, lng: 1 } };
  const draft = { ...createBookingDraft(), latitude: 0, longitude: 0 };
  const distance = getUnitDistanceKm(draft, unit);
  assert.ok(distance !== null && distance > 110 && distance < 112);
});

test("consultation schedule uses only available matching professionals and excludes booked times", () => {
  const draft = { ...createBookingDraft(), tipo: "consulta" as const, service: "Cardiologia", instituicaoId: "i1" };
  const providers: Profissional[] = [
    professionals[0],
    { ...professionals[0], id: "p2", nome: "Dra. B", especialidade: "Dermatologia" },
    { ...professionals[0], id: "p3", nome: "Dra. C", instituicaoId: "i2" },
    { ...professionals[0], id: "p4", nome: "Dra. D", disponivel: false },
  ];
  const groups = getScheduleGroups(draft, providers, [{
    tipo: "consulta", instituicaoId: "i1", profissionalId: "p1", data: "2026-09-29", horario: "09:00", status: "confirmado",
  }], new Date("2026-09-28T00:00:00"));
  assert.deepEqual(groups[0], { data: "2026-09-29", providerName: "Dra. A", professionalId: "p1", horarios: ["10:00", "11:00", "14:00", "15:00"] });
  assert.ok(groups.every((group) => group.professionalId === "p1"));
});

test("offers more than one matching professional when the unit has different doctors", () => {
  const draft = { ...createBookingDraft(), tipo: "consulta" as const, service: "Cardiologia", instituicaoId: "i1" };
  const names = new Set(getScheduleGroups(draft, networkProfessionals, [], new Date("2026-10-27T00:00:00")).map((group) => group.providerName));

  assert.deepEqual(names, new Set(["Dr. Carlos Mendes", "Dra. Beatriz Oliveira", "Dr. Felipe Azevedo"]));
});

test("exam schedule uses selected unit slots, omits professional and excludes booked times", () => {
  const draft = { ...createBookingDraft(), tipo: "exame" as const, service: "Hemograma", instituicaoId: "i3" };
  const groups = getScheduleGroups(draft, professionals, [{
    tipo: "exame", instituicaoId: "i3", data: "2026-09-29", horario: "07:30", status: "pendente",
  }], new Date("2026-09-28T00:00:00"));
  assert.deepEqual(groups[0], { data: "2026-09-29", horarios: ["07:00", "08:00", "08:30", "09:00"] });
  assert.ok(groups.every((group) => group.professionalId === undefined && group.providerName === undefined));
  assert.deepEqual(getScheduleGroups({ ...draft, instituicaoId: "i4" }, professionals, [], new Date("2026-09-28T00:00:00")), []);
});

test("schedule requires a selected service, type and unit", () => {
  const draft = createBookingDraft();
  assert.deepEqual(getScheduleGroups(draft, professionals, []), []);
  assert.deepEqual(getScheduleGroups({ ...draft, tipo: "consulta", service: "Cardiologia" }, professionals, []), []);
});

test("a unit offers only specialties with an available professional and its own exams", () => {
  assert.deepEqual(getUnitServices(institutions[0], professionals), { consulta: ["Cardiologia"], exame: [] });
  assert.deepEqual(getUnitServices(institutions[1], professionals), { consulta: [], exame: [] });
  assert.deepEqual(getUnitServices(institutions[2], professionals), { consulta: [], exame: ["Hemograma"] });
});

test("network services skip specialties without any available professional", () => {
  assert.deepEqual(getNetworkServices(institutions, professionals), { consulta: ["Cardiologia"], exame: ["Hemograma"] });
  assert.deepEqual(getNetworkServices([{ ...institutions[2], ativo: false }], professionals), { consulta: [], exame: [] });
});
