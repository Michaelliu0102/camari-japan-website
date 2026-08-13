import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";
import { loadNewsItems } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const newsItems = await loadNewsItems();

  return createPageMetadata({
    locale,
    path: "/media",
    title: locale === "en" ? `Media | ${site.name}` : `メディア | ${site.name}`,
    description:
      locale === "en"
        ? `News, exhibitions, materials, and editorial updates from ${site.organizationName}.`
        : `${site.organizationName} のニュース、展示会、素材、編集記事。`,
    image: newsItems[0]?.image
  });
}

export default async function MediaPage({ params }: PageProps) {
  const { locale } = await params;
  const newsItems = await loadNewsItems();
  const visibleNewsItems = newsItems.filter((item) => !item.availableLocales || item.availableLocales.includes(locale));

  return (
    <main>
      <PageHero
        contentClassName="-translate-y-[15vh]"
        image="/uploads/news/hero.jpg"
        imagePosition="center center"
        subtitle={locale === "en" ? "News, materials, exhibitions, and project notes" : "ニュース、素材、展示会、プロジェクトノート"}
        title={locale === "en" ? "Media" : "メディア"}
      />
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-gutter md:grid-cols-3">
          {visibleNewsItems.map((item) => (
            <article className="group" id={item.slug} key={item.slug}>
              <Link
                className="block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-charcoal"
                href={localizedPath(locale, `/media/${item.slug}`)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                  <Image alt={item.title[locale]} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 768px) 33vw, 100vw" src={item.image} />
                </div>
                <p className="label-caps mt-7 text-gold">{item.category[locale]} / {item.date}</p>
                <h2 className="mt-4 font-serif text-2xl leading-tight transition-colors duration-300 group-hover:text-gold">{item.title[locale]}</h2>
                <p className="mt-4 leading-8 text-muted">{item.summary[locale]}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
