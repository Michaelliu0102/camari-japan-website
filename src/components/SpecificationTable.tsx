import type { Sku } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type SpecificationTableProps = {
  locale: Locale;
  sku: Sku;
};

const specificationFields = [
  {
    key: "thickness",
    aliases: ["thickness"],
    label: { en: "THICKNESS", ja: "厚み" }
  },
  {
    key: "unit-weight",
    aliases: ["unit weight", "weight"],
    label: { en: "UNIT WEIGHT", ja: "単位重量" }
  },
  {
    key: "width",
    aliases: ["width"],
    label: { en: "WIDTH", ja: "幅" }
  },
  {
    key: "breaking-load",
    aliases: ["breaking load"],
    label: { en: "BREAKING LOAD", ja: "破断荷重" }
  },
  {
    key: "wear-resistance",
    aliases: ["wear resistance", "martindale"],
    label: { en: "WEAR RESISTANCE", ja: "耐摩耗性" }
  },
  {
    key: "to-light",
    aliases: ["to light", "lightfastness"],
    label: { en: "TO LIGHT", ja: "耐光性" }
  },
  {
    key: "to-rubbery",
    aliases: ["to rubbings", "to rubbery", "rub fastness"],
    label: { en: "TO RUBBERY", ja: "摩擦堅牢度" }
  },
  {
    key: "fr-version",
    aliases: ["fr version", "fr"],
    label: { en: "FR VERSION", ja: "FR 仕様" }
  }
] as const;

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}

export function SpecificationTable({ locale, sku }: SpecificationTableProps) {
  const maintenanceItems = sku.downloads.filter((download) => download.type === "care");
  const specMap = new Map(sku.specs.map((spec) => [normalizeLabel(spec.label.en), spec.value]));
  const specificationRows = specificationFields.map((field) => {
    const matchingValue = field.aliases
      .map((alias) => specMap.get(alias))
      .find((value): value is NonNullable<typeof value> => Boolean(value));

    return {
      key: field.key,
      label: field.label[locale],
      value:
        matchingValue?.[locale] ??
        matchingValue?.en ??
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
              {sku.certifications.map((certification, index) => (
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
                  <div className={infoRowClassName} key={item.href}>
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
