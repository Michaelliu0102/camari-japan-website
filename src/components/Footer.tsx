import { withChineseCopy } from "../china/copy";
import type { ChinaSiteSettings } from "@/china/content";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/locales";
import { FooterNewsletterForm } from "@/components/FooterNewsletterForm";
import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
import { siteConfig } from "@/lib/site-config";

type FooterProps = {
  locale: Locale;
  chinaSettings?: ChinaSiteSettings;
};

const footerCopy = withChineseCopy({
  en: {
    copyrightName: "CAMARI INTERNATIONAL",
    nav: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Terms of Use", href: "/site-policy" },
      { label: "Contact Us", href: "/contact" },
      { label: "Sitemap", href: "/sitemap" }
    ]
  },
  ja: {
    copyrightName: siteConfig.siteName,
    nav: [
      { label: "プライバシーポリシー", href: "/privacy-policy" },
      { label: "Cookie ポリシー", href: "/cookie-policy" },
      { label: "利用規約 / サイトポリシー", href: "/site-policy" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "サイトマップ", href: "/sitemap" }
    ]
  }
}) satisfies Record<
  Locale,
  {
    copyrightName: string;
    nav: Array<{ label: string; href: string }>;
  }
>;

const socialLinks = (locale: Locale) => [
  { label: "X", href: "#", icon: null, asset: null },
  { label: "Instagram", href: "#", icon: Instagram, asset: null },
  { label: "LinkedIn", href: "#", icon: Linkedin, asset: null },
  { label: "LINE", href: "#", icon: null, asset: "line" },
  { label: "Facebook", href: "#", icon: Facebook, asset: null },
  { label: "YouTube", href: "#", icon: Youtube, asset: null },
  { label: "小红书", href: "#", icon: null, asset: "xiaohongshu" },
  { label: locale === "zh" ? "抖音" : "TikTok", href: "#", icon: null, asset: "tiktok" }
];

export function Footer({ locale, chinaSettings }: FooterProps) {
  const labels = footerCopy[locale];
  const navigation = locale === "zh"
    ? [
        { label: "隐私政策与使用条款", href: "/privacy-policy" },
        ...labels.nav.filter((item) => !["/privacy-policy", "/site-policy"].includes(item.href))
      ]
    : labels.nav;

  return (
    <footer className="bg-paper pt-8 pb-3 text-charcoal md:pt-12 md:pb-3" data-nav-invert>
      <div className="mx-auto max-w-container-max px-4 min-[390px]:px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col gap-8 border-b border-charcoal/10 pb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <FooterNewsletterForm className="w-full lg:max-w-[42rem]" layout="inline" locale={locale} />

          <div className="flex shrink-0 flex-col items-start lg:items-end lg:text-right">
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {socialLinks(locale).map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    aria-label={item.label}
                    className="flex h-11 w-11 items-center md:h-10 md:w-10 justify-center border border-charcoal/15 text-charcoal transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
                    href={item.href}
                    key={item.label}
                    title={item.label}
                  >
                    {Icon ? <Icon aria-hidden="true" size={16} strokeWidth={1.4} /> : item.asset ? (
                      <span
                        aria-hidden="true"
                        className={item.asset === "xiaohongshu" ? "h-[22px] w-[22px] bg-current" : "h-[18px] w-[18px] bg-current"}
                        style={{
                          mask: `url(/uploads/social/${item.asset}.svg) center / contain no-repeat`,
                          WebkitMask: `url(/uploads/social/${item.asset}.svg) center / contain no-repeat`
                        }}
                      />
                    ) : <span aria-hidden="true" className="text-xs font-medium">X</span>}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 pt-3 md:flex-row md:items-center md:justify-between md:gap-8">
          <Link
            aria-label={locale === "zh" ? "CAMARI 首页" : locale === "ja" ? "CAMARI ホーム" : "CAMARI home"}
            className="inline-flex min-h-11 shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
            href={localizedPath(locale, "/")}
          >
            <Image
              alt="CAMARI INTERNATIONAL"
              className="h-auto w-[7rem] min-[360px]:w-[8.5rem] mix-blend-multiply contrast-200 min-[390px]:w-[9.25rem] md:w-[12rem]"
              height={1780}
              sizes="(min-width: 768px) 192px, (min-width: 390px) 148px, (min-width: 360px) 136px, 112px"
              src="/uploads/logo/black-int.png"
              width={4994}
            />
          </Link>
          <div className="flex min-w-0 flex-col gap-3 text-xs uppercase leading-6 tracking-[0.08em] text-muted md:text-[10px] md:leading-5 md:tracking-[0.2em] md:items-end md:text-right">
            <nav aria-label="Footer navigation" className="mobile-footer-links">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:flex sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2 md:justify-end">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link className="transition-colors hover:text-gold" href={localizedPath(locale, item.href)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                {locale === "zh" ? (
                  <>
                    <li>
                      <a className="normal-case transition-colors hover:text-gold" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                        {chinaSettings?.icpNumber || "浙ICP备17003937号-2"}
                      </a>
                    </li>
                    <li><span aria-disabled="true" title="公示链接待补充">电子营业执照</span></li>
                  </>
                ) : null}
                <li>
                  <CookiePreferencesButton locale={locale} />
                </li>
              </ul>
            </nav>
            <p>© 2026 {chinaSettings?.brandName ?? labels.copyrightName}. {locale === "zh" ? "保留所有权利。" : "ALL RIGHTS RESERVED."}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
