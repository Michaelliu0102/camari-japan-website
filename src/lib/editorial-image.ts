// Verified public-file aliases; keep this curated so the full media manifest
// is never shipped to browsers. Original files and CMS assets are retained.
const imageAliases: Record<string, string> = {
  "/uploads/carousel/alcantara2.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/5e9754899b7d5494f9cd15943d82a046d1ed6904-1080x1350.jpg",
  "/uploads/carousel/fabric.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/4aaeceb0cab3bf83f8c0c39cea06299669ed07ed-1212x1794.jpg",
  "/uploads/veganleather/home-vegan-leather.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/2e1cabcb37abc14cfcb110986537b9ae949717f0-4000x6000.jpg",
  "/uploads/product/product.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/1376722a515edea03d156eeb3409be645da9a1d9-2800x1867.jpg",
  "/uploads/about/alcantara-milan-headquarters.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/a41047a32698ab200942e9ce8da05e33a25ecbe6-1920x1280.jpg",
  "/uploads/about/brandvalue.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/59e7d0e5753b9135f05bc55492788686b0595613-1702x1276.jpg",
  "/uploads/about/casa-camari-office.png": "https://cdn.sanity.io/images/bfjhbpbx/production/294c0a268da7776865cba01d8935502211888cb3-1704x1302.png",
  "/uploads/about/china-warehouse.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/1b1f4f8cecec92ae3e7a42a713d8930cc3bae108-1920x1280.jpg",
  "/uploads/about/factory.jpeg": "https://cdn.sanity.io/images/bfjhbpbx/production/9c8661ca4d66cc5fe82985659c7a8e7c31a62172-6000x4000.jpg",
  "/uploads/about/italy-warehouse.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/5936b0b9a59409d1167f7525ee99e50f4aba57e5-6000x4000.jpg",
  "/uploads/about/manufacturing.jpeg": "https://cdn.sanity.io/images/bfjhbpbx/production/af7a3fbffe999ba8d3be492c264b66a81991ca55-6000x4000.jpg",
  "/uploads/about/sampling.jpeg": "https://cdn.sanity.io/images/bfjhbpbx/production/c08f725e32458bef12007ed7e26d77f8838a9aa1-6000x4000.jpg",
  "/uploads/about/showroom.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/3dc166358c069d1dcffb8f41f6b34e5769c00bcb-1672x941.jpg",
  "/uploads/about/warehouse.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/916d880c9f7a5a91b4c5877e44d149f1a425e085-1706x1279.jpg",
  "/uploads/about/warehouseglobal.jpeg": "https://cdn.sanity.io/images/bfjhbpbx/production/08e5253ef285558ebedbd6659ecb0c1860ba3234-4160x3120.jpg",
  "/uploads/about/warehouseglobal.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/3c66d6bc85380572605abfa122c96b331f7e3034-4160x3120.jpg",
  "/uploads/hero/leather-hero.png": "https://cdn.sanity.io/images/bfjhbpbx/production/f422720412781e956736b33482aed1ba1e3ead7e-1672x941.png",
  "/uploads/veganleather/color.png": "https://cdn.sanity.io/images/bfjhbpbx/production/c636b5171e5fefbf7d959f8a131a7313c5db7bb4-1448x1086.png",
  "/uploads/veganleather/vegan.jpeg": "https://cdn.sanity.io/images/bfjhbpbx/production/1ec28a075b0d756bdcda399fdb3ceb27ebfeb185-5368x3579.jpg",
  "/uploads/veganleather/interior.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/9aa4ec28f1dbed257355d9eee6af9b914005f9aa-1672x941.jpg",
  "/uploads/hero/fabric-hero.jpg": "https://cdn.sanity.io/images/bfjhbpbx/production/827b2ac0bbe2c2501105cce02a3d60451d6b6639-2560x1920.jpg"
};

export function editorialImageSource(src: string): string | undefined {
  if (process.env.NEXT_PUBLIC_SITE_KEY === "china") return undefined;
  const source = imageAliases[src] ?? src;
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

const responsiveWidths = [64, 96, 128, 160, 240, 320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560];

/** A full-screen cover image is scaled by height on portrait screens. Account
 * for that scale so a narrow viewport does not request a blurry hero. */
export function editorialHeroSizes(src: string): string {
  const source = editorialImageSource(src);
  if (!source) return "100vw";
  const url = new URL(source);
  const dimensions = url.pathname.match(/-(\d+)x(\d+)\.[a-z]+$/i);
  const rect = url.searchParams.get("rect")?.split(",").map(Number);
  const width = Number(url.searchParams.get("w"));
  const height = Number(url.searchParams.get("h"));
  const ratio = width && height ? width / height : (rect?.[2] || Number(dimensions?.[1])) / (rect?.[3] || Number(dimensions?.[2]));
  return ratio > 0 ? `max(100vw, ${(ratio * 100).toFixed(3)}vh)` : "100vw";
}

export function editorialImageSrcSet(src: string, maxOutputWidth = 2560): string | undefined {
  const source = editorialImageSource(src);
  if (!source) return undefined;
  const url = new URL(source);
  const originalWidth = Number(url.pathname.match(/-(\d+)x\d+\.[a-z]+$/i)?.[1]);
  const rectWidth = Number(url.searchParams.get("rect")?.split(",")[2]);
  // Do not advertise candidates larger than the original (fit=max cannot upscale).
  const maxWidth = Math.min(rectWidth || originalWidth || 2560, maxOutputWidth, 2560);
  const widths = [...responsiveWidths.filter((width) => width < maxWidth), maxWidth];
  return widths.map((width) => `${editorialImageUrl(src, width)} ${width}w`).join(", ");
}
