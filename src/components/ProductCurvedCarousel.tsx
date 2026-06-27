"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import type { LocalizedString } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type ProductCarouselImage = {
  src: string;
  title: LocalizedString;
  description: LocalizedString;
  details: LocalizedString[];
  galleryImages: string[];
};

type ProductCurvedCarouselProps = {
  heroImage: string;
  images: ProductCarouselImage[];
  locale: Locale;
  subtitle: string;
  title: string;
};

export function ProductCurvedCarousel({ heroImage, images, locale, subtitle, title }: ProductCurvedCarouselProps) {
  const [activeDetailIndex, setActiveDetailIndex] = useState<number | null>(null);
  const [activeGalleryImageIndex, setActiveGalleryImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroCarouselPlanes = useMemo(() => {
    const angles = [90, 120, 150, 180, 60, 30];

    return angles.map((angle, planeIndex) => ({
      angle,
      cards: [0, 1].map((cardIndex) => {
        const sourceIndex = planeIndex * 2 + cardIndex;
        const item = images[sourceIndex];

        return { item, sourceIndex };
      })
    }));
  }, [images]);
  const activeItem = activeDetailIndex === null ? null : images[activeDetailIndex];
  const detailGalleryImages = activeItem ? (activeItem.galleryImages.length ? activeItem.galleryImages : [activeItem.src]) : [];
  const isDetailOpen = activeDetailIndex !== null;
  const titleWords = title.split(" ").filter(Boolean);
  const titleLines = titleWords.length > 2 ? [titleWords.slice(0, -1).join(" "), titleWords[titleWords.length - 1]] : titleWords;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(media.matches);

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);

    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const updateDetailState = () => {
      const match = window.location.hash.match(/^#surface-detail-(\d+)$/);
      const nextIndex = match ? Number(match[1]) : null;
      const detailIsOpen = nextIndex !== null && nextIndex >= 0 && nextIndex < images.length;

      setActiveDetailIndex(detailIsOpen ? nextIndex : null);
      setActiveGalleryImageIndex(0);
      document.body.style.overflow = detailIsOpen ? "hidden" : previousOverflow;
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && window.location.hash.startsWith("#surface-detail-")) {
        window.location.hash = "curved-gallery";
      }
    };

    updateDetailState();
    window.addEventListener("hashchange", updateDetailState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("hashchange", updateDetailState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  function openDetailView(index: number) {
    const nextIndex = index % images.length;

    setActiveDetailIndex(nextIndex);
    setActiveGalleryImageIndex(0);
    window.history.replaceState(null, "", `#surface-detail-${nextIndex}`);
    document.body.style.overflow = "hidden";
  }

  function closeDetailView() {
    setActiveDetailIndex(null);
    setActiveGalleryImageIndex(0);
    window.location.hash = "curved-gallery";
    document.body.style.overflow = "";
  }

  function showPreviousImage() {
    if (activeDetailIndex === null) {
      return;
    }

    openDetailView((activeDetailIndex - 1 + images.length) % images.length);
  }

  function showNextImage() {
    if (activeDetailIndex === null) {
      return;
    }

    openDetailView((activeDetailIndex + 1) % images.length);
  }

  function openNearestHeroCard(event: PointerEvent<HTMLDivElement>) {
    const cards = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>(".hero-orbit-card"));
    const pointerX = event.clientX;
    const pointerY = event.clientY;
    let nearestCard: { distance: number; index: number } | null = null;

    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const isNearCard =
        pointerX >= rect.left - 16 &&
        pointerX <= rect.right + 16 &&
        pointerY >= rect.top - 16 &&
        pointerY <= rect.bottom + 16;

      if (!isNearCard || rect.width < 24 || rect.height < 24) {
        continue;
      }

      const distance = Math.hypot(pointerX - (rect.left + rect.width / 2), pointerY - (rect.top + rect.height / 2));
      const index = Number(card.dataset.carouselIndex);

      if (Number.isNaN(index)) {
        continue;
      }

      if (!nearestCard || distance < nearestCard.distance) {
        nearestCard = { distance, index };
      }
    }

    if (!nearestCard) {
      return;
    }

    event.preventDefault();
    openDetailView(nearestCard.index);
  }

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-paper text-center text-charcoal md:min-h-[1000px]" data-nav-invert>
      <div className="relative z-40 mx-auto w-full px-margin-mobile pt-[calc(var(--nav-height)+3.5rem)] md:max-w-[1700px] md:px-margin-desktop md:pt-[136px]">
        <h1 className="mx-auto max-w-[min(92rem,94vw)] font-sans text-[clamp(1.85rem,3.45vw,4.1rem)] font-normal uppercase leading-[1.08] tracking-[0.16em] text-charcoal md:tracking-[0.22em]">
          {titleLines.map((line, index) => (
            <span className="block md:whitespace-nowrap" key={`${line}-${index}`}>
              {line}
            </span>
          ))}
        </h1>
        <p className="mx-auto mt-6 max-w-[56rem] font-sans text-[clamp(0.98rem,1.3vw,1.35rem)] font-normal leading-[1.55] tracking-normal text-charcoal/78 md:mt-7">
          {subtitle}
        </p>
        <a
          className="mt-6 inline-flex min-h-[2.75rem] min-w-[10.5rem] items-center justify-center border border-charcoal bg-transparent px-8 font-label text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-charcoal transition duration-300 hover:bg-charcoal hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/35 md:mt-7 md:min-w-[14rem]"
          href="#curved-gallery"
        >
          View All
        </a>
      </div>

      <div className="absolute left-1/2 top-[414px] z-30 h-[400px] w-[1600px] -translate-x-1/2 overflow-hidden md:top-[396px] md:h-[600px]" id="curved-gallery">
        <div className="hero-orbit-stage absolute inset-0" onPointerDown={openNearestHeroCard}>
          <div
            className="hero-orbit-track"
            style={{
              animationPlayState: prefersReducedMotion || isDetailOpen ? "paused" : "running"
            }}
          >
            {heroCarouselPlanes.map((plane, planeIndex) => (
              <div
                className="hero-orbit-plane"
                key={`plane-${plane.angle}`}
                style={{ transform: `translate3d(-50%, -50%, 0) rotateY(${plane.angle}deg)` }}
              >
                {plane.cards.map(({ item, sourceIndex }, cardIndex) =>
                  item ? (
                    <a
                      aria-label={`${locale === "en" ? "Open details for" : "詳細を開く"} ${item.title[locale]}`}
                      className={`hero-orbit-card group cursor-zoom-in ${cardIndex === 0 ? "hero-orbit-card-left" : "hero-orbit-card-right"}`}
                      data-carousel-index={sourceIndex}
                      href={`#surface-detail-${sourceIndex}`}
                      key={`${planeIndex}-${cardIndex}-${item.src}`}
                      style={{
                        cursor: "zoom-in",
                        transform: `rotateY(${cardIndex === 0 ? 90 : -90}deg)`
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        openDetailView(sourceIndex);
                      }}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        openDetailView(sourceIndex);
                      }}
                    >
                      <Image
                        alt={item.title[locale]}
                        className="pointer-events-none object-cover"
                        fill
                        sizes="(min-width: 1024px) 18rem, 42vw"
                        src={item.src}
                      />
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-12 text-xs font-semibold uppercase tracking-[0.18em] text-white opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        {locale === "en" ? "View surface" : "詳細を見る"}
                      </span>
                    </a>
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`hero-orbit-card hero-orbit-placeholder ${cardIndex === 0 ? "hero-orbit-card-left" : "hero-orbit-card-right"}`}
                      key={`placeholder-${planeIndex}-${cardIndex}`}
                      style={{ transform: `rotateY(${cardIndex === 0 ? 90 : -90}deg)` }}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[22%] bg-gradient-to-l from-paper to-transparent" />
      </div>

      {mounted && activeItem
        ? createPortal(
          <div
            aria-label={activeItem.title[locale]}
            aria-modal="true"
            className="fixed inset-0 z-[200] overflow-y-auto bg-[#f7f4ed] text-left text-charcoal"
            id={`surface-detail-${activeDetailIndex}`}
            role="dialog"
          >
            <button
              aria-label={locale === "en" ? "Close detail view" : "詳細ビューを閉じる"}
              className="fixed right-5 top-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/15 bg-white/90 text-charcoal shadow-[0_18px_60px_rgba(26,26,26,0.16)] backdrop-blur transition hover:bg-white"
              onClick={closeDetailView}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.35fr)_minmax(25rem,0.65fr)]">
              <div className="relative flex min-h-[58vh] flex-col bg-white lg:min-h-screen">
                <div className="relative min-h-[58vh] flex-1 bg-white lg:min-h-0">
                  <Image
                    alt={activeItem.title[locale]}
                    className="object-contain"
                    fill
                    priority
                    sizes="(min-width: 1024px) 68vw, 100vw"
                    src={detailGalleryImages[activeGalleryImageIndex] ?? activeItem.src}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 border-t border-charcoal/10 bg-white p-3 sm:grid-cols-6 lg:grid-cols-8">
                  {detailGalleryImages.map((thumbnailSrc, index) => (
                    <button
                      aria-label={`${locale === "en" ? "Open gallery image" : "ギャラリー画像を開く"} ${index + 1}`}
                      className={`relative aspect-[4/3] overflow-hidden border transition ${
                        index === activeGalleryImageIndex ? "border-charcoal" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      key={`${activeItem.src}-gallery-${thumbnailSrc}`}
                      onClick={() => setActiveGalleryImageIndex(index)}
                      type="button"
                    >
                      <Image alt="" className="object-cover" fill sizes="7rem" src={thumbnailSrc} />
                    </button>
                  ))}
                </div>
                <button
                  aria-label={locale === "en" ? "Previous image" : "前の画像"}
                  className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal shadow-lg transition hover:bg-white lg:flex"
                  onClick={showPreviousImage}
                  type="button"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label={locale === "en" ? "Next image" : "次の画像"}
                  className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal shadow-lg transition hover:bg-white lg:flex"
                  onClick={showNextImage}
                  type="button"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <aside className="flex min-h-screen flex-col bg-[#f7f4ed] px-6 py-7 md:px-10 lg:px-12 lg:py-10">
                <div className="mb-8 flex items-center gap-6">
                  <p className="label-caps text-gold">{locale === "en" ? "Surface detail" : "サーフェス詳細"}</p>
                </div>

                <div className="border-b border-charcoal/12 pb-8">
                  <p className="label-caps text-muted">{String((activeDetailIndex ?? 0) + 1).padStart(2, "0")}</p>
                  <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
                    {activeItem.title[locale]}
                  </h2>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-muted md:text-base">
                    {activeItem.description[locale]}
                  </p>
                </div>

                <div className="divide-y divide-charcoal/12 border-b border-charcoal/12">
                  <details className="group py-5" open>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-sans text-sm font-semibold uppercase tracking-[0.12em]">
                      {locale === "en" ? "Details" : "詳細"}
                      <span className="text-lg leading-none text-muted transition group-open:rotate-45">+</span>
                    </summary>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
                      {activeItem.details.map((detail) => (
                        <li className="border-l border-gold/45 pl-4" key={detail.en}>
                          {detail[locale]}
                        </li>
                      ))}
                    </ul>
                  </details>

                  <details className="group py-5" open>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-sans text-sm font-semibold uppercase tracking-[0.12em]">
                      {locale === "en" ? "Other images" : "その他の画像"}
                      <span className="text-lg leading-none text-muted transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {detailGalleryImages.map((gallerySrc, index) => (
                        <button
                          aria-label={`${locale === "en" ? "Open gallery image" : "ギャラリー画像を開く"} ${index + 1}`}
                          className={`relative aspect-square overflow-hidden border bg-white transition ${
                            index === activeGalleryImageIndex ? "border-charcoal" : "border-charcoal/10 opacity-75 hover:opacity-100"
                          }`}
                          key={`related-${activeItem.src}-${gallerySrc}`}
                          onClick={() => setActiveGalleryImageIndex(index)}
                          type="button"
                        >
                          <Image alt="" className="object-cover" fill sizes="9rem" src={gallerySrc} />
                        </button>
                      ))}
                    </div>
                  </details>
                </div>

                <div className="mt-auto flex gap-3 pt-8 lg:hidden">
                  <button className="flex min-h-12 flex-1 items-center justify-center border border-charcoal/15 bg-white text-sm font-semibold" onClick={showPreviousImage} type="button">
                    {locale === "en" ? "Previous" : "前へ"}
                  </button>
                  <button className="flex min-h-12 flex-1 items-center justify-center border border-charcoal/15 bg-charcoal text-sm font-semibold text-white" onClick={showNextImage} type="button">
                    {locale === "en" ? "Next" : "次へ"}
                  </button>
                </div>
              </aside>
            </div>
          </div>,
          document.body
        )
        : null}

      <style>{`
        @keyframes hero-orbit-spin {
          from {
            transform: translate3d(-50%, 0, 0) perspective(var(--hero-perspective)) rotateY(0deg);
          }
          to {
            transform: translate3d(-50%, 0, 0) perspective(var(--hero-perspective)) rotateY(360deg);
          }
        }

        .hero-orbit-stage {
          --hero-card-width: 280px;
          --hero-card-height: 400px;
          --hero-perspective: 600px;
          --hero-plane-width: 1400px;
          --hero-plane-height: 400px;
          --hero-scale: clamp(0.76, 0.1vw + 0.72, 1.08);
          cursor: zoom-in;
          max-width: none;
          overflow: hidden;
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 19.7%, black 80%, transparent 100%);
          mask: linear-gradient(90deg, transparent 0%, black 19.7%, black 80%, transparent 100%);
        }

        .hero-orbit-track {
          animation: hero-orbit-spin 60s linear infinite;
          height: var(--hero-plane-height);
          left: 50%;
          position: absolute;
          top: calc(50% - var(--hero-plane-height) / 2);
          transform-style: preserve-3d;
          transform-origin: 50% 50%;
          scale: var(--hero-scale);
          width: var(--hero-plane-width);
          will-change: transform;
        }

        .hero-orbit-plane {
          height: 100%;
          left: 50%;
          position: absolute;
          top: 50%;
          transform-origin: 50% 50%;
          transform-style: preserve-3d;
          width: 100%;
        }

        .hero-orbit-card {
          backface-visibility: hidden;
          background: rgb(0 0 0 / 0.42);
          border-radius: 20px;
          box-shadow: 0 28px 80px rgb(0 0 0 / 0.38);
          cursor: zoom-in;
          display: block;
          height: var(--hero-card-height);
          overflow: hidden;
          pointer-events: auto;
          position: absolute;
          text-align: left;
          top: calc(50% - var(--hero-card-height) / 2);
          transform-style: preserve-3d;
          width: var(--hero-card-width);
          will-change: transform;
        }

        .hero-orbit-card-left {
          left: 0;
        }

        .hero-orbit-card-right {
          right: 0;
        }

        .hero-orbit-card::after {
          background: linear-gradient(180deg, rgb(255 255 255 / 0.16), transparent 28%, rgb(0 0 0 / 0.24));
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
        }

        .hero-orbit-card img {
          transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-orbit-card:hover img {
          transform: scale(1.045);
        }

        .hero-orbit-placeholder {
          background:
            linear-gradient(135deg, rgb(255 255 255 / 0.28), rgb(255 255 255 / 0) 42%),
            linear-gradient(160deg, rgb(31 30 27 / 0.18), rgb(147 132 105 / 0.2) 52%, rgb(31 30 27 / 0.12));
          box-shadow: 0 28px 80px rgb(0 0 0 / 0.14);
          cursor: default;
        }

        .hero-orbit-placeholder::before {
          background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.28), transparent);
          content: "";
          height: 100%;
          left: -80%;
          position: absolute;
          top: 0;
          transform: skewX(-18deg);
          width: 45%;
        }

        .hero-orbit-stage:hover .hero-orbit-track {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .hero-orbit-stage {
            --hero-scale: 0.66;
          }

          .hero-orbit-track {
            top: 0;
          }
        }
      `}</style>
    </section>
  );
}
