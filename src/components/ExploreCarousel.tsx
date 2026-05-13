"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useEffect, useState } from "react";
import type { HomeExploreSlide, LocalizedString, Material, MaterialCategory } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type ExploreSlide = {
  slug: string;
  title: LocalizedString;
  category: LocalizedString;
  description: LocalizedString;
  image: string;
  href: string;
};

type ExploreCarouselProps = {
  locale: Locale;
  categories: MaterialCategory[];
  categorySlugs?: string[];
  materials: Material[];
  productSlides?: ExploreSlide[];
};

export function ExploreCarousel({ locale, categories, categorySlugs, materials, productSlides: configuredProductSlides }: ExploreCarouselProps) {
  const fallbackImage = categories[0]?.coverImage ?? "";
  const fallbackProductSlides: HomeExploreSlide[] = fallbackImage
    ? [
        {
          slug: "oem-odm",
          title: { en: "Bespoke Surfaces", ja: "特注サーフェス" },
          category: { en: "Product — OEM", ja: "Product — OEM" },
          description: {
            en: "Material programs for automotive, product, hospitality, and architectural teams.",
            ja: "車両、プロダクト、ホスピタリティ、建築チームに向けた素材プログラム。"
          },
          image: categories[0]?.coverImage ?? fallbackImage,
          href: "/oem-odm"
        },
        {
          slug: "projects",
          title: { en: "Applied Precision", ja: "応用される精密性" },
          category: { en: "Product — ODM", ja: "Product — ODM" },
          description: {
            en: "Case-led development from concept, material matching, and surface execution.",
            ja: "コンセプト、素材選定、サーフェス実装までのケース主導型開発。"
          },
          image: categories[3]?.coverImage ?? fallbackImage,
          href: "/projects"
        }
      ]
    : [];
  const selectedCategories = categorySlugs?.length
    ? categorySlugs.map((slug) => categories.find((category) => category.slug === slug)).filter((category): category is MaterialCategory => Boolean(category))
    : categories.slice(0, 3);
  const productSlides: ExploreSlide[] = configuredProductSlides?.length ? configuredProductSlides : fallbackProductSlides;
  const slides: ExploreSlide[] = [
    ...selectedCategories.map((category) => ({
      slug: category.slug,
      title: category.name,
      category: { en: `Material — ${category.name.en}`, ja: `Material — ${category.name.ja}` },
      description: category.description,
      image: category.coverImage,
      href: materials.some((material) => material.slug === category.slug) ? `/materials/${category.slug}` : "/materials"
    })),
    ...productSlides
  ];
  const materialSlideCount = selectedCategories.length;
  const [index, setIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const slide = slides[index];
  const isProduct = index >= materialSlideCount;

  useEffect(() => {
    if (slides.length < 2) return;

    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (!slide) {
    return null;
  }

  function move(offset: number) {
    setIndex((current) => (current + offset + slides.length) % slides.length);
  }

  return (
    <section className="overflow-hidden bg-paper py-24 md:py-32" data-nav-invert>
      <div className="section-shell">
        <div className="mb-12 text-center md:mb-14">
          <h2 className="font-serif text-5xl md:text-7xl">Explore</h2>
        </div>

        <div className="mb-14 flex justify-center gap-12 md:mb-16 md:gap-20">
          <button className={`label-caps border-b pb-3 text-[12px] md:text-[14px] ${!isProduct ? "border-charcoal text-charcoal" : "border-transparent text-muted"}`} onClick={() => setIndex(0)} type="button">
            Material
          </button>
          <button className={`label-caps border-b pb-3 text-[12px] md:text-[14px] ${isProduct ? "border-charcoal text-charcoal" : "border-transparent text-muted"}`} onClick={() => setIndex(materialSlideCount)} type="button">
            Product
          </button>
        </div>

        <div className="relative mx-auto max-w-[56rem]">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone md:aspect-[8/5]">
            <Image alt={slide.title[locale]} className="object-cover transition-transform duration-700 ease-expo" fill sizes="(min-width: 768px) min(56rem, 82vw), 100vw" src={slide.image} />
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
            <button aria-label="Previous slide" className="pointer-events-auto -translate-x-[4.5rem] text-charcoal/45 transition-colors hover:text-charcoal" onClick={() => move(-1)} type="button">
              <ArrowLeft size={17} strokeWidth={1.4} />
            </button>
            <button aria-label="Next slide" className="pointer-events-auto translate-x-[4.5rem] text-charcoal/45 transition-colors hover:text-charcoal" onClick={() => move(1)} type="button">
              <ArrowRight size={17} strokeWidth={1.4} />
            </button>
          </div>

          <div className="mt-5 flex justify-between md:hidden">
            <button aria-label="Previous slide" className="text-charcoal/50 transition-colors hover:text-charcoal" onClick={() => move(-1)} type="button">
              <ArrowLeft size={17} strokeWidth={1.4} />
            </button>
            <button aria-label="Next slide" className="text-charcoal/50 transition-colors hover:text-charcoal" onClick={() => move(1)} type="button">
              <ArrowRight size={17} strokeWidth={1.4} />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[50rem] text-center md:mt-20">
          <p className="label-caps text-gold">{slide.category[locale]}</p>
          <h3 className="mt-6 font-label text-2xl uppercase tracking-[0.16em] md:text-[2.25rem]">
            {slide.title[locale]}
          </h3>
          <p className="mx-auto mt-6 max-w-[48rem] text-base leading-8 text-muted md:text-[1.15rem]">
            {slide.description[locale]}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link className="label-caps inline-flex min-w-[13rem] justify-center border border-charcoal/20 px-8 py-4 transition-colors hover:bg-charcoal hover:text-white" href={localizedPath(locale, slide.href)}>
              View
            </Link>
            <button className="label-caps inline-flex min-w-[13rem] items-center justify-center gap-2 border border-charcoal/20 px-8 py-4 transition-colors hover:bg-charcoal hover:text-white" onClick={() => setSearchOpen(true)} type="button">
              <Search size={14} strokeWidth={1.4} />
              Search
            </button>
          </div>
        </div>
      </div>
      <SearchOverlay locale={locale} onClose={() => setSearchOpen(false)} open={searchOpen} />
    </section>
  );
}
