import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { localizedPath, type Locale } from "@/lib/locales";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { loadSkaiVinylArticles } from "@/lib/skai-vinyl";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { loadMaterial, loadProductTypes, loadSkus } from "@/sanity/lib/loaders";

export const dynamic = "force-dynamic";

const skaiVinylHeroImage = "/uploads/veganleather/skai Hero.jpg";
const leatherInteriorHeroImage = "/uploads/hero/Leather-interior.jpg";
const automotiveLeatherArticleSlug = "automotive-nappa";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string; productTypeSlug: string }>;
};

function isVinylArticlePage(locale: Locale, materialSlug: string, productTypeSlug: string): boolean {
  return locale === "en" && materialSlug === "vegan-leather" && productTypeSlug === "vinyl";
}

function isLeatherInteriorPage(materialSlug: string, productTypeSlug: string): boolean {
  return materialSlug === "leather" && productTypeSlug === "interior";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug, productTypeSlug } = await params;

  if (isLeatherInteriorPage(materialSlug, productTypeSlug)) {
    return createPageMetadata({
      locale,
      path: "/materials/leather/interior",
      title: locale === "en" ? "Interior Leather Articles | CAMARI JAPAN" : "インテリアレザー記事 | CAMARI JAPAN",
      description:
        locale === "en"
          ? "Explore refined bovine leather articles for interior, hospitality, marine, design, and bespoke upholstery programs."
          : "インテリア、ホスピタリティ、マリン、デザイン、特注張り地向けの上質な牛革記事をご覧ください。"
    });
  }

  if (isVinylArticlePage(locale, materialSlug, productTypeSlug)) {
    return createPageMetadata({
      locale,
      path: "/materials/vegan-leather/vinyl",
      title: "Vinyl Articles | CAMARI JAPAN",
      description: "Vinyl surface articles from the skai collection.",
      image: skaiVinylHeroImage
    });
  }

  return {};
}

export default async function VinylArticlePage({ params }: PageProps) {
  const { locale, materialSlug, productTypeSlug } = await params;

  if (isLeatherInteriorPage(materialSlug, productTypeSlug)) {
    return <LeatherInteriorPage locale={locale} />;
  }

  if (isVinylArticlePage(locale, materialSlug, productTypeSlug)) {
    return <VinylCollectionPage locale={locale} materialSlug={materialSlug} />;
  }

  notFound();
}

async function VinylCollectionPage({ locale, materialSlug }: { locale: Locale; materialSlug: string }) {
  const [material, articles] = await Promise.all([loadMaterial(materialSlug), loadSkaiVinylArticles()]);

  if (!material || articles.length === 0) {
    notFound();
  }

  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: "Home", path: "/" },
    { name: "Materials", path: "/materials" },
    { name: material.name.en, path: `/materials/${material.slug}` },
    { name: "Vinyl", path: `/materials/${material.slug}/vinyl` }
  ]);

  return (
    <ArticleCollectionShell
      articles={articles.map((article) => ({
        slug: article.slug,
        name: article.name,
        coverImage: article.coverImage,
        colorCount: article.colorCount,
        href: `/materials/${material.slug}/${article.slug}/${article.firstSkuSlug}`
      }))}
      breadcrumbSchema={breadcrumbSchema}
      eyebrow="Vegan Leather"
      heading="skai collection"
      heroImage={skaiVinylHeroImage}
      intro="Contract vinyl surfaces selected for upholstery, panels, and exterior-facing programs."
      label="Vinyl Article"
      locale={locale}
      subtitle="comfortable solution for variety of applications"
      title="skai"
    />
  );
}

async function LeatherInteriorPage({ locale }: { locale: Locale }) {
  const [material, productTypes, skus] = await Promise.all([loadMaterial("leather"), loadProductTypes(), loadSkus()]);

  if (!material) {
    notFound();
  }

  const articles = productTypes
    .filter((productType) => productType.materialSlug === "leather" && productType.slug !== automotiveLeatherArticleSlug)
    .map((productType) => {
      const articleSkus = skus.filter((sku) => sku.materialSlug === "leather" && sku.productTypeSlug === productType.slug);
      const firstSku = articleSkus[0];

      if (!firstSku) {
        return null;
      }

      return {
        slug: productType.slug,
        name: productType.name[locale],
        coverImage: productType.seo.image ?? firstSku.previewImage ?? firstSku.image,
        colorCount: articleSkus.length,
        href: `/materials/leather/${productType.slug}/${firstSku.slug}`
      };
    })
    .filter((article): article is ArticleCollectionItem => Boolean(article));

  if (articles.length === 0) {
    notFound();
  }

  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: "Home", path: "/" },
    { name: "Materials", path: "/materials" },
    { name: material.name.en, path: `/materials/${material.slug}` },
    { name: "Interior", path: `/materials/${material.slug}/interior` }
  ]);

  return (
    <ArticleCollectionShell
      articles={articles}
      breadcrumbSchema={breadcrumbSchema}
      eyebrow={locale === "en" ? "Leather" : "レザー"}
      heading={locale === "en" ? "interior leather collection" : "インテリアレザーコレクション"}
      heroImage={leatherInteriorHeroImage}
      intro={
        locale === "en"
          ? "Refined bovine leathers selected for interiors, hospitality, marine, design, and bespoke upholstery programs."
          : "インテリア、ホスピタリティ、マリン、デザイン、特注張り地向けに選定した上質な牛革コレクション。"
      }
      label={locale === "en" ? "Interior Article" : "インテリア記事"}
      locale={locale}
      subtitle={
        locale === "en"
          ? "From heavy-duty pigment leather to prestige full grain leather"
          : "From heavy-duty pigment leather to prestige full grain leather"
      }
      title="Interior"
    />
  );
}

type ArticleCollectionItem = {
  slug: string;
  name: string;
  coverImage: string;
  colorCount: number;
  href: string;
};

function ArticleCollectionShell({
  articles,
  breadcrumbSchema,
  eyebrow,
  heading,
  heroImage,
  intro,
  label,
  locale,
  subtitle,
  title
}: {
  articles: ArticleCollectionItem[];
  breadcrumbSchema: Record<string, unknown>;
  eyebrow: string;
  heading: string;
  heroImage: string;
  intro: string;
  label: string;
  locale: Locale;
  subtitle: string;
  title: string;
}) {
  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      <PageHero eyebrow={eyebrow} image={heroImage} subtitle={subtitle} title={title} />
      <section className="bg-paper py-20 md:py-28" data-nav-invert>
        <div className="section-shell">
          <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="label-caps text-gold">{label}</p>
              <h2 className="mt-5 font-label text-3xl uppercase tracking-[0.12em] md:text-4xl">{heading}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted md:col-span-5 md:justify-self-end md:text-right">
              {intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <article className="group block" key={article.slug}>
                <div className="relative aspect-square overflow-hidden bg-stone shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-material">
                  <Image
                    alt={article.name}
                    className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    src={article.coverImage}
                  />
                  <Link
                    aria-label={article.name}
                    className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
                    href={localizedPath(locale, article.href)}
                    id={article.slug}
                  />
                </div>
                <div className="pt-7 text-center">
                  <h3 className="label-caps text-charcoal">{article.name.toUpperCase()}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {article.colorCount} {locale === "en" ? "colours" : "colours"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
