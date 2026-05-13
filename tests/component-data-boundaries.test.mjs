import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("MaterialBentoGrid receives categories and materials through props", async () => {
  const content = await source("src/components/MaterialBentoGrid.tsx");

  assert.doesNotMatch(content, /getMaterial|materialCategories/);
  assert.match(content, /categories: MaterialCategory\[\]/);
  assert.match(content, /materials: Material\[\]/);
});

test("ExploreCarousel builds slides from props instead of module-level fixtures", async () => {
  const content = await source("src/components/ExploreCarousel.tsx");

  assert.doesNotMatch(content, /getMaterial|materialCategories/);
  assert.match(content, /categories: MaterialCategory\[\]/);
  assert.match(content, /materials: Material\[\]/);
  assert.doesNotMatch(content, /const slides = \[/);
});

test("ExploreCarousel auto-rotates slides and keeps arrows as unframed controls", async () => {
  const content = await source("src/components/ExploreCarousel.tsx");

  assert.match(content, /setInterval/);
  assert.match(content, /clearInterval/);
  assert.match(content, /aria-label="Previous slide"/);
  assert.match(content, /aria-label="Next slide"/);
  assert.doesNotMatch(content, /border border-charcoal\/20 bg-paper\/90/);
});

test("ApplicationGrid receives material SKUs through props", async () => {
  const content = await source("src/components/ApplicationGrid.tsx");

  assert.doesNotMatch(content, /getSkusForMaterial/);
  assert.match(content, /skus: Sku\[\]/);
});

test("homepage loads CMS-managed homepage settings", async () => {
  const page = await source("src/app/[locale]/page.tsx");
  const hero = await source("src/components/HeroVideo.tsx");
  const carousel = await source("src/components/ExploreCarousel.tsx");

  assert.match(page, /loadHomePageSettings/);
  assert.match(page, /homeSettings\.hero/);
  assert.match(page, /homeSettings\.explore/);
  assert.match(hero, /hero: HomeHero/);
  assert.match(carousel, /categorySlugs\?: string\[\]/);
  assert.match(carousel, /productSlides\?: ExploreSlide\[\]/);
});

test("Studio route explains missing Sanity project configuration before loading Studio", async () => {
  const page = await source("src/app/studio/[[...tool]]/page.tsx");

  assert.match(page, /NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(page, /replace-me/);
  assert.match(page, /Sanity project is not configured/);
});
