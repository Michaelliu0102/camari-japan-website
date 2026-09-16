import { cookiePolicyZh } from "@/content/policies-zh";
import type { Metadata } from "next";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

type PolicySection = {
  title: string;
  body: string[];
  links?: Array<{ label: string; href: string }>;
};

const englishEntity = "CAMARI INTERNATIONAL LIMITED";
const englishEmail = "info@camari-international.com";

const content = {
  zh: cookiePolicyZh,
  en: {
    eyebrow: "Cookie Policy",
    title: "Cookie Policy",
    updated: "Last updated: August 14, 2026",
    description: `How ${englishEntity} uses cookies, local storage, and optional external media on this website.`,
    intro:
      "This Cookie Policy explains the cookies and similar technologies used on this website, why they are used, and how you can control them. It should be read together with our Privacy Policy.",
    sections: [
      {
        title: "Technologies Covered",
        body: [
          "The term cookies in this policy includes browser cookies, local storage, pixels, and similar storage or access technologies. The website currently uses necessary local storage and, only with your consent, may load Google Maps as optional external media."
        ]
      },
      {
        title: "Necessary Storage",
        body: [
          "We store a first-party local storage entry named camari-consent-v1 to remember whether you allowed optional external media. It contains your external-media preference, the date of your choice, and an expiry date. It is not used for advertising or cross-site tracking and is retained for no longer than approximately six months, unless you clear it sooner or the consent version changes."
        ]
      },
      {
        title: "Optional External Media",
        body: [
          "Google Maps is blocked by default. If you select Allow All Cookies or enable External Media in Cookie Settings, the embedded map is loaded from Google. Google may then receive technical information such as your IP address, browser and device information, and may use cookies or similar technologies for its own purposes under its policies.",
          "If you do not consent, the map remains blocked and you can continue using the rest of the website. A direct link to Google Maps may still be available; opening that link takes you to Google's website."
        ]
      },
      {
        title: "Analytics and Advertising",
        body: [
          "We do not currently use advertising, profiling, social-media tracking, or audience analytics cookies on this website. If this changes, we will update this policy and request any consent required before activating those technologies."
        ]
      },
      {
        title: "Your Choices",
        body: [
          "Select Use Necessary Cookies Only to keep optional external media disabled, or Allow All Cookies to enable it. Cookie Settings lets you make a category-level choice. You can review or withdraw your consent at any time through COOKIE PREFERENCES in the footer. Withdrawing consent prevents future loading of optional media but does not remove data already processed by a third party."
        ]
      },
      {
        title: "Third-Party Information",
        body: [
          "Google controls the cookies and information processing associated with Google Maps. Its retention periods and processing practices are described in its own policies."
        ],
        links: [
          { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
          { label: "How Google Uses Cookies", href: "https://policies.google.com/technologies/cookies" }
        ]
      },
      {
        title: "Changes and Contact",
        body: [
          `We may update this policy when our website or service providers change. Questions about this policy or your privacy choices may be sent to ${englishEntity} at ${englishEmail}.`
        ]
      }
    ] satisfies PolicySection[]
  },
  ja: {
    eyebrow: "Cookie ポリシー",
    title: "Cookie ポリシー",
    updated: "最終更新日：2026年8月14日",
    description: `${site.organizationName} が本ウェブサイトで使用する Cookie、ローカルストレージおよび任意の外部メディアについて。`,
    intro:
      "本 Cookie ポリシーは、本ウェブサイトで使用する Cookie および類似技術、その利用目的、ならびにお客様が設定を管理する方法について説明するものです。プライバシーポリシーと併せてご確認ください。",
    sections: [
      {
        title: "対象となる技術",
        body: [
          "本ポリシーにおける Cookie には、ブラウザ Cookie、ローカルストレージ、ピクセルその他の保存・アクセス技術を含みます。本サイトでは現在、必要なローカルストレージを使用し、お客様が同意した場合に限り、任意の外部メディアとして Google Maps を読み込みます。"
        ]
      },
      {
        title: "必要なストレージ",
        body: [
          "任意の外部メディアを許可したかどうかを記憶するため、camari-consent-v1 という名称のファーストパーティー・ローカルストレージを使用します。ここには外部メディアの設定、選択日および有効期限が保存されます。広告やサイト横断的な追跡には使用せず、お客様が早く削除した場合または同意バージョンが変更された場合を除き、保存期間は最長でおよそ6か月です。"
        ]
      },
      {
        title: "任意の外部メディア",
        body: [
          "Google Maps は初期状態では読み込まれません。「すべての Cookie を許可」を選択するか、Cookie 設定で外部メディアを有効にすると、Google から埋め込み地図が読み込まれます。その際、Google が IP アドレス、ブラウザ、デバイス情報等の技術情報を受信し、同社のポリシーに基づいて Cookie 等を使用する場合があります。",
          "同意しない場合も、地図以外のウェブサイト機能は引き続き利用できます。Google Maps への直接リンクを開いた場合は、Google のウェブサイトへ移動します。"
        ]
      },
      {
        title: "アクセス解析および広告",
        body: [
          "現在、本サイトでは広告、プロファイリング、ソーシャルメディア追跡またはアクセス解析を目的とする Cookie を使用していません。将来これらを導入する場合は、本ポリシーを更新し、必要に応じて有効化前に同意を取得します。"
        ]
      },
      {
        title: "設定の管理",
        body: [
          "「必要な Cookie のみ使用」を選ぶと、任意の外部メディアは無効のままになります。「すべての Cookie を許可」を選ぶと外部メディアが有効になります。詳細は Cookie 設定で管理でき、フッターの「COOKIE 設定」からいつでも同意内容の確認または撤回が可能です。同意の撤回により以後の外部メディア読み込みは停止しますが、第三者がすでに処理した情報まで削除されるものではありません。"
        ]
      },
      {
        title: "第三者サービス",
        body: [
          "Google Maps に関連する Cookie および情報処理は Google が管理します。保存期間および処理内容については、Google の各ポリシーをご確認ください。"
        ],
        links: [
          { label: "Google プライバシーポリシー", href: "https://policies.google.com/privacy?hl=ja" },
          { label: "Google による Cookie の利用", href: "https://policies.google.com/technologies/cookies?hl=ja" }
        ]
      },
      {
        title: "改定およびお問い合わせ",
        body: [
          `ウェブサイトまたはサービス提供者の変更に応じて、本ポリシーを更新する場合があります。本ポリシーまたはプライバシー設定に関するお問い合わせは ${site.organizationName}（${site.contact.email}）までご連絡ください。`
        ]
      }
    ] satisfies PolicySection[]
  }
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    updated: string;
    description: string;
    intro: string;
    sections: PolicySection[];
  }
>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const labels = content[locale];

  return createPageMetadata({
    locale,
    path: "/cookie-policy",
    title: labels.title,
    description: labels.description
  });
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const labels = content[locale];

  return (
    <main className="bg-paper" data-nav-invert>
      <section className="section-shell py-28 md:py-40">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label-caps text-gold">{labels.eyebrow}</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">{labels.title}</h1>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">{labels.updated}</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-lg leading-9 text-muted">{labels.intro}</p>
            <div className="mt-14 divide-y divide-charcoal/10">
              {labels.sections.map((section) => (
                <section className="grid gap-5 py-8 md:grid-cols-[0.36fr_0.64fr]" key={section.title}>
                  <h2 className="label-caps text-charcoal">{section.title}</h2>
                  <div className="space-y-4 leading-8 text-muted">
                    {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.links?.length ? (
                      <ul className="space-y-2 pt-1">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <a
                              className="underline decoration-charcoal/25 underline-offset-4 transition-colors hover:text-gold"
                              href={link.href}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
