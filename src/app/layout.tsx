import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { formatPageTitle, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.siteUrl}/`),
  title: formatPageTitle(siteConfig.slogan[siteConfig.defaultLocale]),
  description: siteConfig.description[siteConfig.defaultLocale]
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={siteConfig.defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
