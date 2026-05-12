import Link from "next/link";
import { Download } from "lucide-react";
import type { Download as DownloadItem } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type DownloadPanelProps = {
  locale: Locale;
  downloads: DownloadItem[];
};

export function DownloadPanel({ locale, downloads }: DownloadPanelProps) {
  return (
    <div className="space-y-4">
      {downloads.map((download) => (
        <Link className="group flex items-center justify-between border-b border-charcoal/15 py-5" href={download.href} key={`${download.type}-${download.href}`}>
          <span>
            <span className="label-caps block text-charcoal">{download.title[locale]}</span>
            <span className="mt-2 block text-sm leading-6 text-muted">{download.description[locale]}</span>
          </span>
          <Download className="shrink-0 transition-transform group-hover:translate-y-1" size={18} strokeWidth={1.4} />
        </Link>
      ))}
    </div>
  );
}
