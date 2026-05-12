"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { heroVideo, site } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type HeroVideoProps = {
  locale: Locale;
};

export function HeroVideo({ locale }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(heroVideo.src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = heroVideo.src;
    }
  }, []);

  return (
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden bg-charcoal">
      <video
        ref={videoRef}
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster={heroVideo.poster}
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-margin-mobile text-center text-white">
        <h1 className="mb-8 max-w-[20rem] font-serif text-[1.6rem] uppercase leading-[1.08] tracking-[0.12em] md:max-w-[28rem] md:text-[2.2rem] lg:text-[2.6rem]">
          The Intersection of
          <br />
          <span className="mt-1 inline-block text-[0.88em] italic font-normal normal-case tracking-[0.04em]">
            Texture and Precision
          </span>
        </h1>
        <p className="mb-14 font-sans text-[0.72rem] font-light tracking-[0.28em] text-white/90 md:text-[0.95rem]">
          {site.slogan.ja}
        </p>
        <Link
          className="label-caps min-w-[16rem] border border-white/45 px-8 py-4 transition-colors hover:bg-white hover:text-charcoal md:min-w-[22rem] md:px-10"
          href={localizedPath(locale, "/materials")}
        >
          Discover the Collection
        </Link>
      </div>
    </section>
  );
}
