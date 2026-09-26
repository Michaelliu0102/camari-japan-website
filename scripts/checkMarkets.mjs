import { getCliClient } from "sanity/cli";
const client = getCliClient({ apiVersion: "2026-06-09" });

// Check product type markets
const pts = await client.fetch(`*[_type == "productType"] {
  slug, markets, "materialSlug": material->slug.current
}`);

console.log("Product types with markets:");
for (const pt of pts) {
  console.log(`  ${pt.slug} (${pt.materialSlug}): markets=${JSON.stringify(pt.markets)}`);
}

// Check if SKUs are returned with japan market filter
const japanSkus = await client.fetch(`count(*[_type == "sku" && (!defined(productType->markets) || "japan" in productType->markets)])`);
const globalSkus = await client.fetch(`count(*[_type == "sku" && (!defined(productType->markets) || "global" in productType->markets)])`);
const allSkus = await client.fetch(`count(*[_type == "sku"])`);

console.log(`\nSKU counts: all=${allSkus}, japan-market=${japanSkus}, global-market=${globalSkus}`);
