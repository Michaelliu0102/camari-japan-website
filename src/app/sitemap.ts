import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { locales, localizedPath } from "@/lib/locales";
import { loadCatalogs, loadMaterials, loadNewsItems, loadProjects, loadSkus } from "@/sanity/lib/loaders";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [materials, skus, projects, newsItems, catalogGroups] = await Promise.all([
    loadMaterials(),
    loadSkus(),
    loadProjects(),
    loadNewsItems(),
    Promise.all(locales.map((locale) => loadCatalogs(locale)))
  ]);
  const staticPaths = ["", "/materials", "/oem-odm", "/projects", "/about", "/media", "/contact", "/downloads", "/privacy-policy", "/site-policy", "/sitemap"];
  const materialPaths = materials.flatMap((material) => [
    `/materials/${material.slug}`,
    ...skus
      .filter((sku) => sku.materialSlug === material.slug)
      .map((sku) => `/materials/${material.slug}/${sku.productTypeSlug}/${sku.slug}`)
  ]);
  const projectPaths = projects.map((project) => `/projects/${project.slug}`);
  const mediaPaths = newsItems.map((item) => `/media#${item.slug}`);
  const downloadPaths = catalogGroups.flat().map(() => "/downloads");
  const paths = [...staticPaths, ...materialPaths, ...projectPaths, ...mediaPaths, ...downloadPaths];

  return [...new Set(paths)].flatMap((path) =>
    locales.map((locale) => ({
      url: new URL(localizedPath(locale, path), site.url).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.7
    }))
  );
}
