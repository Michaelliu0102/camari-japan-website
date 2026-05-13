import type { Sku } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type SpecificationTableProps = {
  locale: Locale;
  sku: Sku;
};

export function SpecificationTable({ locale, sku }: SpecificationTableProps) {
  return (
    <>
      <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-paper py-20 md:pb-16 md:pt-28" data-nav-invert id="specifications">
        <div className="section-shell">
          <h2 className="font-serif text-2xl uppercase tracking-[0.06em]">Specifications</h2>
          <dl className="mt-14 scroll-mt-[calc(var(--nav-height)+2rem)]" id="maintenance-and-use">
            {sku.specs.map((spec) => (
              <div className="flex justify-between gap-8 border-b border-charcoal/10 py-5" key={spec.label.en}>
                <dt className="label-caps text-[10px] text-muted">{spec.label[locale]}</dt>
                <dd className="max-w-[55%] text-right text-[0.85rem] text-charcoal">{spec.value[locale]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="scroll-mt-[calc(var(--nav-height)+2rem)] bg-paper pb-20 md:pb-28" data-nav-invert id="certifications">
        <div className="section-shell">
          <div className="max-w-2xl">
            <h2 className="label-caps text-[0.82rem] tracking-[0.45em] text-muted">Certifications</h2>
            <ul className="mt-12 space-y-8">
              {sku.certifications.map((certification) => (
                <li className="border-b border-charcoal/10 pb-8 font-sans text-2xl leading-snug text-muted md:text-[1.8rem]" key={certification.en}>
                  {certification[locale]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
