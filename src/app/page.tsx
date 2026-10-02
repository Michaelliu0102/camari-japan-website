import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isChinaBuild } from "@/china/config";
import { Footer } from "@/components/Footer";
import { GlobalNav } from "@/components/GlobalNav";
import { siteConfig } from "@/lib/site-config";
import LocaleHomePage, { generateMetadata as generateLocaleHomeMetadata } from "./[locale]/page";

function defaultLocaleParams() {
  return Promise.resolve({ locale: siteConfig.defaultLocale });
}

export function generateMetadata(): Promise<Metadata> {
  if (isChinaBuild) return Promise.resolve({ robots: { index: false, follow: false } });
  return generateLocaleHomeMetadata({ params: defaultLocaleParams() });
}

export default async function RootPage() {
  // The China deployment serves its own home through the /zh middleware rewrite.
  if (isChinaBuild) notFound();
  const locale = siteConfig.defaultLocale;

  return (
    <>
      <GlobalNav locale={locale} />
      {await LocaleHomePage({ params: defaultLocaleParams() })}
      <Footer locale={locale} />
    </>
  );
}
