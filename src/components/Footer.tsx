import Link from "next/link";
import { site } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/locales";
import { FooterNewsletterForm } from "@/components/FooterNewsletterForm";

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-paper px-margin-mobile py-20 text-charcoal md:px-margin-desktop md:py-28">
      <div className="mx-auto grid max-w-container-max gap-16 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <div className="logo-outline-dark text-5xl uppercase md:text-8xl">CAMARI</div>
          <p className="mt-8 max-w-xl font-serif text-2xl leading-tight md:text-4xl">{site.slogan[locale]}</p>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-muted md:text-base">{site.description[locale]}</p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="label-caps text-muted">Company</h2>
            <ul className="mt-6 space-y-4 text-sm text-charcoal/80">
              <li><Link className="hover:text-gold" href={localizedPath(locale, "/about")}>Heritage</Link></li>
              <li><Link className="hover:text-gold" href={localizedPath(locale, "/oem-odm")}>OEM / ODM</Link></li>
              <li><Link className="hover:text-gold" href={localizedPath(locale, "/projects")}>Projects</Link></li>
              <li><Link className="hover:text-gold" href={localizedPath(locale, "/media")}>Media</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="label-caps text-muted">Contact</h2>
            <ul className="mt-6 space-y-4 text-sm text-charcoal/80">
              <li><a className="hover:text-gold" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
              <li>{site.contact.phone}</li>
              <li>{site.contact.address[locale]}</li>
            </ul>
          </div>
          <FooterNewsletterForm locale={locale} />
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-container-max flex-col gap-5 border-t border-charcoal/10 pt-8 text-[10px] uppercase tracking-[0.28em] text-muted md:flex-row md:items-center md:justify-between">
        <p>© 2026 CAMARI JAPAN</p>
        <p>Tokyo | Milano | London | New York</p>
      </div>
    </footer>
  );
}
