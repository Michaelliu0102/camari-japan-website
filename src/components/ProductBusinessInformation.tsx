import type { ProductBusinessSettings } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type ProductBusinessInformationProps = {
  content: ProductBusinessSettings;
  locale: Locale;
  variant?: "overview" | "compact";
};

export function ProductBusinessInformation({
  content,
  locale,
  variant = "overview"
}: ProductBusinessInformationProps) {
  if (variant === "compact") {
    return (
      <section className="border-t border-charcoal/10 bg-paper" data-nav-invert>
        <details className="group/business">
          <summary className="section-shell flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 py-5 text-charcoal marker:hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-charcoal [&::-webkit-details-marker]:hidden">
            <span className="label-caps">{content.accordionLabel[locale]}</span>

            <span className="ml-auto flex items-center gap-5">
              <span className="hidden text-right text-xs leading-5 text-muted md:block">
                {content.accordionSummary[locale]}
              </span>
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center text-xl font-light leading-none text-charcoal transition-transform duration-500 ease-expo group-open/business:rotate-45"
              >
                +
              </span>
            </span>
          </summary>

          <div className="section-shell grid gap-6 pb-12 pt-2 md:grid-cols-12 md:gap-10 md:pb-16">
            <h2 className={`font-serif text-2xl leading-tight text-charcoal md:text-3xl ${locale === "zh" ? "whitespace-nowrap md:col-span-6 lg:col-span-5" : "max-w-[16ch] md:col-span-4"}`}>
              {content.title[locale]}
            </h2>
            <p className={`max-w-[72ch] text-sm leading-7 text-muted ${locale === "zh" ? "md:col-span-6 md:col-start-7 lg:col-span-7 lg:col-start-6" : "md:col-span-7 md:col-start-6"}`}>
              {content.body[locale]}
            </p>
          </div>
        </details>
      </section>
    );
  }

  return (
    <section className="border-y border-charcoal/10 bg-paper py-16 md:py-20" data-nav-invert>
      <div className="section-shell grid gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <p className="label-caps text-gold">{content.eyebrow[locale]}</p>
          <h2 className="mt-5 max-w-[16ch] font-serif text-3xl leading-tight text-charcoal md:text-4xl">
            {content.title[locale]}
          </h2>
        </div>
        <p className="max-w-[72ch] text-sm leading-7 text-muted md:col-span-7 md:col-start-6 md:self-end md:text-base md:leading-8">
          {content.body[locale]}
        </p>
      </div>
    </section>
  );
}
