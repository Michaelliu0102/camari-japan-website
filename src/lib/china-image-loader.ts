import type { ImageLoaderProps } from "next/image";
import { chinaMediaUrl } from "./china-media";

export default function chinaImageLoader({ src, width }: ImageLoaderProps): string {
  return chinaMediaUrl(src, width);
}
