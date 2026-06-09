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
import type { Locale } from "@/lib/locales";
import {
  adaptAboutPageSettings,
  adaptCatalog,
  adaptHomePageSettings,
  adaptMaterial,
  adaptMaterialCategory,
  adaptNewsItem,
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
  productTypesQuery,
  projectsQuery,
  skusQuery,
  type RawAboutPageSettings,
  type RawCatalog,
  type RawHomePageSettings,
  type RawMaterial,
  type RawMaterialCategory,
  type RawNewsItem,
  type RawProductType,
  type RawProjectCase,
  type RawSku
} from "./queries";

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
    return fallback;
  }

  try {
    const results = await getSanityClient().fetch<Raw[]>(query, params);
    if (!results || results.length === 0) {
      return fallback;
    }
    return results.map(adapter);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity fetch failed; using local fixture content.", error);
    return fallback;
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
    return fallback;
  }

  try {
    const results = await getSanityClient().fetch<Raw[]>(query, params);
    if (!results || results.length === 0) {
      return fallbackOnEmpty ? fallback : [];
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
    return [...merged.values()];
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity fetch failed; using local fixture content.", error);
    return fallback;
  }
}

export async function loadMaterialCategories(): Promise<MaterialCategory[]> {
  return fetchAndMergeBySlug<RawMaterialCategory, MaterialCategory>(materialCategoriesQuery, {}, fallbackCategories, adaptMaterialCategory);
}

export async function loadHomePageSettings(): Promise<HomePageSettings> {
  if (!isSanityConfigured()) {
    return fallbackHomePageSettings;
  }

  try {
    const result = await getSanityClient().fetch<RawHomePageSettings>(homePageSettingsQuery);
    if (!result) {
      return fallbackHomePageSettings;
    }
    return adaptHomePageSettings(result);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity homepage fetch failed; using local fixture content.", error);
    return fallbackHomePageSettings;
  }
}

export async function loadAboutPageSettings(): Promise<AboutPageSettings> {
  if (!isSanityConfigured()) {
    return fallbackAboutPageSettings;
  }

  try {
    const result = await getSanityClient().withConfig({ useCdn: false }).fetch<RawAboutPageSettings>(aboutPageSettingsQuery);
    if (!result) {
      return fallbackAboutPageSettings;
    }
    return adaptAboutPageSettings(result);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Sanity about page fetch failed; using local fixture content.", error);
    return fallbackAboutPageSettings;
  }
}

export async function loadMaterials(): Promise<Material[]> {
  return fetchAndMergeBySlug<RawMaterial, Material>(materialsQuery, {}, fallbackMaterials, adaptMaterial);
}

export async function loadProductTypes(): Promise<ProductType[]> {
  const market = getSanityMarket();
  return fetchAndMergeBySlug<RawProductType, ProductType>(productTypesQuery, { market }, fallbackProductTypes, adaptProductType, {
    includeFallbackRecords: true,
    fallbackOnEmpty: true
  });
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
  return fetchAndMergeBySlug<RawSku, Sku>(skusQuery, { market }, fallbackSkus, adaptSku, {
    includeFallbackRecords: true,
    fallbackOnEmpty: true
  });
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
  return fetchOrFallback<RawProjectCase, ProjectCase>(projectsQuery, {}, fallbackProjects, adaptProjectCase);
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
  return fetchOrFallback<RawNewsItem, NewsItem>(newsItemsQuery, {}, fallbackNewsItems, adaptNewsItem);
}

export async function loadCatalogs(locale: Locale): Promise<Download[]> {
  return fetchOrFallback<RawCatalog, Download>(catalogsQuery, { locale }, fallbackCatalogs, adaptCatalog);
}
