/* eslint-disable @next/next/no-page-custom-font -- App Router root layout; China pages intentionally omit external fonts. */
import { headers } from "next/headers";
import { isChinaBuild, isChinaPreview, chinaSiteUrl } from "@/china/config";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ConsentProvider } from "@/components/ConsentManager";
import { SmoothScroll } from "@/components/SmoothScroll";
import { formatPageTitle, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(isChinaBuild ? chinaSiteUrl : `${siteConfig.siteUrl}/`),
  title: formatPageTitle(siteConfig.slogan[siteConfig.defaultLocale], siteConfig.defaultLocale),
  description: siteConfig.description[siteConfig.defaultLocale],
  icons: {
    icon: [
      { url: "/uploads/logo/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/uploads/logo/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/uploads/logo/favicon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/uploads/logo/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const china = isChinaBuild || (isChinaPreview && (await headers()).get("x-camari-site") === "china");
  return (
    <html lang={china ? "zh-CN" : siteConfig.defaultLocale}>
      {!china ? <head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@500;600;700&family=Noto+Sans+JP:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cinzel:wght@400;500&display=swap" /></head> : null}
      <body>
        {<ConsentProvider defaultLocale={china ? "zh" : siteConfig.defaultLocale}>
          <SmoothScroll />
          {children}
        </ConsentProvider>}
      </body>
    </html>
  );
}
