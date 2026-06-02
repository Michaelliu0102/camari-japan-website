import { siteConfig } from "./site-config";

export const locales = ["en", "ja"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "ja" : "en";
}

export function normalizePublicPath(path = ""): string {
  const normalized = path ? (path.startsWith("/") ? path : `/${path}`) : "/";
  const withoutLocalePrefix = normalized.replace(/^\/(?:en|ja)(?=\/|$)/, "");

  if (!withoutLocalePrefix || withoutLocalePrefix === "/") {
    return "/";
  }

  return withoutLocalePrefix.startsWith("/") ? withoutLocalePrefix : `/${withoutLocalePrefix}`;
}

export function localizedPath(_locale: Locale, path = ""): string {
  const normalizedPath = normalizePublicPath(path);

  if (siteConfig.enableLocalePreview && _locale !== siteConfig.defaultLocale) {
    return normalizedPath === "/" ? `/${_locale}` : `/${_locale}${normalizedPath}`;
  }

  return normalizedPath;
}
