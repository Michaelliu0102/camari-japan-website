import type { Metadata } from "next";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const privacyEntity = {
  en: {
    name: "Camari International",
    email: site.contact.email
  },
  ja: {
    name: site.organizationName,
    email: site.contact.email
  }
} satisfies Record<Locale, { name: string; email: string }>;

const content = {
  en: {
    eyebrow: "Privacy Policy",
    title: "Privacy Policy",
    updated: "Last updated: July 25, 2026",
    organizationName: privacyEntity.en.name,
    description: `How ${privacyEntity.en.name} handles personal information received from business contacts, inquiries, newsletter subscriptions, and website use.`,
    intro:
      `${privacyEntity.en.name} operates this website as a B2B materials, surface specification, and bespoke production information site. This Privacy Policy explains how we handle personal information relating to customers, prospective customers, suppliers, business partners, and other professional contacts who interact with us through this website, email, newsletter subscriptions, downloads, or business communications. We do not sell physical products through this website, operate an online checkout, process online orders, or collect payment card information online.`,
    sections: [
      {
        title: "Controller",
        body: `${privacyEntity.en.name} is responsible for the personal information collected through this website. Privacy questions and rights requests may be sent to ${privacyEntity.en.email}.`
      },
      {
        title: "Scope",
        body: "This policy applies to this website, contact forms, message forms, newsletter subscription features, email communications, download requests, and business inquiries sent to us by customers, prospective customers, suppliers, business partners, and their representatives. It does not apply to third-party websites that may be linked from this website."
      },
      {
        title: "Website and Business Context",
        body: "This website is for material presentation, project inquiries, showroom and contact information, downloads, and newsletter subscription. It is not an ecommerce store, customer account portal, supplier payment portal, or online purchasing platform. Commercial discussions, quotations, orders, purchasing, or supply arrangements, if any, are handled through direct business communications outside the website."
      },
      {
        title: "Information You Provide",
        body: "We may collect information you choose to provide, including name, business email, phone number, company name, business role, inquiry details, material interests, custom project requirements, project specifications, appointment context, downloaded-resource requests, newsletter subscription information, and supplier or business-partner communication details."
      },
      {
        title: "Automatic Data",
        body: "Like most websites, we may process limited technical data such as IP address, browser type, device information, operating system, referring pages, pages viewed, access times, approximate location derived from technical data, and interaction data. This information is used for security, reliability, performance, diagnostics, and understanding general website usage."
      },
      {
        title: "No Payment Data",
        body: "Because this website does not process online purchases or supplier payments, we do not intentionally collect payment card numbers, bank account details, billing authentication data, or online transaction histories through this website."
      },
      {
        title: "Sensitive Information",
        body: "Please do not submit sensitive personal information, such as government identification numbers, health information, precise financial information, or special-category data, unless we specifically request it for a lawful business purpose."
      },
      {
        title: "Purposes",
        body: "We use personal information to respond to inquiries, evaluate material specifications, prepare bespoke production or project-fit recommendations, coordinate meetings or showroom visits, provide requested downloads or updates, operate the newsletter, maintain business communication records, manage customer, supplier, and business-partner communications, assess potential cooperation opportunities, secure the website, improve reliability, and comply with legal obligations."
      },
      {
        title: "Legal Basis",
        body: "Where a legal basis is required, we process personal information based on one or more of the following: your consent, performance of requested pre-contractual or business communications, our legitimate interest in operating a B2B materials website, responding to professional inquiries, maintaining customer, supplier, and partner relationships, conducting ordinary B2B marketing, securing the website, complying with legal obligations, and protecting rights and business records."
      },
      {
        title: "Newsletter",
        body: "If you subscribe to our newsletter, we use your email address to send material updates, company information, and related announcements. You may request removal from newsletter communications at any time by contacting us or using any unsubscribe method made available in the communication."
      },
      {
        title: "Cookies",
        body: "Our website may use cookies, pixels, local storage, or similar technologies for essential functionality, security, performance, analytics, and user experience. You can manage cookies through your browser settings. Some features may not work as intended if cookies are disabled."
      },
      {
        title: "Service Providers",
        body: "We may share personal information with trusted service providers that support website hosting, content management, security, analytics, email delivery, newsletter management, CRM or business communication, file delivery, and IT operations. Depending on the business context, information may also be accessible to professional advisers, logistics or project-support providers, or other parties involved in responding to a customer, supplier, or partner request. These recipients may process information only as needed for the relevant business purpose, subject to appropriate safeguards."
      },
      {
        title: "Legal Disclosures",
        body: "We may disclose information if required by law, regulation, legal process, government request, or where we believe disclosure is necessary to protect our rights, users, business operations, or the security of this website."
      },
      {
        title: "No Sale",
        body: "We do not sell personal information. We also do not knowingly share personal information for cross-context behavioral advertising through this website. If our practices change, we will update this policy and provide any required choices."
      },
      {
        title: "Retention",
        body: "We keep personal information only for as long as reasonably necessary for the purposes described in this policy, including inquiry handling, business relationship management, website operation, legal compliance, recordkeeping, and dispute resolution. Retention periods may vary depending on the type of information and the applicable business or legal requirement."
      },
      {
        title: "Security",
        body: "We use reasonable administrative, technical, and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure. No method of transmission or storage is completely secure, so we cannot guarantee absolute security."
      },
      {
        title: "International Transfers",
        body: "Because our clients, website infrastructure, and service providers may be located in different countries, information may be processed or stored outside your country of residence. Where required, we use appropriate safeguards or rely on legally recognized transfer mechanisms."
      },
      {
        title: "Your Rights",
        body: "Depending on where you are located, you may have rights to request access, disclosure, correction, deletion, restriction, objection, portability, withdrawal of consent, or information about how personal information is used and shared. These rights may be subject to verification, legal exceptions, and legitimate business requirements, including the need to keep ordinary commercial, compliance, and security records."
      },
      {
        title: "Japan APPI",
        body: "If Japan's Act on the Protection of Personal Information applies, you may request disclosure, correction, addition, deletion, suspension of use, erasure, or suspension of third-party provision of retained personal data, subject to applicable legal conditions."
      },
      {
        title: "EU / UK Notice",
        body: "If EU or UK data protection law applies, you may have rights under applicable data protection law, including access, rectification, erasure, restriction, objection, portability, and the right to lodge a complaint with a supervisory authority. Where processing is based on consent, you may withdraw consent at any time."
      },
      {
        title: "California Notice",
        body: "If California privacy law applies, the categories of personal information we may collect include identifiers, professional or business contact information, internet or network activity, approximate geolocation derived from technical data, and inquiry or communication content. We do not sell personal information or knowingly share it for cross-context behavioral advertising through this website."
      },
      {
        title: "Children",
        body: "This website is intended for business users and is not directed to children. We do not knowingly collect personal information from children."
      },
      {
        title: "Changes",
        body: "We may update this Privacy Policy from time to time to reflect changes to our website, business practices, service providers, or legal requirements. The updated policy will be posted on this page with a revised update date."
      },
      {
        title: "Contact",
        body: `To submit a privacy request or ask questions about this policy, contact ${privacyEntity.en.email}. We may need to verify your identity or authority before responding to certain requests.`
      }
    ]
  },
  ja: {
    eyebrow: "プライバシーポリシー",
    title: "プライバシーポリシー",
    updated: "最終更新日：2026年7月25日",
    organizationName: privacyEntity.ja.name,
    description: `${privacyEntity.ja.name} におけるビジネス上のご連絡、お問い合わせ、ニュースレター登録、ウェブサイト利用に伴う個人情報の取り扱いについて。`,
    intro:
      `${privacyEntity.ja.name} は、B2B 向けの素材紹介、サーフェス仕様検討、カスタムプロダクト相談のために本ウェブサイトを運営しています。本ポリシーは、お客様、見込みのお客様、仕入先、ビジネスパートナーその他の業務上のご担当者が、本ウェブサイト、メール、ニュースレター登録、資料ダウンロード、または業務上のご連絡を通じて当社とやり取りする際の個人情報の取り扱いについて説明するものです。本サイト上で物品販売、オンライン注文、オンライン決済、クレジットカード情報の取得は行いません。`,
    sections: [
      {
        title: "事業者",
        body: `${privacyEntity.ja.name} は、本ウェブサイトを通じて取得する個人情報について責任を負います。個人情報に関するお問い合わせや権利行使のご連絡は ${privacyEntity.ja.email} までお送りください。`
      },
      {
        title: "適用範囲",
        body: "本ポリシーは、本ウェブサイト、問い合わせフォーム、メッセージフォーム、ニュースレター登録、メール連絡、資料ダウンロード依頼、お客様、見込みのお客様、仕入先、ビジネスパートナーおよびそのご担当者から当社へ送信される業務上のお問い合わせに適用されます。本サイトからリンクされる第三者サイトには適用されません。"
      },
      {
        title: "本ウェブサイトおよび業務上の位置づけ",
        body: "本サイトは、素材紹介、プロジェクトのお問い合わせ、ショールーム・連絡先情報、ダウンロード、ニュースレター購読を目的としています。本サイトは、EC サイト、顧客アカウントポータル、仕入先向け決済ポータル、オンライン購買プラットフォームではありません。商談、見積、注文、購買または供給に関する取り決めが発生する場合は、本サイト外の直接の業務連絡を通じて行われます。"
      },
      {
        title: "取得する情報",
        body: "お客様が提供するお名前、勤務先メールアドレス、電話番号、会社名、職務上の役割、お問い合わせ内容、素材への関心、カスタムプロジェクトの要件、プロジェクト仕様、予約に関する情報、資料ダウンロードに関する情報、ニュースレター購読情報、仕入先またはビジネスパートナーとしてのご連絡内容等を取得する場合があります。"
      },
      {
        title: "ウェブサイト利用情報",
        body: "本サイトでは、IP アドレス、ブラウザ種別、デバイス情報、OS、参照元、閲覧ページ、アクセス日時、技術情報から推定されるおおよその所在地、操作情報等の限定的な技術情報を処理する場合があります。これらはセキュリティ、安定性、パフォーマンス、診断、利用状況の把握のために使用します。"
      },
      {
        title: "決済情報なし",
        body: "本サイトではオンライン購入または仕入先への決済を処理しないため、クレジットカード番号、銀行口座情報、決済認証情報、オンライン取引履歴を意図的に取得しません。"
      },
      {
        title: "機微情報",
        body: "法令上の本人確認番号、健康情報、詳細な金融情報、特別な配慮を要する個人情報等の機微情報は、当社が適法な業務目的で明示的に求めた場合を除き、送信しないでください。"
      },
      {
        title: "利用目的",
        body: "お問い合わせへの回答、素材仕様の検討、カスタムプロダクトまたはプロジェクトに適した提案、打ち合わせやショールーム訪問の調整、資料または更新情報の提供、ニュースレター運営、業務連絡記録の保持、お客様、仕入先、ビジネスパートナーとの業務上の連絡管理、協業可能性の検討、ウェブサイトの安全確保、信頼性向上、法令遵守のために利用します。"
      },
      {
        title: "処理の根拠",
        body: "処理の根拠が必要となる場合、当社は、お客様の同意、お客様から依頼された事前の業務連絡または商談対応、B2B 素材サイトの運営、専門的なお問い合わせへの回答、お客様・仕入先・パートナーとの関係維持、通常の B2B マーケティング、ウェブサイトの安全確保、法的義務の遵守、権利および業務記録の保護等に関する正当な利益に基づき個人情報を取り扱います。"
      },
      {
        title: "ニュースレター",
        body: "ニュースレターに登録された場合、素材、会社情報、関連するお知らせを送信するためにメールアドレスを使用します。配信停止をご希望の場合は、当社へのご連絡または配信メール内で提供される方法により、いつでも停止を依頼できます。"
      },
      {
        title: "Cookie 等",
        body: "本サイトでは、基本的なサイト機能、セキュリティ、パフォーマンス、アクセス解析、ユーザー体験のために Cookie、ピクセル、ローカルストレージまたは類似技術を使用する場合があります。Cookie はブラウザ設定で管理できますが、無効化すると一部機能が意図通り動作しない場合があります。"
      },
      {
        title: "委託先",
        body: "当社は、ウェブサイトホスティング、コンテンツ管理、セキュリティ、アクセス解析、メール配信、ニュースレター管理、CRM または業務連絡、ファイル提供、IT 運用を支援する信頼できるサービス提供者に個人情報を共有する場合があります。業務上の内容に応じて、専門アドバイザー、物流またはプロジェクト支援事業者、お客様・仕入先・パートナーからの依頼対応に関与する関係者が情報にアクセスする場合があります。これらの受領者は、該当する業務目的に必要な範囲で、適切な保護措置のもと情報を処理します。"
      },
      {
        title: "法令等に基づく開示",
        body: "法令、規制、法的手続、政府機関からの要請に基づく場合、または当社の権利、利用者、業務運営、本サイトの安全性を保護するために必要と判断する場合、情報を開示することがあります。"
      },
      {
        title: "販売・共有なし",
        body: "当社は個人情報を販売しません。また、本サイトを通じて、クロスコンテキスト行動広告を目的として個人情報を knowingly に共有することはありません。実務が変更された場合、本ポリシーを更新し、必要な選択手段を提供します。"
      },
      {
        title: "保存期間",
        body: "個人情報は、本ポリシーに記載した目的に合理的に必要な期間、またはお問い合わせ対応、取引関係管理、ウェブサイト運営、法令遵守、記録保持、紛争対応に必要な期間に限り保存します。保存期間は情報の種類および業務上・法的要件により異なります。"
      },
      {
        title: "安全管理",
        body: "当社は、個人情報への不正アクセス、紛失、誤用、改ざん、漏えいを防止するため、合理的な管理的、技術的、組織的措置を講じます。ただし、通信または保存方法に完全な安全性を保証するものではありません。"
      },
      {
        title: "国外移転",
        body: "お客様、当社のウェブサイト基盤、またはサービス提供者が異なる国に所在する場合、情報が居住国以外で処理または保存される場合があります。必要な場合、当社は適切な保護措置または法的に認められた移転手段を利用します。"
      },
      {
        title: "お客様の権利",
        body: "お住まいの地域に応じて、個人情報の開示、利用目的の通知、訂正、削除、利用停止、第三者提供停止、処理制限、異議申立て、データポータビリティ、同意撤回、または個人情報の利用・共有方法に関する情報提供を求める権利を有する場合があります。これらの権利は、本人確認、法令上の例外、通常の商業記録、コンプライアンス記録、セキュリティ記録を保持する必要性を含む正当な業務上の要件に従います。"
      },
      {
        title: "日本法/APPI",
        body: "日本の個人情報保護法が適用される場合、保有個人データについて、開示、訂正、追加、削除、利用停止、消去、第三者提供停止等を請求できる場合があります。ただし、法令上の条件および例外に従います。"
      },
      {
        title: "EU/UK 向け通知",
        body: "EU または英国のデータ保護法が適用される場合、アクセス、訂正、消去、制限、異議申立て、ポータビリティ、監督機関への苦情申立て等の権利を有する場合があります。同意に基づく処理については、いつでも同意を撤回できます。"
      },
      {
        title: "カリフォルニア向け通知",
        body: "カリフォルニア州のプライバシー法が適用される場合、当社が取得する可能性のある個人情報のカテゴリーには、識別子、職業上または業務上の連絡先情報、インターネットまたはネットワーク活動、技術情報から推定されるおおよその所在地、お問い合わせまたは通信内容が含まれます。当社は、本サイトを通じて個人情報を販売せず、クロスコンテキスト行動広告を目的として knowingly に共有しません。"
      },
      {
        title: "未成年者",
        body: "本サイトはビジネスユーザーを対象としており、未成年者を対象としていません。当社は、未成年者から個人情報を knowingly に取得しません。"
      },
      {
        title: "改定",
        body: "本プライバシーポリシーは、ウェブサイト、業務内容、委託先、法令等の変更に応じて更新する場合があります。更新後の内容は、改定後の更新日とともに本ページに掲載します。"
      },
      {
        title: "お問い合わせ",
        body: `本ポリシーに関するご質問または個人情報に関する請求は ${privacyEntity.ja.email} までご連絡ください。一定の請求に対応する前に、本人確認または権限確認をお願いする場合があります。`
      }
    ]
  }
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    updated: string;
    organizationName: string;
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
    title: `${labels.title} | ${labels.organizationName}`,
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
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">{labels.updated}</p>
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
