import { chinaSiteDefaults } from "../china/defaults";
import { normalizePublicPath, type Locale } from "./locales";
import { getSeoBrandName, type SiteConfig } from "./site-config";

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

type CollectionItemEntry = {
  name: string;
  description: string;
  path: string;
  image?: string;
};

type ProductCategoryEntry = {
  name: string;
  description: string;
  path: string;
  items: CollectionItemEntry[];
  locale: Locale;
};

type ProductVariantEntry = ProductEntry & {
  color: string;
};

type ProductGroupEntry = {
  name: string;
  description: string;
  path: string;
  image?: string;
  productGroupId: string;
  category?: string;
  locale: Locale;
  variants: ProductVariantEntry[];
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

function organizationReference(site: Pick<SiteConfig, "siteUrl">, locale: Locale) {
  if(locale === "zh") site={...site,siteUrl:"https://www.camari.com.cn"};
  return {
    "@type": "Organization",
    "@id": entityId(site, "organization"),
    name: getSeoBrandName(locale),
    url: new URL("/", `${site.siteUrl}/`).toString(),
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteResourceUrl(site, "/uploads/logo/black-int.png")
    }
  };
}

export function buildOrganizationJsonLd(
  site: Pick<SiteConfig, "siteUrl" | "legalName" | "contact">,
  locale: Locale
) {
  if(locale === "zh") site={...site,siteUrl:"https://www.camari.com.cn",legalName:chinaSiteDefaults.legalName,contact:{email:chinaSiteDefaults.contact.email!,phone:chinaSiteDefaults.contact.phone!,address:{en:chinaSiteDefaults.contact.address!,ja:chinaSiteDefaults.contact.address!,zh:chinaSiteDefaults.contact.address!}}};
  return {
    "@context": "https://schema.org",
    ...organizationReference(site, locale),
    legalName: site.legalName,
    email: site.contact.email,
    telephone: site.contact.phone,
    faxNumber: site.contact.fax
  };
}

export function buildLocalBusinessJsonLd(
  site: Pick<SiteConfig, "siteUrl" | "legalName" | "contact" | "defaultLocale">,
  locale: Locale
) {
  const { appointmentNotice, geo, openingHours, postalAddress } = site.contact;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": entityId(site, "organization"),
    name: getSeoBrandName(locale),
    legalName: site.legalName,
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
  if(locale === "zh") site={...site,siteUrl:"https://www.camari.com.cn",siteKey:"global"};
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": entityId(site, "website"),
    url: new URL("/", `${site.siteUrl}/`).toString(),
    name: getSeoBrandName(locale),
    alternateName: site.siteKey === "japan" ? ["CAMARI JAPAN", "CAMARI"] : "CAMARI",
    inLanguage: locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : "en",
    publisher: {
      "@id": entityId(site, "organization")
    }
  };
}

export function buildBreadcrumbJsonLd(site: Pick<SiteConfig, "siteUrl">, items: BreadcrumbEntry[], locale?:Locale) {
  if(locale === "zh")site={...site,siteUrl:"https://www.camari.com.cn"};
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

export function buildProductJsonLd(site: Pick<SiteConfig, "siteUrl">, product: ProductEntry, locale: Locale) {
  if(locale === "zh")site={...site,siteUrl:"https://www.camari.com.cn"};
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
      name: getSeoBrandName(locale)
    }
  };
}

export function buildProductGroupJsonLd(
  site: Pick<SiteConfig, "siteUrl">,
  productGroup: ProductGroupEntry
) {
  if(productGroup.locale === "zh")site={...site,siteUrl:"https://www.camari.com.cn"};
  const url = toAbsoluteUrl(site, productGroup.path);
  const brand = {
    "@type": "Brand",
    name: getSeoBrandName(productGroup.locale)
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": `${url}#product-group`,
    name: productGroup.name,
    description: productGroup.description,
    url,
    image: productGroup.image ? toAbsoluteResourceUrl(site, productGroup.image) : undefined,
    category: productGroup.category,
    brand,
    productGroupID: productGroup.productGroupId,
    variesBy: ["https://schema.org/color"],
    hasVariant: productGroup.variants.map((variant) => ({
      "@type": "Product",
      "@id": `${toAbsoluteUrl(site, variant.path)}#product`,
      name: variant.name,
      description: variant.description,
      url: toAbsoluteUrl(site, variant.path),
      image: variant.image ? toAbsoluteResourceUrl(site, variant.image) : undefined,
      sku: variant.sku,
      color: variant.color,
      category: variant.category || productGroup.category,
      brand,
      inProductGroupWithID: productGroup.productGroupId
    }))
  };
}

export function buildProductCategoryJsonLd(
  site: Pick<SiteConfig, "siteUrl">,
  category: ProductCategoryEntry
) {
  if(category.locale === "zh")site={...site,siteUrl:"https://www.camari.com.cn"};
  const url = toAbsoluteUrl(site, category.path);
  const breadcrumbId = `${url}#breadcrumb`;
  const itemListId = `${url}#itemlist`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: category.locale === "zh" ? "首页" : category.locale === "en" ? "Home" : "ホーム",
            item: toAbsoluteUrl(site, "/")
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category.locale === "zh" ? "产品" : category.locale === "en" ? "Products" : "製品",
            item: toAbsoluteUrl(site, "/products")
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: url
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: category.name,
        description: category.description,
        inLanguage: category.locale === "zh" ? "zh-CN" : category.locale === "ja" ? "ja-JP" : "en",
        breadcrumb: {
          "@id": breadcrumbId
        },
        mainEntity: {
          "@id": itemListId
        }
      },
      {
        "@type": "ItemList",
        "@id": itemListId,
        name: `${category.name} ${category.locale === "en" ? "product index" : "製品インデックス"}`,
        numberOfItems: category.items.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: category.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Thing",
            "@id": toAbsoluteUrl(site, item.path),
            name: item.name,
            description: item.description,
            image: item.image ? toAbsoluteResourceUrl(site, item.image) : undefined,
            url: toAbsoluteUrl(site, item.path)
          }
        }))
      }
    ]
  };
}

export function buildNewsArticleJsonLd(
  site: Pick<SiteConfig, "siteUrl">,
  article: NewsArticleEntry
) {
  if(article.locale === "zh")site={...site,siteUrl:"https://www.camari.com.cn"};
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
    inLanguage: article.locale === "zh" ? "zh-CN" : article.locale === "ja" ? "ja-JP" : "en",
    author: organizationReference(site, article.locale),
    publisher: organizationReference(site, article.locale)
  };
}
