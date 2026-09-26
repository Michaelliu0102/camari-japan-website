import { getCliClient } from "sanity/cli";
const client = getCliClient({ apiVersion: "2026-06-09" });

const pts = await client.fetch(`*[_type == "productType" && markets != null && !("japan" in markets)] {
  _id, slug, markets
}`);

console.log(`Found ${pts.length} product types with markets missing "japan"`);

if (pts.length === 0) {
  console.log("Nothing to fix.");
  process.exit(0);
}

const transaction = client.transaction();
for (const pt of pts) {
  const newMarkets = [...(pt.markets || []), "japan"];
  console.log(`  ${pt.slug}: ${JSON.stringify(pt.markets)} → ${JSON.stringify(newMarkets)}`);
  transaction.patch(pt._id, (p) => p.set({ markets: newMarkets }));
}
await transaction.commit();

console.log(`Done. Fixed ${pts.length} product types.`);
