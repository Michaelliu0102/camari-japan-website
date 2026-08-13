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

async function loadNetSuiteInquiryModule() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-netsuite-inquiry-"));
  const compiledInquiry = path.join(root, "src/lib/netsuite-inquiry.js");
  const compiledNewsletter = path.join(root, "src/lib/netsuite-newsletter.js");
  const compiledOAuth2 = path.join(root, "src/lib/netsuite-oauth2.js");

  await mkdir(path.dirname(compiledInquiry), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await compileModule(path.join(projectRoot, "src/lib/netsuite-oauth2.ts"), compiledOAuth2);
  await compileModule(path.join(projectRoot, "src/lib/netsuite-newsletter.ts"), compiledNewsletter);
  await compileModule(path.join(projectRoot, "src/lib/netsuite-inquiry.ts"), compiledInquiry);

  const module = await import(`${pathToFileURL(compiledInquiry).href}?${Date.now()}`);
  return { ...module, cleanup: () => rm(root, { recursive: true, force: true }) };
}

function createPrivateKeyBase64() {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  return Buffer.from(
    privateKey.export({ type: "pkcs8", format: "pem" }),
  ).toString("base64");
}

test("NetSuite inquiry adapter signs and forwards country classification", async () => {
  const { sendContactInquiryToNetSuite, cleanup } = await loadNetSuiteInquiryModule();
  const calls = [];
  const env = {
    NETSUITE_INQUIRY_RESTLET_URL: "https://example.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=456&deploy=1",
    NETSUITE_ACCOUNT_ID: "1234567_SB1",
    NETSUITE_OAUTH2_CLIENT_ID: "inquiry-client-id",
    NETSUITE_OAUTH2_CERTIFICATE_ID: "inquiry-certificate-id",
    NETSUITE_OAUTH2_PRIVATE_KEY_BASE64: createPrivateKeyBase64(),
  };
  const inquiry = {
    locale: "en",
    name: "Alex Chen",
    email: "alex@example.com",
    phone: "+1 555 0100",
    company: "Example Studio",
    countryCode: "US",
    countryRegion: "United States",
    message: "Hospitality material inquiry",
    interests: ["Material"],
    submissionId: "00000000-0000-4000-8000-000000000001",
    submittedAt: "2026-08-11T12:00:00.000Z",
  };

  const result = await sendContactInquiryToNetSuite(inquiry, {
    env,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      if (url.includes("/services/rest/auth/oauth2/v1/token")) {
        return new Response(JSON.stringify({
          access_token: "inquiry-access-token",
          expires_in: 3600,
          token_type: "bearer",
        }), { status: 200 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 201 });
    },
    nowSeconds: 1786449600,
  });

  assert.equal(result.ok, true);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].init.headers.Authorization, "Bearer inquiry-access-token");
  assert.deepEqual(JSON.parse(calls[1].init.body), inquiry);

  await cleanup();
});
