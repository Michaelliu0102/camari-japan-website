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
  assert.match(loaders, /withConfig\(\{ useCdn: process\.env\.NEXT_PUBLIC_SITE_KEY === "china" \}\)/);
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

test("Japanese about content uses the new material-led brand narrative", async () => {
  const page = await source("src/app/[locale]/about/page.tsx");
  const copy = await source("src/data/about-page-ja.json");

  assert.match(page, /aboutSettings\.bodyTitle\[locale\]/);
  assert.match(page, /about-copy-title/);
  assert.match(page, /ShinyHeading/);
  assert.match(copy, /FROM MATERIAL TO MORE\./);
  assert.match(copy, /素材から、その先へ。/);
  assert.match(copy, /世界のいい素材を、\\nもっと身近に。/);
  assert.match(copy, /日本・イタリア・上海・オーストラリア/);
  assert.match(copy, /CAMARIは、素材への専門性を軸に、その可能性をさまざまなかたちで届けていきます。/);
  assert.doesNotMatch(copy, /CAMARIは、素材が持つ可能性を引き出し/);
});

test("Japanese about content presents Material, OEM, Brand, and certified factory operations", async () => {
  const page = await source("src/app/[locale]/about/page.tsx");
  const copy = await source("src/data/about-page-ja.json");

  assert.match(page, /aboutSettings\.businessItems\.map/);
  assert.match(page, /aboutSettings\.manufacturingParagraphs/);
  assert.match(page, /\/uploads\/about\/manufacturing\.jpeg/);
  assert.match(copy, /"title": "MATERIAL"/);
  assert.match(copy, /"title": "OEM"/);
  assert.match(copy, /"title": "BRAND"/);
  assert.match(copy, /IATF 16949認証/);
});

test("Japanese about typography follows the annotated hierarchy and removes the crossed-out OEM label", async () => {
  const page = await source("src/app/[locale]/about/page.tsx");
  const oemLoop = await source("src/components/OemLogoLoop.tsx");

  assert.match(page, /const japaneseSectionLabelClass/);
  assert.match(page, /md:text-\[0\.9rem\]/);
  assert.match(page, /md:text-\[3\.1rem\]/);
  assert.match(page, /max-w-\[18ch\] whitespace-pre-line/);
  assert.doesNotMatch(page, /py-7 font-medium leading-\[2\.15\] text-charcoal/);
  assert.doesNotMatch(oemLoop, /自動車パートナー/);
  assert.match(oemLoop, />ご一緒したOEM<\/h2>/);
});
