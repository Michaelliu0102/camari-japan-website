// Legacy slugs suppress local fallback records, not the live Sanity collection.
export const legacySkaiSlugs: ReadonlySet<string> = new Set([
  "aliena", "evida-fiber", "gemini", "neptun-pescara", "palma-nf",
  "parotega-nf", "pureto-en", "sofelto-en", "solino", "solino-en",
  "soshagro-en", "sotega-fls", "tovinto-en", "venezia", "vyp-nappa"
]);

export function isLegacySkaiCollection(materialSlug: string, slug: string): boolean {
  return materialSlug === "vegan-leather" && legacySkaiSlugs.has(slug);
}

export function isSkaiProductType(productType: {
  materialSlug: string;
  slug: string;
  name?: { en?: string };
}): boolean {
  return productType.materialSlug === "vegan-leather" && (
    legacySkaiSlugs.has(productType.slug) || /^skai(?:®|\s)/i.test(productType.name?.en ?? "")
  );
}
