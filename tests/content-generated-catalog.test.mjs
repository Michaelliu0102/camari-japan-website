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
  let output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
    fileName: sourcePath,
  }).outputText;

  output = output.replaceAll('from "./site-config";', 'from "./site-config.js";');

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
  await writeFile(
    path.join(root, "src/lib/site-config.js"),
    `export const siteConfig = {
  siteName: "CAMARI INTERNATIONAL",
  siteUrl: "https://www.camari-international.com",
  organizationName: "CAMARI INTERNATIONAL",
  alternateSiteHomeUrl: "https://www.camari-international.co.jp",
  defaultLocale: "en",
  slogan: { en: "Texture and Precision", ja: "質感と精密さの交差点" },
  description: { en: "Description", ja: "説明" },
  contact: {
    email: "info@example.com",
    phone: "+81 00 0000 0000",
    address: { en: "Tokyo", ja: "東京" },
  },
};
`
  );
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
