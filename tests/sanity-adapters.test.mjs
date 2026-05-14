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
  let output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
    fileName: sourcePath,
  }).outputText;

  output = output.replaceAll('from "../../lib/content";', 'from "../../lib/content.js";');

  await writeFile(outputPath, output);
}

async function loadAdapters() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-sanity-adapters-"));
  const compiledContent = path.join(root, "src/lib/content.js");
  const compiledAdapters = path.join(root, "src/sanity/lib/adapters.js");
  const generatedCatalogPath = path.join(root, "src/data/product-catalog.generated.json");

  await mkdir(path.join(root, "src/lib"), { recursive: true });
  await mkdir(path.join(root, "src/sanity/lib"), { recursive: true });
  await mkdir(path.join(root, "src/data"), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await writeFile(path.join(root, "src/lib/locales.js"), "export const locales = ['en', 'ja'];\n");
  await writeFile(generatedCatalogPath, '{ "productTypes": [], "skus": [] }\n');
  await compileModule(path.join(projectRoot, "src/lib/content.ts"), compiledContent);
  await compileModule(path.join(projectRoot, "src/sanity/lib/adapters.ts"), compiledAdapters);

  const module = await import(`${pathToFileURL(compiledAdapters).href}?${Date.now()}`);

  return {
    ...module,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test("adapts material reference fields and fixture-backed quote defaults", async () => {
  const { adaptMaterial, cleanup } = await loadAdapters();
  const material = adaptMaterial({
    name: { en: "Alcantara", ja: "アルカンターラ" },
    slug: "alcantara",
    categorySlug: "alcantara",
    categoryName: { en: "Alcantara", ja: "アルカンターラ" },
    heroImageUrl: "https://cdn.sanity.io/images/project/dataset/material.jpg",
    heroSubtitle: { en: "The sensory revolution", ja: "触感の革新" },
    introTitle: { en: "Intro", ja: "イントロ" },
    introBody: { en: "Body", ja: "本文" },
    introImageUrl: "https://cdn.sanity.io/images/project/dataset/intro.jpg",
    applications: [
      {
        name: { en: "Automotive Cabin", ja: "自動車" },
        colorCount: 12,
        imageUrl: "https://cdn.sanity.io/images/project/dataset/application.jpg",
      },
    ],
    seo: {
      title: { en: "SEO", ja: "SEO" },
      description: { en: "Description", ja: "説明" },
      imageUrl: "https://cdn.sanity.io/images/project/dataset/seo.jpg",
    },
  });

  assert.equal(material.categorySlug, "alcantara");
  assert.deepEqual(material.heroTitle, material.name);
  assert.deepEqual(material.eyebrow, { en: "Alcantara", ja: "アルカンターラ" });
  assert.deepEqual(material.quote, {
    en: "Alcantara transforms the experience of touch into an architectural statement.",
    ja: "Alcantara は触れる体験を、空間の意思へと変える。",
  });
  assert.equal(material.applications[0].slug, "automotive-cabin");
  assert.equal(material.applications[0].image, "https://cdn.sanity.io/images/project/dataset/application.jpg");

  await cleanup();
});

test("uses explicit material and category defaults when fixture records do not exist", async () => {
  const { adaptMaterial, adaptMaterialCategory, cleanup } = await loadAdapters();

  assert.deepEqual(
    adaptMaterial({
      name: { en: "New Material", ja: "新素材" },
      slug: "new-material",
      categorySlug: null,
      categoryName: null,
      heroImageUrl: null,
      heroSubtitle: null,
      introTitle: null,
      introBody: null,
      introImageUrl: null,
      applications: null,
      seo: null,
    }).quote,
    { en: "", ja: "" },
  );

  assert.equal(
    adaptMaterialCategory({
      name: { en: "New Category", ja: "新カテゴリ" },
      slug: "new-category",
      tagline: { en: "Tagline", ja: "タグライン" },
      description: { en: "Description", ja: "説明" },
      coverImageUrl: "https://cdn.sanity.io/images/project/dataset/category.jpg",
    }).accent,
    "#1A1A1A",
  );

  await cleanup();
});

test("adapts product type, SKU, project, catalog, and news naming differences", async () => {
  const { adaptProductType, adaptSku, adaptProjectCase, adaptCatalog, adaptNewsItem, cleanup } = await loadAdapters();

  const productType = adaptProductType({
    name: { en: "Alcantara Panel", ja: "Alcantara パネル" },
    slug: "alcantara-panel",
    materialSlug: "alcantara",
    specTemplate: [
      {
        key: "width",
        label: { en: "WIDTH", ja: "幅" },
        aliases: ["width"],
        defaultValue: { en: "142 cm", ja: "142 cm" },
      },
    ],
    certifications: [{ en: "Carbon neutral production program", ja: "カーボンニュートラル生産プログラム" }],
    maintenance: [{ title: { en: "Care Guide", ja: "ケアガイド" }, description: { en: "Vacuum lightly.", ja: "軽く掃除機をかけてください。" } }],
    seo: null,
  });

  assert.equal(productType.slug, "alcantara-panel");
  assert.equal(productType.specTemplate[0].key, "width");
  assert.equal(productType.maintenance[0].title.en, "Care Guide");

  const sku = adaptSku({
    code: "C-ALC-4991",
    slug: "c-alc-4991-shadow-black",
    materialSlug: "alcantara",
    productTypeSlug: "alcantara-panel",
    colorName: { en: "Shadow Black", ja: "シャドウブラック" },
    hex: "#1A1A1A",
    heroImageUrl: "https://cdn.sanity.io/images/project/dataset/sku.jpg",
    caseGallery: [
      {
        imageUrl: "https://cdn.sanity.io/images/project/dataset/case.jpg",
        alt: { en: "Installed case", ja: "施工事例" },
      },
      {
        imageUrl: null,
        alt: { en: "Missing image", ja: "画像なし" },
      },
    ],
    summary: { en: "Summary", ja: "要約" },
    specs: [],
    certifications: [],
    downloads: [],
    seo: null,
  });

  assert.equal(sku.image, "https://cdn.sanity.io/images/project/dataset/sku.jpg");
  assert.equal(sku.swatchImage, undefined);
  assert.equal(sku.productTypeSlug, "alcantara-panel");
  assert.deepEqual(sku.caseGallery, [
    {
      image: "https://cdn.sanity.io/images/project/dataset/case.jpg",
      alt: { en: "Installed case", ja: "施工事例" },
    },
  ]);

  const project = adaptProjectCase({
    title: { en: "Project", ja: "プロジェクト" },
    slug: "project",
    industry: { en: "Interior", ja: "インテリア" },
    imageUrl: "https://cdn.sanity.io/images/project/dataset/project.jpg",
    summary: { en: "Summary", ja: "要約" },
    materialSlug: "alcantara",
    seo: null,
  });

  assert.equal(project.image, "https://cdn.sanity.io/images/project/dataset/project.jpg");
  assert.equal(project.materialSlug, "alcantara");

  const catalog = adaptCatalog({
    title: { en: "Catalog", ja: "カタログ" },
    description: { en: "Description", ja: "説明" },
    href: "https://cdn.sanity.io/files/project/dataset/catalog.pdf",
  });

  assert.equal(catalog.type, "catalog");
  assert.equal(catalog.href, "https://cdn.sanity.io/files/project/dataset/catalog.pdf");

  const news = adaptNewsItem({
    title: { en: "News", ja: "ニュース" },
    slug: "news",
    category: { en: "Material", ja: "素材" },
    publishedAt: "2026-05-12T03:04:05.000Z",
    imageUrl: "https://cdn.sanity.io/images/project/dataset/news.jpg",
    summary: { en: "Summary", ja: "要約" },
    body: [{ _type: "block" }],
    seo: null,
  });

  assert.equal(news.date, "2026-05-12");
  assert.equal("body" in news, false);

  await cleanup();
});

test("adapts homepage settings for CMS-managed hero and carousel images", async () => {
  const { adaptHomePageSettings, cleanup } = await loadAdapters();

  const settings = adaptHomePageSettings({
    heroTitle: { en: "Custom Hero", ja: "カスタムヒーロー" },
    heroSubtitle: { en: "Hero subtitle", ja: "ヒーローサブタイトル" },
    heroVideoPlaybackId: "mux-playback-id",
    heroVideoUrl: null,
    heroPosterUrl: "https://cdn.sanity.io/images/project/dataset/poster.jpg",
    heroCtaLabel: { en: "Explore Materials", ja: "素材を見る" },
    heroCtaHref: "/materials",
    exploreCategorySlugs: ["fabric", "alcantara"],
    exploreProductSlides: [
      {
        slug: "custom-product",
        title: { en: "Custom Product", ja: "カスタムプロダクト" },
        category: { en: "Product", ja: "プロダクト" },
        description: { en: "Product description", ja: "プロダクト説明" },
        imageUrl: "https://cdn.sanity.io/images/project/dataset/product.jpg",
        href: "/oem-odm",
      },
    ],
  });

  assert.equal(settings.hero.videoSrc, "https://stream.mux.com/mux-playback-id.m3u8");
  assert.equal(settings.hero.poster, "https://cdn.sanity.io/images/project/dataset/poster.jpg");
  assert.deepEqual(settings.explore.categorySlugs, ["fabric", "alcantara"]);
  assert.equal(settings.explore.productSlides[0].image, "https://cdn.sanity.io/images/project/dataset/product.jpg");

  await cleanup();
});
