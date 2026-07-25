import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { ProductCurvedCarousel } from "@/components/ProductCurvedCarousel";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/content";
import type { Locale } from "@/lib/locales";
import { productCategories } from "@/content/products/categories";
import { loadProductCategory } from "@/sanity/lib/loaders";
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
    title: locale === "en" ? `${category.title.en} | ${site.name}` : `${category.title.ja} | ${site.name}`,
    description: category.description[locale],
    image: category.heroImage
  });
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { locale, categorySlug } = await params;
  const category = await loadProductCategory(categorySlug);

  if (!category) {
    notFound();
  }

  if (category.curvedCarouselImages) {
    return (
      <main>
        <ProductCurvedCarousel
          categorySlug={category.slug}
          heroImage={category.heroImage}
          images={category.curvedCarouselImages}
          locale={locale}
          subtitle={category.subtitle[locale]}
          title={category.title[locale]}
        />
      </main>
    );
  }

  return (
    <main>
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
