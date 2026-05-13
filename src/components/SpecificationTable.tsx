import type { Sku } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type SpecificationTableProps = {
  locale: Locale;
  sku: Sku;
};

export function SpecificationTable({ locale, sku }: SpecificationTableProps) {
  return (
    <section className="border-t border-charcoal/10 bg-paper py-20 md:py-28" data-nav-invert>
      <div className="section-shell">
        <h2 className="font-serif text-2xl uppercase tracking-[0.06em]">Specifications</h2>
        <div className="mt-14 grid gap-16 md:grid-cols-[1fr_auto] md:gap-24">
          <dl>
            {sku.specs.map((spec) => (
              <div className="flex justify-between gap-8 border-b border-charcoal/10 py-5" key={spec.label.en}>
                <dt className="label-caps text-[10px] text-muted">{spec.label[locale]}</dt>
                <dd className="max-w-[55%] text-right text-[0.85rem] text-charcoal">{spec.value[locale]}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="label-caps text-[10px] text-muted">Certifications</h3>
            <ul className="mt-8 space-y-5">
              {sku.certifications.map((certification) => (
                <li className="border-b border-charcoal/10 pb-5 text-[0.85rem] leading-relaxed text-muted" key={certification.en}>
                  {certification[locale]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
