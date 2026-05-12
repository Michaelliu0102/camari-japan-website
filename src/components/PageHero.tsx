import Image from "next/image";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
};

export function PageHero({ eyebrow, title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal text-center text-white">
      <Image alt="" className="object-cover opacity-70 grayscale" fill priority sizes="100vw" src={image} />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 px-margin-mobile">
        {eyebrow ? <p className="label-caps mb-6 text-white/80">{eyebrow}</p> : null}
        <h1 className="display-caps text-5xl leading-none md:text-8xl">{title}</h1>
        {subtitle ? <p className="label-caps mx-auto mt-8 max-w-3xl text-white/85">{subtitle}</p> : null}
      </div>
    </section>
  );
}
