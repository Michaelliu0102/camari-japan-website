"use client";

import { chineseCopy } from "../china/copy";
import Hls from "hls.js";
import { useEffect, useRef } from "react";
import type { HomeHero } from "@/lib/content";
import type { Locale } from "@/lib/locales";

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
      <div className="absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center px-margin-mobile text-center text-white md:bottom-8">
        <h1 className="font-sans font-normal [text-shadow:0_1px_12px_rgba(0,0,0,0.2)]">
          <span className="block text-xs leading-5 tracking-[0.02em] md:text-[13px]">
            {hero.title[locale]}
          </span>
          <span className="mt-2 block text-[22px] leading-tight tracking-[-0.01em] md:text-2xl">
            {hero.subtitle[locale]}
          </span>
        </h1>
        <a
          aria-label={locale === "zh" ? chineseCopy("Scroll to explore") : locale === "en" ? "Scroll to explore" : "Explore へスクロール"}
          className="group mt-6 inline-flex min-h-12 w-full max-w-[20rem] flex-col items-center gap-3 text-white/75 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white md:mt-7"
          href="#home-explore"
        >
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.32em] underline decoration-[1px] underline-offset-[5px]">{locale === "zh" ? "即刻探索" : "Explore"}</span>
          <span aria-hidden="true" className="h-10 w-px origin-top bg-gradient-to-b from-current to-transparent transition-transform duration-500 ease-expo group-hover:scale-y-125 motion-reduce:transition-none motion-reduce:group-hover:scale-y-100" />
        </a>
      </div>
    </section>
  );
}
