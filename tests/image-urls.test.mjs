import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import ts from "typescript";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function loadImageUrlsModule() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-image-urls-"));
  const sourcePath = path.join(projectRoot, "src/lib/image-urls.ts");
  const outputPath = path.join(root, "image-urls.js");
  const source = await readFile(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
    fileName: sourcePath,
  }).outputText;

  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await writeFile(outputPath, output);

  const module = await import(`${pathToFileURL(outputPath).href}?${Date.now()}`);

  return {
    ...module,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test("Sanity SKU swatch thumbnails use small direct image variants", async () => {
  const { toSanityThumbnailUrl, cleanup } = await loadImageUrlsModule();

  const thumbnail = toSanityThumbnailUrl("https://cdn.sanity.io/images/bfjhbpbx/production/example-800x800.jpg", 96);

  assert.equal(
    thumbnail,
    "https://cdn.sanity.io/images/bfjhbpbx/production/example-800x800.jpg?w=96&h=96&fit=crop&auto=format&q=70"
  );

  await cleanup();
});

test("non-Sanity SKU swatch thumbnails keep their existing URL", async () => {
  const { toSanityThumbnailUrl, cleanup } = await loadImageUrlsModule();

  assert.equal(toSanityThumbnailUrl("/uploads/alcantara/panel/1041.jpg", 96), "/uploads/alcantara/panel/1041.jpg");

  await cleanup();
});
