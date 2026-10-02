import { chineseCopy } from "../../../china/copy";
import type { Metadata } from "next";
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
    title: locale === "zh" ? chineseCopy(`Materials | ${site.name}`) : locale === "en" ? `Materials | ${site.name}` : `素材 | ${site.name}`,
    description: locale === "zh" ? chineseCopy("Browse Alcantara, leather, fabric, and sustainable surface materials.") : locale === "en" ? "Browse Alcantara, leather, fabric, and sustainable surface materials." : "アルカンターラ、レザー、ファブリック、サステナブルサーフェス素材をご覧ください。",
    image: categories[0]?.coverImage
  });
}

export default async function MaterialsPage({ params }: PageProps) {
  const { locale } = await params;
  const [categories, materials] = await Promise.all([loadMaterialCategories(), loadMaterials()]);
  const heroCategory = categories[0];
  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: locale === "zh" ? chineseCopy("Home") : locale === "en" ? "Home" : "ホーム", path: "/" },
    { name: locale === "zh" ? chineseCopy("Materials") : locale === "en" ? "Materials" : "素材", path: "/materials" }
  ], locale);

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      {heroCategory ? (
        <PageHero
          image={heroCategory.coverImage}
          title={locale === "zh" ? chineseCopy("Material") : locale === "en" ? "Material" : "素材"}
        />
      ) : null}
      <section className="bg-stone py-24 md:py-32" data-nav-invert>
        <div className="mx-auto max-w-4xl px-margin-mobile text-center">
          {locale !== "ja" ? <p className="label-caps text-gold">Our Philosophy</p> : null}
          <h2 className={`${locale === "zh" ? chineseCopy("mt-6 ") : locale === "en" ? "mt-6 " : ""}text-balance font-serif text-4xl uppercase tracking-luxury`}>
            {locale === "zh" ? "用心挑选，重在品质" : locale === "en" ? "Quality materials, carefully chosen." : "質感へのこだわり"}
          </h2>
          <p className="mt-8 text-lg leading-9 text-muted">
            {locale === "zh" ? "我们关注材料的手感，也看重它在实际使用中的表现。从 Alcantara、真皮到织物与合成皮革，我们帮助您为项目找到合适的材料。" : locale === "en"
              ? "We pay attention to how a material feels and how it performs in use. From Alcantara and leather to fabric and vegan leather, we help you choose what works for your project."
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
            })}
          enableStars={false}
          enableSpotlight
          enableBorderGlow
          enableTilt
          enableMagnetism={false}
          imageCtaLabel={locale === "zh" ? chineseCopy("Explore Texture") : locale === "en" ? "Explore Texture" : "質感を見る"}
          clickEffect
          spotlightRadius={500}
          glowColor="166, 138, 94"
        />
        </div>
      </section>
    </main>
  );
}
