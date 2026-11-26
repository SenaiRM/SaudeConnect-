import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("access screen uses a balanced desktop workspace card", async () => {
  const source = await readFile("src/app/components/TelaAcesso.tsx", "utf8");
  assert.match(source, /lg:grid-cols-\[\.9fr_1\.1fr\]/);
  assert.match(source, /lg:rounded-\[28px\]/);
  assert.match(source, /Acesse sua conta/);
});

test("access screen fits the viewport without clipping its content", async () => {
  const source = await readFile("src/app/components/TelaAcesso.tsx", "utf8");
  // A página não rola: quem rola é o painel de acesso, para o botão Entrar
  // continuar alcançável em telas baixas e com a fonte do Modo Simples.
  assert.match(source, /h-\[100dvh\] overflow-hidden/);
  assert.match(source, /overflow-y-auto/);
  assert.match(source, /Consultas, exames e seu histórico em um só lugar\./);
  assert.doesNotMatch(source, /Cuide da sua saúde com mais clareza\./);
});
