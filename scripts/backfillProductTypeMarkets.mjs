import { getCliClient } from "sanity/cli";

const DEFAULT_MARKETS = ["global", "japan"];
const BATCH_SIZE = 25;
const shouldCommit = process.argv.includes("--commit");
const client = getCliClient({ apiVersion: "2026-05-12" });

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

const productTypes = await client.fetch(`*[_type == "productType" && !defined(markets)]{ _id }`);

console.log(`Found ${productTypes.length} productType document(s) without markets.`);

if (productTypes.length) {
  for (const productType of productTypes) {
    console.log(`- ${productType._id}`);
  }
}

if (!shouldCommit) {
  console.log("\nDry run only. Re-run with --commit to patch these documents.");
  process.exit(0);
}

let updated = 0;

for (const batch of chunk(productTypes, BATCH_SIZE)) {
  await Promise.all(
    batch.map((productType) =>
      client
        .patch(productType._id)
        .set({ markets: DEFAULT_MARKETS })
        .commit()
    )
  );
  updated += batch.length;
  console.log(`Patched ${updated}/${productTypes.length} productType document(s).`);
}

console.log(`Done. Updated ${updated} productType document(s) with markets: ${DEFAULT_MARKETS.join(",")}.`);
