import type { Material } from "@/lib/content";
import type { Locale } from "@/lib/locales";
import { MaterialIntroImage } from "@/components/MaterialIntroImage";

type MaterialIntroProps = {
  locale: Locale;
  material: Material;
};

export function MaterialIntro({ locale, material }: MaterialIntroProps) {
  const introParagraphs = material.introBody[locale].split(/\n{2,}/).filter(Boolean);
  const quote = material.quote[locale].trim();

  return (
    <section className="bg-stone py-24 md:py-36" data-nav-invert>
      <div className="section-shell grid gap-16 md:grid-cols-12 md:items-stretch">
        <div className="md:col-span-5 md:self-center">
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">{material.introTitle[locale]}</h2>
          <div className="my-8 h-px w-20 bg-gold" />
          <div className="max-w-xl space-y-5 text-base leading-8 text-muted md:text-lg">
            {introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {quote ? <p className="mt-8 max-w-xl font-serif text-xl italic leading-8 text-charcoal/70">{quote}</p> : null}
        </div>
        <div className="relative md:col-span-6 md:col-start-7">
          <MaterialIntroImage alt={material.name[locale]} src={material.introImage} />
          <div className="absolute -bottom-8 -left-8 -z-10 h-52 w-52 border border-gold/30" />
        </div>
      </div>
    </section>
  );
}
