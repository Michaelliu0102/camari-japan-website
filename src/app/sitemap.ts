import type { MetadataRoute } from "next";
import { absoluteLocalizedUrl } from "@/lib/locales";
import { siteConfig } from "@/lib/site-config";
import { loadSkaiVinylProductTypeSlugs } from "@/lib/skai-vinyl";
import {
  loadCatalogs,
  loadMaterialCategories,
  loadMaterials,
  loadNewsItems,
  loadProductCategories,
  loadProductTypes,
  loadProjects,
  loadSkus
} from "@/sanity/lib/loaders";

type SitemapEntry = MetadataRoute.Sitemap[number];

function normalizeLastModified(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
}

function latestLastModified(values: Array<string | undefined>): string | undefined {
  const timestamps = values
    .map((value) => normalizeLastModified(value))
    .filter((value): value is string => Boolean(value))
    .map((value) => Date.parse(value));

  if (timestamps.length === 0) {
    return undefined;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = siteConfig.defaultLocale;
  const [materialCategories, materials, productTypes, productCategories, skus, projects, newsItems, catalogGroups, skaiProductTypeSlugs] = await Promise.all([
    loadMaterialCategories(),
    loadMaterials(),
    loadProductTypes(),
    loadProductCategories(),
    loadSkus(),
    loadProjects(),
    loadNewsItems(),
    loadCatalogs(locale),
    loadSkaiVinylProductTypeSlugs()
  ]);
  const productTypeByKey = new Map(productTypes.map((productType) => [`${productType.materialSlug}::${productType.slug}`, productType]));
  const entries = new Map<string, SitemapEntry>();

  function add(path: string, lastModified?: string) {
    const url = absoluteLocalizedUrl(locale, path);
    const normalizedLastModified = normalizeLastModified(lastModified);
    entries.set(url, {
      url,
      ...(normalizedLastModified ? { lastModified: normalizedLastModified } : {})
    });
  }

  ["", "/oem-odm", "/about", "/contact", "/privacy-policy", "/site-policy", "/sitemap"].forEach((path) => add(path));

  add("/materials", latestLastModified([...materialCategories, ...materials].map((item) => item.updatedAt)));
  add("/products", latestLastModified(productCategories.map((category) => category.updatedAt)));
  add("/projects", latestLastModified(projects.map((project) => project.updatedAt)));

  if (newsItems.length > 0) {
    add("/media", latestLastModified(newsItems.map((item) => item.updatedAt || item.date)));
  }

  if (catalogGroups.length > 0) {
    add("/downloads", latestLastModified(catalogGroups.map((catalog) => catalog.updatedAt)));
  }

  productCategories.forEach((category) => add(`/products/${category.slug}`, category.updatedAt));
  materials.forEach((material) => add(`/materials/${material.slug}`, material.updatedAt));

  skus
    .filter((sku) => locale === "en" || !skaiProductTypeSlugs.has(sku.productTypeSlug))
    .forEach((sku) => {
      const productType = productTypeByKey.get(`${sku.materialSlug}::${sku.productTypeSlug}`);
      add(`/materials/${sku.materialSlug}/${sku.productTypeSlug}/${sku.slug}`, sku.updatedAt || productType?.updatedAt);
    });

  const leatherInteriorProductTypes = productTypes.filter(
    (productType) => productType.materialSlug === "leather" && productType.slug !== "automotive-nappa"
  );
  if (leatherInteriorProductTypes.length > 0) {
    add("/materials/leather/interior", latestLastModified(leatherInteriorProductTypes.map((productType) => productType.updatedAt)));
  }

  if (locale === "en" && skaiProductTypeSlugs.size > 0) {
    add(
      "/materials/vegan-leather/vinyl",
      latestLastModified(
        productTypes.filter((productType) => skaiProductTypeSlugs.has(productType.slug)).map((productType) => productType.updatedAt)
      )
    );
  }

  projects.forEach((project) => add(`/projects/${project.slug}`, project.updatedAt));
  newsItems
    .filter((item) => !item.availableLocales || item.availableLocales.includes(locale))
    .forEach((item) => add(`/media/${item.slug}`, item.updatedAt || item.date));

  return [...entries.values()];
}
