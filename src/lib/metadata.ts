import type { Metadata } from "next";
import { site } from "./content";
import { locales, localizedPath, type Locale } from "./locales";

type MetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
};

export function createPageMetadata({ locale, path = "", title, description, image }: MetadataInput): Metadata {
  const pathname = localizedPath(locale, path);
  const url = new URL(pathname, site.url);

  return {
    title,
    description,
    alternates: {
      canonical: url.toString(),
      languages: Object.fromEntries(locales.map((item) => [item, new URL(localizedPath(item, path), site.url).toString()]))
    },
    openGraph: {
      title,
      description,
      url: url.toString(),
      siteName: site.name,
      locale,
      type: "website",
      images: image ? [{ url: image }] : undefined
    }
  };
}
