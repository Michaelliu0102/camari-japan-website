import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { getProductCategory, productCategories } from "@/content/products/categories";
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
  const category = getProductCategory(categorySlug);

  if (!category) {
    return createPageMetadata({
      locale,
      path: "/products",
      title: "Products | CAMARI JAPAN",
      description: ""
    });
  }

  return createPageMetadata({
    locale,
    path: `/products/${categorySlug}`,
    title: locale === "en" ? `${category.title.en} | CAMARI JAPAN` : `${category.title.ja} | CAMARI JAPAN`,
    description: category.description[locale],
    image: category.heroImage
  });
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { locale, categorySlug } = await params;
  const category = getProductCategory(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <main>
      <PageHero
        image={category.heroImage}
        subtitle={category.subtitle[locale]}
        title={category.title[locale]}
      />
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-16 md:grid-cols-12">
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
            ? "Contact is currently handled by direct email and showroom appointment. A structured inquiry flow will be added later."
            : "現在のお問い合わせはメールとショールーム予約で対応します。構造化された問い合わせフォームは後日追加予定です。"
        }
        locale={locale}
        title={
          locale === "en"
            ? "Discuss a surface program with CAMARI JAPAN."
            : "CAMARI JAPAN とサーフェス開発をご相談ください。"
        }
      />
    </main>
  );
}