# Patient Navigation Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove duplicate patient notification controls and make the booking navigation visibly active throughout the booking flow.

**Architecture:** `App.tsx` remains the source of truth for the current screen and active sidebar item. `TelaHome.tsx` no longer owns notification UI; the shared `WorkspaceTopbar` remains the only desktop notification action. Booking continues to remember its origin only for the back button, not for sidebar selection.

**Tech Stack:** React, TypeScript, Vite, Node test runner, Tailwind utility classes, Lucide icons.

**Spec:** `docs/superpowers/specs/2026-09-18-patient-workspace-design.md`

## Global Constraints

- Keep the approved palette: `#F4F9FA`, `#087E8B`, `#B9D9DD`, `#243746`, and white cards.
- Preserve the administrative dashboard behavior.
- Patient desktop has exactly one notification action: `WorkspaceTopbar`.
- The booking route must highlight `Agendar`, including bookings entered from Institutions or Details.

---

### Task 1: Keep one notification control on the patient home

**Files:**
- Modify: `tests/dashboard-layout.test.mjs`
- Modify: `src/app/components/TelaHome.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: `TelaHomeProps` from `TelaHome.tsx`.
- Produces: a home screen that receives booking and navigation callbacks only; notification UI remains in `WorkspaceTopbar`.

- [ ] **Step 1: Write the failing test**

```js
test("patient home leaves notifications to the shared workspace topbar", async () => {
  const home = await readFile("src/app/components/TelaHome.tsx", "utf8");
  assert.doesNotMatch(home, /NotificationPopover/);
  assert.doesNotMatch(home, /action=\{\(/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/dashboard-layout.test.mjs`
Expected: FAIL because `TelaHome.tsx` imports and renders `NotificationPopover` in `DashboardPageHeader`.

- [ ] **Step 3: Write minimal implementation**

```tsx
<DashboardPageHeader
  eyebrow="Visão geral"
  title={`${saudacao}, ${primeiroNome}`}
  description="Acompanhe seus próximos cuidados e encontre rapidamente o que precisa."
/>
```

Remove the local notification state, notification imports, and notification-only props from `TelaHome` and its invocations in `App.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/dashboard-layout.test.mjs`
Expected: PASS.

### Task 2: Highlight Agendar through the entire booking flow

**Files:**
- Modify: `tests/navigation.test.mjs`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: `resolveActiveTab(screen, agendarOrigin)` in `App.tsx`.
- Produces: `"agendar"` whenever `screen === "agendar"`; `agendarOrigin` remains used by `onBack` only.

- [ ] **Step 1: Write the failing test**

```js
test("booking always highlights Agendar instead of its source screen", async () => {
  const app = await readFile("src/app/App.tsx", "utf8");
  assert.match(app, /if \(screen === "agendar"\) return "agendar";/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/navigation.test.mjs`
Expected: FAIL because the current helper returns `agendarOrigin`.

- [ ] **Step 3: Write minimal implementation**

```ts
function resolveActiveTab(screen: Screen): Screen {
  if (screen === "agendar") return "agendar";
  // existing mapping for details, management, and notifications
}
```

Remove the unused `agendarOrigin` parameter at the call site; preserve the separate state for the back action.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/navigation.test.mjs`
Expected: PASS.

### Task 3: Validate desktop and mobile behavior

**Files:**
- Test: `tests/dashboard-layout.test.mjs`
- Test: `tests/navigation.test.mjs`

**Interfaces:**
- Consumes: patient demo login and the patient navigation routes.
- Produces: tested visual hierarchy in the development preview.

- [ ] **Step 1: Run all automated checks**

Run: `node --test tests/*.test.mjs; npm run build`
Expected: all tests pass and Vite completes without errors.

- [ ] **Step 2: Validate notebook preview**

At 1366×768, login as patient, verify one bell in the top bar, and open booking from Institutions. Expected: “Agendar” is the active sidebar item.

- [ ] **Step 3: Validate mobile preview**

At mobile width, verify that the bottom navigation highlights Agendar while booking and no desktop notification action is duplicated.
