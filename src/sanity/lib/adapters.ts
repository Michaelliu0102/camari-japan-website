import {
  homePageSettings as fallbackHomePageSettings,
  materialCategories as fallbackCategories,
  materials as fallbackMaterials,
  type Download,
  type HomeExploreSlide,
  type HomePageSettings,
  type LocalizedString,
  type Material,
  type MaterialCategory,
  type NewsItem,
  type ProjectCase,
  type Seo,
  type Sku
} from "../../lib/content";
import type {
  RawCatalog,
  RawDownload,
  RawHomePageSettings,
  RawMaterial,
  RawMaterialCategory,
  RawNewsItem,
  RawProjectCase,
  RawSeo,
  RawSku
} from "./queries";

const emptyLocalized: LocalizedString = { en: "", ja: "" };
const premiumCollection: LocalizedString = { en: "Premium Collection", ja: "プレミアムコレクション" };

function localized(value: LocalizedString | null | undefined): LocalizedString {
  return {
    en: value?.en ?? "",
    ja: value?.ja ?? ""
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function adaptSeo(raw: RawSeo | undefined, fallbackTitle: LocalizedString, fallbackDescription = emptyLocalized, fallbackImage = ""): Seo {
  return {
    title: localized(raw?.title ?? fallbackTitle),
    description: localized(raw?.description ?? fallbackDescription),
    image: raw?.imageUrl ?? fallbackImage
  };
}

function fixtureMaterial(slug: string): Material | undefined {
  return fallbackMaterials.find((material) => material.slug === slug);
}

function fixtureCategory(slug: string): MaterialCategory | undefined {
  return fallbackCategories.find((category) => category.slug === slug);
}

function adaptDownload(raw: RawDownload): Download {
  return {
    title: localized(raw.title),
    description: localized(raw.description),
    href: raw.href ?? "",
    type: raw.type ?? "technical"
  };
}

function muxVideoUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function adaptHomePageSettings(raw: RawHomePageSettings): HomePageSettings {
  const fallback = fallbackHomePageSettings;
  const playbackId = raw?.heroVideoPlaybackId?.trim();
  const productSlides = (raw?.exploreProductSlides ?? [])
    .map<HomeExploreSlide>((slide) => ({
      slug: slide.slug ?? "",
      title: localized(slide.title),
      category: localized(slide.category),
      description: localized(slide.description),
      image: slide.imageUrl ?? "",
      href: slide.href ?? ""
    }))
    .filter((slide) => slide.slug && slide.image && slide.href);

  return {
    hero: {
      title: localized(raw?.heroTitle ?? fallback.hero.title),
      subtitle: localized(raw?.heroSubtitle ?? fallback.hero.subtitle),
      videoSrc: raw?.heroVideoUrl || (playbackId ? muxVideoUrl(playbackId) : fallback.hero.videoSrc),
      poster: raw?.heroPosterUrl ?? fallback.hero.poster,
      ctaLabel: localized(raw?.heroCtaLabel ?? fallback.hero.ctaLabel),
      ctaHref: raw?.heroCtaHref ?? fallback.hero.ctaHref
    },
    brandValueImage: raw?.brandValueImageUrl ?? fallback.brandValueImage,
    showroomBackgroundImage: raw?.showroomBackgroundImageUrl ?? fallback.showroomBackgroundImage,
    explore: {
      categorySlugs: raw?.exploreCategorySlugs?.filter(Boolean) ?? fallback.explore.categorySlugs,
      productSlides: productSlides.length ? productSlides : fallback.explore.productSlides
    }
  };
}

export function adaptMaterialCategory(raw: RawMaterialCategory): MaterialCategory {
  const slug = raw.slug ?? "";
  const fixture = fixtureCategory(slug);

  return {
    slug,
    name: localized(raw.name),
    tagline: localized(raw.tagline),
    description: localized(raw.description),
    coverImage: raw.coverImageUrl ?? fixture?.coverImage ?? "",
    accent: fixture?.accent ?? "#1A1A1A"
  };
}

export function adaptMaterial(raw: RawMaterial): Material {
  const slug = raw.slug ?? "";
  const name = localized(raw.name);
  const fixture = fixtureMaterial(slug);
  const heroImage = raw.heroImageUrl ?? fixture?.heroImage ?? "";

  return {
    slug,
    categorySlug: raw.categorySlug ?? fixture?.categorySlug ?? "",
    name,
    eyebrow: raw.categoryName ? localized(raw.categoryName) : premiumCollection,
    heroTitle: name,
    heroSubtitle: localized(raw.heroSubtitle),
    heroImage,
    introTitle: localized(raw.introTitle),
    introBody: localized(raw.introBody),
    introImage: raw.introImageUrl ?? fixture?.introImage ?? "",
    quote: fixture?.quote ?? emptyLocalized,
    applications: (raw.applications ?? []).map((application) => {
      const applicationName = localized(application.name);

      return {
        slug: slugify(applicationName.en || applicationName.ja),
        name: applicationName,
        colorCount: application.colorCount ?? 0,
        image: application.imageUrl ?? heroImage
      };
    }),
    seo: adaptSeo(raw.seo, name, raw.introBody ?? emptyLocalized, raw.seo?.imageUrl ?? heroImage)
  };
}

export function adaptSku(raw: RawSku): Sku {
  const colorName = localized(raw.colorName);
  const code = raw.code ?? "";

  return {
    slug: raw.slug ?? "",
    materialSlug: raw.materialSlug ?? "",
    code,
    colorName,
    hex: raw.hex ?? "#1A1A1A",
    image: raw.heroImageUrl ?? "",
    swatchImage: undefined,
    summary: localized(raw.summary),
    specs: (raw.specs ?? []).map((spec) => ({
      label: localized(spec.label),
      value: localized(spec.value)
    })),
    certifications: (raw.certifications ?? []).map((certification) => localized(certification)),
    downloads: (raw.downloads ?? []).map(adaptDownload),
    seo: adaptSeo(raw.seo, { en: code, ja: code }, raw.summary ?? emptyLocalized, raw.seo?.imageUrl ?? raw.heroImageUrl ?? "")
  };
}

export function adaptProjectCase(raw: RawProjectCase): ProjectCase {
  const title = localized(raw.title);
  const image = raw.imageUrl ?? "";

  return {
    slug: raw.slug ?? "",
    title,
    industry: localized(raw.industry),
    image,
    summary: localized(raw.summary),
    materialSlug: raw.materialSlug ?? "",
    seo: adaptSeo(raw.seo, title, raw.summary ?? emptyLocalized, raw.seo?.imageUrl ?? image)
  };
}

export function adaptNewsItem(raw: RawNewsItem): NewsItem {
  const title = localized(raw.title);
  const image = raw.imageUrl ?? "";

  return {
    slug: raw.slug ?? "",
    title,
    category: localized(raw.category),
    date: raw.publishedAt ? raw.publishedAt.slice(0, 10) : "",
    image,
    summary: localized(raw.summary),
    seo: adaptSeo(raw.seo, title, raw.summary ?? emptyLocalized, raw.seo?.imageUrl ?? image)
  };
}

export function adaptCatalog(raw: RawCatalog): Download {
  return {
    title: localized(raw.title),
    description: localized(raw.description),
    href: raw.href ?? "",
    type: "catalog"
  };
}
