"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchOverlay } from "@/components/SearchOverlay";
import { getAlternateLocale, localizedPath, type Locale } from "@/lib/locales";

type GlobalNavProps = {
  locale: Locale;
};

type NavChild = {
  label: string;
  href: string;
  description: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

const navItems = [
  { label: "Home", href: "" },
  { label: "About", href: "/about" },
  {
    label: "Material",
    href: "/materials",
    children: [
      {
        label: "Alcantara",
        href: "/materials/alcantara",
        description: "Premium Italian surface material"
      },
      {
        label: "Leather",
        href: "/materials/leather",
        description: "Full-grain and refined hides"
      },
      {
        label: "Vegan Leather",
        href: "/materials/vegan-leather",
        description: "High-performance alternatives"
      },
      {
        label: "Fabric",
        href: "/materials/fabric",
        description: "Technical and decorative textiles"
      }
    ]
  },
  {
    label: "Product",
    href: "/oem-odm",
    children: [
      {
        label: "OEM / ODM",
        href: "/oem-odm",
        description: "Custom surface programs and development support"
      },
      {
        label: "Projects",
        href: "/projects",
        description: "Applied materials in finished environments"
      }
    ]
  },
  {
    label: "Media",
    href: "/media",
    children: [
      {
        label: "Press & Notes",
        href: "/media",
        description: "News, exhibitions, and material stories"
      },
      {
        label: "Downloads",
        href: "/downloads",
        description: "Brand and material files for project teams"
      }
    ]
  },
  { label: "Contact", href: "/contact" }
] satisfies NavItem[];

export function GlobalNav({ locale }: GlobalNavProps) {
  const alternateLocale = getAlternateLocale(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [invert, setInvert] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const rafRef = useRef(0);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    function check() {
      const invertEls = document.querySelectorAll("[data-nav-invert]");
      let shouldInvert = false;

      for (const el of invertEls) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom > 0) {
          shouldInvert = true;
          break;
        }
      }

      setInvert(shouldInvert);
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(check);
    }

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const textColor = invert ? "text-charcoal" : "text-white";
  const logoClass = invert
    ? "logo-outline-dark text-lg uppercase md:text-xl"
    : "logo-outline text-lg uppercase md:text-xl";
  const borderColor = invert ? "border-charcoal/25" : "border-white/25";
  const hoverBg = invert
    ? "hover:bg-charcoal hover:text-white"
    : "hover:bg-white hover:text-charcoal";
  const btnBg = invert ? "bg-charcoal/6" : "bg-white/8";
  const glassClass = invert ? "glass-nav-light" : "glass-nav";
  const dropdownGlassClass = "border-y border-charcoal/10 bg-white text-charcoal shadow-material";
  const dropdownMutedText = "text-muted";
  const dropdownItemHover = "hover:bg-charcoal/5";

  return (
    <>
      <header className={`${glassClass} fixed left-0 top-0 z-50 w-full`}>
      <nav className="mx-auto flex h-[var(--nav-height)] w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link
          aria-label="CAMARI JAPAN home"
          className={logoClass}
          href={localizedPath(locale)}
        >
          CAMARI
        </Link>

        <div
          className={`hidden items-center gap-10 font-label text-[10px] font-semibold uppercase tracking-[0.2em] md:flex ${textColor}`}
        >
          {navItems.map((item) =>
            item.children ? (
              <div className="group/nav-item relative flex h-[var(--nav-height)] items-center" key={item.href}>
                <Link
                  aria-haspopup="true"
                  className="nav-underline inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
                  href={localizedPath(locale, item.href)}
                  onClick={() => (document.activeElement as HTMLElement)?.blur()}
                >
                  {item.label}
                  <ChevronDown className="opacity-60 transition-transform duration-500 ease-in-out group-hover/nav-item:rotate-180 group-focus-within/nav-item:rotate-180" size={12} strokeWidth={1.3} />
                </Link>
                <div className={`pointer-events-none invisible fixed left-0 top-[var(--nav-height)] w-screen translate-y-2 opacity-0 transition-[opacity,transform,visibility] duration-500 ease-in-out group-hover/nav-item:pointer-events-auto group-hover/nav-item:visible group-hover/nav-item:translate-y-0 group-hover/nav-item:opacity-100 group-focus-within/nav-item:pointer-events-auto group-focus-within/nav-item:visible group-focus-within/nav-item:translate-y-0 group-focus-within/nav-item:opacity-100 ${dropdownGlassClass} backdrop-blur-xl`}>
                  <div className="mx-auto w-full max-w-container-max px-margin-mobile py-10 md:px-margin-desktop">
                    <div className="grid gap-x-16 gap-y-5 md:grid-cols-2">
                      {item.children.map((child) => (
                        <Link
                          className={`block py-2 transition-colors ${dropdownItemHover}`}
                          href={localizedPath(locale, child.href)}
                          key={child.href}
                          onClick={() => (document.activeElement as HTMLElement)?.blur()}
                        >
                          <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.24em]">
                            {child.label}
                          </span>
                          <span className={`mt-1 block font-sans text-[0.78rem] font-normal normal-case leading-5 tracking-normal ${dropdownMutedText}`}>
                            {child.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                className="nav-underline opacity-80 transition-opacity hover:opacity-100"
                href={localizedPath(locale, item.href)}
                key={item.href || "home"}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className={`flex items-center gap-3 ${textColor}`}>
          <button
            aria-label="Search materials"
            className={`hidden h-10 w-10 items-center justify-center border transition-colors md:flex ${borderColor} ${btnBg} ${hoverBg}`}
            onClick={() => setSearchOpen(true)}
            type="button"
          >
            <Search size={16} strokeWidth={1.4} />
          </button>
          <Link
            className={`flex border font-label text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors ${borderColor} ${btnBg} ${hoverBg}`}
            href={localizedPath(alternateLocale)}
          >
            <span className={`px-3 py-3 ${locale === "en" ? "" : "opacity-50"}`}>EN</span>
            <span className="px-1 py-3 opacity-20">/</span>
            <span className={`px-3 py-3 ${locale === "ja" ? "" : "opacity-50"}`}>JP</span>
          </Link>
          <button
            aria-expanded={mobileOpen}
            aria-label={
              mobileOpen ? "Close navigation" : "Open navigation"
            }
            className={`flex h-10 w-10 items-center justify-center border transition-colors md:hidden ${borderColor} ${btnBg} ${hoverBg}`}
            onClick={() => setMobileOpen((prev) => !prev)}
            type="button"
          >
            {mobileOpen ? (
              <X size={18} strokeWidth={1.4} />
            ) : (
              <Menu size={18} strokeWidth={1.4} />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 top-[var(--nav-height)] z-40 bg-white md:hidden">
          <nav className="flex h-full flex-col items-center justify-center gap-7">
            {navItems.map((item) => (
              <div className="text-center" key={item.href || "home"}>
                <Link
                  className="font-serif text-3xl uppercase tracking-luxury text-charcoal/85 transition-colors hover:text-charcoal"
                  href={localizedPath(locale, item.href)}
                  onClick={closeMobile}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="mt-3 grid gap-2">
                    {item.children.map((child) => (
                      <Link
                        className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-muted transition-colors hover:text-charcoal"
                        href={localizedPath(locale, child.href)}
                        key={child.href}
                        onClick={closeMobile}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <button
              className="mt-8 border border-charcoal/25 px-8 py-4 font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal transition-colors hover:bg-charcoal hover:text-white"
              onClick={() => {
                closeMobile();
                setSearchOpen(true);
              }}
              type="button"
            >
              Search Materials
            </button>
          </nav>
        </div>
      ) : null}
    </header>
    <SearchOverlay locale={locale} onClose={() => setSearchOpen(false)} open={searchOpen} />
  </>
  );
}
