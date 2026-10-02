import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-06-09" });

async function main() {
  const skus = await client.fetch(`*[_type == "sku" && defined(heroImage) && !defined(previewImage)] {
    _id,
    code,
    heroImage
  }`);

  console.log(`Found ${skus.length} SKUs missing previewImage`);

  if (skus.length === 0) {
    console.log("Nothing to fix.");
    return;
  }

  const batchSize = 50;
  for (let i = 0; i < skus.length; i += batchSize) {
    const batch = skus.slice(i, i + batchSize);
    const transaction = client.transaction();
    for (const sku of batch) {
      transaction.patch(sku._id, (p) =>
        p.set({ previewImage: sku.heroImage })
      );
    }
    await transaction.commit();
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} SKUs`);
  }

  // Also fix fabric SKUs that exist from before
  console.log(`Done. Fixed ${skus.length} SKUs.`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
