import { chineseCopy } from "../../china/copy";
import { materialFaqs } from "@/content/material-faqs";
import { getNewsArticleContent } from "@/content/news-articles";
import { createDownloadGroups, downloadPageCopy, type DownloadPageSettings } from "@/content/downloads";
import { adaptDownloadPage, downloadPageQuery, type RawDownloadPage } from "./download-page";
import { cache } from "react";
import {
  aboutPageSettings as fallbackAboutPageSettings,
  catalogs as fallbackCatalogs,
  homePageSettings as fallbackHomePageSettings,
  productBusinessSettings as fallbackProductBusinessSettings,
  materialCategories as fallbackCategories,
  materials as fallbackMaterials,
  newsItems as fallbackNewsItems,
  productTypes as fallbackProductTypes,
  projectCases as fallbackProjects,
  skus as fallbackSkus,
  type AboutPageSettings,
  type Download,
  type HomePageSettings,
  type Material,
  type MaterialCategory,
  type NewsItem,
  type ProductType,
  type ProductBusinessSettings,
  type ProjectCase,
  type Sku
} from "@/lib/content";
import { productCategories as fallbackProductCategories, type ProductCategory } from "@/content/products/categories";
import { normalizeLocalizedBrandNames, type Locale } from "@/lib/locales";
import {
  applyJapaneseHomePageCopy,
  applyJapaneseMaterialCategoryCopy,
  applyJapaneseMaterialCopy,
  applyJapaneseProductCategoryCopy,
} from "@/lib/japanese-copy";
import { isLegacySkaiCollection, isSkaiProductType, legacySkaiSlugs } from "@/lib/skai-collections";
import {
  adaptAboutPageSettings,
  adaptCatalog,
  adaptHomePageSettings,
  adaptProductBusinessSettings,
  adaptMaterial,
  adaptMaterialCategory,
  adaptNewsItem,
  adaptProductCategory,
  adaptProductType,
  adaptProjectCase,
  adaptSku
} from "./adapters";
import { getSanityClient } from "./client";
import { getDeliveryMarket } from "../../china/delivery";
import {
  catalogsQuery,
  aboutPageSettingsQuery,
  homePageSettingsQuery,
  productBusinessSettingsQuery,
  materialCategoriesQuery,
  materialsQuery,
  newsItemsQuery,
  productCategoriesQuery,
  productTypesQuery,
  projectsQuery,
  skusQuery,
  skaiProductTypesQuery,
  skaiSkusQuery,
  type RawAboutPageSettings,
  type RawCatalog,
  type RawHomePageSettings,
  type RawProductBusinessSettings,
  type RawMaterial,
  type RawMaterialCategory,
  type RawNewsItem,
  type RawProductCategory,
  type RawProductType,
  type RawProjectCase,
  type RawSku
} from "./queries";

const leatherSpecDownloads: Record<string, Download> = {
  aida: {
    title: { zh: chineseCopy("Aida Spec Sheet"), en: "Aida Spec Sheet", ja: "Aida 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Aida leather."), en: "Technical specification PDF for Aida leather.", ja: "Aida レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/aida_spec_sheet.pdf",
    type: "technical"
  },
  "automotive-nappa": {
    title: { zh: chineseCopy("Automotive Nappa Spec Sheet"), en: "Automotive Nappa Spec Sheet", ja: "Automotive Nappa 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Automotive Nappa leather."), en: "Technical specification PDF for Automotive Nappa leather.", ja: "Automotive Nappa レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/automotive_nappa_spec_sheet.pdf",
    type: "technical"
  },
  capri: {
    title: { zh: chineseCopy("Capri Spec Sheet"), en: "Capri Spec Sheet", ja: "Capri 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Capri leather."), en: "Technical specification PDF for Capri leather.", ja: "Capri レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/capri_spec_sheet.pdf",
    type: "technical"
  },
  classic: {
    title: { zh: chineseCopy("Classic Spec Sheet"), en: "Classic Spec Sheet", ja: "Classic 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Classic leather."), en: "Technical specification PDF for Classic leather.", ja: "Classic レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/classic_spec_sheet.pdf",
    type: "technical"
  },
  heritage: {
    title: { zh: chineseCopy("Heritage Spec Sheet"), en: "Heritage Spec Sheet", ja: "Heritage 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Heritage leather."), en: "Technical specification PDF for Heritage leather.", ja: "Heritage レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/heritage_spec_sheet.pdf",
    type: "technical"
  },
  linea: {
    title: { zh: chineseCopy("Linea Spec Sheet"), en: "Linea Spec Sheet", ja: "Linea 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Linea leather."), en: "Technical specification PDF for Linea leather.", ja: "Linea レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/linea_spec_sheet.pdf",
    type: "technical"
  },
  luna: {
    title: { zh: chineseCopy("Luna Spec Sheet"), en: "Luna Spec Sheet", ja: "Luna 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Luna leather."), en: "Technical specification PDF for Luna leather.", ja: "Luna レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/luna_spec_sheet.pdf",
    type: "technical"
  },
  roma: {
    title: { zh: chineseCopy("Roma Spec Sheet"), en: "Roma Spec Sheet", ja: "Roma 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Roma leather."), en: "Technical specification PDF for Roma leather.", ja: "Roma レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/roma_spec_sheet.pdf",
    type: "technical"
  },
  seta: {
    title: { zh: chineseCopy("Seta Spec Sheet"), en: "Seta Spec Sheet", ja: "Seta 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Seta leather."), en: "Technical specification PDF for Seta leather.", ja: "Seta レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/seta_spec_sheet.pdf",
    type: "technical"
  },
  tuscania: {
    title: { zh: chineseCopy("Tuscania Spec Sheet"), en: "Tuscania Spec Sheet", ja: "Tuscania 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Tuscania leather."), en: "Technical specification PDF for Tuscania leather.", ja: "Tuscania レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/tuscania_spec_sheet.pdf",
    type: "technical"
  },
  verona: {
    title: { zh: chineseCopy("Verona Spec Sheet"), en: "Verona Spec Sheet", ja: "Verona 仕様書" },
    description: { zh: chineseCopy("Technical specification PDF for Verona leather."), en: "Technical specification PDF for Verona leather.", ja: "Verona レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/verona_spec_sheet.pdf",
    type: "technical"
  }
};

const alcantaraCareDownload: Download = {
  title: { zh: chineseCopy("Alcantara Material Maintenance Guide"), en: "Alcantara Material Maintenance Guide", ja: "Alcantara 素材メンテナンスガイド" },
  description: {
    zh: chineseCopy("Recommended maintenance and cleaning instructions for Alcantara materials."), en: "Recommended maintenance and cleaning instructions for Alcantara materials.",
    ja: "Alcantara 素材の推奨メンテナンスおよび清掃手順。"
  },
  href: "/uploads/spec/Alcantara/Instructions-for-maintenance-of-alcantara-material.pdf",
  type: "care"
};

const alcantaraSwatchDownloads: Record<"automotive" | "consumerElectronics" | "indoor" | "outdoorExo", Download> = {
  automotive: {
    title: { zh: chineseCopy("Alcantara Automotive Colors"), en: "Alcantara Automotive Colors", ja: "Alcantara 自動車向けカラー" },
    description: {
      zh: chineseCopy("Colour reference for Alcantara automotive programs."), en: "Colour reference for Alcantara automotive programs.",
      ja: "Alcantara 自動車用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-automotive-colors.pdf",
    type: "catalog"
  },
  consumerElectronics: {
    title: { zh: chineseCopy("Alcantara Consumer Electronics Colors"), en: "Alcantara Consumer Electronics Colors", ja: "Alcantara コンシューマーエレクトロニクス向けカラー" },
    description: {
      zh: chineseCopy("Colour reference for Alcantara consumer electronics applications."), en: "Colour reference for Alcantara consumer electronics applications.",
      ja: "Alcantara コンシューマーエレクトロニクス用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-consumer-electronics-colors.pdf",
    type: "catalog"
  },
  indoor: {
    title: { zh: chineseCopy("Alcantara Interiors, Marine & Aviation Indoor Colors"), en: "Alcantara Interiors, Marine & Aviation Indoor Colors", ja: "Alcantara インテリア、マリン、航空機インドアカラー" },
    description: {
      zh: chineseCopy("Colour reference for Alcantara indoor interiors, marine, and aviation applications."), en: "Colour reference for Alcantara indoor interiors, marine, and aviation applications.",
      ja: "Alcantara のインドアインテリア、マリン、航空機用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-interiors-marine-aviation-indoor.pdf",
    type: "catalog"
  },
  outdoorExo: {
    title: { zh: chineseCopy("Alcantara Interiors, Marine Outdoor EXO Colors"), en: "Alcantara Interiors, Marine Outdoor EXO Colors", ja: "Alcantara インテリア、マリンアウトドア EXO カラー" },
    description: {
      zh: chineseCopy("Colour reference for Alcantara outdoor EXO and marine exterior applications."), en: "Colour reference for Alcantara outdoor EXO and marine exterior applications.",
      ja: "Alcantara EXO とマリン屋外用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-interiors-marine-outdoor-exo.pdf",
    type: "catalog"
  }
};

const alcantaraDownloadSets: Record<string, Download[]> = {
  "alcantara-panel": [
    {
      title: { zh: chineseCopy("Alcantara Panel Spec Sheet"), en: "Alcantara Panel Spec Sheet", ja: "Alcantara Panel 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara Panel."), en: "Technical specification PDF for Alcantara Panel.", ja: "Alcantara Panel の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5012 - Pannel.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.automotive,
    alcantaraCareDownload
  ],
  "alcantara-cover": [
    {
      title: { zh: chineseCopy("Alcantara COVER Spec Sheet"), en: "Alcantara COVER Spec Sheet", ja: "Alcantara COVER 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara COVER."), en: "Technical specification PDF for Alcantara COVER.", ja: "Alcantara COVER の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5205 - COVER Spec sheet.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.automotive,
    alcantaraCareDownload
  ],
  "alcantara-master": [
    {
      title: { zh: chineseCopy("Alcantara Master Spec Sheet"), en: "Alcantara Master Spec Sheet", ja: "Alcantara Master 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara Master."), en: "Technical specification PDF for Alcantara Master.", ja: "Alcantara Master の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5015 ( BP ) Regular.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.indoor,
    alcantaraCareDownload
  ],
  "alcantara-exo": [
    {
      title: { zh: chineseCopy("Alcantara EXO Spec Sheet"), en: "Alcantara EXO Spec Sheet", ja: "Alcantara EXO 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara EXO."), en: "Technical specification PDF for Alcantara EXO.", ja: "Alcantara EXO の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5143 - EXO.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.outdoorExo,
    alcantaraCareDownload
  ],
  "alcantara-04": [
    {
      title: { zh: chineseCopy("Alcantara 5010, 0.4 Thin Spec Sheet"), en: "Alcantara 5010, 0.4 Thin Spec Sheet", ja: "Alcantara 5010, 0.4 Thin 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara 0.4 Thin."), en: "Technical specification PDF for Alcantara 0.4 Thin.", ja: "Alcantara 0.4 Thin の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5010 - 0.4 Thin 5010 Datasheet(1).pdf",
      type: "technical"
    },
    {
      title: { zh: chineseCopy("Alcantara 5030, 0.4 Thin ECG Spec Sheet"), en: "Alcantara 5030, 0.4 Thin ECG Spec Sheet", ja: "Alcantara 5030, 0.4 Thin ECG 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara 0.4 Thin ECG."), en: "Technical specification PDF for Alcantara 0.4 Thin ECG.", ja: "Alcantara 0.4 Thin ECG の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5030 - 0.4 Thin ECG.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.consumerElectronics,
    alcantaraCareDownload
  ],
  "alcantara-multilayer": [
    {
      title: { zh: chineseCopy("Alcantara Multilayer Spec Sheet"), en: "Alcantara Multilayer Spec Sheet", ja: "Alcantara Multilayer 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara Multilayer."), en: "Technical specification PDF for Alcantara Multilayer.", ja: "Alcantara Multilayer の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5170 Multilayer.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.indoor,
    alcantaraCareDownload
  ],
  "alcantara-avant": [
    {
      title: { zh: chineseCopy("Alcantara Avant Spec Sheet"), en: "Alcantara Avant Spec Sheet", ja: "Alcantara Avant 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara Avant."), en: "Technical specification PDF for Alcantara Avant.", ja: "Alcantara Avant の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5466 - Avant.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.indoor,
    alcantaraCareDownload
  ],
  "alcantara-board-fr": [
    {
      title: { zh: chineseCopy("Alcantara Bord FR 5056 Spec Sheet"), en: "Alcantara Bord FR 5056 Spec Sheet", ja: "Alcantara Bord FR 5056 仕様書" },
      description: { zh: chineseCopy("Technical specification PDF for Alcantara Bord FR 5056."), en: "Technical specification PDF for Alcantara Bord FR 5056.", ja: "Alcantara Bord FR 5056 の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara Bord FR 5056.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.indoor,
    alcantaraCareDownload
  ]
};

export function withLocalAlcantaraDownloads(productTypes: ProductType[]): ProductType[] {
  return productTypes.map((productType) => {
    const downloads = alcantaraDownloadSets[productType.slug];

    if (productType.materialSlug !== "alcantara" || !downloads) {
      return productType;
    }

    return {
      ...productType,
      downloads
    };
  });
}

export function withLocalLeatherSpecDownloads(productTypes: ProductType[]): ProductType[] {
  return productTypes.map((productType) => {
    const specDownload = leatherSpecDownloads[productType.slug];

    if (productType.materialSlug !== "leather" || !specDownload) {
      return productType;
    }

    return {
      ...productType,
      downloads: [specDownload]
    };
  });
}

function isSanityConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  return Boolean(projectId && projectId !== "replace-me");
}

async function fetchOrFallback<Raw, Value>(
  query: string,
  params: Record<string, string>,
  fallback: Value[],
  adapter: (raw: Raw) => Value
): Promise<Value[]> {
  if (!isSanityConfigured()) {
    return normalizeLocalizedBrandNames(fallback);
  }

  try {
    const results = await getSanityClient().fetch<Raw[]>(query, params);
    if (!results || results.length === 0) {
      return normalizeLocalizedBrandNames(fallback);
    }
    return normalizeLocalizedBrandNames(results.map((raw) => adapter(raw)));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity fetch failed; using local fixture content.", error);
    return normalizeLocalizedBrandNames(fallback);
  }
}

async function fetchAndMergeBySlug<Raw, Value extends { slug: string }>(
  query: string,
  params: Record<string, string | string[]>,
  fallback: Value[],
  adapter: (raw: Raw) => Value,
  options: { includeFallbackRecords?: boolean; fallbackOnEmpty?: boolean; fresh?: boolean } = {}
): Promise<Value[]> {
  const { includeFallbackRecords = true, fallbackOnEmpty = true, fresh = false } = options;

  if (!isSanityConfigured()) {
    return normalizeLocalizedBrandNames(fallback);
  }

  try {
    const client = fresh ? getSanityClient().withConfig({ useCdn: false, perspective: "published" }) : getSanityClient();
    const results = await client.fetch<Raw[]>(query, params, fresh ? { cache: "no-store" } : undefined);
    if (!results || results.length === 0) {
      return normalizeLocalizedBrandNames(fallbackOnEmpty ? fallback : []);
    }

    const merged = new Map(includeFallbackRecords ? fallback.map((item) => [item.slug, item]) : []);
    for (const item of results.map((raw) => adapter(raw))) {
      const existing = merged.get(item.slug) ?? fallback.find((fallbackItem) => fallbackItem.slug === item.slug);
      if (existing) {
        const existingAny = existing as Record<string, unknown>;
        const itemAny = item as Record<string, unknown>;
        // Prefer fallback image assets when they exist (locally managed)
        for (const field of ["image", "swatchImage", "caseGallery"] as const) {
          const fbVal = existingAny[field];
          if (fbVal !== undefined && fbVal !== null && fbVal !== "") {
            if (field === "caseGallery") {
              if (Array.isArray(fbVal) && fbVal.length > 0) itemAny[field] = fbVal;
            } else {
              itemAny[field] = fbVal;
            }
          }
        }
      }
      merged.set(item.slug, item);
    }
    return normalizeLocalizedBrandNames([...merged.values()]);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity fetch failed; using local fixture content.", error);
    return normalizeLocalizedBrandNames(fallback);
  }
}

export async function loadMaterialCategories(): Promise<MaterialCategory[]> {
  return fetchAndMergeBySlug<RawMaterialCategory, MaterialCategory>(
    materialCategoriesQuery, {}, applyJapaneseMaterialCategoryCopy(fallbackCategories), adaptMaterialCategory,
  );
}

export async function loadHomePageSettings(): Promise<HomePageSettings> {
  // Keep editable editorial copy literal; retain existing brand styling for hero/explore only.
  const normalizeHomeSettings = (settings: HomePageSettings): HomePageSettings => ({
    ...settings, hero: normalizeLocalizedBrandNames(settings.hero), explore: normalizeLocalizedBrandNames(settings.explore)
  });
  const fallback = applyJapaneseHomePageCopy(fallbackHomePageSettings);
  if (!isSanityConfigured()) {
    return normalizeHomeSettings(fallback);
  }

  try {
    // Read published homepage edits directly so locale previews do not retain stale copy.
    const result = await getSanityClient()
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<RawHomePageSettings>(homePageSettingsQuery, {}, { cache: "no-store" });
    if (!result) {
      return normalizeHomeSettings(fallback);
    }
    return normalizeHomeSettings(adaptHomePageSettings(result, fallback));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity homepage fetch failed; using local fixture content.", error);
    return normalizeHomeSettings(fallback);
  }
}

export async function loadAboutPageSettings(): Promise<AboutPageSettings> {
  // Editorial body copy must retain the spelling saved in Studio (including brand names).
  // Keep the existing normalization only for metadata and hero text.
  const normalizeAboutSettings = (settings: AboutPageSettings): AboutPageSettings => ({
    ...settings,
    seo: normalizeLocalizedBrandNames(settings.seo),
    heroAlt: normalizeLocalizedBrandNames(settings.heroAlt),
    heroTitle: normalizeLocalizedBrandNames(settings.heroTitle),
    exploreLabel: normalizeLocalizedBrandNames(settings.exploreLabel)
  });
  if (!isSanityConfigured()) {
    return normalizeAboutSettings(fallbackAboutPageSettings);
  }

  try {
    const result = await getSanityClient().withConfig({ useCdn: false }).fetch<RawAboutPageSettings>(aboutPageSettingsQuery);
    if (!result) {
      return normalizeAboutSettings(fallbackAboutPageSettings);
    }
    return normalizeAboutSettings(adaptAboutPageSettings(result));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity about page fetch failed; using local fixture content.", error);
    return normalizeAboutSettings(fallbackAboutPageSettings);
  }
}

export async function loadProductBusinessSettings(): Promise<ProductBusinessSettings> {
  if (!isSanityConfigured()) {
    return normalizeLocalizedBrandNames(fallbackProductBusinessSettings);
  }

  try {
    const result = await getSanityClient().fetch<RawProductBusinessSettings>(productBusinessSettingsQuery);
    if (!result) {
      return normalizeLocalizedBrandNames(fallbackProductBusinessSettings);
    }
    return normalizeLocalizedBrandNames(adaptProductBusinessSettings(result));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity product business information fetch failed; using local fixture content.", error);
    return normalizeLocalizedBrandNames(fallbackProductBusinessSettings);
  }
}

export async function loadMaterials(): Promise<Material[]> {
  const fallback = applyJapaneseMaterialCopy(fallbackMaterials).map(item => ({ ...item, faq: materialFaqs[item.slug] }));
  return fetchAndMergeBySlug<RawMaterial, Material>(
    materialsQuery, {}, fallback,
    (raw) => adaptMaterial(raw, fallback.find((item) => item.slug === raw.slug)),
  );
}

export const loadProductTypes = cache(async (): Promise<ProductType[]> => {
  const market = await getDeliveryMarket();
  const fallback = withLocalLeatherSpecDownloads(withLocalAlcantaraDownloads(fallbackProductTypes.filter((item) => !isSkaiProductType(item))));
  const [productTypes, globalSkai] = await Promise.all([
    fetchAndMergeBySlug<RawProductType, ProductType>(productTypesQuery, { market }, fallback, (raw) => adaptProductType(raw, fallback.find((item) => item.slug === raw.slug)?.downloads), {
    includeFallbackRecords: true,
    fallbackOnEmpty: true,
    fresh: true
    }),
    market === "global" ? Promise.resolve([] as ProductType[]) : fetchAndMergeBySlug<RawProductType, ProductType>(skaiProductTypesQuery, { skaiSlugs: [...legacySkaiSlugs] }, [], adaptProductType, { fresh: true, fallbackOnEmpty: false })
  ]);
  const merged = new Map([...productTypes, ...globalSkai].map((productType) => [productType.slug, productType]));
  return normalizeLocalizedBrandNames([...merged.values()]);
});

export async function loadProductCategories(): Promise<ProductCategory[]> {
  const fallback = applyJapaneseProductCategoryCopy(fallbackProductCategories);
  return fetchAndMergeBySlug<RawProductCategory, ProductCategory>(
    productCategoriesQuery, {}, fallback,
    (raw) => adaptProductCategory(raw, fallback.find((item) => item.slug === raw.slug)),
  );
}

export async function loadProductCategory(slug: string): Promise<ProductCategory | undefined> {
  const productCategories = await loadProductCategories();
  return productCategories.find((category) => category.slug === slug);
}

export async function loadMaterial(slug: string): Promise<Material | undefined> {
  const materials = await loadMaterials();
  return materials.find((material) => material.slug === slug);
}

export async function loadProductTypesForMaterial(materialSlug: string): Promise<ProductType[]> {
  const productTypes = await loadProductTypes();
  return productTypes.filter((productType) => productType.materialSlug === materialSlug);
}

export async function loadProductType(materialSlug: string, productTypeSlug: string): Promise<ProductType | undefined> {
  const productTypes = await loadProductTypesForMaterial(materialSlug);
  return productTypes.find((productType) => productType.slug === productTypeSlug);
}

export const loadSkus = cache(async (locale?:Locale): Promise<Sku[]> => {
  const market = await getDeliveryMarket(locale);
  const skaiFallbackSlugs = new Set(fallbackProductTypes.filter(isSkaiProductType).map((productType) => productType.slug));
  const localSkus = fallbackSkus.filter((sku) => !isLegacySkaiCollection(sku.materialSlug, sku.productTypeSlug)
    && !(sku.materialSlug === "vegan-leather" && skaiFallbackSlugs.has(sku.productTypeSlug)));
  const [skus, globalSkai] = await Promise.all([
    fetchAndMergeBySlug<RawSku, Sku>(skusQuery, { market }, localSkus, adaptSku, {
    includeFallbackRecords: true,
    fallbackOnEmpty: true,
    fresh: true
    }),
    market === "global" ? Promise.resolve([] as Sku[]) : fetchAndMergeBySlug<RawSku, Sku>(skaiSkusQuery, { skaiSlugs: [...legacySkaiSlugs] }, [], adaptSku, { fresh: true, fallbackOnEmpty: false })
  ]);
  return normalizeLocalizedBrandNames([...new Map([...skus, ...globalSkai].map((sku) => [sku.slug, sku])).values()]);
});

export async function loadSkusForMaterial(materialSlug: string): Promise<Sku[]> {
  const skus = await loadSkus();
  return skus.filter((sku) => sku.materialSlug === materialSlug);
}

export async function loadSkusForProductType(materialSlug: string, productTypeSlug: string): Promise<Sku[]> {
  const skus = await loadSkusForMaterial(materialSlug);
  return skus.filter((sku) => sku.productTypeSlug === productTypeSlug);
}

export async function loadSku(materialSlug: string, productTypeSlug: string, skuSlug: string): Promise<Sku | undefined> {
  const skus = await loadSkusForProductType(materialSlug, productTypeSlug);
  return skus.find((sku) => sku.slug === skuSlug);
}

export async function loadLegacySku(materialSlug: string, skuSlug: string): Promise<Sku | undefined> {
  const skus = await loadSkusForMaterial(materialSlug);
  return skus.find((sku) => sku.slug === skuSlug);
}

export async function loadProjects(): Promise<ProjectCase[]> {
  return fetchAndMergeBySlug<RawProjectCase, ProjectCase>(projectsQuery, {}, fallbackProjects, adaptProjectCase);
}

export async function loadProjectsForMaterial(materialSlug: string): Promise<ProjectCase[]> {
  const projects = await loadProjects();
  return projects.filter(
    (project) =>
      project.materialSlug === materialSlug ||
      project.linkedMaterials.some((material) => material.slug === materialSlug) ||
      project.linkedArticles.some((article) => article.materialSlug === materialSlug)
  );
}

export async function loadProject(slug: string): Promise<ProjectCase | undefined> {
  const projects = await loadProjects();
  return projects.find((project) => project.slug === slug);
}

export async function loadNewsItems(): Promise<NewsItem[]> {
  const fallback = fallbackNewsItems.map(item => ({ ...item, articleContent: { zh: chineseCopy(getNewsArticleContent(item.slug, "en")), en: getNewsArticleContent(item.slug, "en"), ja: getNewsArticleContent(item.slug, "ja") } }));
  const items = await fetchAndMergeBySlug<RawNewsItem, NewsItem>(newsItemsQuery, {}, fallback, adaptNewsItem, { includeFallbackRecords: false, fallbackOnEmpty: false });
  return items
    .filter((item) => item.slug !== "new-material-study")
    .sort((left, right) => right.date.localeCompare(left.date));
}

export async function loadNewsItem(slug: string): Promise<NewsItem | undefined> {
  const items = await loadNewsItems();
  return items.find((item) => item.slug === slug);
}

export async function loadCatalogs(locale: Locale): Promise<Download[]> {
  return fetchOrFallback<RawCatalog, Download>(catalogsQuery, { locale: locale === "zh" ? "en" : locale }, fallbackCatalogs, adaptCatalog);
}

export async function loadDownloadPageSettings(locale: Locale): Promise<DownloadPageSettings> {
  if (isSanityConfigured()) {
    const raw = await getSanityClient().fetch<RawDownloadPage | null>(downloadPageQuery);
    if (raw) return normalizeLocalizedBrandNames(adaptDownloadPage(raw));
  }
  const [catalogs, productTypes] = await Promise.all([loadCatalogs(locale), loadProductTypes()]);
  return { ...downloadPageCopy, groups: createDownloadGroups(catalogs, productTypes.flatMap(item => item.downloads)) };
}
