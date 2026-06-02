import type { Metadata } from "next";
import { localizedPath, type Locale } from "./locales";
import { formatPageTitle, replaceSiteBrand, siteConfig } from "./site-config";

type MetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
};

export function createPageMetadata({ locale, path = "", title, description, image }: MetadataInput): Metadata {
  const pathname = localizedPath(locale, path);
  const url = new URL(pathname, `${siteConfig.siteUrl}/`);
  const normalizedTitle = formatPageTitle(title);
  const normalizedDescription = replaceSiteBrand(description, siteConfig.organizationName);

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    alternates: {
      canonical: url.toString()
    },
    openGraph: {
      title: normalizedTitle,
      description: normalizedDescription,
      url: url.toString(),
      siteName: siteConfig.siteName,
      locale,
      type: "website",
      images: image ? [{ url: image }] : undefined
    }
  };
}
