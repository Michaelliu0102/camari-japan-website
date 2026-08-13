import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { GlobalNav } from "@/components/GlobalNav";
import { siteConfig } from "@/lib/site-config";
import LocaleHomePage, { generateMetadata as generateLocaleHomeMetadata } from "./[locale]/page";

function defaultLocaleParams() {
  return Promise.resolve({ locale: siteConfig.defaultLocale });
}

export function generateMetadata(): Promise<Metadata> {
  return generateLocaleHomeMetadata({ params: defaultLocaleParams() });
}

export default async function RootPage() {
  const locale = siteConfig.defaultLocale;

  return (
    <>
      <GlobalNav locale={locale} />
      {await LocaleHomePage({ params: defaultLocaleParams() })}
      <Footer locale={locale} />
    </>
  );
}
