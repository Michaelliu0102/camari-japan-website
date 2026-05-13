import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadMaterialCategories, loadNewsItems } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const newsItems = await loadNewsItems();

  return createPageMetadata({
    locale,
    path: "/media",
    title: locale === "en" ? "Media | CAMARI JAPAN" : "メディア | CAMARI JAPAN",
    description: locale === "en" ? "News, exhibitions, materials, and editorial updates from CAMARI JAPAN." : "CAMARI JAPAN のニュース、展示会、素材、編集記事。",
    image: newsItems[0]?.image
  });
}

export default async function MediaPage({ params }: PageProps) {
  const { locale } = await params;
  const [categories, newsItems] = await Promise.all([loadMaterialCategories(), loadNewsItems()]);
  const heroCategory = categories[2] ?? categories[0];

  return (
    <main>
      {heroCategory ? <PageHero image={heroCategory.coverImage} subtitle={locale === "en" ? "News, materials, exhibitions, and project notes" : "ニュース、素材、展示会、プロジェクトノート"} title="Media" /> : null}
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-gutter md:grid-cols-3">
          {newsItems.map((item) => (
            <article className="group" id={item.slug} key={item.slug}>
              <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                <Image alt={item.title[locale]} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 768px) 33vw, 100vw" src={item.image} />
              </div>
              <p className="label-caps mt-7 text-gold">{item.category[locale]} / {item.date}</p>
              <h2 className="mt-4 font-serif text-3xl">{item.title[locale]}</h2>
              <p className="mt-4 leading-8 text-muted">{item.summary[locale]}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
