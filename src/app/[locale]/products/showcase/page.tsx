import { redirect } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductShowcaseRedirect({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : {};
  const rawCategory = query.category;
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  const productsPath = localizedPath(locale, "/products");

  redirect(category ? `${productsPath}?category=${encodeURIComponent(category)}` : productsPath);
}
