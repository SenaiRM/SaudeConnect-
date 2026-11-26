# Spec — Papel Secretaria, confirmação com termos, precisão da agenda e UX

Data: 2026-10-28 · Status: **aguardando aprovação**

App: React 18 + Vite + Tailwind v4, 100% client-side, sem backend.
Estado da demonstração em `localStorage` (`saudeconnect-demo-state-v1`).

## Baseline medido (hoje, antes de qualquer mudança)
- `npm test` → 42 testes, todos passam (lógica pura).
- `node --test tests/*.test.mjs` → 53 testes, **43 passam e 10 já falham** (suíte legada, que faz *regex no código-fonte*; as 10 falhas são do layout antigo de agendamento).
- A pasta do app **não é um repositório git** na raiz do workspace; o git fica em `Recriar app enviado/.git`, branch `main`.

## O que JÁ EXISTE pronto (não refazer)
| Já pronto | Onde |
|---|---|
| Painel do admin com métricas, abas (Instituições/Profissionais/Disponibilidade/Agendamentos), confirmar reagendamento e cancelar por profissional | `TelaGestao.tsx` |
| Separação de avisos por papel (`destinatario`) e painel de avisos compartilhado | `App.tsx:287-289`, `AvisosPanel.tsx` |
| Histórico auditável de criação/reagendamento/cancelamento | `rescheduling.ts` |
| Modo Simples (classe `modo-facil`, escala de fonte, layouts alternativos em Home/Agenda/Instituições) | `theme.css:186-245` |
| Componentes de design reaproveitáveis: `AppButton`, `SectionCard`, `MetricCard`, `DashboardPageHeader` | `components/ui`, `components/dashboard` |
| `skeleton.tsx`, `sonner.tsx` (toasts), `progress.tsx`, `use-mobile.ts` — existem e **nunca foram usados** | `components/ui` |
| Fluxo de agendamento em 5 etapas com Voltar único | `features/agendamento` |

## Problemas confirmados no código (com evidência)
1. **Double-booking real.** `App.tsx:336` passa só os agendamentos do próprio usuário ao fluxo de marcação, então a checagem de horário ocupado (`availability.ts:12-21`) não enxerga a reserva de outro paciente. O mesmo vale no `ReagendarModal` (`ReagendarModal.tsx:36`). Dois pacientes confirmam o mesmo horário.
2. **Data deslocada à noite.** `availability.ts:83`, `:104` e `mockData.ts:347` montam a data em hora local e serializam com `toISOString()` (UTC). Depois das 21h em UTC-3, a grade inteira anda um dia.
3. **Secretaria com cara de paciente.** `BottomNav.tsx` não conhece papel; o admin vê Início/Agenda/Instituições/Perfil, pode abrir "Agendar consulta/exame" (`TelaHome.tsx:131-140`) e marcar — e o agendamento nasce **no nome dele** (`App.tsx:233`, `usuarioId: user!.id`).
4. **Agendamento nasce "pendente" e nunca sai disso.** O aviso promete "aguarde confirmação da instituição" (`App.tsx:241`), mas não existe nenhuma ação que confirme um agendamento novo.
5. **Avisos vazando entre contas.** As 4 notificações de seed (`mockData.ts:391-412`) não têm `destinatario` nem `usuarioId`, então aparecem para os dois papéis; "marcar todas como lidas" (`App.tsx:268`) marca também as da outra conta.
6. **Zero estado de carregamento** fora do botão de geolocalização.
7. **Modo Simples quebrado no desktop**: os alvos grandes estão todos dentro de `@media (max-width:1023px)` (`theme.css:213-219`), e `TelaGestao`/`TelaDetalhesInstituicao` nem recebem a propriedade.
8. **Tela de acesso cortada**: `h-screen overflow-hidden` (`TelaAcesso.tsx:64`) corta o botão Entrar em telas baixas e com fonte do Modo Simples.

## Escopo aprovado para execução (ordem obrigatória)

**Etapa 0 — Base (bloqueia o resto)**
- Versionar o estado: `saudeconnect-demo-state-v2` com migração — sem isso o rename do papel faz os avisos internos antigos vazarem para o paciente, e o filtro por data real esvazia a demo de quem já abriu o app.
- Política dos testes legados: o número de falhas em `tests/*.mjs` **nunca pode passar de 10**; cada teste que o escopo tornar obsoleto é reescrito no mesmo commit da mudança.

**Etapa 1 — Precisão da agenda** (lógica pura, TDD)
- `toLocalISODate()` substituindo os três `toISOString()`.
- Ocupação passa a considerar **todos** os agendamentos, nos dois caminhos (marcar e reagendar). Só remove horário da grade — não exibe dado de outro paciente.
- Passado/futuro por data+hora em `TelaHome` e `TelaAgenda`; histórico ordenado por data **e** horário.
- Revalidar o horário no clique de confirmar.
- Rebasing das datas das seeds na carga, para a demo nunca nascer vazia.

**Etapa 2 — Avisos**
- Gerador de id injetável (não um contador global, que colidiria entre abas e com os ids `a1`–`a7` dos mocks).
- Corrigir o dedupe morto (`App.tsx:174` procura um título que nunca é emitido).
- Seeds ganham `destinatario` e `usuarioId`.
- "Marcar todas como lidas" só nas visíveis ao papel.

**Etapa 3 — Papel Secretaria**
- `UserRole = "usuario" | "secretaria"`; rename em código e UI, inclusive o botão "Entrar como Admin" e os textos "administrador".
- `BottomNav` e `DesktopNav` conscientes do papel; guard no `renderScreen` bloqueando telas de paciente.
- Remoção das ações "Agendar consulta/exame" da secretaria.
- **Agendar em nome de um paciente**: a secretaria escolhe o paciente e o agendamento grava o `usuarioId` dele. Isso substitui a função defeituosa de hoje em vez de só apagá-la.
- Os 5 testes legados que casam a string `"admin"` são reescritos no mesmo commit.

**Etapa 4 — Subconfirmação com termos**
- Checkbox **dentro da etapa de confirmação que já existe** (não uma 6ª etapa): "Declaro, por minha livre e espontânea vontade, que confirmo este agendamento e concordo com os termos de atendimento", com o texto dos termos aberto num diálogo.
- Botão confirmar desabilitado até marcar; grava `termos: { aceito, aceitoEm, versao }` como campo **opcional**.
- Mesma subconfirmação no reagendamento. **Não** no cancelamento.

**Etapa 5 — Design, Modo Simples e responsividade**
- `AppButton` com `loading` (spinner + `aria-busy` + bloqueio de clique duplo); skeleton na lista de instituições e no mapa. **Sem atraso artificial.**
- Modo Simples com paridade no desktop, atalho na topbar, `MetricCard` incluído, `TelaGestao` e `TelaDetalhesInstituicao` recebendo a propriedade.
- `TelaAcesso` com rolagem (`100dvh`), `BottomNav` com alvo de toque ≥44px, sino de notificações no mobile, abas da Agenda em 360px, breakpoints em `TelaDetalhesInstituicao`.

## Fora de escopo (ficam para depois)
- Confirmar agendamento novo (fechar o ciclo "pendente → confirmado"): é uma funcionalidade inteira, com transição de status, evento de histórico e UI novos.
- Unificar a grade de horários entre marcar e reagendar: muda comportamento e quebra asserções de array exato.
- Atraso artificial de latência.

## Cenários de teste (TDD — teste primeiro)
1. `toLocalISODate` devolve o dia local correto às 23h em UTC-3.
2. Horário reservado por **outro** paciente não é oferecido na marcação nem no reagendamento.
3. Agendamento cuja data já passou não aparece em "Próximos" e aparece no histórico.
4. Histórico com dois itens no mesmo dia ordena pelo horário.
5. Confirmar um horário que ficou ocupado no meio do caminho devolve erro em vez de gravar.
6. Dois avisos criados no mesmo milissegundo recebem ids diferentes.
7. Aviso de seed não aparece para o papel errado.
8. "Marcar todas como lidas" não toca nos avisos do outro papel.
9. Migração v1→v2 converte `destinatario: "admin"` e `responsavel: "admin"`.
10. Secretaria não alcança as telas de paciente; paciente não alcança o painel.
11. Agendamento criado pela secretaria grava o `usuarioId` do paciente escolhido.
12. Confirmar sem marcar o checkbox de termos não cria agendamento; com o checkbox, grava `aceitoEm`.

---

## Ajustes aprovados pelo usuário (2026-10-28)

1. **Nome do papel: "Secretaria"** (confirmado).
2. **Uma secretaria atende UMA unidade** (confirmado). Consequências:
   - `User` ganha `instituicaoId`; a secretaria demo fica vinculada a `i1` (Clínica Saúde Plena).
   - Os agendamentos de demonstração (`mockData.ts:350-388`, hoje espalhados por i1/i2/i3/i4) são remapeados para `i1`, senão a secretaria enxergaria só 2 dos 7 e os pedidos de reagendamento das outras unidades ficariam sem ninguém para confirmar.
   - Cada instituição passa a ter uma secretaria responsável no mock; um agendamento feito em outra unidade é roteado para a secretaria daquela unidade e o paciente vê "aguardando a secretaria da unidade X". Só a secretaria de `i1` é logável na demonstração.
   - O painel passa a mostrar a unidade no cabeçalho, para a secretaria saber o que está vendo.
3. **Ciclo "pendente → confirmado" ENTRA no escopo** (confirmado) — sai da lista de "fora de escopo" e vira a Etapa 6:
   - Nova transição em `rescheduling.ts` + nova variante em `AgendamentoHistorico.tipo`.
   - Botão "Confirmar agendamento" na aba Agendamentos do painel da secretaria.
   - Aviso ao paciente: "Sua consulta foi confirmada pela unidade".
   - Cenário de teste 13: confirmar um agendamento pendente muda o status, grava o evento no histórico e notifica o paciente; confirmar duas vezes não duplica nada.
4. **Conta do git**: o repositório já commitava como `saudeconnect` (`334728111+saudeconnectofc-eng@users.noreply.github.com`); o que estava errado era a conta ativa do GitHub CLI, que era `rafaelengrenagem`. Trocada para `saudeconnectofc-eng`.
