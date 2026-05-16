import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import ts from "typescript";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function loadNewsletterModule() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-newsletter-lib-"));
  const compiledNewsletter = path.join(root, "src/lib/newsletter.js");

  await mkdir(path.dirname(compiledNewsletter), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');

  const source = await readFile(path.join(projectRoot, "src/lib/newsletter.ts"), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
    fileName: path.join(projectRoot, "src/lib/newsletter.ts"),
  }).outputText;

  await writeFile(compiledNewsletter, output);

  const module = await import(`${pathToFileURL(compiledNewsletter).href}?${Date.now()}`);

  return {
    ...module,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test("newsletter helpers normalize and validate footer submissions", async () => {
  const { NEWSLETTER_SOURCE, normalizeNewsletterEmail, parseNewsletterSubscriptionPayload, cleanup } = await loadNewsletterModule();

  assert.equal(NEWSLETTER_SOURCE, "footer_newsletter");
  assert.equal(normalizeNewsletterEmail("  Person@Example.com "), "person@example.com");
  assert.deepEqual(
    parseNewsletterSubscriptionPayload({
      email: "  Person@Example.com ",
      locale: "en",
      source: "footer_newsletter",
      submittedAt: "2026-05-15T12:34:56.000Z",
    }),
    {
      ok: true,
      value: {
        email: "person@example.com",
        locale: "en",
        source: "footer_newsletter",
        submittedAt: "2026-05-15T12:34:56.000Z",
      },
    },
  );
  assert.equal(
    parseNewsletterSubscriptionPayload({
      email: "bad-email",
      locale: "en",
      source: "footer_newsletter",
      submittedAt: "2026-05-15T12:34:56.000Z",
    }).ok,
    false,
  );

  await cleanup();
});
