import { getCliClient } from "sanity/cli";
const client = getCliClient({ apiVersion: "2026-06-09" });

const veronaSkus = await client.fetch(`*[_type == "sku" && productType->slug.current == "verona"] | order(code asc) {
  _id, code, slug, colorName
}[0..10]`);
console.log(`First ${veronaSkus.length} Verona SKUs:`);
for (const s of veronaSkus) {
  console.log(`  ${s.code}: colorName=${JSON.stringify(s.colorName)} slug=${s.slug.current}`);
}

// Also check the Excel data
const allVerona = await client.fetch(`count(*[_type == "sku" && productType->slug.current == "verona"])`);
console.log(`\nTotal Verona SKUs: ${allVerona}`);
