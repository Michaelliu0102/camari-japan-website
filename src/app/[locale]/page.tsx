import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { ExploreCarousel } from "@/components/ExploreCarousel";
import { HeroVideo } from "@/components/HeroVideo";
import { MaterialBentoGrid } from "@/components/MaterialBentoGrid";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";
import { loadHomePageSettings, loadMaterialCategories, loadMaterials, loadProjects } from "@/sanity/lib/loaders";

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
  const [homeSettings, categories, materials, projects] = await Promise.all([loadHomePageSettings(), loadMaterialCategories(), loadMaterials(), loadProjects()]);
  const featureCase = projects[0];

  return (
    <main>
      <HeroVideo hero={homeSettings.hero} locale={locale} />
      <ExploreCarousel categories={categories} categorySlugs={homeSettings.explore.categorySlugs} locale={locale} materials={materials} productSlides={homeSettings.explore.productSlides} />

      <section className="bg-stone py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-6 md:flex md:justify-center md:items-start md:gap-28">
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4] md:w-[48rem]">
            <Image alt="" className="object-cover" fill sizes="(min-width: 768px) 48rem, 100vw" src={homeSettings.brandValueImage} />
          </div>
          <div className="flex flex-col justify-between md:max-w-[25rem] md:self-stretch">
            <div>
              <p className="label-caps text-gold">Brand Value</p>
              <h2 className="mt-8 font-label text-xl uppercase tracking-[0.1em] md:text-[1.75rem] md:leading-tight">
                {locale === "en" ? "European material quality, Japanese spatial restraint." : "欧州品質の素材感と、日本的な空間の抑制。"}
              </h2>
              <p className="mt-10 text-sm leading-7 text-muted md:text-[0.95rem]">
                {locale === "en"
                  ? "CAMARI JAPAN curates materials for teams who need surfaces to communicate quality before a word is spoken: automotive cabins, hospitality interiors, product panels, and bespoke OEM/ODM programs."
                  : "CAMARI JAPAN は、言葉より先に品質を伝えるサーフェスを求めるチームに向けて素材を選定します。車両キャビン、ホスピタリティ空間、プロダクトパネル、特注 OEM/ODM プログラムに対応します。"}
              </p>
            </div>
            <Link className="label-caps inline-flex min-w-[13rem] justify-center border border-outline px-8 py-4 transition-colors hover:bg-charcoal hover:text-white self-center" href={localizedPath(locale, "/about")}>
              About Us
            </Link>
          </div>
        </div>
      </section>

      <MaterialBentoGrid categories={categories} locale={locale} materials={materials} />

      {featureCase ? (
        <section className="bg-paper py-24 md:py-36" data-nav-invert>
          <div className="section-shell grid gap-12 md:grid-cols-[0.85fr_1fr] md:items-end">
            <div>
              <p className="label-caps text-gold">OEM / ODM</p>
              <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
                {locale === "en" ? "From texture selection to finished surface programs." : "素材選定から完成されたサーフェスプログラムまで。"}
              </h2>
            </div>
            <Link className="group relative block min-h-[420px] overflow-hidden bg-stone" href={localizedPath(locale, `/projects/${featureCase.slug}`)}>
              <Image alt={featureCase.title[locale]} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 768px) 50vw, 100vw" src={featureCase.image} />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-0 p-8 text-white md:p-10">
                <p className="label-caps text-white/75">{featureCase.industry[locale]}</p>
                <h3 className="mt-4 font-serif text-3xl">{featureCase.title[locale]}</h3>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <CTASection
        backgroundImage={homeSettings.showroomBackgroundImage}
        body={locale === "en" ? "Speak with the CAMARI team about material availability, technical sheets, and project-fit recommendations." : "素材の在庫、技術資料、プロジェクトに適した選定について CAMARI チームにご相談ください。"}
        label={locale === "en" ? "Our location" : "所在地"}
        locale={locale}
        secondaryLabel={locale === "en" ? "Make Appointment" : "ご予約"}
        title={locale === "en" ? "Build the next surface with restraint and precision." : "抑制と精密さで、次のサーフェスをつくる。"}
      />
    </main>
  );
}
