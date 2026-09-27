import "server-only";
import media from "../../scripts/sites-public-media.json";

const files = media as Record<string, { url: string }>;

/** Resolve legacy public paths before sending props to image grids. The large
 * migration manifest stays on the server; China keeps its existing OSS loader. */
export function publicImageSource(src: string): string;
export function publicImageSource(src: string | undefined): string | undefined;
export function publicImageSource(src: string | undefined): string | undefined {
  if (!src || process.env.NEXT_PUBLIC_SITE_KEY === "china") return src;
  return files[src]?.url ?? src;
}
