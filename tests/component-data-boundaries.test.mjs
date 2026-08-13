import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("MaterialBentoGrid receives categories and materials through props", async () => {
  const content = await source("src/components/MaterialBentoGrid.tsx");

  assert.doesNotMatch(content, /getMaterial|materialCategories/);
  assert.match(content, /categories: MaterialCategory\[\]/);
  assert.match(content, /materials: Material\[\]/);
});

test("ExploreCarousel builds slides from props instead of module-level fixtures", async () => {
  const content = await source("src/components/ExploreCarousel.tsx");

  assert.doesNotMatch(content, /getMaterial|materialCategories/);
  assert.match(content, /categories: MaterialCategory\[\]/);
  assert.match(content, /materials: Material\[\]/);
  assert.doesNotMatch(content, /const slides = \[/);
});

test("ExploreCarousel auto-rotates slides and keeps arrows as unframed controls", async () => {
  const content = await source("src/components/ExploreCarousel.tsx");

  assert.match(content, /setInterval/);
  assert.match(content, /clearInterval/);
  assert.match(content, /aria-label="Previous slide"/);
  assert.match(content, /aria-label="Next slide"/);
  assert.doesNotMatch(content, /border border-charcoal\/20 bg-paper\/90/);
});

test("ApplicationGrid receives material SKUs through props", async () => {
  const content = await source("src/components/ApplicationGrid.tsx");

  assert.doesNotMatch(content, /getSkusForMaterial/);
  assert.match(content, /skus: Sku\[\]/);
  assert.match(content, /firstSku\.productTypeSlug/);
  assert.match(
    content,
    /\/materials\/\$\{material\.slug\}\/\$\{firstSku\.productTypeSlug\}\/\$\{firstSku\.slug\}/,
  );
});

test("material detail page keeps leather on the application grid while fabric uses the article grid", async () => {
  const page = await source(
    "src/app/[locale]/materials/[materialSlug]/page.tsx",
  );

  assert.match(page, /export const dynamic = "force-dynamic"/);
  assert.match(page, /new Set\(\["fabric"\]\)/);
  assert.doesNotMatch(page, /new Set\(\["fabric", "leather"\]\)/);
  assert.match(
    page,
    /showArticleGridForMaterial\s*=\s*articleGridMaterialSlugs\.has\(\s*material\.slug,?\s*\)/,
  );
  assert.match(page, /productTypes=\{articleProductTypes\}/);
  assert.match(page, /skus=\{articleSkus\}/);
  assert.doesNotMatch(page, /showArticleGrid = material\.slug === "fabric"/);
});

test("MaterialArticleGrid keeps fabric-specific article copy", async () => {
  const content = await source("src/components/MaterialArticleGrid.tsx");

  assert.match(content, /Fabric Article/);
  assert.match(content, /Pattern Library/);
  assert.match(content, /Preview fabric colour/);
  assert.doesNotMatch(content, /Leather Article/);
});

test("automotive product category renders the curved endless showcase carousel", async () => {
  const categoryContent = await source("src/content/products/categories.ts");
  const page = await source(
    "src/app/[locale]/products/[categorySlug]/page.tsx",
  );
  const carousel = await source("src/components/ProductCurvedCarousel.tsx");

  assert.match(categoryContent, /curvedCarouselImages/);
  assert.match(
    categoryContent,
    /src: "\/uploads\/product\/product\/cover-photo\/storage-box-cover\.jpg"/,
  );
  assert.match(categoryContent, /description:/);
  assert.match(categoryContent, /customizedOption/);
  assert.match(categoryContent, /galleryImages:/);
  assert.match(page, /ProductCurvedCarousel/);
  assert.match(page, /loadProductCategory/);
  assert.match(page, /if \(category\.curvedCarouselImages\)/);
  assert.match(page, /heroImage=\{category\.heroImage\}/);
  assert.match(page, /subtitle=\{category\.subtitle\[locale\]\}/);
  assert.match(page, /category\.curvedCarouselImages/);
  assert.match(carousel, /import Image from "next\/image"/);
  assert.match(carousel, /min-h-screen/);
  assert.match(carousel, /<h1/);
  assert.match(carousel, /heroCarouselItems/);
  assert.match(carousel, /hero-orbit-track/);
  assert.match(carousel, /#surface-detail-/);
  assert.match(carousel, /activeDetailIndex/);
  assert.match(carousel, /activeGalleryImageIndex/);
  assert.match(carousel, /openDetailView/);
  assert.match(carousel, /data-carousel-index/);
  assert.match(carousel, /closeDetailView/);
  assert.match(carousel, /createPortal/);
  assert.match(carousel, /id="curved-gallery"/);
  assert.match(carousel, /pointer-events-none object-cover/);
  assert.match(carousel, /detailGalleryImages/);
  assert.match(carousel, /z-\[200\]/);
  assert.match(carousel, /fixed right-5 top-5 z-\[120\]/);
  assert.doesNotMatch(carousel, /flex h-11 w-11/);
  assert.match(carousel, /role="dialog"/);
  assert.match(carousel, /aria-modal="true"/);
  assert.match(carousel, /Customized option/);
  assert.match(carousel, /カスタマイズオプション/);
  assert.doesNotMatch(carousel, /Other images/);
  assert.match(carousel, /Escape/);
  assert.doesNotMatch(carousel, /from "@react-three\/fiber"/);
  assert.doesNotMatch(carousel, /PerspectiveCamera/);
});

test("Sanity product categories manage curved carousel covers and gallery images", async () => {
  const schemaIndex = await source("src/sanity/schemaTypes/index.ts");
  const schema = await source("src/sanity/schemaTypes/productCategory.ts");
  const queries = await source("src/sanity/lib/queries.ts");
  const adapters = await source("src/sanity/lib/adapters.ts");
  const loaders = await source("src/sanity/lib/loaders.ts");

  assert.match(schemaIndex, /productCategory/);
  assert.match(schema, /name: "productCategory"/);
  assert.match(schema, /automotive-interior-accessories/);
  assert.match(schema, /tech-accessories/);
  assert.match(schema, /lifestyle/);
  assert.match(schema, /corporation-gift/);
  assert.match(schema, /name: "carouselItems"/);
  assert.match(schema, /name: "coverImage"/);
  assert.match(schema, /name: "customizedOption"/);
  assert.match(schema, /name: "gallery"/);
  assert.match(queries, /productCategoriesQuery/);
  assert.match(queries, /_type == "productCategory"/);
  assert.match(queries, /carouselItems\[\]/);
  assert.match(queries, /"coverImageUrl": coverImage\.asset->url/);
  assert.match(queries, /customizedOption/);
  assert.match(queries, /"galleryImageUrls": gallery\[\]\.asset->url/);
  assert.match(adapters, /adaptProductCategory/);
  assert.match(adapters, /fallbackProductCategories/);
  assert.match(
    adapters,
    /curvedCarouselImages: carouselItems\.length \? carouselItems : fixture\?\.curvedCarouselImages/,
  );
  assert.match(loaders, /loadProductCategories/);
  assert.match(loaders, /loadProductCategory/);
  assert.match(loaders, /productCategoriesQuery/);
});

test("material detail page replaces the lower CTA with material project carousel content", async () => {
  const page = await source(
    "src/app/[locale]/materials/[materialSlug]/page.tsx",
  );

  assert.match(page, /MaterialProjectCarousel/);
  assert.match(page, /loadProjectsForMaterial/);
  assert.match(page, /projects=\{projects\}/);
  assert.doesNotMatch(page, /CTASection/);
  assert.doesNotMatch(page, /View SKU Detail/);
});

test("MaterialProjectCarousel connects Sanity project images to the parallax carousel", async () => {
  const content = await source("src/components/MaterialProjectCarousel.tsx");

  assert.match(content, /projects: ProjectCase\[\]/);
  assert.match(content, /project\.projectImages/);
  assert.match(content, /new Map<string, ProjectImageEntry>\(\)/);
  assert.match(content, /<ParallaxCarousel/);
  assert.match(
    content,
    /images=\{projectImages\.map\(\(item\) => item\.src\)\}/,
  );
  assert.doesNotMatch(content, /selectedProject/);
  assert.doesNotMatch(content, /ArrowLeft|ArrowRight/);
});

test("Material project modal renders explicit linked-article CTA links above the photo", async () => {
  const content = await source("src/components/MaterialProjectCarousel.tsx");

  assert.match(content, /const router = useRouter\(\)/);
  assert.match(content, /<span>See <\/span>/);
  assert.match(
    content,
    /<span className="border-b border-current pb-\[2px\]">\{link\.label\}<\/span>/,
  );
  assert.doesNotMatch(content, /See '\{link\.label\}'/);
  assert.match(content, /handleProjectLinkClick\(link\.href\)/);
  assert.match(content, /router\.push\(localizedPath\(locale, href\)\)/);
  assert.doesNotMatch(content, /className="underline/);
  assert.doesNotMatch(
    content,
    /\{locale === "en" \? "Project" : "プロジェクト"\}/,
  );
});

test("Project case schema distinguishes primary and additional material links", async () => {
  const content = await source("src/sanity/schemaTypes/projectCase.ts");

  assert.match(content, /name: "relatedMaterial", title: "Primary Material"/);
  assert.match(content, /name: "linkedMaterials"/);
  assert.match(content, /title: "Additional Materials"/);
});

test("MaterialProjectCarousel crops project images to a consistent carousel size", async () => {
  const content = await source("src/components/MaterialProjectCarousel.tsx");

  assert.match(content, /imageFit="cover"/);
  assert.match(content, /imageHeight=\{620\}/);
  assert.match(content, /imageWidth=\{460\}/);
});

test("MaterialProjectCarousel keeps the shader parallax motion enabled", async () => {
  const content = await source("src/components/MaterialProjectCarousel.tsx");

  assert.match(content, /<ParallaxCarousel/);
  assert.doesNotMatch(content, /parallaxIntensity=\{0\}/);
  assert.doesNotMatch(content, /uvScale=\{0\}/);
});

test("ParallaxCarousel uses a Three.js shader carousel with imperative index navigation", async () => {
  const content = await source("src/components/ParallaxCarousel.tsx");

  assert.match(content, /from "@react-three\/fiber"/);
  assert.match(content, /fragmentShader=\{PLANE_FRAGMENT\}/);
  assert.match(content, /texture2D\(uMap, uv\)/);
  assert.match(content, /scrollToIndex: \(index: number\) => void/);
  assert.match(content, /useImperativeHandle/);
});

test("ParallaxCarousel consumes horizontal wheel gestures inside the gallery", async () => {
  const content = await source("src/components/ParallaxCarousel.tsx");

  assert.match(content, /event\.preventDefault\(\)/);
  assert.match(
    content,
    /node\.addEventListener\("wheel", onWheel, \{ passive: false \}\)/,
  );
});

test("Material detail page builds project CTA links directly from linked articles", async () => {
  const content = await source(
    "src/app/[locale]/materials/[materialSlug]/page.tsx",
  );

  assert.match(content, /function buildProjectLinks\(/);
  assert.match(content, /project\.linkedArticles/);
  assert.match(
    content,
    /const firstSkuByArticleKey = new Map<string, Sku>\(\)/,
  );
  assert.match(
    content,
    /const articleKey = `\$\{linkedArticle\.materialSlug\}::\$\{linkedArticle\.slug\}`/,
  );
  assert.match(
    content,
    /href: `\/materials\/\$\{linkedArticle\.materialSlug\}\/\$\{linkedArticle\.slug\}\/\$\{firstSku\.slug\}`/,
  );
});

test("SkuSwatches builds the side image rail from the selected SKU gallery", async () => {
  const content = await source("src/components/SkuSwatches.tsx");

  assert.match(content, /selected\.caseGallery/);
  assert.match(content, /galleryImages\.map/);
  assert.match(content, /setActiveImageIndex\(index\)/);
  assert.match(content, /setActiveImageIndex\(0\)/);
  assert.match(content, /productTypeSlug/);
  assert.match(content, /productTypeName/);
});

test("SkuSwatches can render colour chips from swatch images when hex values are missing", async () => {
  const content = await source("src/components/SkuSwatches.tsx");

  assert.match(
    content,
    /import \{ toSanityThumbnailUrl \} from "@\/lib\/image-urls"/,
  );
  assert.match(content, /const skuSwatchThumbnailSize = 96/);
  assert.match(
    content,
    /skus\.some\(\(s\) => s\.hex \|\| s\.swatchImage \|\| s\.previewImage \|\| s\.image\)/,
  );
  assert.match(
    content,
    /function getSkuSwatchImage\(sku: Sku\): string \| undefined/,
  );
  assert.match(
    content,
    /sku\.swatchImage \?\? sku\.previewImage \?\? \(sku\.image \|\| undefined\)/,
  );
  assert.match(
    content,
    /toSanityThumbnailUrl\(image, skuSwatchThumbnailSize\)/,
  );
  assert.match(content, /src=\{swatchImage\} unoptimized/);
});

test("SkuSwatches sorts automotive nappa colour chips from light to dark", async () => {
  const content = await source("src/components/SkuSwatches.tsx");

  assert.match(
    content,
    /const lightToDarkSwatchProductTypes = new Set\(\["automotive-nappa"\]\)/,
  );
  assert.match(content, /function getHexLuminance\(value: string\): number/);
  assert.match(
    content,
    /function sortSkusForSwatches\(skus: Sku\[\], productTypeSlug: string\): Sku\[\]/,
  );
  assert.match(
    content,
    /getHexLuminance\(right\.hex \?\? ""\) - getHexLuminance\(left\.hex \?\? ""\)/,
  );
  assert.match(
    content,
    /const swatchSkus = useMemo\(\(\) => sortSkusForSwatches\(skus, productTypeSlug\), \[productTypeSlug, skus\]\)/,
  );
  assert.match(content, /swatchSkus\.map\(\(sku\) =>/);
});

test("SkuSwatches keeps the Dedar-style grey stage with cursor-following zoom", async () => {
  const content = await source("src/components/SkuSwatches.tsx");

  assert.match(content, /bg-\[\#f3f3f2\]/);
  assert.match(content, /cursor-zoom-in/);
  assert.match(content, /--sku-zoom-x/);
  assert.match(content, /--sku-zoom-y/);
  assert.match(content, /onPointerMove=\{handleImagePointerMove\}/);
  assert.match(content, /inset-\[9%_20%\]/);
  assert.match(content, /group-hover\/sku-image:scale-\[/);
});

test("SkuSwatches renders the selected color code directly beneath the main image stage", async () => {
  const content = await source("src/components/SkuSwatches.tsx");

  assert.match(content, /<div className="flex-1">/);
  assert.match(
    content,
    /<p className="mt-5 text-center font-sans text-\[12px\] leading-\[19px\] md:mt-6">/,
  );
  assert.match(
    content,
    /<span className="font-semibold text-charcoal">\{locale === "en" \? "Color Code: " : "カラーコード："\}<\/span>/,
  );
  assert.match(
    content,
    /<span className="text-charcoal\/70">\{selected\.code\}<\/span>/,
  );
  assert.doesNotMatch(
    content,
    /\/\* SKU code — Dedar's productView-info-value--sku \*\/[\s\S]*selected\.code/,
  );
});

test("SkuSwatches uses compact icon navigation instead of a tall secondary image strip", async () => {
  const content = await source("src/components/SkuSwatches.tsx");

  assert.match(content, /product-info-nav/);
  assert.match(content, /Specifications/);
  assert.match(content, /Certifications/);
  assert.match(content, /Downloads/);
  assert.doesNotMatch(content, /label: "Inspiration"/);
  assert.doesNotMatch(content, /label: "You may also like"/);
  assert.doesNotMatch(content, /aspect-\[21\/9\]/);
});

test("SpecificationTable renders certifications and maintenance as standalone sections below specifications", async () => {
  const content = await source("src/components/SpecificationTable.tsx");

  assert.match(content, /id="specifications"/);
  assert.match(content, /id="certifications"/);
  assert.match(content, /id="maintenance-and-clean"/);
  assert.match(content, /productType: ProductType/);
  assert.match(content, /productType\.specTemplate\.map/);
  assert.match(content, /field\.defaultValue/);
  assert.match(
    content,
    /sectionTitleClassName = "font-serif text-2xl uppercase tracking-\[0\.06em\]"/,
  );
  assert.match(content, /sectionInnerClassName = "mx-auto max-w-\[46rem\]"/);
  assert.match(
    content,
    /<h2 className=\{sectionTitleClassName\}>\{locale === "en" \? "Certifications" : "認証"\}<\/h2>/,
  );
  assert.match(
    content,
    /<h2 className=\{sectionTitleClassName\}>\{locale === "en" \? "Maintenance and clean" : "メンテナンス・お手入れ"\}<\/h2>/,
  );
  assert.match(content, /download\.type === "care"/);
});

test("SKU detail route nests product type between material and sku", async () => {
  const route = await source(
    "src/app/[locale]/materials/[materialSlug]/[productTypeSlug]/[skuSlug]/page.tsx",
  );

  assert.match(route, /productTypeSlug/);
  assert.match(route, /loadProductType/);
  assert.match(route, /loadSkusForProductType/);
  assert.match(
    route,
    /\/materials\/\$\{materialSlug\}\/\$\{productTypeSlug\}\/\$\{sku\.slug\}/,
  );
});

test("homepage loads CMS-managed homepage settings", async () => {
  const page = await source("src/app/[locale]/page.tsx");
  const hero = await source("src/components/HeroVideo.tsx");
  const carousel = await source("src/components/ExploreCarousel.tsx");

  assert.match(page, /loadHomePageSettings/);
  assert.match(page, /homeSettings\.hero/);
  assert.match(page, /homeSettings\.explore/);
  assert.match(hero, /hero: HomeHero/);
  assert.match(carousel, /categorySlugs\?: string\[\]/);
  assert.match(carousel, /productSlides\?: ExploreSlide\[\]/);
});

test("homepage omits the material bento grid and featured OEM case section", async () => {
  const page = await source("src/app/[locale]/page.tsx");

  assert.doesNotMatch(page, /MaterialBentoGrid/);
  assert.doesNotMatch(page, /featureCase/);
  assert.doesNotMatch(page, /OEM \/ ODM/);
  assert.doesNotMatch(
    page,
    /From texture selection to finished surface programs\./,
  );
});

test("Footer renders newsletter signup and corporate trust navigation", async () => {
  const footer = await source("src/components/Footer.tsx");

  assert.match(footer, /FooterNewsletterForm/);
  assert.match(footer, /Company Profile/);
  assert.match(footer, /プライバシーポリシー/);
  assert.match(footer, /\/privacy-policy/);
  assert.match(footer, /\/site-policy/);
  assert.match(footer, /\/sitemap/);
  assert.doesNotMatch(footer, /Back to Top/);
  assert.doesNotMatch(footer, /logo-outline-dark block text-4xl/);
});

test("FooterNewsletterForm posts newsletter subscriptions with localized feedback states", async () => {
  const form = await source("src/components/FooterNewsletterForm.tsx");

  assert.match(form, /Subscribe to our newsletter/);
  assert.match(form, /ニュースレターを購読する/);
  assert.match(
    form,
    /useState<"idle" \| "submitting" \| "success" \| "error">/,
  );
  assert.match(form, /isValidNewsletterEmail/);
  assert.match(form, /fetch\("\/api\/newsletter\/subscribe"/);
  assert.match(form, /NEWSLETTER_SOURCE/);
  assert.match(form, /submittedAt: new Date\(\)\.toISOString\(\)/);
  assert.match(form, /disabled=\{status === "submitting"\}/);
  assert.match(form, /aria-live="polite"/);
});

test("Studio route explains missing Sanity project configuration before loading Studio", async () => {
  const page = await source("src/app/studio/[[...tool]]/page.tsx");

  assert.match(page, /NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(page, /replace-me/);
  assert.match(page, /Sanity project is not configured/);
});

test("Sanity product queries filter by deployment market", async () => {
  const queries = await source("src/sanity/lib/queries.ts");

  assert.match(queries, /\$market in markets/);
  assert.match(queries, /\$market in productType->markets/);
});

test("Sanity loaders pass the active market to product and SKU queries", async () => {
  const loaders = await source("src/sanity/lib/loaders.ts");

  assert.match(loaders, /getSanityMarket/);
  assert.match(loaders, /const market = getSanityMarket\(\)/);
  assert.match(loaders, /productTypesQuery, \{ market \}/);
  assert.match(loaders, /skusQuery, \{ market \}/);
});

test("test animation route renders the unpacking playground and stays out of search results", async () => {
  const page = await source("src/app/test-animation/page.tsx");
  const component = await source("src/components/UnpackingHero.tsx");

  assert.match(page, /UnpackingHero/);
  assert.match(page, /index:\s*false/);
  assert.match(page, /follow:\s*false/);
  assert.match(component, /from "gsap"/);
});

test("legacy product showcase URLs redirect to the canonical products page", async () => {
  const page = await source("src/app/[locale]/products/showcase/page.tsx");

  assert.match(page, /redirect\(category \? `\$\{productsPath\}\?category=\$\{encodeURIComponent\(category\)\}` : productsPath\)/);
  assert.match(page, /localizedPath\(locale, "\/products"\)/);
});

test("search overlay opts out of page-level smooth scrolling", async () => {
  const overlay = await source("src/components/SearchOverlay.tsx");
  const smoothScroll = await source("src/components/SmoothScroll.tsx");

  assert.match(overlay, /data-lenis-prevent/);
  assert.match(smoothScroll, /node\.closest\("\[data-lenis-prevent\]"\)/);
});
