"use client";

import Image, { type ImageProps } from "next/image";
import { preload } from "react-dom";
import { editorialImageSource, editorialImageUrl, editorialImageSrcSet } from "@/lib/editorial-image";

type EditorialImageProps = Pick<ImageProps, "src" | "alt" | "fill" | "sizes" | "className" | "loading" | "aria-hidden" | "priority" | "preload" | "fetchPriority" | "style" | "width" | "height"> & { maxWidth?: number };

/** Sanity handles these responsive images; unsupported/China assets keep Next's loader. */
export function EditorialImage(props: EditorialImageProps) {
  const { maxWidth = 2560, ...imageProps } = props;
  const { src, alt, fill, sizes = "100vw", className, style, width, height } = imageProps;
  if (typeof src !== "string" || !editorialImageSource(src)) return <Image {...imageProps} alt={alt} />;
  const isPriority = props.priority || props.preload;
  const source = editorialImageUrl(src, Math.min(1920, maxWidth));
  const srcSet = editorialImageSrcSet(src, maxWidth);
  const fetchPriority = props.fetchPriority ?? (isPriority ? "high" : undefined);
  if (isPriority) {
    // The preload and image must select the same candidate, including on mobile.
    preload(source, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority });
  }
  // A native srcset is intentional: Sites globally disables Next's image optimizer,
  // including custom loaders. Do not route these through /_next/image.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      aria-hidden={props["aria-hidden"]}
      className={className}
      decoding="async"
      fetchPriority={fetchPriority}
      loading={isPriority ? "eager" : props.loading ?? "lazy"}
      sizes={sizes}
      src={source}
      srcSet={srcSet}
      width={width}
      height={height}
      style={{ ...(fill ? { position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" } as const : {}), ...style }}
    />
  );
}
