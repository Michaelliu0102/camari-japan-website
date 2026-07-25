"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SplitText from "@/components/SplitText";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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

type CardPose = {
  height: string;
  transform: string;
  opacity: number;
  width: string;
  zIndex: number;
  filter?: string;
};

const activeCardSize = {
  height: "clamp(20rem, 50svh, 34rem)",
  width: "clamp(14.25rem, 36svh, 24rem)"
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
    en: "CUSTOMIZED PRODUCTS MADE OF ALCANTARA, LEATHER AND FABRIC"
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
      transform: "translateX(-50%) translate3d(0, -0.7rem, 0) rotateZ(0deg) scale(1)",
      opacity: 1,
      zIndex: 30
    };
  }

  if (distance === 1) {
    return {
      ...sideCardSize,
      transform: "translateX(-50%) translate3d(clamp(12rem, 30vw, 32rem), clamp(6.5rem, 14svh, 9rem), 0) rotateZ(0deg) scale(1)",
      opacity: 0.9,
      zIndex: 18,
      filter: "saturate(.88) brightness(.82)"
    };
  }

  if (distance === total - 1) {
    return {
      ...sideCardSize,
      transform: "translateX(-50%) translate3d(calc(-1 * clamp(12rem, 30vw, 32rem)), clamp(6.5rem, 14svh, 9rem), 0) rotateZ(0deg) scale(1)",
      opacity: 0.9,
      zIndex: 18,
      filter: "saturate(.88) brightness(.82)"
    };
  }

  const exitsLeft = distance > total / 2;
  return {
    ...sideCardSize,
    transform: exitsLeft
      ? "translateX(-50%) translate3d(calc(-1 * clamp(18rem, 44vw, 44rem)), clamp(6.5rem, 14svh, 9rem), 0) rotateZ(0deg) scale(.82)"
      : "translateX(-50%) translate3d(clamp(18rem, 44vw, 44rem), clamp(6.5rem, 14svh, 9rem), 0) rotateZ(0deg) scale(.82)",
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
            ja: "製品用途と顧客体験に合わせたサーフェスプログラム。"
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
  const slide = slides[index];

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
    <section className="relative isolate -mt-px flex h-[100svh] scroll-mt-0 overflow-hidden bg-charcoal text-white" data-explore-slider id="home-explore">
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
      <div className="absolute inset-0 -z-10 bg-charcoal/35 backdrop-blur-md" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[22svh] bg-gradient-to-b from-charcoal via-charcoal/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[34%] bg-charcoal/95" />
      <div className="absolute inset-x-0 bottom-[34%] -z-10 h-[10%] bg-gradient-to-t from-charcoal/85 to-transparent" />

      <div className="section-shell box-border flex h-full items-center pb-4 pt-[calc(var(--nav-height)+1rem)] md:pb-5 md:pt-[calc(var(--nav-height)+1.5rem)]">
        <div className="relative mx-auto h-full max-h-[50rem] w-full max-w-[92rem]" style={{ perspective: "1200px" }}>
          <div className="pointer-events-none absolute inset-x-0 top-[1%] text-center md:top-[1.5%]">
            <SplitText
              className="font-display text-[2.05rem] uppercase leading-none tracking-[0.24em] text-white/90 md:text-[3.4rem]"
              delay={60}
              tag="h2"
              text="Explore"
              threshold={0}
            />
          </div>

          <div className="absolute inset-x-0 top-[15%] h-[56%]" style={{ transformStyle: "preserve-3d" }}>
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
                  className="absolute left-1/2 top-0 overflow-hidden rounded-md border border-white/20 bg-black/30 shadow-2xl shadow-black/40"
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

          <div className="pointer-events-none absolute inset-x-0 top-[39%] flex items-center justify-between">
            <button aria-label="Previous slide" className="pointer-events-auto grid h-10 w-14 place-items-center rounded-full border border-white/70 text-white transition-colors hover:bg-white hover:text-charcoal md:h-12 md:w-16" onClick={() => move(-1)} type="button">
              <ChevronLeft size={22} strokeWidth={1.4} />
            </button>
            <button aria-label="Next slide" className="pointer-events-auto grid h-10 w-14 place-items-center rounded-full border border-white/70 text-white transition-colors hover:bg-white hover:text-charcoal md:h-12 md:w-16" onClick={() => move(1)} type="button">
              <ChevronRight size={22} strokeWidth={1.4} />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-[4.75rem] mx-auto max-w-[54rem] text-center md:bottom-[5.25rem]">
            <div className="relative h-9 overflow-hidden md:h-11">
              {slides.map((item, slideIndex) => (
                <h3
                  aria-hidden={slideIndex !== index}
                  className={`absolute inset-x-0 top-0 font-label text-[1.6rem] uppercase leading-none tracking-[0.08em] transition-all duration-700 ease-expo md:text-[2.45rem] ${slideIndex === index ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                  key={`title-${item.slug}`}
                >
                  {item.title[locale]}
                </h3>
              ))}
            </div>
            <div className="relative mx-auto mt-2 h-14 max-w-[44rem] overflow-hidden md:mt-3 md:h-12">
              {slides.map((item, slideIndex) => (
                <p
                  aria-hidden={slideIndex !== index}
                  className={`absolute inset-x-0 top-0 text-sm leading-6 text-white/72 transition-all duration-700 ease-expo md:text-[0.95rem] md:leading-7 ${slideIndex === index ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                  key={`description-${item.slug}`}
                >
                  {item.description[locale]}
                </p>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[54rem] flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="label-caps inline-flex min-w-[12rem] justify-center border border-white/35 px-7 py-3 transition-colors hover:bg-white hover:text-charcoal md:min-w-[13rem] md:px-8 md:py-3.5" href={localizedPath(locale, slide.href)}>
              View
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
