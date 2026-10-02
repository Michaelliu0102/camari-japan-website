import { chinaRecordPath, type ChinaRecord, type ChinaSiteSettings } from "./content";
export function chinaPageReady(path: string, settings: ChinaSiteSettings, records: ChinaRecord[]): boolean {
  if(settings.status!=="ready")return false;
  if(path==="/")return settings.home.status==="ready" && Boolean(settings.home.title?.trim()&&settings.home.description?.trim());
  if(path==="/about")return settings.about.status==="ready" && Boolean(settings.about.title?.trim()&&settings.about.paragraphs?.some(p=>p.trim()));
  if(path==="/contact")return settings.contact.status==="ready"&&Boolean(settings.contact.companyName?.trim()&&settings.contact.email?.trim()&&settings.contact.phone?.trim()&&settings.contact.address?.trim());
  if(path==="/downloads")return settings.downloads.status==="ready"&&Boolean(settings.downloads.files?.some(file=>file.title?.trim()&&file.href));
  if(path==="/search")return records.length>0;
  const types:Record<string,string>={"/materials":"material","/products":"productCategory","/projects":"projectCase","/media":"news"};
  if(types[path])return records.some(record=>record._type===types[path]);
  return records.some(record=>chinaRecordPath(record)===path);
}
export function resolveChinaRoute(path: string, chinaBuild: boolean, preview: boolean): {type:"next"|"rewrite"|"redirect"|"blocked"|"legacy";destination?:string} {
  if (/^\/(api|studio|_next)(\/|$)/.test(path)||/\.[^/]+$/.test(path)) return {type:"legacy"};
  if(chinaBuild) {
    if(/^\/(en|ja)(\/|$)/.test(path))return {type:"redirect",destination:`https://www.camari-international.${path.startsWith("/ja")?"co.jp":"com"}${path.replace(/^\/(en|ja)/,"")||"/"}`};
    if(path==="/zh"||path.startsWith("/zh/"))return {type:"redirect",destination:path.slice(3)||"/"};
    return {type:"rewrite",destination:path==="/"?"/zh":`/zh${path}`};
  }
  if(path==="/zh"||path.startsWith("/zh/"))return {type:preview?"next":"blocked"};
  return {type:"legacy"};
}
