# Institutions Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show nine demonstrative institutions in a responsive grid and an interactive, no-cost OpenStreetMap map.

**Architecture:** Expand typed mock data and isolate map rendering in `InstitutionsMap`. `TelaInstituicoes` continues to own search/filter/location state and passes its current visible institutions to the map.

**Tech Stack:** React, TypeScript, Leaflet, OpenStreetMap, Tailwind CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-29-instituicoes-modo-facil-design.md`

## Global Constraints

- Use Leaflet and OpenStreetMap; do not use Google Maps, API keys or paid services.
- The network has exactly nine active institutions: three clinics, three hospitals and three laboratories.
- Markers represent only the current filtered list and include visible OpenStreetMap attribution.
- Existing search, type filters, details, scheduling and optional browser geolocation remain available.

## Review Focus

- A type filter must affect markers and cards identically; Task 2.
- Missing coordinates must not crash the map or hide the institution card; Task 2.
- Narrow screens must remain one column; visual check in Task 2.
- Map tile failure leaves cards/actions usable; Task 2.
- A marker action must use the same `onDetalhes` callback as its card; Task 2.

---

### Task 1: Expand and test demonstrative network data

**Files:** Modify `src/app/components/mockData.ts`; create `src/app/components/mockData.institutions.test.ts`; modify `package.json`.

**Interfaces:** Produces nine `Instituicao` entries with `coords`, `cidade`, `uf`, service data and active status.

- [ ] **Step 1: Write the failing data test.**

```ts
test("keeps a balanced nine-unit active network", () => {
  assert.equal(instituicoes.length, 9);
  assert.deepEqual(Object.fromEntries(["clinica", "hospital", "laboratorio"].map((type) => [type, instituicoes.filter((unit) => unit.tipo === type).length])), { clinica: 3, hospital: 3, laboratorio: 3 });
  assert.equal(instituicoes.every((unit) => unit.ativo && Boolean(unit.coords)), true);
});
```

- [ ] **Step 2: Run `npm test`; expect failure because the network has four entries.**
- [ ] **Step 3: Add five São Paulo entries.** Use unique `i5`–`i9` IDs, realistic addresses, phones, ratings, services and coordinates; add compatible professionals/agendas only where the existing booking validation requires them.
- [ ] **Step 4: Run `npm test`; expect pass.**
- [ ] **Step 5: Commit with `git commit -am "feat: expand institution network"`.**

### Task 2: Render filtered OpenStreetMap markers and 3×3 grid

**Files:** Create `src/app/components/InstitutionsMap.tsx`; modify `src/app/components/TelaInstituicoes.tsx`; modify `package.json` and lockfile; create `src/app/components/institutionsMap.test.ts`.

**Interfaces:** `InstitutionsMap({ institutions: Instituicao[]; onDetails: (id: string) => void })` receives already-filtered units. It skips units without coordinates and renders a fallback status on map construction/tile error.

- [ ] **Step 1: Write the failing marker test.**

```ts
test("returns only coordinate-bearing filtered marker inputs", () => {
  assert.deepEqual(getMappableInstitutions([{ id: "i1", coords: { lat: 1, lng: 2 } } as Instituicao, { id: "i2" } as Instituicao]).map((unit) => unit.id), ["i1"]);
});
```

- [ ] **Step 2: Run `npm test`; expect missing map helper failure.**
- [ ] **Step 3: Add Leaflet and implement the isolated map component.** Use `L.map`, the OpenStreetMap tile URL, attribution text, one popup per supplied unit and a popup `Ver detalhes` action that calls `onDetails`. Fit bounds to markers; use a fixed São Paulo center when no marker is available.
- [ ] **Step 4: Replace the placeholder in `TelaInstituicoes`.** Always render the map after the list, pass `lista.map(({ inst }) => inst)`, update desktop grid to `xl:grid-cols-3`, and retain `md:grid-cols-2`/one mobile column.
- [ ] **Step 5: Run `npm test` and `npm run build`; verify local desktop has 3×3 cards and filters update markers; verify mobile has one card per row. Commit `feat: add institutions map`.**

## Self-Review

- The two tasks cover data, grid, filters, free map, markers, fallback and existing actions.
- `InstitutionsMap` owns Leaflet lifecycle; the page owns application state.
