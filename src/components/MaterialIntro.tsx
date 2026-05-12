import Image from "next/image";
import type { Material } from "@/lib/content";
import type { Locale } from "@/lib/locales";

type MaterialIntroProps = {
  locale: Locale;
  material: Material;
};

export function MaterialIntro({ locale, material }: MaterialIntroProps) {
  return (
    <section className="bg-stone py-24 md:py-36">
      <div className="section-shell grid gap-16 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">{material.introTitle[locale]}</h2>
          <div className="my-8 h-px w-20 bg-gold" />
          <p className="max-w-xl text-base leading-8 text-muted md:text-lg">{material.introBody[locale]}</p>
          <p className="mt-8 max-w-xl font-serif text-xl italic leading-8 text-charcoal/70">{material.quote[locale]}</p>
        </div>
        <div className="relative min-h-[520px] md:col-span-6 md:col-start-7">
          <Image alt={material.name[locale]} className="object-cover shadow-material" fill sizes="(min-width: 768px) 48vw, 100vw" src={material.introImage} />
          <div className="absolute -bottom-8 -left-8 -z-10 h-52 w-52 border border-gold/30" />
        </div>
      </div>
    </section>
  );
}
