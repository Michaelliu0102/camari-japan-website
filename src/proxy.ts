import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolvePublicRoute } from "@/lib/public-routing";
import { siteConfig } from "@/lib/site-config";

export function proxy(request: NextRequest) {
  const decision = resolvePublicRoute(request.nextUrl.pathname, siteConfig);

  if (decision.type === "next") {
    return NextResponse.next();
  }

  const targetUrl = new URL(decision.destination, request.url);

  if (decision.type === "redirect") {
    return NextResponse.redirect(targetUrl, 308);
  }

  return NextResponse.rewrite(targetUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
