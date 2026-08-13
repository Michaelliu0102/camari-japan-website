"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Download, FileText, SprayCan } from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { CTAMessageDrawer } from "@/components/CTAMessageDrawer";
import type { Sku } from "@/lib/content";
import { toSanityThumbnailUrl } from "@/lib/image-urls";
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
  { href: "#specifications", label: { en: "Specifications", ja: "仕様" }, Icon: FileText },
  { href: "#certifications", label: { en: "Certifications", ja: "認証" }, Icon: Award },
  { href: "#maintenance-and-clean", label: { en: "Maintenance and clean", ja: "メンテナンス・お手入れ" }, Icon: SprayCan },
  { href: "#downloads", label: { en: "Downloads", ja: "ダウンロード" }, Icon: Download }
];

const skuSwatchThumbnailSize = 96;
const fabricAutomotiveBrandPattern = /\b(?:bmw|mercedes(?:-benz)?|porsche|volkswagen|vw|mini|ford|beetle|käfer|kafer|kever|coccinelle|westfalia|capri)\b/i;
const lightToDarkSwatchProductTypes = new Set(["automotive-nappa"]);
const skuCodeCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const fabricTrademarkDisclaimer = {
  en: "Vehicle brand names and trademarks referenced on this page are the property of their respective owners. CAMARI is not affiliated with, endorsed by, or sponsored by those owners. These fabrics are reproduction or aftermarket materials and are not genuine vehicle manufacturer products.",
  ja: "本ページに記載されている車両ブランド名および商標は、それぞれの権利者に帰属します。カマリ・ジャパンは各権利者と提携、承認、またはスポンサー関係にありません。これらの生地は再現品またはアフターマーケット素材であり、車両メーカーの純正品ではありません。"
};

function hasFabricAutomotiveBrandReference(
  materialSlug: string,
  productTypeSlug: string,
  productTypeName: string,
  productTypeSummary: string,
  sku: Sku
) {
  if (materialSlug !== "fabric") {
    return false;
  }

  const text = [
    productTypeSlug,
    productTypeName,
    productTypeSummary,
    sku.code,
    sku.colorName?.en,
    sku.colorName?.ja,
    sku.summary?.en,
    sku.summary?.ja,
    sku.seo?.title?.en,
    sku.seo?.title?.ja,
    sku.seo?.description?.en,
    sku.seo?.description?.ja
  ]
    .filter(Boolean)
    .join(" ");

  return fabricAutomotiveBrandPattern.test(text);
}

function getSkuSwatchImage(sku: Sku): string | undefined {
  const image = sku.swatchImage ?? sku.previewImage ?? (sku.image || undefined);

  return image ? toSanityThumbnailUrl(image, skuSwatchThumbnailSize) : undefined;
}

function getHexLuminance(value: string): number {
  const normalized = value.trim().replace(/^#/, "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((channel) => `${channel}${channel}`).join("")
    : normalized;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) {
    return -1;
  }

  const red = Number.parseInt(expanded.slice(0, 2), 16) / 255;
  const green = Number.parseInt(expanded.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(expanded.slice(4, 6), 16) / 255;

  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

function sortSkusForSwatches(skus: Sku[], productTypeSlug: string): Sku[] {
  if (!lightToDarkSwatchProductTypes.has(productTypeSlug)) {
    return skus;
  }

  return [...skus].sort((left, right) => {
    const luminanceDelta = getHexLuminance(right.hex ?? "") - getHexLuminance(left.hex ?? "");

    if (luminanceDelta !== 0) {
      return luminanceDelta;
    }

    return skuCodeCollator.compare(left.code, right.code);
  });
}

function formatArticleLabelPart(value: string): string {
  if (value !== value.toUpperCase()) {
    return value;
  }

  return value
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    .replace(/\bBmw\b/g, "BMW")
    .replace(/\bVw\b/g, "VW")
    .replace(/\bOem\b/g, "OEM")
    .replace(/\bOdm\b/g, "ODM");
}

export function SkuSwatches({ locale, materialName, materialSlug, productTypeName, productTypeSlug, productTypeCode, productTypeSummary, skus, initialSku, compact = false }: SkuSwatchesProps) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(initialSku.slug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const selected = useMemo(() => skus.find((sku) => sku.slug === selectedSlug) ?? initialSku, [initialSku, selectedSlug, skus]);
  const swatchSkus = useMemo(() => sortSkusForSwatches(skus, productTypeSlug), [productTypeSlug, skus]);
  const hasVisualSwatches = useMemo(() => skus.some((s) => s.hex || s.swatchImage || s.previewImage || s.image), [skus]);
  const showFabricTrademarkDisclaimer = hasFabricAutomotiveBrandReference(materialSlug, productTypeSlug, productTypeName, productTypeSummary, selected);
  const contactArticleLabel = `${formatArticleLabelPart(materialName)} - ${formatArticleLabelPart(productTypeName)}`;
  const galleryImages = useMemo(() => {
    const images = [
      {
        image: selected.image,
        thumbnail: getSkuSwatchImage(selected) ?? selected.image,
        alt: `${materialName}${selected.colorName?.[locale] ? ` — ${selected.colorName[locale]}` : ""}`
      },
      ...(selected.caseGallery ?? []).map((item) => ({
        image: item.image,
        thumbnail: item.image,
        alt: item.alt[locale] || item.alt.en || `${materialName} case image`
      }))
    ];
    const seen = new Set<string>();

    return images.filter((item) => {
      if (seen.has(item.image)) {
        return false;
      }
      seen.add(item.image);
      return true;
    });
  }, [locale, materialName, selected]);
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
                  <Image alt={item.alt} className="object-contain" fill sizes="90px" src={item.thumbnail} />
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
                      <Image alt={item.alt} className="object-contain" fill sizes="48px" src={item.thumbnail} />
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-5 text-center font-sans text-[12px] leading-[19px] md:mt-6">
              <span className="font-semibold text-charcoal">{locale === "en" ? "Color Code: " : "カラーコード："}</span>
              <span className="text-charcoal/70">{selected.code}</span>
            </p>
          </div>
        </div>

        {/* Col 3: Product details — matches Dedar's productView-details */}
        <div className="flex flex-col md:pl-[5%] md:pt-0 lg:pl-[10%]">
          <div className="md:max-w-[20rem] lg:max-w-[24rem]">
            {/* Breadcrumb */}
            <nav aria-label={locale === "en" ? "Breadcrumb" : "パンくずリスト"} className="mb-4">
              <ol className="flex flex-wrap items-center gap-x-2 font-sans text-[10px] uppercase tracking-[0.12em] text-muted">
                <li>
                  <Link className="transition-colors hover:text-charcoal" href={localizedPath(locale, "/")}>
                    {locale === "en" ? "Home" : "ホーム"}
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li>
                  <Link className="transition-colors hover:text-charcoal" href={localizedPath(locale, "/materials")}>
                    {locale === "en" ? "Material" : "素材"}
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
                {locale === "en" ? "Product code: " : "製品コード："}{productTypeCode}
              </p>
            ) : null}

            {/* Payoff / description — Dedar's productView-payoff */}
            <p className="mt-4 font-sans text-[0.875rem] leading-relaxed text-muted md:mt-5">
              {productTypeSummary}
            </p>

            {productTypeSlug === "alcantara-panel" ? (
              <p className="mt-6 font-sans text-[0.85rem] leading-relaxed text-muted">
                {locale === "en" ? "For seats, please see " : "シート用途には"}
                <Link
                  className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                  href={localizedPath(locale, `/materials/${materialSlug}/alcantara-cover/alc-c-1108`)}
                >
                  {locale === "en" ? "ALCANTARA COVER" : "アルカンターラ COVER"}
                </Link>
                {locale === "en" ? "." : "をご覧ください。"}
              </p>
            ) : productTypeSlug === "alcantara-cover" ? (
              <p className="mt-6 font-sans text-[0.85rem] leading-relaxed text-muted">
                {locale === "en" ? "For door panel, dashboard and other upholstery, please see " : "ドアパネル、ダッシュボード、その他の張り地用途には"}
                <Link
                  className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                  href={localizedPath(locale, `/materials/${materialSlug}/alcantara-panel/alc-p-1108`)}
                >
                  {locale === "en" ? "ALCANTARA PANNEL" : "アルカンターラ PANNEL"}
                </Link>
                {locale === "en" ? "." : "をご覧ください。"}
              </p>
            ) : productTypeSlug === "alcantara-master" ? (
              <div className="mt-6 space-y-2 font-sans text-[0.85rem] leading-relaxed text-muted">
                <p>
                  {locale === "en" ? "For upholstery sofa, please see Alcantara " : "ソファの張り地にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-multilayer/alc-ml-1001`)}
                  >
                    Multilayer
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
                <p>
                  {locale === "en" ? "For upholstery aviation, contract, marine, please see Alcantara " : "航空機、コントラクト、マリン用途の張り地にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-avant/alc-av-1001`)}
                  >
                    Avant
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
                <p>
                  {locale === "en" ? "For marine wall covering, please see Alcantara " : "マリン用途の壁装材にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-board-fr/alc-bf-1001`)}
                  >
                    Board FR
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
              </div>
            ) : productTypeSlug === "alcantara-multilayer" ? (
              <div className="mt-6 space-y-2 font-sans text-[0.85rem] leading-relaxed text-muted">
                <p>
                  {locale === "en" ? "For interior decoration, please see Alcantara " : "インテリア装飾にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-master/alc-m-1001`)}
                  >
                    Master
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
                <p>
                  {locale === "en" ? "For upholstery aviation, contract, marine, please see Alcantara " : "航空機、コントラクト、マリン用途の張り地にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-avant/alc-av-1001`)}
                  >
                    Avant
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
                <p>
                  {locale === "en" ? "For marine wall covering, please see Alcantara " : "マリン用途の壁装材にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-board-fr/alc-bf-1001`)}
                  >
                    Board FR
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
              </div>
            ) : productTypeSlug === "alcantara-avant" ? (
              <div className="mt-6 space-y-2 font-sans text-[0.85rem] leading-relaxed text-muted">
                <p>
                  {locale === "en" ? "For interior decoration, please see Alcantara " : "インテリア装飾にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-master/alc-m-1001`)}
                  >
                    Master
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
                <p>
                  {locale === "en" ? "For upholstery sofa, please see Alcantara " : "ソファの張り地にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-multilayer/alc-ml-1001`)}
                  >
                    Multilayer
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
                <p>
                  {locale === "en" ? "For marine wall covering, please see Alcantara " : "マリン用途の壁装材にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-board-fr/alc-bf-1001`)}
                  >
                    Board FR
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
              </div>
            ) : productTypeSlug === "alcantara-board-fr" ? (
              <div className="mt-6 space-y-2 font-sans text-[0.85rem] leading-relaxed text-muted">
                <p>
                  {locale === "en" ? "For interior decoration, please see Alcantara " : "インテリア装飾にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-master/alc-m-1001`)}
                  >
                    Master
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
                <p>
                  {locale === "en" ? "For upholstery sofa, please see Alcantara " : "ソファの張り地にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-multilayer/alc-ml-1001`)}
                  >
                    Multilayer
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
                <p>
                  {locale === "en" ? "For upholstery aviation, contract, marine, please see Alcantara " : "航空機、コントラクト、マリン用途の張り地にはアルカンターラ "}
                  <Link
                    className="font-semibold underline decoration-charcoal/40 underline-offset-4 transition-colors hover:text-charcoal hover:decoration-charcoal"
                    href={localizedPath(locale, `/materials/${materialSlug}/alcantara-avant/alc-av-1001`)}
                  >
                    Avant
                  </Link>{locale === "en" ? "." : "をご覧ください。"}
                </p>
              </div>
            ) : null}

            {/* Color selector — Dedar's swatch grid */}
            {hasVisualSwatches ? (
              <div className="mt-10 scroll-mt-[calc(var(--nav-height)+2rem)] md:mt-12" id="you-may-also-like">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/80">
                    {selected.colorName?.[locale]
                      ? `${locale === "en" ? "Colour" : "カラー"} — ${selected.colorName[locale]}`
                      : locale === "en" ? "Colour" : "カラー"}
                  </span>
                  <span className="font-sans text-[10px] tracking-[0.12em] text-charcoal/60">
                    {locale === "en" ? `${skus.length} options` : `${skus.length}色`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-[10px]">
                  {swatchSkus.map((sku) => {
                    const active = sku.slug === selected.slug;
                    const swatchImage = getSkuSwatchImage(sku);
                    const swatchStyle = !swatchImage && sku.hex ? { backgroundColor: sku.hex } : undefined;

                    return (
                      <button
                        aria-label={sku.colorName?.[locale] ? `${sku.colorName[locale]} — ${sku.code}` : sku.code}
                        aria-pressed={active}
                        className={`relative h-9 w-9 shrink-0 overflow-hidden border border-charcoal/15 bg-[#f3f3f2] transition-all ${
                          active
                            ? "outline outline-1 outline-offset-[3px] outline-charcoal"
                            : "hover:scale-110"
                        }`}
                        key={sku.slug}
                        onClick={() => handleSwatchClick(sku.slug)}
                        style={swatchStyle}
                        title={sku.colorName?.[locale] ? `${sku.code} ${sku.colorName[locale]}` : sku.code}
                        type="button"
                      >
                        {swatchImage ? <Image alt="" className="object-cover" fill sizes="36px" src={swatchImage} unoptimized /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Action buttons — Dedar's CTA area */}
            <div className="mt-8 space-y-3 md:mt-10">
              <CTAMessageDrawer
                articleLabel={contactArticleLabel}
                buttonClassName="inline-flex w-full justify-center bg-charcoal px-10 py-4 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal/85 md:w-auto md:min-w-[15rem]"
                buttonLabel={locale === "en" ? "Contact Sales" : "営業担当に相談"}
                locale={locale}
                placement="top"
              />
              <p className="font-sans text-[10px] leading-relaxed text-muted">
                {locale === "en"
                  ? "Sample request workflow is reserved for a later release."
                  : "サンプル請求機能は現在準備中です。"}
              </p>
              {showFabricTrademarkDisclaimer ? (
                <p className="max-w-[34rem] font-sans text-[9px] leading-relaxed text-charcoal/45">
                  {fabricTrademarkDisclaimer[locale]}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <nav
        aria-label={locale === "en" ? "Product information sections" : "製品情報セクション"}
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
              <span>{label[locale]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
}
