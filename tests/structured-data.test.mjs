import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function importOptionalTsModule(relativePath) {
  try {
    const moduleUrl = pathToFileURL(path.join(projectRoot, relativePath));
    moduleUrl.searchParams.set("t", `${Date.now()}-${Math.random()}`);
    return await import(moduleUrl.href);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error.code === "ERR_MODULE_NOT_FOUND" || error.code === "ENOENT")
    ) {
      return null;
    }

    throw error;
  }
}

test("structured data builders emit organization and breadcrumb schema for the active site only", async () => {
  const structuredDataModule = await importOptionalTsModule("src/lib/structured-data.ts");
  const structuredDataSource = await readFile(path.join(projectRoot, "src/lib/structured-data.ts"), "utf8");

  assert.ok(structuredDataModule || structuredDataSource, "expected src/lib/structured-data.ts to exist");
  assert.match(structuredDataSource, /export function buildOrganizationJsonLd/);
  assert.match(structuredDataSource, /"@type": "Organization"/);
  assert.match(structuredDataSource, /function organizationReference/);
  assert.match(structuredDataSource, /"@type": "ImageObject"/);
  assert.match(structuredDataSource, /uploads\/logo\/black-int\.png/);
  assert.match(structuredDataSource, /export function buildLocalBusinessJsonLd/);
  assert.match(structuredDataSource, /"@type": "LocalBusiness"/);
  assert.match(structuredDataSource, /"@type": "PostalAddress"/);
  assert.match(structuredDataSource, /"@type": "GeoCoordinates"/);
  assert.match(structuredDataSource, /openingHoursSpecification/);
  assert.match(structuredDataSource, /faxNumber: site\.contact\.fax/);
  assert.match(structuredDataSource, /export function buildWebSiteJsonLd/);
  assert.match(structuredDataSource, /"@type": "WebSite"/);
  assert.match(structuredDataSource, /alternateName: site\.siteKey === "japan" \? \["CAMARI JAPAN", "CAMARI"\] : "CAMARI"/);
  assert.match(structuredDataSource, /inLanguage: locale === "ja" \? "ja-JP" : "en"/);
  assert.match(structuredDataSource, /publisher:\s*\{\s*"@id": entityId\(site, "organization"\)/);
  assert.match(structuredDataSource, /export function buildBreadcrumbJsonLd/);
  assert.match(structuredDataSource, /"@type": "BreadcrumbList"/);
  assert.match(structuredDataSource, /new URL\(normalizePublicPath\(path\), `\$\{site\.siteUrl\}\/`\)\.toString\(\)/);
  assert.match(structuredDataSource, /export function buildProductJsonLd/);
  assert.match(structuredDataSource, /"@type": "Product"/);
  assert.match(structuredDataSource, /image: product\.image \? toAbsoluteResourceUrl/);
  assert.match(structuredDataSource, /export function buildNewsArticleJsonLd/);
  assert.match(structuredDataSource, /"@type": "NewsArticle"/);
  assert.match(structuredDataSource, /mainEntityOfPage/);
  assert.match(structuredDataSource, /datePublished: article\.datePublished/);
  assert.match(structuredDataSource, /dateModified: article\.dateModified \?\? article\.datePublished/);
  assert.match(structuredDataSource, /inLanguage: article\.locale === "ja" \? "ja-JP" : "en"/);
  assert.match(structuredDataSource, /author: organizationReference\(site\)/);
  assert.match(structuredDataSource, /publisher: organizationReference\(site\)/);
});

test("homepage renders WebSite and Organization entities together", async () => {
  const homepageSource = await readFile(path.join(projectRoot, "src/app/[locale]/page.tsx"), "utf8");

  assert.match(homepageSource, /buildOrganizationJsonLd, buildWebSiteJsonLd/);
  assert.match(homepageSource, /<JsonLd data=\{buildOrganizationJsonLd\(siteConfig\)\} \/>/);
  assert.match(homepageSource, /<JsonLd data=\{buildWebSiteJsonLd\(siteConfig, locale\)\} \/>/);
});

test("media detail pages emit article metadata and NewsArticle structured data", async () => {
  const mediaDetailSource = await readFile(path.join(projectRoot, "src/app/[locale]/media/[newsSlug]/page.tsx"), "utf8");

  assert.match(mediaDetailSource, /article:\s*\{\s*publishedTime: item\.date/);
  assert.match(mediaDetailSource, /buildNewsArticleJsonLd\(siteConfig/);
  assert.match(mediaDetailSource, /<JsonLd data=\{articleSchema\} \/>/);
});
