import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { ExploreCarousel } from "@/components/ExploreCarousel";
import { HeroVideo } from "@/components/HeroVideo";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";
import { buildOrganizationJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadHomePageSettings, loadMaterialCategories, loadMaterials } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const categories = await loadMaterialCategories();

  return createPageMetadata({
    locale,
    title: `${site.name} | ${site.slogan[locale]}`,
    description: site.description[locale],
    image: categories[0]?.coverImage
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const [homeSettings, categories, materials] = await Promise.all([loadHomePageSettings(), loadMaterialCategories(), loadMaterials()]);

  return (
    <main>
      <JsonLd data={buildOrganizationJsonLd(siteConfig)} />
      <HeroVideo hero={homeSettings.hero} locale={locale} />
      <ExploreCarousel categories={categories} categorySlugs={homeSettings.explore.categorySlugs} locale={locale} materials={materials} productSlides={homeSettings.explore.productSlides} />

      <section className="bg-stone py-16 md:py-20" data-nav-invert>
        <div className="section-shell grid gap-6 md:flex md:justify-center md:items-start md:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4] md:w-[40rem]">
            <Image alt="" className="object-cover" fill sizes="(min-width: 768px) 40rem, 100vw" src={homeSettings.brandValueImage} />
          </div>
          <div className="flex flex-col justify-between md:max-w-[25rem] md:self-stretch">
            <div>
              <p className="label-caps text-gold">Brand Value</p>
              <h2 className="mt-6 font-label text-xl uppercase tracking-[0.1em] md:text-[1.65rem] md:leading-tight">
                {locale === "en" ? "European material quality, Japanese spatial restraint." : "欧州品質の素材感と、日本的な空間の抑制。"}
              </h2>
              <p className="mt-7 text-sm leading-7 text-muted md:text-[0.95rem]">
                {locale === "en"
                  ? `${site.organizationName} curates materials for teams who need surfaces to communicate quality before a word is spoken: automotive cabins, hospitality interiors, product panels, and bespoke OEM/ODM programs.`
                  : `${site.organizationName} は、言葉より先に品質を伝えるサーフェスを求めるチームに向けて素材を選定します。車両キャビン、ホスピタリティ空間、プロダクトパネル、特注 OEM/ODM プログラムに対応します。`}
              </p>
            </div>
            <Link className="label-caps inline-flex min-w-[13rem] justify-center border border-outline px-8 py-4 transition-colors hover:bg-charcoal hover:text-white self-center" href={localizedPath(locale, "/about")}>
              About Us
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        backgroundImage={homeSettings.showroomBackgroundImage}
        body={locale === "en" ? "Speak with our team about material specification,\nbespoke production, and project-fit solutions." : "技術仕様やデザインコンセプトをお送りください。素材選定、カスタム試作、納品まで専門スタッフがサポートします。"}
        eyebrow={null}
        label={locale === "en" ? "Our location" : "所在地"}
        locale={locale}
        secondaryAction="message"
        secondaryLabel={locale === "en" ? "Inquiry Now" : "お問い合わせ"}
        title={locale === "en" ? "Tailored Surfaces\nBespoke Creations" : "先見性あるデザインのために、素材とカスタムプロダクトを最適化します。"}
      />
    </main>
  );
}
