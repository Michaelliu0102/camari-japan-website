import { normalizePublicPath, type Locale } from "./locales";
import type { SiteConfig } from "./site-config";

type BreadcrumbEntry = {
  name: string;
  path: string;
};

type ProductEntry = {
  name: string;
  description: string;
  path: string;
  image?: string;
  sku?: string;
  category?: string;
};

type NewsArticleEntry = {
  headline: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  articleSection?: string;
  locale: Locale;
};

function toAbsoluteUrl(site: Pick<SiteConfig, "siteUrl">, path: string): string {
  return new URL(normalizePublicPath(path), `${site.siteUrl}/`).toString();
}

function toAbsoluteResourceUrl(site: Pick<SiteConfig, "siteUrl">, resource: string): string {
  return new URL(resource, `${site.siteUrl}/`).toString();
}

function entityId(site: Pick<SiteConfig, "siteUrl">, entity: "organization" | "website"): string {
  return `${new URL("/", `${site.siteUrl}/`).toString()}#${entity}`;
}

function organizationReference(site: Pick<SiteConfig, "siteUrl" | "organizationName">) {
  return {
    "@type": "Organization",
    "@id": entityId(site, "organization"),
    name: site.organizationName,
    url: new URL("/", `${site.siteUrl}/`).toString(),
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteResourceUrl(site, "/uploads/logo/black-int.png")
    }
  };
}

export function buildOrganizationJsonLd(site: Pick<SiteConfig, "siteUrl" | "organizationName" | "legalName" | "contact">) {
  return {
    "@context": "https://schema.org",
    ...organizationReference(site),
    legalName: site.legalName,
    email: site.contact.email,
    telephone: site.contact.phone,
    faxNumber: site.contact.fax
  };
}

export function buildLocalBusinessJsonLd(
  site: Pick<SiteConfig, "siteUrl" | "organizationName" | "legalName" | "contact" | "defaultLocale">
) {
  const { appointmentNotice, geo, openingHours, postalAddress } = site.contact;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": entityId(site, "organization"),
    name: site.legalName ?? site.organizationName,
    alternateName: site.legalName ? site.organizationName : undefined,
    url: site.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteResourceUrl(site, "/uploads/logo/black-int.png")
    },
    email: site.contact.email,
    telephone: site.contact.phone,
    faxNumber: site.contact.fax,
    description: appointmentNotice?.[site.defaultLocale],
    address: postalAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: postalAddress.streetAddress[site.defaultLocale],
          addressLocality: postalAddress.addressLocality[site.defaultLocale],
          addressRegion: postalAddress.addressRegion[site.defaultLocale],
          postalCode: postalAddress.postalCode,
          addressCountry: postalAddress.addressCountry
        }
      : site.contact.address[site.defaultLocale],
    geo: geo
      ? {
          "@type": "GeoCoordinates",
          latitude: geo.latitude,
          longitude: geo.longitude
        }
      : undefined,
    openingHoursSpecification: openingHours
      ? {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: openingHours.dayOfWeek,
          opens: openingHours.opens,
          closes: openingHours.closes
        }
      : undefined
  };
}

export function buildWebSiteJsonLd(site: Pick<SiteConfig, "siteKey" | "siteUrl" | "siteName">, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": entityId(site, "website"),
    url: new URL("/", `${site.siteUrl}/`).toString(),
    name: site.siteName,
    alternateName: site.siteKey === "japan" ? ["CAMARI JAPAN", "CAMARI"] : "CAMARI",
    inLanguage: locale === "ja" ? "ja-JP" : "en",
    publisher: {
      "@id": entityId(site, "organization")
    }
  };
}

export function buildBreadcrumbJsonLd(site: Pick<SiteConfig, "siteUrl">, items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(site, item.path)
    }))
  };
}

export function buildProductJsonLd(site: Pick<SiteConfig, "siteUrl" | "organizationName">, product: ProductEntry) {
  const url = toAbsoluteUrl(site, product.path);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: product.category,
    image: product.image ? toAbsoluteResourceUrl(site, product.image) : undefined,
    url,
    brand: {
      "@type": "Brand",
      name: site.organizationName
    }
  };
}

export function buildNewsArticleJsonLd(
  site: Pick<SiteConfig, "siteUrl" | "organizationName">,
  article: NewsArticleEntry
) {
  const url = toAbsoluteUrl(site, article.path);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    headline: article.headline,
    description: article.description,
    image: [toAbsoluteResourceUrl(site, article.image)],
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    articleSection: article.articleSection,
    inLanguage: article.locale === "ja" ? "ja-JP" : "en",
    author: organizationReference(site),
    publisher: organizationReference(site)
  };
}
