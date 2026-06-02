import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { productCategories } from "@/content/products/categories";
import { site } from "@/lib/content";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/locales";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: "/products",
    title: locale === "en" ? `Products | ${site.name}` : `製品 | ${site.name}`,
    description:
      locale === "en"
        ? `Browse ${site.organizationName} surface programs for automotive interiors, technology accessories, lifestyle goods, and corporate gifts.`
        : `自動車インテリア、テックアクセサリー、ライフスタイル用品、法人ギフト向けの ${site.organizationName} サーフェスプログラムをご覧ください。`,
    image: productCategories[0]?.heroImage
  });
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  const heroCategory = productCategories[0];

  return (
    <main>
      {heroCategory ? (
        <PageHero
          image="/uploads/product/product-hero5.jpg"
          subtitle={
            locale === "en"
              ? "Surface programs organized by product context and customer use"
              : "製品用途と顧客体験に合わせたサーフェスプログラム"
          }
          title="Product"
        />
      ) : null}
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label-caps text-gold">Product Categories</p>
            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              {locale === "en" ? "Material decisions shaped around the finished object." : "完成品から逆算する素材選定。"}
            </h2>
          </div>
          <div className="grid gap-8 md:col-span-7 md:col-start-6">
            {productCategories.map((category) => (
              <Link
                className="group border-b border-charcoal/10 pb-8 transition-colors hover:border-charcoal/35"
                href={localizedPath(locale, `/products/${category.slug}`)}
                key={category.slug}
              >
                <span className="label-caps text-gold/80">{category.subtitle[locale]}</span>
                <h3 className="mt-4 font-serif text-3xl leading-tight text-charcoal transition-colors group-hover:text-gold md:text-5xl">
                  {category.title[locale]}
                </h3>
                <p className="mt-5 max-w-2xl leading-8 text-muted">{category.description[locale]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        body={
          locale === "en"
            ? `Share the product context, target finish, and production constraints. ${site.organizationName} will help map material options to the program.`
            : `製品用途、目標仕上げ、生産条件をお知らせください。${site.organizationName} が素材候補を整理します。`
        }
        locale={locale}
        title={
          locale === "en"
            ? "Match the surface to the product experience."
            : "製品体験に合うサーフェスをご提案します。"
        }
      />
    </main>
  );
}
