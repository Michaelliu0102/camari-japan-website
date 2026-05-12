import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { projectCases } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: "/projects",
    title: locale === "en" ? "Projects | CAMARI JAPAN" : "事例 | CAMARI JAPAN",
    description: locale === "en" ? "OEM/ODM material cases across automotive, interior, and product spaces." : "自動車、インテリア、プロダクト空間の OEM/ODM 素材事例。",
    image: projectCases[0].image
  });
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main>
      <PageHero image={projectCases[0].image} subtitle={locale === "en" ? "OEM/ODM cases across material, space, and product" : "素材、空間、プロダクトにわたる OEM/ODM 事例"} title="Projects" />
      <section className="bg-paper py-24 md:py-36">
        <div className="section-shell grid gap-gutter md:grid-cols-2">
          {projectCases.map((project) => (
            <Link className="group" href={localizedPath(locale, `/projects/${project.slug}`)} key={project.slug}>
              <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                <Image alt={project.title[locale]} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 768px) 50vw, 100vw" src={project.image} />
              </div>
              <div className="mt-7">
                <p className="label-caps text-gold">{project.industry[locale]}</p>
                <h2 className="mt-4 font-serif text-3xl">{project.title[locale]}</h2>
                <p className="mt-4 leading-8 text-muted">{project.summary[locale]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
