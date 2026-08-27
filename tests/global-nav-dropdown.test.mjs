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

  assert.match(content, /const glassClass = mobileOpen/);
  assert.match(content, /:\s*invert\s*\?/);
  assert.match(content, /glass-nav-light/);
  assert.match(content, /glass-nav/);
  assert.match(content, /bg-white text-charcoal shadow-material/);
  assert.match(content, /aria-haspopup="true"/);
});

test("GlobalNav swaps between uploaded light and dark logo assets", async () => {
  const content = await source("src/components/GlobalNav.tsx");

  assert.match(content, /import Image from "next\/image"/);
  assert.match(content, /const logoSrc = useDarkControls \? "\/uploads\/logo\/black-int\.png" : "\/uploads\/logo\/white-int\.png";/);
  assert.match(content, /className="h-auto w-\[8\.5rem\].*md:w-\[12rem\]"/);
  assert.match(content, /src=\{logoSrc\}/);
  assert.match(content, /alt="CAMARI"/);
});

test("GlobalNav keeps every primary route visible in a scrollable mobile menu", async () => {
  const content = await source("src/components/GlobalNav.tsx");

  assert.match(content, /label:\s*\{\s*en:\s*"Home",\s*ja:\s*"ホーム"\s*\}/);
  assert.match(content, /label:\s*\{\s*en:\s*"About",\s*ja:\s*"会社情報"\s*\}/);
  assert.match(content, /label:\s*\{\s*en:\s*"Material",\s*ja:\s*"素材"\s*\}/);
  assert.match(content, /overflow-y-auto overscroll-contain bg-paper text-charcoal/);
  assert.match(content, /aria-label=\{locale === "en" \? "Mobile navigation"/);
  assert.match(content, /document\.body\.style\.overflow = "hidden"/);
});

test("GlobalNav uses compact touch-safe controls on narrow screens", async () => {
  const content = await source("src/components/GlobalNav.tsx");

  assert.match(content, /h-11 w-11 shrink-0/);
  assert.match(content, /min-h-11 items-center/);
  assert.match(content, /useDarkControls = invert \|\| mobileOpen/);
});
