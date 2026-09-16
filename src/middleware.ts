import { resolveChinaRoute } from "@/china/routes";
import { isChinaBuild, isChinaPreview } from "@/china/config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolvePublicRoute } from "@/lib/public-routing";
import { siteConfig } from "@/lib/site-config";

const internalLocaleRewriteHeader = "x-camari-locale-rewrite";

export function middleware(request: NextRequest) {
  if (request.headers.get(internalLocaleRewriteHeader) === "1") {
    return NextResponse.next();
  }

  const chinaDecision = resolveChinaRoute(request.nextUrl.pathname, isChinaBuild, isChinaPreview);
  if (chinaDecision.type === "blocked") return new NextResponse("未找到页面", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  if (chinaDecision.type === "redirect") return NextResponse.redirect(new URL(chinaDecision.destination!, request.url), 308);
  if (chinaDecision.type === "next" || chinaDecision.type === "rewrite") {
    const headers = new Headers(request.headers);
    headers.set("x-camari-site", "china");
    headers.set(internalLocaleRewriteHeader, "1");
    const response = chinaDecision.type === "rewrite"
      ? NextResponse.rewrite(new URL(chinaDecision.destination!, request.url), { request: { headers } })
      : NextResponse.next({ request: { headers } });
    if (isChinaPreview) response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  const decision = resolvePublicRoute(request.nextUrl.pathname, siteConfig, request.url);

  if (decision.type === "next") {
    const headers = new Headers(request.headers);
    if(request.nextUrl.pathname.startsWith("/en")) headers.set("x-camari-locale","en");
    return NextResponse.next({request:{headers}});
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
