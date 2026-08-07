import { siteConfig } from "./site-config";

export const locales = ["en", "ja"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "ja" : "en";
}

export function localizeBrandNames(text: string, locale: Locale): string {
  if (locale !== "ja") {
    return text;
  }

  return text
    .replace(/CAMARI INTERNATIONAL JAPAN/gi, "カマリ・インターナショナル・ジャパン")
    .replace(/CAMARI INTERNATIONAL/gi, "カマリ・インターナショナル")
    .replace(/CAMARI JAPAN/gi, "カマリ・ジャパン")
    .replace(/CAMARI/gi, "カマリ")
    .replace(/ALCANTARA/gi, "アルカンターラ");
}

export function normalizeLocalizedBrandNames<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeLocalizedBrandNames(item)) as T;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      key === "ja" && typeof nestedValue === "string"
        ? localizeBrandNames(nestedValue, "ja")
        : normalizeLocalizedBrandNames(nestedValue),
    ]),
  ) as T;
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
