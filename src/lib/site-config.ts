import type { Locale } from "./locales";

export type SiteKey = "global" | "japan";

type SiteContact = {
  email: string;
  phone: string;
  address: Record<Locale, string>;
};

export type SiteConfig = {
  siteKey: SiteKey;
  siteUrl: string;
  siteName: string;
  organizationName: string;
  defaultLocale: Locale;
  sanityMarket: SiteKey;
  alternateSiteHomeUrl: string;
  enableLocalePreview: boolean;
  slogan: Record<Locale, string>;
  description: Record<Locale, string>;
  contact: SiteContact;
};

type EnvSource = Partial<Record<string, string | undefined>>;

const KNOWN_BRAND_NAMES = ["CAMARI JAPAN", "CAMARI INTERNATIONAL", "CAMARI INTERNATIONAL JAPAN"];

const defaultSites: Record<SiteKey, Omit<SiteConfig, "siteUrl" | "alternateSiteHomeUrl" | "enableLocalePreview"> & { defaultSiteUrl: string; defaultAlternateSiteHomeUrl: string }> = {
  global: {
    siteKey: "global",
    siteName: "CAMARI INTERNATIONAL",
    organizationName: "CAMARI INTERNATIONAL",
    defaultLocale: "en",
    sanityMarket: "global",
    defaultSiteUrl: "https://www.camari-international.com",
    defaultAlternateSiteHomeUrl: "/",
    slogan: {
      en: "The Intersection of Texture and Precision",
      ja: "質感と精密さの交差点"
    },
    description: {
      en: "Premium materials, Alcantara collections, and OEM/ODM surfaces for refined automotive, interior, and product spaces.",
      ja: "上質な素材、Alcantara コレクション、OEM/ODM による空間・車両・プロダクト向けサーフェス。"
    },
    contact: {
      email: "info@camari-international.co.jp",
      phone: "+81 3 0000 0000",
      address: {
        en: "Room 403, 1-14-16 Kudan-kita, Chiyoda-ku, Tokyo 102-0073, Japan",
        ja: "〒102-0073 東京都千代田区九段北1丁目14-16 403号室"
      }
    }
  },
  japan: {
    siteKey: "japan",
    siteName: "CAMARI INTERNATIONAL JAPAN",
    organizationName: "CAMARI INTERNATIONAL JAPAN",
    defaultLocale: "ja",
    sanityMarket: "japan",
    defaultSiteUrl: "https://www.camari.co.jp",
    defaultAlternateSiteHomeUrl: "/",
    slogan: {
      en: "The Intersection of Texture and Precision",
      ja: "質感と精密さの交差点"
    },
    description: {
      en: "Premium materials, Alcantara collections, and OEM/ODM surfaces for refined automotive, interior, and product spaces.",
      ja: "上質な素材、Alcantara コレクション、OEM/ODM による空間・車両・プロダクト向けサーフェス。"
    },
    contact: {
      email: "info@camari-international.co.jp",
      phone: "+81 3 0000 0000",
      address: {
        en: "Room 403, 1-14-16 Kudan-kita, Chiyoda-ku, Tokyo 102-0073, Japan",
        ja: "〒102-0073 東京都千代田区九段北1丁目14-16 403号室"
      }
    }
  }
};

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function normalizeHomeTarget(target: string): string {
  const normalized = target.trim();

  if (!normalized || normalized === "/") {
    return "/";
  }

  return trimTrailingSlash(normalized);
}

function getSiteKey(env: EnvSource): SiteKey {
  return env.NEXT_PUBLIC_SITE_KEY === "global" ? "global" : "japan";
}

export function resolveSiteConfig(env: EnvSource = process.env): SiteConfig {
  const siteKey = getSiteKey(env);
  const defaults = defaultSites[siteKey];
  const siteUrl = trimTrailingSlash(env.NEXT_PUBLIC_SITE_URL || defaults.defaultSiteUrl);
  const configuredAlternateSiteHomeUrl = env.NEXT_PUBLIC_ALTERNATE_SITE_HOME_URL?.trim();
  const alternateSiteHomeUrl = normalizeHomeTarget(configuredAlternateSiteHomeUrl || defaults.defaultAlternateSiteHomeUrl);
  const siteName = env.NEXT_PUBLIC_SITE_NAME || defaults.siteName;
  const organizationName = env.NEXT_PUBLIC_ORGANIZATION_NAME || defaults.organizationName;
  const configuredLocale = env.NEXT_PUBLIC_DEFAULT_LOCALE;
  const defaultLocale: Locale = configuredLocale === "en" || configuredLocale === "ja" ? configuredLocale : defaults.defaultLocale;
  const configuredMarket = env.NEXT_PUBLIC_SANITY_MARKET;
  const sanityMarket: SiteKey = configuredMarket === "global" || configuredMarket === "japan" ? configuredMarket : defaults.sanityMarket;

  if (process.env.NODE_ENV === "production" && /example\.com$/i.test(siteUrl)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set to a production domain before building SEO metadata.");
  }

  return {
    siteKey,
    siteUrl,
    siteName,
    organizationName,
    defaultLocale,
    sanityMarket,
    alternateSiteHomeUrl,
    enableLocalePreview: !configuredAlternateSiteHomeUrl && process.env.NODE_ENV !== "production",
    slogan: defaults.slogan,
    description: defaults.description,
    contact: defaults.contact
  };
}

export const siteConfig = resolveSiteConfig();

export function replaceSiteBrand(text: string, replacement: string): string {
  return KNOWN_BRAND_NAMES.reduce((value, brand) => value.replaceAll(brand, replacement), text);
}

export function formatPageTitle(title: string, site: Pick<SiteConfig, "siteName"> = siteConfig): string {
  const titleWithCurrentBrand = replaceSiteBrand(title, site.siteName).trim();
  let base = titleWithCurrentBrand;

  for (const brand of KNOWN_BRAND_NAMES) {
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    base = base.replace(new RegExp(`^${escaped}\\s*\\|\\s*`, "i"), "");
    base = base.replace(new RegExp(`\\s*\\|\\s*${escaped}$`, "i"), "");
  }

  base = base.trim();

  if (!base) {
    return site.siteName;
  }

  if (base.toLowerCase() === site.siteName.toLowerCase()) {
    return site.siteName;
  }

  return `${base} | ${site.siteName}`;
}
