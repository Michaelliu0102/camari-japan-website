"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Download } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type DownloadAccordionGroup = {
  slug: string;
  label: Record<Locale, string>;
  intro: Record<Locale, string>;
  downloads: Download[];
};

type DownloadAccordionProps = {
  downloadLabel: string;
  fileLabel: string;
  groups: DownloadAccordionGroup[];
  locale: Locale;
};

export function DownloadAccordion({ downloadLabel, fileLabel, groups, locale }: DownloadAccordionProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    const openFromHash = () => {
      const slug = window.location.hash.replace("#", "");

      if (groups.some((group) => group.slug === slug)) {
        setOpenSlug(slug);
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    return () => window.removeEventListener("hashchange", openFromHash);
  }, [groups]);

  return (
    <div className="border-t border-charcoal/15">
      {groups.map((group) => {
        const isOpen = openSlug === group.slug;
        const panelId = `download-panel-${group.slug}`;
        const buttonId = `download-trigger-${group.slug}`;

        return (
          <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-b border-charcoal/15" id={group.slug} key={group.slug}>
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="group grid w-full gap-6 py-9 text-left transition-colors duration-300 ease-expo hover:bg-charcoal/[0.025] focus-visible:bg-charcoal/[0.025] focus-visible:outline-none md:grid-cols-[minmax(12rem,0.36fr)_minmax(0,1fr)_auto] md:items-center md:px-2"
              id={buttonId}
              onClick={() => setOpenSlug(isOpen ? null : group.slug)}
              type="button"
            >
              <span>
                <span className="label-caps block text-gold">
                  {String(group.downloads.length).padStart(2, "0")} {fileLabel}
                </span>
                <span className="mt-5 block font-serif text-4xl leading-none text-charcoal md:text-5xl">
                  {group.label[locale]}
                </span>
              </span>
              <span className="max-w-[34rem] text-base leading-8 text-muted md:text-right">
                {group.intro[locale]}
              </span>
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 font-sans text-2xl leading-none text-charcoal transition-transform duration-300 ease-expo group-hover:border-charcoal/40 md:justify-self-end"
              >
                <span className={`block transition-transform duration-300 ease-expo ${isOpen ? "rotate-45" : "rotate-0"}`}>
                  +
                </span>
              </span>
            </button>
            <div
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-expo ${
                isOpen ? "grid-rows-[1fr] pb-10 opacity-100" : "grid-rows-[0fr] pb-0 opacity-0"
              }`}
              id={panelId}
              role="region"
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-3 border-t border-charcoal/10 pt-2">
                  {group.downloads.map((download) => (
                    <Link
                      className="group/download flex items-center justify-between gap-8 border-b border-charcoal/10 py-5 transition-colors hover:border-charcoal/25"
                      href={download.href}
                      key={`${download.type}-${download.href}`}
                    >
                      <span>
                        <span className="label-caps block text-[10px] text-charcoal">
                          {download.title[locale]}
                        </span>
                        <span className="mt-1 block text-[0.8rem] leading-relaxed text-muted">
                          {download.description[locale]}
                        </span>
                      </span>
                      <span className="label-caps shrink-0 text-[9px] text-muted transition-colors group-hover/download:text-charcoal">
                        {downloadLabel}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
