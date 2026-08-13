import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
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

async function loadNetSuiteModule() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-netsuite-newsletter-"));
  const compiledNewsletter = path.join(root, "src/lib/newsletter.js");
  const compiledOAuth2 = path.join(root, "src/lib/netsuite-oauth2.js");
  const compiledNetSuite = path.join(root, "src/lib/netsuite-newsletter.js");

  await mkdir(path.dirname(compiledNewsletter), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');

  await compileModule(path.join(projectRoot, "src/lib/newsletter.ts"), compiledNewsletter);
  await compileModule(path.join(projectRoot, "src/lib/netsuite-oauth2.ts"), compiledOAuth2);
  await compileModule(path.join(projectRoot, "src/lib/netsuite-newsletter.ts"), compiledNetSuite);

  const module = await import(`${pathToFileURL(compiledNetSuite).href}?${Date.now()}`);

  return {
    ...module,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

function createPrivateKeyBase64() {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  return Buffer.from(
    privateKey.export({ type: "pkcs8", format: "pem" }),
  ).toString("base64");
}

test("NetSuite adapter signs and posts newsletter subscriptions to the configured RESTlet", async () => {
  const { sendNewsletterSubscriptionToNetSuite, cleanup } = await loadNetSuiteModule();
  const calls = [];
  const env = {
    NETSUITE_RESTLET_URL: "https://example.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=123&deploy=1",
    NETSUITE_ACCOUNT_ID: "1234567_SB1",
    NETSUITE_OAUTH2_CLIENT_ID: "client-id",
    NETSUITE_OAUTH2_CERTIFICATE_ID: "certificate-id",
    NETSUITE_OAUTH2_PRIVATE_KEY_BASE64: createPrivateKeyBase64(),
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
        if (url.includes("/services/rest/auth/oauth2/v1/token")) {
          return new Response(JSON.stringify({
            access_token: "short-lived-access-token",
            expires_in: 3600,
            token_type: "bearer",
          }), { status: 200 });
        }
        return new Response(JSON.stringify({ ok: true }), { status: 201 });
      },
      nowSeconds: 1715776496,
    },
  );

  assert.equal(result.ok, true);
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /1234567-sb1\.suitetalk\.api\.netsuite\.com/);
  assert.equal(calls[0].init.method, "POST");
  const tokenBody = new URLSearchParams(calls[0].init.body);
  assert.equal(tokenBody.get("grant_type"), "client_credentials");
  const assertion = tokenBody.get("client_assertion");
  assert.ok(assertion);
  const [encodedHeader, encodedPayload] = assertion.split(".");
  assert.deepEqual(JSON.parse(Buffer.from(encodedHeader, "base64url").toString()), {
    typ: "JWT",
    alg: "PS256",
    kid: "certificate-id",
  });
  assert.equal(JSON.parse(Buffer.from(encodedPayload, "base64url").toString()).scope, "restlets");
  assert.equal(calls[1].url, env.NETSUITE_RESTLET_URL);
  assert.equal(calls[1].init.headers.Authorization, "Bearer short-lived-access-token");
  assert.deepEqual(JSON.parse(calls[1].init.body), {
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
    NETSUITE_OAUTH2_CLIENT_ID: "failure-client-id",
    NETSUITE_OAUTH2_CERTIFICATE_ID: "failure-certificate-id",
    NETSUITE_OAUTH2_PRIVATE_KEY_BASE64: createPrivateKeyBase64(),
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
      fetchImpl: async (url) => {
        if (url.includes("/services/rest/auth/oauth2/v1/token")) {
          return new Response(JSON.stringify({
            access_token: "failure-test-access-token",
            expires_in: 3600,
            token_type: "bearer",
          }), { status: 200 });
        }
        return new Response("service unavailable", { status: 503 });
      },
      nowSeconds: 1715776496,
    },
  );

  assert.deepEqual(result, {
    ok: false,
    status: 503,
    detail: "service unavailable",
  });
  assert.equal(JSON.stringify(result).includes("failure-test-access-token"), false);

  await cleanup();
});
