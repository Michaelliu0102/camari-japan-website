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

test("ApplicationGrid receives material SKUs through props", async () => {
  const content = await source("src/components/ApplicationGrid.tsx");

  assert.doesNotMatch(content, /getSkusForMaterial/);
  assert.match(content, /skus: Sku\[\]/);
});
