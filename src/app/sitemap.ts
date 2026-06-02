import type { MetadataRoute } from "next";
import { productCategories } from "@/content/products/categories";
import { siteConfig } from "@/lib/site-config";
import { localizedPath } from "@/lib/locales";
import { loadCatalogs, loadMaterials, loadNewsItems, loadProjects, loadSkus } from "@/sanity/lib/loaders";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = siteConfig.defaultLocale;
  const [materials, skus, projects, newsItems, catalogGroups] = await Promise.all([
    loadMaterials(),
    loadSkus(),
    loadProjects(),
    loadNewsItems(),
    loadCatalogs(locale)
  ]);
  const staticPaths = ["", "/materials", "/oem-odm", "/projects", "/about", "/media", "/contact", "/downloads", "/privacy-policy", "/site-policy", "/sitemap"];
  const productPaths = ["/products", ...productCategories.map((category) => `/products/${category.slug}`)];
  const materialPaths = materials.flatMap((material) => [
    `/materials/${material.slug}`,
    ...skus
      .filter((sku) => sku.materialSlug === material.slug)
      .map((sku) => `/materials/${material.slug}/${sku.productTypeSlug}/${sku.slug}`)
  ]);
  const projectPaths = projects.map((project) => `/projects/${project.slug}`);
  const mediaPaths = newsItems.length > 0 ? ["/media"] : [];
  const downloadPaths = catalogGroups.length > 0 ? ["/downloads"] : [];
  const paths = [...staticPaths, ...productPaths, ...materialPaths, ...projectPaths, ...mediaPaths, ...downloadPaths];

  return [...new Set(paths)].map((path) => ({
    url: new URL(localizedPath(locale, path), `${siteConfig.siteUrl}/`).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7
  }));
}
