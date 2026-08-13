import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("Japanese navigation localizes material quick links", async () => {
  const content = await source("src/components/GlobalNav.tsx");

  assert.match(content, /label: \{ en: "AUTO", ja: "自動車" \}/);
  assert.match(content, /label: \{ en: "INTERIOR", ja: "インテリア" \}/);
  assert.match(content, /label: \{ en: "OUTDOOR", ja: "アウトドア" \}/);
  assert.match(content, /label: \{ en: "TECH", ja: "テック" \}/);
  assert.match(content, /label: \{ en: "Vegan Leather", ja: "マイクロファイバーレザー" \}/);
});

test("Japanese product surfaces localize sales actions and supporting copy", async () => {
  const carousel = await source("src/components/ProductCurvedCarousel.tsx");
  const swatches = await source("src/components/SkuSwatches.tsx");

  assert.match(carousel, /locale === "en" \? "Contact Sales" : "営業担当に相談"/);
  assert.match(carousel, /B2B向けカスタムソリューションおよび卸売専用です。/);
  assert.match(swatches, /locale === "en" \? "Home" : "ホーム"/);
  assert.match(swatches, /locale === "en" \? "Material" : "素材"/);
  assert.match(swatches, /locale === "en" \? "Product code: " : "製品コード："/);
  assert.match(swatches, /locale === "en" \? "Colour" : "カラー"/);
  assert.match(swatches, /`\$\{skus\.length\}色`/);
  assert.match(swatches, /locale === "en" \? "Contact Sales" : "営業担当に相談"/);
  assert.match(swatches, /サンプル請求機能は現在準備中です。/);
  assert.match(swatches, /label: \{ en: "Specifications", ja: "仕様" \}/);
  assert.match(swatches, /label: \{ en: "Certifications", ja: "認証" \}/);
  assert.match(swatches, /label: \{ en: "Maintenance and clean", ja: "メンテナンス・お手入れ" \}/);
  assert.match(swatches, /label: \{ en: "Downloads", ja: "ダウンロード" \}/);
});

test("Japanese material and specification sections localize their visible headings", async () => {
  const materialsPage = await source("src/app/[locale]/materials/page.tsx");
  const specificationTable = await source("src/components/SpecificationTable.tsx");
  const downloadPanel = await source("src/components/DownloadPanel.tsx");
  const skuPage = await source("src/app/[locale]/materials/[materialSlug]/[productTypeSlug]/[skuSlug]/page.tsx");

  assert.match(materialsPage, /title=\{locale === "en" \? "Material" : "素材"\}/);
  assert.match(materialsPage, /subtitle=\{locale === "en" \? "The intersection of Italian sensory tension and Japanese restraint" : undefined\}/);
  assert.doesNotMatch(materialsPage, /素材へのこだわり/);
  assert.match(materialsPage, /locale === "en" \? "Tactile Silence" : "質感へのこだわり"/);
  assert.match(materialsPage, /空間に調和する、心地よい手ざわりの素材を厳選しています。/);
  assert.match(specificationTable, /locale === "en" \? "Specifications" : "仕様"/);
  assert.match(specificationTable, /locale === "en" \? "Certifications" : "認証"/);
  assert.match(specificationTable, /locale === "en" \? "Maintenance and clean" : "メンテナンス・お手入れ"/);
  assert.match(downloadPanel, /locale === "en" \? "Download" : "ダウンロード"/);
  assert.match(skuPage, /locale === "en" \? "Downloads" : "ダウンロード"/);
});

test("Japanese copy sheet overrides Sanity-backed material and home content", async () => {
  const copy = await source("src/lib/japanese-copy.ts");
  const loaders = await source("src/sanity/lib/loaders.ts");
  const productsPage = await source("src/app/[locale]/products/page.tsx");
  const materialIntro = await source("src/components/MaterialIntro.tsx");

  assert.match(copy, /製品の用途や使い心地に合わせた最適なデザイン・加工をご提案します。/);
  assert.match(copy, /スエードのような質感と優れた機能性を兼ね備えた、イタリア製プレミアム素材。/);
  assert.match(copy, /上品なマットな質感が魅力のイタリア製本革。/);
  assert.match(copy, /クラシックカーの魅力を受け継ぐ、高耐久な欧州製ファブリック。/);
  assert.match(copy, /本革の質感と環境への配慮を両立した高機能マイクロファイバーレザー。/);
  assert.match(copy, /イタリアの技術と美意識の融合/);
  assert.match(copy, /名車にふさわしい品質/);
  assert.match(copy, /職人の技が息づくイタリア製本革/);
  assert.match(loaders, /applyJapaneseMaterialCategoryCopy\(categories\)/);
  assert.match(loaders, /applyJapaneseMaterialCopy\(materials\)/);
  assert.match(loaders, /applyJapaneseHomePageCopy/);
  assert.match(productsPage, /JAPANESE_PRODUCT_SURFACE_DESCRIPTION/);
  assert.match(materialIntro, /quote \?/);
});

test("Japanese overview pages localize the remaining English section labels", async () => {
  const downloadsPage = await source("src/app/[locale]/downloads/page.tsx");
  const productsPage = await source("src/app/[locale]/products/page.tsx");
  const homePage = await source("src/app/[locale]/page.tsx");
  const applicationGrid = await source("src/components/ApplicationGrid.tsx");
  const productCarousel = await source("src/components/ProductCurvedCarousel.tsx");
  const projectCarousel = await source("src/components/MaterialProjectCarousel.tsx");
  const materialArticles = await source("src/components/MaterialArticleGrid.tsx");
  const materialBento = await source("src/components/MaterialBentoGrid.tsx");
  const exploreCarousel = await source("src/components/ExploreCarousel.tsx");

  assert.match(downloadsPage, /locale === "en" \? "Downloads" : "ダウンロード"/);
  assert.match(productsPage, /locale === "en" \? "Product" : "製品"/);
  assert.match(productCarousel, /locale === "en" \? "View All" : "すべて見る"/);
  assert.match(applicationGrid, /locale === "en" \? "Article" : "記事"/);
  assert.match(applicationGrid, /`\$\{application\.colorCount\}色`/);
  assert.match(projectCarousel, /locale === "en" \? "Gallery" : "ギャラリー"/);
  assert.match(materialArticles, /locale === "en" \? "Fabric Article" : "ファブリック記事"/);
  assert.match(materialArticles, /locale === "en" \? "Pattern Library" : "パターンライブラリー"/);
  assert.match(materialBento, /locale === "en" \? "Explore Texture" : "質感を見る"/);
  assert.match(exploreCarousel, /locale === "en" \? "View" : "詳細を見る"/);
  assert.match(homePage, /locale === "en" \? "Brand Value" : "ブランド価値"/);
  assert.match(homePage, /locale === "en" \? "About Us" : "会社情報"/);
});

test("Japanese visible content converts ALCANTARA and CAMARI to katakana", async () => {
  const locales = await source("src/lib/locales.ts");
  const loaders = await source("src/sanity/lib/loaders.ts");
  const materialPage = await source("src/app/[locale]/materials/[materialSlug]/page.tsx");
  const skuPage = await source("src/app/[locale]/materials/[materialSlug]/[productTypeSlug]/[skuSlug]/page.tsx");
  const downloads = await source("src/components/DownloadAccordion.tsx");
  const swatches = await source("src/components/SkuSwatches.tsx");

  assert.match(locales, /\.replace\(\/CAMARI JAPAN\/gi, "カマリ・ジャパン"\)/);
  assert.match(locales, /\.replace\(\/CAMARI\/gi, "カマリ"\)/);
  assert.match(locales, /\.replace\(\/ALCANTARA\/gi, "アルカンターラ"\)/);
  assert.match(loaders, /normalizeLocalizedBrandNames/);
  assert.match(materialPage, /localizeBrandNames\(item\.question, locale\)/);
  assert.match(materialPage, /localizeBrandNames\(paragraph, locale\)/);
  assert.match(skuPage, /localizeBrandNames\(item\.question, locale\)/);
  assert.match(skuPage, /localizeBrandNames\(item\.answer, locale\)/);
  assert.match(downloads, /localizeBrandNames\(download\.title\[locale\], locale\)/);
  assert.match(swatches, /locale === "en" \? "ALCANTARA COVER" : "アルカンターラ COVER"/);
  assert.match(swatches, /カマリ・ジャパンは各権利者/);
});
