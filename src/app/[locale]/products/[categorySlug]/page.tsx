import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProductCategorySummary } from "@/components/ProductCategorySummary";
import { ProductBusinessInformation } from "@/components/ProductBusinessInformation";
import { ProductCurvedCarousel } from "@/components/ProductCurvedCarousel";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/content";
import { getJapaneseProductCategorySeo } from "@/lib/japanese-copy";
import type { Locale } from "@/lib/locales";
import { buildProductCategoryJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { productCategories } from "@/content/products/categories";
import { loadProductBusinessSettings, loadProductCategory } from "@/sanity/lib/loaders";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: Locale; categorySlug: string }>;
};

export async function generateStaticParams() {
  return productCategories.map((cat) => ({
    categorySlug: cat.slug
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const category = await loadProductCategory(categorySlug);
  const japaneseSeo = locale === "ja" ? getJapaneseProductCategorySeo(categorySlug) : undefined;

  if (!category) {
    return createPageMetadata({
      locale,
      path: "/products",
      title: `Products | ${site.name}`,
      description: ""
    });
  }

  return createPageMetadata({
    locale,
    path: `/products/${categorySlug}`,
    title:
      category.seo?.title[locale] ||
      japaneseSeo?.title ||
      `${category.title[locale]} | ${site.name}`,
    description:
      category.seo?.description[locale] ||
      japaneseSeo?.description ||
      category.description[locale],
    image: category.seo?.image || category.heroImage
  });
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { locale, categorySlug } = await params;
  const [category, businessInformation] = await Promise.all([
    loadProductCategory(categorySlug),
    loadProductBusinessSettings()
  ]);

  if (!category) {
    notFound();
  }

  const categoryPath = `/products/${category.slug}`;
  const categorySchema = buildProductCategoryJsonLd(siteConfig, {
    name: category.title[locale],
    description: category.description[locale],
    path: categoryPath,
    locale,
    items: (category.curvedCarouselImages ?? []).map((item, index) => ({
      name: item.title[locale],
      description: item.description[locale],
      image: item.src,
      path: `${categoryPath}#product-summary-${index}`
    }))
  });

  if (category.curvedCarouselImages) {
    return (
      <main>
        <JsonLd data={categorySchema} />
        <ProductCurvedCarousel
          categorySlug={category.slug}
          images={category.curvedCarouselImages}
          locale={locale}
          subtitle={category.subtitle[locale]}
          title={category.title[locale]}
        />
        <ProductCategorySummary category={category} locale={locale} />
        <ProductBusinessInformation content={businessInformation} locale={locale} variant="compact" />
      </main>
    );
  }

  return (
    <main>
      <JsonLd data={categorySchema} />
      <PageHero
        image={category.heroImage}
        subtitle={category.subtitle[locale]}
        title={category.title[locale]}
      />
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label-caps text-gold">Capability</p>
            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              {category.description[locale]}
            </h2>
          </div>
          <div className="grid gap-8 md:col-span-6 md:col-start-7">
            {category.highlights.map((item, index) => (
              <article className="border-b border-charcoal/10 pb-8" key={index}>
                <h3 className="font-serif text-2xl">{item.title[locale]}</h3>
                <p className="mt-4 leading-8 text-muted">{item.body[locale]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ProductBusinessInformation content={businessInformation} locale={locale} variant="compact" />
      <CTASection
        body={
          locale === "en"
            ? "Share your use case, finish target, and production requirements to discuss the right material program."
            : "用途、仕上げの方向性、生産条件を共有いただくことで、最適な素材プログラムをご提案します。"
        }
        locale={locale}
        title={
          locale === "en"
            ? `Discuss a surface program with ${site.organizationName}.`
            : `${site.organizationName} とサーフェス開発をご相談ください。`
        }
      />
    </main>
  );
}
