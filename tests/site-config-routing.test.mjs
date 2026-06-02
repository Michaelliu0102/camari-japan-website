import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function importTsModule(relativePath) {
  const moduleUrl = pathToFileURL(path.join(projectRoot, relativePath));
  moduleUrl.searchParams.set("t", `${Date.now()}-${Math.random()}`);
  return import(moduleUrl.href);
}

async function importOptionalTsModule(relativePath) {
  try {
    return await importTsModule(relativePath);
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

async function source(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("localizedPath keeps the preview locale prefix locally and strips accidental nested locale segments", async () => {
  const localeSource = await source("src/lib/locales.ts");

  assert.match(localeSource, /import \{ siteConfig \} from "\.\/site-config"/);
  assert.match(localeSource, /siteConfig\.enableLocalePreview && _locale !== siteConfig\.defaultLocale/);
  assert.match(localeSource, /return normalizedPath === "\/" \? `\/\$\{_locale\}` : `\/\$\{_locale\}\$\{normalizedPath\}`/);
  assert.match(localeSource, /return normalizedPath/);
});

test("site config resolves deployment-specific identity for global and japan sites", async () => {
  const siteConfigModule = await importOptionalTsModule("src/lib/site-config.ts");

  assert.ok(siteConfigModule, "expected src/lib/site-config.ts to exist");
  assert.equal(typeof siteConfigModule.resolveSiteConfig, "function");

  const globalSite = siteConfigModule.resolveSiteConfig({
    NEXT_PUBLIC_SITE_KEY: "global",
    NEXT_PUBLIC_SITE_URL: "https://www.camari-international.com",
    NEXT_PUBLIC_ALTERNATE_SITE_HOME_URL: "https://www.camari.co.jp"
  });

  assert.deepEqual(
    {
      siteKey: globalSite.siteKey,
      siteName: globalSite.siteName,
      organizationName: globalSite.organizationName,
      defaultLocale: globalSite.defaultLocale,
      sanityMarket: globalSite.sanityMarket,
      siteUrl: globalSite.siteUrl,
      alternateSiteHomeUrl: globalSite.alternateSiteHomeUrl
    },
    {
      siteKey: "global",
      siteName: "CAMARI INTERNATIONAL",
      organizationName: "CAMARI INTERNATIONAL",
      defaultLocale: "en",
      sanityMarket: "global",
      siteUrl: "https://www.camari-international.com",
      alternateSiteHomeUrl: "https://www.camari.co.jp"
    }
  );

  const japanSite = siteConfigModule.resolveSiteConfig({
    NEXT_PUBLIC_SITE_KEY: "japan",
    NEXT_PUBLIC_SITE_URL: "https://www.camari.co.jp",
    NEXT_PUBLIC_ALTERNATE_SITE_HOME_URL: "https://www.camari-international.com"
  });

  assert.deepEqual(
    {
      siteKey: japanSite.siteKey,
      siteName: japanSite.siteName,
      organizationName: japanSite.organizationName,
      defaultLocale: japanSite.defaultLocale,
      sanityMarket: japanSite.sanityMarket,
      siteUrl: japanSite.siteUrl,
      alternateSiteHomeUrl: japanSite.alternateSiteHomeUrl
    },
    {
      siteKey: "japan",
      siteName: "CAMARI INTERNATIONAL JAPAN",
      organizationName: "CAMARI INTERNATIONAL JAPAN",
      defaultLocale: "ja",
      sanityMarket: "japan",
      siteUrl: "https://www.camari.co.jp",
      alternateSiteHomeUrl: "https://www.camari-international.com"
    }
  );
});

test("site config falls back to the current site homepage when no alternate site URL is configured", async () => {
  const siteConfigModule = await importOptionalTsModule("src/lib/site-config.ts");

  assert.ok(siteConfigModule, "expected src/lib/site-config.ts to exist");

  const japanSite = siteConfigModule.resolveSiteConfig({
    NEXT_PUBLIC_SITE_KEY: "japan",
    NEXT_PUBLIC_SITE_URL: "https://www.camari.co.jp"
  });

  assert.equal(japanSite.alternateSiteHomeUrl, "/");
});

test("public routing redirects prefixed URLs and rewrites clean URLs to internal locale routes", async () => {
  const routingSource = await source("src/lib/public-routing.ts");

  assert.match(routingSource, /export function resolvePublicRoute/);
  assert.match(routingSource, /alternateSiteHomeUrl/);
  assert.match(routingSource, /requestedLocale !== siteConfig\.defaultLocale/);
  assert.match(routingSource, /destination:\s*siteConfig\.alternateSiteHomeUrl/);
  assert.match(routingSource, /destination:\s*normalizePublicPath\(pathname\)/);
  assert.match(routingSource, /destination:\s*normalizedPath === "\/" \? `\/\$\{siteConfig\.defaultLocale\}` : `\/\$\{siteConfig\.defaultLocale\}\$\{normalizedPath\}`/);
  assert.match(routingSource, /pathname\.match\(\s*\/\^\\\/\(en\|ja\)\(\?=\\\/\|\$\)\/u\s*\)/);
});
