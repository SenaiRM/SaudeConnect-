import assert from "node:assert/strict";
import test from "node:test";
import { getEasyModeServices, getEasyModeTabs } from "./easyMode.ts";

test("Modo Fácil mantém apenas as escolhas essenciais em cada tela", () => {
  assert.deepEqual(getEasyModeTabs(), ["Próximos", "Histórico"]);
  assert.deepEqual(getEasyModeServices(["Cardiologia", "Ortopedia", "Clínica Geral"]), ["Cardiologia"]);
});
