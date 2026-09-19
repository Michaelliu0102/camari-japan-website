export type ChinaStatus = "draft" | "ready" | "hidden";
export type TranslatedText = { en?: string; ja?: string; zh?: string };
export type ChinaRecord = {
  _id: string; _type: string; slug: string; chinaStatus?: ChinaStatus; markets?: string[];
  name?: TranslatedText; title?: TranslatedText; summary?: TranslatedText; description?: TranslatedText;
  introTitle?: TranslatedText; introBody?: TranslatedText; heroSubtitle?: TranslatedText;
  seo?: { title?: TranslatedText; description?: TranslatedText };
  image?: string; gallery?: string[]; updatedAt?: string; publishedAt?: string;
  categorySlug?: string; materialSlug?: string; productTypeSlug?: string; code?: string; hex?: string;
  colorName?: TranslatedText; subtitle?: TranslatedText; industry?: TranslatedText;
  faq?: { en?: unknown[]; ja?: unknown[]; zh?: Array<{question?: string; answer?: string; link?: {href?:string;label?:string}}> };
  highlights?: Array<{ title?: TranslatedText; body?: TranslatedText }>;
  carouselItems?: Array<{title?: TranslatedText; description?: TranslatedText; customizedOption?: TranslatedText; details?: TranslatedText[]; image?: string}>;
  specTemplate?: Array<{label?: TranslatedText; defaultValue?: TranslatedText}>;
  specs?: Array<{label?: TranslatedText; value?: TranslatedText}>;
  downloads?: Array<{title?: TranslatedText; description?: TranslatedText; href?: string}>;
  articleContent?: { zh?: {dateline?: string; heroImage?:string; relatedLink?:{href?:string;label?:string}; video?:{src?:string;poster?:string;title?:string}; introduction?: string[]; sections?: Array<{title?: string; body?: string[]; images?: Array<{src?: string; alt?: string}>}>} };
  [key: string]: unknown;
};
export type ChinaSiteSettings = {
  _id: string; status: ChinaStatus; brandName: string; legalName?: string; icpNumber?: string; siteTitle: string; seoDescription: string;
  home: {status: ChinaStatus; eyebrow: string; title: string; description: string; image: string; ctaLabel: string; brandTitle: string; brandBody: string};
  about: {status: ChinaStatus; title: string; paragraphs: string[]};
  contact: {status: ChinaStatus; companyName?: string; email?: string; phone?: string; address?: string; wechat?: string; formEnabled?: boolean; privacyNotice?: string};
  downloads: {status: ChinaStatus; title: string; description: string; files: Array<{title: string; description?: string; href: string}>};
};
export const chineseText = (value: unknown): string => value && typeof value === "object" && typeof (value as TranslatedText).zh === "string" ? (value as TranslatedText).zh! : "";
export const chinaTitle = (record: ChinaRecord): string => chineseText(record.title) || chineseText(record.name);

// Shared by Studio and delivery: a status switch cannot publish untranslated prose.
export function missingChineseFields(record: Record<string, unknown>): string[] {
  const missing: string[] = [];
  const type = record._type;
  const required = type === "material" ? ["name", "introTitle", "introBody"]
    : type === "materialCategory" ? ["name", "description"]
    : type === "productCategory" ? ["title", "description"]
    : type === "productType" ? ["name", "summary"]
    : type === "sku" ? ["summary"] : ["title", "summary"];
  for (const key of required) if (!chineseText(record[key]).trim()) missing.push(`${key}.zh`);
  const seo = record.seo as ChinaRecord["seo"];
  for (const key of ["title", "description"] as const) if (!chineseText(seo?.[key]).trim()) missing.push(`seo.${key}.zh`);
  function walk(value: unknown, path: string) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) { value.forEach((v,i)=>walk(v,`${path}[${i}]`)); return; }
    const obj = value as Record<string, unknown>;
    // Manufacturer colour names and measured/specification values can retain their original codes.
    if (/(?:colorName|defaultValue|\.value)$/.test(path)) return;
    if ((typeof obj.en === "string" && obj.en.trim()) || (typeof obj.ja === "string" && obj.ja.trim())) {
      if (!chineseText(obj).trim()) missing.push(`${path}.zh`);
      return;
    }
    for (const [key,v] of Object.entries(obj)) if (!["en","ja","articleContent","faq"].includes(key)) walk(v,path?`${path}.${key}`:key);
  }
  for (const key of ["heroSubtitle","subtitle","industry","highlights","carouselItems","applications","specTemplate","specs","downloads","certifications","maintenance"]) walk(record[key],key);
  const faq = record.faq as ChinaRecord["faq"];
  if ((faq?.en?.length || faq?.ja?.length) && !Array.isArray(faq?.zh)) missing.push("faq.zh");
  if (faq?.zh?.some(item=>!item.question?.trim()||!item.answer?.trim())) missing.push("faq.zh.entries");
  if (type === "news") {
    const article = (record.articleContent as ChinaRecord["articleContent"])?.zh;
    if (!article?.introduction?.some(p=>p.trim())) missing.push("articleContent.zh.introduction");
    if (article?.sections?.some(s=>!s.title?.trim() || !s.body?.some(p=>p.trim()))) missing.push("articleContent.zh.sections");
  }
  return [...new Set(missing)];
}
export function chinaRecordVisible(record: ChinaRecord, preview: boolean): boolean {
  if (record.chinaStatus === "hidden") return false;
  if (preview) return record.chinaStatus === "draft" || record.chinaStatus === "ready";
  return record.chinaStatus === "ready" && (!record.markets?.length || record.markets.includes("global") || record.markets.includes("china")) && missingChineseFields(record).length === 0;
}
export function chinaRecordPath(record: ChinaRecord): string | undefined {
  const slug = encodeURIComponent(record.slug);
  if (record._type === "material") return `/materials/${slug}`;
  if (record._type === "productCategory") return `/products/${slug}`;
  if (record._type === "projectCase") return `/projects/${slug}`;
  if (record._type === "news") return `/media/${slug}`;
  if (record._type === "productType" && record.materialSlug) return `/materials/${encodeURIComponent(record.materialSlug)}/${slug}`;
  if (record._type === "sku" && record.materialSlug && record.productTypeSlug) return `/materials/${encodeURIComponent(record.materialSlug)}/${encodeURIComponent(record.productTypeSlug)}/${slug}`;
}
