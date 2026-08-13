"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchOverlay } from "@/components/SearchOverlay";
import { absoluteLocalizedUrl, getAlternateLocale, localizedPath, type Locale } from "@/lib/locales";
import { siteConfig } from "@/lib/site-config";

type GlobalNavProps = {
  locale: Locale;
};

type NavChild = {
  label: Record<Locale, string>;
  href: string;
  description?: Record<Locale, string>;
  hideQuickLinksFor?: Locale[];
  quickLinks?: {
    label: Record<Locale, string>;
    href: string;
  }[];
};

type NavItem = {
  label: Record<Locale, string>;
  href: string;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { label: { en: "Home", ja: "ホーム" }, href: "" },
  { label: { en: "About", ja: "会社情報" }, href: "/about" },
  {
    label: { en: "Material", ja: "素材" },
    href: "/materials",
    children: [
      {
        label: { en: "Alcantara", ja: "アルカンターラ" },
        href: "/materials/alcantara",
        description: { en: "Premium Italian Surface Material", ja: "イタリア発の上質なサーフェス素材" },
        quickLinks: [
          {
            label: { en: "AUTO", ja: "自動車" },
            href: "/materials/alcantara/alcantara-panel/alc-p-1041"
          },
          {
            label: { en: "INTERIOR", ja: "インテリア" },
            href: "/materials/alcantara/alcantara-master/alc-m-1001"
          },
          {
            label: { en: "OUTDOOR", ja: "アウトドア" },
            href: "/materials/alcantara/alcantara-exo/alc-exo-1145"
          },
          {
            label: { en: "TECH", ja: "テック" },
            href: "/materials/alcantara/alcantara-04/alc-04-1001"
          }
        ]
      },
      {
        label: { en: "Leather", ja: "レザー" },
        href: "/materials/leather",
        description: { en: "Top selection Italian leather", ja: "イタリアで一貫生産された上質な本革" },
        hideQuickLinksFor: ["ja"],
        quickLinks: [
          {
            label: { en: "AUTOMOTIVE", ja: "自動車" },
            href: "/materials/leather/automotive-nappa/n-9762-imperial-blue"
          },
          {
            label: { en: "INTERIOR", ja: "インテリア" },
            href: "/materials/leather/interior"
          }
        ]
      },
      {
        label: { en: "Vegan Leather", ja: "マイクロファイバーレザー" },
        href: "/materials/vegan-leather",
        description: { en: "High-performance alternatives", ja: "高機能な代替レザー素材" }
      },
      {
        label: { en: "Fabric", ja: "ファブリック" },
        href: "/materials/fabric",
        description: { en: "Technical and decorative textiles", ja: "意匠性と機能性を備えたテキスタイル" }
      }
    ]
  },
  {
    label: { en: "Product", ja: "製品" },
    href: "/products",
    children: [
      {
        label: { en: "Automotive Interior Accessories", ja: "自動車内装アクセサリー" },
        href: "/products/automotive-interior-accessories"
      },
      {
        label: { en: "Tech Accessories", ja: "テックアクセサリー" },
        href: "/products/tech-accessories"
      },
      {
        label: { en: "Lifestyle", ja: "ライフスタイル" },
        href: "/products/lifestyle"
      },
      {
        label: { en: "Corporate Gifts", ja: "法人ギフト" },
        href: "/products/corporation-gift"
      }
    ]
  },
  {
    label: { en: "Media", ja: "メディア" },
    href: "/media",
    children: [
      {
        label: { en: "Press & Notes", ja: "ニュース・ノート" },
        href: "/media",
        description: { en: "News, exhibitions, and material stories", ja: "ニュース、展示会、素材にまつわるストーリー" }
      },
      {
        label: { en: "Downloads", ja: "ダウンロード" },
        href: "/downloads",
        description: { en: "Brand and material files for project teams", ja: "プロジェクトチーム向けのブランド・素材資料" }
      }
    ]
  },
  { label: { en: "Contact", ja: "お問い合わせ" }, href: "/contact" }
];

function getLanguageSwitchHref(locale: Locale, pathname: string): string {
  const alternateLocale = getAlternateLocale(locale);

  if (siteConfig.enableLocalePreview) {
    return localizedPath(alternateLocale, pathname);
  }

  return absoluteLocalizedUrl(alternateLocale, pathname);
}

export function GlobalNav({ locale }: GlobalNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [invert, setInvert] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedQuickLinks, setExpandedQuickLinks] = useState<Record<string, boolean>>({});
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
  const borderColor = invert ? "border-charcoal/25" : "border-white/25";
  const hoverBg = invert
    ? "hover:bg-charcoal hover:text-white"
    : "hover:bg-white hover:text-charcoal";
  const btnBg = invert ? "bg-charcoal/6" : "bg-white/8";
  const glassClass = invert ? "glass-nav-light" : "glass-nav";
  const dropdownGlassClass = "border-y border-charcoal/10 bg-white text-charcoal shadow-material";
  const dropdownMutedText = "text-muted";
  const dropdownItemHover = "hover:bg-charcoal/5";
  const languageSwitchHref = getLanguageSwitchHref(locale, pathname);
  const logoSrc = invert ? "/uploads/logo/black-int.png" : "/uploads/logo/white-int.png";

  return (
    <>
      <header className={`${glassClass} fixed left-0 top-0 z-50 w-full`}>
      <nav className="mx-auto flex h-[var(--nav-height)] w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link
          aria-label={`${siteConfig.siteName} home`}
          className="inline-flex items-center"
          href={localizedPath(locale)}
        >
          <Image
            alt="CAMARI"
            className="h-auto w-[10.5rem] md:w-[12rem]"
            height={1780}
            sizes="(min-width: 768px) 192px, 168px"
            src={logoSrc}
            width={4994}
          />
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
                  {item.label[locale]}
                  <ChevronDown className="opacity-60 transition-transform duration-500 ease-in-out group-hover/nav-item:rotate-180 group-focus-within/nav-item:rotate-180" size={12} strokeWidth={1.3} />
                </Link>
                <div className={`pointer-events-none invisible fixed left-0 top-[var(--nav-height)] w-screen translate-y-2 opacity-0 transition-[opacity,transform,visibility] duration-500 ease-in-out group-hover/nav-item:pointer-events-auto group-hover/nav-item:visible group-hover/nav-item:translate-y-0 group-hover/nav-item:opacity-100 group-focus-within/nav-item:pointer-events-auto group-focus-within/nav-item:visible group-focus-within/nav-item:translate-y-0 group-focus-within/nav-item:opacity-100 ${dropdownGlassClass} backdrop-blur-xl`}>
                  <div className="mx-auto w-full max-w-container-max px-margin-mobile py-10 md:px-margin-desktop">
                    <div className="grid gap-x-16 gap-y-5 md:grid-cols-2">
                      {item.children.map((child) => (
                        <div
                          className={`py-2 transition-colors ${dropdownItemHover}`}
                          key={child.href}
                        >
                          <div className="flex items-center gap-2">
                            <Link
                              className="block"
                              href={localizedPath(locale, child.href)}
                              onClick={() => (document.activeElement as HTMLElement)?.blur()}
                            >
                              <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.24em]">
                                {child.label[locale]}
                              </span>
                            </Link>
                            {child.quickLinks && !child.hideQuickLinksFor?.includes(locale) ? (
                              <button
                                aria-expanded={Boolean(expandedQuickLinks[child.href])}
                                aria-label={`${child.label[locale]} ${locale === "en" ? "quick links" : "クイックリンク"}`}
                                className="inline-flex h-5 w-5 items-center justify-center text-charcoal/45 transition-colors hover:text-charcoal"
                                onClick={() => setExpandedQuickLinks((current) => ({
                                  ...current,
                                  [child.href]: !current[child.href]
                                }))}
                                type="button"
                              >
                                <ChevronDown
                                  className={`transition-transform duration-300 ease-expo ${expandedQuickLinks[child.href] ? "rotate-180" : ""}`}
                                  size={12}
                                  strokeWidth={1.4}
                                />
                              </button>
                            ) : null}
                          </div>
                          {child.description?.[locale] && !expandedQuickLinks[child.href] ? (
                            <span className={`mt-1 block font-sans text-[0.78rem] font-normal normal-case leading-5 tracking-normal ${dropdownMutedText}`}>
                              {child.description[locale]}
                            </span>
                          ) : null}
                          {child.quickLinks && !child.hideQuickLinksFor?.includes(locale) ? (
                            <div className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-expo ${expandedQuickLinks[child.href] ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}>
                              <div className="flex min-h-0 flex-wrap items-center gap-x-2.5 gap-y-2 font-label text-[8px] font-semibold uppercase tracking-[0.18em] text-charcoal/45">
                              {child.quickLinks.map((quickLink, index) => (
                                <span className="inline-flex items-center gap-2.5" key={quickLink.href}>
                                  {index > 0 ? <span aria-hidden="true" className="text-charcoal/20">·</span> : null}
                                  <Link
                                    className="transition-colors hover:text-charcoal focus-visible:text-charcoal"
                                    href={localizedPath(locale, quickLink.href)}
                                    onClick={() => (document.activeElement as HTMLElement)?.blur()}
                                  >
                                    {quickLink.label[locale]}
                                  </Link>
                                </span>
                              ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
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
                {item.label[locale]}
              </Link>
            )
          )}
        </div>

        <div className={`flex items-center gap-3 ${textColor}`}>
          <button
            aria-label={locale === "en" ? "Search materials" : "素材を検索"}
            className={`hidden h-10 w-10 items-center justify-center border transition-colors md:flex ${borderColor} ${btnBg} ${hoverBg}`}
            onClick={() => setSearchOpen(true)}
            type="button"
          >
            <Search size={16} strokeWidth={1.4} />
          </button>
          <Link
            className={`flex border font-label text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors ${borderColor} ${btnBg} ${hoverBg}`}
            href={languageSwitchHref}
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
                  {item.label[locale]}
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
                        {child.label[locale]}
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
              {locale === "en" ? "Search Materials" : "素材を検索"}
            </button>
          </nav>
        </div>
      ) : null}
    </header>
    <SearchOverlay locale={locale} onClose={() => setSearchOpen(false)} open={searchOpen} />
  </>
  );
}
