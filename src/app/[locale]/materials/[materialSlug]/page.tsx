import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationGrid } from "@/components/ApplicationGrid";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { MaterialArticleGrid } from "@/components/MaterialArticleGrid";
import { MaterialIntro } from "@/components/MaterialIntro";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadMaterial, loadMaterials, loadProductTypesForMaterial, loadSkusForMaterial } from "@/sanity/lib/loaders";

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
  const material = await loadMaterial(materialSlug);

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

export default async function MaterialDetailPage({ params }: PageProps) {
  const { locale, materialSlug } = await params;
  const material = await loadMaterial(materialSlug);

  if (!material) {
    notFound();
  }

  const [skus, productTypes] = await Promise.all([loadSkusForMaterial(material.slug), loadProductTypesForMaterial(material.slug)]);
  const fabricProductTypes = material.slug === "fabric" ? productTypes.filter((productType) => productType.slug !== "fabric-panel") : productTypes;
  const fabricProductTypeSlugs = new Set(fabricProductTypes.map((productType) => productType.slug));
  const fabricSkus = material.slug === "fabric" ? skus.filter((sku) => fabricProductTypeSlugs.has(sku.productTypeSlug)) : skus;
  const visibleSkus = material.slug === "fabric" ? fabricSkus : skus;
  const firstSku = visibleSkus[0];
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
      <CTASection
        body={locale === "en" ? "Review the current SKU detail page, downloads, and contact information for sales guidance." : "SKU 詳細、ダウンロード、問い合わせ先をご確認ください。"}
        href={firstSku ? `/materials/${material.slug}/${firstSku.productTypeSlug}/${firstSku.slug}` : `/materials/${material.slug}`}
        label={locale === "en" ? "View SKU Detail" : "SKU 詳細を見る"}
        locale={locale}
        title={locale === "en" ? "Explore the material through color and specification." : "カラーと仕様から素材を確認する。"}
        tone="light"
      />
    </main>
  );
}
