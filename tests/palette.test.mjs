import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const legacyPalette = [
  "#769382", "#5a7566", "#F3F1E3", "#E3D9C3",
  "#C0C3B9", "#5C6B5E", "#2C3A2E",
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(path)
      : /\.(css|ts|tsx)$/.test(entry.name) ? [path] : [];
  }));
  return files.flat();
}

test("a interface usa a paleta azul-petróleo da Sprint 1", async () => {
  const files = await sourceFiles("src");
  const content = await Promise.all(files.map((file) => readFile(file, "utf8")));
  const source = content.join("\n").toLowerCase();

  for (const color of legacyPalette) {
    assert.equal(source.includes(color.toLowerCase()), false, `cor antiga encontrada: ${color}`);
  }
  assert.equal(source.includes("#087e8b"), true, "cor principal azul-petróleo ausente");
  assert.equal(source.includes("#f4f9fa"), true, "cor de fundo ausente");
  assert.equal(source.includes("#243746"), true, "cor de texto principal ausente");
});
