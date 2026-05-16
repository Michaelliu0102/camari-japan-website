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
  }).outputText;

  await writeFile(outputPath, output);
}

async function loadRouteModule() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-newsletter-route-"));
  const compiledRoute = path.join(root, "src/app/api/newsletter/subscribe/route.js");
  const compiledNewsletter = path.join(root, "src/lib/newsletter.js");
  const compiledAdapter = path.join(root, "src/lib/netsuite-newsletter.js");

  await mkdir(path.dirname(compiledRoute), { recursive: true });
  await mkdir(path.dirname(compiledNewsletter), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');

  await compileModule(path.join(projectRoot, "src/app/api/newsletter/subscribe/route.ts"), compiledRoute);
  await compileModule(path.join(projectRoot, "src/lib/newsletter.ts"), compiledNewsletter);
  await compileModule(path.join(projectRoot, "src/lib/netsuite-newsletter.ts"), compiledAdapter);

  const module = await import(`${pathToFileURL(compiledRoute).href}?${Date.now()}`);

  return {
    ...module,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test("newsletter route accepts valid payloads and forwards normalized submissions", async () => {
  const { createNewsletterSubscribeHandler, cleanup } = await loadRouteModule();
  const calls = [];
  const handler = createNewsletterSubscribeHandler(async (submission) => {
    calls.push(submission);
    return { ok: true, upstreamStatus: 201 };
  });

  const response = await handler(
    new Request("http://localhost/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "  Person@Example.com ",
        locale: "en",
        source: "footer_newsletter",
        submittedAt: "2026-05-15T12:34:56.000Z",
      }),
    }),
  );

  assert.equal(response.status, 201);
  assert.deepEqual(calls, [
    {
      email: "person@example.com",
      locale: "en",
      source: "footer_newsletter",
      submittedAt: "2026-05-15T12:34:56.000Z",
    },
  ]);

  await cleanup();
});

test("newsletter route rejects malformed payloads with 400", async () => {
  const { createNewsletterSubscribeHandler, cleanup } = await loadRouteModule();
  const handler = createNewsletterSubscribeHandler(async () => ({ ok: true, upstreamStatus: 201 }));

  const response = await handler(
    new Request("http://localhost/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "not-an-email",
        locale: "en",
        source: "footer_newsletter",
        submittedAt: "2026-05-15T12:34:56.000Z",
      }),
    }),
  );

  assert.equal(response.status, 400);

  await cleanup();
});

test("newsletter route returns 502 for upstream NetSuite delivery failures", async () => {
  const { createNewsletterSubscribeHandler, cleanup } = await loadRouteModule();
  const handler = createNewsletterSubscribeHandler(async () => ({
    ok: false,
    status: 503,
    detail: "upstream unavailable",
  }));

  const response = await handler(
    new Request("http://localhost/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "person@example.com",
        locale: "ja",
        source: "footer_newsletter",
        submittedAt: "2026-05-15T12:34:56.000Z",
      }),
    }),
  );

  const payload = await response.json();

  assert.equal(response.status, 502);
  assert.equal(payload.error, "Subscription service unavailable.");
  assert.equal(JSON.stringify(payload).includes("consumer"), false);

  await cleanup();
});
