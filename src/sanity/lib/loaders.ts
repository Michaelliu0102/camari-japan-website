import {
  aboutPageSettings as fallbackAboutPageSettings,
  catalogs as fallbackCatalogs,
  homePageSettings as fallbackHomePageSettings,
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
  type ProjectCase,
  type Sku
} from "@/lib/content";
import { productCategories as fallbackProductCategories, type ProductCategory } from "@/content/products/categories";
import { normalizeLocalizedBrandNames, type Locale } from "@/lib/locales";
import {
  applyJapaneseHomePageCopy,
  applyJapaneseMaterialCategoryCopy,
  applyJapaneseMaterialCopy,
} from "@/lib/japanese-copy";
import { loadSkaiVinylProductTypes, loadSkaiVinylSkus } from "@/lib/skai-vinyl";
import {
  adaptAboutPageSettings,
  adaptCatalog,
  adaptHomePageSettings,
  adaptMaterial,
  adaptMaterialCategory,
  adaptNewsItem,
  adaptProductCategory,
  adaptProductType,
  adaptProjectCase,
  adaptSku
} from "./adapters";
import { getSanityClient } from "./client";
import { getSanityMarket } from "./market";
import {
  catalogsQuery,
  aboutPageSettingsQuery,
  homePageSettingsQuery,
  materialCategoriesQuery,
  materialsQuery,
  newsItemsQuery,
  productCategoriesQuery,
  productTypesQuery,
  projectsQuery,
  skusQuery,
  type RawAboutPageSettings,
  type RawCatalog,
  type RawHomePageSettings,
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
    title: { en: "Aida Spec Sheet", ja: "Aida 仕様書" },
    description: { en: "Technical specification PDF for Aida leather.", ja: "Aida レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/aida_spec_sheet.pdf",
    type: "technical"
  },
  "automotive-nappa": {
    title: { en: "Automotive Nappa Spec Sheet", ja: "Automotive Nappa 仕様書" },
    description: { en: "Technical specification PDF for Automotive Nappa leather.", ja: "Automotive Nappa レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/automotive_nappa_spec_sheet.pdf",
    type: "technical"
  },
  capri: {
    title: { en: "Capri Spec Sheet", ja: "Capri 仕様書" },
    description: { en: "Technical specification PDF for Capri leather.", ja: "Capri レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/capri_spec_sheet.pdf",
    type: "technical"
  },
  classic: {
    title: { en: "Classic Spec Sheet", ja: "Classic 仕様書" },
    description: { en: "Technical specification PDF for Classic leather.", ja: "Classic レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/classic_spec_sheet.pdf",
    type: "technical"
  },
  heritage: {
    title: { en: "Heritage Spec Sheet", ja: "Heritage 仕様書" },
    description: { en: "Technical specification PDF for Heritage leather.", ja: "Heritage レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/heritage_spec_sheet.pdf",
    type: "technical"
  },
  linea: {
    title: { en: "Linea Spec Sheet", ja: "Linea 仕様書" },
    description: { en: "Technical specification PDF for Linea leather.", ja: "Linea レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/linea_spec_sheet.pdf",
    type: "technical"
  },
  luna: {
    title: { en: "Luna Spec Sheet", ja: "Luna 仕様書" },
    description: { en: "Technical specification PDF for Luna leather.", ja: "Luna レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/luna_spec_sheet.pdf",
    type: "technical"
  },
  roma: {
    title: { en: "Roma Spec Sheet", ja: "Roma 仕様書" },
    description: { en: "Technical specification PDF for Roma leather.", ja: "Roma レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/roma_spec_sheet.pdf",
    type: "technical"
  },
  seta: {
    title: { en: "Seta Spec Sheet", ja: "Seta 仕様書" },
    description: { en: "Technical specification PDF for Seta leather.", ja: "Seta レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/seta_spec_sheet.pdf",
    type: "technical"
  },
  tuscania: {
    title: { en: "Tuscania Spec Sheet", ja: "Tuscania 仕様書" },
    description: { en: "Technical specification PDF for Tuscania leather.", ja: "Tuscania レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/tuscania_spec_sheet.pdf",
    type: "technical"
  },
  verona: {
    title: { en: "Verona Spec Sheet", ja: "Verona 仕様書" },
    description: { en: "Technical specification PDF for Verona leather.", ja: "Verona レザーの技術仕様PDF。" },
    href: "/uploads/spec/leather/verona_spec_sheet.pdf",
    type: "technical"
  }
};

const alcantaraCareDownload: Download = {
  title: { en: "Alcantara Material Maintenance Guide", ja: "Alcantara 素材メンテナンスガイド" },
  description: {
    en: "Recommended maintenance and cleaning instructions for Alcantara materials.",
    ja: "Alcantara 素材の推奨メンテナンスおよび清掃手順。"
  },
  href: "/uploads/spec/Alcantara/Instructions-for-maintenance-of-alcantara-material.pdf",
  type: "care"
};

const alcantaraSwatchDownloads: Record<"automotive" | "consumerElectronics" | "indoor" | "outdoorExo", Download> = {
  automotive: {
    title: { en: "Alcantara Automotive Colors", ja: "Alcantara 自動車向けカラー" },
    description: {
      en: "Colour reference for Alcantara automotive programs.",
      ja: "Alcantara 自動車用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-automotive-colors.pdf",
    type: "catalog"
  },
  consumerElectronics: {
    title: { en: "Alcantara Consumer Electronics Colors", ja: "Alcantara コンシューマーエレクトロニクス向けカラー" },
    description: {
      en: "Colour reference for Alcantara consumer electronics applications.",
      ja: "Alcantara コンシューマーエレクトロニクス用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-consumer-electronics-colors.pdf",
    type: "catalog"
  },
  indoor: {
    title: { en: "Alcantara Interiors, Marine & Aviation Indoor Colors", ja: "Alcantara インテリア、マリン、航空機インドアカラー" },
    description: {
      en: "Colour reference for Alcantara indoor interiors, marine, and aviation applications.",
      ja: "Alcantara のインドアインテリア、マリン、航空機用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-interiors-marine-aviation-indoor.pdf",
    type: "catalog"
  },
  outdoorExo: {
    title: { en: "Alcantara Interiors, Marine Outdoor EXO Colors", ja: "Alcantara インテリア、マリンアウトドア EXO カラー" },
    description: {
      en: "Colour reference for Alcantara outdoor EXO and marine exterior applications.",
      ja: "Alcantara EXO とマリン屋外用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-interiors-marine-outdoor-exo.pdf",
    type: "catalog"
  }
};

const alcantaraDownloadSets: Record<string, Download[]> = {
  "alcantara-panel": [
    {
      title: { en: "Alcantara Panel Spec Sheet", ja: "Alcantara Panel 仕様書" },
      description: { en: "Technical specification PDF for Alcantara Panel.", ja: "Alcantara Panel の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5012 - Pannel.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.automotive,
    alcantaraCareDownload
  ],
  "alcantara-cover": [
    {
      title: { en: "Alcantara COVER Spec Sheet", ja: "Alcantara COVER 仕様書" },
      description: { en: "Technical specification PDF for Alcantara COVER.", ja: "Alcantara COVER の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5205 - COVER Spec sheet.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.automotive,
    alcantaraCareDownload
  ],
  "alcantara-master": [
    {
      title: { en: "Alcantara Master Spec Sheet", ja: "Alcantara Master 仕様書" },
      description: { en: "Technical specification PDF for Alcantara Master.", ja: "Alcantara Master の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5015 ( BP ) Regular.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.indoor,
    alcantaraCareDownload
  ],
  "alcantara-exo": [
    {
      title: { en: "Alcantara EXO Spec Sheet", ja: "Alcantara EXO 仕様書" },
      description: { en: "Technical specification PDF for Alcantara EXO.", ja: "Alcantara EXO の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5143 - EXO.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.outdoorExo,
    alcantaraCareDownload
  ],
  "alcantara-04": [
    {
      title: { en: "Alcantara 5010, 0.4 Thin Spec Sheet", ja: "Alcantara 5010, 0.4 Thin 仕様書" },
      description: { en: "Technical specification PDF for Alcantara 0.4 Thin.", ja: "Alcantara 0.4 Thin の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5010 - 0.4 Thin 5010 Datasheet(1).pdf",
      type: "technical"
    },
    {
      title: { en: "Alcantara 5030, 0.4 Thin ECG Spec Sheet", ja: "Alcantara 5030, 0.4 Thin ECG 仕様書" },
      description: { en: "Technical specification PDF for Alcantara 0.4 Thin ECG.", ja: "Alcantara 0.4 Thin ECG の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5030 - 0.4 Thin ECG.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.consumerElectronics,
    alcantaraCareDownload
  ],
  "alcantara-multilayer": [
    {
      title: { en: "Alcantara Multilayer Spec Sheet", ja: "Alcantara Multilayer 仕様書" },
      description: { en: "Technical specification PDF for Alcantara Multilayer.", ja: "Alcantara Multilayer の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5170 Multilayer.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.indoor,
    alcantaraCareDownload
  ],
  "alcantara-avant": [
    {
      title: { en: "Alcantara Avant Spec Sheet", ja: "Alcantara Avant 仕様書" },
      description: { en: "Technical specification PDF for Alcantara Avant.", ja: "Alcantara Avant の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara 5466 - Avant.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.indoor,
    alcantaraCareDownload
  ],
  "alcantara-board-fr": [
    {
      title: { en: "Alcantara Bord FR 5056 Spec Sheet", ja: "Alcantara Bord FR 5056 仕様書" },
      description: { en: "Technical specification PDF for Alcantara Bord FR 5056.", ja: "Alcantara Bord FR 5056 の技術仕様PDF。" },
      href: "/uploads/spec/Alcantara/Alcantara Bord FR 5056.pdf",
      type: "technical"
    },
    alcantaraSwatchDownloads.indoor,
    alcantaraCareDownload
  ]
};

function withLocalAlcantaraDownloads(productTypes: ProductType[]): ProductType[] {
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

function withLocalLeatherSpecDownloads(productTypes: ProductType[]): ProductType[] {
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
    return normalizeLocalizedBrandNames(results.map(adapter));
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
  params: Record<string, string>,
  fallback: Value[],
  adapter: (raw: Raw) => Value,
  options: { includeFallbackRecords?: boolean; fallbackOnEmpty?: boolean } = {}
): Promise<Value[]> {
  const { includeFallbackRecords = true, fallbackOnEmpty = true } = options;

  if (!isSanityConfigured()) {
    return normalizeLocalizedBrandNames(fallback);
  }

  try {
    const results = await getSanityClient().fetch<Raw[]>(query, params);
    if (!results || results.length === 0) {
      return normalizeLocalizedBrandNames(fallbackOnEmpty ? fallback : []);
    }

    const merged = new Map(includeFallbackRecords ? fallback.map((item) => [item.slug, item]) : []);
    for (const item of results.map(adapter)) {
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
  const categories = await fetchAndMergeBySlug<RawMaterialCategory, MaterialCategory>(materialCategoriesQuery, {}, fallbackCategories, adaptMaterialCategory);
  return applyJapaneseMaterialCategoryCopy(categories);
}

export async function loadHomePageSettings(): Promise<HomePageSettings> {
  if (!isSanityConfigured()) {
    return applyJapaneseHomePageCopy(normalizeLocalizedBrandNames(fallbackHomePageSettings));
  }

  try {
    const result = await getSanityClient().fetch<RawHomePageSettings>(homePageSettingsQuery);
    if (!result) {
      return applyJapaneseHomePageCopy(normalizeLocalizedBrandNames(fallbackHomePageSettings));
    }
    return applyJapaneseHomePageCopy(normalizeLocalizedBrandNames(adaptHomePageSettings(result)));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity homepage fetch failed; using local fixture content.", error);
    return applyJapaneseHomePageCopy(normalizeLocalizedBrandNames(fallbackHomePageSettings));
  }
}

export async function loadAboutPageSettings(): Promise<AboutPageSettings> {
  if (!isSanityConfigured()) {
    return normalizeLocalizedBrandNames(fallbackAboutPageSettings);
  }

  try {
    const result = await getSanityClient().withConfig({ useCdn: false }).fetch<RawAboutPageSettings>(aboutPageSettingsQuery);
    if (!result) {
      return normalizeLocalizedBrandNames(fallbackAboutPageSettings);
    }
    return normalizeLocalizedBrandNames(adaptAboutPageSettings(result));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity about page fetch failed; using local fixture content.", error);
    return normalizeLocalizedBrandNames(fallbackAboutPageSettings);
  }
}

export async function loadMaterials(): Promise<Material[]> {
  const materials = await fetchAndMergeBySlug<RawMaterial, Material>(materialsQuery, {}, fallbackMaterials, adaptMaterial);
  return applyJapaneseMaterialCopy(materials);
}

export async function loadProductTypes(): Promise<ProductType[]> {
  const market = getSanityMarket();
  const productTypes = await fetchAndMergeBySlug<RawProductType, ProductType>(productTypesQuery, { market }, fallbackProductTypes, adaptProductType, {
    includeFallbackRecords: true,
    fallbackOnEmpty: true
  });
  const skaiProductTypes = await loadSkaiVinylProductTypes();
  const merged = new Map(productTypes.map((productType) => [productType.slug, productType]));

  for (const productType of skaiProductTypes) {
    merged.set(productType.slug, productType);
  }

  return normalizeLocalizedBrandNames(
    withLocalLeatherSpecDownloads(withLocalAlcantaraDownloads([...merged.values()])),
  );
}

export async function loadProductCategories(): Promise<ProductCategory[]> {
  return fetchAndMergeBySlug<RawProductCategory, ProductCategory>(productCategoriesQuery, {}, fallbackProductCategories, adaptProductCategory);
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

export async function loadSkus(): Promise<Sku[]> {
  const market = getSanityMarket();
  const skus = await fetchAndMergeBySlug<RawSku, Sku>(skusQuery, { market }, fallbackSkus, adaptSku, {
    includeFallbackRecords: true,
    fallbackOnEmpty: true
  });
  const skaiSkus = await loadSkaiVinylSkus();
  const merged = new Map(skus.map((sku) => [sku.slug, sku]));

  for (const sku of skaiSkus) {
    merged.set(sku.slug, sku);
  }

  return normalizeLocalizedBrandNames([...merged.values()]);
}

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
  const items = await fetchAndMergeBySlug<RawNewsItem, NewsItem>(newsItemsQuery, {}, fallbackNewsItems, adaptNewsItem);
  return items
    .filter((item) => item.slug !== "new-material-study")
    .sort((left, right) => right.date.localeCompare(left.date));
}

export async function loadNewsItem(slug: string): Promise<NewsItem | undefined> {
  const items = await loadNewsItems();
  return items.find((item) => item.slug === slug);
}

export async function loadCatalogs(locale: Locale): Promise<Download[]> {
  return fetchOrFallback<RawCatalog, Download>(catalogsQuery, { locale }, fallbackCatalogs, adaptCatalog);
}
