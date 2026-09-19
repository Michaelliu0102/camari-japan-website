import { chineseCopy } from "../china/copy";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Download } from "@/lib/content";
import type { Locale } from "@/lib/locales";

export type DownloadGroup = {
  slug: string;
  label: Record<Locale, string>;
  intro: Record<Locale, string>;
  downloads: Download[];
};

const alcantaraSpecDownloads: Download[] = [
  {
    title: { zh: chineseCopy("Alcantara 5010, 0.4 Thin 5010 Datasheet"), en: "Alcantara 5010, 0.4 Thin 5010 Datasheet", ja: "Alcantara 5010, 0.4 Thin 5010 データシート" },
    href: "/uploads/spec/Alcantara/Alcantara 5010 - 0.4 Thin 5010 Datasheet(1).pdf"
  },
  {
    title: { zh: chineseCopy("Alcantara 5012 Panel Spec Sheet"), en: "Alcantara 5012 Panel Spec Sheet", ja: "Alcantara 5012 Panel 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5012 - Pannel.pdf"
  },
  {
    title: { zh: chineseCopy("Alcantara 5015 BP Regular Spec Sheet"), en: "Alcantara 5015 BP Regular Spec Sheet", ja: "Alcantara 5015 BP Regular 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5015 ( BP ) Regular.pdf"
  },
  {
    title: { zh: chineseCopy("Alcantara 5030, 0.4 Thin ECG Spec Sheet"), en: "Alcantara 5030, 0.4 Thin ECG Spec Sheet", ja: "Alcantara 5030, 0.4 Thin ECG 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5030 - 0.4 Thin ECG.pdf"
  },
  {
    title: { zh: chineseCopy("Alcantara 5143 EXO Spec Sheet"), en: "Alcantara 5143 EXO Spec Sheet", ja: "Alcantara 5143 EXO 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5143 - EXO.pdf"
  },
  {
    title: { zh: chineseCopy("Alcantara 5170 Multilayer Spec Sheet"), en: "Alcantara 5170 Multilayer Spec Sheet", ja: "Alcantara 5170 Multilayer 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5170 Multilayer.pdf"
  },
  {
    title: { zh: chineseCopy("Alcantara 5205 COVER Spec Sheet"), en: "Alcantara 5205 COVER Spec Sheet", ja: "Alcantara 5205 COVER 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5205 - COVER Spec sheet.pdf"
  },
  {
    title: { zh: chineseCopy("Alcantara 5466 Avant Spec Sheet"), en: "Alcantara 5466 Avant Spec Sheet", ja: "Alcantara 5466 Avant 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara 5466 - Avant.pdf"
  },
  {
    title: { zh: chineseCopy("Alcantara Bord FR 5056 Spec Sheet"), en: "Alcantara Bord FR 5056 Spec Sheet", ja: "Alcantara Bord FR 5056 仕様書" },
    href: "/uploads/spec/Alcantara/Alcantara Bord FR 5056.pdf"
  }
].map((download) => ({
  ...download,
  description: {
    zh: chineseCopy("Technical specification PDF for Alcantara article selection."), en: "Technical specification PDF for Alcantara article selection.",
    ja: "Alcantara 品番選定のための技術仕様PDF。"
  },
  type: "technical"
}));

const publicDownloadSupplements: Download[] = [
  {
    title: { zh: chineseCopy("Alcantara Automotive Colors"), en: "Alcantara Automotive Colors", ja: "Alcantara 自動車向けカラー" },
    description: {
      zh: chineseCopy("Colour reference for Alcantara automotive programs."), en: "Colour reference for Alcantara automotive programs.",
      ja: "Alcantara 自動車用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-automotive-colors.pdf",
    type: "catalog"
  },
  {
    title: { zh: chineseCopy("Alcantara Consumer Electronics Colors"), en: "Alcantara Consumer Electronics Colors", ja: "Alcantara コンシューマーエレクトロニクス向けカラー" },
    description: {
      zh: chineseCopy("Colour reference for Alcantara consumer electronics applications."), en: "Colour reference for Alcantara consumer electronics applications.",
      ja: "Alcantara コンシューマーエレクトロニクス用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-consumer-electronics-colors.pdf",
    type: "catalog"
  },
  {
    title: {
      zh: chineseCopy("Alcantara Interiors, Marine & Aviation Indoor Colors"), en: "Alcantara Interiors, Marine & Aviation Indoor Colors",
      ja: "Alcantara インテリア、マリン、航空機インドアカラー"
    },
    description: {
      zh: chineseCopy("Colour reference for Alcantara indoor interiors, marine, and aviation applications."), en: "Colour reference for Alcantara indoor interiors, marine, and aviation applications.",
      ja: "Alcantara のインドアインテリア、マリン、航空機用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-interiors-marine-aviation-indoor.pdf",
    type: "catalog"
  },
  {
    title: {
      zh: chineseCopy("Alcantara Interiors, Marine Outdoor EXO Colors"), en: "Alcantara Interiors, Marine Outdoor EXO Colors",
      ja: "Alcantara インテリア、マリンアウトドア EXO カラー"
    },
    description: {
      zh: chineseCopy("Colour reference for Alcantara outdoor EXO and marine exterior applications."), en: "Colour reference for Alcantara outdoor EXO and marine exterior applications.",
      ja: "Alcantara EXO とマリン屋外用途向けカラーリファレンス。"
    },
    href: "/uploads/alcantara/swatches/alcantara-interiors-marine-outdoor-exo.pdf",
    type: "catalog"
  },
  {
    title: { zh: chineseCopy("Alcantara Material Maintenance Guide"), en: "Alcantara Material Maintenance Guide", ja: "Alcantara 素材メンテナンスガイド" },
    description: {
      zh: chineseCopy("Recommended maintenance and cleaning instructions for Alcantara materials."), en: "Recommended maintenance and cleaning instructions for Alcantara materials.",
      ja: "Alcantara 素材の推奨メンテナンスおよび清掃手順。"
    },
    href: "/uploads/spec/Alcantara/Instructions-for-maintenance-of-alcantara-material.pdf",
    type: "care"
  },
  {
    title: { zh: chineseCopy("Understanding Your Leather Purchase"), en: "Understanding Your Leather Purchase", ja: "レザー購入ガイド" },
    description: {
      zh: chineseCopy("Natural hide size, markings, and leather purchase guidance."), en: "Natural hide size, markings, and leather purchase guidance.",
      ja: "天然皮革のサイズ、自然な跡、購入時の確認事項。"
    },
    href: "/uploads/page-insert/understand-leather.pdf",
    type: "technical"
  },
  {
    title: { zh: chineseCopy("Microfiber Leather Aquapelle Spec Sheet"), en: "Microfiber Leather Aquapelle Spec Sheet", ja: "Microfiber Leather Aquapelle 仕様書" },
    description: {
      zh: chineseCopy("Technical specifications for Microfiber Leather Aquapelle."), en: "Technical specifications for Microfiber Leather Aquapelle.",
      ja: "Microfiber Leather Aquapelle の技術仕様PDF。"
    },
    href: "/uploads/spec/vegan leather/aquapelle-spec-sheet.pdf",
    type: "technical"
  },
  {
    title: { zh: chineseCopy("skai Faux Leather Cleaning & Care"), en: "skai Faux Leather Cleaning & Care", ja: "skai フェイクレザー清掃・ケア" },
    description: {
      zh: chineseCopy("Cleaning and care instructions for skai faux leather."), en: "Cleaning and care instructions for skai faux leather.",
      ja: "skai フェイクレザーの清掃・ケア手順。"
    },
    href: "/uploads/veganleather/skai/Download/2021-01_EN_Cleaning-Care_Faux-Leather_detail.pdf",
    type: "care"
  },
  {
    title: { zh: chineseCopy("skai Clean and Care"), en: "skai Clean and Care", ja: "skai Clean and Care" },
    description: {
      zh: chineseCopy("General cleaning and care guide for skai materials."), en: "General cleaning and care guide for skai materials.",
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

export function createDownloadGroups(catalogs: Download[], productDownloads: Download[]): DownloadGroup[] {
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
      byHref("/uploads/spec/Alcantara/Instructions-for-maintenance-of-alcantara-material.pdf"),
      byHref("/uploads/veganleather/skai/Download/2021-01_EN_Cleaning-Care_Faux-Leather_detail.pdf"),
      byHref("/uploads/veganleather/skai/Download/clean and care.pdf")
    ].filter((download): download is Download => Boolean(download))
  ]);

  return [
    {
      slug: "catalogs",
      label: { zh: chineseCopy("Catalogs"), en: "Catalogs", ja: "カタログ" },
      intro: {
        zh: chineseCopy("Core catalog files and broad material references for early project review."), en: "Core catalog files and broad material references for early project review.",
        ja: "初期検討に使える主要カタログと素材リファレンス。"
      },
      downloads: availableDownloads(catalogs)
    },
    {
      slug: "alcantara",
      label: { zh: chineseCopy("Alcantara"), en: "Alcantara", ja: "Alcantara" },
      intro: {
        zh: chineseCopy("Technical sheets and color references for Alcantara articles."), en: "Technical sheets and color references for Alcantara articles.",
        ja: "Alcantara 品番の技術資料とカラーリファレンス。"
      },
      downloads: availableDownloads(alcantaraDownloads)
    },
    {
      slug: "leather",
      label: { zh: chineseCopy("Leather"), en: "Leather", ja: "レザー" },
      intro: {
        zh: chineseCopy("Leather specification sheets and purchase guidance."), en: "Leather specification sheets and purchase guidance.",
        ja: "レザー仕様書と購入時の確認資料。"
      },
      downloads: availableDownloads(leatherDownloads)
    },
    {
      slug: "vegan-leather",
      label: { zh: chineseCopy("Vegan Leather"), en: "Vegan Leather", ja: "合成皮革" },
      intro: {
        zh: chineseCopy("Aquapelle and synthetic leather technical documents."), en: "Aquapelle and synthetic leather technical documents.",
        ja: "Aquapelle と合成レザーの技術資料。"
      },
      downloads: availableDownloads(veganLeatherDownloads)
    },
    {
      slug: "care",
      label: { zh: chineseCopy("Care & Maintenance"), en: "Care & Maintenance", ja: "ケア・メンテナンス" },
      intro: {
        zh: chineseCopy("Cleaning and maintenance files for material handling."), en: "Cleaning and maintenance files for material handling.",
        ja: "仕様決定後の素材取り扱いに関する清掃・メンテナンス資料。"
      },
      downloads: availableDownloads(careDownloads)
    }
  ].filter((group) => group.downloads.length > 0);
}


export const downloadPageCopy = {
  title: { zh: chineseCopy("Downloads"), en: "Downloads", ja: "ダウンロード" },
  subtitle: { zh: chineseCopy("PDF catalogs and technical sheets"), en: "PDF catalogs and technical sheets", ja: "PDF カタログと技術資料" },
  heading: { zh: chineseCopy("Material documents for review and specification."), en: "Material documents for review and specification.", ja: "確認と仕様検討のための素材資料。" },
  description: { zh: chineseCopy("Download the latest catalogs and technical sheets prepared for project review, specification, and client sharing."), en: "Download the latest catalogs and technical sheets prepared for project review, specification, and client sharing.", ja: "プロジェクト確認、仕様検討、クライアント共有に使える最新版のカタログと技術資料をダウンロードいただけます。" },
  availableFilesLabel: { zh: chineseCopy("Available files"), en: "Available files", ja: "利用可能なファイル" },
  downloadLabel: { zh: chineseCopy("Download"), en: "Download", ja: "ダウンロード" },
  fileLabel: { zh: chineseCopy("files"), en: "files", ja: "ファイル" }
};

export type DownloadPageSettings = typeof downloadPageCopy & { groups: DownloadGroup[] };
