export const chinaSiteUrl = "https://www.camari.com.cn";
export const isChinaBuild = process.env.NEXT_PUBLIC_SITE_KEY === "china";
// Draft content is available in local development and explicitly enabled preview deployments,
// never by a query parameter. Public preview deployments remain noindex and keep forms disabled.
export const isChinaPreview = process.env.NODE_ENV === "development" || process.env.CHINA_PUBLIC_PREVIEW === "1";
export const chinaBasePath = isChinaBuild ? "" : "/zh";
export function chinaPath(path = "/"): string {
  return `${chinaBasePath}${path === "/" ? "" : path}` || "/";
}
export const chinaNav = [
  ["/", "首页"], ["/about", "关于我们"], ["/materials", "材料"], ["/products", "产品"],
  ["/projects", "应用案例"], ["/media", "新闻"], ["/downloads", "资料下载"], ["/contact", "联系我们"]
] as const;
