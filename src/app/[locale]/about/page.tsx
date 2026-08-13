import type { Metadata } from "next";
import Image from "next/image";
import { CTASection } from "@/components/CTASection";
import { OemLogoLoop } from "@/components/OemLogoLoop";
import { ShinyHeading } from "@/components/ShinyHeading";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { loadAboutPageSettings, loadHomePageSettings } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const dynamic = "force-dynamic";

const stats = [
  {
    value: "10,000 m²",
    label: "Central warehousing",
    detail: "China & Italy"
  },
  {
    value: "1,500+",
    label: "Material references",
    detail: "Curated colour & surface library"
  },
  {
    value: "4",
    label: "Local office & warehouse",
    detail: "China, Italy, Japan & Australia"
  },
  {
    value: "1",
    label: "Accessories production plant",
    detail: "Customized interior & lifestyle accessories"
  },
  {
    value: "ISO9001",
    label: "Quality management",
    detail: "Certified system"
  },
  {
    value: "IATF16949",
    label: "Automotive quality management",
    detail: "Certified production"
  }
];

const manufacturingCapabilities = [
  {
    title: "Rapid Prototyping & In-House Sampling",
    body: "Located directly within our China headquarters, our dedicated prototyping lab is staffed by specialized technicians and equipped for cutting, perforation, lamination, quilting, and embroidery. Combined with advanced laser processing, digital printing, and 3D printing capabilities, clients can select from over 1,000 in-stock materials to turn custom design concepts into physical samples with minimal lead times.",
    image: "/uploads/about/sampling.jpeg"
  },
  {
    title: "Automotive-Grade Manufacturing",
    body: "Operating under the strict IATF 16949 international automotive quality management system, our facility is engineered for high-volume, uncompromising precision. From raw material inspection to automated CNC cutting, custom surface treatment, and rigorous end-of-line durability testing, we ensure consistency and OEM compliance across every production run.",
    image: "/uploads/about/manufacturing.jpeg"
  },
  {
    title: "Global Logistics & Warehousing",
    body: "Supported by 10,000 m² of central warehousing across China and Italy, alongside strategic regional hubs in Japan and Australia, Camari provides end-to-end supply chain reliability. Our international fulfillment infrastructure guarantees streamlined customs clearance, localized inventory management, and rapid global distribution.",
    image: "/uploads/about/warehouseglobal.jpeg"
  }
];

function splitParagraphs(paragraphs: Array<Record<Locale, string>>, locale: Locale): string[] {
  return paragraphs.flatMap((paragraph) =>
    paragraph[locale]
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const aboutSettings = await loadAboutPageSettings();

  return createPageMetadata({
    locale,
    path: "/about",
    title: locale === "en" ? "About CAMARI | CAMARI INTERNATIONAL JAPAN" : aboutSettings.seo.title[locale],
    description:
      locale === "en"
        ? "Meet CAMARI, a global partner for premium automotive materials, bespoke prototyping, and IATF 16949 certified production."
        : aboutSettings.seo.description[locale],
    image: aboutSettings.seo.image ?? aboutSettings.heroImage
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const [aboutSettings, homeSettings] = await Promise.all([loadAboutPageSettings(), loadHomePageSettings()]);

  if (locale === "en") {
    return (
      <main>
        <section
          className="bg-stone py-24 pt-[calc(var(--nav-height)+6.5rem)] text-charcoal md:py-32 md:pt-[calc(var(--nav-height)+8rem)]"
          data-nav-invert
        >
          <div className="section-shell grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(24rem,0.85fr)] lg:items-center lg:gap-20 xl:gap-24">
            <div className="relative order-2 aspect-[4/3] overflow-hidden bg-paper md:aspect-[3/2] lg:order-1">
              <Image
                alt="CASA CAMARI office and material showroom interior"
                className="object-cover object-center"
                fill
                priority
                sizes="(min-width: 1024px) 62vw, 100vw"
                src="/uploads/about/casa-camari-office.png"
              />
            </div>
            <div className="order-1 max-w-[36rem] lg:order-2 lg:justify-self-end">
              <p className="label-caps text-gold">Company</p>
              <h1 className="mt-5 max-w-[12ch] font-serif text-3xl leading-[1.06] md:text-5xl lg:text-[4.25rem]">
                About CAMARI
              </h1>
              <p className="mt-11 max-w-[39rem] text-[1.02rem] leading-[1.8] text-muted md:text-[1.1rem] md:leading-[1.85]">
                Established in 2014 and headquartered in Hong Kong, Camari International is a multinational leader specializing in high-performance automotive materials, bespoke interior accessories, and lifestyle products. With regional operating hubs in China, Italy, Japan, and Australia, we deliver technical excellence and seamless supply chain solutions to clients worldwide.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-paper py-24 md:py-36" data-nav-invert id="about-company">
          <div className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(28rem,1.2fr)] lg:items-end lg:gap-24">
              <div>
                <p className="label-caps text-gold">Global footprint</p>
                <h2 className="mt-5 max-w-[14ch] font-serif text-3xl leading-[1.06] text-charcoal md:text-5xl">
                  Integrated Supply Infrastructure
                </h2>
              </div>
              <p className="max-w-[42rem] text-[1rem] leading-[1.8] text-muted md:text-[1.08rem]">
                With established corporate entities across four strategic regions, China, Italy, Japan, and Australia, CAMARI unifies regional supply strengths under one seamless export infrastructure. By aggregating localized specialty products into a centralized export channel, we offer global clients direct access to premium regional materials, optimized logistics, and end-to-end supply chain reliability.
              </p>
            </div>

            <div className="mt-16 grid border-y border-charcoal/15 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  className="border-b border-charcoal/15 py-8 last:border-b-0 md:border-r md:px-8 md:py-10 md:even:border-r-0 md:[&:nth-child(5)]:border-b-0 lg:even:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(4)]:border-b-0 lg:[&:nth-child(5)]:border-b-0 lg:[&:nth-child(6)]:border-b-0"
                  key={stat.label}
                >
                  <p className="font-sans text-[clamp(1.7rem,2.6vw,2.85rem)] font-medium leading-none tracking-[0.01em] text-charcoal">
                    {stat.value}
                  </p>
                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-charcoal">{stat.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-[minmax(20rem,0.72fr)_minmax(0,1.28fr)] lg:items-center lg:gap-24">
              <div className="max-w-[32rem]">
                <p className="label-caps text-gold">China · Italy · Japan · Australia</p>
                <h3 className="mt-5 font-serif text-3xl leading-[1.06] text-charcoal md:text-5xl">Local Service & Global Collaboration</h3>
                <p className="mt-7 text-[1rem] leading-[1.8] text-muted">
                  Clients work with specialists in their own market, while CAMARI teams share specifications, sampling feedback, and production planning across borders. Central warehousing in China and Italy keeps material access close to each project and coordination consistent from concept to delivery.
                </p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                <Image
                  alt="CAMARI China warehouse"
                  className="object-cover object-center"
                  fill
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  src="/uploads/about/china-warehouse.jpg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-linen py-24 md:py-36" data-nav-invert>
          <div className="section-shell grid gap-12 lg:grid-cols-[minmax(0,1.24fr)_minmax(23rem,0.76fr)] lg:items-center lg:gap-20">
            <div className="relative aspect-[3/2] overflow-hidden bg-stone">
              <Image
                alt="Alcantara Milan headquarters interior"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                src="/uploads/about/alcantara-milan-headquarters.jpg"
              />
            </div>
            <div className="max-w-[34rem] lg:justify-self-end">
              <p className="label-caps text-gold">Official authorization</p>
              <h2 className="mt-5 font-serif text-3xl leading-[1.06] text-charcoal md:text-5xl">
                Official Distributor of Alcantara<sup className="ml-1 align-super font-sans text-[0.28em]">®</sup>
              </h2>
              <div className="mt-8 space-y-6 text-[1rem] leading-[1.82] text-muted md:text-[1.08rem]">
                <p>
                  As the official Asia-Pacific regional distributor for Alcantara®, Camari supplies authentic premium microfibers to key international markets, including Greater China, Japan, Korea, Southeast Asia, Australia, and New Zealand.
                </p>
                <p>
                  Beyond Alcantara, our material library spans luxury bovine leathers, technical woven fabrics, and synthetic materials tailored for automotive upholstery, marine, aviation, and bespoke interior architecture.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-paper py-24 text-charcoal md:py-36" data-nav-invert>
          <div className="section-shell">
            <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:gap-24">
              <div>
                <p className="label-caps text-gold">Manufacturing</p>
                <h2 className="mt-5 max-w-[14ch] font-serif text-3xl leading-[1.06] md:text-5xl">
                  Heritage Craft, Certified Precision.
                </h2>
              </div>
              <div className="max-w-[46rem] self-end space-y-6 text-[1rem] leading-[1.85] text-muted md:text-[1.08rem]">
                <p>
                  <strong className="font-semibold text-charcoal">SHENGHUA</strong>, Camari&apos;s proprietary manufacturing facility in China, brings a rich heritage of textile craftsmanship dating back to{" "}
                  <strong className="font-semibold text-charcoal">2000</strong>. Originally established as a high-end garment manufacturing hub, the facility underwent a strategic transformation in{" "}
                  <strong className="font-semibold text-charcoal">2014</strong> following the inception of Camari, evolving into a specialized production center for automotive and lifestyle accessory creations.
                </p>
                <p>
                  Today, operating strictly under the{" "}
                  <strong className="font-semibold text-charcoal">IATF 16949 & ISO 9001</strong> quality system and equipped with automated cutting, laser engraving, and custom upholstery machinery, SHENGHUA seamlessly unites decades of refined tailoring expertise with rigorous automotive precision.
                </p>
              </div>
            </div>

            <div className="mt-16 grid gap-12 border-t border-charcoal/15 pt-10 md:mt-24 md:grid-cols-3 md:gap-5 md:pt-12 lg:gap-8">
              {manufacturingCapabilities.map((capability, index) => (
                <article key={capability.title}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                    <Image
                      alt={capability.title}
                      className="object-cover"
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      src={capability.image}
                    />
                  </div>
                  <p className="mt-7 text-[0.68rem] uppercase tracking-[0.24em] text-gold">0{index + 1}</p>
                  <h3 className="mt-3 max-w-[21ch] font-serif text-2xl leading-tight">{capability.title}</h3>
                  <p className="mt-4 max-w-[36rem] text-sm leading-7 text-muted">{capability.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <OemLogoLoop locale={locale} />

        <CTASection
          backgroundImage={homeSettings.showroomBackgroundImage}
          body="Speak with our specialists about material specifications, bespoke prototyping, and bulk production."
          eyebrow={null}
          label="Our location"
          locale={locale}
          secondaryAction="message"
          secondaryLabel="Write message"
          title="Ready to integrate premium materials into your next project?"
        />
      </main>
    );
  }

  const bodyParagraphs = splitParagraphs(aboutSettings.bodyParagraphs, locale);
  const manufacturingParagraphs = splitParagraphs(aboutSettings.manufacturingParagraphs, locale);

  return (
    <main>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[oklch(0.82_0.01_82)] text-[oklch(0.96_0.01_85)]">
        <Image
          alt={aboutSettings.heroAlt[locale]}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={aboutSettings.heroImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(104deg,rgba(92,86,80,0.36)_8%,rgba(92,86,80,0.18)_34%,rgba(92,86,80,0.08)_64%,rgba(92,86,80,0.04)_100%)]" />
        <div className="absolute left-0 right-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(78,72,68,0.42)_0%,rgba(78,72,68,0.18)_58%,rgba(78,72,68,0)_100%)] md:h-36" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,241,0.06)_0%,rgba(248,246,241,0)_42%,rgba(242,239,233,0.18)_78%,rgba(242,239,233,0.72)_100%)]" />
        <div className="section-shell relative z-10 flex w-full pb-32 pt-[calc(var(--nav-height)+3.5rem)] md:pb-36 md:pt-[calc(var(--nav-height)+4.5rem)]">
          <h1 className="about-hero-wordmark max-w-[8ch] text-[2.5rem] leading-[0.96] text-[oklch(0.965_0.008_85)] [text-shadow:0_1px_10px_rgba(48,42,36,0.12)] md:text-[4.1rem] lg:text-[4.8rem]">
            {aboutSettings.heroTitle[locale]}
          </h1>
        </div>
        <a
          className="group absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[oklch(0.48_0.018_78)] transition-opacity hover:opacity-100 md:bottom-8"
          href="#about-company"
        >
          <span className="about-hero-explore text-[0.72rem] opacity-90">{aboutSettings.exploreLabel[locale]}</span>
          <span className="about-hero-explore-line h-14 w-px bg-[linear-gradient(180deg,rgba(103,95,88,0.95)_0%,rgba(103,95,88,0.18)_100%)] transition-transform duration-500 group-hover:scale-y-110" />
        </a>
      </section>
      <section className="bg-paper py-24 md:py-36" data-nav-invert id="about-company">
        <div className="section-shell">
          <div className="max-w-[92rem]">
            <p className="label-caps text-gold">{aboutSettings.bodyLabel[locale]}</p>
            <ShinyHeading
              className="about-copy-title mt-5 text-[2.05rem] leading-[1.04] md:text-[3.25rem] lg:text-[3.7rem]"
              color="#2f2d2a"
              shineColor="#ffffff"
              text={aboutSettings.bodyTitle[locale]}
            />
          </div>
          <div className="mt-14 max-w-[92rem] space-y-10 text-[1.05rem] leading-[1.72] text-muted md:mt-16 md:text-[1.12rem] md:leading-[1.78]">
            {bodyParagraphs.map((paragraph, index) => (
              <p className="max-w-none" key={`${locale}-about-copy-${index}`}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-24 max-w-[92rem] md:mt-32">
            <p className="label-caps text-gold">{aboutSettings.manufacturingLabel[locale]}</p>
            <ShinyHeading
              className="about-copy-title mt-5 text-[2.05rem] leading-[1.04] md:text-[3.25rem] lg:text-[3.7rem]"
              color="#2f2d2a"
              shineColor="#ffffff"
              text={aboutSettings.manufacturingTitle[locale]}
            />
          </div>
          <div className="mt-10 max-w-[92rem] space-y-10 text-[1.05rem] leading-[1.72] text-muted md:mt-12 md:text-[1.12rem] md:leading-[1.78]">
            {manufacturingParagraphs.map((paragraph, index) => (
              <p className="max-w-none" key={`${locale}-about-manufacturing-${index}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
      <OemLogoLoop locale={locale} />
    </main>
  );
}
