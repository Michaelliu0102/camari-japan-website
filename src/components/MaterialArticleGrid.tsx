"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductType, Sku } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type MaterialArticleGridProps = {
  locale: Locale;
  materialSlug: string;
  productTypes: ProductType[];
  skus: Sku[];
};

export function MaterialArticleGrid({ locale, materialSlug, productTypes, skus }: MaterialArticleGridProps) {
  const [previewBySlug, setPreviewBySlug] = useState<Record<string, string | undefined>>({});
  const skuGroups = new Map<string, Sku[]>();

  for (const sku of skus) {
    const group = skuGroups.get(sku.productTypeSlug) ?? [];
    group.push(sku);
    skuGroups.set(sku.productTypeSlug, group);
  }

  return (
    <section className="bg-paper py-20 md:py-28" data-nav-invert>
      <div className="section-shell">
        <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="label-caps text-gold">Fabric Article</p>
            <h2 className="mt-5 font-serif text-4xl uppercase tracking-luxury md:text-5xl">Pattern Library</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted md:col-span-5 md:justify-self-end md:text-right">
            Restored automotive textiles arranged by marque, weave, and period reference.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {productTypes.map((productType) => {
            const productSkus = skuGroups.get(productType.slug) ?? [];
            const firstSku = productSkus[0];
            const image = productType.seo.image || firstSku?.image;
            const previewImage = previewBySlug[productType.slug] ?? image;
            const href = firstSku ? `/materials/${materialSlug}/${productType.slug}/${firstSku.slug}` : `/materials/${materialSlug}`;
            const previewSkus = productSkus.slice(0, 5);

            return (
              <article className="group block" key={productType.slug}>
                <div
                  className="relative aspect-square overflow-hidden bg-stone shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-material"
                  onMouseLeave={() => setPreviewBySlug((current) => ({ ...current, [productType.slug]: undefined }))}
                >
                  {previewImage ? (
                    <Image
                      alt={productType.name[locale]}
                      className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      src={previewImage}
                    />
                  ) : null}
                  <Link
                    aria-label={productType.name[locale]}
                    className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
                    href={localizedPath(locale, href)}
                  />

                  {previewSkus.length > 1 ? (
                    <div className="absolute left-4 top-4 z-20 flex max-h-[calc(100%-2rem)] w-16 flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                      {previewSkus.map((sku) => (
                        (() => {
                          const cardPreviewImage = sku.previewImage ?? sku.swatchImage ?? sku.image;

                          return (
                            <button
                              aria-label={sku.code ? `Preview ${sku.code}` : "Preview fabric colour"}
                              className="relative aspect-square overflow-hidden border border-white/85 bg-stone shadow-sm transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                              key={sku.slug}
                              onFocus={() => setPreviewBySlug((current) => ({ ...current, [productType.slug]: cardPreviewImage }))}
                              onMouseEnter={() => setPreviewBySlug((current) => ({ ...current, [productType.slug]: cardPreviewImage }))}
                              type="button"
                            >
                              <Image alt="" className="object-cover" fill sizes="64px" src={cardPreviewImage} />
                            </button>
                          );
                        })()
                      ))}
                      {productSkus.length > previewSkus.length ? (
                        <span className="label-caps flex min-h-8 items-center justify-center bg-charcoal/70 text-[8px] tracking-[0.18em] text-white">
                          +{productSkus.length - previewSkus.length}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="pt-7 text-center">
                  <Link className="label-caps text-charcoal transition-colors hover:text-gold" href={localizedPath(locale, href)}>
                    {productType.name[locale].toUpperCase()}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
