"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

export type ShowcaseProduct = {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  href: string;
};

export type ShowcaseCategory = {
  slug: string;
  label: string;
};

type Showcase4Props = {
  items: ShowcaseProduct[];
  categories: ShowcaseCategory[];
  locale: "en" | "ja";
  initialCategory?: string;
};

export default function Showcase4({ items, categories, locale, initialCategory }: Showcase4Props) {
  const allFilter = locale === "en" ? "All" : "すべて";
  const availableSlugs = useMemo(() => new Set(categories.map((category) => category.slug)), [categories]);
  const [activeFilter, setActiveFilter] = useState(
    initialCategory && availableSlugs.has(initialCategory) ? initialCategory : "all"
  );
  const visibleItems = activeFilter === "all" ? items : items.filter((item) => item.categorySlug === activeFilter);

  return (
    <section className="min-h-screen bg-paper px-margin-mobile pb-28 pt-20 text-charcoal md:px-margin-desktop md:pb-40 md:pt-32" data-nav-invert>
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="border-y border-charcoal/15 py-5 md:flex md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:gap-x-8">
            <span className="label-caps text-muted">{locale === "en" ? "Filter" : "絞り込み"}</span>
            <button
              className={`label-caps border-b pb-1 transition-colors ${activeFilter === "all" ? "border-charcoal text-charcoal" : "border-transparent text-muted hover:text-charcoal"}`}
              onClick={() => setActiveFilter("all")}
              type="button"
            >
              {allFilter}
            </button>
            {categories.map((category) => (
              <button
                className={`label-caps border-b pb-1 text-left transition-colors ${activeFilter === category.slug ? "border-charcoal text-charcoal" : "border-transparent text-muted hover:text-charcoal"}`}
                key={category.slug}
                onClick={() => setActiveFilter(category.slug)}
                type="button"
              >
                {category.label}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted md:mt-0">
            {visibleItems.length} {locale === "en" ? (visibleItems.length === 1 ? "product" : "products") : "製品"}
          </p>
        </div>

        <motion.div layout className="mt-12 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-24">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleItems.map((item) => (
              <motion.a
                animate={{ opacity: 1, y: 0 }}
                className="group block"
                exit={{ opacity: 0, y: 12 }}
                href={item.href}
                initial={{ opacity: 0, y: 12 }}
                key={item.id}
                layout
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-linen">
                  <motion.img
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.035]"
                    loading="lazy"
                    src={item.image}
                  />
                  <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-paper/95 text-charcoal opacity-0 shadow-material transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4 border-b border-charcoal/15 pb-4">
                  <div>
                    <p className="label-caps text-gold">{item.category}</p>
                    <h2 className="mt-2 font-serif text-2xl leading-tight">{item.title}</h2>
                  </div>
                  <span className="mt-1 text-xs tracking-[0.18em] text-muted">{item.id.split("-").at(-1)?.padStart(2, "0")}</span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
