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
  assert.match(structuredDataSource, /export function buildLocalBusinessJsonLd/);
  assert.match(structuredDataSource, /"@type": "LocalBusiness"/);
  assert.match(structuredDataSource, /export function buildBreadcrumbJsonLd/);
  assert.match(structuredDataSource, /"@type": "BreadcrumbList"/);
  assert.match(structuredDataSource, /new URL\(normalizePublicPath\(path\), `\$\{site\.siteUrl\}\/`\)\.toString\(\)/);
  assert.match(structuredDataSource, /export function buildProductJsonLd/);
  assert.match(structuredDataSource, /"@type": "Product"/);
});
