import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("the global layout provides consent state to every localized route", async () => {
  const layout = await source("src/app/layout.tsx");

  assert.match(layout, /<ConsentProvider defaultLocale=\{siteConfig\.defaultLocale\}>/);
});

test("Google Maps only renders after external-media consent", async () => {
  const controlledMap = await source("src/components/ConsentControlledMap.tsx");
  const contactPage = await source("src/app/[locale]/contact/page.tsx");
  const branchMap = await source("src/components/BranchLocationMap.tsx");

  assert.match(controlledMap, /if \(externalMediaAllowed\)/);
  assert.match(controlledMap, /<iframe/);
  assert.match(contactPage, /<ConsentControlledMap/);
  assert.doesNotMatch(contactPage, /<iframe/);
  assert.match(branchMap, /<ConsentControlledMap/);
  assert.doesNotMatch(branchMap, /<iframe/);
});

test("consent choices are versioned and can be reopened from the footer", async () => {
  const manager = await source("src/components/ConsentManager.tsx");
  const footer = await source("src/components/Footer.tsx");
  const button = await source("src/components/CookiePreferencesButton.tsx");

  assert.match(manager, /camari-consent-v1/);
  assert.match(manager, /externalMedia:/);
  assert.match(manager, /expiresAt:/);
  assert.match(manager, /Allow all cookies/);
  assert.match(footer, /<CookiePreferencesButton locale=\{locale\}/);
  assert.match(button, /COOKIE PREFERENCES/);
});

test("the bilingual Cookie Policy documents actual storage and optional Google Maps use", async () => {
  const policy = await source("src/app/[locale]/cookie-policy/page.tsx");
  const sitemap = await source("src/app/sitemap.ts");

  assert.match(policy, /camari-consent-v1/);
  assert.match(policy, /Google Maps is blocked by default/);
  assert.match(policy, /We do not currently use advertising, profiling, social-media tracking, or audience analytics cookies/);
  assert.match(policy, /Google プライバシーポリシー/);
  assert.match(sitemap, /"\/cookie-policy"/);
});
