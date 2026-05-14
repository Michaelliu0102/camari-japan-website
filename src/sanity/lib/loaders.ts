import {
  catalogs as fallbackCatalogs,
  homePageSettings as fallbackHomePageSettings,
  materialCategories as fallbackCategories,
  materials as fallbackMaterials,
  newsItems as fallbackNewsItems,
  productTypes as fallbackProductTypes,
  projectCases as fallbackProjects,
  skus as fallbackSkus,
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
import { adaptCatalog, adaptHomePageSettings, adaptMaterial, adaptMaterialCategory, adaptNewsItem, adaptProductType, adaptProjectCase, adaptSku } from "./adapters";
import { getSanityClient } from "./client";
import {
  catalogsQuery,
  homePageSettingsQuery,
  materialCategoriesQuery,
  materialsQuery,
  newsItemsQuery,
  productTypesQuery,
  projectsQuery,
  skusQuery,
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

export async function loadMaterialCategories(): Promise<MaterialCategory[]> {
  return fetchOrFallback<RawMaterialCategory, MaterialCategory>(materialCategoriesQuery, {}, fallbackCategories, adaptMaterialCategory);
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

export async function loadMaterials(): Promise<Material[]> {
  return fetchOrFallback<RawMaterial, Material>(materialsQuery, {}, fallbackMaterials, adaptMaterial);
}

export async function loadProductTypes(): Promise<ProductType[]> {
  return fetchOrFallback<RawProductType, ProductType>(productTypesQuery, {}, fallbackProductTypes, adaptProductType);
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
  return fetchOrFallback<RawSku, Sku>(skusQuery, {}, fallbackSkus, adaptSku);
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
