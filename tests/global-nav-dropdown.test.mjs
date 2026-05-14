import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("GlobalNav gives Material, Product, and Media hover dropdowns", async () => {
  const content = await source("src/components/GlobalNav.tsx");

  assert.match(content, /children:\s*\[/);
  assert.match(content, /label:\s*"Material Library"/);
  assert.match(content, /label:\s*"OEM \/ ODM"/);
  assert.match(content, /label:\s*"Press & Notes"/);
  assert.match(content, /h-\[var\(--nav-height\)\]/);
  assert.match(content, /fixed left-0 top-\[var\(--nav-height\)\] w-screen/);
  assert.match(content, /group-hover\/nav-item:visible/);
  assert.match(content, /group-focus-within\/nav-item:visible/);
});

test("GlobalNav dropdown glass switches with the background-aware nav theme", async () => {
  const content = await source("src/components/GlobalNav.tsx");

  assert.match(content, /dropdownGlassClass\s*=\s*invert\s*\?/);
  assert.match(content, /bg-paper\/99/);
  assert.match(content, /bg-charcoal\/98/);
  assert.match(content, /aria-haspopup="true"/);
});
