import Image from "next/image";
import Link from "next/link";
import type { Application, Material, Sku } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type ApplicationGridProps = {
  locale: Locale;
  material: Material;
  skus: Sku[];
};

export function ApplicationGrid({ locale, material, skus }: ApplicationGridProps) {
  const applications =
    material.slug === "vegan-leather"
      ? material.applications.filter((application) => application.slug !== "vinyl")
      : material.applications;
  const gridColumnsClass = applications.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  const defaultHref = () => {
    const firstSku = skus[0];
    return firstSku ? `/materials/${material.slug}/${firstSku.productTypeSlug}/${firstSku.slug}` : `/materials/${material.slug}`;
  };

  function getHref(application: Application): string {
    if (application.productTypeSlug) {
      const matchingSku = skus.find((sku) => sku.productTypeSlug === application.productTypeSlug);
      if (matchingSku) {
        return `/materials/${material.slug}/${application.productTypeSlug}/${matchingSku.slug}`;
      }
      return `/materials/${material.slug}`;
    }
    return defaultHref();
  }

  function getApplicationName(application: Application): string {
    if (locale === "en" && material.slug === "vegan-leather" && application.slug === "microfiber-leather") {
      return "Waterborne Microfiber Leather";
    }

    return application.name[locale];
  }

  function getApplicationMeta(application: Application): string | null {
    return typeof application.colorCount === "number"
      ? locale === "en" ? `${application.colorCount} colours` : `${application.colorCount}色`
      : null;
  }

  return (
    <section className="bg-paper py-24 md:py-36" data-nav-invert>
      <div className="section-shell">
        <div className="mb-16 text-center">
          <h2 className="font-label text-3xl uppercase tracking-[0.12em] md:text-4xl">
            {locale === "en" ? "Article" : "記事"}
          </h2>
          <div className="mx-auto mt-7 h-px w-20 bg-gold" />
        </div>
        <div className={`grid grid-cols-1 gap-gutter sm:grid-cols-2 ${gridColumnsClass}`}>
          {applications.map((application) => (
            <Link className="group" href={localizedPath(locale, getHref(application))} key={application.slug}>
              <div className="relative aspect-square overflow-hidden bg-stone shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-material">
                <Image alt={getApplicationName(application)} className="object-cover transition-transform duration-700 group-hover:scale-110" fill sizes="(min-width: 1024px) 25vw, 50vw" src={application.image} />
              </div>
              <div className="pt-6 text-center">
                <h3 className="label-caps text-charcoal">{getApplicationName(application)}</h3>
                {getApplicationMeta(application) ? <p className="mt-2 text-sm text-muted">{getApplicationMeta(application)}</p> : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
