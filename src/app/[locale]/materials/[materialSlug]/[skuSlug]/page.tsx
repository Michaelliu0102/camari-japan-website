import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DownloadPanel } from "@/components/DownloadPanel";
import { NavInvert } from "@/components/NavInvert";
import { SkuSwatches } from "@/components/SkuSwatches";
import { SpecificationTable } from "@/components/SpecificationTable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getMaterial, getSku, getSkusForMaterial, materials } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string; skuSlug: string }>;
};

export function generateStaticParams() {
  return materials.flatMap((material) =>
    getSkusForMaterial(material.slug).flatMap((sku) => [
      { locale: "en", materialSlug: material.slug, skuSlug: sku.slug },
      { locale: "ja", materialSlug: material.slug, skuSlug: sku.slug }
    ])
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug, skuSlug } = await params;
  const sku = getSku(materialSlug, skuSlug);

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
  const material = getMaterial(materialSlug);
  const sku = getSku(materialSlug, skuSlug);

  if (!material || !sku) {
    notFound();
  }

  const skus = getSkusForMaterial(material.slug);

  return (
    <main>
      <NavInvert />
      <div className="bg-paper px-margin-mobile pt-[var(--nav-height)]">
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
      <section className="bg-paper py-20 md:py-28">
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
