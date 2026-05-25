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
  assert.match(content, /label:\s*"Material"/);
  assert.match(content, /label:\s*"Automotive Interior Accessories"/);
  assert.match(content, /label:\s*"Corporate Gifts"/);
  assert.match(content, /label:\s*"Press & Notes"/);
  assert.match(content, /h-\[var\(--nav-height\)\]/);
  assert.match(content, /fixed left-0 top-\[var\(--nav-height\)\] w-screen/);
  assert.match(content, /group-hover\/nav-item:visible/);
  assert.match(content, /group-focus-within\/nav-item:visible/);
});

test("GlobalNav dropdown glass switches with the background-aware nav theme", async () => {
  const content = await source("src/components/GlobalNav.tsx");

  assert.match(content, /glassClass\s*=\s*invert\s*\?/);
  assert.match(content, /glass-nav-light/);
  assert.match(content, /glass-nav/);
  assert.match(content, /bg-white text-charcoal shadow-material/);
  assert.match(content, /aria-haspopup="true"/);
});
