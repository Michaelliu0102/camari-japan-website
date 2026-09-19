import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("home Explore uses a dedicated mobile flow without clipped text", async () => {
  const carousel = await source("src/components/ExploreCarousel.tsx");

  assert.match(carousel, /min-h-\[100svh\].*md:hidden/);
  assert.match(carousel, /object-contain/);
  assert.match(carousel, /aria-live="polite"/);
  assert.match(carousel, /Math\.abs\(distance\) >= 45/);
  assert.match(carousel, /<p className="mt-4 max-w-\[36rem\] text-base leading-7 text-white\/78">/);
});

test("desktop Explore keeps the image stage, localized copy, and action in separate grid rows", async () => {
  const carousel = await source("src/components/ExploreCarousel.tsx");

  assert.match(carousel, /grid-rows-\[auto_minmax\(20rem,1fr\)_auto\]/);
  assert.match(carousel, /className="absolute left-1\/2 top-1\/2/);
  assert.match(carousel, /aria-live="polite" className="mx-auto w-full max-w-\[54rem\] text-center"/);
  assert.doesNotMatch(carousel, /bottom-\[4\.75rem\]/);
  assert.doesNotMatch(carousel, /absolute inset-x-0 bottom-0 mx-auto flex max-w-\[54rem\]/);
});

test("home hero and calls to action use mobile viewport and touch sizing", async () => {
  const hero = await source("src/components/HeroVideo.tsx");
  const cta = await source("src/components/CTASection.tsx");
  const styles = await source("src/app/globals.css");

  assert.match(hero, /h-\[100svh\] min-h-\[36rem\]/);
  assert.match(hero, /max-w-\[20rem\].*items-center/);
  assert.match(cta, /min-h-14 w-full max-w-\[20rem\]/);
  assert.match(styles, /--nav-height: 72px/);
  assert.match(styles, /@media \(min-width: 768px\)[\s\S]*--nav-height: 80px/);
});
