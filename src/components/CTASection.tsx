import Image from "next/image";
import Link from "next/link";
import { CTAMessageDrawer } from "@/components/CTAMessageDrawer";
import { localizedPath, type Locale } from "@/lib/locales";

type CTASectionProps = {
  locale: Locale;
  title: string;
  body: string;
  eyebrow?: string | null;
  label?: string;
  href?: string;
  secondaryLabel?: string;
  secondaryAction?: "link" | "message";
  secondaryHref?: string;
  tone?: "dark" | "light";
  backgroundImage?: string;
};

export function CTASection({ locale, title, body, eyebrow = "Showroom", label = "Contact Sales", href = "/contact", secondaryLabel, secondaryAction = "link", secondaryHref = "/contact", tone = "dark", backgroundImage }: CTASectionProps) {
  const isDark = tone === "dark";
  const outlineClass = isDark
    ? "inline-flex min-h-[4.5rem] items-center justify-center gap-4 border border-white/35 px-10 text-center label-caps transition-colors hover:bg-white hover:text-charcoal"
    : "inline-flex min-h-[4.5rem] items-center justify-center gap-4 border border-charcoal/25 px-10 text-center label-caps transition-colors hover:bg-charcoal hover:text-white";
  const primaryClass = "inline-flex min-h-[4.5rem] items-center justify-center gap-4 bg-gold px-10 text-center label-caps text-charcoal transition-colors hover:bg-gold/80";

  return (
    <section className={`relative overflow-hidden text-white ${!backgroundImage && (isDark ? "bg-charcoal" : "bg-stone text-charcoal")}`} {...(!isDark && !backgroundImage ? { "data-nav-invert": true } : {})}>
      {backgroundImage ? (
        <>
          <Image alt="" className="object-cover" fill priority sizes="100vw" src={backgroundImage} />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        </>
      ) : null}
      <div className="relative z-10 flex min-h-[28rem] flex-col items-center justify-center px-margin-mobile py-16 text-center md:min-h-[30rem] md:px-margin-desktop md:py-20 lg:min-h-[34rem]">
        {eyebrow ? <p className="label-caps text-white/55">{eyebrow}</p> : null}
        <h2 className={`${eyebrow ? "mt-4" : ""} max-w-[24ch] whitespace-pre-line font-serif text-2xl leading-tight md:text-3xl`}>
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-[540px] whitespace-pre-line text-center text-[15px] leading-[1.6] tracking-[0.02em] text-white/85">{body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {secondaryLabel ? (
            secondaryAction === "message" ? (
              <CTAMessageDrawer buttonClassName={primaryClass} buttonLabel={secondaryLabel} locale={locale} />
            ) : (
              <Link className={primaryClass} href={localizedPath(locale, secondaryHref)}>
                {secondaryLabel}
              </Link>
            )
          ) : null}
          <Link className={outlineClass} href={localizedPath(locale, href)}>
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
