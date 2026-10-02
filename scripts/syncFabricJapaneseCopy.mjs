import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";

nextEnv.loadEnvConfig(process.cwd());

const apply = process.argv.includes("--apply");
const slugs = [
  "bmw-tartan",
  "bmw-houndstooth",
  "mercedes-houndstooth",
  "vw-tartan",
  "ferrari-technical",
];
const previouslyAddedNames = new Set(slugs.slice(0, 4));
const catalog = JSON.parse(await readFile("src/data/product-catalog.generated.json", "utf8"));
const desired = new Map(slugs.map((slug) => {
  const productType = catalog.productTypes.find((item) => item.slug === slug);
  if (!productType?.summary?.ja?.trim() || !productType.name?.ja?.trim()) {
    throw new Error(`Missing local Japanese copy for ${slug}`);
  }
  return [slug, productType];
}));

if (!process.env.SANITY_AUTH_TOKEN) throw new Error("SANITY_AUTH_TOKEN is required");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-06-09",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_AUTH_TOKEN,
});

// Sanity errors may contain request headers. Print only a safe status or code.
process.on("uncaughtException", (error) => {
  console.error(error.statusCode ?? error.code ?? "Sanity sync failed");
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.error(error.statusCode ?? error.code ?? "Sanity sync failed");
  process.exit(1);
});

const docs = await client.fetch(
  '*[_type == "productType" && slug.current in $slugs]{_id,_rev,"slug":slug.current,name,summary}',
  { slugs },
);
if (docs.length !== slugs.length || new Set(docs.map((doc) => doc.slug)).size !== slugs.length) {
  throw new Error("Expected one published Sanity document per product type");
}

const updates = docs.map((doc) => {
  const source = desired.get(doc.slug);
  if (doc.name?.en !== source.name.en || doc.summary?.en !== source.summary.en) {
    throw new Error(`English source mismatch for ${doc.slug}`);
  }
  const fields = {};
  if (previouslyAddedNames.has(doc.slug) && doc.name?.ja !== source.name.ja) {
    fields["name.ja"] = source.name.ja;
  }
  if (doc.summary?.ja !== source.summary.ja) {
    fields["summary.ja"] = source.summary.ja;
  }
  return { doc, fields };
}).filter(({ fields }) => Object.keys(fields).length);

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  updates: updates.map(({ doc, fields }) => ({ slug: doc.slug, fields: Object.keys(fields) })),
}, null, 2));

if (apply && updates.length) {
  let transaction = client.transaction();
  for (const { doc, fields } of updates) {
    transaction = transaction.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set(fields));
  }
  await transaction.commit();
}

if (apply) {
  const after = await client.fetch(
    '*[_type == "productType" && slug.current in $slugs]{"slug":slug.current,name,summary}',
    { slugs },
  );
  for (const slug of slugs) {
    const doc = after.find((item) => item.slug === slug);
    const source = desired.get(slug);
    if (doc?.summary?.ja !== source.summary.ja || (previouslyAddedNames.has(slug) && doc.name?.ja !== source.name.ja)) {
      throw new Error(`Sanity verification failed for ${slug}`);
    }
  }
  console.log("Verified 5 Japanese summaries and 4 Japanese product names in Sanity.");
}
