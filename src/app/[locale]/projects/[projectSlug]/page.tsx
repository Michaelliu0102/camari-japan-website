import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { createPageMetadata } from "@/lib/metadata";
import { localizedPath, type Locale } from "@/lib/locales";
import { loadMaterial, loadProject, loadProjects } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; projectSlug: string }>;
};

export async function generateStaticParams() {
  const projects = await loadProjects();

  return projects.flatMap((project) => [
    { locale: "en", projectSlug: project.slug },
    { locale: "ja", projectSlug: project.slug }
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, projectSlug } = await params;
  const project = await loadProject(projectSlug);

  if (!project) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: project.seo.title[locale],
    description: project.seo.description[locale],
    image: project.seo.image
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, projectSlug } = await params;
  const project = await loadProject(projectSlug);

  if (!project) {
    notFound();
  }

  const material = await loadMaterial(project.materialSlug);

  return (
    <main className="bg-paper pt-[var(--nav-height)]" data-nav-invert>
      <section className="section-shell grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <p className="label-caps text-gold">{project.industry[locale]}</p>
          <h1 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">{project.title[locale]}</h1>
          <p className="mt-8 text-lg leading-9 text-muted">{project.summary[locale]}</p>
          {material ? (
            <Link
              className="label-caps mt-10 inline-flex items-center gap-4 border border-charcoal/25 px-8 py-5 transition-colors hover:bg-charcoal hover:text-white"
              href={localizedPath(locale, `/materials/${material.slug}`)}
            >
              {locale === "en" ? "View Material" : "素材を見る"} — {material.name[locale]}
            </Link>
          ) : null}
        </div>
        <div className="relative min-h-[560px] md:col-span-7">
          <Image alt={project.title[locale]} className="object-cover" fill priority sizes="(min-width: 768px) 58vw, 100vw" src={project.image} />
        </div>
      </section>

      <section className="bg-stone py-24" data-nav-invert>
        <div className="mx-auto max-w-3xl px-margin-mobile text-center">
          <p className="label-caps text-gold">{locale === "en" ? "Case Notes" : "事例ノート"}</p>
          <p className="mt-8 text-xl leading-10 text-charcoal/75">
            {locale === "en"
              ? "This v1 case template is ready for CMS-driven image galleries, material references, and long-form project text."
              : "この v1 事例テンプレートは、CMS から画像ギャラリー、関連素材、長文プロジェクト本文を管理できる構造です。"}
          </p>
        </div>
      </section>

      <CTASection
        body={locale === "en" ? "Contact CAMARI JAPAN for project-fit material recommendations." : "プロジェクトに適した素材提案についてお問い合わせください。"}
        label={locale === "en" ? "Discuss a Program" : "プログラムを相談する"}
        locale={locale}
        title={locale === "en" ? "Plan a comparable material program." : "同様の素材プログラムを計画する。"}
      />
    </main>
  );
}
