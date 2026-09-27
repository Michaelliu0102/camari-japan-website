import { headers } from "next/headers";
import { isChinaBuild, isChinaPreview, chinaSiteUrl } from "@/china/config";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { webFontVariables } from "./fonts";
import { ConsentProvider } from "@/components/ConsentManager";
import { SmoothScroll } from "@/components/SmoothScroll";
import { formatPageTitle, siteConfig } from "@/lib/site-config";
import { previewNoindexEnabled, previewRobots } from "@/lib/preview-indexing";

export const metadata: Metadata = {
  ...(previewNoindexEnabled ? { robots: { ...previewRobots, googleBot: previewRobots } } : {}),
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
    <html className={china ? undefined : webFontVariables} lang={china ? "zh-CN" : siteConfig.defaultLocale}>
      <body>
        {<ConsentProvider defaultLocale={china ? "zh" : siteConfig.defaultLocale}>
          <SmoothScroll />
          {children}
        </ConsentProvider>}
      </body>
    </html>
  );
}
