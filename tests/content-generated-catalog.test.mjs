import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import ts from "typescript";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function compileContentModule(sourcePath, outputPath) {
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

async function loadContentModule() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-content-"));
  const compiledContent = path.join(root, "src/lib/content.js");
  const generatedCatalogPath = path.join(root, "src/data/product-catalog.generated.json");

  await mkdir(path.join(root, "src/lib"), { recursive: true });
  await mkdir(path.join(root, "src/data"), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await writeFile(path.join(root, "src/lib/locales.js"), "export const locales = ['en', 'ja'];\n");
  await writeFile(generatedCatalogPath, await readFile(path.join(projectRoot, "src/data/product-catalog.generated.json"), "utf8"));
  await compileContentModule(path.join(projectRoot, "src/lib/content.ts"), compiledContent);

  const module = await import(`${pathToFileURL(compiledContent).href}?${Date.now()}`);

  return {
    ...module,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test("generated skus override fixture sample colors for the same product type", async () => {
  const { skus, cleanup } = await loadContentModule();

  const panelSkus = skus.filter((sku) => sku.materialSlug === "alcantara" && sku.productTypeSlug === "alcantara-panel");
  const coverSkus = skus.filter((sku) => sku.materialSlug === "alcantara" && sku.productTypeSlug === "alcantara-cover");

  assert.equal(panelSkus.some((sku) => sku.code === "1108"), true);
  assert.equal(coverSkus.some((sku) => sku.code === "1108"), true);
  assert.equal(panelSkus.some((sku) => sku.code === "C-ALC-4991"), false);
  assert.equal(coverSkus.some((sku) => sku.code === "C-ALC-4991"), false);

  await cleanup();
});
