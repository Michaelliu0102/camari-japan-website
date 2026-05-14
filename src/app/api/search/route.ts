import { NextRequest, NextResponse } from "next/server";
import { loadMaterialCategories, loadMaterials, loadProjects, loadSkus } from "@/sanity/lib/loaders";
import { locales } from "@/lib/locales";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [categories, materials, skus, projects] = await Promise.all([
    loadMaterialCategories(),
    loadMaterials(),
    loadSkus(),
    loadProjects(),
  ]);

  const results: Array<{
    label: string;
    sub: string;
    href: string;
    localeHrefs: Record<string, string>;
  }> = [];

  for (const m of materials) {
    const nameEn = m.name.en.toLowerCase();
    const nameJa = m.name.ja.toLowerCase();
    if (nameEn.includes(q) || nameJa.includes(q)) {
      results.push({
        label: m.name.en,
        sub: `Material — ${categories.find((c) => c.slug === m.categorySlug)?.name.en ?? ""}`,
        href: `/materials/${m.slug}`,
        localeHrefs: Object.fromEntries(locales.map((l) => [l, `/${l}/materials/${m.slug}`])),
      });
    }
  }

  for (const s of skus) {
    const code = s.code.toLowerCase();
    const nameEn = s.colorName?.en?.toLowerCase() ?? "";
    const nameJa = s.colorName?.ja?.toLowerCase() ?? "";
    if (code.includes(q) || nameEn.includes(q) || nameJa.includes(q)) {
      results.push({
        label: s.colorName?.en ? `${s.code} — ${s.colorName.en}` : s.code,
        sub: `SKU`,
        href: `/materials/${s.materialSlug}/${s.slug}`,
        localeHrefs: Object.fromEntries(locales.map((l) => [l, `/${l}/materials/${s.materialSlug}/${s.slug}`])),
      });
    }
  }

  for (const p of projects) {
    const titleEn = p.title.en.toLowerCase();
    const titleJa = p.title.ja.toLowerCase();
    const industryEn = p.industry.en.toLowerCase();
    const industryJa = p.industry.ja.toLowerCase();
    if (titleEn.includes(q) || titleJa.includes(q) || industryEn.includes(q) || industryJa.includes(q)) {
      results.push({
        label: p.title.en,
        sub: `Project — ${p.industry.en}`,
        href: `/projects/${p.slug}`,
        localeHrefs: Object.fromEntries(locales.map((l) => [l, `/${l}/projects/${p.slug}`])),
      });
    }
  }

  return NextResponse.json({ results: results.slice(0, 8) });
}
