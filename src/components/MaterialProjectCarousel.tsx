"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ParallaxCarousel from "@/components/ParallaxCarousel";
import type { ProjectCase } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type MaterialProjectCarouselProps = {
  locale: Locale;
  materialName: string;
  projectLinks: Record<string, ProjectLink[]>;
  projects: ProjectCase[];
};

type ProjectImageEntry = {
  src: string;
  title: string;
  projectLinks: ProjectLink[];
};

export type ProjectLink = {
  href: string;
  label: string;
};

function buildProjectImages(projects: ProjectCase[], locale: Locale, projectLinks: Record<string, ProjectLink[]>): ProjectImageEntry[] {
  const entries = new Map<string, ProjectImageEntry>();

  for (const project of projects) {
    const images = project.projectImages.length ? project.projectImages : [project.image];

    for (const src of images.filter(Boolean)) {
      if (!entries.has(src)) {
        entries.set(src, {
          src,
          title: project.title[locale],
          projectLinks: projectLinks[project.slug] ?? []
        });
      }
    }
  }

  return [...entries.values()];
}

export function MaterialProjectCarousel({ locale, materialName, projectLinks, projects }: MaterialProjectCarouselProps) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const projectImages = useMemo(() => buildProjectImages(projects, locale, projectLinks), [locale, projectLinks, projects]);
  const activeImageEntry = projectImages.find((item) => item.src === activeImage) ?? null;

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

  function handleProjectLinkClick(href: string) {
    setActiveImage(null);
    router.push(localizedPath(locale, href));
  }

  if (projectImages.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-stone py-12 md:py-16" data-nav-invert>
      <div className="section-shell mb-6 md:mb-8">
        <p className="label-caps text-gold">{locale === "en" ? "Gallery" : "ギャラリー"}</p>
        <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-charcoal md:text-6xl">
          {materialName.toUpperCase()}
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
          pauseOnHover
          showProgress={false}
          wheelSensitivity={1}
        />
      </div>

      {activeImage && activeImageEntry ? (
        <div
          aria-label={locale === "en" ? "Expanded gallery image" : "拡大ギャラリー画像"}
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-charcoal/92 px-4 py-4 backdrop-blur-md md:px-8 md:py-6"
          data-lenis-prevent
          onClick={() => setActiveImage(null)}
          role="dialog"
        >
          <div
            className="flex h-full w-full flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative mb-4 flex justify-center md:mb-6">
              <div className="max-w-[min(68rem,calc(100vw-8.5rem))] bg-white/92 px-4 py-3 text-center text-charcoal shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur md:px-5 md:py-4">
                <h3 className="break-words font-serif text-lg leading-tight md:text-2xl">{activeImageEntry.title}</h3>
                {activeImageEntry.projectLinks.length > 0 ? (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-[0.76rem] uppercase tracking-[0.12em] text-charcoal/70">
                    {activeImageEntry.projectLinks.map((link) => (
                      <Link
                        className="transition-colors hover:text-gold"
                        href={localizedPath(locale, link.href)}
                        key={link.href}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleProjectLinkClick(link.href);
                        }}
                      >
                        <span>See </span>
                        <span className="border-b border-current pb-[2px]">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
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
