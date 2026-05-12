import Link from "next/link";
import { heroVideo, site } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type HeroVideoProps = {
  locale: Locale;
};

export function HeroVideo({ locale }: HeroVideoProps) {
  return (
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden bg-charcoal">
      <video autoPlay className="absolute inset-0 h-full w-full object-cover" loop muted playsInline poster={heroVideo.poster}>
        <source src={heroVideo.src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-margin-mobile text-center text-white">
        <h1 className="max-w-6xl font-serif text-5xl leading-[1.05] tracking-[0.12em] md:text-7xl lg:text-8xl">
          The Intersection of
          <br />
          <span className="italic normal-case tracking-normal">Texture and Precision</span>
        </h1>
        <p className="mt-8 font-sans text-base font-light tracking-[0.35em] md:text-2xl">{site.slogan.ja}</p>
        <Link
          className="label-caps mt-14 border border-white/45 px-10 py-5 transition-colors hover:bg-white hover:text-charcoal"
          href={localizedPath(locale, "/materials")}
        >
          Discover the Collection
        </Link>
      </div>
    </section>
  );
}
