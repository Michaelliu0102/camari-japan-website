import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import MagicBento from "@/components/MagicBento/MagicBento";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadMaterialCategories, loadMaterials } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const categories = await loadMaterialCategories();

  return createPageMetadata({
    locale,
    path: "/materials",
    title: locale === "en" ? `Materials | ${site.name}` : `素材 | ${site.name}`,
    description: locale === "en" ? "Browse Alcantara, leather, fabric, and sustainable surface materials." : "Alcantara、レザー、ファブリック、サステナブルサーフェス素材をご覧ください。",
    image: categories[0]?.coverImage
  });
}

export default async function MaterialsPage({ params }: PageProps) {
  const { locale } = await params;
  const [categories, materials] = await Promise.all([loadMaterialCategories(), loadMaterials()]);
  const heroCategory = categories[0];
  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: locale === "en" ? "Home" : "ホーム", path: "/" },
    { name: locale === "en" ? "Materials" : "素材", path: "/materials" }
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      {heroCategory ? (
        <PageHero
          image={heroCategory.coverImage}
          subtitle={locale === "en" ? "The intersection of Italian sensory tension and Japanese restraint" : undefined}
          title="Material"
        />
      ) : null}
      <section className="bg-stone py-24 md:py-32" data-nav-invert>
        <div className="mx-auto max-w-4xl px-margin-mobile text-center">
          {locale === "en" ? <p className="label-caps text-gold">Our Philosophy</p> : null}
          <h2 className={`${locale === "en" ? "mt-6 " : ""}font-serif text-4xl uppercase tracking-luxury`}>
            {locale === "en" ? "Tactile Silence" : "質感へのこだわり"}
          </h2>
          <p className="mt-8 text-lg leading-9 text-muted">
            {locale === "en"
              ? "Every textile and hide is selected for its ability to harmonize with spatial design, offering a sensory transition between craft precision and expressive warmth."
              : "空間に調和する、心地よい手ざわりの素材を厳選しています。"}
          </p>
        </div>
      </section>
      <section className="bg-stone py-24 md:py-32" data-nav-invert>
        <div className="section-shell">
        <MagicBento
          cards={categories
            .map((category) => {
              const bySlug = materials.find((m) => m.slug === category.slug);
              const byName = !bySlug
                ? materials.find((m) => m.name.en.toLowerCase() === category.name.en.toLowerCase())
                : null;
              const materialSlug = bySlug ? category.slug : byName ? byName.slug : null;
              return {
                title: category.name[locale],
                description: category.tagline[locale],
                image: category.coverImage,
                href: materialSlug ? localizedPath(locale, `/materials/${materialSlug}`) : localizedPath(locale, "/materials"),
                variant: "image" as const,
              };
            })
            // Swap European Fabric (index 1) with Vegan Leather (index 2)
            .map((card, i, arr) => {
              if (i === 1) return arr[2];
              if (i === 2) return arr[1];
              return card;
            })}
          enableStars={false}
          enableSpotlight
          enableBorderGlow
          enableTilt
          enableMagnetism={false}
          clickEffect
          spotlightRadius={500}
          glowColor="166, 138, 94"
        />
        </div>
      </section>
      <CTASection
        body={locale === "en" ? "Download catalogs or contact the team for article availability and technical guidance." : "カタログのダウンロード、品番の在庫、技術情報についてお問い合わせください。"}
        href="/downloads"
        label={locale === "en" ? "View Catalogs" : "カタログを見る"}
        locale={locale}
        title={locale === "en" ? "Review the material library and request project guidance." : "素材ライブラリを確認し、プロジェクト相談へお進みください。"}
      />
    </main>
  );
}
