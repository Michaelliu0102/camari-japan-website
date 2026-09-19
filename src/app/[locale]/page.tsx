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
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/structured-data";
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
      <JsonLd data={buildOrganizationJsonLd(siteConfig, locale)} />
      <JsonLd data={buildWebSiteJsonLd(siteConfig, locale)} />
      <HeroVideo hero={homeSettings.hero} locale={locale} />
      <ExploreCarousel categories={categories} categorySlugs={homeSettings.explore.categorySlugs} locale={locale} materials={materials} productSlides={homeSettings.explore.productSlides} />

      <section className="bg-stone py-20 md:py-20" data-nav-invert>
        <div className="section-shell grid gap-10 md:flex md:items-start md:justify-center md:gap-20">
          <div className="relative aspect-[5/4] overflow-hidden md:w-[40rem]">
            <Image alt="" className="object-cover" fill sizes="(min-width: 768px) 40rem, 100vw" src={homeSettings.brandValueImage} />
          </div>
          <div className="flex flex-col justify-between md:max-w-[25rem] md:self-stretch">
            <div>
              <p className="label-caps text-gold">{homeSettings.brandValueLabel[locale]}</p>
              <h2 className="mt-5 whitespace-pre-line font-label text-[1.35rem] uppercase leading-[1.25] tracking-[0.08em] md:mt-6 md:text-[1.65rem] md:leading-tight md:tracking-[0.1em]">
                {homeSettings.brandValueTitle[locale]}
              </h2>
              <p className="mt-6 text-base leading-8 text-muted md:mt-7 md:text-[0.95rem] md:leading-7">
                {homeSettings.brandValueBody[locale]}
              </p>
            </div>
            <Link className="label-caps mt-9 inline-flex min-h-12 w-full max-w-[20rem] items-center justify-center self-center border border-outline px-8 py-3 transition-colors hover:bg-charcoal hover:text-white md:mt-0 md:min-w-[13rem] md:w-auto md:py-4" href={localizedPath(locale, "/about")}>
              {homeSettings.brandValueLinkLabel[locale]}
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        backgroundImage={homeSettings.showroomBackgroundImage}
        body={homeSettings.ctaBody[locale]}
        eyebrow={null}
        label={homeSettings.ctaLabel[locale]}
        locale={locale}
        secondaryAction="message"
        secondaryLabel={homeSettings.ctaSecondaryLabel[locale]}
        title={homeSettings.ctaTitle[locale]}
      />
    </main>
  );
}
