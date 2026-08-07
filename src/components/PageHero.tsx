import Image from "next/image";

type PageHeroProps = {
  contentClassName?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  imagePosition?: string;
};

export function PageHero({ contentClassName = "", eyebrow, title, subtitle, image, imagePosition = "center" }: PageHeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal text-center text-white">
      <Image alt="" className="object-cover" fill priority sizes="100vw" src={image} style={{ objectPosition: imagePosition }} />
      <div className={`relative z-10 px-margin-mobile ${contentClassName}`}>
        {eyebrow ? <p className="label-caps mb-6 text-white/80">{eyebrow}</p> : null}
        <h1 className="display-caps text-5xl leading-none md:text-8xl">{title}</h1>
        {subtitle ? <p className="label-caps mx-auto mt-8 max-w-3xl text-white/85">{subtitle}</p> : null}
      </div>
    </section>
  );
}
