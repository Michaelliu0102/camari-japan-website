export const chinaSiteUrl = "https://camari-international.com.cn";
export const isChinaBuild = process.env.NEXT_PUBLIC_SITE_KEY === "china";
// Draft content is available only in local development, never enabled by a query parameter.
export const isChinaPreview = process.env.NODE_ENV === "development";
export const chinaBasePath = isChinaBuild ? "" : "/zh";
export function chinaPath(path = "/"): string {
  return `${chinaBasePath}${path === "/" ? "" : path}` || "/";
}
export const chinaNav = [
  ["/", "首页"], ["/about", "关于我们"], ["/materials", "材料"], ["/products", "产品"],
  ["/projects", "应用案例"], ["/media", "新闻"], ["/downloads", "资料下载"], ["/contact", "联系我们"]
] as const;
