# Sequential Booking Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-page booking form with a five-step, reference-inspired SaúdeConnect+ booking journey.

**Architecture:** `TelaAgendar` owns a single `BookingDraft` and renders exactly one step component at a time. Pure transition, validation and reset behavior lives in `bookingFlow.ts`; UI components receive current state and explicit callbacks.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Lucide React, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-28-agendamento-sequencial-design.md`

## Global Constraints

- Keep SaúdeConnect+ branding and demonstration data; never copy Hapvida identity, patient data or teleconsultation promotion.
- Render exactly five steps: Localização, Especialidade, Unidade, Profissional/Horário and Confirmar.
- Request browser location only from the explicit button; manual city selection always works.
- An upstream change clears affected downstream fields and asks confirmation before discarding unit or schedule data.
- Google Maps rendering remains out of scope until billing and the production Vercel URL exist.
- Preserve the `onConfirmar` payload and status `pendente`.

## Review Focus

- Geolocation denial leaves manual city selection usable; Task 2.
- Specialty change clears selected unit and schedule; Task 1.
- Consultation unit without matching available provider is hidden; Task 3.
- Examination does not require a professional but needs unit/date/time; Task 4.
- Detail-page preselected unit remains the only available unit; Task 5.

---

## File Structure

- `src/app/features/agendamento/bookingFlow.ts` and `.test.ts`: five-step types, transitions, validation and reset tests.
- `src/app/features/agendamento/bookingOptions.ts` and `.test.ts`: compatible-unit and schedule-group logic/tests.
- `src/app/features/agendamento/BookingProgress.tsx`: reference-inspired five-step header.
- `src/app/features/agendamento/BookingSummary.tsx`: selected values and edit actions.
- `src/app/features/agendamento/steps/BookingLocationStep.tsx`: city/location selection.
- `src/app/features/agendamento/steps/BookingServiceStep.tsx`: consultation/exam and specialty choice.
- `src/app/features/agendamento/steps/BookingUnitStep.tsx`: compatible unit cards.
- `src/app/features/agendamento/steps/BookingScheduleStep.tsx`: date-grouped agenda.
- `src/app/features/agendamento/steps/BookingConfirmationStep.tsx`: final review and submission.
- `src/app/components/TelaAgendar.tsx`: wizard controller replacing accordion and modal.
- `src/app/features/agendamento/bookingProgress.ts` and `.test.ts`: five-step progress wording.
- `package.json`: test script includes all booking tests.

### Task 1: Pure five-step state model

**Files:** Create `src/app/features/agendamento/bookingFlow.ts`, `src/app/features/agendamento/bookingFlow.test.ts`; modify `src/app/features/agendamento/bookingTypes.ts`, `package.json`.

**Interfaces:** Produces `BookingStep`, `BookingDraft`, `createBookingDraft`, `getNextStep`, `getPreviousStep`, `updateLocation`, `updateService`, `updateUnit`, `updateSchedule`, `canEnterStep`.

- [ ] **Step 1: Write failing tests for advance and reset behavior.**

```ts
test("changes to a specialty clear unit and schedule", () => {
  const current = { ...createBookingDraft(), cidade: "São Paulo", tipo: "consulta" as const, service: "Cardiologia", instituicaoId: "i1", profissionalId: "p1", data: "2026-10-07", horario: "09:00" };
  assert.deepEqual(updateService(current, "Dermatologia"), { ...current, service: "Dermatologia", instituicaoId: "", profissionalId: "", data: "", horario: "" });
});
test("advances from location only after a city", () => {
  assert.equal(getNextStep({ ...createBookingDraft(), cidade: "São Paulo" }, "localizacao"), "servico");
  assert.equal(getNextStep(createBookingDraft(), "localizacao"), "localizacao");
});
```

- [ ] **Step 2: Run `npm test`; expect failure because `bookingFlow.ts` does not exist.**

- [ ] **Step 3: Implement the minimal transition API.**

```ts
export type BookingStep = "localizacao" | "servico" | "unidade" | "agenda" | "confirmar";
export function updateService(draft: BookingDraft, service: string): BookingDraft {
  return { ...draft, service, instituicaoId: "", profissionalId: "", data: "", horario: "" };
}
export function getNextStep(draft: BookingDraft, step: BookingStep): BookingStep {
  if (step === "localizacao") return draft.cidade ? "servico" : step;
  if (step === "servico") return draft.tipo && draft.service ? "unidade" : step;
  if (step === "unidade") return draft.instituicaoId ? "agenda" : step;
  return step === "agenda" && draft.data && draft.horario && (draft.tipo === "exame" || draft.profissionalId) ? "confirmar" : step;
}
```

- [ ] **Step 4: Add tests for `updateLocation`, `updateUnit`, `updateSchedule` and the exam advance condition; run `npm test` and expect pass.**
- [ ] **Step 5: Commit with `git add package.json src/app/features/agendamento/bookingTypes.ts src/app/features/agendamento/bookingFlow.ts src/app/features/agendamento/bookingFlow.test.ts` followed by `git commit -m "feat: add sequential booking state"`.**

### Task 2: Progress, location and service screens

**Files:** Create `BookingProgress.tsx`, `steps/BookingLocationStep.tsx`, `steps/BookingServiceStep.tsx` under `src/app/features/agendamento/`.

**Interfaces:** Consumes Task 1 state. Produces a `BookingProgress` with `current`, `onBack`, `onGoTo`; a location callback `{ cidade, latitude, longitude }`; and service callback `(tipo, service) => void`.

- [ ] **Step 1: Define the exact five visible labels.**

```ts
export const BOOKING_STEPS = [
  { id: "localizacao", label: "Localização" },
  { id: "servico", label: "Especialidade" },
  { id: "unidade", label: "Unidade" },
  { id: "agenda", label: "Profissional" },
  { id: "confirmar", label: "Confirmar" },
] as const;
```

- [ ] **Step 2: Render back action, page title and horizontally scrollable five-step indicator.** Completed prior steps may be clicked; future steps are disabled.
- [ ] **Step 3: Build manual-first location selection.** The explicit button calls `navigator.geolocation.getCurrentPosition`; error copy is “Não foi possível usar sua localização. Escolha a cidade manualmente.” The city input and Continue button remain active without coordinates.
- [ ] **Step 4: Build standalone type/service selection.** Render Consulta/Exame then searchable `especialidades`/`tiposExame`; selecting one advances to Unidade rather than rendering units in the same page.
- [ ] **Step 5: Build and manually verify denial + manual-city paths, then commit with message `feat: add booking location and service steps`.**

### Task 3: Compatible-unit page

**Files:** Create `bookingOptions.ts`, `bookingOptions.test.ts`, `BookingSummary.tsx`, `steps/BookingUnitStep.tsx`.

**Interfaces:** Produces `getBookableUnits(draft, institutions, professionals)` and unit callback `(institutionId: string) => void`.

- [ ] **Step 1: Write failing unit tests.**

```ts
test("omits a consultation unit with no matching professional", () => {
  const result = getBookableUnits({ ...draft, tipo: "consulta", service: "Cardiologia" }, institutions, [{ ...professionals[0], especialidade: "Dermatologia", disponivel: true }]);
  assert.equal(result.length, 0);
});
test("keeps only the preselected detail-page unit", () => {
  assert.deepEqual(getBookableUnits({ ...draft, tipo: "exame", service: "Hemograma", preInstId: "i1" }, institutions, professionals).map((unit) => unit.id), ["i1"]);
});
```

- [ ] **Step 2: Run `npm test`; expect missing `getBookableUnits`.**
- [ ] **Step 3: Implement filtering.**

```ts
export function getBookableUnits(draft: BookingDraft, institutions: Instituicao[], professionals: Profissional[]) {
  return getCompatibleInstitutions(draft.tipo!, draft.service, institutions)
    .filter((unit) => !draft.preInstId || unit.id === draft.preInstId)
    .filter((unit) => draft.tipo === "exame" || professionals.some((p) => p.instituicaoId === unit.id && p.disponivel && p.especialidade === draft.service));
}
```

- [ ] **Step 4: Render unit cards with name, type, address, hours, optional distance and selection.** Render empty-state/back action when no unit exists. Show editable Location and Specialty rows through `BookingSummary`.
- [ ] **Step 5: Run `npm test; npm run build` and commit with message `feat: add compatible unit selection`.**

### Task 4: Date-grouped schedule page

**Files:** Modify `bookingOptions.ts`, `bookingOptions.test.ts`; create `steps/BookingScheduleStep.tsx`.

**Interfaces:** Produces `getScheduleGroups(draft, professionals, appointments): { data: string; providerName?: string; professionalId?: string; horarios: string[] }[]`.

- [ ] **Step 1: Write failing consultation/exam agenda tests.**

```ts
test("groups consultation availability by professional", () => {
  assert.equal(getScheduleGroups({ ...draft, tipo: "consulta", service: "Cardiologia", instituicaoId: "i1" }, professionals, []).every((group) => Boolean(group.professionalId)), true);
});
test("returns examination slots without a professional", () => {
  assert.equal(getScheduleGroups({ ...draft, tipo: "exame", service: "Hemograma", instituicaoId: "i1" }, professionals, []).every((group) => group.professionalId === undefined), true);
});
```

- [ ] **Step 2: Run `npm test`; expect missing `getScheduleGroups`.**
- [ ] **Step 3: Implement groups using `agendaProfissional`/`agendaInstituicao`, `demoSlotsInTheFuture` and `getAvailableSlots`.** Consultations include matching provider IDs; exams omit them; booked slots are excluded.
- [ ] **Step 4: Render `Datas mais próximas`, a date filter, date headings, provider names, time buttons and editable summary.** Selecting a time saves `{ profissionalId, data, horario }` and moves to Confirmar.
- [ ] **Step 5: Run `npm test; npm run build` and commit with message `feat: add grouped booking schedule`.**

### Task 5: Wizard controller and confirmation

**Files:** Create `steps/BookingConfirmationStep.tsx`; modify `TelaAgendar.tsx`, `bookingProgress.ts`, `bookingProgress.test.ts`.

**Interfaces:** Consumes all prior task interfaces and existing `TelaAgendarProps`; produces current `onConfirmar` payload with status `pendente`.

- [ ] **Step 1: Replace the existing progress test with a five-step completion test.**

```ts
test("reports confirmation only after complete selection", () => {
  assert.deepEqual(getBookingProgress({ tipo: "consulta", service: "Cardiologia", instituicaoId: "i1", profissionalId: "p1", data: "2026-10-07", horario: "09:00", cidade: "São Paulo" }), { current: 5, total: 5, label: "Confirme seu agendamento" });
});
```

- [ ] **Step 2: Run `npm test`; expect failure until four-step semantics are removed.**
- [ ] **Step 3: Replace accordion/modal rendering with one controlled branch per step.**

```tsx
{step === "localizacao" && <BookingLocationStep onContinue={(location) => { setDraft(updateLocation(draft, location)); setStep("servico"); }} />}
{step === "servico" && <BookingServiceStep onContinue={(tipo, service) => { setDraft(updateService({ ...draft, tipo }, service)); setStep("unidade"); }} />}
{step === "unidade" && <BookingUnitStep draft={draft} onContinue={(id) => { setDraft(updateUnit(draft, id)); setStep("agenda"); }} />}
{step === "agenda" && <BookingScheduleStep draft={draft} onContinue={(choice) => { setDraft(updateSchedule(draft, choice)); setStep("confirmar"); }} />}
{step === "confirmar" && <BookingConfirmationStep draft={draft} onConfirm={confirm} />}
```

Show confirmation before applying an upstream reset that discards unit/schedule information; keep the existing success screen after submit.

- [ ] **Step 4: Run `npm test; npm run build`; manually verify consultation, examination and preselected-unit flows in local preview.**
- [ ] **Step 5: Commit with `git add src/app/components/TelaAgendar.tsx src/app/features/agendamento/bookingProgress.ts src/app/features/agendamento/bookingProgress.test.ts src/app/features/agendamento/steps/BookingConfirmationStep.tsx` followed by `git commit -m "feat: complete sequential booking journey"`.**

## Self-Review

- Spec coverage: Tasks 1–5 cover five pages, progress, reset confirmation, manual geolocation fallback, compatible units, agenda, review and pending submission.
- Placeholder scan: no TODO, TBD or deferred implementation marker appears.
- Type consistency: Task 1 defines `BookingDraft`, `BookingStep` and transitions consumed in Tasks 2–5.
- Review Focus coverage: denial Task 2; reset Task 1; unavailable provider Task 3; examination Task 4; preselected unit Task 5.
