"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ParallaxCarousel from "@/components/ParallaxCarousel";
import type { ProjectCase } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type MaterialProjectCarouselProps = {
  locale: Locale;
  materialName: string;
  projectTitleLinks: Record<string, ProjectTitleLink[]>;
  projects: ProjectCase[];
};

type ProjectImageEntry = {
  src: string;
  title: string;
  titleLinks: ProjectTitleLink[];
};

export type ProjectTitleLink = {
  href: string;
  label: string;
};

function buildProjectImages(projects: ProjectCase[], locale: Locale, projectTitleLinks: Record<string, ProjectTitleLink[]>): ProjectImageEntry[] {
  const entries = new Map<string, ProjectImageEntry>();

  for (const project of projects) {
    const images = project.projectImages.length ? project.projectImages : [project.image];

    for (const src of images.filter(Boolean)) {
      if (!entries.has(src)) {
        entries.set(src, {
          src,
          title: project.title[locale],
          titleLinks: projectTitleLinks[project.slug] ?? []
        });
      }
    }
  }

  return [...entries.values()];
}

type TitleMatch = ProjectTitleLink & {
  end: number;
  start: number;
};

function buildTitleMatches(title: string, links: ProjectTitleLink[]): TitleMatch[] {
  const matches: TitleMatch[] = [];

  for (const link of links) {
    const pattern = new RegExp(`${escapeRegExp(link.label)}(?:\\s+\\d{3,5})?`, "ig");
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(title)) !== null) {
      matches.push({
        ...link,
        start: match.index,
        end: match.index + match[0].length
      });
    }
  }

  matches.sort((left, right) => left.start - right.start || right.label.length - left.label.length);

  const selected: TitleMatch[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start < cursor) {
      continue;
    }

    selected.push(match);
    cursor = match.end;
  }

  return selected;
}

function renderLinkedTitle(title: string, locale: Locale, links: ProjectTitleLink[]) {
  const matches = buildTitleMatches(title, links);

  if (matches.length === 0) {
    return title;
  }

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      nodes.push(title.slice(cursor, match.start));
    }

    nodes.push(
      <Link
        className="underline decoration-charcoal/45 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold"
        href={localizedPath(locale, match.href)}
        key={`${match.href}-${match.start}`}
      >
        {title.slice(match.start, match.end)}
      </Link>
    );

    cursor = match.end;
  }

  if (cursor < title.length) {
    nodes.push(title.slice(cursor));
  }

  return nodes;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function MaterialProjectCarousel({ locale, materialName, projectTitleLinks, projects }: MaterialProjectCarouselProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const projectImages = useMemo(() => buildProjectImages(projects, locale, projectTitleLinks), [locale, projectTitleLinks, projects]);
  const activeImageEntry = projectImages.find((item) => item.src === activeImage) ?? null;
  const activeTitleContent = useMemo(
    () => (activeImageEntry ? renderLinkedTitle(activeImageEntry.title, locale, activeImageEntry.titleLinks) : null),
    [activeImageEntry, locale]
  );

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveImage(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImage]);

  if (projectImages.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-stone py-12 md:py-16" data-nav-invert>
      <div className="section-shell mb-6 md:mb-8">
        <p className="label-caps text-gold">Gallery</p>
        <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-charcoal md:text-6xl">
          {locale === "en" ? `${materialName} gallery.` : `${materialName} のギャラリー。`}
        </h2>
        <div className="mt-8 h-px w-20 bg-gold" />
      </div>

      <div className="relative h-[46svh] min-h-[20rem] w-full md:h-[52svh] md:min-h-[28rem]">
        <ParallaxCarousel
          autoplaySpeed={projectImages.length > 1 ? 42 : 0}
          borderRadius={18}
          dragSensitivity={1.4}
          gap={36}
          imageFit="cover"
          imageHeight={620}
          imageWidth={460}
          images={projectImages.map((item) => item.src)}
          lerp={0.08}
          loop={projectImages.length > 1}
          onImageClick={(src) => setActiveImage(src)}
          parallaxIntensity={0}
          pauseOnHover
          showProgress={false}
          uvScale={0}
          wheelSensitivity={1}
        />
      </div>

      {activeImage && activeImageEntry ? (
        <div
          aria-label={locale === "en" ? "Expanded gallery image" : "拡大ギャラリー画像"}
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-charcoal/92 px-4 py-4 backdrop-blur-md md:px-8 md:py-6"
          onClick={() => setActiveImage(null)}
          role="dialog"
        >
          <div
            className="flex h-full w-full flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative mb-4 flex justify-center md:mb-6">
              <div className="max-w-[min(68rem,calc(100vw-8.5rem))] bg-white/92 px-4 py-3 text-center text-charcoal shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur md:px-5 md:py-4">
                <p className="label-caps text-[0.62rem] text-charcoal/55">{locale === "en" ? "Project" : "プロジェクト"}</p>
                <h3 className="mt-1 break-words font-serif text-lg leading-tight md:text-2xl">{activeTitleContent}</h3>
              </div>
              <button
                aria-label={locale === "en" ? "Close expanded image" : "拡大画像を閉じる"}
                className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-white text-charcoal shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition-transform hover:scale-[1.03]"
                onClick={() => setActiveImage(null)}
                type="button"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <Image
                alt={activeImageEntry.title || (locale === "en" ? `${materialName} gallery image` : `${materialName} のギャラリー画像`)}
                className="object-contain"
                fill
                sizes="100vw"
                src={activeImageEntry.src}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
