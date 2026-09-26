import type { PreviewConfig } from "sanity";

/** Resolve multilingual document titles explicitly instead of Studio's field guessing. */
export function localizedDocumentPreview(
  titleField: "name" | "title",
  fallbackTitle: string,
  mediaField?: string
): PreviewConfig {
  return {
    select: {
      titleEn: `${titleField}.en`,
      titleJa: `${titleField}.ja`,
      titleZh: `${titleField}.zh`,
      slug: "slug.current",
      ...(mediaField ? { media: mediaField } : {})
    },
    prepare({ titleEn, titleJa, titleZh, slug, media }) {
      const title = [titleEn, titleJa, titleZh, slug].find(
        value => typeof value === "string" && value.trim()
      );
      return {
        title: title || fallbackTitle,
        subtitle: slug || undefined,
        media
      };
    }
  };
}
