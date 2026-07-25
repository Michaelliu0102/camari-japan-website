import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { formatPageTitle, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.siteUrl}/`),
  title: formatPageTitle(siteConfig.slogan[siteConfig.defaultLocale]),
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={siteConfig.defaultLocale}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
