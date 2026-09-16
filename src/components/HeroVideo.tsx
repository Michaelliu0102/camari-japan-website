"use client";

import { chineseCopy } from "../china/copy";
import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { HomeHero } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type HeroVideoProps = {
  locale: Locale;
  hero: HomeHero;
};

export function HeroVideo({ hero, locale }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const isHlsSource = hero.videoSrc.includes(".m3u8");

    if (isHlsSource && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hero.videoSrc);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    if (!isHlsSource || video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hero.videoSrc;
    }
  }, [hero.videoSrc]);

  return (
    <section className="relative h-[100svh] min-h-[36rem] w-full overflow-hidden bg-charcoal md:min-h-[680px]">
      <video
        ref={videoRef}
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster={hero.poster}
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32svh] bg-gradient-to-b from-transparent via-charcoal/45 to-charcoal" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-margin-mobile pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(var(--nav-height)+2rem)] text-center text-white">
        <h1 className="mb-6 max-w-[19rem] font-serif text-[clamp(1.25rem,6.4vw,1.6rem)] uppercase leading-[1.12] tracking-[0.1em] md:mb-8 md:max-w-[26rem] md:text-[1.9rem] md:tracking-[0.12em] lg:text-[2.2rem]">
          {locale === "zh" ? hero.title.zh : hero.title.en}
          <br />
          <span className="mt-1 inline-block text-[0.88em] italic font-normal normal-case tracking-[0.04em]">
            {locale === "zh" ? hero.subtitle.zh : hero.subtitle.en}
          </span>
        </h1>
        <p className="mb-10 max-w-[20rem] font-sans text-[0.72rem] font-light leading-6 tracking-[0.2em] text-white/90 md:mb-14 md:max-w-none md:text-[0.95rem] md:tracking-[0.28em]">
          {locale === "zh" ? "材料 · 定制 · 精工制造" : hero.subtitle.ja}
        </p>
        <Link
          className="label-caps inline-flex min-h-12 w-full max-w-[20rem] items-center justify-center border border-white/45 px-6 py-3 transition-colors hover:bg-white hover:text-charcoal md:min-h-0 md:w-auto md:min-w-[22rem] md:max-w-none md:px-10 md:py-4"
          href={localizedPath(locale, hero.ctaHref)}
        >
          {hero.ctaLabel[locale]}
        </Link>
      </div>
      <a
        aria-label={locale === "zh" ? chineseCopy("Scroll to explore") : locale === "en" ? "Scroll to explore" : "Explore へスクロール"}
        className="group absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/75 transition-colors hover:text-white md:flex"
        href="#home-explore"
      >
        <span className="font-sans text-[0.62rem] uppercase tracking-[0.32em]">{locale === "zh" ? "探索" : "Explore"}</span>
        <span className="h-10 w-px origin-top bg-gradient-to-b from-current to-transparent transition-transform duration-500 ease-expo group-hover:scale-y-125" />
      </a>
    </section>
  );
}
