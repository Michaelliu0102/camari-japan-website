import type { Locale } from "./locales";
import { normalizePublicPath } from "./locales";

type RoutingDecision =
  | { type: "next" }
  | { type: "redirect"; destination: string }
  | { type: "rewrite"; destination: string };

type PublicRoutingSiteConfig = {
  defaultLocale: Locale;
  alternateSiteHomeUrl: string;
  enableLocalePreview?: boolean;
};

const passthroughPrefixes = ["/api", "/_next", "/studio"];

function isStaticAsset(pathname: string): boolean {
  return /\.[^/]+$/u.test(pathname);
}

function isCurrentRequestPath(destination: string, requestUrl?: string): boolean {
  if (!requestUrl) {
    return false;
  }

  try {
    const currentUrl = new URL(requestUrl);
    const destinationUrl = new URL(destination, currentUrl);

    return destinationUrl.origin === currentUrl.origin && destinationUrl.pathname === currentUrl.pathname;
  } catch {
    return false;
  }
}

function buildAlternateSiteDestination(alternateSiteHomeUrl: string, pathname: string): string {
  const normalizedPath = normalizePublicPath(pathname);

  if (alternateSiteHomeUrl === "/") {
    return normalizedPath;
  }

  return new URL(normalizedPath, `${alternateSiteHomeUrl}/`).toString();
}

export function resolvePublicRoute(pathname: string, siteConfig: PublicRoutingSiteConfig, requestUrl?: string): RoutingDecision {
  if (passthroughPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) || isStaticAsset(pathname)) {
    return { type: "next" };
  }

  const localePrefixedMatch = pathname.match(/^\/(en|ja)(?=\/|$)/u);
  if (localePrefixedMatch) {
    const requestedLocale = localePrefixedMatch[1] as Locale;

    if (requestedLocale !== siteConfig.defaultLocale) {
      if (siteConfig.enableLocalePreview) {
        return { type: "next" };
      }

      const alternateDestination = buildAlternateSiteDestination(siteConfig.alternateSiteHomeUrl, pathname);

      if (isCurrentRequestPath(alternateDestination, requestUrl)) {
        return { type: "next" };
      }

      return {
        type: "redirect",
        destination: alternateDestination
      };
    }

    return {
      type: "redirect",
      destination: normalizePublicPath(pathname)
    };
  }

  const normalizedPath = normalizePublicPath(pathname);
  return {
    type: "rewrite",
    destination: normalizedPath === "/" ? `/${siteConfig.defaultLocale}` : `/${siteConfig.defaultLocale}${normalizedPath}`
  };
}
