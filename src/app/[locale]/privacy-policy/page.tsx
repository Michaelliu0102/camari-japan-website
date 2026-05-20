import type { Metadata } from "next";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const content = {
  en: {
    eyebrow: "Privacy Policy",
    title: "Privacy Policy",
    description: "How CAMARI JAPAN handles personal information received through direct contact and newsletter subscriptions.",
    intro:
      "CAMARI JAPAN handles personal information with care and uses it only for communication, appointment coordination, material inquiries, and website operations.",
    sections: [
      {
        title: "Information We Receive",
        body: "We may receive your name, company, email address, phone number, inquiry details, appointment context, and newsletter subscription information when you contact us directly."
      },
      {
        title: "Purpose of Use",
        body: "Information is used to respond to inquiries, coordinate showroom appointments, provide material guidance, send requested updates, and improve website reliability."
      },
      {
        title: "Third Parties",
        body: "We do not sell personal information. Information may be shared with service providers only when needed for website operation, email delivery, or business communication."
      },
      {
        title: "Contact",
        body: `For privacy questions or correction requests, contact ${site.contact.email}.`
      }
    ]
  },
  ja: {
    eyebrow: "プライバシーポリシー",
    title: "プライバシーポリシー",
    description: "CAMARI JAPAN における個人情報の取り扱いについて。",
    intro:
      "CAMARI JAPAN は、お問い合わせ、ショールーム予約、素材に関するご相談、ニュースレター購読に伴い取得する個人情報を適切に取り扱います。",
    sections: [
      {
        title: "取得する情報",
        body: "お名前、会社名、メールアドレス、電話番号、お問い合わせ内容、予約に関する情報、ニュースレター購読情報等を取得する場合があります。"
      },
      {
        title: "利用目的",
        body: "お問い合わせへの回答、ショールーム予約の調整、素材提案、希望された情報配信、ウェブサイト運営の改善に利用します。"
      },
      {
        title: "第三者提供",
        body: "個人情報を販売することはありません。ウェブサイト運営、メール配信、業務上の連絡に必要な範囲で委託先に共有する場合があります。"
      },
      {
        title: "お問い合わせ",
        body: `個人情報に関するご相談、訂正等のご依頼は ${site.contact.email} までご連絡ください。`
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
    path: "/privacy-policy",
    title: `${labels.title} | CAMARI JAPAN`,
    description: labels.description
  });
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
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
