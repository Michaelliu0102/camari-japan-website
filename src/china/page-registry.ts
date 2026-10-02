// China and English share page modules. New international routes should be added here too.
export const chinaPageModules = {
  home: () => import("../app/[locale]/page"),
  about: () => import("../app/[locale]/about/page"),
  materials: () => import("../app/[locale]/materials/page"),
  material: () => import("../app/[locale]/materials/[materialSlug]/page"),
  series: () => import("../app/[locale]/materials/[materialSlug]/[productTypeSlug]/page"),
  sku: () => import("../app/[locale]/materials/[materialSlug]/[productTypeSlug]/[skuSlug]/page"),
  products: () => import("../app/[locale]/products/page"),
  category: () => import("../app/[locale]/products/[categorySlug]/page"),
  showcase: () => import("../app/[locale]/products/showcase/page"),
  projects: () => import("../app/[locale]/projects/page"),
  project: () => import("../app/[locale]/projects/[projectSlug]/page"),
  media: () => import("../app/[locale]/media/page"),
  news: () => import("../app/[locale]/media/[newsSlug]/page"),
  downloads: () => import("../app/[locale]/downloads/page"),
  contact: () => import("../app/[locale]/contact/page"),
  oem: () => import("../app/[locale]/oem-odm/page"),
  privacy: () => import("../app/[locale]/privacy-policy/page"),
  cookies: () => import("../app/[locale]/cookie-policy/page"),
  terms: () => import("../app/[locale]/site-policy/page"),
  sitemap: () => import("../app/[locale]/sitemap/page")
};
export function chinaPageKey(segments:string[]):keyof typeof chinaPageModules|undefined {
  const [root,second]=segments;
  if(!root)return "home";
  const single:Record<string,keyof typeof chinaPageModules>={about:"about",materials:"materials",products:"products",projects:"projects",media:"media",downloads:"downloads",contact:"contact","oem-odm":"oem","privacy-policy":"privacy","cookie-policy":"cookies","site-policy":"terms",sitemap:"sitemap"};
  if(segments.length===1)return single[root];
  if(root==="materials")return segments.length===2?"material":segments.length===3?"series":segments.length===4?"sku":undefined;
  if(segments.length!==2)return undefined;
  if(root==="products")return second==="showcase"?"showcase":"category";
  if(root==="projects")return "project";
  if(root==="media")return "news";
}
