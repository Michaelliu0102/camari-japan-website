import type { Metadata } from "next";
import { CalendarClock, Clock, Mail, MapPin, Phone, Printer } from "lucide-react";
import { BranchLocationMap, type BranchLocation } from "@/components/BranchLocationMap";
import { ContactNeonHero } from "@/components/ContactNeonHero";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { buildLocalBusinessJsonLd, buildOrganizationJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadMaterialCategories } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const worldLocations: BranchLocation[] = [
  {
    country: "JAPAN",
    city: "Tokyo",
    address: "PILE KUDAN 4F, 1-14-16 Kudankita, Chiyoda-ku, Tokyo 102-0073",
    phone: site.contact.phone,
    email: site.contact.email,
    lat: 35.696335,
    lng: 139.749207
  },
  {
    country: "CHINA",
    city: "Jiaxing",
    address: "1525 Hexing Road, Jiaxing, Zhejiang, 314001",
    phone: "+86 (573) 8268 0007",
    email: "info@camari-international.com",
    lat: 30.7522,
    lng: 120.7509
  },
  {
    country: "AUSTRALIA",
    city: "Adelaide",
    address: "L8, 185 Victoria SQ, Adelaide, SA 5000",
    phone: "+61 467 875 938",
    email: "k.samreth@camari-international.com",
    lat: -34.9285,
    lng: 138.6007
  },
  {
    country: "ITALY",
    city: "Milan",
    address: "Via Vincenzo Monti 8, 20123 Milan",
    phone: "+39 345 722 3340",
    email: "j.russo@camari-international.com",
    lat: 45.4642,
    lng: 9.19
  }
];

const japaneseCountryNames: Record<string, string> = {
  CHINA: "中国",
  AUSTRALIA: "オーストラリア",
  ITALY: "イタリア"
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const categories = await loadMaterialCategories();

  return createPageMetadata({
    locale,
    path: "/contact",
    title: locale === "en" ? `Contact | ${site.name}` : `お問い合わせ | ${site.name}`,
    description:
      locale === "en"
        ? `Contact ${site.organizationName} for material availability, catalogs, and appointments.`
        : `素材在庫、カタログ、予約について ${site.organizationName} へお問い合わせください。`,
    image: categories[0]?.coverImage
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const organizationSchema =
    siteConfig.siteKey === "japan"
      ? buildLocalBusinessJsonLd(siteConfig, locale)
      : buildOrganizationJsonLd(siteConfig, locale);

  return (
    <main>
      <JsonLd data={organizationSchema} />
      <ContactNeonHero locale={locale} />
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        {locale === "en" ? (
          <BranchLocationMap locations={worldLocations} />
        ) : (
          <>
            <div className="section-shell grid gap-16 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="label-caps text-gold">お問い合わせ</p>
                <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
                  カマリ・インターナショナル・ジャパンへ直接ご相談ください。
                </h1>
                <p className="mt-8 leading-8 text-muted">
                  素材に関するご相談やショールームのご予約は、メールまたはお電話にてお問い合わせください。
                </p>
              </div>
              <div className="space-y-8 md:col-span-6 md:col-start-7">
                {[
                  { icon: Mail, label: "メール", value: site.contact.email, href: `mailto:${site.contact.email}` },
                  { icon: Phone, label: "電話", value: site.contact.phone, href: `tel:${site.contact.phone.replaceAll(" ", "")}` },
                  { icon: Printer, label: "ファクス", value: site.contact.fax, href: null },
                  { icon: MapPin, label: "ショールーム・オフィス", value: site.contact.address[locale], href: null },
                  { icon: Clock, label: "営業時間", value: "月曜日〜金曜日 9:00–17:00", href: null },
                  { icon: CalendarClock, label: "ご来訪予約", value: site.contact.appointmentNotice?.[locale], href: null }
                ].map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex gap-5 border-b border-charcoal/10 pb-7">
                      <Icon className="mt-1 shrink-0 text-gold" size={20} strokeWidth={1.4} />
                      <div>
                        <p className="label-caps text-muted">{item.label}</p>
                        <p className="mt-3 text-xl text-charcoal">{item.value}</p>
                      </div>
                    </div>
                  );

                  return item.href ? <a className="block" href={item.href} key={item.label}>{content}</a> : <div key={item.label}>{content}</div>;
                })}
              </div>
            </div>
            <div className="section-shell mt-16">
              <iframe
                src="https://www.google.com/maps?q=35.696335%2C139.749207&z=16&output=embed"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="カマリ・インターナショナル・ジャパン 所在地"
                className="w-full"
              />
            </div>
            <div className="section-shell mt-20 border-t border-charcoal/10 pt-12 md:mt-28 md:pt-16">
              <p className="label-caps text-gold">世界に広がるカマリ</p>
              <div className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-3">
                {worldLocations
                  .filter((location) => location.country !== "JAPAN")
                  .map((location) => (
                    <address className="not-italic text-charcoal" key={location.country}>
                      <h2 className="font-sans text-xl font-semibold leading-none tracking-normal md:text-2xl">
                        {japaneseCountryNames[location.country]}
                      </h2>
                      <div className="mt-5 space-y-2 text-base leading-7 text-muted md:text-lg md:leading-8">
                        <p>住所：{location.address}</p>
                        <p>
                          電話：
                          <a href={`tel:${location.phone.replaceAll(" ", "")}`}>{location.phone}</a>
                        </p>
                        <p className="break-words">
                          メール：
                          <a href={`mailto:${location.email}`}>{location.email}</a>
                        </p>
                      </div>
                    </address>
                  ))}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
