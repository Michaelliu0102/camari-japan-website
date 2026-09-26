import { isChinaBuild, isChinaPreview, chinaSiteUrl } from "@/china/config";
import { loadChinaContent } from "@/china/loader";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (isChinaBuild) {
    const {siteReady} = await loadChinaContent();
    return {rules:{userAgent:"*",...(siteReady && !isChinaPreview ? {allow:"/",disallow:["/api","/studio","/zh","/search"]} : {disallow:"/"})},sitemap:`${chinaSiteUrl}/sitemap.xml`,host:chinaSiteUrl};
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/studio", "/test-animation", "/zh"]
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api", "/studio", "/test-animation", "/zh"]
      }
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl
  };
}
