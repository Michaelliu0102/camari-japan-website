// This switch is deliberately separate from SITES_PREVIEW (image compatibility).
// A production-domain build must remain indexable even if the switch is copied.
// Read the public build value directly so Next inlines it in dynamic routes too.
export const previewNoindexEnabled =
  process.env.NEXT_PUBLIC_PREVIEW_NOINDEX === "true" &&
  process.env.NEXT_PUBLIC_SITE_URL === "https://camari-japan-preview.y-liu804161.chatgpt.site";

export const previewRobots = { index: false, follow: false } as const;
