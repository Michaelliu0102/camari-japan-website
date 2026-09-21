import { chineseCopy } from "../china/copy";
import Link from "next/link";
import type { Download as DownloadItem } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type DownloadPanelProps = {
  locale: Locale;
  downloads: DownloadItem[];
};

export function DownloadPanel({ locale, downloads }: DownloadPanelProps) {
  return (
    <div className="space-y-3">
      {downloads.map((download) => (
        <Link className="group flex items-start justify-between gap-4 border-b md:items-center md:gap-8 border-charcoal/10 py-5 transition-colors hover:border-charcoal/25" href={download.href} key={`${download.type}-${download.href}`}>
          <span>
            <span className="label-caps block text-[10px] text-charcoal">{download.title[locale]}</span>
            <span className="mt-1 block text-sm leading-7 text-muted md:text-[0.8rem] md:leading-relaxed">{download.description[locale]}</span>
          </span>
          <span className="label-caps shrink-0 text-[9px] text-muted transition-colors group-hover:text-charcoal">
            {locale === "zh" ? chineseCopy("Download") : locale === "en" ? "Download" : "ダウンロード"}
          </span>
        </Link>
      ))}
    </div>
  );
}
