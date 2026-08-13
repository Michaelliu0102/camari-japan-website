import type { LocalizedString } from "@/lib/content";

export type RawSeo = {
  title?: LocalizedString | null;
  description?: LocalizedString | null;
  imageUrl?: string | null;
} | null;

export type RawDownload = {
  title?: LocalizedString | null;
  description?: LocalizedString | null;
  href?: string | null;
  type?: "catalog" | "technical" | "care" | null;
  updatedAt?: string | null;
};

export type RawSanityImage = {
  asset?: { _ref?: string | null; _id?: string | null; url?: string | null } | null;
  crop?: { left?: number | null; top?: number | null; right?: number | null; bottom?: number | null } | null;
  hotspot?: { x?: number | null; y?: number | null; width?: number | null; height?: number | null } | null;
} | null;

export type RawMaterialCategory = {
  updatedAt?: string | null;
  name?: LocalizedString | null;
  slug?: string | null;
  tagline?: LocalizedString | null;
  description?: LocalizedString | null;
  coverImageUrl?: string | null;
};

export type RawApplication = {
  name?: LocalizedString | null;
  productTypeSlug?: string | null;
  colorCount?: number | null;
  imageUrl?: string | null;
};

export type RawMaterial = {
  updatedAt?: string | null;
  name?: LocalizedString | null;
  slug?: string | null;
  categorySlug?: string | null;
  categoryName?: LocalizedString | null;
  heroImageUrl?: string | null;
  heroSubtitle?: LocalizedString | null;
  introTitle?: LocalizedString | null;
  introBody?: LocalizedString | null;
  introImageUrl?: string | null;
  applications?: RawApplication[] | null;
  seo?: RawSeo;
};

export type RawProductType = {
  updatedAt?: string | null;
  name?: LocalizedString | null;
  slug?: string | null;
  markets?: string[] | null;
  materialSlug?: string | null;
  summary?: LocalizedString | null;
  productCode?: string | null;
  specTemplate?:
    | Array<{
        key?: string | null;
        label?: LocalizedString | null;
        aliases?: string[] | null;
        defaultValue?: LocalizedString | null;
      }>
    | null;
  certifications?: Array<LocalizedString | null> | null;
  maintenance?: Array<{ title?: LocalizedString | null; description?: LocalizedString | null } | null> | null;
  downloads?: RawDownload[] | null;
  seo?: RawSeo;
};

export type RawProductCarouselItem = {
  title?: LocalizedString | null;
  coverImageUrl?: string | null;
  description?: LocalizedString | null;
  customizedOption?: LocalizedString | null;
  details?: Array<LocalizedString | null> | null;
  galleryImageUrls?: Array<string | null> | null;
};

export type RawProductCategory = {
  updatedAt?: string | null;
  title?: LocalizedString | null;
  slug?: string | null;
  subtitle?: LocalizedString | null;
  heroImageUrl?: string | null;
  description?: LocalizedString | null;
  highlights?: Array<{ title?: LocalizedString | null; body?: LocalizedString | null } | null> | null;
  carouselItems?: RawProductCarouselItem[] | null;
  seo?: RawSeo;
};

export type RawSku = {
  updatedAt?: string | null;
  code?: string | null;
  slug?: string | null;
  materialSlug?: string | null;
  productTypeSlug?: string | null;
  colorName?: LocalizedString | null;
  hex?: string | null;
  heroImageUrl?: string | null;
  swatchImageUrl?: string | null;
  previewImageUrl?: string | null;
  caseGallery?: Array<{ imageUrl?: string | null; alt?: LocalizedString | null }> | null;
  summary?: LocalizedString | null;
  specs?: Array<{ label?: LocalizedString | null; value?: LocalizedString | null }> | null;
  certifications?: Array<LocalizedString | null> | null;
  downloads?: RawDownload[] | null;
  seo?: RawSeo;
};

export type RawProjectCase = {
  updatedAt?: string | null;
  title?: LocalizedString | null;
  slug?: string | null;
  industry?: LocalizedString | null;
  image?: RawSanityImage;
  imageUrl?: string | null;
  galleryImages?: Array<RawSanityImage> | null;
  galleryImageUrls?: Array<string | null> | null;
  summary?: LocalizedString | null;
  materialSlug?: string | null;
  linkedMaterials?:
    | Array<{
        slug?: string | null;
        name?: LocalizedString | null;
      } | null>
    | null;
  linkedArticles?:
    | Array<{
        slug?: string | null;
        materialSlug?: string | null;
        name?: LocalizedString | null;
      } | null>
    | null;
  seo?: RawSeo;
};

export type RawNewsItem = {
  updatedAt?: string | null;
  title?: LocalizedString | null;
  slug?: string | null;
  category?: LocalizedString | null;
  publishedAt?: string | null;
  imageUrl?: string | null;
  summary?: LocalizedString | null;
  body?: unknown;
  seo?: RawSeo;
};

export type RawCatalog = {
  updatedAt?: string | null;
  title?: LocalizedString | null;
  description?: LocalizedString | null;
  href?: string | null;
};

export type RawHomeExploreSlide = {
  slug?: string | null;
  title?: LocalizedString | null;
  category?: LocalizedString | null;
  description?: LocalizedString | null;
  imageUrl?: string | null;
  href?: string | null;
};

export type RawHomePageSettings = {
  heroTitle?: LocalizedString | null;
  heroSubtitle?: LocalizedString | null;
  heroVideoPlaybackId?: string | null;
  heroVideoUrl?: string | null;
  heroPosterUrl?: string | null;
  heroCtaLabel?: LocalizedString | null;
  heroCtaHref?: string | null;
  brandValueImageUrl?: string | null;
  showroomBackgroundImageUrl?: string | null;
  exploreCategorySlugs?: string[] | null;
  exploreProductSlides?: RawHomeExploreSlide[] | null;
} | null;

export type RawAboutPageSettings = {
  seoTitle?: LocalizedString | null;
  seoDescription?: LocalizedString | null;
  seoImageUrl?: string | null;
  heroImageUrl?: string | null;
  heroAlt?: LocalizedString | null;
  heroTitle?: LocalizedString | null;
  exploreLabel?: LocalizedString | null;
  bodyLabel?: LocalizedString | null;
  bodyTitle?: LocalizedString | null;
  bodyParagraphs?: Array<LocalizedString | null> | null;
  manufacturingLabel?: LocalizedString | null;
  manufacturingTitle?: LocalizedString | null;
  manufacturingParagraphs?: Array<LocalizedString | null> | null;
} | null;

export const homePageSettingsQuery = `*[_type == "homePage"][0] {
  heroTitle,
  heroSubtitle,
  heroVideoPlaybackId,
  heroVideoUrl,
  "heroPosterUrl": heroPoster.asset->url,
  heroCtaLabel,
  heroCtaHref,
  "brandValueImageUrl": brandValueImage.asset->url,
  "showroomBackgroundImageUrl": showroomBackgroundImage.asset->url,
  "exploreCategorySlugs": exploreMaterialCategories[]->slug.current,
  exploreProductSlides[] {
    slug,
    title,
    category,
    description,
    "imageUrl": image.asset->url,
    href
  }
}`;

export const aboutPageSettingsQuery = `*[_type == "aboutPage"][0] {
  seoTitle,
  seoDescription,
  "seoImageUrl": seoImage.asset->url,
  "heroImageUrl": heroImage.asset->url,
  heroAlt,
  heroTitle,
  exploreLabel,
  bodyLabel,
  bodyTitle,
  bodyParagraphs,
  manufacturingLabel,
  manufacturingTitle,
  manufacturingParagraphs
}`;

export const materialCategoriesQuery = `*[_type == "materialCategory"] | order(sortOrder asc, name.en asc) {
  "updatedAt": _updatedAt,
  name,
  "slug": slug.current,
  tagline,
  description,
  "coverImageUrl": coverImage.asset->url
}`;

export const materialsQuery = `*[_type == "material"] | order(name.en asc) {
  "updatedAt": _updatedAt,
  name,
  "slug": slug.current,
  "categorySlug": category->slug.current,
  "categoryName": category->name,
  "heroImageUrl": heroImage.asset->url,
  heroSubtitle,
  introTitle,
  introBody,
  "introImageUrl": introImage.asset->url,
  applications[] {
    name,
    productTypeSlug,
    colorCount,
    "imageUrl": image.asset->url
  },
  seo {
    title,
    description,
    "imageUrl": image.asset->url
  }
}`;

export const productTypesQuery = `*[_type == "productType" && (!defined(markets) || $market in markets)] | order(material->name.en asc, name.en asc) {
  "updatedAt": _updatedAt,
  name,
  "slug": slug.current,
  markets,
  "materialSlug": material->slug.current,
  summary,
  productCode,
  downloads[] {
    title,
    description,
    type,
    "href": file.asset->url
  },
  specTemplate[] {
    key,
    label,
    aliases,
    defaultValue
  },
  certifications,
  maintenance[] {
    title,
    description
  },
  seo {
    title,
    description,
    "imageUrl": image.asset->url
  }
}`;

export const productCategoriesQuery = `*[_type == "productCategory"] | order(sortOrder asc, title.en asc) {
  "updatedAt": _updatedAt,
  title,
  "slug": slug.current,
  subtitle,
  "heroImageUrl": heroImage.asset->url,
  description,
  highlights[] {
    title,
    body
  },
  carouselItems[] {
    title,
    "coverImageUrl": coverImage.asset->url,
    description,
    customizedOption,
    details,
    "galleryImageUrls": gallery[].asset->url
  },
  seo {
    title,
    description,
    "imageUrl": image.asset->url
  }
}`;

export const skusQuery = `*[_type == "sku" && (!defined(productType->markets) || $market in productType->markets)] | order(code asc) {
  "updatedAt": _updatedAt,
  code,
  "slug": slug.current,
  "materialSlug": material->slug.current,
  "productTypeSlug": productType->slug.current,
  colorName,
  hex,
  "heroImageUrl": heroImage.asset->url,
  "swatchImageUrl": swatchImage.asset->url,
  "previewImageUrl": previewImage.asset->url,
  caseGallery[] {
    "imageUrl": image.asset->url,
    alt
  },
  summary,
  specs,
  certifications,
  downloads[] {
    title,
    description,
    type,
    "href": file.asset->url
  },
  seo {
    title,
    description,
    "imageUrl": image.asset->url
  }
}`;

export const projectsQuery = `*[_type == "projectCase"] | order(title.en asc) {
  "updatedAt": _updatedAt,
  title,
  "slug": slug.current,
  industry,
  "image": coverImage{
    asset,
    crop,
    hotspot
  },
  "imageUrl": coverImage.asset->url,
  "galleryImages": gallery[]{
    asset,
    crop,
    hotspot
  },
  "galleryImageUrls": gallery[].asset->url,
  summary,
  "materialSlug": relatedMaterial->slug.current,
  "linkedMaterials": linkedMaterials[]->{
    "slug": slug.current,
    name
  },
  "linkedArticles": linkedArticles[]->{
    "slug": slug.current,
    "materialSlug": material->slug.current,
    name
  },
  seo {
    title,
    description,
    "imageUrl": image.asset->url
  }
}`;

export const newsItemsQuery = `*[_type == "news"] | order(publishedAt desc, title.en asc) {
  "updatedAt": _updatedAt,
  title,
  "slug": slug.current,
  category,
  publishedAt,
  "imageUrl": coverImage.asset->url,
  summary,
  body,
  seo {
    title,
    description,
    "imageUrl": image.asset->url
  }
}`;

export const catalogsQuery = `*[_type == "catalog" && language == $locale] | order(title.en asc) {
  "updatedAt": _updatedAt,
  title,
  description,
  "href": pdf.asset->url
}`;
