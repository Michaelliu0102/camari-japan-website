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
    NEXT_PUBLIC_ALTERNATE_SITE_HOME_URL: "https://www.camari-international.co.jp"
  });

  assert.deepEqual(
    {
      siteKey: globalSite.siteKey,
      siteName: globalSite.siteName,
      organizationName: globalSite.organizationName,
      defaultLocale: globalSite.defaultLocale,
      sanityMarket: globalSite.sanityMarket,
      siteUrl: globalSite.siteUrl,
      alternateSiteHomeUrl: globalSite.alternateSiteHomeUrl,
      localeSiteUrls: globalSite.localeSiteUrls
    },
    {
      siteKey: "global",
      siteName: "CAMARI INTERNATIONAL",
      organizationName: "CAMARI INTERNATIONAL",
      defaultLocale: "en",
      sanityMarket: "global",
      siteUrl: "https://www.camari-international.com",
      alternateSiteHomeUrl: "https://www.camari-international.co.jp",
      localeSiteUrls: {
        en: "https://www.camari-international.com",
        ja: "https://www.camari-international.co.jp"
      }
    }
  );
  const japanSite = siteConfigModule.resolveSiteConfig({
    NEXT_PUBLIC_SITE_KEY: "japan",
    NEXT_PUBLIC_SITE_URL: "https://www.camari-international.co.jp",
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
      alternateSiteHomeUrl: japanSite.alternateSiteHomeUrl,
      localeSiteUrls: japanSite.localeSiteUrls
    },
    {
      siteKey: "japan",
      siteName: "CAMARI INTERNATIONAL JAPAN",
      organizationName: "CAMARI INTERNATIONAL JAPAN",
      defaultLocale: "ja",
      sanityMarket: "japan",
      siteUrl: "https://www.camari-international.co.jp",
      alternateSiteHomeUrl: "https://www.camari-international.com",
      localeSiteUrls: {
        en: "https://www.camari-international.com",
        ja: "https://www.camari-international.co.jp"
      }
    }
  );
  assert.equal(japanSite.legalName, "株式会社カマリ・インターナショナル・ジャパン");
  assert.equal(japanSite.contact.phone, "03-6272-4971");
  assert.equal(japanSite.contact.fax, "03-6272-4972");
  assert.equal(japanSite.contact.address.ja, "〒102-0073 東京都千代田区九段北1丁目14-16 PILE KUDAN 4F");
  assert.deepEqual(japanSite.contact.geo, {
    latitude: 35.696335,
    longitude: 139.749207
  });
});

test("site config falls back to the matching production locale domains", async () => {
  const siteConfigModule = await importOptionalTsModule("src/lib/site-config.ts");

  assert.ok(siteConfigModule, "expected src/lib/site-config.ts to exist");

  const japanSite = siteConfigModule.resolveSiteConfig({
    NEXT_PUBLIC_SITE_KEY: "japan",
    NEXT_PUBLIC_SITE_URL: "https://www.camari-international.co.jp"
  });

  assert.equal(japanSite.alternateSiteHomeUrl, "https://www.camari-international.com");
  assert.deepEqual(japanSite.localeSiteUrls, {
    en: "https://www.camari-international.com",
    ja: "https://www.camari-international.co.jp"
  });
});

test("site config can keep both languages inside a production preview deployment", async () => {
  const siteConfigModule = await importOptionalTsModule("src/lib/site-config.ts");

  assert.ok(siteConfigModule, "expected src/lib/site-config.ts to exist");

  const previewSite = siteConfigModule.resolveSiteConfig({
    NEXT_PUBLIC_SITE_KEY: "japan",
    NEXT_PUBLIC_SITE_URL: "https://camari-japan-preview.example.test",
    NEXT_PUBLIC_EN_SITE_URL: "https://camari-japan-preview.example.test",
    NEXT_PUBLIC_JA_SITE_URL: "https://camari-japan-preview.example.test",
    NEXT_PUBLIC_ENABLE_LOCALE_PREVIEW: "true"
  });

  assert.equal(previewSite.enableLocalePreview, true);
  assert.deepEqual(previewSite.localeSiteUrls, {
    en: "https://camari-japan-preview.example.test",
    ja: "https://camari-japan-preview.example.test"
  });
});

test("SEO brand formatting is locale-specific and never duplicates overlapping brand names", async () => {
  const siteConfigModule = await importOptionalTsModule("src/lib/site-config.ts");

  assert.ok(siteConfigModule, "expected src/lib/site-config.ts to exist");
  assert.equal(siteConfigModule.getSeoBrandName("en"), "CAMARI INTERNATIONAL");
  assert.equal(siteConfigModule.getSeoBrandName("ja"), "カマリ・インターナショナル");
  assert.equal(
    siteConfigModule.formatPageTitle("Materials | CAMARI JAPAN", "en"),
    "Materials | CAMARI INTERNATIONAL"
  );
  assert.equal(
    siteConfigModule.formatPageTitle("素材 | CAMARI INTERNATIONAL JAPAN", "ja"),
    "素材 | カマリ・インターナショナル"
  );
  assert.equal(
    siteConfigModule.replaceSiteBrand("About CAMARI INTERNATIONAL JAPAN", "CAMARI INTERNATIONAL"),
    "About CAMARI INTERNATIONAL"
  );
  assert.doesNotMatch(
    siteConfigModule.formatPageTitle("About | CAMARI INTERNATIONAL JAPAN", "en"),
    /JAPAN JAPAN|CAMARI INTERNATIONAL\s*\|\s*CAMARI INTERNATIONAL/u
  );
});

test("public routing redirects prefixed URLs and rewrites clean URLs to internal locale routes", async () => {
  const routingSource = await source("src/lib/public-routing.ts");

  assert.match(routingSource, /export function resolvePublicRoute/);
  assert.match(routingSource, /alternateSiteHomeUrl/);
  assert.match(routingSource, /requestedLocale !== siteConfig\.defaultLocale/);
  assert.match(routingSource, /buildAlternateSiteDestination\(siteConfig\.alternateSiteHomeUrl, pathname\)/);
  assert.match(routingSource, /destination:\s*alternateDestination/);
  assert.match(routingSource, /destination:\s*normalizePublicPath\(pathname\)/);
  assert.match(routingSource, /destination:\s*normalizedPath === "\/" \? `\/\$\{siteConfig\.defaultLocale\}` : `\/\$\{siteConfig\.defaultLocale\}\$\{normalizedPath\}`/);
  assert.match(routingSource, /pathname\.match\(\s*\/\^\\\/\(en\|ja\)\(\?=\\\/\|\$\)\/u\s*\)/);
});

test("public routing guards against redirecting an alternate locale URL to itself", async () => {
  const routingSource = await source("src/lib/public-routing.ts");
  const proxySource = await source("src/middleware.ts");

  assert.match(routingSource, /function isCurrentRequestPath\(destination: string, requestUrl\?: string\)/);
  assert.match(routingSource, /new URL\(destination, currentUrl\)/);
  assert.match(routingSource, /destinationUrl\.origin === currentUrl\.origin && destinationUrl\.pathname === currentUrl\.pathname/);
  assert.match(routingSource, /if \(isCurrentRequestPath\(alternateDestination, requestUrl\)\) \{\s*return \{ type: "next" \};\s*\}/);
  assert.match(proxySource, /resolvePublicRoute\(request\.nextUrl\.pathname, siteConfig, request\.url\)/);
});

test("middleware marks internal locale rewrites so clean public URLs do not redirect to themselves", async () => {
  const proxySource = await source("src/middleware.ts");

  assert.match(proxySource, /const internalLocaleRewriteHeader = "x-camari-locale-rewrite"/);
  assert.match(proxySource, /request\.headers\.get\(internalLocaleRewriteHeader\) === "1"/);
  assert.match(proxySource, /requestHeaders\.set\(internalLocaleRewriteHeader, "1"\)/);
  assert.match(proxySource, /NextResponse\.rewrite\(targetUrl,\s*\{\s*request:\s*\{\s*headers:\s*requestHeaders/);
});

test("public routing preserves the page path when switching production domains", async () => {
  const routingSource = await source("src/lib/public-routing.ts");

  assert.match(routingSource, /const normalizedPath = normalizePublicPath\(pathname\)/);
  assert.match(routingSource, /return new URL\(normalizedPath, `\$\{alternateSiteHomeUrl\}\/`\)\.toString\(\)/);
  assert.match(routingSource, /buildAlternateSiteDestination\(siteConfig\.alternateSiteHomeUrl, pathname\)/);
  assert.match(routingSource, /destination:\s*alternateDestination/);
});

test("SEO metadata emits canonical, cross-domain hreflang, Open Graph, and Twitter fields", async () => {
  const metadataSource = await source("src/lib/metadata.ts");

  assert.match(metadataSource, /canonical:\s*url/);
  assert.match(metadataSource, /languages:\s*\{/);
  assert.match(metadataSource, /"x-default":\s*absoluteLocalizedUrl/);
  assert.match(metadataSource, /locale:\s*openGraphLocales\[locale\]/);
  assert.match(metadataSource, /card:\s*"summary_large_image"/);
  assert.match(metadataSource, /socialImage = image \|\| siteConfig\.defaultOgImage/);
  assert.match(metadataSource, /"max-snippet":\s*-1/);
  assert.match(metadataSource, /"max-image-preview":\s*"large"/);
  assert.match(metadataSource, /"max-video-preview":\s*-1/);
  assert.match(metadataSource, /type:\s*"article"/);
  assert.match(metadataSource, /publishedTime: article\.publishedTime/);
});

test("sitemap uses content timestamps and robots allows search crawlers while excluding private utilities", async () => {
  const sitemapSource = await source("src/app/sitemap.ts");
  const robotsSource = await source("src/app/robots.ts");

  assert.doesNotMatch(sitemapSource, /lastModified:\s*new Date\(\)/);
  assert.doesNotMatch(sitemapSource, /changeFrequency|priority:/);
  assert.match(sitemapSource, /updatedAt/);
  assert.match(sitemapSource, /loadProductCategories/);
  assert.match(sitemapSource, /locale === "en" \|\| !skaiProductTypeSlugs\.has/);
  assert.match(robotsSource, /userAgent:\s*"OAI-SearchBot"/);
  assert.match(robotsSource, /"\/api", "\/studio", "\/test-animation"/);
  assert.match(robotsSource, /host:\s*siteConfig\.siteUrl/);
});
