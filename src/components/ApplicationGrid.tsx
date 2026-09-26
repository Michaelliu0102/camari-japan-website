import { chineseCopy } from "../china/copy";
import Image from "next/image";
import Link from "next/link";
import type { Application, Material, Sku } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type ApplicationGridProps = {
  locale: Locale;
  material: Material;
  skus: Sku[];
  skaiArticleCount?: number;
};

export function ApplicationGrid({ locale, material, skus, skaiArticleCount }: ApplicationGridProps) {
  const applications =
    material.slug === "vegan-leather"
      ? [
          ...material.applications.filter((application) => application.slug !== "vinyl"),
          ...(locale !== "ja"
            ? [{
                slug: "vinyl",
                name: { zh: chineseCopy("SKAI VINYL"), en: "SKAI VINYL", ja: "SKAI VINYL" },
                image: "/uploads/veganleather/skai.svg",
                productTypeSlug: "vinyl",
              }]
            : []),
        ]
      : material.applications;
  const gridColumnsClass = applications.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  const defaultHref = () => {
    const firstSku = skus[0];
    return firstSku ? `/materials/${material.slug}/${firstSku.productTypeSlug}` : `/materials/${material.slug}`;
  };

  function getHref(application: Application): string {
    if (locale !== "ja" && material.slug === "vegan-leather" && application.slug === "vinyl") {
      return "/materials/vegan-leather/skai";
    }

    if (application.productTypeSlug) {
      const matchingSku = skus.find((sku) => sku.productTypeSlug === application.productTypeSlug);
      if (matchingSku) {
        return `/materials/${material.slug}/${application.productTypeSlug}`;
      }
      return `/materials/${material.slug}`;
    }
    return defaultHref();
  }

  function getApplicationName(application: Application): string {
    if (locale !== "ja" && material.slug === "vegan-leather" && application.slug === "microfiber-leather") {
      return "AQUAPELLE Microfiber Leather";
    }

    return application.name[locale];
  }

  function getApplicationMeta(application: Application): string | null {
    if (material.slug === "vegan-leather" && application.slug === "vinyl" && typeof skaiArticleCount === "number") {
      return `${skaiArticleCount} ${skaiArticleCount === 1 ? "article" : "articles"}`;
    }
    return typeof application.colorCount === "number"
      ? locale === "zh" ? chineseCopy(`${application.colorCount} colours`) : locale === "en" ? `${application.colorCount} colours` : `${application.colorCount}色`
      : null;
  }

  return (
    <section className="bg-paper py-24 md:py-36" data-nav-invert>
      <div className="section-shell">
        <div className="mb-16 text-center">
          <h2 className="font-label text-3xl uppercase tracking-[0.12em] md:text-4xl">
            {locale === "zh" ? chineseCopy("Article") : locale === "en" ? "Article" : "記事"}
          </h2>
          <div className="mx-auto mt-7 h-px w-20 bg-gold" />
        </div>
        <div className={`grid grid-cols-1 gap-gutter sm:grid-cols-2 ${gridColumnsClass}`}>
          {applications.map((application) => (
            <Link className="group" href={localizedPath(locale, getHref(application))} key={application.slug}>
              <div className={`relative aspect-square overflow-hidden shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-material ${material.slug === "vegan-leather" && application.slug === "vinyl" ? "bg-white" : "bg-stone"}`}>
                <Image alt={getApplicationName(application)} className={`${material.slug === "vegan-leather" && application.slug === "vinyl" ? "object-contain p-[18%]" : "object-cover"} transition-transform duration-700 group-hover:scale-110`} fill sizes="(min-width: 1024px) 25vw, 50vw" src={application.image} />
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
