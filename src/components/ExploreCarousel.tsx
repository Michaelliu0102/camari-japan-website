"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SplitText from "@/components/SplitText";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { HomeExploreSlide, LocalizedString, Material, MaterialCategory } from "@/lib/content";
import { JAPANESE_PRODUCT_SURFACE_DESCRIPTION } from "@/lib/japanese-copy";
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

type CardPose = {
  height: string;
  transform: string;
  opacity: number;
  width: string;
  zIndex: number;
  filter?: string;
};

const activeCardSize = {
  height: "min(clamp(20rem, 50svh, 34rem), 100%)",
  width: "min(clamp(14.25rem, 36svh, 24rem), 44vw)"
};
const sideCardSize = {
  height: "clamp(8.75rem, 14vw, 12.75rem)",
  width: "clamp(13rem, 21vw, 19rem)"
};

const cardTransition = "height 1250ms cubic-bezier(.18,.86,.18,1), width 1250ms cubic-bezier(.18,.86,.18,1), transform 1250ms cubic-bezier(.18,.86,.18,1), opacity 1250ms cubic-bezier(.18,.86,.18,1), filter 1250ms cubic-bezier(.18,.86,.18,1)";

const homeExploreImageOverrides: Record<string, string> = {
  alcantara: "/uploads/carousel/alcantara2.jpg",
  fabric: "/uploads/carousel/fabric.jpg",
  "vegan-leather": "/uploads/veganleather/home-vegan-leather.jpg"
};

const homeExploreDescriptionOverrides: Record<string, Partial<LocalizedString>> = {
  projects: {
    en: "CUSTOMIZED PRODUCTS MADE OF ALCANTARA, LEATHER AND FABRIC",
    ja: JAPANESE_PRODUCT_SURFACE_DESCRIPTION,
  }
};

function circularDistance(from: number, to: number, length: number) {
  return ((from - to) % length + length) % length;
}

function getCardPose(cardIndex: number, activeIndex: number, total: number): CardPose {
  const distance = circularDistance(cardIndex, activeIndex, total);

  if (distance === 0) {
    return {
      ...activeCardSize,
      transform: "translate(-50%, -50%) translate3d(0, 0, 0) rotateZ(0deg) scale(1)",
      opacity: 1,
      zIndex: 30
    };
  }

  if (distance === 1) {
    return {
      ...sideCardSize,
      transform: "translate(-50%, -50%) translate3d(clamp(12rem, 30vw, 32rem), clamp(2rem, 6svh, 4rem), 0) rotateZ(0deg) scale(1)",
      opacity: 0.9,
      zIndex: 18,
      filter: "saturate(.88) brightness(.82)"
    };
  }

  if (distance === total - 1) {
    return {
      ...sideCardSize,
      transform: "translate(-50%, -50%) translate3d(calc(-1 * clamp(12rem, 30vw, 32rem)), clamp(2rem, 6svh, 4rem), 0) rotateZ(0deg) scale(1)",
      opacity: 0.9,
      zIndex: 18,
      filter: "saturate(.88) brightness(.82)"
    };
  }

  const exitsLeft = distance > total / 2;
  return {
    ...sideCardSize,
    transform: exitsLeft
      ? "translate(-50%, -50%) translate3d(calc(-1 * clamp(18rem, 44vw, 44rem)), clamp(2rem, 6svh, 4rem), 0) rotateZ(0deg) scale(.82)"
      : "translate(-50%, -50%) translate3d(clamp(18rem, 44vw, 44rem), clamp(2rem, 6svh, 4rem), 0) rotateZ(0deg) scale(.82)",
    opacity: 0,
    zIndex: 1
  };
}

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
          title: { en: "PRODUCT", ja: "PRODUCT" },
          category: { en: "Product", ja: "Product" },
          description: {
            en: "CUSTOMIZED PRODUCTS MADE OF ALCANTARA, LEATHER AND FABRIC",
            ja: JAPANESE_PRODUCT_SURFACE_DESCRIPTION
          },
          image: "/uploads/product/product.jpg",
          href: "/products"
        }
      ]
    : [];
  const selectedCategories = categorySlugs?.length
    ? categorySlugs.map((slug) => categories.find((category) => category.slug === slug)).filter((category): category is MaterialCategory => Boolean(category))
    : categories.slice(0, 3);
  const productSlides: ExploreSlide[] = (configuredProductSlides?.length ? configuredProductSlides : fallbackProductSlides).map((productSlide) => ({
    ...productSlide,
    description: {
      ...productSlide.description,
      ...(homeExploreDescriptionOverrides[productSlide.slug] ?? {})
    }
  }));
  const slides: ExploreSlide[] = useMemo(
    () => [
      ...selectedCategories.map((category) => ({
        slug: category.slug,
        title: category.name,
        category: { en: `Material — ${category.name.en}`, ja: `Material — ${category.name.ja}` },
        description: category.description,
        image: homeExploreImageOverrides[category.slug] ?? category.coverImage,
        href: (() => {
            const bySlug = materials.find((m) => m.slug === category.slug);
            if (bySlug) return `/materials/${category.slug}`;
            const byName = materials.find(
              (m) => m.name.en.toLowerCase() === category.name.en.toLowerCase()
            );
            return byName ? `/materials/${byName.slug}` : "/materials";
          })()
      })),
      ...productSlides
    ],
    [materials, productSlides, selectedCategories]
  );
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const slide = slides[index];

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    <section className="relative isolate -mt-px min-h-[100svh] scroll-mt-0 overflow-hidden bg-charcoal text-white" data-explore-slider id="home-explore">
      <div className="absolute inset-0 -z-20 bg-charcoal">
        {slides.map((item, slideIndex) => (
          <Image
            alt=""
            className={`object-cover transition-all duration-[1250ms] ease-expo ${slideIndex === index ? "scale-105 opacity-85" : "scale-100 opacity-0"}`}
            fill
            key={`background-${item.slug}`}
            sizes="100vw"
            src={item.image}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-charcoal/40 backdrop-blur-sm md:bg-charcoal/35 md:backdrop-blur-md" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[22svh] bg-gradient-to-b from-charcoal via-charcoal/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[58%] bg-gradient-to-t from-charcoal via-charcoal/88 to-transparent md:hidden" />
      <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-[34%] bg-charcoal/95 md:block" />
      <div className="absolute inset-x-0 bottom-[34%] -z-10 hidden h-[10%] bg-gradient-to-t from-charcoal/85 to-transparent md:block" />

      <div
        className="section-shell flex min-h-[100svh] flex-col pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[calc(var(--nav-height)+1.5rem)] md:hidden"
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0]?.clientX;
          if (touchStartX.current === null || endX === undefined) return;

          const distance = endX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(distance) >= 45) move(distance > 0 ? -1 : 1);
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
      >
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.85rem,10vw,2.7rem)] uppercase leading-none tracking-[0.16em] text-white/95">
            Explore
          </h2>
          <span className="font-label text-[0.62rem] font-semibold tracking-[0.2em] text-white/65">
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative mt-7 flex justify-center">
          <div className="relative aspect-[4/5] w-[min(78vw,19rem)] overflow-hidden rounded-sm border border-white/20 bg-charcoal/25 shadow-2xl shadow-black/35">
            {slides.map((item, slideIndex) => (
              <Image
                alt={slideIndex === index ? item.title[locale] : ""}
                aria-hidden={slideIndex !== index}
                className={`object-contain transition-[opacity,transform] duration-700 ease-expo ${slideIndex === index ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"}`}
                fill
                key={`mobile-card-${item.slug}`}
                priority={slideIndex === 0}
                sizes="(max-width: 767px) 78vw"
                src={item.image}
              />
            ))}
          </div>

          <button
            aria-label={locale === "en" ? "Previous slide" : "前のスライド"}
            className="absolute left-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper text-charcoal shadow-material transition-colors active:bg-gold active:text-paper"
            onClick={() => move(-1)}
            type="button"
          >
            <ChevronLeft size={22} strokeWidth={1.4} />
          </button>
          <button
            aria-label={locale === "en" ? "Next slide" : "次のスライド"}
            className="absolute right-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-charcoal/25 text-white backdrop-blur-sm transition-colors active:bg-paper active:text-charcoal"
            onClick={() => move(1)}
            type="button"
          >
            <ChevronRight size={22} strokeWidth={1.4} />
          </button>
        </div>

        <div aria-live="polite" className="mx-auto mt-7 flex w-full max-w-[34rem] flex-col items-center text-center">
          <h3 className="font-label text-[clamp(1.55rem,8vw,2.15rem)] uppercase leading-[1.08] tracking-[0.075em] text-white">
            {slide.title[locale]}
          </h3>
          <p className="mt-4 max-w-[36rem] text-base leading-7 text-white/78">
            {slide.description[locale]}
          </p>
          <Link
            className="label-caps mt-7 inline-flex min-h-12 w-full max-w-[20rem] items-center justify-center border border-white/45 px-7 py-3 transition-colors active:bg-paper active:text-charcoal"
            href={localizedPath(locale, slide.href)}
          >
            {locale === "en" ? "View" : "詳細を見る"}
          </Link>
        </div>
      </div>

      <div className="section-shell box-border hidden min-h-[100svh] grid-rows-[auto_minmax(20rem,1fr)_auto] gap-y-4 pb-6 pt-[calc(var(--nav-height)+1.5rem)] md:grid">
        <div className="pointer-events-none text-center">
            <SplitText
              className="font-display text-[2.05rem] uppercase leading-none tracking-[0.24em] text-white/90 md:text-[3.4rem]"
              delay={60}
              tag="h2"
              text="Explore"
              threshold={0}
            />
        </div>

        <div className="relative mx-auto min-h-[20rem] w-full max-w-[92rem]" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {slides.map((item, slideIndex) => {
              const pose = getCardPose(slideIndex, index, slides.length);
              const isActive = slideIndex === index;
              const style: CSSProperties = {
                filter: pose.filter,
                height: pose.height,
                opacity: pose.opacity,
                transform: pose.transform,
                transition: cardTransition,
                width: pose.width,
                zIndex: pose.zIndex
              };

              return (
                <article
                  aria-hidden={!isActive}
                  aria-label={item.title[locale]}
                  className="absolute left-1/2 top-1/2 overflow-hidden rounded-md border border-white/20 bg-black/30 shadow-2xl shadow-black/40"
                  key={item.slug}
                  style={style}
                >
                  <Image
                    alt={isActive ? item.title[locale] : ""}
                    className="object-cover"
                    fill
                    priority={slideIndex === 0}
                    sizes={isActive ? "(min-width: 768px) 24rem, 15rem" : "(min-width: 768px) 19rem, 13rem"}
                    src={item.image}
                  />
                </article>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between">
            <button aria-label="Previous slide" className="pointer-events-auto grid h-10 w-14 place-items-center rounded-full border border-white/70 text-white transition-colors hover:bg-white hover:text-charcoal md:h-12 md:w-16" onClick={() => move(-1)} type="button">
              <ChevronLeft size={22} strokeWidth={1.4} />
            </button>
            <button aria-label="Next slide" className="pointer-events-auto grid h-10 w-14 place-items-center rounded-full border border-white/70 text-white transition-colors hover:bg-white hover:text-charcoal md:h-12 md:w-16" onClick={() => move(1)} type="button">
              <ChevronRight size={22} strokeWidth={1.4} />
            </button>
          </div>
        </div>

        <div aria-live="polite" className="mx-auto w-full max-w-[54rem] text-center">
            <div className="relative h-[3.25rem] overflow-hidden">
              {slides.map((item, slideIndex) => (
                <h3
                  aria-hidden={slideIndex !== index}
                  className={`absolute inset-0 flex items-center justify-center px-4 font-label text-[clamp(1.75rem,2.7vw,2.45rem)] uppercase leading-[1.2] tracking-[0.08em] transition-all duration-700 ease-expo ${slideIndex === index ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                  key={`title-${item.slug}`}
                >
                  {item.title[locale]}
                </h3>
              ))}
            </div>
            <div className="relative mx-auto mt-2 h-16 max-w-[44rem] overflow-hidden">
              {slides.map((item, slideIndex) => (
                <p
                  aria-hidden={slideIndex !== index}
                  className={`absolute inset-0 flex items-start justify-center px-4 text-sm leading-7 text-white/72 transition-all duration-700 ease-expo md:text-[0.95rem] ${slideIndex === index ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                  key={`description-${item.slug}`}
                >
                  {item.description[locale]}
                </p>
              ))}
            </div>
          <div className="mt-2 flex items-center justify-center">
            <Link className="label-caps inline-flex min-h-12 min-w-[12rem] items-center justify-center border border-white/35 px-7 py-3 transition-colors hover:bg-white hover:text-charcoal md:min-w-[13rem] md:px-8 md:py-3.5" href={localizedPath(locale, slide.href)}>
              {locale === "en" ? "View" : "詳細を見る"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
