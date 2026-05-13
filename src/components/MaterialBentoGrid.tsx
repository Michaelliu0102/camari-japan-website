import Image from "next/image";
import Link from "next/link";
import type { Material, MaterialCategory } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";

type MaterialBentoGridProps = {
  locale: Locale;
  categories: MaterialCategory[];
  materials: Material[];
};

export function MaterialBentoGrid({ locale, categories, materials }: MaterialBentoGridProps) {
  return (
    <section className="bg-paper py-24 md:py-32" data-nav-invert>
      <div className="section-shell grid grid-cols-1 gap-gutter md:grid-cols-12">
        {categories.map((category, index) => {
          const href = materials.some((material) => material.slug === category.slug) ? `/materials/${category.slug}` : "/materials";
          const className =
            index === 0
              ? "md:col-span-8 h-[520px] md:h-[620px]"
              : index === 1
                ? "md:col-span-4 h-[520px] md:h-[620px]"
                : "md:col-span-6 h-[440px]";

          return (
            <Link className={`group relative overflow-hidden ${className}`} href={localizedPath(locale, href)} key={category.slug}>
              <Image alt={category.name[locale]} className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105" fill sizes="(min-width: 768px) 50vw, 100vw" src={category.coverImage} />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
              <div className="absolute bottom-0 left-0 p-8 text-white md:p-12">
                <h2 className="font-serif text-3xl uppercase tracking-luxury md:text-4xl">{category.name[locale]}</h2>
                <p className="label-caps mt-3 text-white/80">{category.tagline[locale]}</p>
                <span className="label-caps mt-8 inline-block border border-white/70 px-8 py-4 transition-colors group-hover:bg-white group-hover:text-charcoal">
                  Explore Texture
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
