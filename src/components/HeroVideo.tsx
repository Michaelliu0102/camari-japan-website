"use client";

import { chinaMediaUrl } from "@/lib/china-media";
import { chineseCopy } from "../china/copy";
import type Hls from "hls.js";
import { editorialImageUrl } from "@/lib/editorial-image";
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
    let disposed = false;
    let inView = false;
    let hls: Hls | undefined;
    let loading = false;
    let initialized = false;
    let initializing = false;
    const isHlsSource = hero.videoSrc.includes(".m3u8");
    const active = () => inView && !document.hidden;

    function syncPlayback() {
      if (disposed) return;
      if (!active()) {
        video!.pause();
        if (loading) { hls?.stopLoad(); loading = false; }
        return;
      }
      if (!initialized) { void initialize(); return; }
      if (hls && !loading) { hls.startLoad(-1); loading = true; }
      // Autoplay can be denied by the browser; the poster and text remain usable.
      void video!.play().catch(() => {});
    }

    async function initialize() {
      if (initializing || initialized || disposed) return;
      initializing = true;
      try {
        if (isHlsSource) {
          const { default: HlsPlayer } = await import("hls.js");
          if (disposed) return;
          if (HlsPlayer.isSupported()) {
            hls = new HlsPlayer({
              autoStartLoad: false,
              capLevelToPlayerSize: false,
              // Limit look-ahead; keep adaptive quality and the original video.
              maxBufferLength: 8,
              maxMaxBufferLength: 12,
              backBufferLength: 10,
            });
            hls.on(HlsPlayer.Events.MANIFEST_PARSED, () => {
              if (!hls) return;
              const fullHd = hls.levels.reduce((last, level, index) => level.height <= 1080 ? index : last, -1);
              if (fullHd >= 0) hls.autoLevelCapping = fullHd;
              syncPlayback();
            });
            hls.loadSource(hero.videoSrc);
            hls.attachMedia(video!);
          } else if (video!.canPlayType("application/vnd.apple.mpegurl")) {
            video!.src = hero.videoSrc;
          }
        } else {
          video!.src = hero.videoSrc;
        }
        initialized = true;
        syncPlayback();
      } catch {
        // Failed player loads leave the still image visible rather than blocking the page.
      } finally {
        initializing = false;
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio > 0.05;
      syncPlayback();
    }, { threshold: 0.05 });
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [hero.videoSrc]);

  return (
    <section className="relative h-[100svh] min-h-[36rem] w-full overflow-hidden bg-charcoal md:min-h-[680px]">
      <video
        ref={videoRef}
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster={chinaMediaUrl(editorialImageUrl(hero.poster, 1920))}
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
