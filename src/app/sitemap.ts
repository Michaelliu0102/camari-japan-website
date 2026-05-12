import type { MetadataRoute } from "next";
import { catalogs, materials, newsItems, projectCases, site, skus } from "@/lib/content";
import { locales, localizedPath } from "@/lib/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/materials", "/oem-odm", "/projects", "/about", "/media", "/contact", "/downloads"];
  const materialPaths = materials.flatMap((material) => [
    `/materials/${material.slug}`,
    ...skus.filter((sku) => sku.materialSlug === material.slug).map((sku) => `/materials/${material.slug}/${sku.slug}`)
  ]);
  const projectPaths = projectCases.map((project) => `/projects/${project.slug}`);
  const mediaPaths = newsItems.map((item) => `/media#${item.slug}`);
  const downloadPaths = catalogs.map(() => "/downloads");
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
