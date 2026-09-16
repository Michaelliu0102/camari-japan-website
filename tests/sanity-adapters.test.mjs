import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
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
  output = output.replaceAll('from "../../lib/skai-collections";', 'from "../../lib/skai-collections.js";');
  output = output.replaceAll('from "../../content/products/categories";', 'from "../../content/products/categories.js";');
  output = output.replaceAll('from "@/data/product-category-carousel-overrides.json";', 'from "../../data/product-category-carousel-overrides.json";');
  output = output.replaceAll(
    'from "../../data/product-category-carousel-overrides.json";',
    'from "../../data/product-category-carousel-overrides.json" with { type: "json" };',
  );
  output = output.replaceAll('from "./site-config";', 'from "./site-config.js";');
  output = output.replaceAll('from "../content/home-page-copy";', 'from "../content/home-page-copy.js";');
  output = output.replaceAll('from "../lib/site-config";', 'from "../lib/site-config.js";');

  await writeFile(outputPath, output);
}

async function loadAdapters() {
  const root = await mkdtemp(path.join(tmpdir(), "camari-sanity-adapters-"));
  const compiledContent = path.join(root, "src/lib/content.js");
  const compiledProductCategories = path.join(root, "src/content/products/categories.js");
  const compiledAdapters = path.join(root, "src/sanity/lib/adapters.js");
  const generatedCatalogPath = path.join(root, "src/data/product-catalog.generated.json");
  const carouselOverridesPath = path.join(root, "src/data/product-category-carousel-overrides.json");

  await mkdir(path.join(root, "src/lib"), { recursive: true });
  await mkdir(path.join(root, "src/content/products"), { recursive: true });
  await mkdir(path.join(root, "src/sanity/lib"), { recursive: true });
  await mkdir(path.join(root, "src/data"), { recursive: true });
  await symlink(path.join(projectRoot, "node_modules"), path.join(root, "node_modules"), "dir");
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await writeFile(path.join(root, "src/lib/locales.js"), "export const locales = ['en', 'ja'];\n");
  await writeFile(
    path.join(root, "src/lib/site-config.js"),
    `export const siteConfig = {
  siteName: "CAMARI INTERNATIONAL JAPAN",
  siteUrl: "https://example.com",
  organizationName: "CAMARI INTERNATIONAL JAPAN",
  alternateSiteHomeUrl: "https://example.com",
  defaultLocale: "en",
  enableLocalePreview: true,
  slogan: { en: "Texture and Precision", ja: "質感と精密さの交差点" },
  description: { en: "Description", ja: "説明" },
  contact: {
    email: "info@example.com",
    phone: "+81 00 0000 0000",
    address: { en: "Tokyo", ja: "東京" },
  },
};
`,
  );
  await writeFile(generatedCatalogPath, '{ "productTypes": [], "skus": [] }\n');
  await writeFile(
    carouselOverridesPath,
    await readFile(path.join(projectRoot, "src/data/product-category-carousel-overrides.json"), "utf8"),
  );
  await writeFile(path.join(root, "src/data/about-page-ja.json"), await readFile(path.join(projectRoot, "src/data/about-page-ja.json"), "utf8"));
  await mkdir(path.join(root, "src/content"), { recursive: true });
  await compileModule(path.join(projectRoot, "src/content/home-page-copy.ts"), path.join(root, "src/content/home-page-copy.js"));
  await compileModule(path.join(projectRoot, "src/lib/content.ts"), compiledContent);
  await compileModule(path.join(projectRoot, "src/lib/skai-collections.ts"), path.join(root, "src/lib/skai-collections.js"));
  await compileModule(path.join(projectRoot, "src/content/products/categories.ts"), compiledProductCategories);
  await compileModule(path.join(projectRoot, "src/sanity/lib/adapters.ts"), compiledAdapters);

  const adapterModule = await import(`${pathToFileURL(compiledAdapters).href}?${Date.now()}`);

  return {
    ...adapterModule,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test("About copy follows CMS edits and preserves deliberately empty sections", async () => {
  const { adaptAboutPageSettings, cleanup } = await loadAdapters();
  try {
    const about = adaptAboutPageSettings({
      bodyTitle: { en: "Existing English", ja: "CMSで編集した見出し" },
      bodySubtitle: { en: "", ja: "新しいサブタイトル" },
      bodyParagraphs: [{ en: "English only", ja: "" }, { en: "", ja: "CAMARIの編集済み本文" }],
      missionTitle: { en: "", ja: "新しいミッション\n二行目" },
      missionParagraphs: [],
      businessItems: [{ title: { en: "", ja: "MATERIAL" }, body: { en: "", ja: "編集済みの事業紹介" } }],
      manufacturingParagraphs: []
    });
    assert.equal(about.bodyTitle.en, "Existing English");
    assert.equal(about.bodyTitle.ja, "CMSで編集した見出し");
    assert.equal(about.bodySubtitle.ja, "新しいサブタイトル");
    assert.equal(about.bodyParagraphs[1].ja, "CAMARIの編集済み本文");
    assert.equal(about.missionTitle.ja, "新しいミッション\n二行目");
    assert.deepEqual(about.missionParagraphs, []);
    assert.equal(about.businessItems[0].body.ja, "編集済みの事業紹介");
    assert.deepEqual(about.manufacturingParagraphs, []);
    const fallback = adaptAboutPageSettings(null);
    assert.equal(fallback.bodyTitle.ja, "FROM MATERIAL TO MORE.");
    assert.equal(fallback.missionParagraphs.length, 5);
    assert.equal(fallback.businessItems.length, 3);
    assert.equal(fallback.manufacturingParagraphs.length, 3);
  } finally {
    await cleanup();
  }
});

test("adapts material reference fields and fixture-backed quote defaults", async () => {
  const { adaptMaterial, cleanup } = await loadAdapters();
  const material = adaptMaterial({
    updatedAt: "2026-07-27T02:30:00Z",
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
  assert.equal(material.updatedAt, "2026-07-27T02:30:00Z");
  assert.deepEqual(material.heroTitle, material.name);
  assert.deepEqual(material.eyebrow, { en: "Alcantara", ja: "アルカンターラ" });
  assert.deepEqual(material.quote, {
    en: "Alcantara turns technical performance into a sensory language for contemporary design.",
    ja: "",
  });
  assert.equal(material.applications[0].slug, "automotive-cabin");
  assert.equal(material.applications[0].image, "https://cdn.sanity.io/images/project/dataset/application.jpg");

  await cleanup();
});

test("uses the local leather hero image override", async () => {
  const { adaptMaterial, cleanup } = await loadAdapters();
  const material = adaptMaterial({
    name: { en: "Leather", ja: "レザー" },
    slug: "leather",
    categorySlug: "leather",
    categoryName: { en: "Leather", ja: "レザー" },
    heroImageUrl: "https://cdn.sanity.io/images/project/dataset/old-leather.jpg",
    heroSubtitle: { en: "Natural grain", ja: "自然な銀面" },
    introTitle: { en: "Intro", ja: "イントロ" },
    introBody: { en: "Body", ja: "本文" },
    introImageUrl: "https://cdn.sanity.io/images/project/dataset/intro.jpg",
    applications: [],
    seo: null,
  });

  assert.equal(material.heroImage, "/uploads/hero/leather-hero.png");

  await cleanup();
});

test("adapts about page singleton content with local defaults", async () => {
  const { adaptAboutPageSettings, cleanup } = await loadAdapters();

  const about = adaptAboutPageSettings({
    seoTitle: { en: "About | Custom", ja: "会社情報 | Custom" },
    seoDescription: { en: "Custom about description.", ja: "カスタム説明。" },
    heroImageUrl: "https://cdn.sanity.io/images/project/dataset/about.jpg",
    heroAlt: { en: "Custom showroom", ja: "ショールーム" },
    heroTitle: { en: "CAMARI", ja: "CAMARI" },
    exploreLabel: { en: "Explore", ja: "Explore" },
    bodyLabel: { en: "Company", ja: "Company" },
    bodyTitle: { en: "ABOUT CAMARI", ja: "ABOUT CAMARI" },
    bodyParagraphs: [
      { en: "First paragraph.", ja: "最初の段落。" },
      { en: "", ja: "" },
      null,
    ],
    manufacturingLabel: { en: "Manufacturing", ja: "Manufacturing" },
    manufacturingTitle: { en: "OUR FACTORY", ja: "OUR FACTORY" },
    manufacturingParagraphs: [{ en: "SHENGHUA is factory from 2000.", ja: "SHENGHUA is factory from 2000." }],
  });

  assert.equal(about.heroImage, "https://cdn.sanity.io/images/project/dataset/about.jpg");
  assert.deepEqual(about.heroTitle, { en: "CAMARI", ja: "CAMARI" });
  assert.deepEqual(about.bodyParagraphs, [{ en: "First paragraph.", ja: "最初の段落。" }]);
  assert.deepEqual(about.manufacturingLabel, { en: "Manufacturing", ja: "Manufacturing" });
  assert.deepEqual(about.manufacturingTitle, { en: "OUR FACTORY", ja: "OUR FACTORY" });
  assert.deepEqual(about.manufacturingParagraphs, [{ en: "SHENGHUA is factory from 2000.", ja: "SHENGHUA is factory from 2000." }]);
  assert.equal(about.seo.image, "https://cdn.sanity.io/images/project/dataset/about.jpg");

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
    previewImageUrl: "https://cdn.sanity.io/images/project/dataset/sku-preview.jpg",
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
  assert.equal(sku.swatchImage, "https://cdn.sanity.io/images/project/dataset/sku-preview.jpg");
  assert.equal(sku.previewImage, "https://cdn.sanity.io/images/project/dataset/sku-preview.jpg");
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
    galleryImageUrls: [
      "https://cdn.sanity.io/images/project/dataset/gallery-1.jpg",
      null,
      "https://cdn.sanity.io/images/project/dataset/gallery-2.jpg",
    ],
    summary: { en: "Summary", ja: "要約" },
    materialSlug: "alcantara",
    seo: null,
  });

  assert.equal(project.image, "https://cdn.sanity.io/images/project/dataset/project.jpg");
  assert.deepEqual(project.projectImages, [
    "https://cdn.sanity.io/images/project/dataset/project.jpg",
    "https://cdn.sanity.io/images/project/dataset/gallery-1.jpg",
    "https://cdn.sanity.io/images/project/dataset/gallery-2.jpg",
  ]);
  assert.equal(project.materialSlug, "alcantara");

  const projectWithDuplicateCover = adaptProjectCase({
    title: { en: "Duplicate Project", ja: "重複プロジェクト" },
    slug: "duplicate-project",
    industry: { en: "Automotive", ja: "自動車" },
    image: {
      asset: { _ref: "image-abc123-1200x1600-jpg" },
    },
    imageUrl: "https://cdn.sanity.io/images/project/dataset/abc123-1200x1600.jpg",
    galleryImages: [
      {
        asset: { _ref: "image-abc123-1200x1600-jpg" },
      },
      {
        asset: { _ref: "image-def456-1600x1200-jpg" },
      },
    ],
    summary: { en: "Summary", ja: "要約" },
    materialSlug: "alcantara",
    seo: null,
  });

  assert.equal(projectWithDuplicateCover.projectImages.length, 2);
  assert.match(projectWithDuplicateCover.projectImages[0], /abc123-1200x1600/);
  assert.match(projectWithDuplicateCover.projectImages[1], /def456-1600x1200/);

  const projectWithDuplicateUrl = adaptProjectCase({
    title: { en: "Duplicate URL Project", ja: "重複URLプロジェクト" },
    slug: "duplicate-url-project",
    industry: { en: "Automotive", ja: "自動車" },
    imageUrl: "https://cdn.sanity.io/images/project/dataset/cover.jpg?w=1600&q=84",
    galleryImageUrls: [
      "https://cdn.sanity.io/images/project/dataset/cover.jpg?w=920&h=1240&fit=crop",
      "https://cdn.sanity.io/images/project/dataset/detail.jpg",
    ],
    summary: { en: "Summary", ja: "要約" },
    materialSlug: "alcantara",
    seo: null,
  });

  assert.deepEqual(projectWithDuplicateUrl.projectImages, [
    "https://cdn.sanity.io/images/project/dataset/cover.jpg?w=1600&q=84",
    "https://cdn.sanity.io/images/project/dataset/detail.jpg",
  ]);

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

test("preserves missing SKU hex values instead of defaulting swatches to black", async () => {
  const { adaptSku, cleanup } = await loadAdapters();

  const sku = adaptSku({
    code: "1041",
    slug: "alc-p-1041",
    materialSlug: "alcantara",
    productTypeSlug: "alcantara-panel",
    colorName: { en: "", ja: "" },
    hex: "",
    heroImageUrl: "https://cdn.sanity.io/images/project/dataset/1041.jpg",
    previewImageUrl: null,
    caseGallery: [],
    summary: { en: "Summary", ja: "要約" },
    specs: [],
    certifications: [],
    downloads: [],
    seo: null,
  });

  assert.equal(sku.hex, undefined);
  assert.equal(sku.swatchImage, undefined);

  await cleanup();
});

test("uses Sanity crop and hotspot data for project cover display URLs", async () => {
  const originalProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const originalDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "project";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "dataset";

  const { adaptProjectCase, cleanup } = await loadAdapters();

  try {
    const project = adaptProjectCase({
      title: { en: "Project", ja: "プロジェクト" },
      slug: "project",
      industry: { en: "Interior", ja: "インテリア" },
      image: {
        asset: { _ref: "image-abc123-1200x1600-jpg" },
        crop: { left: 0.1, top: 0.05, right: 0.1, bottom: 0.05 },
        hotspot: { x: 0.5, y: 0.55, width: 0.6, height: 0.5 },
      },
      imageUrl: "https://cdn.sanity.io/images/project/dataset/project.jpg",
      galleryImages: [
        {
          asset: { _ref: "image-def456-1600x1200-jpg" },
          crop: { left: 0, top: 0, right: 0, bottom: 0 },
          hotspot: { x: 0.5, y: 0.5, width: 1, height: 1 },
        },
      ],
      summary: { en: "Summary", ja: "要約" },
      materialSlug: "alcantara",
      seo: null,
    });

    assert.match(project.image, /^https:\/\/cdn\.sanity\.io\/images\/project\/dataset\/abc123-1200x1600\.jpg\?/);
    assert.match(project.image, /rect=/);
    assert.match(project.image, /w=1600/);
    assert.match(project.projectImages[0], /w=920/);
    assert.match(project.projectImages[0], /h=1240/);
    assert.match(project.projectImages[0], /fit=crop/);
    assert.match(project.projectImages[1], /^https:\/\/cdn\.sanity\.io\/images\/project\/dataset\/def456-1600x1200\.jpg\?/);
    assert.match(project.projectImages[1], /w=920/);
    assert.match(project.projectImages[1], /h=1240/);
  } finally {
    if (originalProjectId === undefined) {
      delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    } else {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = originalProjectId;
    }

    if (originalDataset === undefined) {
      delete process.env.NEXT_PUBLIC_SANITY_DATASET;
    } else {
      process.env.NEXT_PUBLIC_SANITY_DATASET = originalDataset;
    }

    await cleanup();
  }
});

test("loader exposes material-scoped project cases", async () => {
  const loaders = await readFile(path.join(projectRoot, "src/sanity/lib/loaders.ts"), "utf8");

  assert.match(loaders, /export async function loadProjectsForMaterial\(materialSlug: string\): Promise<ProjectCase\[\]>/);
  assert.match(loaders, /project\.materialSlug === materialSlug/);
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

test("Japanese CMS edits take precedence over localized homepage, material and category fallbacks", async () => {
  const { adaptHomePageSettings, adaptMaterial, adaptProductCategory, cleanup } = await loadAdapters();
  try {
    const home = adaptHomePageSettings({ exploreProductSlides: [{
      slug: "projects", title: { en: "Product", ja: "製品" },
      description: { en: "Original English", ja: "バックエンドで更新した紹介文" },
      imageUrl: "/test.jpg", href: "/products"
    }] });
    assert.equal(home.explore.productSlides[0].description.ja, "バックエンドで更新した紹介文");
    const material = adaptMaterial({ slug: "alcantara", name: { en: "Alcantara", ja: "編集後の素材名" },
      introTitle: { en: "Original English", ja: "新しい見出し" }, introBody: { en: "Original English", ja: "" }
    }, { quote: { en: "English quote", ja: "" } });
    assert.equal(material.introTitle.ja, "新しい見出し");
    assert.equal(material.introBody.ja, "");
    assert.equal(material.introBody.en, "Original English");
    assert.equal(material.quote.ja, "");
    const category = adaptProductCategory({ slug: "tech-accessories", title: { en: "Tech", ja: "新しい分類名" },
      description: { en: "English description", ja: "編集した説明文" },
      carouselItems: [{ coverImageUrl: "/test.jpg", title: { en: "Item", ja: "新しい商品名" },
        description: { en: "English", ja: "新しい商品説明" }, details: [{ en: "Extra English bullet", ja: "" }] }]
    });
    assert.equal(category.title.ja, "新しい分類名");
    assert.equal(category.description.ja, "編集した説明文");
    assert.equal(category.curvedCarouselImages[0].description.ja, "新しい商品説明");
    assert.equal(category.curvedCarouselImages[0].details[0].ja, "");
  } finally { await cleanup(); }
});
