# Reformulação Responsiva e Agendamento Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Entregar uma experiência de paciente responsiva para notebook e celular e um agendamento em tela única que só permita horários futuros e disponíveis.

**Architecture:** A casca do aplicativo passa a escolher barra lateral no desktop e barra inferior no celular. O agendamento deixa de concentrar estado, filtros e renderização em uma única tela: regras puras calculam opções compatíveis e horários livres; componentes pequenos exibem filtros, disponibilidade e resumo.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Node.js native test runner.

**Spec:** `docs/superpowers/specs/2026-09-16-reformulacao-responsiva-agendamento-design.md`

## Global Constraints

- Desktop começa em 1024 px; abaixo disso a navegação inferior permanece.
- Aplicar a paleta `#087E8B`, `#F4F9FA`, `#FFFFFF` e `#243746`.
- Não criar back-end, persistência, Supabase, Reagendamento, Modo Fácil, Geolocalização ou gestão/admin nesta etapa.
- Exibir somente horários futuros que ainda não tenham agendamento ativo.
- Usar dados simulados existentes e manter o build com Vite funcional.

---

## File Structure

- `src/app/components/AppShell.tsx`: casca responsiva, barra lateral no desktop e encaixe de conteúdo.
- `src/app/components/DesktopNav.tsx`: navegação de paciente para notebook.
- `src/app/features/agendamento/availability.ts`: contratos e regras puras de compatibilidade e disponibilidade.
- `src/app/features/agendamento/BookingFilters.tsx`: escolha de tipo, serviço, instituição e profissional.
- `src/app/features/agendamento/AvailabilityPicker.tsx`: escolha de data e horário já filtrados.
- `src/app/features/agendamento/BookingSummary.tsx`: resumo reutilizável no desktop e celular.
- `src/app/components/TelaAgendar.tsx`: composição da feature, confirmação e retorno ao fluxo anterior.
- `src/app/App.tsx`: uso da casca responsiva e dados de agendamento como fonte das reservas.
- `tests/availability.test.mjs`: comportamento da regra de disponibilidade.
- `tests/responsive-shell.test.mjs`: contratos de breakpoint e navegação de desktop.

### Task 1: Regra de disponibilidade

**Files:**
- Create: `tests/availability.test.mjs`
- Create: `src/app/features/agendamento/availability.ts`

**Interfaces:**
- Produces: `getAvailableSlots({ tipo, instituicaoId, profissionalId, slots, agendamentos, now }): SlotDisponivel[]`.
- Produces: `getCompatibleInstitutions({ tipo, service }): Instituicao[]`.

- [x] **Step 1: Write the failing test**

```js
test('removes past and already booked times from availability', () => {
  const result = getAvailableSlots({
    tipo: 'consulta', instituicaoId: 'i1', profissionalId: 'p1',
    slots: [{ data: '2026-09-16', horarios: ['09:00', '14:00'] }],
    agendamentos: [{ tipo: 'consulta', instituicaoId: 'i1', profissionalId: 'p1', data: '2026-09-16', horario: '14:00', status: 'confirmado' }],
    now: new Date('2026-09-16T10:00:00'),
  });
  assert.deepEqual(result, []);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/availability.test.mjs`

Expected: FAIL because `availability.ts` does not export `getAvailableSlots`.

- [x] **Step 3: Write minimal implementation**

```ts
export function getAvailableSlots(input: AvailabilityInput): SlotDisponivel[] {
  return input.slots.flatMap(({ data, horarios }) => {
    const free = horarios.filter((horario) => isFuture(data, horario, input.now) && !isReserved(input, data, horario));
    return free.length ? [{ data, horarios: free }] : [];
  });
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test tests/availability.test.mjs`

Expected: PASS with one test and zero failures.

- [x] **Step 5: Commit**

Skip commit because the supplied project directory has no `.git` repository. Record the verified result in the implementation update.

### Task 2: Casca responsiva para notebook e celular

**Files:**
- Create: `src/app/components/DesktopNav.tsx`
- Create: `src/app/components/AppShell.tsx`
- Modify: `src/app/App.tsx`
- Test: `tests/responsive-shell.test.mjs`

**Interfaces:**
- Consumes: `activeTab: Screen`, `onNavigate: (screen: Screen) => void`, `children: ReactNode`.
- Produces: `AppShell` that renders `DesktopNav` em `lg` e deixa `BottomNav` para telas menores.

- [x] **Step 1: Write the failing test**

```js
test('desktop shell exposes patient navigation labels', async () => {
  const source = await readFile('src/app/components/DesktopNav.tsx', 'utf8');
  assert.match(source, /Início/);
  assert.match(source, /Agenda/);
  assert.match(source, /Instituições/);
  assert.match(source, /Perfil/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/responsive-shell.test.mjs`

Expected: FAIL because `DesktopNav.tsx` does not exist.

- [x] **Step 3: Write minimal implementation**

```tsx
export function AppShell({ activeTab, onNavigate, children }: AppShellProps) {
  return <main className="min-h-screen bg-[#F4F9FA] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
    <DesktopNav activeTab={activeTab} onNavigate={onNavigate} />
    <section className="min-w-0">{children}</section>
  </main>;
}
```

- [x] **Step 4: Run test and production build**

Run: `node --test tests/responsive-shell.test.mjs && npm run build`

Expected: test PASS and Vite build exits with code 0.

- [x] **Step 5: Commit**

Skip commit because the supplied project directory has no `.git` repository. Record the verified result in the implementation update.

### Task 3: Tela única de agendamento

**Files:**
- Create: `src/app/features/agendamento/BookingFilters.tsx`
- Create: `src/app/features/agendamento/AvailabilityPicker.tsx`
- Create: `src/app/features/agendamento/BookingSummary.tsx`
- Modify: `src/app/components/TelaAgendar.tsx`
- Modify: `src/app/App.tsx`
- Test: `tests/availability.test.mjs`

**Interfaces:**
- Consumes: `BookingDraft`, `getCompatibleInstitutions`, `getAvailableSlots`.
- Produces: `onConfirmar(agendamento)` only after all required selection fields are present.

- [x] **Step 1: Extend the failing test**

```js
test('exam availability filters reservations by institution without requiring professional', () => {
  const result = getAvailableSlots({
    tipo: 'exame', instituicaoId: 'i3', slots: [{ data: '2026-09-17', horarios: ['08:00', '08:30'] }],
    agendamentos: [{ tipo: 'exame', instituicaoId: 'i3', data: '2026-09-17', horario: '08:00', status: 'pendente' }],
    now: new Date('2026-09-16T12:00:00'),
  });
  assert.deepEqual(result, [{ data: '2026-09-17', horarios: ['08:30'] }]);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/availability.test.mjs`

Expected: FAIL until reservation matching supports exams without `profissionalId`.

- [x] **Step 3: Compose the one-page flow**

```tsx
<BookingFilters draft={draft} onChange={setDraft} />
<AvailabilityPicker slots={availableSlots} value={draft} onChange={setDraft} />
<BookingSummary draft={draft} className="lg:sticky lg:top-6" />
```

Display an empty-state message with a button that clears the immediately preceding filter when `availableSlots` is empty. Do not render a progress bar or a separate wizard step.

- [x] **Step 4: Run tests and production build**

Run: `node --test tests/availability.test.mjs tests/responsive-shell.test.mjs && npm run build`

Expected: all tests PASS and Vite build exits with code 0.

- [x] **Step 5: Commit**

Skip commit because the supplied project directory has no `.git` repository. Record the verified result in the implementation update.

### Task 4: Final responsive verification

**Files:**
- Modify: `src/app/components/BottomNav.tsx`
- Modify: `src/app/components/TelaAgenda.tsx`
- Test: `tests/palette.test.mjs`

**Interfaces:**
- Consumes: existing `BottomNav` and patient screens.
- Produces: mobile navigation that remains visible without covering the booking confirmation action.

- [x] **Step 1: Write a failing source-contract assertion**

```js
test('booking confirmation reserves mobile bottom spacing', async () => {
  const source = await readFile('src/app/components/TelaAgendar.tsx', 'utf8');
  assert.match(source, /pb-24/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/responsive-shell.test.mjs`

Expected: FAIL until the booking content reserves space for the mobile navigation.

- [x] **Step 3: Implement responsive spacing and desktop state**

```tsx
<div className="min-h-full pb-24 lg:pb-8">{bookingContent}</div>
```

Hide the mobile `BottomNav` at `lg` and render `DesktopNav` only at `lg` and above.

- [x] **Step 4: Run all verification**

Run: `node --test tests/*.test.mjs && npm run build`

Expected: all tests PASS and Vite build exits with code 0.

- [x] **Step 5: Commit**

Skip commit because the supplied project directory has no `.git` repository. Record the verified result in the implementation update.
