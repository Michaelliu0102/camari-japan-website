export function toSanityThumbnailUrl(imageUrl: string, size = 96): string {
  try {
    const url = new URL(imageUrl);

    if (url.hostname !== "cdn.sanity.io" || !url.pathname.startsWith("/images/")) {
      return imageUrl;
    }

    url.searchParams.set("w", String(size));
    url.searchParams.set("h", String(size));
    url.searchParams.set("fit", "crop");
    url.searchParams.set("auto", "format");
    url.searchParams.set("q", "70");

    return url.toString();
  } catch {
    return imageUrl;
  }
}
