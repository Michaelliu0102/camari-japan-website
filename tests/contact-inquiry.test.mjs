import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import ts from "typescript";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function compileModule(sourcePath, outputPath) {
  const source = await readFile(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
    fileName: sourcePath,
  }).outputText.replace(/from "(\.\/[^\"]+)";/g, (_match, specifier) =>
    `from "${specifier.endsWith(".js") ? specifier : `${specifier}.js`}";`
  );

  await writeFile(outputPath, output);
}

async function loadContactInquiryModule() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-contact-inquiry-"));
  const compiledInquiry = path.join(root, "src/lib/contact-inquiry.js");
  const compiledCountries = path.join(root, "src/lib/country-regions.js");

  await mkdir(path.dirname(compiledInquiry), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await compileModule(path.join(projectRoot, "src/lib/country-regions.ts"), compiledCountries);
  await compileModule(path.join(projectRoot, "src/lib/contact-inquiry.ts"), compiledInquiry);

  const module = await import(`${pathToFileURL(compiledInquiry).href}?${Date.now()}`);
  return { ...module, cleanup: () => rm(root, { recursive: true, force: true }) };
}

const basePayload = {
  locale: "en",
  name: "Alex Chen",
  email: "alex@example.com",
  phone: "+1 555 0100",
  company: "Example Studio",
  message: "We need materials for a hospitality project.",
  interests: ["Material"],
};

test("English inquiries require and normalize a country or region", async () => {
  const { parseContactInquiryPayload, cleanup } = await loadContactInquiryModule();

  const valid = parseContactInquiryPayload({ ...basePayload, countryCode: "us" });
  assert.equal(valid.ok, true);
  assert.equal(valid.value.countryCode, "US");
  assert.equal(valid.value.countryRegion, "United States");

  const missing = parseContactInquiryPayload(basePayload);
  assert.equal(missing.ok, false);
  assert.match(missing.error, /country or region/i);

  await cleanup();
});

test("Japanese inquiries default to Japan without a visible country field", async () => {
  const { parseContactInquiryPayload, cleanup } = await loadContactInquiryModule();

  const parsed = parseContactInquiryPayload({
    ...basePayload,
    locale: "ja",
    countryCode: "US",
  });

  assert.equal(parsed.ok, true);
  assert.equal(parsed.value.countryCode, "JP");
  assert.equal(parsed.value.countryRegion, "Japan");

  await cleanup();
});

test("Inquiry form only renders Country / Region for English", async () => {
  const source = await readFile(
    path.join(projectRoot, "src/components/CTAMessageDrawer.tsx"),
    "utf8",
  );

  assert.match(source, /countryRegion: "Country \/ Region"/);
  assert.match(source, /locale === "en" \? \(/);
  assert.match(source, /countryCode: locale === "ja" \? "JP" : form\.countryCode/);
  assert.match(source, /COUNTRY_REGION_OPTIONS\.map/);
});
