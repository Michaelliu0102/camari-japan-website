import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.SANITY_AUTH_TOKEN) throw new Error("SANITY_AUTH_TOKEN is required");
const apply = process.argv.includes("--apply");
const catalog = JSON.parse(await readFile("src/data/product-catalog.generated.json", "utf8"));
const productType = catalog.productTypes.find((item) => item.slug === "verona");
const skus = catalog.skus.filter((item) => item.productTypeSlug === "verona");
if (productType?.name?.ja !== "ヴェロナ" || skus.length !== 68) {
  throw new Error("Unexpected local Verona catalog");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-06-09",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_AUTH_TOKEN,
});
// Sanity errors can contain request headers. Never print the raw error.
for (const event of ["uncaughtException", "unhandledRejection"]) {
  process.on(event, (error) => {
    console.error(error.statusCode ?? error.code ?? "Sanity sync failed");
    process.exit(1);
  });
}

const docs = await client.fetch(`*[
  (_type == "productType" && slug.current == "verona") ||
  (_type == "sku" && productType->slug.current == "verona") ||
  (_type == "material" && slug.current == "leather")
]{_id,_rev,_type,"slug":slug.current,name,summary,seo,colorName,code,applications}`);
const types = docs.filter((doc) => doc._type === "productType");
const cmsSkus = docs.filter((doc) => doc._type === "sku");
const materials = docs.filter((doc) => doc._type === "material");
if (types.length !== 1 || cmsSkus.length !== skus.length || materials.length !== 1) {
  throw new Error(`Expected 1 product type, ${skus.length} SKUs and 1 material in Sanity`);
}
const sourceSkus = new Map(skus.map((sku) => [sku.slug, sku]));
const corrected = (value) => typeof value === "string"
  ? value.replaceAll("ヴェローナ", "ヴェロナ")
  : value;
const updates = docs.map((doc) => {
  if (doc._type === "material") {
    const matches = doc.applications?.flatMap((application, index) =>
      application._key === "verona" && application.productTypeSlug === "verona"
        ? [{ application, index }]
        : []);
    if (matches?.length !== 1 || matches[0].application.name?.en !== "Verona") {
      throw new Error("Unexpected Sanity Verona application");
    }
    const { application, index } = matches[0];
    return { doc, fields: application.name.ja === "ヴェロナ"
      ? {} : { [`applications[${index}].name.ja`]: "ヴェロナ" } };
  }
  const source = doc._type === "productType" ? productType : sourceSkus.get(doc.slug);
  if (!source || (doc._type === "sku" && doc.code !== source.code)) {
    throw new Error(`Unexpected Sanity Verona document: ${doc.slug}`);
  }
  const fields = {};
  if (doc._type === "productType" && doc.name?.ja !== "ヴェロナ") {
    fields["name.ja"] = "ヴェロナ";
  }
  for (const key of ["summary.ja", "seo.title.ja", "seo.description.ja"]) {
    const value = key.split(".").reduce((part, segment) => part?.[segment], doc);
    if (corrected(value) !== value) fields[key] = corrected(value);
  }
  return { doc, fields };
}).filter(({ fields }) => Object.keys(fields).length);

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  productTypeCount: types.length,
  skuCount: cmsSkus.length,
  materialCount: materials.length,
  updates: updates.length,
  fields: updates.reduce((counts, { fields }) => {
    for (const key of Object.keys(fields)) counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {}),
}, null, 2));
if (apply && updates.length) {
  let transaction = client.transaction();
  for (const { doc, fields } of updates) {
    transaction = transaction.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set(fields));
  }
  await transaction.commit();
}
if (apply) {
  const after = await client.fetch(`*[
    (_type == "productType" && slug.current == "verona") ||
    (_type == "sku" && productType->slug.current == "verona") ||
    (_type == "material" && slug.current == "leather")
  ]{_id,name,summary,seo,applications}`);
  if (after.length !== docs.length || after.some((doc) =>
    JSON.stringify([doc.name?.ja, doc.summary?.ja, doc.seo?.title?.ja, doc.seo?.description?.ja])
      .includes("ヴェローナ"))) {
    throw new Error("Sanity verification failed");
  }
  if (after.find((doc) => doc._id === types[0]._id)?.name?.ja !== "ヴェロナ") {
    throw new Error("Sanity Verona name verification failed");
  }
  if (after.find((doc) => doc._id === materials[0]._id)?.applications
    ?.find((application) => application._key === "verona")?.name?.ja !== "ヴェロナ") {
    throw new Error("Sanity Verona application verification failed");
  }
  console.log("Verified Verona Japanese name and related Japanese copy in Sanity.");
}
