import type { Metadata } from "next";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const content = {
  en: {
    eyebrow: "Terms of Use",
    title: "Terms of Use / Site Policy",
    description: "Terms, site policy, disclaimer, and copyright information for the CAMARI JAPAN website.",
    intro:
      "Please review these terms before using this website. By browsing CAMARI JAPAN, you agree to use the content responsibly and for legitimate business reference.",
    sections: [
      {
        title: "Use of Content",
        body: "Text, images, layouts, logos, material names, and other website content are provided for reference only and may not be reproduced, distributed, or modified without permission."
      },
      {
        title: "Accuracy",
        body: "We aim to keep material, specification, and availability information accurate, but published content may change without notice. Please confirm final project requirements directly with CAMARI JAPAN."
      },
      {
        title: "External Links",
        body: "This website may include links to external services. CAMARI JAPAN is not responsible for the content, security, or policies of external websites."
      },
      {
        title: "Copyright",
        body: "Copyright © 2026 CAMARI JAPAN. All rights reserved."
      },
      {
        title: "Contact",
        body: `For questions about this site policy, contact ${site.contact.email}.`
      }
    ]
  },
  ja: {
    eyebrow: "利用規約",
    title: "利用規約 / サイトポリシー",
    description: "CAMARI JAPAN ウェブサイトの利用規約、免責事項、著作権について。",
    intro:
      "本ウェブサイトをご利用になる前に、以下の内容をご確認ください。閲覧により、正当な業務上の参照目的で利用することに同意したものとします。",
    sections: [
      {
        title: "コンテンツの利用",
        body: "文章、画像、レイアウト、ロゴ、素材名、その他の掲載内容は参照目的で提供されます。許可なく複製、配布、改変することはできません。"
      },
      {
        title: "掲載情報",
        body: "素材、仕様、在庫等の情報は正確性に配慮していますが、予告なく変更される場合があります。最終的な要件は CAMARI JAPAN へ直接ご確認ください。"
      },
      {
        title: "外部リンク",
        body: "外部サービスへのリンクを含む場合があります。外部サイトの内容、安全性、方針について CAMARI JAPAN は責任を負いません。"
      },
      {
        title: "著作権",
        body: "Copyright © 2026 CAMARI JAPAN. All rights reserved."
      },
      {
        title: "お問い合わせ",
        body: `本サイトポリシーに関するお問い合わせは ${site.contact.email} までご連絡ください。`
      }
    ]
  }
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    intro: string;
    sections: Array<{ title: string; body: string }>;
  }
>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const labels = content[locale];

  return createPageMetadata({
    locale,
    path: "/site-policy",
    title: `${labels.title} | CAMARI JAPAN`,
    description: labels.description
  });
}

export default async function SitePolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const labels = content[locale];

  return (
    <main className="bg-paper" data-nav-invert>
      <section className="section-shell py-28 md:py-40">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label-caps text-gold">{labels.eyebrow}</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">{labels.title}</h1>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-lg leading-9 text-muted">{labels.intro}</p>
            <div className="mt-14 divide-y divide-charcoal/10">
              {labels.sections.map((section) => (
                <section className="grid gap-5 py-8 md:grid-cols-[0.42fr_0.58fr]" key={section.title}>
                  <h2 className="label-caps text-charcoal">{section.title}</h2>
                  <p className="leading-8 text-muted">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
