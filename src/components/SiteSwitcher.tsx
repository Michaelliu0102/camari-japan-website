"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { absoluteLocalizedUrl, localizedPath, type Locale } from "@/lib/locales";
import { siteConfig } from "@/lib/site-config";

const sites = [
  { locale: "en", label: { en: "GLOBAL", zh: "全球", ja: "グローバル" } },
  { locale: "zh", label: { en: "CHINA", zh: "中国", ja: "中国" } },
  { locale: "ja", label: { en: "JAPAN", zh: "日本", ja: "日本" } },
] as const;

function siteHref(locale: Locale, pathname: string) {
  // Chinese previews are local only in development; live sites use their own domains.
  const localPreview = siteConfig.enableLocalePreview
    && process.env.NEXT_PUBLIC_SITE_KEY !== "china"
    && (locale !== "zh" || process.env.NODE_ENV === "development");
  return localPreview ? localizedPath(locale, pathname) : absoluteLocalizedUrl(locale, pathname);
}

function SiteIcon({ locale }: { locale: Locale }) {
  if (locale === "en") return <Globe aria-hidden="true" size={16} strokeWidth={1.4} />;

  return (
    <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center text-[16px] leading-none">
      {locale === "zh" ? "🇨🇳" : "🇯🇵"}
    </span>
  );
}

export function SiteSwitcher({ locale, pathname, darkControls }: {
  locale: Locale;
  pathname: string;
  darkControls: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const current = sites.find((site) => site.locale === locale)!;
  const label = locale === "zh" ? "切换站点" : locale === "ja" ? "サイトを切り替える" : "Switch site";

  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div
      className={`relative z-50 shrink-0 font-label font-semibold uppercase ${locale === "en" ? "text-[9px] tracking-[0.14em] md:text-[10px] md:tracking-[0.2em]" : "text-[12px] tracking-[0.12em]"}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      ref={containerRef}
    >
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={`${label}: ${current.label[locale]}`}
        className={`flex min-h-11 items-center gap-2 border px-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 motion-safe:active:scale-[0.98] md:px-4 ${darkControls
          ? "border-charcoal/25 bg-charcoal/6 text-charcoal hover:bg-charcoal/10"
          : "border-white/25 bg-white/8 text-white hover:bg-white/15"}`}
        onClick={() => setOpen((value) => !value)}
        ref={buttonRef}
        type="button"
      >
        <SiteIcon locale={locale} />
        <span>{current.label[locale]}</span>
        <ChevronDown aria-hidden="true" className={open ? "rotate-180" : ""} size={13} strokeWidth={1.4} />
      </button>
      <nav
        aria-label={label}
        className="absolute right-0 top-full mt-2 w-44 border border-charcoal/15 bg-paper p-1 text-charcoal shadow-material"
        hidden={!open}
        id={panelId}
      >
        {sites.map((site) => (
          <a
            aria-current={site.locale === locale ? "true" : undefined}
            className={`flex min-h-11 items-center gap-3 px-3 transition-colors hover:bg-charcoal/5 focus-visible:bg-charcoal/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-charcoal ${site.locale === locale ? "bg-charcoal/5" : ""}`}
            href={site.locale === locale ? pathname : siteHref(site.locale, pathname)}
            hrefLang={site.locale === "zh" ? "zh-CN" : site.locale}
            key={site.locale}
            onClick={() => setOpen(false)}
          >
            <SiteIcon locale={site.locale} />
            <span>{site.label[locale]}</span>
            {site.locale === locale ? <Check aria-hidden="true" className="ml-auto" size={12} strokeWidth={1.4} /> : null}
          </a>
        ))}
      </nav>
    </div>
  );
}
