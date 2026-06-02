import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { buildLocalBusinessJsonLd, buildOrganizationJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadMaterialCategories } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

const worldLocations = [
  {
    country: "CHINA",
    address: "1525 Hexing Rd, Jiaxing, Zhejiang",
    phone: "+86 (573) 8268 0007",
    email: "info@camari-international.com"
  },
  {
    country: "AUSTRALIA",
    address: "L8, 185 Victoria SQ, Adelaide, SA 5000",
    phone: "+61 467 875 938",
    email: "k.samreth@camari-international.com"
  },
  {
    country: "ITALY",
    address: "Via V.Monti 8, 20138 Milan",
    phone: "+39 345 722 3340",
    email: "j.russo@camari-international.com"
  }
];

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
  const categories = await loadMaterialCategories();
  const heroCategory = categories[0];
  const organizationSchema = siteConfig.siteKey === "japan" ? buildLocalBusinessJsonLd(siteConfig) : buildOrganizationJsonLd(siteConfig);

  return (
    <main>
      <JsonLd data={organizationSchema} />
      {heroCategory ? <PageHero image={heroCategory.coverImage} subtitle={locale === "en" ? "Direct contact for material and sales inquiries" : "素材・営業に関する直接のお問い合わせ"} title="Contact" /> : null}
      <section className="bg-paper py-24 md:py-36" data-nav-invert>
        <div className="section-shell grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label-caps text-gold">Contact</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              {locale === "en" ? `Speak directly with ${site.organizationName}.` : `${site.organizationName} へ直接ご相談ください。`}
            </h1>
            <p className="mt-8 leading-8 text-muted">
              {locale === "en" ? "There is no inquiry form in v1. Please use direct email or phone contact for material questions and showroom appointments." : "v1 では問い合わせフォームを設置していません。素材に関するご相談やショールーム予約は、メールまたは電話でご連絡ください。"}
            </p>
          </div>
          <div className="space-y-8 md:col-span-6 md:col-start-7">
            {[
              { icon: Mail, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
              { icon: Phone, label: "Phone", value: site.contact.phone, href: `tel:${site.contact.phone.replaceAll(" ", "")}` },
              { icon: MapPin, label: "Showroom & Office", value: site.contact.address[locale], href: null }
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.2190681844904!2d139.7465886761085!3d35.69622637258232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c6a434665ff%3A0xf42a369a2d1fb59!2s1-ch%C5%8Dme-14-16%20Kudankita%2C%20Chiyoda%20City%2C%20Tokyo%20102-0073%2C%20Japan!5e0!3m2!1sen!2sus!4v1779262577002!5m2!1sen!2sus"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${site.organizationName} Office Location`}
            className="w-full"
          />
          {locale === "en" ? (
            <div className="mt-16 border-t border-charcoal/10 pt-12 md:mt-20 md:pt-16">
              <p className="label-caps text-gold">Camari in the world</p>
              <div className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-3">
                {worldLocations.map((location) => (
                  <address className="not-italic text-charcoal" key={location.country}>
                    <h2 className="font-sans text-xl font-semibold uppercase leading-none tracking-normal md:text-2xl">
                      {location.country}
                    </h2>
                    <div className="mt-4 space-y-2 text-base leading-7 text-muted 2xl:text-lg 2xl:leading-8">
                      <p>ADD: {location.address}</p>
                      <p>TEL: {location.phone}</p>
                      <p>E-MAIL: {location.email}</p>
                    </div>
                  </address>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
