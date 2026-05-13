import type { Metadata } from "next";
import { DownloadPanel } from "@/components/DownloadPanel";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadCatalogs, loadMaterialCategories } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const categories = await loadMaterialCategories();

  return createPageMetadata({
    locale,
    path: "/downloads",
    title: locale === "en" ? "Downloads | CAMARI JAPAN" : "ダウンロード | CAMARI JAPAN",
    description: locale === "en" ? "Download CAMARI JAPAN material catalogs and technical sheets." : "CAMARI JAPAN の素材カタログと技術資料をダウンロード。",
    image: categories[0]?.coverImage
  });
}

export default async function DownloadsPage({ params }: PageProps) {
  const { locale } = await params;
  const [categories, downloads] = await Promise.all([loadMaterialCategories(), loadCatalogs(locale)]);
  const heroCategory = categories[3] ?? categories[0];

  return (
    <main>
      {heroCategory ? <PageHero image={heroCategory.coverImage} subtitle={locale === "en" ? "PDF catalogs and technical sheets" : "PDF カタログと技術資料"} title="Downloads" /> : null}
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-16 md:grid-cols-2">
          <div>
            <p className="label-caps text-gold">Catalog</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              {locale === "en" ? "Material documents for review and specification." : "確認と仕様検討のための素材資料。"}
            </h1>
            <p className="mt-8 leading-8 text-muted">
              {locale === "en" ? "Replace placeholder PDF paths with uploaded Sanity assets or public catalog files before production launch." : "本番公開前に、プレースホルダー PDF パスを Sanity アセットまたは公開カタログファイルに差し替えてください。"}
            </p>
          </div>
          <DownloadPanel locale={locale} downloads={downloads} />
        </div>
      </section>
    </main>
  );
}
