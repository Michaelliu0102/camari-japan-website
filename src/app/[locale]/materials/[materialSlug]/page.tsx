import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationGrid } from "@/components/ApplicationGrid";
import { CTASection } from "@/components/CTASection";
import { MaterialIntro } from "@/components/MaterialIntro";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadMaterial, loadMaterials, loadSkusForMaterial } from "@/sanity/lib/loaders";

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

  const skus = await loadSkusForMaterial(material.slug);
  const firstSku = skus[0];

  return (
    <main>
      <PageHero eyebrow={material.eyebrow[locale]} image={material.heroImage} subtitle={material.heroSubtitle[locale]} title={material.heroTitle[locale]} />
      <MaterialIntro locale={locale} material={material} />
      <ApplicationGrid locale={locale} material={material} skus={skus} />
      <CTASection
        body={locale === "en" ? "Review the current SKU detail page, downloads, and contact information for sales guidance." : "SKU 詳細、ダウンロード、問い合わせ先をご確認ください。"}
        href={firstSku ? `/materials/${material.slug}/${firstSku.slug}` : `/materials/${material.slug}`}
        label={locale === "en" ? "View SKU Detail" : "SKU 詳細を見る"}
        locale={locale}
        title={locale === "en" ? "Explore the material through color and specification." : "カラーと仕様から素材を確認する。"}
        tone="light"
      />
    </main>
  );
}
