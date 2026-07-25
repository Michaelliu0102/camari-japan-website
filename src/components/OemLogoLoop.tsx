"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/locales";

const brands: Array<{ name: string; src: string; scale: number }> = [
  { name: "Toyota", src: "/uploads/logo/OEM%20Logo/toyota-logo-png_seeklogo-486469.png", scale: 1.08 },
  { name: "Honda", src: "/uploads/logo/OEM%20Logo/honda-svgrepo-com.svg", scale: 1 },
  { name: "Mazda", src: "/uploads/logo/OEM%20Logo/mazda-alt-svgrepo-com.svg", scale: 1.02 },
  { name: "Suzuki", src: "/uploads/logo/OEM%20Logo/suzuki-svgrepo-com.svg", scale: 1.04 },
  { name: "Nissan", src: "/uploads/logo/OEM%20Logo/nissan-svgrepo-com.svg", scale: 1.02 },
  { name: "Mitsubishi", src: "/uploads/logo/OEM%20Logo/mitsubishi-svgrepo-com.svg", scale: 1.02 },
  { name: "Audi", src: "/uploads/logo/OEM%20Logo/audi-svgrepo-com.svg", scale: 1.18 },
  { name: "BMW", src: "/uploads/logo/OEM%20Logo/bmw-logo.svg", scale: 0.98 },
  { name: "Michelin", src: "/uploads/logo/OEM%20Logo/michelin.svg", scale: 1.18 },
  { name: "Pirelli", src: "/uploads/logo/OEM%20Logo/pirelli-2.svg", scale: 1.18 },
  { name: "Ferrari", src: "/uploads/logo/OEM%20Logo/ferrari-svgrepo-com.svg", scale: 1.04 },
  { name: "Alfa Romeo", src: "/uploads/logo/OEM%20Logo/alfa-romeo-alt-svgrepo-com.svg", scale: 0.98 },
  { name: "Hyundai", src: "/uploads/logo/OEM%20Logo/hyundai-svgrepo-com.svg", scale: 1.04 },
  { name: "Buick", src: "/uploads/logo/OEM%20Logo/buick-svgrepo-com.svg", scale: 1.02 },
  { name: "Cadillac", src: "/uploads/logo/OEM%20Logo/cadillac-svgrepo-com.svg", scale: 1.04 },
  { name: "JEEP", src: "/uploads/logo/OEM%20Logo/jeep-alt-svgrepo-com.svg", scale: 0.92 },
  { name: "AVATAR", src: "/uploads/logo/OEM%20Logo/avatr-technology-seeklogo.svg", scale: 1.35 },
  { name: "Chery", src: "/uploads/logo/OEM%20Logo/chery-seeklogo.svg", scale: 0.82 }
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
          {locale === "en" ? (
            <>
              <h2 className="max-w-[38rem] font-serif text-[2.5rem] leading-[1.04] text-charcoal md:text-[4.25rem] lg:text-[4.75rem]">
                Brands We Have
                <br />
                Worked With
              </h2>
              <p className="max-w-[40rem] text-sm leading-7 text-muted md:text-right md:text-base md:leading-8">
                <span className="md:block">Materials and crafted solutions selected for global automotive platforms,</span>
                <span className="md:block">performance specialists, and interior programs.</span>
              </p>
            </>
          ) : (
            <>
              <div>
                <p className="label-caps text-gold">自動車パートナー</p>
                <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight text-charcoal md:text-6xl">ご一緒したOEM</h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-muted md:text-right">
                自動車ブランド、モビリティチーム、パフォーマンス分野の専門家と形づくる素材プログラム。
              </p>
            </>
          )}
        </div>
      </div>

      <div
        aria-label={locale === "en" ? "OEMs we worked with" : "ご一緒したOEM"}
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
              <img alt="" src={brand.src} style={{ transform: `scale(${brand.scale})` }} />
            </span>
          ))}
        </div>
      </div>

      <p className="sr-only">{brands.map((brand) => brand.name).join(", ")}</p>
    </section>
  );
}
