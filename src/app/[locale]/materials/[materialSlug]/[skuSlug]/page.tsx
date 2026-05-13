import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DownloadPanel } from "@/components/DownloadPanel";
import { SkuSwatches } from "@/components/SkuSwatches";
import { SpecificationTable } from "@/components/SpecificationTable";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";
import { loadMaterial, loadMaterials, loadSku, loadSkusForMaterial } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string; skuSlug: string }>;
};

export async function generateStaticParams() {
  const materials = await loadMaterials();
  const skuGroups = await Promise.all(materials.map((material) => loadSkusForMaterial(material.slug)));

  return materials.flatMap((material, index) =>
    (skuGroups[index] ?? []).flatMap((sku) => [
      { locale: "en", materialSlug: material.slug, skuSlug: sku.slug },
      { locale: "ja", materialSlug: material.slug, skuSlug: sku.slug }
    ])
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug, skuSlug } = await params;
  const sku = await loadSku(materialSlug, skuSlug);

  if (!sku) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/materials/${materialSlug}/${sku.slug}`,
    title: sku.seo.title[locale],
    description: sku.seo.description[locale],
    image: sku.seo.image
  });
}

export default async function SkuDetailPage({ params }: PageProps) {
  const { locale, materialSlug, skuSlug } = await params;
  const [material, sku] = await Promise.all([loadMaterial(materialSlug), loadSku(materialSlug, skuSlug)]);

  if (!material || !sku) {
    notFound();
  }

  const skus = await loadSkusForMaterial(material.slug);

  return (
    <main>
      <SkuSwatches initialSku={sku} locale={locale} materialName={material.name[locale]} materialSlug={material.slug} skus={skus} />
      <SpecificationTable locale={locale} sku={sku} />
      <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-paper py-20 md:py-28" data-nav-invert id="downloads">
        <div className="section-shell grid gap-12 md:grid-cols-[1fr_auto] md:gap-24">
          <div>
            <h2 className="font-serif text-2xl uppercase tracking-[0.06em]">Downloads</h2>
            <p className="mt-4 max-w-lg text-[0.85rem] leading-relaxed text-muted">
              {locale === "en" ? "Catalog and technical downloads are available here. Sample request forms are reserved for a later release." : "カタログと技術資料はこちらから確認できます。サンプル申請フォームは次期リリースで対応予定です。"}
            </p>
          </div>
          <DownloadPanel locale={locale} downloads={sku.downloads} />
        </div>
      </section>
    </main>
  );
}
