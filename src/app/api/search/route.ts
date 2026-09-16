import { isLocale } from "@/lib/locales";
import { loadChinaContent } from "@/china/loader";
import { chinaRecordPath } from "@/china/content";
import { NextRequest, NextResponse } from "next/server";
import { loadMaterialCategories, loadMaterials, loadProjects, loadSkus } from "@/sanity/lib/loaders";

export async function GET(request: NextRequest) {
  const language = request.nextUrl.searchParams.get("locale") ?? "en";
  const locale = isLocale(language) ? language : "en";
  let allowed: Set<string>|undefined;
  if(locale === "zh" && process.env.NODE_ENV !== "development") {
    const content = await loadChinaContent();
    if(!content.siteReady)return NextResponse.json({results:[]});
    allowed = new Set(content.records.map(chinaRecordPath).filter((path):path is string=>Boolean(path)));
  }
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (q.length < (locale === "zh" ? 1 : 2)) {
    return NextResponse.json({ results: [] });
  }

  const [categories, materials, skus, projects] = await Promise.all([
    loadMaterialCategories(),
    loadMaterials(),
    loadSkus(locale),
    loadProjects(),
  ]);

  const results: Array<{
    label: string;
    sub: string;
    href: string;
  }> = [];

  for (const m of materials) {
    const nameEn = m.name.en.toLowerCase();
    const nameJa = m.name.ja.toLowerCase();
    if (nameEn.includes(q) || nameJa.includes(q) || (m.name.zh??"").toLowerCase().includes(q)) {
      results.push({
        label: m.name[locale],
        sub: `${locale === "zh" ? "材料" : "Material"} — ${categories.find((c) => c.slug === m.categorySlug)?.name[locale] ?? ""}`,
        href: `/materials/${m.slug}`
      });
    }
  }

  for (const s of skus) {
    const code = s.code.toLowerCase();
    const nameEn = s.colorName?.en?.toLowerCase() ?? "";
    const nameJa = s.colorName?.ja?.toLowerCase() ?? "";
    if (code.includes(q) || nameEn.includes(q) || nameJa.includes(q) || (s.colorName?.zh??"").toLowerCase().includes(q)) {
      results.push({
        label: s.colorName?.[locale] ? `${s.code} — ${s.colorName[locale]}` : s.code,
        sub: `SKU`,
        href: `/materials/${s.materialSlug}/${s.productTypeSlug}/${s.slug}`
      });
    }
  }

  for (const p of projects) {
    const titleEn = p.title.en.toLowerCase();
    const titleJa = p.title.ja.toLowerCase();
    const industryEn = p.industry.en.toLowerCase();
    const industryJa = p.industry.ja.toLowerCase();
    if (titleEn.includes(q) || titleJa.includes(q) || industryEn.includes(q) || industryJa.includes(q) || (p.title.zh??"").toLowerCase().includes(q) || (p.industry.zh??"").toLowerCase().includes(q)) {
      results.push({
        label: p.title[locale],
        sub: `${locale === "zh" ? "案例" : "Project"} — ${p.industry[locale]}`,
        href: `/projects/${p.slug}`
      });
    }
  }

  return NextResponse.json({ results: results.filter(item=>!allowed||allowed.has(item.href)).slice(0, 8) });
}
