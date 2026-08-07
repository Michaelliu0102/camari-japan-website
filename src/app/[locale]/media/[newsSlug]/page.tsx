import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { getNewsArticleContent, type NewsArticleImage } from "@/content/news-articles";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadNewsItem } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; newsSlug: string }>;
};

function NewsGallery({ images }: { images: NewsArticleImage[] }) {
  if (images.length === 0) {
    return null;
  }

  const hasFeaturedImage = images.some((image) => image.featured);

  return (
    <div
      className={`mx-auto mt-10 grid max-w-[52rem] gap-4 md:gap-5 ${
        hasFeaturedImage ? "md:grid-cols-3" : images.length > 1 ? "md:grid-cols-2" : ""
      }`}
    >
      {images.map((image, index) => (
        <figure
          className={`relative overflow-hidden bg-stone ${
            image.featured
              ? "md:col-span-3"
              : images.length === 3 && index === 2
                ? "md:col-span-2 md:mx-auto md:w-[calc(50%_-_0.625rem)]"
                : ""
          }`}
          key={image.src}
          style={{ aspectRatio: image.aspectRatio ?? (images.length === 1 ? "3 / 2" : "2 / 3") }}
        >
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes={images.length === 1 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
            src={image.src}
            unoptimized={image.src.includes("?")}
          />
        </figure>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, newsSlug } = await params;
  const item = await loadNewsItem(newsSlug);

  if (!item || (item.availableLocales && !item.availableLocales.includes(locale))) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/media/${item.slug}`,
    title: item.seo.title[locale] || item.title[locale],
    description: item.seo.description[locale] || item.summary[locale],
    image: item.seo.image || item.image,
    availableLocales: item.availableLocales
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { locale, newsSlug } = await params;
  const item = await loadNewsItem(newsSlug);

  if (!item || (item.availableLocales && !item.availableLocales.includes(locale))) {
    notFound();
  }

  const article = getNewsArticleContent(item.slug, locale);
  const articleHeroImage = article?.heroImage ?? item.image;
  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: locale === "en" ? "Home" : "ホーム", path: "/" },
    { name: locale === "en" ? "Media" : "メディア", path: "/media" },
    { name: item.title[locale], path: `/media/${item.slug}` }
  ]);

  return (
    <main className="bg-paper pt-[var(--nav-height)]" data-nav-invert>
      <JsonLd data={breadcrumbSchema} />
      <article>
        <header className="mx-auto max-w-[62rem] px-margin-mobile py-14 md:px-margin-desktop md:py-20">
          <Link
            className="label-caps inline-flex border-b border-charcoal/30 pb-2 text-[9px] text-charcoal transition-colors duration-300 hover:border-gold hover:text-gold"
            href={localizedPath(locale, "/media")}
          >
            {locale === "en" ? "Back to Media" : "メディアへ戻る"}
          </Link>
          <div className="mt-14 max-w-[48rem]">
            <p className="label-caps text-[9px] text-gold">{item.category[locale]}</p>
            <h1 className="mt-5 max-w-[22ch] text-balance font-serif text-4xl leading-[1.08] md:text-5xl">{item.title[locale]}</h1>
            <p className="mt-6 max-w-[60ch] text-base leading-8 text-muted md:text-lg">{item.summary[locale]}</p>
            <p className="label-caps mt-7 text-[9px] text-charcoal/55">
              {article?.dateline ?? item.date}
            </p>
          </div>
        </header>

        <div className={`mx-auto px-margin-mobile md:px-margin-desktop ${article?.heroFormat === "portrait" ? "max-w-[42rem]" : "max-w-[64rem]"}`}>
          <div
            className="relative overflow-hidden bg-stone"
            style={{ aspectRatio: article?.heroFormat === "portrait" ? "3 / 4" : article?.heroFormat === "standard" ? "4 / 3" : "3 / 2" }}
          >
            <Image
              alt={item.title[locale]}
              className="object-cover"
              fill
              priority
              sizes={article?.heroFormat === "portrait" ? "(min-width: 768px) 42rem, 100vw" : "100vw"}
              src={articleHeroImage}
              unoptimized={articleHeroImage.includes("?")}
            />
          </div>
        </div>

        <div className="mx-auto max-w-[62rem] px-margin-mobile py-16 md:px-margin-desktop md:py-24">
          <div className="max-w-[43rem] space-y-6 text-base leading-8 text-charcoal/75 md:text-[1.0625rem] md:leading-9">
            {(article?.introduction ?? [item.summary[locale]]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {article?.video ? (
            <figure className="mx-auto mt-14 max-w-[28rem] md:mt-20">
              <video
                aria-label={article.video.title}
                className="aspect-[9/16] w-full bg-charcoal object-cover"
                controls
                playsInline
                poster={article.video.poster}
                preload="metadata"
              >
                <source src={article.video.src} type="video/mp4" />
                Your browser does not support embedded video.
              </video>
              <figcaption className="mt-4 text-sm leading-6 text-charcoal/55">{article.video.title}</figcaption>
            </figure>
          ) : null}

          {article?.sections.map((section, index) => (
            <section className="mt-20 border-t border-charcoal/15 pt-10 md:mt-24 md:pt-12" key={section.title}>
              <div className="max-w-[43rem]">
                <p className="label-caps text-[9px] text-gold">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-4 max-w-[24ch] font-serif text-2xl leading-tight md:text-3xl">{section.title}</h2>
                <div className="mt-6 space-y-6 text-base leading-8 text-charcoal/75 md:text-[1.0625rem] md:leading-9">
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
              <NewsGallery images={section.images} />
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
