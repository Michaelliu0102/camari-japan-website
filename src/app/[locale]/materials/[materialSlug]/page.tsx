import { chineseCopy } from "../../../../china/copy";
import type { Metadata } from "next";
import type { MaterialFaqItem } from "@/content/material-faqs";
import { notFound } from "next/navigation";
import { ApplicationGrid } from "@/components/ApplicationGrid";
import { JsonLd } from "@/components/JsonLd";
import { MaterialArticleGrid } from "@/components/MaterialArticleGrid";
import { MaterialIntro } from "@/components/MaterialIntro";
import {
  MaterialProjectCarousel,
  type ProjectLink,
} from "@/components/MaterialProjectCarousel";
import { PageHero } from "@/components/PageHero";
import type { ProjectCase, Sku } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { localizeBrandNames, type Locale } from "@/lib/locales";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadSkaiVinylArticles } from "@/lib/skai-vinyl";
import {
  loadMaterials,
  loadProductTypes,
  loadProjectsForMaterial,
  loadSkus,
  loadSkusForMaterial,
} from "@/sanity/lib/loaders";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string }>;
};

const articleGridMaterialSlugs = new Set(["fabric"]);

function MaterialFaq({ items, locale }: { items: MaterialFaqItem[]; locale: Locale }) {
  return (
    <section
      className="border-t border-charcoal/10 bg-paper py-20 md:py-28"
      data-nav-invert
      id="faq"
    >
      <div className="section-shell">
        <h2 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal">
          {locale === "zh" ? chineseCopy("FAQ") : locale === "en" ? "FAQ" : "よくあるご質問"}
        </h2>
        <div className="mx-auto mt-14 max-w-[46rem]">
          <div className="border-t border-charcoal/10">
            {items.map((item) => (
              <details
                className="group border-b border-charcoal/10 py-5"
                key={item.question}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 text-left marker:hidden">
                  <span className="label-caps block text-[10px] text-charcoal">
                    {localizeBrandNames(item.question, locale)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-sans text-xl leading-none text-muted transition-transform duration-300 ease-expo group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-3 space-y-3 pr-10 text-[0.8rem] leading-relaxed text-muted">
                  {item.answer.split(/\n{2,}/).map((paragraph) => (
                    <p key={paragraph}>{localizeBrandNames(paragraph, locale)}</p>
                  ))}
                  {item.link ? (
                    <a
                      className="inline-flex text-charcoal underline decoration-charcoal/40 underline-offset-4 transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
                      href={item.link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.link.label}
                    </a>
                  ) : null}
                </div>
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
    { locale: "ja", materialSlug: material.slug },
  ]);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
    image: material.seo.image,
  });
}

function buildProjectLinks(
  locale: Locale,
  projects: ProjectCase[],
  skus: Sku[],
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
          href: `/materials/${linkedArticle.materialSlug}/${linkedArticle.slug}`,
        });
      }

      return [project.slug, [...links.values()]];
    }),
  );
}

export default async function MaterialDetailPage({ params }: PageProps) {
  const { locale, materialSlug } = await params;
  const [materials, allProductTypes, allSkus, skaiArticles] = await Promise.all([
    loadMaterials(),
    loadProductTypes(),
    loadSkus(),
    materialSlug === "vegan-leather" && locale !== "ja" ? loadSkaiVinylArticles() : Promise.resolve([]),
  ]);
  const material = materials.find((entry) => entry.slug === materialSlug);

  if (!material) {
    notFound();
  }

  const [projects, skus] = await Promise.all([
    loadProjectsForMaterial(material.slug),
    loadSkusForMaterial(material.slug),
  ]);
  const productTypes = allProductTypes.filter(
    (productType) => productType.materialSlug === material.slug,
  );
  const projectLinks = buildProjectLinks(locale, projects, allSkus);
  const showArticleGridForMaterial = articleGridMaterialSlugs.has(
    material.slug,
  );
  const articleProductTypes =
    showArticleGridForMaterial && material.slug === "fabric"
      ? productTypes.filter(
          (productType) => productType.slug !== "fabric-panel",
        )
      : productTypes;
  const articleProductTypeSlugs = new Set(
    articleProductTypes.map((productType) => productType.slug),
  );
  const articleSkus = showArticleGridForMaterial
    ? skus.filter((sku) => articleProductTypeSlugs.has(sku.productTypeSlug))
    : skus;
  const showArticleGrid =
    showArticleGridForMaterial && articleProductTypes.length > 0;
  const faqItems = material.faq?.[locale] ?? (locale === "zh" ? chineseCopy(material.faq?.en) : undefined);
  const heroCopy = material.slug === "leather" && locale === "en"
    ? {
        eyebrow: "Italian Craftsmanship",
        title: "Leather",
        subtitle: "Natural character. Timeless appeal.",
      }
    : {
        eyebrow: material.eyebrow[locale],
        title: material.heroTitle[locale],
        subtitle: material.heroSubtitle[locale],
      };
  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: locale === "zh" ? chineseCopy("Home") : locale === "en" ? "Home" : "ホーム", path: "/" },
    { name: locale === "zh" ? chineseCopy("Materials") : locale === "en" ? "Materials" : "素材", path: "/materials" },
    { name: material.name[locale], path: `/materials/${material.slug}` },
  ], locale);

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        eyebrow={heroCopy.eyebrow}
        image={material.heroImage}
        subtitle={heroCopy.subtitle}
        title={heroCopy.title}
      />
      <MaterialIntro locale={locale} material={material} />
      {showArticleGrid ? (
        <MaterialArticleGrid
          locale={locale}
          materialSlug={material.slug}
          productTypes={articleProductTypes}
          skus={articleSkus}
        />
      ) : (
        <ApplicationGrid locale={locale} material={material} skus={skus} skaiArticleCount={skaiArticles.length} />
      )}
      <MaterialProjectCarousel
        locale={locale}
        materialName={material.name[locale]}
        projectLinks={projectLinks}
        projects={projects}
      />
      {faqItems?.length ? <MaterialFaq items={faqItems} locale={locale} /> : null}
    </main>
  );
}
