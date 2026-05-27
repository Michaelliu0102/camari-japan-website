export type SanityMarket = "global" | "japan";

const allowedMarkets = new Set<SanityMarket>(["global", "japan"]);

export function getSanityMarket(): SanityMarket {
  const configuredMarket = process.env.NEXT_PUBLIC_SANITY_MARKET;

  if (configuredMarket === "global" || configuredMarket === "japan") {
    return configuredMarket;
  }

  if (configuredMarket && !allowedMarkets.has(configuredMarket as SanityMarket)) {
    console.warn(`Unsupported NEXT_PUBLIC_SANITY_MARKET "${configuredMarket}"; falling back to "japan".`);
  }

  return "japan";
}
