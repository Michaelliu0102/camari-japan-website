import { chineseCopy } from "../../china/copy";
import { downloadPageCopy, type DownloadGroup, type DownloadPageSettings } from "@/content/downloads";
import type { RawDownload } from "./queries";

export type RawDownloadPage = Partial<typeof downloadPageCopy> & {
  groups?: Array<Partial<Omit<DownloadGroup, "downloads">> & { downloads?: RawDownload[] }> | null;
};

export const downloadPageQuery = `*[_type == "downloadPage" && _id == "downloadPageSettings"][0] {
  title, subtitle, heading, description, availableFilesLabel, downloadLabel, fileLabel,
  groups[] {slug, label, intro, downloads[] {title, description, type, "href": coalesce(file.asset->url, href)}}
}`;

export function adaptDownloadPage(raw: RawDownloadPage): DownloadPageSettings {
  return {
    ...Object.fromEntries(Object.entries(downloadPageCopy).map(([key, value]) => [key, raw[key as keyof typeof downloadPageCopy] ?? value])) as typeof downloadPageCopy,
    groups: (raw.groups ?? []).map(group => ({
      slug: group.slug ?? "", label: group.label ?? { zh: chineseCopy(""), en: "", ja: "" }, intro: group.intro ?? { zh: chineseCopy(""), en: "", ja: "" },
      downloads: (group.downloads ?? []).filter(item => Boolean(item.href)).map(item => ({
        title: item.title ?? { zh: chineseCopy(""), en: "", ja: "" }, description: item.description ?? { zh: chineseCopy(""), en: "", ja: "" },
        href: item.href ?? "", type: item.type ?? "technical"
      }))
    })).filter(group => group.slug && group.downloads.length)
  };
}
