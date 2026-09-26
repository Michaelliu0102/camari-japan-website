import { getCliClient } from "sanity/cli";
const client = getCliClient({ apiVersion: "2026-06-09" });

const projects = await client.fetch(`*[_type == "projectCase"] {
  slug, title,
  "coverUrl": coverImage.asset->url,
  "galleryUrls": gallery[].asset->url,
  "materialSlug": relatedMaterial->slug.current
}`);

console.log(`Found ${projects.length} project cases:`);
for (const p of projects) {
  console.log(`  ${p.slug} (material: ${p.materialSlug}):`);
  console.log(`    cover: ${(p.coverUrl||'NONE').slice(0,80)}`);
  console.log(`    gallery: ${(p.galleryUrls||[]).length} images`);
  for (const url of (p.galleryUrls||[]).slice(0,3)) {
    console.log(`      ${url.slice(0,80)}`);
  }
}
