import { loadChinaContent } from "@/china/loader";
import { chineseCopy } from "../../../china/copy";
import type { Metadata } from "next";
import { CalendarClock, Clock, Mail, MapPin, Phone, Printer, QrCode } from "lucide-react";
import { BranchLocationMap, type BranchLocation } from "@/components/BranchLocationMap";
import { ContactNeonHero } from "@/components/ContactNeonHero";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { ConsentControlledMap } from "@/components/ConsentControlledMap";
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
    addressLines: ["PILE KUDAN 4F, 1-14-16 Kudankita,", "Chiyoda-ku, Tokyo 102-0073"],
    phone: site.contact.phone,
    email: site.contact.email,
    lat: 35.696335,
    lng: 139.749207
  },
  {
    country: "CHINA",
    city: "Jiaxing",
    address: "1525 Hexing Road, Jiaxing, Zhejiang, 314001",
    addressLines: ["1525 Hexing Road, Jiaxing,", "Zhejiang, 314001"],
    phone: "+86 (573) 8268 0007",
    email: "info@camari-international.com",
    lat: 30.7522,
    lng: 120.7509
  },
  {
    country: "AUSTRALIA",
    city: "Adelaide",
    address: "L8, 185 Victoria SQ, Adelaide, SA 5000",
    addressLines: ["L8, 185 Victoria SQ,", "Adelaide, SA 5000"],
    phone: "+61 467 875 938",
    email: "k.samreth@camari-international.com",
    lat: -34.9285,
    lng: 138.6007
  },
  {
    country: "ITALY",
    city: "Milan",
    address: "Via Vincenzo Monti 8, 20123 Milan",
    addressLines: ["Via Vincenzo Monti 8,", "20123 Milan"],
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
    title: locale === "zh" ? chineseCopy(`Contact | ${site.name}`) : locale === "en" ? `Contact | ${site.name}` : `お問い合わせ | ${site.name}`,
    description:
      locale === "zh" ? chineseCopy(`Contact ${site.organizationName} for material availability, catalogs, and appointments.`) : locale === "en"
        ? `Contact ${site.organizationName} for material availability, catalogs, and appointments.`
        : `素材在庫、カタログ、予約について ${site.organizationName} へお問い合わせください。`,
    image: categories[0]?.coverImage
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const china = locale === "zh" ? (await loadChinaContent()).settings : undefined;
  const isChina = locale === "zh";
  const contactItems = isChina ? [
    { icon: Mail, label: "邮箱", value: china?.contact.email, href: `mailto:${china?.contact.email}` },
    { icon: Phone, label: "电话", value: china?.contact.phone, href: `tel:${china?.contact.phone?.replace(/[^+\d]/g, "")}` },
    { icon: MapPin, label: "展厅与办公室", value: china?.contact.address, href: null },
    { icon: Clock, label: "营业时间", value: "周一至周六 09:00–17:30", href: null },
  ] : [
    { icon: Mail, label: "メール", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: Phone, label: "電話", value: site.contact.phone, href: `tel:${site.contact.phone.replaceAll(" ", "")}` },
    { icon: Printer, label: "ファクス", value: site.contact.fax, href: null },
    { icon: MapPin, label: "ショールーム・オフィス", value: site.contact.address[locale], href: null },
    { icon: Clock, label: "営業時間", value: "月曜日〜金曜日 9:00–17:00", href: null },
    { icon: CalendarClock, label: "ご来訪予約", value: site.contact.appointmentNotice?.[locale], href: null },
  ];
  const organizationSchema =
    locale === "ja" && siteConfig.siteKey === "japan"
      ? buildLocalBusinessJsonLd(siteConfig, locale)
      : buildOrganizationJsonLd(siteConfig, locale);

  return (
    <main>
      <JsonLd data={organizationSchema} />
      <ContactNeonHero locale={locale} />
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        {locale === "en" ? (
          <BranchLocationMap locations={worldLocations} locale={locale} />
        ) : (
          <>
            <div className="section-shell grid gap-16 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="label-caps text-gold">{isChina ? "联系我们" : "お問い合わせ"}</p>
                <h2 className={`mt-6 font-serif leading-tight ${isChina ? "text-3xl md:text-4xl lg:text-5xl" : "text-4xl md:text-6xl"}`}>
                  {isChina ? "与卡玛瑞团队沟通。" : "カマリ・インターナショナル・ジャパンへ直接ご相談ください。"}
                </h2>
                <p className="mt-8 leading-8 text-muted">
                  {isChina ? "材料咨询或展厅参观预约，欢迎通过邮件电话或微信联系我们。" : "素材に関するご相談やショールームのご予約は、メールまたはお電話にてお問い合わせください。"}
                </p>
              </div>
              <div className="space-y-8 md:col-span-6 md:col-start-7">
                {contactItems.filter((item) => item.value).map((item) => {
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
                {isChina ? (
                  <div className="flex gap-5 border-b border-charcoal/10 pb-7">
                    <QrCode aria-hidden="true" className="mt-1 shrink-0 text-gold" size={20} strokeWidth={1.4} />
                    <div>
                      <p className="label-caps text-muted">微信二维码</p>
                      <div aria-label="微信二维码预留位置" className="mt-4 h-40 w-40 border border-charcoal/15 bg-white" role="img" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="section-shell mt-16">
              <ConsentControlledMap
                src={isChina ? "https://www.amap.com/ssr/embed/place?id=B0FFHCUY2V&name=%E5%8D%A1%E7%8E%9B%E7%91%9E%E5%9B%BD%E9%99%85%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&lng=120.740869&lat=30.799941&address=%E7%A6%BE%E5%85%B4%E5%8C%97%E8%B7%AF1554%E5%8F%B7&zoom=16&source=poi_detail&platform=pc" : "https://www.google.com/maps?q=35.696335%2C139.749207&z=16&output=embed"}
                directUrl={isChina ? "https://www.amap.com/place/B0FFHCUY2V" : "https://www.google.com/maps/search/?api=1&query=35.696335%2C139.749207"}
                provider={isChina ? "amap" : "google"}
                title={isChina ? "卡玛瑞国际有限公司 · 高德地图" : "カマリ・インターナショナル・ジャパン 所在地"}
                className="h-[360px] w-full md:h-[480px] lg:h-[560px]"
              />
              {isChina ? (
                <p className="mt-4 text-right text-sm text-muted">
                  <a className="underline underline-offset-4 hover:text-charcoal" href="https://www.amap.com/place/B0FFHCUY2V" target="_blank" rel="noreferrer">
                    在高德地图中查看位置与路线 ↗
                  </a>
                </p>
              ) : null}
            </div>
            <div className="section-shell mt-20 border-t border-charcoal/10 pt-12 md:mt-28 md:pt-16">
              <p className="label-caps text-gold">{isChina ? "卡玛瑞全球服务网络" : "世界に広がるカマリ"}</p>
              <div className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-3 md:gap-y-2">
                {worldLocations
                  .filter((location) => location.country !== (isChina ? "CHINA" : "JAPAN"))
                  .map((location) => (
                    <address className="grid min-w-0 gap-y-2 not-italic text-muted md:row-span-4 md:grid-rows-subgrid" key={location.country}>
                      <h2 className="mb-3 font-sans text-xl font-semibold leading-none tracking-normal text-charcoal md:text-2xl">
                        {isChina ? chineseCopy(location.country) : japaneseCountryNames[location.country]}
                      </h2>
                        <p className="text-base leading-7 md:text-lg md:leading-8">{isChina ? "地址：" : "住所："}{location.address}</p>
                        <p className="text-base leading-7 md:text-lg md:leading-8">
                          {isChina ? "电话：" : "電話："}
                          <a href={`tel:${location.phone.replaceAll(" ", "")}`}>{location.phone}</a>
                        </p>
                        <p className="break-words text-base leading-7 md:text-lg md:leading-8">
                          {isChina ? "邮箱：" : "メール："}
                          <a href={`mailto:${location.email}`}>{location.email}</a>
                        </p>
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
