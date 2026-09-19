import { chineseCopy } from "../../../china/copy";
import type { Metadata } from "next";
import { DownloadAccordion } from "@/components/DownloadAccordion";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadDownloadPageSettings, loadMaterialCategories } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const categories = await loadMaterialCategories();

  return createPageMetadata({
    locale,
    path: "/downloads",
    title: locale === "zh" ? chineseCopy(`Downloads | ${site.name}`) : locale === "en" ? `Downloads | ${site.name}` : `ダウンロード | ${site.name}`,
    description:
      locale === "zh" ? `下载 ${site.organizationName} 材料目录与技术资料。` : locale === "en"
        ? `Download ${site.organizationName} material catalogs and technical sheets.`
        : `${site.organizationName} の素材カタログと技術資料をダウンロード。`,
    image: categories[0]?.coverImage
  });
}

export default async function DownloadsPage({ params }: PageProps) {
  const { locale } = await params;
  const [categories, settings] = await Promise.all([
    loadMaterialCategories(),
    loadDownloadPageSettings(locale)
  ]);
  const heroCategory = categories[3] ?? categories[0];
  const downloadGroups = settings.groups;
  const totalDownloads = downloadGroups.reduce((total, group) => total + group.downloads.length, 0);

  return (
    <main>
      {heroCategory ? (
        <PageHero
          image={heroCategory.coverImage}
          subtitle={settings.subtitle[locale]}
          title={settings.title[locale]}
        />
      ) : null}
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-16 lg:grid-cols-[minmax(18rem,0.45fr)_minmax(0,0.55fr)] lg:gap-24">
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+3rem)] lg:self-start">
            <p className="label-caps text-gold">{settings.title[locale]}</p>
            <h1 className={`mt-6 font-serif leading-tight ${locale === "zh" ? "whitespace-nowrap text-[clamp(1.25rem,5.5vw,1.875rem)] md:text-5xl lg:text-[clamp(1.875rem,2.65vw,3rem)]" : locale === "ja" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"}`}>
              {settings.heading[locale]}
            </h1>
            <p className="mt-8 leading-8 text-muted">
              {settings.description[locale]}
            </p>
            <div className="mt-10 border-y border-charcoal/15 py-6">
              <p className="font-sans text-4xl leading-none text-charcoal">{totalDownloads}</p>
              <p className="label-caps mt-3 text-muted">{settings.availableFilesLabel[locale]}</p>
            </div>
          </div>
          <div>
            <DownloadAccordion
              downloadLabel={settings.downloadLabel[locale]}
              fileLabel={settings.fileLabel[locale]}
              groups={downloadGroups}
              locale={locale}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
