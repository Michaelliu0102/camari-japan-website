import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DownloadPanel } from "@/components/DownloadPanel";
import { SkuSwatches } from "@/components/SkuSwatches";
import { SpecificationTable } from "@/components/SpecificationTable";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadMaterial, loadMaterials, loadProductType, loadProductTypesForMaterial, loadSku, loadSkusForProductType } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string; productTypeSlug: string; skuSlug: string }>;
};

export async function generateStaticParams() {
  const materials = await loadMaterials();
  const productTypeGroups = await Promise.all(materials.map((material) => loadProductTypesForMaterial(material.slug)));
  const skuGroups = await Promise.all(
    materials.map(async (material, materialIndex) =>
      Promise.all(
        (productTypeGroups[materialIndex] ?? []).map(async (productType) => ({
          productType,
          skus: await loadSkusForProductType(material.slug, productType.slug)
        }))
      )
    )
  );

  return materials.flatMap((material, materialIndex) =>
    (skuGroups[materialIndex] ?? []).flatMap(({ productType, skus }) =>
      skus.flatMap((sku) => [
        { locale: "en", materialSlug: material.slug, productTypeSlug: productType.slug, skuSlug: sku.slug },
        { locale: "ja", materialSlug: material.slug, productTypeSlug: productType.slug, skuSlug: sku.slug }
      ])
    )
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug, productTypeSlug, skuSlug } = await params;
  const sku = await loadSku(materialSlug, productTypeSlug, skuSlug);

  if (!sku) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/materials/${materialSlug}/${productTypeSlug}/${sku.slug}`,
    title: sku.seo.title[locale],
    description: sku.seo.description[locale],
    image: sku.seo.image
  });
}

export default async function ProductTypeSkuDetailPage({ params }: PageProps) {
  const { locale, materialSlug, productTypeSlug, skuSlug } = await params;
  const [material, productType, sku] = await Promise.all([
    loadMaterial(materialSlug),
    loadProductType(materialSlug, productTypeSlug),
    loadSku(materialSlug, productTypeSlug, skuSlug)
  ]);

  if (!material || !productType || !sku) {
    notFound();
  }

  const skus = await loadSkusForProductType(material.slug, productType.slug);

  return (
    <main>
      <SkuSwatches
        initialSku={sku}
        locale={locale}
        materialName={material.name[locale]}
        materialSlug={material.slug}
        productTypeName={productType.name[locale]}
        productTypeSlug={productType.slug}
        productTypeSummary={productType.summary[locale]}
        skus={skus}
      />
      <SpecificationTable locale={locale} productType={productType} sku={sku} />
      <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-paper py-20 md:py-28" data-nav-invert id="downloads">
        <div className="section-shell grid gap-12 md:grid-cols-[1fr_auto] md:gap-24">
          <div>
            <h2 className="font-serif text-2xl uppercase tracking-[0.06em]">Downloads</h2>
            <p className="mt-4 max-w-lg text-[0.85rem] leading-relaxed text-muted">
              {locale === "en" ? "Catalog and technical downloads are available here. Sample request forms are reserved for a later release." : "カタログと技術資料はこちらから確認できます。サンプル申請フォームは次期リリースで対応予定です。"}
            </p>
          </div>
          <DownloadPanel locale={locale} downloads={productType.downloads} />
        </div>
      </section>
    </main>
  );
}
