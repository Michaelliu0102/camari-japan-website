import type { Metadata } from "next";
import Image from "next/image";
import { ShinyHeading } from "@/components/ShinyHeading";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadAboutPageSettings } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const dynamic = "force-dynamic";

function splitParagraphs(paragraphs: Array<Record<Locale, string>>, locale: Locale): string[] {
  return paragraphs.flatMap((paragraph) =>
    paragraph[locale]
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const aboutSettings = await loadAboutPageSettings();

  return createPageMetadata({
    locale,
    path: "/about",
    title: aboutSettings.seo.title[locale],
    description: aboutSettings.seo.description[locale],
    image: aboutSettings.seo.image ?? aboutSettings.heroImage
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const aboutSettings = await loadAboutPageSettings();
  const bodyParagraphs = splitParagraphs(aboutSettings.bodyParagraphs, locale);
  const manufacturingParagraphs = splitParagraphs(aboutSettings.manufacturingParagraphs, locale);

  return (
    <main>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[oklch(0.82_0.01_82)] text-[oklch(0.96_0.01_85)]">
        <Image
          alt={aboutSettings.heroAlt[locale]}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={aboutSettings.heroImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(104deg,rgba(92,86,80,0.36)_8%,rgba(92,86,80,0.18)_34%,rgba(92,86,80,0.08)_64%,rgba(92,86,80,0.04)_100%)]" />
        <div className="absolute left-0 right-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(78,72,68,0.42)_0%,rgba(78,72,68,0.18)_58%,rgba(78,72,68,0)_100%)] md:h-36" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,241,0.06)_0%,rgba(248,246,241,0)_42%,rgba(242,239,233,0.18)_78%,rgba(242,239,233,0.72)_100%)]" />
        <div className="section-shell relative z-10 flex w-full pb-32 pt-[calc(var(--nav-height)+3.5rem)] md:pb-36 md:pt-[calc(var(--nav-height)+4.5rem)]">
          <h1 className="about-hero-wordmark max-w-[8ch] text-[2.5rem] leading-[0.96] text-[oklch(0.965_0.008_85)] [text-shadow:0_1px_10px_rgba(48,42,36,0.12)] md:text-[4.1rem] lg:text-[4.8rem]">
            {aboutSettings.heroTitle[locale]}
          </h1>
        </div>
        <a
          className="group absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[oklch(0.48_0.018_78)] transition-opacity hover:opacity-100 md:bottom-8"
          href="#about-company"
        >
          <span className="about-hero-explore text-[0.72rem] opacity-90">{aboutSettings.exploreLabel[locale]}</span>
          <span className="about-hero-explore-line h-14 w-px bg-[linear-gradient(180deg,rgba(103,95,88,0.95)_0%,rgba(103,95,88,0.18)_100%)] transition-transform duration-500 group-hover:scale-y-110" />
        </a>
      </section>
      <section className="bg-paper py-24 md:py-36" data-nav-invert id="about-company">
        <div className="section-shell">
          <div className="max-w-[92rem]">
            <p className="label-caps text-gold">{aboutSettings.bodyLabel[locale]}</p>
            <ShinyHeading
              className="about-copy-title mt-5 text-[2.05rem] leading-[1.04] md:text-[3.25rem] lg:text-[3.7rem]"
              color="#2f2d2a"
              shineColor="#ffffff"
              text={aboutSettings.bodyTitle[locale]}
            />
          </div>
          <div className="mt-14 max-w-[92rem] space-y-10 text-[1.05rem] leading-[1.72] text-muted md:mt-16 md:text-[1.12rem] md:leading-[1.78]">
            {bodyParagraphs.map((paragraph, index) => (
              <p className="max-w-none" key={`${locale}-about-copy-${index}`}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-24 max-w-[92rem] md:mt-32">
            <p className="label-caps text-gold">{aboutSettings.manufacturingLabel[locale]}</p>
            <ShinyHeading
              className="about-copy-title mt-5 text-[2.05rem] leading-[1.04] md:text-[3.25rem] lg:text-[3.7rem]"
              color="#2f2d2a"
              shineColor="#ffffff"
              text={aboutSettings.manufacturingTitle[locale]}
            />
          </div>
          <div className="mt-10 max-w-[92rem] space-y-10 text-[1.05rem] leading-[1.72] text-muted md:mt-12 md:text-[1.12rem] md:leading-[1.78]">
            {manufacturingParagraphs.map((paragraph, index) => (
              <p className="max-w-none" key={`${locale}-about-manufacturing-${index}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
