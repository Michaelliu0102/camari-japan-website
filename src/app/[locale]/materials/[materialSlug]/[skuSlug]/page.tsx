import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DownloadPanel } from "@/components/DownloadPanel";
import { SkuSwatches } from "@/components/SkuSwatches";
import { SpecificationTable } from "@/components/SpecificationTable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
      <div className="bg-paper px-margin-mobile pt-[var(--nav-height)]" data-nav-invert>
        <div className="section-shell">
          <Link
            className="label-caps inline-flex items-center gap-3 py-6 text-muted transition-colors hover:text-charcoal"
            href={localizedPath(locale, `/materials/${material.slug}`)}
          >
            <ArrowLeft size={14} strokeWidth={1.4} />
            {material.name[locale]}
          </Link>
        </div>
      </div>
      <SkuSwatches compact initialSku={sku} locale={locale} materialName={material.name[locale]} materialSlug={material.slug} skus={skus} />
      <SpecificationTable locale={locale} sku={sku} />
      <section className="bg-paper py-20 md:py-28" data-nav-invert>
        <div className="section-shell grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl uppercase tracking-luxury">Downloads</h2>
            <p className="mt-5 max-w-xl leading-8 text-muted">
              {locale === "en" ? "Catalog and technical downloads are available here. Sample request forms are reserved for a later release." : "カタログと技術資料はこちらから確認できます。サンプル申請フォームは次期リリースで対応予定です。"}
            </p>
          </div>
          <DownloadPanel locale={locale} downloads={sku.downloads} />
        </div>
      </section>
    </main>
  );
}
