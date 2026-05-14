import type { ProductType, Sku } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type SpecificationTableProps = {
  locale: Locale;
  sku: Sku;
  productType: ProductType;
};

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}

export function SpecificationTable({ locale, sku, productType }: SpecificationTableProps) {
  const maintenanceItems = productType.maintenance.length
    ? productType.maintenance.map((item, index) => ({ ...item, key: `maintenance-${index}` }))
    : sku.downloads
        .filter((download) => download.type === "care")
        .map((download) => ({ title: download.title, description: download.description, key: download.href }));
  const certifications = productType.certifications.length ? productType.certifications : sku.certifications;
  const specMap = new Map(sku.specs.map((spec) => [normalizeLabel(spec.label.en), spec.value]));
  const specificationRows = productType.specTemplate.map((field) => {
    const matchingValue = (field.aliases ?? [field.key])
      .map((alias) => specMap.get(alias))
      .find((value): value is NonNullable<typeof value> => Boolean(value));

    return {
      key: field.key,
      label: field.label[locale],
      value:
        matchingValue?.[locale] ??
        matchingValue?.en ??
        field.defaultValue?.[locale] ??
        field.defaultValue?.en ??
        (locale === "en" ? "ON REQUEST" : "お問い合わせください")
    };
  });
  const sectionTitleClassName = "font-serif text-2xl uppercase tracking-[0.06em]";
  const infoRowClassName = "flex justify-between gap-8 border-b border-charcoal/10 py-5";
  const infoLabelClassName = "label-caps text-[10px] uppercase text-muted";
  const infoValueClassName = "max-w-[55%] text-right text-[0.85rem] leading-relaxed text-charcoal";
  const sectionInnerClassName = "mx-auto max-w-[46rem]";

  return (
    <>
      <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-paper py-20 md:pb-16 md:pt-28" data-nav-invert id="specifications">
        <div className="section-shell">
          <h2 className={sectionTitleClassName}>Specifications</h2>
          <div className={`${sectionInnerClassName} mt-14`}>
            <dl>
              {specificationRows.map((spec) => (
                <div className={infoRowClassName} key={spec.key}>
                  <dt className={infoLabelClassName}>{spec.label}</dt>
                  <dd className={infoValueClassName}>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-paper py-20 md:py-24" data-nav-invert id="certifications">
        <div className="section-shell">
          <h2 className={sectionTitleClassName}>Certifications</h2>
          <div className={`${sectionInnerClassName} mt-14`}>
            <dl>
              {certifications.map((certification, index) => (
                <div className={infoRowClassName} key={certification.en}>
                  <dt className={infoLabelClassName}>
                    {locale === "en" ? `CERTIFICATION ${String(index + 1).padStart(2, "0")}` : `認証 ${String(index + 1).padStart(2, "0")}`}
                  </dt>
                  <dd className={infoValueClassName}>{certification[locale]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-paper py-20 md:pb-28 md:pt-24" data-nav-invert id="maintenance-and-use">
        <div className="section-shell">
          <h2 className={sectionTitleClassName}>Maintenance and use</h2>
          <div className={`${sectionInnerClassName} mt-14`}>
            <dl>
              {maintenanceItems.length > 0 ? (
                maintenanceItems.map((item) => (
                  <div className={infoRowClassName} key={item.key}>
                    <dt className={infoLabelClassName}>{item.title[locale]}</dt>
                    <dd className={infoValueClassName}>{item.description[locale]}</dd>
                  </div>
                ))
              ) : (
                <div className={infoRowClassName}>
                  <dt className={infoLabelClassName}>{locale === "en" ? "GUIDANCE" : "ガイダンス"}</dt>
                  <dd className={infoValueClassName}>
                    {locale === "en"
                      ? "Maintenance guidance is available on request for this finish."
                      : "この仕上げのメンテナンスガイダンスは、ご要望に応じてご案内します。"}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
