import type { Sku } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type SpecificationTableProps = {
  locale: Locale;
  sku: Sku;
};

export function SpecificationTable({ locale, sku }: SpecificationTableProps) {
  return (
    <section className="border-t border-charcoal/10 bg-paper py-20">
      <div className="section-shell">
        <div className="mb-12 flex items-baseline gap-12">
          <h2 className="font-serif text-2xl uppercase tracking-luxury">Specifications</h2>
          <div className="hidden h-px flex-1 bg-charcoal/10 md:block" />
        </div>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            {sku.specs.map((spec) => (
              <div className="flex justify-between gap-8 border-b border-charcoal/10 py-5" key={spec.label.en}>
                <span className="label-caps text-muted">{spec.label[locale]}</span>
                <span className="max-w-[55%] text-right text-charcoal">{spec.value[locale]}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="label-caps text-gold">Certifications</h3>
            <ul className="mt-8 space-y-5 text-muted">
              {sku.certifications.map((certification) => (
                <li className="border-b border-charcoal/10 pb-5" key={certification.en}>{certification[locale]}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
