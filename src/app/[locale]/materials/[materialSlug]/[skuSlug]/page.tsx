import { notFound, redirect } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/locales";
import { loadLegacySku } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string; skuSlug: string }>;
};

export default async function LegacySkuRedirectPage({ params }: PageProps) {
  const { locale, materialSlug, skuSlug } = await params;
  const sku = await loadLegacySku(materialSlug, skuSlug);

  if (!sku) {
    notFound();
  }

  redirect(localizedPath(locale, `/materials/${materialSlug}/${sku.productTypeSlug}/${sku.slug}`));
}
