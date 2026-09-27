import type { ProjectCase } from "./content";

// User-approved canonical records, 2026-09-27. CMS originals stay recoverable.
export const projectAliases: Readonly<Record<string, string>> = {
  "aston-martin-heritage-5362": "leather-aston-martin-heritage-5362",
  "leather-juguar-heritage-5365": "jaguar-heritage-5365",
  "alcantara-louis-vitton-alcantara-master-1234": "louis-vuitton-alcantara-master-1234",
  "alcantara-hd2": "hd2"
};

export function canonicalizeProjects(projects: ProjectCase[]): ProjectCase[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const uniqueLinks = <T extends { slug: string }>(links: T[]) =>
    [...new Map(links.map((link) => [link.slug, link])).values()];

  for (const [alias, canonical] of Object.entries(projectAliases)) {
    const original = bySlug.get(alias);
    const selected = bySlug.get(canonical);
    if (!original || !selected) continue;
    bySlug.set(canonical, {
      ...selected,
      // Keep the selected case’s CMS product associations and display names.
      linkedMaterials: uniqueLinks([...original.linkedMaterials, ...selected.linkedMaterials]),
      projectImages: [...new Set([...selected.projectImages, ...original.projectImages])]
    });
    bySlug.delete(alias);
  }
  return [...bySlug.values()];
}
