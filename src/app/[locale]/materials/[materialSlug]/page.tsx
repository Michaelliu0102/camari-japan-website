import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationGrid } from "@/components/ApplicationGrid";
import { JsonLd } from "@/components/JsonLd";
import { MaterialArticleGrid } from "@/components/MaterialArticleGrid";
import { MaterialIntro } from "@/components/MaterialIntro";
import { MaterialProjectCarousel, type ProjectLink } from "@/components/MaterialProjectCarousel";
import { PageHero } from "@/components/PageHero";
import type { ProjectCase, Sku } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadMaterials, loadProductTypes, loadProjectsForMaterial, loadSkus, loadSkusForMaterial } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string }>;
};

type MaterialFaqItem = {
  question: string;
  answer: string;
};

const materialFaqs: Partial<Record<string, Record<Locale, MaterialFaqItem[]>>> = {
  alcantara: {
    en: [
      {
        question: "What is Alcantara?",
        answer:
          "Alcantara is a premium Italian material developed through a unique proprietary technology. It is known for its soft touch, refined appearance, and high-performance qualities."
      },
      {
        question: "Where is Alcantara produced?",
        answer:
          "ALCANTARA is 100% made in Italy."
      },
      {
        question: "Is Alcantara leather?",
        answer:
          "No. Alcantara is a high-tech material made with patented technology. It combines a premium luxury feel with unmatched durability."
      },
      {
        question: "Where can Alcantara be used?",
        answer:
          "Alcantara is used across automotive interiors, residential and contract interiors, marine, aviation, fashion, and consumer electronics."
      },
      {
        question: "Can Alcantara be customized?",
        answer:
          "Yes. Alcantara supports custom colors, textures, printing, perforation, laser processing, embossing, embroidery, and lamination for bespoke design programs."
      },
      {
        question: "Is Alcantara sustainable?",
        answer:
          "Sustainability is part of Alcantara's industrial culture. The material has maintained Carbon Neutral certification since 2009."
      }
    ],
    ja: [
      {
        question: "Alcantara とは何ですか？",
        answer:
          "Alcantara は、独自の専有技術によって開発されたプレミアムなイタリア素材です。柔らかな触感、洗練された表情、高い性能で知られています。"
      },
      {
        question: "Alcantara はどこで生産されていますか？",
        answer:
          "ALCANTARA は 100% イタリア製です。"
      },
      {
        question: "Alcantara はレザーですか？",
        answer:
          "いいえ。Alcantara は特許技術によって作られたハイテク素材です。上質でラグジュアリーな触感と、優れた耐久性を兼ね備えています。"
      },
      {
        question: "Alcantara はどこに使用できますか？",
        answer:
          "Alcantara は、自動車内装、住宅・コントラクトインテリア、船舶、航空、ファッション、コンシューマーエレクトロニクスなど幅広い分野で使用されています。"
      },
      {
        question: "Alcantara はカスタマイズできますか？",
        answer:
          "はい。カラー、テクスチャー、プリント、パンチング、レーザー加工、エンボス、刺繍、ラミネーションなど、プロジェクトに応じたカスタマイズに対応できます。"
      },
      {
        question: "Alcantara はサステナブルな素材ですか？",
        answer:
          "サステナビリティは Alcantara の産業文化の一部です。Alcantara は 2009年からカーボンニュートラル認証を継続しています。"
      }
    ]
  }
};

function MaterialFaq({ items }: { items: MaterialFaqItem[] }) {
  return (
    <section className="border-t border-charcoal/10 bg-paper py-20 md:py-28" data-nav-invert id="faq">
      <div className="section-shell">
        <h2 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal">FAQ</h2>
        <div className="mx-auto mt-14 max-w-[46rem]">
          <div className="border-t border-charcoal/10">
            {items.map((item) => (
              <details className="group border-b border-charcoal/10 py-5" key={item.question}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 text-left marker:hidden">
                  <span className="label-caps block text-[10px] text-charcoal">{item.question}</span>
                  <span aria-hidden="true" className="shrink-0 font-sans text-xl leading-none text-muted transition-transform duration-300 ease-expo group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 pr-10 text-[0.8rem] leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const materials = await loadMaterials();

  return materials.flatMap((material) => [
    { locale: "en", materialSlug: material.slug },
    { locale: "ja", materialSlug: material.slug }
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug } = await params;
  const materials = await loadMaterials();
  const material = materials.find((entry) => entry.slug === materialSlug);

  if (!material) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/materials/${material.slug}`,
    title: material.seo.title[locale],
    description: material.seo.description[locale],
    image: material.seo.image
  });
}

function buildProjectLinks(
  locale: Locale,
  projects: ProjectCase[],
  skus: Sku[]
): Record<string, ProjectLink[]> {
  const firstSkuByArticleKey = new Map<string, Sku>();

  for (const sku of skus) {
    const articleKey = `${sku.materialSlug}::${sku.productTypeSlug}`;
    if (!firstSkuByArticleKey.has(articleKey)) {
      firstSkuByArticleKey.set(articleKey, sku);
    }
  }

  return Object.fromEntries(
    projects.map((project) => {
      const links = new Map<string, ProjectLink>();

      for (const linkedArticle of project.linkedArticles) {
        const label = linkedArticle.name[locale].trim();
        const articleKey = `${linkedArticle.materialSlug}::${linkedArticle.slug}`;
        const firstSku = firstSkuByArticleKey.get(articleKey);

        if (!label || !firstSku) {
          continue;
        }

        links.set(articleKey, {
          label,
          href: `/materials/${linkedArticle.materialSlug}/${linkedArticle.slug}/${firstSku.slug}`
        });
      }

      return [project.slug, [...links.values()]];
    })
  );
}

export default async function MaterialDetailPage({ params }: PageProps) {
  const { locale, materialSlug } = await params;
  const [materials, allProductTypes, allSkus] = await Promise.all([loadMaterials(), loadProductTypes(), loadSkus()]);
  const material = materials.find((entry) => entry.slug === materialSlug);

  if (!material) {
    notFound();
  }

  const [projects, skus] = await Promise.all([loadProjectsForMaterial(material.slug), loadSkusForMaterial(material.slug)]);
  const productTypes = allProductTypes.filter((productType) => productType.materialSlug === material.slug);
  const projectLinks = buildProjectLinks(locale, projects, allSkus);
  const fabricProductTypes = material.slug === "fabric" ? productTypes.filter((productType) => productType.slug !== "fabric-panel") : productTypes;
  const fabricProductTypeSlugs = new Set(fabricProductTypes.map((productType) => productType.slug));
  const fabricSkus = material.slug === "fabric" ? skus.filter((sku) => fabricProductTypeSlugs.has(sku.productTypeSlug)) : skus;
  const showArticleGrid = material.slug === "fabric" && fabricProductTypes.length > 0;
  const faqItems = materialFaqs[material.slug]?.[locale];
  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: locale === "en" ? "Home" : "ホーム", path: "/" },
    { name: locale === "en" ? "Materials" : "素材", path: "/materials" },
    { name: material.name[locale], path: `/materials/${material.slug}` }
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      <PageHero eyebrow={material.eyebrow[locale]} image={material.heroImage} subtitle={material.heroSubtitle[locale]} title={material.heroTitle[locale]} />
      <MaterialIntro locale={locale} material={material} />
      {showArticleGrid ? <MaterialArticleGrid locale={locale} materialSlug={material.slug} productTypes={fabricProductTypes} skus={fabricSkus} /> : <ApplicationGrid locale={locale} material={material} skus={skus} />}
      <MaterialProjectCarousel locale={locale} materialName={material.name[locale]} projectLinks={projectLinks} projects={projects} />
      {faqItems ? <MaterialFaq items={faqItems} /> : null}
    </main>
  );
}
