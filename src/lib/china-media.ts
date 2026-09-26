import media from "@/generated/china-media.json";

type MediaFile = { base: string; ext: string };
const files = media as Record<string, MediaFile>;

/** Direct CDN delivery; never fetch the image through the ECS image optimizer. */
export function chinaMediaUrl(src: string, width = 1920): string {
  if (process.env.NEXT_PUBLIC_SITE_KEY !== "china") return src;
  const origin = process.env.NEXT_PUBLIC_CHINA_MEDIA_URL;
  if (!origin) return src;
  let key = src.split("?")[0].split("#")[0];
  if (key.startsWith("/")) {
    try { key = decodeURIComponent(key); } catch { return src; }
  }
  const entry = files[key];
  // New CMS images retain their working source until the next media sync.
  if (!entry) return src;
  const size = width <= 320 ? 320 : width <= 768 ? 768 : 1920;
  const file = entry.ext === "webp" ? `${entry.base}-${size}.webp` : `${entry.base}.${entry.ext}`;
  return `${origin.replace(/\/$/, "")}/${file}`;
}
