import { getCliClient } from "sanity/cli";
const client = getCliClient({ apiVersion: "2026-06-09" });

const projects = await client.fetch(`*[_type == "projectCase"] {
  slug, title,
  "imageUrl": coverImage.asset->url,
  "galleryImageUrls": gallery[].asset->url,
  materialSlug,
  linkedMaterials, linkedArticles
}`);

console.log(`Found ${projects.length} project cases`);
for (const p of projects) {
  console.log(`\n  slug: ${p.slug}`);
  console.log(`  title.en: ${p.title?.en}`);
  console.log(`  materialSlug: ${p.materialSlug}`);
  console.log(`  imageUrl: ${(p.imageUrl||'NONE').slice(0,80)}`);
  console.log(`  galleryImageUrls: ${(p.galleryImageUrls||[]).length}`);
  console.log(`  linkedMaterials: ${JSON.stringify(p.linkedMaterials)}`);
  console.log(`  linkedArticles: ${JSON.stringify(p.linkedArticles)}`);
}

// Also check which project cases match alcantara
const alcProjects = await client.fetch(`*[_type == "projectCase" && relatedMaterial->slug.current == "alcantara"] {
  slug, "imageUrl": coverImage.asset->url
}`);
console.log(`\nAlcantara project cases: ${alcProjects.length}`);

// Check ALL projects regardless of reference
const allProjects = await client.fetch(`*[_type == "projectCase"] {
  slug,
  "relatedSlug": relatedMaterial->slug.current,
  "imageUrl": coverImage.asset->url
}`);
console.log("\nAll projects with material ref:");
for (const p of allProjects) {
  console.log(`  ${p.slug} → ${p.relatedSlug}: ${(p.imageUrl||'NONE').slice(0,70)}`);
}
