import type { Metadata } from "next";
import { absoluteLocalizedUrl, type Locale } from "./locales";
import { formatPageTitle, getSeoBrandName, replaceSiteBrand, siteConfig } from "./site-config";

type MetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
  availableLocales?: readonly Locale[];
  article?: {
    publishedTime: string;
    modifiedTime?: string;
  };
};

const hreflangCodes: Record<Locale, string> = {
  en: "en",
  ja: "ja-JP"
};

const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  ja: "ja_JP"
};

export function createPageMetadata({
  locale,
  path = "",
  title,
  description,
  image,
  availableLocales = ["en", "ja"],
  article
}: MetadataInput): Metadata {
  const url = absoluteLocalizedUrl(locale, path);
  const seoBrandName = getSeoBrandName(locale);
  const normalizedTitle = formatPageTitle(title, locale);
  const normalizedDescription = replaceSiteBrand(description, seoBrandName);
  const socialImage = image || siteConfig.defaultOgImage;
  const languageAlternates = Object.fromEntries(
    availableLocales.map((availableLocale) => [hreflangCodes[availableLocale], absoluteLocalizedUrl(availableLocale, path)])
  );
  const defaultLocale = availableLocales.includes("en") ? "en" : locale;

  const openGraph: Metadata["openGraph"] = article
    ? {
        title: normalizedTitle,
        description: normalizedDescription,
        url,
        siteName: seoBrandName,
        locale: openGraphLocales[locale],
        alternateLocale: availableLocales
          .filter((availableLocale) => availableLocale !== locale)
          .map((availableLocale) => openGraphLocales[availableLocale]),
        type: "article",
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: [seoBrandName],
        images: [{ url: socialImage, alt: normalizedTitle }]
      }
    : {
        title: normalizedTitle,
        description: normalizedDescription,
        url,
        siteName: seoBrandName,
        locale: openGraphLocales[locale],
        alternateLocale: availableLocales
          .filter((availableLocale) => availableLocale !== locale)
          .map((availableLocale) => openGraphLocales[availableLocale]),
        type: "website",
        images: [{ url: socialImage, alt: normalizedTitle }]
      };

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1
      }
    },
    alternates: {
      canonical: url,
      languages: {
        ...languageAlternates,
        "x-default": absoluteLocalizedUrl(defaultLocale, path)
      }
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: normalizedTitle,
      description: normalizedDescription,
      images: [socialImage]
    }
  };
}
