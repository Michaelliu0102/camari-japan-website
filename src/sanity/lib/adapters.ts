import imageUrlBuilder from "@sanity/image-url";
import {
  aboutPageSettings as fallbackAboutPageSettings,
  homePageSettings as fallbackHomePageSettings,
  materialCategories as fallbackCategories,
  materials as fallbackMaterials,
  projectCases as fallbackProjects,
  productTypes as fallbackProductTypes,
  type AboutPageSettings,
  type Download,
  type HomeExploreSlide,
  type HomePageSettings,
  type LocalizedString,
  type Material,
  type MaterialCategory,
  type NewsItem,
  type ProductType,
  type ProjectCase,
  type Seo,
  type Sku
} from "../../lib/content";
import { productCategories as fallbackProductCategories, type ProductCategory } from "../../content/products/categories";
import type {
  RawAboutPageSettings,
  RawCatalog,
  RawDownload,
  RawHomePageSettings,
  RawMaterial,
  RawMaterialCategory,
  RawNewsItem,
  RawProductCategory,
  RawProductType,
  RawProjectCase,
  RawSeo,
  RawSanityImage,
  RawSku
} from "./queries";

const emptyLocalized: LocalizedString = { en: "", ja: "" };
const premiumCollection: LocalizedString = { en: "Premium Collection", ja: "プレミアムコレクション" };
const materialHeroImageOverrides: Record<string, string> = {
  leather: "/uploads/hero/leather-hero.png",
  "vegan-leather": "/uploads/veganleather/interior.jpg"
};
const materialIntroImageOverrides: Record<string, string> = {
  "vegan-leather": "/uploads/veganleather/vegan.jpeg"
};
const materialApplicationImageOverrides: Record<string, Record<string, string>> = {
  "vegan-leather": {
    vinyl: "/uploads/veganleather/skai cover .webp",
    "microfiber-leather": "/uploads/veganleather/color.png"
  }
};
const sanityImageBuilder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"
});

type SanityImageUrlOptions = {
  height?: number;
  quality?: number;
  width?: number;
};

function localized(value: LocalizedString | null | undefined): LocalizedString {
  return {
    en: value?.en ?? "",
    ja: value?.ja ?? ""
  };
}

function hasSanityImageAsset(image: RawSanityImage | undefined): image is NonNullable<RawSanityImage> {
  return Boolean(image?.asset);
}

function buildSanityImageUrl(image: RawSanityImage | undefined, fallbackUrl: string, options: SanityImageUrlOptions = {}): string {
  if (!hasSanityImageAsset(image)) {
    return fallbackUrl;
  }

  try {
    let builder = sanityImageBuilder.image(image as Parameters<typeof sanityImageBuilder.image>[0]).auto("format").quality(options.quality ?? 82);

    if (options.width) {
      builder = builder.width(options.width);
    }

    if (options.height) {
      builder = builder.height(options.height);
    }

    if (options.width && options.height) {
      builder = builder.fit("crop");
    }

    return builder.url();
  } catch {
    return fallbackUrl;
  }
}

function imageIdentity(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString();
  } catch {
    return url.split("#")[0].split("?")[0];
  }
}

function uniqueImageUrls(urls: string[]): string[] {
  const seen = new Set<string>();

  return urls.filter((url) => {
    const key = imageIdentity(url);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
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

function fixtureProductType(slug: string): ProductType | undefined {
  return fallbackProductTypes.find((productType) => productType.slug === slug);
}

function fixtureProductCategory(slug: string): ProductCategory | undefined {
  return fallbackProductCategories.find((category) => category.slug === slug);
}

function fixtureCategory(slug: string): MaterialCategory | undefined {
  return fallbackCategories.find((category) => category.slug === slug);
}

function adaptDownload(raw: RawDownload): Download {
  return {
    title: localized(raw.title),
    description: localized(raw.description),
    href: raw.href ?? "",
    type: raw.type ?? "technical",
    updatedAt: raw.updatedAt ?? undefined
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

export function adaptAboutPageSettings(raw: RawAboutPageSettings): AboutPageSettings {
  const fallback = fallbackAboutPageSettings;
  const heroImage = raw?.heroImageUrl ?? fallback.heroImage;
  const bodyParagraphs = (raw?.bodyParagraphs ?? [])
    .map((paragraph) => localized(paragraph))
    .filter((paragraph) => paragraph.en || paragraph.ja);
  const manufacturingParagraphs = (raw?.manufacturingParagraphs ?? [])
    .map((paragraph) => localized(paragraph))
    .filter((paragraph) => paragraph.en || paragraph.ja);

  return {
    seo: {
      title: localized(raw?.seoTitle ?? fallback.seo.title),
      description: localized(raw?.seoDescription ?? fallback.seo.description),
      image: raw?.seoImageUrl ?? heroImage ?? fallback.seo.image
    },
    heroImage,
    heroAlt: localized(raw?.heroAlt ?? fallback.heroAlt),
    heroTitle: localized(raw?.heroTitle ?? fallback.heroTitle),
    exploreLabel: localized(raw?.exploreLabel ?? fallback.exploreLabel),
    bodyLabel: localized(raw?.bodyLabel ?? fallback.bodyLabel),
    bodyTitle: localized(raw?.bodyTitle ?? fallback.bodyTitle),
    bodyParagraphs: bodyParagraphs.length ? bodyParagraphs : fallback.bodyParagraphs,
    manufacturingLabel: localized(raw?.manufacturingLabel ?? fallback.manufacturingLabel),
    manufacturingTitle: localized(raw?.manufacturingTitle ?? fallback.manufacturingTitle),
    manufacturingParagraphs: manufacturingParagraphs.length ? manufacturingParagraphs : fallback.manufacturingParagraphs
  };
}

export function adaptMaterialCategory(raw: RawMaterialCategory): MaterialCategory {
  const slug = raw.slug ?? "";
  const fixture = fixtureCategory(slug);

  return {
    slug,
    updatedAt: raw.updatedAt ?? undefined,
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
  const heroImage = materialHeroImageOverrides[slug] ?? raw.heroImageUrl ?? fixture?.heroImage ?? "";

  return {
    slug,
    updatedAt: raw.updatedAt ?? undefined,
    categorySlug: raw.categorySlug ?? fixture?.categorySlug ?? "",
    name,
    eyebrow: raw.categoryName ? localized(raw.categoryName) : premiumCollection,
    heroTitle: name,
    heroSubtitle: localized(raw.heroSubtitle),
    heroImage,
    introTitle: localized(raw.introTitle),
    introBody: localized(raw.introBody),
    introImage: materialIntroImageOverrides[slug] ?? raw.introImageUrl ?? fixture?.introImage ?? "",
    quote: fixture?.quote ?? emptyLocalized,
    applications: (raw.applications ?? [])
      .map((application) => {
        const applicationName = localized(application.name);
        const applicationSlug = slugify(applicationName.en || applicationName.ja);

        return {
          slug: applicationSlug,
          name: applicationName,
          colorCount: application.colorCount ?? 0,
          image: materialApplicationImageOverrides[slug]?.[applicationSlug] ?? application.imageUrl ?? heroImage,
          productTypeSlug: application.productTypeSlug ?? undefined
        };
      })
      .filter((application) => slug !== "vegan-leather" || application.slug !== "pu-leather"),
    seo: adaptSeo(raw.seo, name, raw.introBody ?? emptyLocalized, raw.seo?.imageUrl ?? heroImage)
  };
}

export function adaptProductType(raw: RawProductType): ProductType {
  const slug = raw.slug ?? "";
  const name = localized(raw.name);
  const fixture = fixtureProductType(slug);
  const specTemplate = (raw.specTemplate ?? [])
    .map((field) => ({
      key: field?.key ?? "",
      label: localized(field?.label),
      aliases: field?.aliases?.filter(Boolean) ?? [],
      defaultValue: field?.defaultValue ? localized(field.defaultValue) : undefined
    }))
    .filter((field) => field.key);
  const certifications = (raw.certifications ?? [])
    .map((certification) => localized(certification))
    .filter((certification) => certification.en || certification.ja);
  const maintenance = (raw.maintenance ?? [])
    .map((item) => ({
      title: localized(item?.title),
      description: localized(item?.description)
    }))
    .filter((item) => item.title.en || item.title.ja || item.description.en || item.description.ja);

  return {
    slug,
    updatedAt: raw.updatedAt ?? undefined,
    materialSlug: raw.materialSlug ?? fixture?.materialSlug ?? "",
    name,
    summary: raw.summary?.en || raw.summary?.ja ? localized(raw.summary) : fixture?.summary ?? emptyLocalized,
    productCode: raw.productCode ?? fixture?.productCode,
    downloads: raw.downloads?.length ? raw.downloads.map(adaptDownload) : fixture?.downloads ?? [],
    specTemplate: specTemplate.length ? specTemplate : fixture?.specTemplate ?? [],
    certifications: certifications.length ? certifications : fixture?.certifications ?? [],
    maintenance: maintenance.length ? maintenance : fixture?.maintenance ?? [],
    seo: adaptSeo(raw.seo, name, fixture?.seo.description ?? emptyLocalized, raw.seo?.imageUrl ?? fixture?.seo.image ?? "")
  };
}

export function adaptProductCategory(raw: RawProductCategory): ProductCategory {
  const slug = raw.slug ?? "";
  const fixture = fixtureProductCategory(slug);
  const title = raw.title?.en || raw.title?.ja ? localized(raw.title) : fixture?.title ?? emptyLocalized;
  const heroImage = raw.heroImageUrl ?? fixture?.heroImage ?? "";
  const highlights = (raw.highlights ?? [])
    .map((highlight) => ({
      title: localized(highlight?.title),
      body: localized(highlight?.body)
    }))
    .filter((highlight) => highlight.title.en || highlight.title.ja || highlight.body.en || highlight.body.ja);
  const carouselItems = (raw.carouselItems ?? [])
    .map((item, index) => {
      const coverImage = item.coverImageUrl ?? "";
      const galleryImages = uniqueImageUrls((item.galleryImageUrls ?? []).filter((url): url is string => Boolean(url)));
      const fixtureItem = fixture?.curvedCarouselImages?.[index];

      return {
        src: coverImage,
        title: localized(item.title),
        description: localized(item.description),
        customizedOption:
          item.customizedOption?.en || item.customizedOption?.ja
            ? localized(item.customizedOption)
            : fixtureItem?.customizedOption ?? emptyLocalized,
        details: (item.details ?? []).map((detail) => localized(detail)).filter((detail) => detail.en || detail.ja),
        galleryImages: galleryImages.length ? galleryImages : coverImage ? [coverImage] : []
      };
    })
    .filter((item) => item.src && (item.title.en || item.title.ja));

  return {
    slug,
    updatedAt: raw.updatedAt ?? undefined,
    title,
    subtitle: raw.subtitle?.en || raw.subtitle?.ja ? localized(raw.subtitle) : fixture?.subtitle ?? emptyLocalized,
    heroImage,
    curvedCarouselImages: carouselItems.length ? carouselItems : fixture?.curvedCarouselImages,
    description: raw.description?.en || raw.description?.ja ? localized(raw.description) : fixture?.description ?? emptyLocalized,
    highlights: highlights.length ? highlights : fixture?.highlights ?? []
  };
}

export function adaptSku(raw: RawSku): Sku {
  const colorName = localized(raw.colorName);
  const code = raw.code ?? "";

  return {
    slug: raw.slug ?? "",
    updatedAt: raw.updatedAt ?? undefined,
    materialSlug: raw.materialSlug ?? "",
    productTypeSlug: raw.productTypeSlug ?? "",
    code,
    colorName,
    hex: raw.hex || undefined,
    image: raw.heroImageUrl ?? "",
    swatchImage: raw.swatchImageUrl ?? raw.previewImageUrl ?? undefined,
    previewImage: raw.previewImageUrl ?? undefined,
    caseGallery: (raw.caseGallery ?? [])
      .map((item) => ({
        image: item.imageUrl ?? "",
        alt: localized(item.alt)
      }))
      .filter((item) => item.image),
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
  const rawCoverImageUrl = raw.imageUrl ?? "";
  const image = buildSanityImageUrl(raw.image, rawCoverImageUrl, { quality: 84, width: 1600 });
  const coverCarouselImage = buildSanityImageUrl(raw.image, image, { height: 1240, quality: 82, width: 920 });
  const galleryImages = (raw.galleryImages ?? []).map((galleryImage, index) =>
    buildSanityImageUrl(galleryImage, raw.galleryImageUrls?.[index] ?? "", { height: 1240, quality: 82, width: 920 })
  );
  const galleryFallbackImages = (raw.galleryImageUrls ?? []).filter((_, index) => !hasSanityImageAsset(raw.galleryImages?.[index]));
  const projectImages = [coverCarouselImage, ...galleryImages, ...galleryFallbackImages].filter((item): item is string => Boolean(item));
  const fixture = fallbackProjects.find((project) => project.slug === raw.slug);
  const linkedMaterials = (raw.linkedMaterials ?? [])
    .map((item) =>
      item?.slug
        ? {
            slug: item.slug,
            name: localized(item.name)
          }
        : null
    )
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const linkedArticles = (raw.linkedArticles ?? [])
    .map((item) =>
      item?.slug && item.materialSlug
        ? {
            slug: item.slug,
            materialSlug: item.materialSlug,
            name: localized(item.name)
          }
        : null
    )
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    slug: raw.slug ?? "",
    updatedAt: raw.updatedAt ?? undefined,
    title,
    industry: localized(raw.industry),
    image,
    projectImages: uniqueImageUrls(projectImages),
    summary: localized(raw.summary),
    materialSlug: raw.materialSlug ?? "",
    linkedMaterials:
      linkedMaterials.length > 0
        ? linkedMaterials
        : fixture?.linkedMaterials ??
          (raw.materialSlug
            ? [
                {
                  slug: raw.materialSlug,
                  name: fixtureMaterial(raw.materialSlug)?.name ?? emptyLocalized
                }
              ]
            : []),
    linkedArticles: linkedArticles.length > 0 ? linkedArticles : fixture?.linkedArticles ?? [],
    seo: adaptSeo(raw.seo, title, raw.summary ?? emptyLocalized, raw.seo?.imageUrl ?? image)
  };
}

export function adaptNewsItem(raw: RawNewsItem): NewsItem {
  const title = localized(raw.title);
  const image = raw.imageUrl ?? "";

  return {
    slug: raw.slug ?? "",
    updatedAt: raw.updatedAt ?? undefined,
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
    type: "catalog",
    updatedAt: raw.updatedAt ?? undefined
  };
}
