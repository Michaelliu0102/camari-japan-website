"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Download, FileText, SprayCan } from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Sku } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type SkuZoomStyle = CSSProperties & {
  "--sku-zoom-x": string;
  "--sku-zoom-y": string;
};

type SkuSwatchesProps = {
  locale: Locale;
  materialName: string;
  materialSlug: string;
  productTypeName: string;
  productTypeSlug: string;
  productTypeCode?: string;
  productTypeSummary: string;
  skus: Sku[];
  initialSku: Sku;
  compact?: boolean;
};

const productInfoLinks = [
  { href: "#specifications", label: "Specifications", Icon: FileText },
  { href: "#certifications", label: "Certifications", Icon: Award },
  { href: "#maintenance-and-clean", label: "Maintenance and clean", Icon: SprayCan },
  { href: "#downloads", label: "Downloads", Icon: Download }
];

export function SkuSwatches({ locale, materialName, materialSlug, productTypeName, productTypeSlug, productTypeCode, productTypeSummary, skus, initialSku, compact = false }: SkuSwatchesProps) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(initialSku.slug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const selected = useMemo(() => skus.find((sku) => sku.slug === selectedSlug) ?? initialSku, [initialSku, selectedSlug, skus]);
  const hasVisualSwatches = useMemo(() => skus.some((s) => s.hex || s.swatchImage || s.image), [skus]);
  const galleryImages = useMemo(
    () => [
      {
        image: selected.image,
        thumbnail: selected.swatchImage ?? selected.image,
        alt: `${materialName}${selected.colorName?.[locale] ? ` — ${selected.colorName[locale]}` : ""}`
      },
      ...(selected.caseGallery ?? []).map((item) => ({
        image: item.image,
        thumbnail: item.image,
        alt: item.alt[locale] || item.alt.en || `${materialName} case image`
      }))
    ],
    [locale, materialName, selected]
  );
  const activeImage = galleryImages[activeImageIndex] ?? galleryImages[0];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedSlug]);

  function handleSwatchClick(skuSlug: string) {
    setSelectedSlug(skuSlug);
    router.replace(localizedPath(locale, `/materials/${materialSlug}/${productTypeSlug}/${skuSlug}`), { scroll: false });
  }

  function handleImagePointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    event.currentTarget.style.setProperty("--sku-zoom-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--sku-zoom-y", `${y.toFixed(2)}%`);
  }

  function handleImagePointerLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--sku-zoom-x", "50%");
    event.currentTarget.style.setProperty("--sku-zoom-y", "50%");
  }

  return (
    <section className={`bg-paper ${compact ? "" : "pt-[calc(var(--nav-height)+2rem)] md:pt-[calc(var(--nav-height)+4rem)]"}`} data-nav-invert>
      {/* Desktop: 3-column — thumbnails | main image | product details */}
      <div className="section-shell flex flex-col gap-8 md:flex-row md:items-start md:gap-0">
        {/* Col 1+2: Images area (thumbnails + main image) — matches Dedar's productView-images flex row */}
        <div className="mx-auto flex w-full scroll-mt-[calc(var(--nav-height)+2rem)] flex-row gap-[26px] md:mx-0 md:ml-[5%] md:max-w-[690px]" id="inspiration">
          {/* Thumbnail strip — vertical, ~90px wide, matches Dedar's productView-thumbnails */}
          <div className="hidden w-[90px] shrink-0 flex-col gap-[26px] md:flex">
            {galleryImages.map((item, index) => {
              const active = index === activeImageIndex;
              return (
                <button
                  aria-label={item.alt}
                  aria-pressed={active}
                  className={`relative w-full overflow-hidden transition-all ${
                    active
                      ? "outline outline-1 outline-offset-[3px] outline-charcoal"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  key={`${item.image}-${index}`}
                  onClick={() => setActiveImageIndex(index)}
                  style={{ aspectRatio: "5/6" }}
                  type="button"
                >
                  <Image alt={item.alt} className="object-cover" fill sizes="90px" src={item.thumbnail} />
                </button>
              );
            })}
          </div>

          {/* Main product image — matches Dedar's productView-img-container */}
          <div className="flex-1">
            <div
              className="group/sku-image relative w-full cursor-zoom-in overflow-hidden bg-[#f3f3f2] md:min-h-[366px]"
              onPointerLeave={handleImagePointerLeave}
              onPointerMove={handleImagePointerMove}
              style={{ aspectRatio: "100/118.3", "--sku-zoom-x": "50%", "--sku-zoom-y": "50%" } as SkuZoomStyle}
            >
              <div className="absolute inset-[9%_20%]">
                <Image
                  alt={activeImage.alt}
                  className="origin-[var(--sku-zoom-x)_var(--sku-zoom-y)] object-contain transition-transform duration-700 ease-expo will-change-transform md:group-hover/sku-image:scale-[2.15]"
                  fill
                  priority
                  sizes="(min-width: 768px) calc((min(690px, 55vw) - 116px) * 0.6), 60vw"
                  src={activeImage.image}
                />
              </div>
              {/* Mobile thumbnail strip — bottom overlay */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 md:hidden">
                {galleryImages.map((item, index) => {
                  const active = index === activeImageIndex;
                  return (
                    <button
                      aria-label={item.alt}
                      aria-pressed={active}
                      className={`relative shrink-0 overflow-hidden transition-all ${
                        active ? "h-12 w-12 outline outline-1 outline-offset-2 outline-white" : "h-10 w-10 opacity-70"
                      }`}
                      key={`${item.image}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      type="button"
                    >
                      <Image alt={item.alt} className="object-cover" fill sizes="48px" src={item.thumbnail} />
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-5 text-center font-sans text-[12px] leading-[19px] md:mt-6">
              <span className="font-semibold text-charcoal">Color Code: </span>
              <span className="text-charcoal/70">{selected.code}</span>
            </p>
          </div>
        </div>

        {/* Col 3: Product details — matches Dedar's productView-details */}
        <div className="flex flex-col md:pl-[5%] md:pt-0 lg:pl-[10%]">
          <div className="md:max-w-[20rem] lg:max-w-[24rem]">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-x-2 font-sans text-[10px] uppercase tracking-[0.12em] text-muted">
                <li>
                  <Link className="transition-colors hover:text-charcoal" href={localizedPath(locale, "/")}>
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li>
                  <Link className="transition-colors hover:text-charcoal" href={localizedPath(locale, "/materials")}>
                    Material
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li>
                  <Link className="transition-colors hover:text-charcoal" href={localizedPath(locale, `/materials/${materialSlug}`)}>
                    {materialName}
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li className="text-charcoal/70" aria-current="page">
                  {productTypeName}
                </li>
              </ol>
            </nav>

            {/* Product title — Dedar's productView-title */}
            <h1 className="font-serif text-2xl leading-tight md:text-[2rem] md:leading-[1.2]">
              {productTypeName}
            </h1>
            {productTypeCode ? (
              <p className="mt-1 font-sans text-[11px] text-muted">
                Product code: {productTypeCode}
              </p>
            ) : null}

            {/* Payoff / description — Dedar's productView-payoff */}
            <p className="mt-4 font-sans text-[0.875rem] leading-relaxed text-muted md:mt-5">
              {productTypeSummary}
            </p>

            {productTypeSlug === "alcantara-panel" ? (
              <p className="mt-6 font-sans text-[0.85rem] leading-relaxed text-muted">
                For seats, please see{" "}
                <Link
                  className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                  href={localizedPath(locale, `/materials/${materialSlug}/alcantara-cover/alc-c-1108`)}
                >
                  ALCANTARA COVER
                </Link>
                .
              </p>
            ) : productTypeSlug === "alcantara-cover" ? (
              <p className="mt-6 font-sans text-[0.85rem] leading-relaxed text-muted">
                For door panel, dashboard and other upholstery, please see{" "}
                <Link
                  className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                  href={localizedPath(locale, `/materials/${materialSlug}/alcantara-panel/alc-p-1108`)}
                >
                  ALCANTARA PANNEL
                </Link>
                .
              </p>
            ) : productTypeSlug === "alcantara-master" ? (
              <div className="mt-6 space-y-2 font-sans text-[0.85rem] leading-relaxed text-muted">
                <p>
                  For upholstery sofa, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-multilayer/alc-ml-1001`)}
                  >
                    Multilayer
                  </Link>.
                </p>
                <p>
                  For upholstery aviation, contract, marine, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-avant/alc-av-1001`)}
                  >
                    Avant
                  </Link>.
                </p>
                <p>
                  For marine wall covering, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-board-fr/alc-bf-1001`)}
                  >
                    Board FR
                  </Link>.
                </p>
              </div>
            ) : productTypeSlug === "alcantara-multilayer" ? (
              <div className="mt-6 space-y-2 font-sans text-[0.85rem] leading-relaxed text-muted">
                <p>
                  For interior decoration, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-master/alc-m-1001`)}
                  >
                    Master
                  </Link>.
                </p>
                <p>
                  For upholstery aviation, contract, marine, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-avant/alc-av-1001`)}
                  >
                    Avant
                  </Link>.
                </p>
                <p>
                  For marine wall covering, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-board-fr/alc-bf-1001`)}
                  >
                    Board FR
                  </Link>.
                </p>
              </div>
            ) : productTypeSlug === "alcantara-avant" ? (
              <div className="mt-6 space-y-2 font-sans text-[0.85rem] leading-relaxed text-muted">
                <p>
                  For interior decoration, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-master/alc-m-1001`)}
                  >
                    Master
                  </Link>.
                </p>
                <p>
                  For upholstery sofa, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-multilayer/alc-ml-1001`)}
                  >
                    Multilayer
                  </Link>.
                </p>
                <p>
                  For marine wall covering, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-board-fr/alc-bf-1001`)}
                  >
                    Board FR
                  </Link>.
                </p>
              </div>
            ) : productTypeSlug === "alcantara-board-fr" ? (
              <div className="mt-6 space-y-2 font-sans text-[0.85rem] leading-relaxed text-muted">
                <p>
                  For interior decoration, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-master/alc-m-1001`)}
                  >
                    Master
                  </Link>.
                </p>
                <p>
                  For upholstery sofa, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-multilayer/alc-ml-1001`)}
                  >
                    Multilayer
                  </Link>.
                </p>
                <p>
                  For upholstery aviation, contract, marine, please see Alcantara{" "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-avant/alc-av-1001`)}
                  >
                    Avant
                  </Link>.
                </p>
              </div>
            ) : null}

            {/* Color selector — Dedar's swatch grid */}
            {hasVisualSwatches ? (
              <div className="mt-10 scroll-mt-[calc(var(--nav-height)+2rem)] md:mt-12" id="you-may-also-like">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/80">
                    {selected.colorName?.[locale] ? `Colour — ${selected.colorName[locale]}` : `Colour`}
                  </span>
                  <span className="font-sans text-[10px] tracking-[0.12em] text-charcoal/60">{skus.length} options</span>
                </div>
                    <div className="flex flex-wrap gap-[10px]">
                      {skus.map((sku) => {
                        const active = sku.slug === selected.slug;
                        const swatchStyle = sku.hex
                          ? { backgroundColor: sku.hex }
                          : sku.swatchImage ?? sku.image
                            ? {
                                backgroundImage: `url(${sku.swatchImage ?? sku.image})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover"
                              }
                            : undefined;

                        return (
                          <button
                            aria-label={sku.colorName?.[locale] ? `${sku.colorName[locale]} — ${sku.code}` : sku.code}
                            aria-pressed={active}
                            className={`h-9 w-9 shrink-0 border border-charcoal/15 bg-[#f3f3f2] transition-all ${
                              active
                                ? "outline outline-1 outline-offset-[3px] outline-charcoal"
                                : "hover:scale-110"
                            }`}
                            key={sku.slug}
                            onClick={() => handleSwatchClick(sku.slug)}
                            style={swatchStyle}
                            title={sku.colorName?.[locale] ? `${sku.code} ${sku.colorName[locale]}` : sku.code}
                            type="button"
                          />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Action buttons — Dedar's CTA area */}
            <div className="mt-8 space-y-3 md:mt-10">
              <Link
                className="inline-flex w-full justify-center bg-charcoal px-10 py-4 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal/85 md:w-auto md:min-w-[15rem]"
                href={localizedPath(locale, "/contact")}
              >
                Contact Sales
              </Link>
              <p className="font-sans text-[10px] leading-relaxed text-muted">Sample request workflow is reserved for a later release.</p>
            </div>
          </div>
        </div>
      </div>

      <nav
        aria-label="Product information sections"
        className="mt-8 border-y border-charcoal/20 bg-paper md:mt-12"
        data-nav-invert
        id="product-info-nav"
      >
        <div className="section-shell flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-5 md:gap-x-12 md:py-6">
          {productInfoLinks.map(({ href, label, Icon }) => (
            <Link
              className="group inline-flex items-center gap-3 font-sans text-[0.82rem] text-charcoal underline decoration-charcoal/70 underline-offset-4 transition-colors hover:text-muted hover:decoration-muted"
              href={href}
              key={href}
            >
              <Icon aria-hidden="true" className="h-5 w-5 stroke-[1.25] transition-transform duration-300 ease-expo group-hover:-translate-y-0.5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
}
