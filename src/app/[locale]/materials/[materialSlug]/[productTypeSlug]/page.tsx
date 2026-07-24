import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { localizedPath, type Locale } from "@/lib/locales";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { loadSkaiVinylArticles } from "@/lib/skai-vinyl";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { loadMaterial } from "@/sanity/lib/loaders";

export const dynamic = "force-dynamic";

const skaiVinylHeroImage = "/uploads/veganleather/skai Hero.jpg";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string; productTypeSlug: string }>;
};

function isVinylArticlePage(locale: Locale, materialSlug: string, productTypeSlug: string): boolean {
  return locale === "en" && materialSlug === "vegan-leather" && productTypeSlug === "vinyl";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug, productTypeSlug } = await params;

  if (!isVinylArticlePage(locale, materialSlug, productTypeSlug)) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: "/materials/vegan-leather/vinyl",
    title: "Vinyl Articles | CAMARI JAPAN",
    description: "Vinyl surface articles from the skai collection.",
    image: skaiVinylHeroImage
  });
}

export default async function VinylArticlePage({ params }: PageProps) {
  const { locale, materialSlug, productTypeSlug } = await params;

  if (!isVinylArticlePage(locale, materialSlug, productTypeSlug)) {
    notFound();
  }

  const [material, articles] = await Promise.all([loadMaterial(materialSlug), loadSkaiVinylArticles()]);

  if (!material || articles.length === 0) {
    notFound();
  }

  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: "Home", path: "/" },
    { name: "Materials", path: "/materials" },
    { name: material.name.en, path: `/materials/${material.slug}` },
    { name: "Vinyl", path: `/materials/${material.slug}/vinyl` }
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        eyebrow="Vegan Leather"
        image={skaiVinylHeroImage}
        subtitle="comfortable solution for variety of applications"
        title="skai"
      />
      <section className="bg-paper py-20 md:py-28" data-nav-invert>
        <div className="section-shell">
          <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="label-caps text-gold">Vinyl Article</p>
              <h2 className="mt-5 font-label text-3xl uppercase tracking-[0.12em] md:text-4xl">skai collection</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted md:col-span-5 md:justify-self-end md:text-right">
              Contract vinyl surfaces selected for upholstery, panels, and exterior-facing programs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <article className="group block" key={article.slug}>
                <div className="relative aspect-square overflow-hidden bg-stone shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-material">
                  <Image
                    alt={article.name}
                    className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    src={article.coverImage}
                  />
                  <Link
                    aria-label={article.name}
                    className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
                    href={localizedPath(locale, `/materials/${material.slug}/${article.slug}/${article.firstSkuSlug}`)}
                    id={article.slug}
                  />
                </div>
                <div className="pt-7 text-center">
                  <h3 className="label-caps text-charcoal">{article.name.toUpperCase()}</h3>
                  <p className="mt-2 text-sm text-muted">{article.colorCount} colours</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
