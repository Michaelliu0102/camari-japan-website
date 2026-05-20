import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const copy = {
  en: {
    eyebrow: "Sitemap",
    title: "Sitemap",
    description: "A structured overview of key CAMARI JAPAN website pages.",
    sections: [
      {
        title: "Company",
        links: [
          { label: "Home", href: "/" },
          { label: "Company Profile", href: "/about" },
          { label: "Contact Us", href: "/contact" }
        ]
      },
      {
        title: "Collections",
        links: [
          { label: "Materials", href: "/materials" },
          { label: "OEM / ODM", href: "/oem-odm" },
          { label: "Projects", href: "/projects" },
          { label: "Downloads", href: "/downloads" },
          { label: "Media", href: "/media" }
        ]
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms of Use / Site Policy", href: "/site-policy" }
        ]
      }
    ]
  },
  ja: {
    eyebrow: "サイトマップ",
    title: "サイトマップ",
    description: "CAMARI JAPAN ウェブサイトの主要ページ一覧。",
    sections: [
      {
        title: "Company",
        links: [
          { label: "Home", href: "/" },
          { label: "会社概要", href: "/about" },
          { label: "お問い合わせ", href: "/contact" }
        ]
      },
      {
        title: "Collections",
        links: [
          { label: "素材", href: "/materials" },
          { label: "OEM / ODM", href: "/oem-odm" },
          { label: "事例", href: "/projects" },
          { label: "ダウンロード", href: "/downloads" },
          { label: "メディア", href: "/media" }
        ]
      },
      {
        title: "Legal",
        links: [
          { label: "プライバシーポリシー", href: "/privacy-policy" },
          { label: "利用規約 / サイトポリシー", href: "/site-policy" }
        ]
      }
    ]
  }
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    sections: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
  }
>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const labels = copy[locale];

  return createPageMetadata({
    locale,
    path: "/sitemap",
    title: `${labels.title} | CAMARI JAPAN`,
    description: labels.description
  });
}

export default async function SitemapPage({ params }: PageProps) {
  const { locale } = await params;
  const labels = copy[locale];

  return (
    <main className="bg-paper" data-nav-invert>
      <section className="section-shell py-28 md:py-40">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label-caps text-gold">{labels.eyebrow}</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">{labels.title}</h1>
          </div>
          <div className="grid gap-12 md:col-span-7 md:col-start-6">
            {labels.sections.map((section) => (
              <section className="border-t border-charcoal/10 pt-7" key={section.title}>
                <h2 className="label-caps text-charcoal">{section.title}</h2>
                <ul className="mt-6 grid gap-4 text-lg text-muted sm:grid-cols-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link className="transition-colors hover:text-gold" href={localizedPath(locale, link.href)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
