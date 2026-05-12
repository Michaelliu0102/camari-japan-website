import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { MaterialBentoGrid } from "@/components/MaterialBentoGrid";
import { PageHero } from "@/components/PageHero";
import { materialCategories } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: "/materials",
    title: locale === "en" ? "Materials | CAMARI JAPAN" : "素材 | CAMARI JAPAN",
    description: locale === "en" ? "Browse Alcantara, leather, fabric, and sustainable surface materials." : "Alcantara、レザー、ファブリック、サステナブルサーフェス素材をご覧ください。",
    image: materialCategories[0].coverImage
  });
}

export default async function MaterialsPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main>
      <PageHero
        image={materialCategories[0].coverImage}
        subtitle={locale === "en" ? "The intersection of Italian sensory tension and Japanese restraint" : "イタリアの感性的な緊張と日本の抑制の交点"}
        title="Material"
      />
      <section className="bg-stone py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-margin-mobile text-center">
          <p className="label-caps text-gold">Our Philosophy</p>
          <h2 className="mt-6 font-serif text-4xl uppercase tracking-luxury">Tactile Silence</h2>
          <p className="mt-8 text-lg leading-9 text-muted">
            {locale === "en"
              ? "Every textile and hide is selected for its ability to harmonize with spatial design, offering a sensory transition between craft precision and expressive warmth."
              : "すべてのテキスタイルとレザーは、空間デザインと調和し、精密なクラフトと表情豊かな温度をつなぐ素材として選定されています。"}
          </p>
        </div>
      </section>
      <MaterialBentoGrid locale={locale} />
      <CTASection
        body={locale === "en" ? "Download catalogs or contact the team for article availability and technical guidance." : "カタログのダウンロード、品番の在庫、技術情報についてお問い合わせください。"}
        href="/downloads"
        label={locale === "en" ? "View Catalogs" : "カタログを見る"}
        locale={locale}
        title={locale === "en" ? "Request a material kit in the next release." : "素材キット申請は次期リリースで対応予定です。"}
      />
    </main>
  );
}
