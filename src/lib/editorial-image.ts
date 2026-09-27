// These aliases match scripts/sites-public-media.json; keep this small to avoid
// shipping the complete migration manifest to browsers. Originals are retained.
const homeImageAliases: Record<string, string> = {
  "/uploads/carousel/alcantara2.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/5e9754899b7d5494f9cd15943d82a046d1ed6904-1080x1350.jpg",
  "/uploads/carousel/fabric.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/4aaeceb0cab3bf83f8c0c39cea06299669ed07ed-1212x1794.jpg",
  "/uploads/veganleather/home-vegan-leather.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/2e1cabcb37abc14cfcb110986537b9ae949717f0-4000x6000.jpg",
  "/uploads/product/product.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/1376722a515edea03d156eeb3409be645da9a1d9-2800x1867.jpg"
};

export function editorialImageSource(src: string): string | undefined {
  if (process.env.NEXT_PUBLIC_SITE_KEY === "china") return undefined;
  const source = homeImageAliases[src] ?? src;
  try {
    const url = new URL(source);
    if (url.protocol === "https:" && url.hostname === "cdn.sanity.io" && url.pathname.startsWith("/images/") && /\.(jpe?g|png|webp|avif)$/i.test(url.pathname)) return source;
  } catch { /* Relative and unsupported images keep the existing loader. */ }
  return undefined;
}

export function editorialImageUrl(src: string, width: number, quality = 80): string {
  const source = editorialImageSource(src);
  if (!source) return src;
  const url = new URL(source);
  // Preserve any editorial crop/rect and its aspect ratio.
  const oldWidth = Number(url.searchParams.get("w"));
  const oldHeight = Number(url.searchParams.get("h"));
  if (oldWidth > 0 && oldHeight > 0) url.searchParams.set("h", String(Math.max(1, Math.round(oldHeight * width / oldWidth))));
  url.searchParams.set("w", String(Math.max(1, Math.round(width))));
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", String(quality));
  return url.toString();
}
