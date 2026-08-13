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
  assert.match(content, /label:\s*\{\s*en:\s*"Material",\s*ja:\s*"素材"\s*\}/);
  assert.match(content, /label:\s*\{\s*en:\s*"Automotive Interior Accessories"/);
  assert.match(content, /label:\s*\{\s*en:\s*"Corporate Gifts"/);
  assert.match(content, /label:\s*\{\s*en:\s*"Press & Notes"/);
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

test("GlobalNav swaps between uploaded light and dark logo assets", async () => {
  const content = await source("src/components/GlobalNav.tsx");

  assert.match(content, /import Image from "next\/image"/);
  assert.match(content, /const logoSrc = invert \? "\/uploads\/logo\/black-int\.png" : "\/uploads\/logo\/white-int\.png";/);
  assert.match(content, /className="h-auto w-\[10\.5rem\] md:w-\[12rem\]"/);
  assert.match(content, /src=\{logoSrc\}/);
  assert.match(content, /alt="CAMARI"/);
});
