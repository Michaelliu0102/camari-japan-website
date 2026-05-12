import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/locales";

type CTASectionProps = {
  locale: Locale;
  title: string;
  body: string;
  href?: string;
  label?: string;
  tone?: "dark" | "light";
};

export function CTASection({ locale, title, body, href = "/contact", label = "Contact Sales", tone = "dark" }: CTASectionProps) {
  const isDark = tone === "dark";

  return (
    <section className={isDark ? "bg-charcoal text-white" : "bg-stone text-charcoal"}>
      <div className="section-shell flex flex-col items-start gap-10 py-24 md:flex-row md:items-end md:justify-between md:py-36">
        <div>
          <p className={isDark ? "label-caps text-white/55" : "label-caps text-muted"}>CAMARI JAPAN</p>
          <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{title}</h2>
          <p className={isDark ? "mt-6 max-w-2xl leading-8 text-white/70" : "mt-6 max-w-2xl leading-8 text-muted"}>{body}</p>
        </div>
        <Link
          className={isDark ? "label-caps inline-flex items-center gap-4 border border-white/35 px-8 py-5 transition-colors hover:bg-white hover:text-charcoal" : "label-caps inline-flex items-center gap-4 border border-charcoal/25 px-8 py-5 transition-colors hover:bg-charcoal hover:text-white"}
          href={localizedPath(locale, href)}
        >
          {label}
          <ArrowRight size={15} strokeWidth={1.4} />
        </Link>
      </div>
    </section>
  );
}
