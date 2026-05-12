"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Sku } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type SkuSwatchesProps = {
  locale: Locale;
  materialName: string;
  materialSlug: string;
  skus: Sku[];
  initialSku: Sku;
  compact?: boolean;
};

export function SkuSwatches({ locale, materialName, materialSlug, skus, initialSku, compact = false }: SkuSwatchesProps) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(initialSku.slug);
  const selected = useMemo(() => skus.find((sku) => sku.slug === selectedSlug) ?? initialSku, [initialSku, selectedSlug, skus]);

  function handleSwatchClick(skuSlug: string) {
    setSelectedSlug(skuSlug);
    router.replace(localizedPath(locale, `/materials/${materialSlug}/${skuSlug}`), { scroll: false });
  }

  return (
    <section className={`bg-paper ${compact ? "" : "pt-[var(--nav-height)]"}`}>
      <div className="section-shell grid min-h-screen gap-12 py-12 md:grid-cols-2 md:gap-gutter md:py-24">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone">
          <Image alt={`${materialName} ${selected.colorName[locale]}`} className="object-cover transition-opacity duration-500" fill priority sizes="(min-width: 768px) 50vw, 100vw" src={selected.image} />
        </div>
        <div className="flex flex-col justify-between bg-paper py-2">
          <div>
            <p className="label-caps mb-5 text-gold">Premium Collection</p>
            <h1 className="font-serif text-4xl uppercase tracking-luxury md:text-5xl">{materialName} Panel</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted">{selected.summary[locale]}</p>
            <div className="mt-12">
              <p className="label-caps mb-6 text-charcoal">Color: {selected.code} {selected.colorName[locale]}</p>
              <div className="flex flex-wrap gap-4">
                {skus.map((sku) => {
                  const active = sku.slug === selected.slug;

                  return (
                    <button
                      aria-label={`Select ${sku.colorName[locale]}`}
                      aria-pressed={active}
                      className={active ? "h-11 w-11 border border-charcoal p-1 outline outline-1 outline-offset-4 outline-charcoal" : "h-11 w-11 border border-charcoal/10 transition-all hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-muted"}
                      key={sku.slug}
                      onClick={() => handleSwatchClick(sku.slug)}
                      style={{ backgroundColor: sku.hex }}
                      title={sku.colorName[locale]}
                      type="button"
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-14 space-y-5">
            <Link className="label-caps inline-flex w-full justify-center bg-charcoal px-12 py-5 text-white transition-colors hover:bg-muted md:w-auto" href={localizedPath(locale, "/contact")}>
              Contact Sales
            </Link>
            <p className="label-caps text-[10px] text-muted">Sample request workflow is reserved for a later release.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
