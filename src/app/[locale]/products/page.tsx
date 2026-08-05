import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import Showcase4, { type ShowcaseCategory, type ShowcaseProduct } from "@/components/blocks/showcase-4";
import { PageHero } from "@/components/PageHero";
import { productCategories } from "@/content/products/categories";
import { site } from "@/lib/content";
import { JAPANESE_PRODUCT_SURFACE_DESCRIPTION } from "@/lib/japanese-copy";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/locales";
import { createPageMetadata } from "@/lib/metadata";
import { loadHomePageSettings, loadProductCategories } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : {};
  const rawCategory = query.category;
  const initialCategory = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  const [categories, homeSettings] = await Promise.all([loadProductCategories(), loadHomePageSettings()]);
  const sourceCategories = categories.length ? categories : productCategories;
  const showcaseCategories: ShowcaseCategory[] = sourceCategories.map((category) => ({
    label: category.title[locale],
    slug: category.slug
  }));
  const items: ShowcaseProduct[] = sourceCategories.flatMap((category) =>
    (category.curvedCarouselImages ?? []).map((item, index) => ({
      category: category.title[locale],
      categorySlug: category.slug,
      href: `${localizedPath(locale, `/products/${category.slug}`)}#surface-detail-${index}`,
      id: `${category.slug}-${index + 1}`,
      image: item.src,
      title: item.title[locale]
    }))
  );

  return (
    <main>
      <PageHero
        image="/uploads/product/product.jpg"
        subtitle={
          locale === "en"
            ? "CUSTOMIZED PRODUCTS MADE OF ALCANTARA, LEATHER AND FABRIC"
            : JAPANESE_PRODUCT_SURFACE_DESCRIPTION
        }
        title="Product"
      />
      <Showcase4 categories={showcaseCategories} initialCategory={initialCategory} items={items} locale={locale} />
      <CTASection
        backgroundImage={homeSettings.showroomBackgroundImage}
        body={
          locale === "en"
            ? "Share your application, finish, and production requirements.\nOur team will match premium materials with prototyping and made-to-spec manufacturing."
            : "用途、仕上がり、生産条件をお聞かせください。\nプレミアム素材の選定から、試作、オーダーメイド生産まで一貫してサポートします。"
        }
        eyebrow={null}
        label={locale === "en" ? "Our location" : "所在地"}
        locale={locale}
        secondaryAction="message"
        secondaryLabel={locale === "en" ? "Inquiry Now" : "お問い合わせ"}
        title={
          locale === "en"
            ? "Materials Selected\nProducts Realized"
            : "素材を選び、\n製品へと仕立てる。"
        }
      />
    </main>
  );
}
