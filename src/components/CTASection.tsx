import Image from "next/image";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/locales";

type CTASectionProps = {
  locale: Locale;
  title: string;
  body: string;
  label?: string;
  href?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone?: "dark" | "light";
  backgroundImage?: string;
};

export function CTASection({ locale, title, body, label = "Contact Sales", href = "/contact", secondaryLabel, secondaryHref = "/contact", tone = "dark", backgroundImage }: CTASectionProps) {
  const isDark = tone === "dark";
  const outlineClass = isDark
    ? "inline-flex min-h-[4.5rem] items-center justify-center gap-4 border border-white/35 px-10 text-center label-caps transition-colors hover:bg-white hover:text-charcoal"
    : "inline-flex min-h-[4.5rem] items-center justify-center gap-4 border border-charcoal/25 px-10 text-center label-caps transition-colors hover:bg-charcoal hover:text-white";

  return (
    <section className={`relative overflow-hidden text-white ${!backgroundImage && (isDark ? "bg-charcoal" : "bg-stone text-charcoal")}`} {...(!isDark && !backgroundImage ? { "data-nav-invert": true } : {})}>
      {backgroundImage ? (
        <>
          <Image alt="" className="object-cover" fill priority sizes="100vw" src={backgroundImage} />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        </>
      ) : null}
      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-margin-mobile py-24 text-center md:px-margin-desktop md:py-36">
        <p className="label-caps text-white/55">Showroom</p>
        <h2 className="mt-4 max-w-[16ch] font-serif text-2xl leading-tight md:text-3xl">
          {title}
        </h2>
        <p className="mt-4 max-w-[32rem] text-sm leading-relaxed text-white/65">{body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {secondaryLabel ? (
            <Link className="inline-flex min-h-[4.5rem] items-center justify-center gap-4 bg-gold px-10 text-center label-caps text-charcoal transition-colors hover:bg-gold/80" href={localizedPath(locale, secondaryHref)}>
              {secondaryLabel}
            </Link>
          ) : null}
          <Link className={outlineClass} href={localizedPath(locale, href)}>
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
