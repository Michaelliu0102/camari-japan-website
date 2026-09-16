import { chineseCopy } from "../china/copy";
import type { ProductCategory } from "@/content/products/categories";
import type { Locale } from "@/lib/locales";

type ProductCategorySummaryProps = {
  category: ProductCategory;
  locale: Locale;
};

export function ProductCategorySummary({ category, locale }: ProductCategorySummaryProps) {
  const items = category.curvedCarouselImages ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="product-index-heading"
      className="border-t border-charcoal/10 bg-paper"
      data-nav-invert
    >
      <h2 className="sr-only" id="product-index-heading">
        {locale === "zh" ? chineseCopy(`${category.title.en} product index`) : locale === "en" ? `${category.title.en} product index` : `${category.title.ja}製品インデックス`}
      </h2>

      <details className="group/index">
        <summary className="section-shell flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 py-5 font-sans text-charcoal marker:hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-charcoal [&::-webkit-details-marker]:hidden">
          <span className="label-caps">
            {locale === "zh" ? chineseCopy("Collection index") : locale === "en" ? "Collection index" : "製品インデックス"}
          </span>

          <span className="ml-auto flex items-center gap-5 text-[0.68rem] uppercase tracking-[0.18em] text-muted">
            <span>
              {items.length} {locale === "zh" ? chineseCopy("products") : locale === "en" ? "products" : "製品"}
            </span>
            <span
              aria-hidden="true"
              className="inline-flex h-11 w-11 items-center justify-center text-xl font-light leading-none text-charcoal transition-transform duration-500 ease-expo group-open/index:rotate-45"
            >
              +
            </span>
          </span>
        </summary>

        <div className="section-shell pb-12 md:pb-16">
          <p className="max-w-[65ch] pb-8 text-sm leading-7 text-muted md:pb-10">
            {category.description[locale]}
          </p>

          <div className="border-t border-charcoal/10">
            {items.map((item, index) => {
              const description = item.description[locale];
              const customization = item.customizedOption?.[locale];
              const details = item.details.filter((detail) => detail[locale]);

              return (
                <details
                  className="group/item scroll-mt-[calc(var(--nav-height)+2rem)] border-b border-charcoal/10"
                  id={`product-summary-${index}`}
                  key={`${item.src}-${index}`}
                >
                  <summary className="cursor-pointer list-none py-5 marker:hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-charcoal md:py-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.75rem] items-center gap-3 font-sans text-charcoal md:grid-cols-[4rem_minmax(0,1fr)_2.75rem]">
                      <span className="text-[0.66rem] font-medium tabular-nums tracking-[0.18em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base font-medium leading-snug md:text-lg">{item.title[locale]}</span>
                      <span
                        aria-hidden="true"
                        className="inline-flex h-11 w-11 items-center justify-center justify-self-end text-lg font-light leading-none text-muted transition-transform duration-500 ease-expo group-open/item:rotate-45"
                      >
                        +
                      </span>
                    </h3>
                  </summary>

                  <div className="grid gap-7 pb-8 pl-[3.25rem] pr-3 md:grid-cols-12 md:gap-10 md:pb-10 md:pl-20">
                    {description ? (
                      <p className="max-w-[65ch] text-sm leading-7 text-muted md:col-span-5">{description}</p>
                    ) : null}

                    <div className="grid gap-7 md:col-span-6 md:col-start-7 md:grid-cols-2">
                      {details.length ? (
                        <div>
                          <p className="label-caps text-charcoal">{locale === "zh" ? chineseCopy("Details") : locale === "en" ? "Details" : "詳細"}</p>
                          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
                            {details.map((detail) => (
                              <li key={`${detail.en}-${detail.ja}`}>{detail[locale]}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {customization ? (
                        <div>
                          <p className="label-caps text-charcoal">
                            {locale === "zh" ? chineseCopy("Customization") : locale === "en" ? "Customization" : "カスタマイズ"}
                          </p>
                          <p className="mt-4 text-sm leading-7 text-muted">{customization}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </details>
    </section>
  );
}
