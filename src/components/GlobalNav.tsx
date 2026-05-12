"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAlternateLocale, localizedPath, type Locale } from "@/lib/locales";

type GlobalNavProps = {
  locale: Locale;
};

const navItems = [
  { label: "Home", href: "" },
  { label: "About", href: "/about" },
  { label: "Material", href: "/materials" },
  { label: "Product", href: "/oem-odm" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" }
];

export function GlobalNav({ locale }: GlobalNavProps) {
  const alternateLocale = getAlternateLocale(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [invert, setInvert] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const el = document.documentElement;

    function sync() {
      setInvert(el.dataset.navInvert === "true");
    }

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(el, { attributes: true, attributeFilter: ["data-nav-invert"] });
    return () => observer.disconnect();
  }, []);

  const textColor = invert ? "text-charcoal" : "text-white";
  const logoClass = invert
    ? "logo-outline-dark text-lg uppercase md:text-xl"
    : "logo-outline text-lg uppercase md:text-xl";
  const borderColor = invert ? "border-charcoal/25" : "border-white/25";
  const hoverBg = invert ? "hover:bg-charcoal hover:text-white" : "hover:bg-white hover:text-charcoal";

  return (
    <header className="glass-nav fixed left-0 top-0 z-50 w-full">
      <nav className="mx-auto flex h-[var(--nav-height)] w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link aria-label="CAMARI JAPAN home" className={logoClass} href={localizedPath(locale)}>
          CAMARI
        </Link>

        <div className={`hidden items-center gap-10 font-label text-[10px] font-semibold uppercase tracking-[0.2em] md:flex ${textColor}`}>
          {navItems.map((item) => (
            <Link className="nav-underline opacity-80 transition-opacity hover:opacity-100" href={localizedPath(locale, item.href)} key={item.href || "home"}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={`flex items-center gap-3 ${textColor}`}>
          <Link
            aria-label="Search materials"
            className={`hidden h-10 w-10 items-center justify-center border transition-colors md:flex ${borderColor} ${hoverBg}`}
            href={localizedPath(locale, "/materials")}
          >
            <Search size={16} strokeWidth={1.4} />
          </Link>
          <Link
            className={`border px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors ${borderColor} ${hoverBg}`}
            href={localizedPath(alternateLocale)}
          >
            JP / EN
          </Link>
          <button
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className={`flex h-10 w-10 items-center justify-center border md:hidden ${borderColor}`}
            onClick={() => setMobileOpen((prev) => !prev)}
            type="button"
          >
            {mobileOpen ? <X size={18} strokeWidth={1.4} /> : <Menu size={18} strokeWidth={1.4} />}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 top-[var(--nav-height)] z-40 bg-charcoal/95 backdrop-blur-xl md:hidden">
          <nav className="flex h-full flex-col items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link
                className="font-serif text-3xl uppercase tracking-luxury text-white/85 transition-colors hover:text-white"
                href={localizedPath(locale, item.href)}
                key={item.href || "home"}
                onClick={closeMobile}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="mt-8 border border-white/30 px-8 py-4 font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white hover:text-charcoal"
              href={localizedPath(locale, "/materials")}
              onClick={closeMobile}
            >
              Search Materials
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
