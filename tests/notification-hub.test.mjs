import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("notifications stay inside the bell summary instead of opening a dedicated screen", async () => {
  const [app, desktopNav, popover, topbar] = await Promise.all([
    readFile("src/app/App.tsx", "utf8"),
    readFile("src/app/components/DesktopNav.tsx", "utf8"),
    readFile("src/app/components/NotificationPopover.tsx", "utf8"),
    readFile("src/app/components/WorkspaceTopbar.tsx", "utf8"),
  ]);

  assert.doesNotMatch(app, /TelaNotificacoes/);
  assert.doesNotMatch(desktopNav, /onNavigate\("notificacoes"\)/);
  assert.doesNotMatch(popover, /Ver todas as notificações/);
  assert.doesNotMatch(topbar, /onNotifications/);
});

test("patient and admin dashboards receive the same notice panel", async () => {
  const [app, home, management] = await Promise.all([
    readFile("src/app/App.tsx", "utf8"),
    readFile("src/app/components/TelaHome.tsx", "utf8"),
    readFile("src/app/components/TelaGestao.tsx", "utf8"),
  ]);

  assert.match(app, /notifications={visibleNotifications}/);
  assert.match(home, /AvisosPanel/);
  assert.match(management, /AvisosPanel/);
});

test("institution details hide the global bell to avoid overlapping its colored header", async () => {
  const [app, shell] = await Promise.all([
    readFile("src/app/App.tsx", "utf8"),
    readFile("src/app/components/AppShell.tsx", "utf8"),
  ]);

  assert.match(app, /showNotifications={screen !== "detalhes" && screen !== "agendar"}/);
  assert.match(shell, /showNotifications && <WorkspaceTopbar/);
});

test("a notification opens the related appointment from the global bell", async () => {
  const [app, shell, topbar, popover] = await Promise.all([
    readFile("src/app/App.tsx", "utf8"),
    readFile("src/app/components/AppShell.tsx", "utf8"),
    readFile("src/app/components/WorkspaceTopbar.tsx", "utf8"),
    readFile("src/app/components/NotificationPopover.tsx", "utf8"),
  ]);

  assert.match(popover, /onOpenAppointment/);
  assert.match(topbar, /onOpenAppointment/);
  assert.match(shell, /onOpenAppointment/);
  assert.match(app, /handleOpenNotificationAppointment/);
});

test("important notices stay in chronological order after being read", async () => {
  const notices = await readFile("src/app/components/AvisosPanel.tsx", "utf8");

  assert.doesNotMatch(notices, /Number\(a\.lida\)/);
  assert.match(notices, /new Date\(b\.data\)\.getTime\(\) - new Date\(a\.data\)\.getTime\(\)/);
  assert.match(notices, /"Lido"/);
});

test("important notices offer a dialog with the complete notification history", async () => {
  const notices = await readFile("src/app/components/AvisosPanel.tsx", "utf8");

  assert.match(notices, /Ver todas as notificações/);
  assert.match(notices, /Todas as notificações/);
  assert.match(notices, /setAllNotificationsOpen/);
});
