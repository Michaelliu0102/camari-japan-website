import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductTypeDetailPage } from "@/components/ProductTypeDetailPage";
import type { Locale } from "@/lib/locales";
import { createPageMetadata } from "@/lib/metadata";
import { loadSkaiVinylProductTypeSlugs } from "@/lib/skai-vinyl";
import {
  loadMaterial,
  loadMaterials,
  loadProductType,
  loadProductTypesForMaterial,
  loadSku,
  loadSkusForProductType
} from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string; productTypeSlug: string; skuSlug: string }>;
};

// SKU data is fetched fresh; static fallback rendering rejects no-store reads on Workers.
export const dynamic = "force-dynamic";

async function isEnglishOnlySkaiVinylRoute(
  locale: Locale,
  materialSlug: string,
  productTypeSlug: string
): Promise<boolean> {
  if (locale !== "ja" || materialSlug !== "vegan-leather") {
    return false;
  }

  const skaiProductTypeSlugs = await loadSkaiVinylProductTypeSlugs();
  return skaiProductTypeSlugs.has(productTypeSlug);
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === "development" || process.env.SITES_PREVIEW === "1") {
    return [];
  }

  const materials = await loadMaterials();
  const productTypeGroups = await Promise.all(
    materials.map((material) => loadProductTypesForMaterial(material.slug))
  );
  const skaiProductTypeSlugs = await loadSkaiVinylProductTypeSlugs();
  const skuGroups = await Promise.all(
    materials.map(async (material, materialIndex) =>
      Promise.all(
        (productTypeGroups[materialIndex] ?? []).map(async (productType) => ({
          productType,
          skus: await loadSkusForProductType(material.slug, productType.slug)
        }))
      )
    )
  );

  return materials.flatMap((material, materialIndex) =>
    (skuGroups[materialIndex] ?? []).flatMap(({ productType, skus }) =>
      skus.flatMap((sku) => {
        const params = [{ locale: "en", materialSlug: material.slug, productTypeSlug: productType.slug, skuSlug: sku.slug }];
        const isSkaiVinyl = material.slug === "vegan-leather" && skaiProductTypeSlugs.has(productType.slug);

        return isSkaiVinyl
          ? params
          : [...params, { locale: "ja", materialSlug: material.slug, productTypeSlug: productType.slug, skuSlug: sku.slug }];
      })
    )
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug, productTypeSlug, skuSlug } = await params;
  if (await isEnglishOnlySkaiVinylRoute(locale, materialSlug, productTypeSlug)) {
    return {};
  }

  const [productType, sku] = await Promise.all([
    loadProductType(materialSlug, productTypeSlug),
    loadSku(materialSlug, productTypeSlug, skuSlug)
  ]);

  if (!productType || !sku) {
    return {};
  }

  const skaiProductTypeSlugs = materialSlug === "vegan-leather"
    ? await loadSkaiVinylProductTypeSlugs()
    : new Set<string>();
  const availableLocales: readonly Locale[] = skaiProductTypeSlugs.has(productTypeSlug) ? ["en"] : ["en", "ja"];
  const useChineseSkuSeo = locale === "zh";

  return createPageMetadata({
    locale,
    path: useChineseSkuSeo
      ? `/materials/${materialSlug}/${productTypeSlug}/${skuSlug}`
      : `/materials/${materialSlug}/${productTypeSlug}`,
    title: useChineseSkuSeo ? sku.seo.title.zh || productType.seo.title.zh : productType.seo.title[locale],
    description: useChineseSkuSeo ? sku.seo.description.zh || productType.seo.description.zh : productType.seo.description[locale],
    image: useChineseSkuSeo ? sku.seo.image || productType.seo.image : productType.seo.image || sku.seo.image,
    availableLocales
  });
}

export default async function ProductTypeSkuDetailRoute({ params }: PageProps) {
  const { locale, materialSlug, productTypeSlug, skuSlug } = await params;
  if (await isEnglishOnlySkaiVinylRoute(locale, materialSlug, productTypeSlug)) {
    notFound();
  }

  const [material, productType, sku, skus] = await Promise.all([
    loadMaterial(materialSlug),
    loadProductType(materialSlug, productTypeSlug),
    loadSku(materialSlug, productTypeSlug, skuSlug),
    loadSkusForProductType(materialSlug, productTypeSlug)
  ]);

  if (!material || !productType || !sku || skus.length === 0) {
    notFound();
  }

  return (
    <ProductTypeDetailPage
      initialSku={sku}
      locale={locale}
      material={material}
      productType={productType}
      skus={skus}
    />
  );
}
