import Image from "next/image";

type PageHeroProps = {
  contentClassName?: string;
  eyebrow?: string;
  title: string;
  titleClassName?: string;
  subtitle?: string;
  image: string;
  imagePosition?: string;
};

export function PageHero({ contentClassName = "", eyebrow, title, titleClassName = "display-caps", subtitle, image, imagePosition = "center" }: PageHeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal text-center text-white">
      <Image alt="" className="object-cover" fill priority sizes="100vw" src={image} style={{ objectPosition: imagePosition }} />
      <div aria-hidden="true" className="absolute inset-0 bg-charcoal opacity-60 md:hidden" />
      <div className={`relative z-10 min-w-0 max-w-full px-margin-mobile py-[calc(var(--nav-height)+2rem)] ${contentClassName}`}>
        {eyebrow ? <p className="label-caps mb-6 text-white md:text-white/80">{eyebrow}</p> : null}
        <h1 className={`${titleClassName} break-words text-[clamp(1.75rem,8vw,3rem)] leading-tight md:text-8xl md:leading-none`}>{title}</h1>
        {subtitle ? <p className="label-caps mx-auto mt-8 max-w-3xl text-white md:text-white/85">{subtitle}</p> : null}
      </div>
    </section>
  );
}
