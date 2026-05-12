"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { getMaterial, materialCategories } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type ExploreCarouselProps = {
  locale: Locale;
};

const productSlides = [
  {
    slug: "oem-odm",
    title: { en: "Bespoke Surfaces", ja: "特注サーフェス" },
    category: { en: "Product — OEM", ja: "Product — OEM" },
    description: {
      en: "Material programs for automotive, product, hospitality, and architectural teams.",
      ja: "車両、プロダクト、ホスピタリティ、建築チームに向けた素材プログラム。"
    },
    image: materialCategories[0].coverImage,
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
    image: materialCategories[3].coverImage,
    href: "/projects"
  }
];

const slides = [
  ...materialCategories.slice(0, 3).map((category) => ({
    slug: category.slug,
    title: category.name,
    category: { en: `Material — ${category.name.en}`, ja: `Material — ${category.name.ja}` },
    description: category.description,
    image: category.coverImage,
    href: getMaterial(category.slug) ? `/materials/${category.slug}` : "/materials"
  })),
  ...productSlides
];

export function ExploreCarousel({ locale }: ExploreCarouselProps) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isProduct = index >= 3;

  function move(offset: number) {
    setIndex((current) => (current + offset + slides.length) % slides.length);
  }

  return (
    <section className="overflow-hidden bg-paper py-24 md:py-32">
      <div className="section-shell">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-5xl md:text-7xl">Explore</h2>
        </div>

        <div className="mb-10 flex justify-center gap-12">
          <button className={`label-caps border-b pb-4 ${!isProduct ? "border-charcoal text-charcoal" : "border-transparent text-muted"}`} onClick={() => setIndex(0)} type="button">
            Material
          </button>
          <button className={`label-caps border-b pb-4 ${isProduct ? "border-charcoal text-charcoal" : "border-transparent text-muted"}`} onClick={() => setIndex(3)} type="button">
            Product
          </button>
        </div>

        <div className="relative aspect-[21/9] min-h-[280px] overflow-hidden bg-stone">
          <Image alt={slide.title[locale]} className="object-cover transition-transform duration-700 ease-expo" fill sizes="(min-width: 768px) 90vw, 100vw" src={slide.image} />
          <div className="absolute inset-x-0 bottom-0 flex justify-between p-5 md:p-8">
            <button aria-label="Previous slide" className="flex h-12 w-12 items-center justify-center border border-white/60 bg-black/15 text-white backdrop-blur-sm" onClick={() => move(-1)} type="button">
              <ArrowLeft size={17} strokeWidth={1.4} />
            </button>
            <button aria-label="Next slide" className="flex h-12 w-12 items-center justify-center border border-white/60 bg-black/15 text-white backdrop-blur-sm" onClick={() => move(1)} type="button">
              <ArrowRight size={17} strokeWidth={1.4} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-b border-charcoal/10 pb-14 md:grid-cols-[0.7fr_1fr_auto] md:items-end">
          <p className="label-caps text-gold">{slide.category[locale]}</p>
          <div>
            <h3 className="font-serif text-3xl uppercase tracking-luxury">{slide.title[locale]}</h3>
            <p className="mt-5 max-w-3xl leading-8 text-muted">{slide.description[locale]}</p>
          </div>
          <Link className="label-caps border border-charcoal/25 px-7 py-4 transition-colors hover:bg-charcoal hover:text-white" href={localizedPath(locale, slide.href)}>
            View
          </Link>
        </div>
      </div>
    </section>
  );
}
