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
    }
    return defaultHref();
  }

  return (
    <section className="bg-paper py-24 md:py-36" data-nav-invert>
      <div className="section-shell">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl uppercase tracking-luxury">Applications</h2>
          <div className="mx-auto mt-7 h-px w-20 bg-gold" />
        </div>
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {material.applications.map((application) => (
            <Link className="group" href={localizedPath(locale, getHref(application))} key={application.slug}>
              <div className="relative aspect-square overflow-hidden bg-stone shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-material">
                <Image alt={application.name[locale]} className="object-cover transition-transform duration-700 group-hover:scale-110" fill sizes="(min-width: 1024px) 25vw, 50vw" src={application.image} />
              </div>
              <div className="pt-6 text-center">
                <h3 className="label-caps text-charcoal">{application.name[locale]}</h3>
                <p className="mt-2 text-sm text-muted">{application.colorCount} colours</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
