import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolvePublicRoute } from "@/lib/public-routing";
import { siteConfig } from "@/lib/site-config";

const internalLocaleRewriteHeader = "x-camari-locale-rewrite";

export function middleware(request: NextRequest) {
  if (request.headers.get(internalLocaleRewriteHeader) === "1") {
    return NextResponse.next();
  }

  const decision = resolvePublicRoute(request.nextUrl.pathname, siteConfig, request.url);

  if (decision.type === "next") {
    return NextResponse.next();
  }

  const targetUrl = new URL(decision.destination, request.url);

  if (decision.type === "redirect") {
    return NextResponse.redirect(targetUrl, 308);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(internalLocaleRewriteHeader, "1");

  return NextResponse.rewrite(targetUrl, {
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
