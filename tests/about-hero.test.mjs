import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("about page hero uses the showroom image and concise CAMARI wordmark copy", async () => {
  const page = await source("src/app/[locale]/about/page.tsx");
  const content = await source("src/lib/content.ts");
  const styles = await source("src/app/globals.css");
  const loaders = await source("src/sanity/lib/loaders.ts");

  assert.match(page, /loadAboutPageSettings/);
  assert.match(page, /dynamic = "force-dynamic"/);
  assert.match(loaders, /withConfig\(\{ useCdn: false \}\)/);
  assert.match(content, /showroom\.png/);
  assert.match(page, /aboutSettings\.heroImage/);
  assert.match(page, /aboutSettings\.heroTitle\[locale\]/);
  assert.match(page, /about-hero-wordmark/);
  assert.match(page, /min-h-screen/);
  assert.match(page, /href="#about-company"/);
  assert.match(page, /aboutSettings\.exploreLabel\[locale\]/);
  assert.match(page, /id="about-company"/);
  assert.doesNotMatch(page, /rgba\(24,22,20,0\.82\)/);
  assert.doesNotMatch(page, /title="About"/);
  assert.doesNotMatch(page, /subtitle=\{site\.slogan\[locale\]\}/);
  assert.match(styles, /\.about-hero-wordmark/);
});

test("about content uses a single-column ABOUT CAMARI heading with company label styling and shiny effect", async () => {
  const page = await source("src/app/[locale]/about/page.tsx");
  const content = await source("src/lib/content.ts");
  const schema = await source("src/sanity/schemaTypes/aboutPage.ts");
  const seed = await source("scripts/seedAboutPage.mjs");

  assert.match(page, /aboutSettings\.bodyLabel\[locale\]/);
  assert.match(page, /aboutSettings\.bodyTitle\[locale\]/);
  assert.doesNotMatch(page, /ABOUT CAMARI INTERNATIONAL/);
  assert.match(page, /about-copy-title/);
  assert.match(page, /ShinyHeading/);
  assert.match(page, /splitParagraphs\(aboutSettings\.bodyParagraphs/);
  assert.match(page, /flatMap/);
  assert.match(page, /split\(\/\\n\\s\*\\n\/\)/);
  assert.doesNotMatch(page, /md:text-\[4\.4rem\]/);
  assert.doesNotMatch(content, /Our work balances/);
  assert.doesNotMatch(schema, /Our work balances/);
  assert.doesNotMatch(seed, /Our work balances/);
  assert.doesNotMatch(page, /md:grid-cols-12/);
});

test("about content includes an editable manufacturing section below company copy", async () => {
  const page = await source("src/app/[locale]/about/page.tsx");
  const content = await source("src/lib/content.ts");
  const schema = await source("src/sanity/schemaTypes/aboutPage.ts");
  const seed = await source("scripts/seedAboutPage.mjs");

  assert.match(page, /aboutSettings\.manufacturingLabel\[locale\]/);
  assert.match(page, /aboutSettings\.manufacturingTitle\[locale\]/);
  assert.match(page, /aboutSettings\.manufacturingParagraphs/);
  assert.match(page, /manufacturingParagraphs\.map/);
  assert.match(content, /SHENGHUA is factory from 2000\./);
  assert.match(schema, /manufacturingLabel/);
  assert.match(schema, /manufacturingTitle/);
  assert.match(seed, /SHENGHUA is factory from 2000\./);
});
