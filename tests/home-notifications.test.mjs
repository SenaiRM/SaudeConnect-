import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("workspace exposes recent notifications in one shared popover", async () => {
  assert.equal(existsSync("src/app/components/NotificationPopover.tsx"), true);
  const home = await readFile("src/app/components/TelaHome.tsx", "utf8");
  const topbar = await readFile("src/app/components/WorkspaceTopbar.tsx", "utf8");
  const popover = await readFile("src/app/components/NotificationPopover.tsx", "utf8");

  assert.doesNotMatch(home, /NotificationPopover/);
  assert.match(topbar, /NotificationPopover/);
  assert.match(topbar, /setNotificationsOpen/);
  assert.doesNotMatch(popover, /Ver todas as notificações/);
  assert.match(popover, /recentNotifications/);
});

test("home replaces zero-value metrics with a useful empty state", async () => {
  const home = await readFile("src/app/components/TelaHome.tsx", "utf8");

  assert.match(home, /Você está em dia/);
  assert.match(home, /upcoming\.length === 0/);
  assert.match(home, /Agendar agora/);
});

test("notification popover distinguishes reminder, confirmation, info, and cancellation states", async () => {
  const popover = await readFile("src/app/components/NotificationPopover.tsx", "utf8");

  assert.match(popover, /notificationStyles/);
  assert.match(popover, /bg-\[\#FEF3C7\]/);
  assert.match(popover, /bg-\[\#DCFCE7\]/);
  assert.match(popover, /bg-\[\#DBEAFE\]/);
  assert.match(popover, /bg-\[\#FEE2E2\]/);
});

test("patient notice cards open an in-place appointment summary", async () => {
  const home = await readFile("src/app/components/TelaHome.tsx", "utf8");

  assert.match(home, /selectedAppointmentId/);
  assert.match(home, /Detalhes do atendimento/);
  assert.match(home, /onOpenAppointment/);
});
