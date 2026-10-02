import { getCliClient } from "sanity/cli";
const client = getCliClient({ apiVersion: "2026-06-09" });

const samples = await client.fetch(`*[_type == "sku"][0..3] {
  _id, code,
  "hasHero": defined(heroImage),
  "hasPreview": defined(previewImage),
  "heroUrl": heroImage.asset->url,
  "previewUrl": previewImage.asset->url
}`);

console.log("SKU samples:");
for (const s of samples) {
  console.log(`  ${s.code}: hasHero=${s.hasHero} hasPreview=${s.hasPreview}`);
  console.log(`    heroUrl: ${(s.heroUrl||'NONE').slice(0,60)}`);
  console.log(`    previewUrl: ${(s.previewUrl||'NONE').slice(0,60)}`);
}

// Count totals
const stats = await client.fetch(`{
  "total": count(*[_type == "sku"]),
  "withPreview": count(*[_type == "sku" && defined(previewImage)]),
  "withHero": count(*[_type == "sku" && defined(heroImage)])
}`);
console.log(`\nTotals: ${stats.total} SKUs, ${stats.withPreview} with previewImage, ${stats.withHero} with heroImage`);
