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
  const skusByProductType = new Map<string, typeof skus>();
  for (const sku of skus) {
    const key = `${sku.materialSlug}::${sku.productTypeSlug}`;
    const group = skusByProductType.get(key) ?? [];
    group.push(sku);
    skusByProductType.set(key, group);
  }
  const entries = new Map<string, SitemapEntry>();

  function add(path: string, lastModified?: string) {
    const url = absoluteLocalizedUrl(locale, path);
    const normalizedLastModified = normalizeLastModified(lastModified);
    entries.set(url, {
      url,
      ...(normalizedLastModified ? { lastModified: normalizedLastModified } : {})
    });
  }

  ["", "/oem-odm", "/about", "/contact", "/privacy-policy", "/cookie-policy", "/site-policy", "/sitemap"].forEach((path) => add(path));

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

  productTypes
    .filter((productType) => locale === "en" || !skaiProductTypeSlugs.has(productType.slug))
    .forEach((productType) => {
      const productTypeSkus = skusByProductType.get(`${productType.materialSlug}::${productType.slug}`) ?? [];

      if (productTypeSkus.length === 0) {
        return;
      }

      add(
        `/materials/${productType.materialSlug}/${productType.slug}`,
        latestLastModified([productType.updatedAt, ...productTypeSkus.map((sku) => sku.updatedAt)])
      );
    });

  const leatherInteriorProductTypes = productTypes.filter(
    (productType) => productType.materialSlug === "leather" && productType.slug !== "automotive-nappa"
  );
  if (leatherInteriorProductTypes.length > 0) {
    add("/materials/leather/interior", latestLastModified(leatherInteriorProductTypes.map((productType) => productType.updatedAt)));
  }

  if (locale === "en" && skaiProductTypeSlugs.size > 0) {
    add(
      "/materials/vegan-leather/skai",
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
