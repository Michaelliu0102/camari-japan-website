import { chineseCopy } from "../china/copy";
import type { Locale } from "./locales";

export type SiteKey = "global" | "japan";

type SiteContact = {
  email: string;
  phone: string;
  fax?: string;
  address: Record<Locale, string>;
  postalAddress?: {
    streetAddress: Record<Locale, string>;
    addressLocality: Record<Locale, string>;
    addressRegion: Record<Locale, string>;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: {
    dayOfWeek: string[];
    opens: string;
    closes: string;
  };
  appointmentNotice?: Record<Locale, string>;
};

export type SiteConfig = {
  siteKey: SiteKey;
  siteUrl: string;
  localeSiteUrls: Record<Locale, string>;
  siteName: string;
  organizationName: string;
  legalName?: string;
  defaultLocale: Locale;
  sanityMarket: SiteKey;
  alternateSiteHomeUrl: string;
  enableLocalePreview: boolean;
  defaultOgImage: string;
  slogan: Record<Locale, string>;
  description: Record<Locale, string>;
  contact: SiteContact;
};

type EnvSource = Partial<Record<string, string | undefined>>;

const SEO_BRAND_NAMES: Record<Locale, string> = {
  zh: "卡玛瑞国际有限公司", en: "CAMARI INTERNATIONAL",
  ja: "カマリ・インターナショナル"
};
const KNOWN_BRAND_NAMES = [
  "CAMARI INTERNATIONAL JAPAN",
  "CAMARI INTERNATIONAL LIMITED",
  "CAMARI INTERNATIONAL",
  "CAMARI JAPAN",
  "カマリ・インターナショナル・ジャパン",
  "カマリ・インターナショナル",
  "カマリ・ジャパン"
];
const BRAND_NAME_PATTERN = new RegExp(
  KNOWN_BRAND_NAMES
    .sort((left, right) => right.length - left.length)
    .map((brand) => brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "gi"
);
const DEFAULT_LOCALE_SITE_URLS: Record<Locale, string> = {
  zh: "https://www.camari.com.cn", en: "https://www.camari-international.com",
  ja: "https://www.camari-international.co.jp"
};
const BUILD_ENABLE_LOCALE_PREVIEW = process.env.NEXT_PUBLIC_ENABLE_LOCALE_PREVIEW;
const DEFAULT_OG_IMAGE = "/uploads/hero/video/higgsfield/01-color-swatches-real-16x9-exact.jpg";

const defaultSites: Record<
  SiteKey,
  Omit<SiteConfig, "siteUrl" | "localeSiteUrls" | "alternateSiteHomeUrl" | "enableLocalePreview"> & {
    defaultSiteUrl: string;
    defaultAlternateSiteHomeUrl: string;
  }
> = {
  global: {
    siteKey: "global",
    siteName: "CAMARI INTERNATIONAL",
    organizationName: "CAMARI INTERNATIONAL",
    defaultLocale: "en",
    sanityMarket: "global",
    defaultSiteUrl: DEFAULT_LOCALE_SITE_URLS.en,
    defaultAlternateSiteHomeUrl: DEFAULT_LOCALE_SITE_URLS.ja,
    defaultOgImage: DEFAULT_OG_IMAGE,
    slogan: {
      zh: "Alcantara、真皮与面料供应及产品定制",
      en: "Alcantara, Leather & Fabric Supply · Custom Products",
      ja: "アルカンターラ・本革・生地の販売と製品製作"
    },
    description: {
      zh: chineseCopy("Premium materials, Alcantara collections, and OEM/ODM surfaces for refined automotive, interior, and product spaces."), en: "Premium materials, Alcantara collections, and OEM/ODM surfaces for refined automotive, interior, and product spaces.",
      ja: "上質な素材、Alcantara コレクション、OEM/ODM による空間・車両・プロダクト向けサーフェス。"
    },
    contact: {
      email: "info@camari-international.co.jp",
      phone: "+81 3 6272 4971",
      address: {
        zh: chineseCopy("Room 403, 1-14-16 Kudan-kita, Chiyoda-ku, Tokyo 102-0073, Japan"), en: "Room 403, 1-14-16 Kudan-kita, Chiyoda-ku, Tokyo 102-0073, Japan",
        ja: "〒102-0073 東京都千代田区九段北1丁目14-16 403号室"
      }
    }
  },
  japan: {
    siteKey: "japan",
    siteName: "CAMARI INTERNATIONAL JAPAN",
    organizationName: "CAMARI INTERNATIONAL JAPAN",
    legalName: "株式会社カマリ・インターナショナル・ジャパン",
    defaultLocale: "ja",
    sanityMarket: "japan",
    defaultSiteUrl: DEFAULT_LOCALE_SITE_URLS.ja,
    defaultAlternateSiteHomeUrl: DEFAULT_LOCALE_SITE_URLS.en,
    defaultOgImage: DEFAULT_OG_IMAGE,
    slogan: {
      zh: "Alcantara、真皮与面料供应及产品定制",
      en: "Alcantara, Leather & Fabric Supply · Custom Products",
      ja: "アルカンターラ・本革・生地の販売と製品製作"
    },
    description: {
      zh: chineseCopy("Premium materials, Alcantara collections, and OEM/ODM surfaces for refined automotive, interior, and product spaces."), en: "Premium materials, Alcantara collections, and OEM/ODM surfaces for refined automotive, interior, and product spaces.",
      ja: "上質な素材、Alcantara コレクション、OEM/ODM による空間・車両・プロダクト向けサーフェス。"
    },
    contact: {
      email: "info@camari-international.co.jp",
      phone: "03-6272-4971",
      fax: "03-6272-4972",
      address: {
        zh: chineseCopy("PILE KUDAN 4F, 1-14-16 Kudankita, Chiyoda-ku, Tokyo 102-0073, Japan"), en: "PILE KUDAN 4F, 1-14-16 Kudankita, Chiyoda-ku, Tokyo 102-0073, Japan",
        ja: "〒102-0073 東京都千代田区九段北1丁目14-16 PILE KUDAN 4F"
      },
      postalAddress: {
        streetAddress: {
          zh: chineseCopy("PILE KUDAN 4F, 1-14-16 Kudankita"), en: "PILE KUDAN 4F, 1-14-16 Kudankita",
          ja: "九段北1丁目14-16 PILE KUDAN 4F"
        },
        addressLocality: {
          zh: chineseCopy("Chiyoda-ku"), en: "Chiyoda-ku",
          ja: "千代田区"
        },
        addressRegion: {
          zh: chineseCopy("Tokyo"), en: "Tokyo",
          ja: "東京都"
        },
        postalCode: "102-0073",
        addressCountry: "JP"
      },
      geo: {
        latitude: 35.696335,
        longitude: 139.749207
      },
      openingHours: {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00"
      },
      appointmentNotice: {
        zh: chineseCopy("Visits are available by appointment at least one week in advance."), en: "Visits are available by appointment at least one week in advance.",
        ja: "ご来訪は1週間前までの事前予約制です。"
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
  return env.NEXT_PUBLIC_SITE_KEY === "japan" ? "japan" : "global";
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
  const defaultLocale: Locale = configuredLocale === "en" || configuredLocale === "ja" || configuredLocale === "zh" ? configuredLocale : defaults.defaultLocale;
  const localeSiteUrls: Record<Locale, string> = {
    zh: "https://www.camari.com.cn", en: trimTrailingSlash(env.NEXT_PUBLIC_EN_SITE_URL || (defaultLocale === "en" ? siteUrl : DEFAULT_LOCALE_SITE_URLS.en)),
    ja: trimTrailingSlash(env.NEXT_PUBLIC_JA_SITE_URL || (defaultLocale === "ja" ? siteUrl : DEFAULT_LOCALE_SITE_URLS.ja))
  };
  const configuredMarket = env.NEXT_PUBLIC_SANITY_MARKET;
  const sanityMarket: SiteKey = configuredMarket === "global" || configuredMarket === "japan" ? configuredMarket : defaults.sanityMarket;
  const configuredLocalePreview = (env.NEXT_PUBLIC_ENABLE_LOCALE_PREVIEW || BUILD_ENABLE_LOCALE_PREVIEW)?.trim().toLowerCase();
  const enableLocalePreview =
    configuredLocalePreview === "1" ||
    configuredLocalePreview === "true" ||
    (!configuredAlternateSiteHomeUrl && process.env.NODE_ENV !== "production");

  if (process.env.NODE_ENV === "production" && /example\.com$/i.test(siteUrl)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set to a production domain before building SEO metadata.");
  }

  return {
    siteKey,
    siteUrl,
    localeSiteUrls,
    siteName,
    organizationName,
    legalName: defaults.legalName,
    defaultLocale,
    sanityMarket,
    alternateSiteHomeUrl,
    enableLocalePreview,
    defaultOgImage: defaults.defaultOgImage,
    slogan: defaults.slogan,
    description: defaults.description,
    contact: defaults.contact
  };
}

export const siteConfig = resolveSiteConfig();

export function getSeoBrandName(locale: Locale): string {
  return SEO_BRAND_NAMES[locale];
}

export function replaceSiteBrand(text: string, replacement: string): string {
  return text.replace(BRAND_NAME_PATTERN, replacement);
}

export function formatPageTitle(title: string, locale: Locale = siteConfig.defaultLocale): string {
  const brandName = getSeoBrandName(locale);
  const titleWithCurrentBrand = replaceSiteBrand(title, brandName).trim();
  let base = titleWithCurrentBrand;

  for (const brand of [...KNOWN_BRAND_NAMES, ...Object.values(SEO_BRAND_NAMES)]) {
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    base = base.replace(new RegExp(`^${escaped}\\s*\\|\\s*`, "i"), "");
    base = base.replace(new RegExp(`\\s*\\|\\s*${escaped}$`, "i"), "");
  }

  base = base.trim();

  if (!base) {
    return brandName;
  }

  if (base.toLowerCase() === brandName.toLowerCase()) {
    return brandName;
  }

  return `${base} | ${brandName}`;
}
