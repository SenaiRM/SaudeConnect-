# Organização do Dashboard e Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Reorganizar as telas do SaúdeConnect+ para notebook usando a hierarquia, densidade e distribuição de cards das referências aprovadas, preservando integralmente a identidade visual da Sprint 1.

**Architecture:** A casca responsiva mantém uma barra lateral textual entre 220 px e 260 px e uma área de trabalho com largura controlada. Componentes pequenos e reutilizáveis padronizam cabeçalhos, indicadores e seções; cada tela apenas fornece conteúdo e ações específicas do domínio.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Node.js native test runner.

**Spec:** `docs/superpowers/specs/2026-09-16-reformulacao-responsiva-agendamento-design.md`

## Global Constraints

- Usar `#087E8B` como cor principal, `#065F68` como variação escura, `#F4F9FA` como fundo, `#FFFFFF` nos cards, `#243746` no texto principal e `#607985` no texto secundário.
- As imagens de referência definem organização e proporção, nunca marca, conteúdo ou paleta.
- Em 1024 px, o menu lateral deve continuar textual e a página não pode apresentar rolagem horizontal.
- Grandes áreas sólidas em azul-petróleo não podem aparecer simultaneamente no cabeçalho e no card principal.
- Abaixo de 1024 px, preservar a navegação inferior e o fluxo móvel existente.
- Não adicionar dependências, back-end, Supabase ou novas regras de domínio nesta etapa.
- O diretório fornecido não possui repositório Git; os passos de commit devem ser registrados como não aplicáveis.

---

## File Structure

- `src/app/components/dashboard/DashboardPageHeader.tsx`: título, contexto, descrição e ação opcional de uma página.
- `src/app/components/dashboard/MetricCard.tsx`: indicador compacto com ícone, rótulo, valor e descrição.
- `src/app/components/dashboard/SectionCard.tsx`: superfície branca compartilhada para grupos de conteúdo.
- `src/app/components/AppShell.tsx`: grade principal e largura útil da área de trabalho.
- `src/app/components/DesktopNav.tsx`: menu lateral textual adaptado a notebook.
- `src/app/components/TelaHome.tsx`: composição do dashboard do paciente.
- `src/app/components/TelaAgenda.tsx`: cabeçalho, filtros e lista de compromissos.
- `src/app/components/TelaInstituicoes.tsx`: pesquisa e grade responsiva de instituições.
- `src/app/components/TelaNotificacoes.tsx`: cabeçalho e lista de notificações.
- `src/app/components/TelaPerfil.tsx`: grupos de dados pessoais em cards padronizados.
- `src/app/components/TelaAgendar.tsx`: adequação visual do fluxo existente ao padrão de cards.
- `tests/dashboard-layout.test.mjs`: contratos de organização, paleta e breakpoints.
- `tests/responsive-shell.test.mjs`: contratos da barra lateral e da grade principal.

### Task 1: Componentes compartilhados do dashboard

**Files:**
- Create: `src/app/components/dashboard/DashboardPageHeader.tsx`
- Create: `src/app/components/dashboard/MetricCard.tsx`
- Create: `src/app/components/dashboard/SectionCard.tsx`
- Create: `tests/dashboard-layout.test.mjs`

**Interfaces:**
- Produces: `DashboardPageHeader({ eyebrow, title, description, action }: DashboardPageHeaderProps): JSX.Element`.
- Produces: `MetricCard({ label, value, description, icon }: MetricCardProps): JSX.Element`.
- Produces: `SectionCard({ title, description, action, children, className }: SectionCardProps): JSX.Element`.

- [x] **Step 1: Write the failing source-contract test**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("dashboard primitives preserve the Sprint 1 surfaces", async () => {
  const files = await Promise.all([
    "DashboardPageHeader.tsx",
    "MetricCard.tsx",
    "SectionCard.tsx",
  ].map((name) => readFile(`src/app/components/dashboard/${name}`, "utf8")));
  const source = files.join("\n");
  assert.match(source, /#087E8B/i);
  assert.match(source, /bg-white/);
  assert.match(source, /#243746/i);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --test tests/dashboard-layout.test.mjs`

Expected: FAIL because the dashboard component files do not exist.

- [x] **Step 3: Implement the shared components**

```tsx
export function MetricCard({ label, value, description, icon }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-[#B9D9DD]/45 bg-white p-4 shadow-[0_8px_24px_rgba(36,55,70,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#607985]">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#DCEFF1] text-[#087E8B]">{icon}</span>
      </div>
      <p className="mt-5 text-2xl font-bold text-[#243746]">{value}</p>
      {description && <p className="mt-1 text-xs text-[#607985]">{description}</p>}
    </article>
  );
}
```

Implement `DashboardPageHeader` with a responsive action slot and implement `SectionCard` with the same border, radius and shadow tokens shown above.

- [x] **Step 4: Run the test to verify it passes**

Run: `node --test tests/dashboard-layout.test.mjs`

Expected: PASS with zero failures.

- [x] **Step 5: Record the task result**

Do not commit because the project has no `.git` repository. Record created files and the passing test in the implementation update.

### Task 2: Casca e menu adequados para notebook

**Files:**
- Modify: `src/app/components/AppShell.tsx`
- Modify: `src/app/components/DesktopNav.tsx`
- Modify: `tests/responsive-shell.test.mjs`

**Interfaces:**
- Consumes: `activeTab: Screen`, `onNavigate: (screen: Screen) => void`, `children: ReactNode`.
- Produces: grade de `220px` em `lg`, `260px` em `xl` e conteúdo central limitado a `1440px`.

- [x] **Step 1: Write the failing notebook contract**

```js
test("notebook keeps a textual sidebar without stealing the workspace", async () => {
  const shell = await readFile("src/app/components/AppShell.tsx", "utf8");
  const nav = await readFile("src/app/components/DesktopNav.tsx", "utf8");
  assert.match(shell, /lg:grid-cols-\[220px_minmax\(0,1fr\)\]/);
  assert.match(shell, /xl:grid-cols-\[260px_minmax\(0,1fr\)\]/);
  assert.doesNotMatch(nav, /hidden xl:inline/);
});
```

- [x] **Step 2: Run the test and confirm the current mismatch**

Run: `node --test tests/responsive-shell.test.mjs`

Expected: FAIL until the sidebar widths and always-visible labels match the approved design.

- [x] **Step 3: Implement the notebook grid**

```tsx
<main className="min-h-screen bg-[#F4F9FA] lg:grid lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
  <DesktopNav activeTab={activeTab} onNavigate={onNavigate} />
  <section className="min-w-0 min-h-screen lg:p-6 xl:p-8 2xl:p-10">
    <div className="mx-auto w-full max-w-[1440px]">{children}</div>
  </section>
</main>
```

Keep every menu label visible from `lg` upward. Use compact padding at `lg` and slightly larger padding at `xl`; do not restore the removed “Área atual” selector.

- [x] **Step 4: Run the responsive tests**

Run: `node --test tests/responsive-shell.test.mjs`

Expected: PASS with zero failures.

- [x] **Step 5: Record the task result**

Do not commit because the project has no `.git` repository. Record breakpoint verification in the implementation update.

### Task 3: Recompose the Home as a notebook dashboard

**Files:**
- Modify: `src/app/components/TelaHome.tsx`
- Modify: `tests/dashboard-layout.test.mjs`

**Interfaces:**
- Consumes: `DashboardPageHeader`, `MetricCard`, `SectionCard`, existing `User`, `Agendamento` and navigation callbacks.
- Produces: Home with three metric cards, one primary appointment card, two quick actions and one upcoming list.

- [x] **Step 1: Add the failing Home structure test**

```js
test("home uses the approved dashboard hierarchy", async () => {
  const source = await readFile("src/app/components/TelaHome.tsx", "utf8");
  assert.match(source, /DashboardPageHeader/);
  assert.match(source, /MetricCard/);
  assert.match(source, /lg:grid-cols-\[minmax\(0,1\.35fr\)_minmax\(280px,\.65fr\)\]/);
  assert.doesNotMatch(source, /linear-gradient\(135deg, #087E8B, #065F68\)/);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --test tests/dashboard-layout.test.mjs`

Expected: FAIL because Home still uses large gradient blocks and does not use the shared primitives.

- [x] **Step 3: Implement the Home hierarchy**

```tsx
<div className="space-y-6">
  <DashboardPageHeader
    eyebrow="Visão geral"
    title={`${saudacao()}, ${nomeAbreviado}`}
    description="Acompanhe seus próximos cuidados e encontre rapidamente o que precisa."
    action={<NotificationButton count={notificacoesNaoLidas} />}
  />
  <section className="grid gap-3 sm:grid-cols-3">
    <MetricCard label="Consultas" value={consultas} icon={<Stethoscope size={18} />} />
    <MetricCard label="Exames" value={exames} icon={<FlaskConical size={18} />} />
    <MetricCard label="Agendamentos" value={upcoming.length} icon={<CalendarDays size={18} />} />
  </section>
  <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
    <SectionCard title="Próximo compromisso">{appointmentContent}</SectionCard>
    <SectionCard title="Ações rápidas">{quickActions}</SectionCard>
  </section>
  <SectionCard title="Próximos agendamentos" action={viewAllButton}>{upcomingRows}</SectionCard>
</div>
```

Use a narrow `#087E8B` accent, status badge and icon surface in the next-appointment card. Keep the card body white and all principal text `#243746`.

- [x] **Step 4: Run the Home contract and full test suite**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS.

- [x] **Step 5: Record the task result**

Do not commit because the project has no `.git` repository. Record the Home visual verification at 1024 px and 1366 px.

### Task 4: Apply the card system to patient screens

**Files:**
- Modify: `src/app/components/TelaAgenda.tsx`
- Modify: `src/app/components/TelaAgendar.tsx`
- Modify: `src/app/components/TelaInstituicoes.tsx`
- Modify: `src/app/components/TelaNotificacoes.tsx`
- Modify: `src/app/components/TelaPerfil.tsx`
- Modify: `tests/dashboard-layout.test.mjs`

**Interfaces:**
- Consumes: `DashboardPageHeader` and `SectionCard` from Task 1.
- Produces: consistent headers, white content surfaces and responsive grids across all patient screens.

- [x] **Step 1: Add the failing shared-layout test**

```js
test("patient screens share the dashboard header and card surfaces", async () => {
  const screens = ["TelaAgenda", "TelaAgendar", "TelaInstituicoes", "TelaNotificacoes", "TelaPerfil"];
  for (const screen of screens) {
    const source = await readFile(`src/app/components/${screen}.tsx`, "utf8");
    assert.match(source, /DashboardPageHeader/, `${screen} sem cabeçalho compartilhado`);
    assert.match(source, /bg-white|SectionCard/, `${screen} sem superfície branca`);
  }
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --test tests/dashboard-layout.test.mjs`

Expected: FAIL for each screen that still uses the previous full-width colored header.

- [x] **Step 3: Implement the page compositions**

Use these exact desktop compositions:

```tsx
// Agenda and Notifications
<div className="space-y-6">
  <DashboardPageHeader {...headerProps} />
  <SectionCard>{filtersOrSummary}</SectionCard>
  <div className="space-y-3">{horizontalRows}</div>
</div>

// Institutions
<div className="space-y-6">
  <DashboardPageHeader {...headerProps} />
  <SectionCard>{searchAndFilters}</SectionCard>
  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{institutionCards}</div>
</div>

// Profile
<div className="space-y-6">
  <DashboardPageHeader {...headerProps} />
  <div className="grid gap-5 xl:grid-cols-2">{profileSections}</div>
</div>
```

For `TelaAgendar`, retain the existing availability rules and use `lg:grid-cols-[minmax(0,1fr)_320px]` for options plus sticky summary. Do not reintroduce the old multi-screen wizard.

- [x] **Step 4: Run the shared-layout tests**

Run: `node --test tests/dashboard-layout.test.mjs tests/availability.test.mjs`

Expected: PASS with no availability regression.

- [x] **Step 5: Record the task result**

Do not commit because the project has no `.git` repository. Record every screen verified in the implementation update.

### Task 5: Responsive and production verification

**Files:**
- Modify: `tests/dashboard-layout.test.mjs`
- Verify: `src/app/components/BottomNav.tsx`
- Verify: all files modified in Tasks 1–4.

**Interfaces:**
- Consumes: complete patient UI.
- Produces: verified layouts at 390×844, 1024×768, 1366×768 and 1920×1080.

- [x] **Step 1: Add the final palette and overflow contracts**

```js
test("dashboard keeps the approved workspace and card colors", async () => {
  const shell = await readFile("src/app/components/AppShell.tsx", "utf8");
  assert.match(shell, /#F4F9FA/i);
  const primitives = await readFile("src/app/components/dashboard/SectionCard.tsx", "utf8");
  assert.match(primitives, /bg-white/);
});
```

- [x] **Step 2: Run all automated tests**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS with zero failures.

- [x] **Step 3: Build the production bundle**

Run in PowerShell:

```powershell
$viteCli = Get-ChildItem -Path 'C:\Users\rafae\AppData\Local\npm-cache\_npx' -Filter vite.js -Recurse -ErrorAction Stop | Select-Object -First 1 -ExpandProperty FullName
node $viteCli build
```

Expected: Vite exits with code 0 and writes `dist/index.html` plus hashed assets.

- [x] **Step 4: Verify the four target viewports**

At 390×844, confirm the sidebar is absent, bottom navigation is visible and cards stack. At 1024×768, confirm the 220 px textual sidebar, two-column Home and no horizontal scrollbar. At 1366×768, confirm the 260 px sidebar and balanced card grid. At 1920×1080, confirm the content stops growing at 1440 px and remains centered.

- [x] **Step 5: Record the final result**

Do not commit because the project has no `.git` repository. Report automated test totals, build status and the four viewport checks.

