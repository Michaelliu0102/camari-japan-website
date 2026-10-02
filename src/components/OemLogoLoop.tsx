"use client";

import { chinaMediaUrl } from "@/lib/china-media";
import { useEffect, useState, type CSSProperties } from "react";
import type { Locale } from "@/lib/locales";

// Optical widths balance emblems and wordmarks after trimming the SVG viewBoxes.
const brands: Array<{ name: string; src: string; width: number }> = [
  { name: "Toyota", src: "/uploads/logo/OEM%20Logo/toyota-logo-png_seeklogo-486469.png", width: 96 },
  { name: "Honda", src: "/uploads/logo/OEM%20Logo/honda-svgrepo-com.svg", width: 78 },
  { name: "Mazda", src: "/uploads/logo/OEM%20Logo/mazda-alt-svgrepo-com.svg", width: 82 },
  { name: "Suzuki", src: "/uploads/logo/OEM%20Logo/suzuki-svgrepo-com.svg", width: 62 },
  { name: "Nissan", src: "/uploads/logo/OEM%20Logo/nissan-svgrepo-com.svg", width: 88 },
  { name: "Mitsubishi", src: "/uploads/logo/OEM%20Logo/mitsubishi-svgrepo-com.svg", width: 78 },
  { name: "Audi", src: "/uploads/logo/OEM%20Logo/audi-svgrepo-com.svg", width: 136 },
  { name: "BMW", src: "/uploads/logo/OEM%20Logo/bmw-logo.svg", width: 66 },
  { name: "Michelin", src: "/uploads/logo/OEM%20Logo/michelin.svg", width: 160 },
  { name: "Pirelli", src: "/uploads/logo/OEM%20Logo/pirelli-2.svg", width: 144 },
  { name: "Ferrari", src: "/uploads/logo/OEM%20Logo/ferrari-svgrepo-com.svg", width: 54 },
  { name: "Alfa Romeo", src: "/uploads/logo/OEM%20Logo/alfa-romeo-alt-svgrepo-com.svg", width: 70 },
  { name: "Hyundai", src: "/uploads/logo/OEM%20Logo/hyundai-svgrepo-com.svg", width: 110 },
  { name: "Buick", src: "/uploads/logo/OEM%20Logo/buick-svgrepo-com.svg", width: 68 },
  { name: "Cadillac", src: "/uploads/logo/OEM%20Logo/cadillac-svgrepo-com.svg", width: 74 },
  { name: "Jeep", src: "/uploads/logo/OEM%20Logo/jeep-alt-svgrepo-com.svg", width: 110 },
  { name: "AVATR", src: "/uploads/logo/OEM%20Logo/avatr-technology-seeklogo.svg", width: 84 },
  { name: "Chery", src: "/uploads/logo/OEM%20Logo/chery-seeklogo.svg", width: 130 }
];

type OemLogoLoopProps = {
  locale: Locale;
};

export function OemLogoLoop({ locale }: OemLogoLoopProps) {
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(media.matches);

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);

    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  const isPaused = prefersReducedMotion || isHoveredOrFocused;

  return (
    <section className="overflow-hidden border-t border-charcoal/10 bg-linen py-20 md:py-28" data-nav-invert>
      <div className="section-shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          {locale !== "ja" ? (
            <>
              <h2 className="max-w-[38rem] font-serif text-[2.5rem] leading-[1.04] text-charcoal md:text-[4.25rem] lg:text-[4.75rem]">
                {locale === "zh" ? "我们服务过的" : "Brands We Have"}
                <br />
                {locale === "zh" ? "合作品牌" : "Worked With"}
              </h2>
              <p className="max-w-[40rem] text-sm leading-7 text-muted md:text-right md:text-base md:leading-8">
                <span className="md:block">{locale === "zh" ? "为全球汽车平台、性能领域专业团队及内饰项目" : "Materials and crafted solutions selected for global automotive platforms,"}</span>
                <span className="md:block">{locale === "zh" ? "提供精选材料与精工定制解决方案。" : "performance specialists, and interior programs."}</span>
              </p>
            </>
          ) : (
            <>
              <div>
                <h2 className="max-w-2xl font-serif text-4xl leading-tight text-charcoal md:text-6xl">ご一緒したOEM</h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-muted md:text-right">
                自動車ブランド、モビリティチーム、パフォーマンス分野の専門家と形づくる素材プログラム。
              </p>
            </>
          )}
        </div>
      </div>

      <div
        aria-label={locale === "zh" ? "我们服务过的汽车品牌" : locale === "en" ? "OEMs we worked with" : "ご一緒したOEM"}
        className="oem-logo-loop mt-16 border-y border-charcoal/10 py-8 md:mt-24 md:py-10"
        onBlur={() => setIsHoveredOrFocused(false)}
        onFocus={() => setIsHoveredOrFocused(true)}
        onMouseEnter={() => setIsHoveredOrFocused(true)}
        onMouseLeave={() => setIsHoveredOrFocused(false)}
        role="region"
        tabIndex={0}
      >
        <div
          aria-hidden="true"
          className="oem-logo-loop-track"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {[...brands, ...brands].map((brand, index) => (
            <span className="oem-logo-loop-item" key={`${brand.name}-${index}`}>
              <img
                alt=""
                src={chinaMediaUrl(brand.src, 320)}
                draggable={false}
                style={{ "--logo-width": `${brand.width / 16}rem` } as CSSProperties}
              />
            </span>
          ))}
        </div>
      </div>

      <p className="sr-only">{brands.map((brand) => brand.name).join(", ")}</p>
    </section>
  );
}
