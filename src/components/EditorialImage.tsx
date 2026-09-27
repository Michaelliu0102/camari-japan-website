"use client";

import Image, { type ImageProps } from "next/image";
import { editorialImageSource, editorialImageUrl } from "@/lib/editorial-image";

type EditorialImageProps = Pick<ImageProps, "src" | "alt" | "fill" | "sizes" | "className" | "loading" | "aria-hidden">;
const widths = [320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560];

/** Sanity handles these responsive images; unsupported/China assets keep Next's loader. */
export function EditorialImage(props: EditorialImageProps) {
  const { src, alt, fill, sizes, className, loading = "lazy" } = props;
  if (typeof src !== "string" || !editorialImageSource(src)) return <Image {...props} alt={alt} />;
  // A native srcset is intentional: Sites globally disables Next's image optimizer,
  // including custom loaders. Do not route these through /_next/image.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      aria-hidden={props["aria-hidden"]}
      className={className}
      decoding="async"
      loading={loading}
      sizes={sizes ?? "100vw"}
      src={editorialImageUrl(src, 1920)}
      srcSet={widths.map((width) => `${editorialImageUrl(src, width)} ${width}w`).join(", ")}
      style={fill ? { position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" } : undefined}
    />
  );
}
