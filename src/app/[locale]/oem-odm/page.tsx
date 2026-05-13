import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";
import { loadMaterialCategories, loadProjects } from "@/sanity/lib/loaders";
import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const steps = [
  { en: "Material briefing", ja: "素材要件整理" },
  { en: "Article and color matching", ja: "品番・カラー選定" },
  { en: "Prototype surface review", ja: "試作サーフェス確認" },
  { en: "Production support", ja: "量産支援" }
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const categories = await loadMaterialCategories();

  return createPageMetadata({
    locale,
    path: "/oem-odm",
    title: locale === "en" ? "OEM/ODM | CAMARI JAPAN" : "OEM/ODM | CAMARI JAPAN",
    description: locale === "en" ? "OEM and ODM material programs for automotive, product, interior, and spatial design teams." : "車両、プロダクト、インテリア、空間デザインチーム向けの OEM/ODM 素材プログラム。",
    image: categories[0]?.coverImage
  });
}

export default async function OemOdmPage({ params }: PageProps) {
  const { locale } = await params;
  const [categories, projects] = await Promise.all([loadMaterialCategories(), loadProjects()]);
  const heroImage = projects[0]?.image ?? categories[0]?.coverImage;

  return (
    <main>
      {heroImage ? (
        <PageHero
          image={heroImage}
          subtitle={locale === "en" ? "From concept material strategy to finished surface execution" : "素材戦略から完成されたサーフェス実装まで"}
          title="OEM / ODM"
        />
      ) : null}
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label-caps text-gold">Capability</p>
            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              {locale === "en" ? "Custom material programs for premium product spaces." : "上質なプロダクト空間に向けた特注素材プログラム。"}
            </h2>
          </div>
          <div className="grid gap-8 md:col-span-6 md:col-start-7">
            {[
              {
                title: { en: "Automotive and mobility interiors", ja: "自動車・モビリティインテリア" },
                body: { en: "Cabin panels, steering touch points, seating, and refined trim surfaces.", ja: "キャビンパネル、ステアリング周辺、シート、上質なトリムサーフェス。" }
              },
              {
                title: { en: "Interior and hospitality spaces", ja: "インテリア・ホスピタリティ空間" },
                body: { en: "Material palettes, wall panels, upholstery, and quiet tactile transitions.", ja: "素材パレット、壁面パネル、張地、静かな触感の遷移。" }
              },
              {
                title: { en: "Product and brand surfaces", ja: "プロダクト・ブランドサーフェス" },
                body: { en: "Small-lot article selection and surface development for product teams.", ja: "プロダクトチーム向けの小ロット品番選定とサーフェス開発。" }
              }
            ].map((item) => (
              <article className="border-b border-charcoal/10 pb-8" key={item.title.en}>
                <h3 className="font-serif text-2xl">{item.title[locale]}</h3>
                <p className="mt-4 leading-8 text-muted">{item.body[locale]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-stone py-24 md:py-32" data-nav-invert>
        <div className="section-shell">
          <h2 className="font-serif text-4xl uppercase tracking-luxury">{locale === "en" ? "Process" : "プロセス"}</h2>
          <div className="mt-12 grid gap-gutter md:grid-cols-4">
            {steps.map((step, index) => (
              <div className="border-t border-charcoal/20 pt-7" key={step.en}>
                <p className="label-caps text-gold">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 font-serif text-2xl">{step[locale]}</h3>
              </div>
            ))}
          </div>
          <Link className="label-caps mt-14 inline-flex border border-charcoal/25 px-8 py-5 transition-colors hover:bg-charcoal hover:text-white" href={localizedPath(locale, "/projects")}>
            {locale === "en" ? "View Cases" : "事例を見る"}
          </Link>
        </div>
      </section>
      <CTASection
        body={locale === "en" ? "Contact is currently handled by direct email and showroom appointment. A structured inquiry flow will be added later." : "現在のお問い合わせはメールとショールーム予約で対応します。構造化された問い合わせフォームは後日追加予定です。"}
        locale={locale}
        title={locale === "en" ? "Discuss a surface program with CAMARI JAPAN." : "CAMARI JAPAN とサーフェス開発をご相談ください。"}
      />
    </main>
  );
}
