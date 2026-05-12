import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadMaterialCategories } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const categories = await loadMaterialCategories();

  return createPageMetadata({
    locale,
    path: "/about",
    title: locale === "en" ? "About | CAMARI JAPAN" : "会社情報 | CAMARI JAPAN",
    description: locale === "en" ? "Learn about CAMARI JAPAN's material philosophy, company values, and contact information." : "CAMARI JAPAN の素材哲学、企業価値、連絡先について。",
    image: categories[1]?.coverImage
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const categories = await loadMaterialCategories();
  const heroCategory = categories[1] ?? categories[0];

  return (
    <main>
      {heroCategory ? <PageHero image={heroCategory.coverImage} subtitle={site.slogan[locale]} title="About" /> : null}
      <section className="bg-paper py-24 md:py-36">
        <div className="section-shell grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label-caps text-gold">Company</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">CAMARI JAPAN</h1>
          </div>
          <div className="space-y-8 text-lg leading-9 text-muted md:col-span-7 md:col-start-6">
            <p>
              {locale === "en"
                ? "CAMARI JAPAN curates premium surface materials for teams who treat texture as an essential part of brand, space, and product quality."
                : "CAMARI JAPAN は、質感をブランド、空間、プロダクト品質の中核として扱うチームに向けて、上質なサーフェス素材を選定します。"}
            </p>
            <p>
              {locale === "en"
                ? "Our work balances European material expressiveness with Japanese restraint, supporting OEM/ODM programs from concept selection through technical coordination."
                : "欧州素材の表現力と日本的な抑制を両立し、コンセプト選定から技術調整まで OEM/ODM プログラムを支援します。"}
            </p>
          </div>
        </div>
      </section>
      <CTASection locale={locale} title={locale === "en" ? "Visit by appointment in Tokyo." : "東京ショールームは予約制です。"} body={site.contact.address[locale]} tone="light" />
    </main>
  );
}
