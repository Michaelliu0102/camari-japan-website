import type { ValidationContext } from "sanity";

type TranslatedValue = { en?: string; ja?: string };
type MarketDocument = {
  _type?: string;
  markets?: string[];
  productType?: { _ref?: string };
  name?: TranslatedValue;
  summary?: TranslatedValue;
  seo?: { title?: TranslatedValue; description?: TranslatedValue };
};

export function missingJapaneseCore(document: MarketDocument): string[] {
  const fields = {
    ...(document._type === "productType" ? { name: document.name } : {}),
    summary: document.summary,
    "seo.title": document.seo?.title,
    "seo.description": document.seo?.description
  };
  return Object.entries(fields).filter(([, value]) => value?.en?.trim() && !value.ja?.trim()).map(([name]) => name);
}

export async function validateMarketContent(value: unknown, context: ValidationContext): Promise<true | string> {
  const document = value as MarketDocument | undefined;
  if (!document) return true;
  let markets = document.markets;
  if (document._type === "sku") {
    const ref = document.productType?._ref;
    if (!ref) return true; // The reference field handles its own required validation.
    const id = ref.replace(/^drafts\./, "");
    const parent = await context.getClient({ apiVersion: "2026-05-12" }).withConfig({ useCdn: false, perspective: "raw" }).fetch<{ markets?: string[] } | null>(
      'coalesce(*[_id == $draftId][0], *[_id == $id][0]){markets}', { id, draftId: `drafts.${id}` }
    );
    markets = parent?.markets;
  }
  if (!markets?.includes("japan")) return true;
  const missing = missingJapaneseCore(document);
  return missing.length ? `Japanese copy is required for the Japan market: ${missing.join(", ")}. Manufacturer colour names may keep their original spelling.` : true;
}
