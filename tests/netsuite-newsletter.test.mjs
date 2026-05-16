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

async function loadNetSuiteModule() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-netsuite-newsletter-"));
  const compiledNewsletter = path.join(root, "src/lib/newsletter.js");
  const compiledNetSuite = path.join(root, "src/lib/netsuite-newsletter.js");

  await mkdir(path.dirname(compiledNewsletter), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');

  await compileModule(path.join(projectRoot, "src/lib/newsletter.ts"), compiledNewsletter);
  await compileModule(path.join(projectRoot, "src/lib/netsuite-newsletter.ts"), compiledNetSuite);

  const module = await import(`${pathToFileURL(compiledNetSuite).href}?${Date.now()}`);

  return {
    ...module,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test("NetSuite adapter signs and posts newsletter subscriptions to the configured RESTlet", async () => {
  const { sendNewsletterSubscriptionToNetSuite, cleanup } = await loadNetSuiteModule();
  const calls = [];
  const env = {
    NETSUITE_RESTLET_URL: "https://example.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=123&deploy=1",
    NETSUITE_ACCOUNT_ID: "1234567_SB1",
    NETSUITE_CONSUMER_KEY: "consumer-key",
    NETSUITE_CONSUMER_SECRET: "consumer-secret",
    NETSUITE_TOKEN_ID: "token-id",
    NETSUITE_TOKEN_SECRET: "token-secret",
    NETSUITE_REALM: "1234567_SB1",
  };

  const result = await sendNewsletterSubscriptionToNetSuite(
    {
      email: "person@example.com",
      locale: "en",
      source: "footer_newsletter",
      submittedAt: "2026-05-15T12:34:56.000Z",
    },
    {
      env,
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        return new Response(JSON.stringify({ ok: true }), { status: 201 });
      },
      nonce: "fixed-nonce",
      timestamp: "1715776496",
    },
  );

  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, env.NETSUITE_RESTLET_URL);
  assert.equal(calls[0].init.method, "POST");
  assert.match(calls[0].init.headers.Authorization, /^OAuth realm=/);
  assert.match(calls[0].init.headers.Authorization, /oauth_consumer_key=/);
  assert.match(calls[0].init.headers.Authorization, /oauth_signature=/);
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    email: "person@example.com",
    locale: "en",
    source: "footer_newsletter",
    submittedAt: "2026-05-15T12:34:56.000Z",
  });

  await cleanup();
});

test("NetSuite adapter reports upstream failures without exposing secrets", async () => {
  const { sendNewsletterSubscriptionToNetSuite, cleanup } = await loadNetSuiteModule();
  const env = {
    NETSUITE_RESTLET_URL: "https://example.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=123&deploy=1",
    NETSUITE_ACCOUNT_ID: "1234567_SB1",
    NETSUITE_CONSUMER_KEY: "consumer-key",
    NETSUITE_CONSUMER_SECRET: "consumer-secret",
    NETSUITE_TOKEN_ID: "token-id",
    NETSUITE_TOKEN_SECRET: "token-secret",
  };

  const result = await sendNewsletterSubscriptionToNetSuite(
    {
      email: "person@example.com",
      locale: "ja",
      source: "footer_newsletter",
      submittedAt: "2026-05-15T12:34:56.000Z",
    },
    {
      env,
      fetchImpl: async () => new Response("service unavailable", { status: 503 }),
      nonce: "fixed-nonce",
      timestamp: "1715776496",
    },
  );

  assert.deepEqual(result, {
    ok: false,
    status: 503,
    detail: "service unavailable",
  });
  assert.equal(JSON.stringify(result).includes("consumer-secret"), false);

  await cleanup();
});
