# Global Easy Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Easy Mode simplify every patient page while retaining every existing action.

**Architecture:** `App.tsx` remains the single persisted toggle owner and passes `modoFacil` to the screens. Each screen provides an explicit easy-mode view instead of relying only on global font overrides.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-29-instituicoes-modo-facil-design.md`

## Global Constraints

- Easy Mode preserves scheduling, details, cancellation, rescheduling, profile editing and navigation.
- Agenda prioritizes next appointment and large reschedule/cancel actions.
- Institutions retain search/filter but use larger, simpler cards.
- Booking shows one decision per page with clear back/continue controls.
- Profile retains all settings in large, direct blocks.

## Review Focus

- Toggling must persist after reload; Task 1.
- Each easy screen must expose every normal action; Tasks 2–4.
- Admin behavior must remain unchanged; Task 1.
- No easy screen may hide cancel/reschedule; Task 2.
- Keyboard focus remains visible on enlarged controls; Tasks 2–4.

---

### Task 1: Make Easy Mode available to all screens

**Files:** Modify `src/app/App.tsx`; create `src/app/features/accessibility/easyMode.test.ts`.

- [ ] **Step 1: Write a failing persistence test.**

```ts
test("stores the enabled easy-mode setting", () => {
  const storage = new Map<string, string>();
  setStoredEasyMode(storage, true);
  assert.equal(getStoredEasyMode(storage), true);
});
```

- [ ] **Step 2: Run `npm test`; expect missing helper failure.**
- [ ] **Step 3: Extract safe storage helpers and pass `modoFacil` to Agenda, Institutions and Booking.** Preserve normal/admin screens and the existing Profile toggle.
- [ ] **Step 4: Run `npm test`; expect pass. Commit `feat: share easy mode across patient screens`.**

### Task 2: Add Easy Mode agenda and institution views

**Files:** Modify `src/app/components/TelaAgenda.tsx`, `src/app/components/TelaInstituicoes.tsx`; create `src/app/features/accessibility/easyModeActions.test.ts`.

- [ ] **Step 1: Write failing action tests.**

```ts
test("easy agenda keeps cancellation and rescheduling available", () => {
  assert.deepEqual(getEasyAgendaActions({ status: "confirmado" } as Agendamento), ["reagendar", "cancelar"]);
});
```

- [ ] **Step 2: Run `npm test`; expect missing helper failure.**
- [ ] **Step 3: Render the next appointment first, with large Reagendar/Cancelar actions and collapsible secondary lists.** Render simplified unit cards with fewer tags but retain Busca, filters, Ver detalhes and Agendar.
- [ ] **Step 4: Run `npm test` and local keyboard checks. Commit `feat: simplify agenda and institutions in easy mode`.**

### Task 3: Add Easy Mode booking and profile views

**Files:** Modify `src/app/components/TelaAgendar.tsx`, `src/app/components/TelaPerfil.tsx`, `src/styles/theme.css`; extend `easyModeActions.test.ts`.

- [ ] **Step 1: Write failing booking action test.**

```ts
test("easy booking keeps both navigation directions", () => {
  assert.deepEqual(getEasyBookingActions("servico"), ["voltar", "continuar"]);
});
```

- [ ] **Step 2: Run `npm test`; expect missing helper failure.**
- [ ] **Step 3: Apply direct titles, generous spacing and large Back/Continue controls to the existing one-step booking flow; retain every selection and confirmation action.** In Profile, retain all settings but present them as large high-contrast blocks.
- [ ] **Step 4: Run `npm test; npm run build`; manually traverse all five screens with Easy Mode enabled. Commit `feat: extend easy mode to booking and profile`.**

## Self-Review

- Tasks cover persistence, global availability, Agenda, Institutions, Booking and Profile.
- Normal mode and administrator behavior remain separate from patient Easy Mode.
