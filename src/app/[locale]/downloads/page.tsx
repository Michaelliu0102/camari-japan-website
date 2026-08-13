import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { DownloadAccordion } from "@/components/DownloadAccordion";
import { PageHero } from "@/components/PageHero";
import { site, type Download } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadCatalogs, loadMaterialCategories, loadProductTypes } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

type DownloadGroup = {
  slug: string;
  label: Record<Locale, string>;
  intro: Record<Locale, string>;
  downloads: Download[];
};

const alcantaraSpecDownloads: Download[] = [
  {
    title: { en: "Alcantara 5010, 0.4 Thin 5010 Datasheet", ja: "Alcantara 5010, 0.4 Thin 5010 データシート" },
    href: "/uploads/spec/Alcantara/Alcantara 5010 - 0.4 Thin 5010 Datasheet(1).pdf"
  },
  {
    title: { en: "Alcantara 5012 Panel Spec Sheet", ja: "Alcantara 5012 Panel 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5012 - Pannel.pdf"
  },
  {
    title: { en: "Alcantara 5015 BP Regular Spec Sheet", ja: "Alcantara 5015 BP Regular 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5015 ( BP ) Regular.pdf"
  },
  {
    title: { en: "Alcantara 5030, 0.4 Thin ECG Spec Sheet", ja: "Alcantara 5030, 0.4 Thin ECG 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5030 - 0.4 Thin ECG.pdf"
  },
  {
    title: { en: "Alcantara 5143 EXO Spec Sheet", ja: "Alcantara 5143 EXO 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5143 - EXO.pdf"
  },
  {
    title: { en: "Alcantara 5170 Multilayer Spec Sheet", ja: "Alcantara 5170 Multilayer 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5170 Multilayer.pdf"
  },
  {
    title: { en: "Alcantara 5205 COVER Spec Sheet", ja: "Alcantara 5205 COVER 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5205 - COVER Spec sheet.pdf"
  },
  {
    title: { en: "Alcantara 5466 Avant Spec Sheet", ja: "Alcantara 5466 Avant 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5466 - Avant.pdf"
  },
  {
    title: { en: "Alcantara Bord FR 5056 Spec Sheet", ja: "Alcantara Bord FR 5056 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara Bord FR 5056.pdf"
  }
].map((download) => ({
  ...download,
  description: {
    en: "Technical specification PDF for Alcantara article selection.",
    ja: "Alcantara 品番選定のための技術仕様PDF。"
  },
  type: "technical"
}));

const publicDownloadSupplements: Download[] = [
  {
    title: { en: "Alcantara Automotive Colors", ja: "Alcantara 自動車向けカラー" },
    description: {
      en: "Colour reference for Alcantara automotive programs.",
      ja: "Alcantara 自動車用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-automotive-colors.pdf",
    type: "catalog"
  },
  {
    title: { en: "Alcantara Consumer Electronics Colors", ja: "Alcantara コンシューマーエレクトロニクス向けカラー" },
    description: {
      en: "Colour reference for Alcantara consumer electronics applications.",
      ja: "Alcantara コンシューマーエレクトロニクス用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-consumer-electronics-colors.pdf",
    type: "catalog"
  },
  {
    title: {
      en: "Alcantara Interiors, Marine & Aviation Indoor Colors",
      ja: "Alcantara インテリア、マリン、航空機インドアカラー"
    },
    description: {
      en: "Colour reference for Alcantara indoor interiors, marine, and aviation applications.",
      ja: "Alcantara のインドアインテリア、マリン、航空機用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-interiors-marine-aviation-indoor.pdf",
    type: "catalog"
  },
  {
    title: {
      en: "Alcantara Interiors, Marine Outdoor EXO Colors",
      ja: "Alcantara インテリア、マリンアウトドア EXO カラー"
    },
    description: {
      en: "Colour reference for Alcantara outdoor EXO and marine exterior applications.",
      ja: "Alcantara EXO とマリン屋外用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-interiors-marine-outdoor-exo.pdf",
    type: "catalog"
  },
  {
    title: { en: "Alcantara Material Maintenance Guide", ja: "Alcantara 素材メンテナンスガイド" },
    description: {
      en: "Recommended maintenance and cleaning instructions for Alcantara materials.",
      ja: "Alcantara 素材の推奨メンテナンスおよび清掃手順。"
    },
    href: "/uploads/spec/Alcantara/Instructions-for-maintenance-of-alcantara-material.pdf",
    type: "care"
  },
  {
    title: { en: "Understanding Your Leather Purchase", ja: "レザー購入ガイド" },
    description: {
      en: "Natural hide size, markings, and leather purchase guidance.",
      ja: "天然皮革のサイズ、自然な跡、購入時の確認事項。"
    },
    href: "/uploads/page-insert/understand-leather.pdf",
    type: "technical"
  },
  {
    title: { en: "Microfiber Leather Aquapelle Spec Sheet", ja: "Microfiber Leather Aquapelle 仕様書" },
    description: {
      en: "Technical specifications for Microfiber Leather Aquapelle.",
      ja: "Microfiber Leather Aquapelle の技術仕様PDF。"
    },
    href: "/uploads/spec/vegan leather/aquapelle-spec-sheet.pdf",
    type: "technical"
  },
  {
    title: { en: "skai Faux Leather Cleaning & Care", ja: "skai フェイクレザー清掃・ケア" },
    description: {
      en: "Cleaning and care instructions for skai faux leather.",
      ja: "skai フェイクレザーの清掃・ケア手順。"
    },
    href: "/uploads/veganleather/skai/Download/2021-01_EN_Cleaning-Care_Faux-Leather_detail.pdf",
    type: "care"
  },
  {
    title: { en: "skai Clean and Care", ja: "skai Clean and Care" },
    description: {
      en: "General cleaning and care guide for skai materials.",
      ja: "skai 素材の一般的な清掃・ケアガイド。"
    },
    href: "/uploads/veganleather/skai/Download/clean and care.pdf",
    type: "care"
  }
];

function uniqueDownloads(downloads: Download[]): Download[] {
  const seen = new Set<string>();

  return downloads.filter((download) => {
    const key = decodeURIComponent(download.href.split("?")[0] ?? download.href);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isAvailableDownload(download: Download): boolean {
  if (!download.href) {
    return false;
  }

  if (/^https?:\/\//.test(download.href)) {
    return true;
  }

  const pathname = decodeURIComponent(download.href.split("?")[0] ?? "");
  const publicPath = pathname.replace(/^\/+/, "");

  return existsSync(path.join(process.cwd(), "public", publicPath));
}

function availableDownloads(downloads: Download[]): Download[] {
  return uniqueDownloads(downloads).filter(isAvailableDownload);
}

function createDownloadGroups(catalogs: Download[], productDownloads: Download[]): DownloadGroup[] {
  const withSupplements = availableDownloads([
    ...productDownloads,
    ...alcantaraSpecDownloads,
    ...publicDownloadSupplements
  ]);

  const byHref = (href: string) => withSupplements.find((download) => download.href === href);
  const alcantaraDownloads = withSupplements.filter((download) =>
    (download.href.includes("/uploads/spec/Alcantara") && download.type !== "care") ||
    download.href.includes("/uploads/alcantara/")
  );
  const leatherDownloads = withSupplements.filter((download) =>
    download.href.includes("/uploads/spec/leather/") ||
    download.href.includes("/uploads/page-insert/understand-leather.pdf")
  );
  const veganLeatherDownloads = withSupplements.filter((download) =>
    download.href.includes("/uploads/spec/vegan leather/")
  );
  const careDownloads = uniqueDownloads([
    ...withSupplements.filter((download) => download.type === "care"),
    ...[
      byHref("/uploads/spec/Instructions-for-maintenance-of-alcantara-material.pdf"),
      byHref("/uploads/spec/Alcantara/Instructions-for-maintenance-of-alcantara-material.pdf"),
      byHref("/uploads/veganleather/skai/Download/2021-01_EN_Cleaning-Care_Faux-Leather_detail.pdf"),
      byHref("/uploads/veganleather/skai/Download/clean and care.pdf")
    ].filter((download): download is Download => Boolean(download))
  ]);

  return [
    {
      slug: "catalogs",
      label: { en: "Catalogs", ja: "カタログ" },
      intro: {
        en: "Core catalog files and broad material references for early project review.",
        ja: "初期検討に使える主要カタログと素材リファレンス。"
      },
      downloads: availableDownloads(catalogs)
    },
    {
      slug: "alcantara",
      label: { en: "Alcantara", ja: "Alcantara" },
      intro: {
        en: "Technical sheets and color references for Alcantara articles.",
        ja: "Alcantara 品番の技術資料とカラーリファレンス。"
      },
      downloads: availableDownloads(alcantaraDownloads)
    },
    {
      slug: "leather",
      label: { en: "Leather", ja: "レザー" },
      intro: {
        en: "Leather specification sheets and purchase guidance.",
        ja: "レザー仕様書と購入時の確認資料。"
      },
      downloads: availableDownloads(leatherDownloads)
    },
    {
      slug: "vegan-leather",
      label: { en: "Vegan Leather", ja: "ヴィーガンレザー" },
      intro: {
        en: "Aquapelle and synthetic leather technical documents.",
        ja: "Aquapelle と合成レザーの技術資料。"
      },
      downloads: availableDownloads(veganLeatherDownloads)
    },
    {
      slug: "care",
      label: { en: "Care & Maintenance", ja: "ケア・メンテナンス" },
      intro: {
        en: "Cleaning and maintenance files for material handling after specification.",
        ja: "仕様決定後の素材取り扱いに関する清掃・メンテナンス資料。"
      },
      downloads: availableDownloads(careDownloads)
    }
  ].filter((group) => group.downloads.length > 0);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const categories = await loadMaterialCategories();

  return createPageMetadata({
    locale,
    path: "/downloads",
    title: locale === "en" ? `Downloads | ${site.name}` : `ダウンロード | ${site.name}`,
    description:
      locale === "en"
        ? `Download ${site.organizationName} material catalogs and technical sheets.`
        : `${site.organizationName} の素材カタログと技術資料をダウンロード。`,
    image: categories[0]?.coverImage
  });
}

export default async function DownloadsPage({ params }: PageProps) {
  const { locale } = await params;
  const [categories, catalogs, productTypes] = await Promise.all([
    loadMaterialCategories(),
    loadCatalogs(locale),
    loadProductTypes()
  ]);
  const heroCategory = categories[3] ?? categories[0];
  const productDownloads = productTypes.flatMap((productType) => productType.downloads);
  const downloadGroups = createDownloadGroups(catalogs, productDownloads);
  const totalDownloads = downloadGroups.reduce((total, group) => total + group.downloads.length, 0);

  return (
    <main>
      {heroCategory ? (
        <PageHero
          image={heroCategory.coverImage}
          subtitle={locale === "en" ? "PDF catalogs and technical sheets" : "PDF カタログと技術資料"}
          title={locale === "en" ? "Downloads" : "ダウンロード"}
        />
      ) : null}
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-16 lg:grid-cols-[minmax(18rem,0.45fr)_minmax(0,0.55fr)] lg:gap-24">
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+3rem)] lg:self-start">
            <p className="label-caps text-gold">{locale === "en" ? "Downloads" : "ダウンロード"}</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              {locale === "en" ? "Material documents for review and specification." : "確認と仕様検討のための素材資料。"}
            </h1>
            <p className="mt-8 leading-8 text-muted">
              {locale === "en"
                ? "Download the latest catalogs and technical sheets prepared for project review, specification, and client sharing."
                : "プロジェクト確認、仕様検討、クライアント共有に使える最新版のカタログと技術資料をダウンロードいただけます。"}
            </p>
            <div className="mt-10 border-y border-charcoal/15 py-6">
              <p className="font-sans text-4xl leading-none text-charcoal">{totalDownloads}</p>
              <p className="label-caps mt-3 text-muted">{locale === "en" ? "Available files" : "利用可能なファイル"}</p>
            </div>
          </div>
          <div>
            <DownloadAccordion
              downloadLabel={locale === "en" ? "Download" : "ダウンロード"}
              fileLabel={locale === "en" ? "files" : "ファイル"}
              groups={downloadGroups}
              locale={locale}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
