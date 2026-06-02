import { normalizePublicPath } from "./locales";
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

function toAbsoluteUrl(site: Pick<SiteConfig, "siteUrl">, path: string): string {
  return new URL(normalizePublicPath(path), `${site.siteUrl}/`).toString();
}

export function buildOrganizationJsonLd(site: Pick<SiteConfig, "siteUrl" | "organizationName" | "contact">) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.organizationName,
    url: site.siteUrl,
    email: site.contact.email,
    telephone: site.contact.phone
  };
}

export function buildLocalBusinessJsonLd(site: Pick<SiteConfig, "siteUrl" | "organizationName" | "contact" | "defaultLocale">) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.organizationName,
    url: site.siteUrl,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: site.contact.address[site.defaultLocale]
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
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: product.category,
    image: product.image,
    url: toAbsoluteUrl(site, product.path),
    brand: {
      "@type": "Brand",
      name: site.organizationName
    }
  };
}
