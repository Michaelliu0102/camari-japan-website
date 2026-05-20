import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { site } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";
import { FooterNewsletterForm } from "@/components/FooterNewsletterForm";

type FooterProps = {
  locale: Locale;
};

const footerCopy = {
  en: {
    companyName: "CAMARI JAPAN",
    nav: [
      { label: "Company Profile", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/site-policy" },
      { label: "Contact Us", href: "/contact" },
      { label: "Sitemap", href: "/sitemap" }
    ]
  },
  ja: {
    companyName: "CAMARI JAPAN",
    nav: [
      { label: "会社概要", href: "/about" },
      { label: "プライバシーポリシー", href: "/privacy-policy" },
      { label: "利用規約 / サイトポリシー", href: "/site-policy" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "サイトマップ", href: "/sitemap" }
    ]
  }
} satisfies Record<
  Locale,
  {
    companyName: string;
    nav: Array<{ label: string; href: string }>;
  }
>;

const socialLinks = [
  { label: "X", href: "#", icon: null },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "LinkedIn", href: "#", icon: Linkedin }
];

export function Footer({ locale }: FooterProps) {
  const labels = footerCopy[locale];

  return (
    <footer className="bg-paper px-margin-mobile py-12 text-charcoal md:px-margin-desktop md:py-16">
      <div className="mx-auto max-w-container-max">
        <div className="flex flex-col gap-8 border-b border-charcoal/10 pt-8 pb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pt-12 lg:pb-5">
          <FooterNewsletterForm className="w-full lg:max-w-[42rem]" layout="inline" locale={locale} />

          <div className="flex flex-col items-start lg:items-end lg:text-right">
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center border border-charcoal/15 text-charcoal transition-colors hover:border-gold hover:text-gold"
                    href={item.href}
                    key={item.label}
                  >
                    {Icon ? <Icon size={16} strokeWidth={1.4} /> : <span className="text-xs font-medium">X</span>}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[10px] uppercase tracking-[0.28em] text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 CAMARI JAPAN. ALL RIGHTS RESERVED.</p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3 md:justify-end">
              {labels.nav.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-gold" href={localizedPath(locale, item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
