import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("booking always highlights Agendar instead of its source screen", async () => {
  const app = await readFile("src/app/App.tsx", "utf8");
  const desktopNav = await readFile("src/app/components/DesktopNav.tsx", "utf8");

  assert.match(app, /if \(screen === "agendar"\) return "agendar";/);
  assert.doesNotMatch(desktopNav, /screen === "agenda" && activeTab === "agendar"/);
});
