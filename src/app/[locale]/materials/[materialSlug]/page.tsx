import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationGrid } from "@/components/ApplicationGrid";
import { JsonLd } from "@/components/JsonLd";
import { MaterialArticleGrid } from "@/components/MaterialArticleGrid";
import { MaterialIntro } from "@/components/MaterialIntro";
import { MaterialProjectCarousel, type ProjectTitleLink } from "@/components/MaterialProjectCarousel";
import { PageHero } from "@/components/PageHero";
import type { Material, ProductType, ProjectCase, Sku } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadMaterials, loadProductTypes, loadProjectsForMaterial, loadSkus, loadSkusForMaterial } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string }>;
};

export async function generateStaticParams() {
  const materials = await loadMaterials();

  return materials.flatMap((material) => [
    { locale: "en", materialSlug: material.slug },
    { locale: "ja", materialSlug: material.slug }
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug } = await params;
  const materials = await loadMaterials();
  const material = materials.find((entry) => entry.slug === materialSlug);

  if (!material) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/materials/${material.slug}`,
    title: material.seo.title[locale],
    description: material.seo.description[locale],
    image: material.seo.image
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getProductTypeAliases(productTypeName: string, materialName: string, locale: Locale): string[] {
  const aliases = new Set<string>([productTypeName.trim()]);
  const withoutMaterialPrefix = productTypeName.replace(new RegExp(`^${escapeRegExp(materialName)}\\s+`, "i"), "").trim();

  if (withoutMaterialPrefix) {
    aliases.add(withoutMaterialPrefix);
  }

  if (locale === "en") {
    const withoutAutomotive = productTypeName.replace(/^Automotive\s+/i, "").trim();
    if (withoutAutomotive) {
      aliases.add(withoutAutomotive);
    }

    const trimmedAlias = withoutMaterialPrefix.replace(/^Automotive\s+/i, "").trim();
    if (trimmedAlias) {
      aliases.add(trimmedAlias);
    }

    if (/\bNappa\b/i.test(productTypeName)) {
      aliases.add("Nappa");
    }
  }

  return [...aliases].filter(Boolean);
}

function buildProjectTitleLinks(
  locale: Locale,
  projects: ProjectCase[],
  materials: Material[],
  productTypes: ProductType[],
  skus: Sku[]
): Record<string, ProjectTitleLink[]> {
  const materialBySlug = new Map(materials.map((material) => [material.slug, material]));
  const productTypesByMaterialSlug = new Map<string, ProductType[]>();
  const firstSkuByProductTypeSlug = new Map<string, Sku>();

  for (const productType of productTypes) {
    const bucket = productTypesByMaterialSlug.get(productType.materialSlug) ?? [];
    bucket.push(productType);
    productTypesByMaterialSlug.set(productType.materialSlug, bucket);
  }

  for (const sku of skus) {
    if (!firstSkuByProductTypeSlug.has(sku.productTypeSlug)) {
      firstSkuByProductTypeSlug.set(sku.productTypeSlug, sku);
    }
  }

  return Object.fromEntries(
    projects.map((project) => {
      const links = new Map<string, ProjectTitleLink>();

      for (const linkedArticle of project.linkedArticles) {
        const material = materialBySlug.get(linkedArticle.materialSlug);
        const firstSku = firstSkuByProductTypeSlug.get(linkedArticle.slug);

        if (!material || !firstSku) {
          continue;
        }

        const aliases = new Set<string>([linkedArticle.name[locale], material.name[locale]]);

        for (const alias of getProductTypeAliases(linkedArticle.name[locale], material.name[locale], locale)) {
          aliases.add(alias);
        }

        for (const alias of aliases) {
          const normalizedAlias = alias.trim();
          if (!normalizedAlias) {
            continue;
          }

          links.set(normalizedAlias, {
            label: normalizedAlias,
            href: `/materials/${linkedArticle.materialSlug}/${linkedArticle.slug}/${firstSku.slug}`
          });
        }
      }

      for (const linkedMaterial of project.linkedMaterials) {
        const material = materialBySlug.get(linkedMaterial.slug);

        if (!material) {
          continue;
        }

        const aliases = new Set<string>([material.name[locale]]);
        const relatedProductTypes = productTypesByMaterialSlug.get(linkedMaterial.slug) ?? [];

        for (const productType of relatedProductTypes) {
          for (const alias of getProductTypeAliases(productType.name[locale], material.name[locale], locale)) {
            aliases.add(alias);
          }
        }

        for (const alias of aliases) {
          const normalizedAlias = alias.trim();
          if (!normalizedAlias) {
            continue;
          }

          links.set(normalizedAlias, {
            label: normalizedAlias,
            href: `/materials/${linkedMaterial.slug}`
          });
        }
      }

      return [project.slug, [...links.values()]];
    })
  );
}

export default async function MaterialDetailPage({ params }: PageProps) {
  const { locale, materialSlug } = await params;
  const [materials, allProductTypes, allSkus] = await Promise.all([loadMaterials(), loadProductTypes(), loadSkus()]);
  const material = materials.find((entry) => entry.slug === materialSlug);

  if (!material) {
    notFound();
  }

  const [projects, skus] = await Promise.all([loadProjectsForMaterial(material.slug), loadSkusForMaterial(material.slug)]);
  const productTypes = allProductTypes.filter((productType) => productType.materialSlug === material.slug);
  const projectTitleLinks = buildProjectTitleLinks(locale, projects, materials, allProductTypes, allSkus);
  const fabricProductTypes = material.slug === "fabric" ? productTypes.filter((productType) => productType.slug !== "fabric-panel") : productTypes;
  const fabricProductTypeSlugs = new Set(fabricProductTypes.map((productType) => productType.slug));
  const fabricSkus = material.slug === "fabric" ? skus.filter((sku) => fabricProductTypeSlugs.has(sku.productTypeSlug)) : skus;
  const showArticleGrid = material.slug === "fabric" && fabricProductTypes.length > 0;
  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: locale === "en" ? "Home" : "ホーム", path: "/" },
    { name: locale === "en" ? "Materials" : "素材", path: "/materials" },
    { name: material.name[locale], path: `/materials/${material.slug}` }
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      <PageHero eyebrow={material.eyebrow[locale]} image={material.heroImage} subtitle={material.heroSubtitle[locale]} title={material.heroTitle[locale]} />
      <MaterialIntro locale={locale} material={material} />
      {showArticleGrid ? <MaterialArticleGrid locale={locale} materialSlug={material.slug} productTypes={fabricProductTypes} skus={fabricSkus} /> : <ApplicationGrid locale={locale} material={material} skus={skus} />}
      <MaterialProjectCarousel locale={locale} materialName={material.name[locale]} projectTitleLinks={projectTitleLinks} projects={projects} />
    </main>
  );
}
