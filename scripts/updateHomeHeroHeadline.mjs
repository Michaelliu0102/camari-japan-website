import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

// SDK errors can contain authentication headers; print only the message.
process.on("uncaughtException", (error) => { console.error(error.message); process.exit(1); });
nextEnv.loadEnvConfig(process.cwd());
const apply = process.argv.includes("--apply");
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-05-12", useCdn: false, perspective: "raw"
};
const client = process.env.SANITY_AUTH_TOKEN
  ? createClient({ ...config, token: process.env.SANITY_AUTH_TOKEN })
  : getCliClient({ apiVersion: config.apiVersion }).withConfig(config);
const docs = await client.fetch('*[_type == "homePage"]');
if (!docs.length) throw new Error("No homePage documents found.");
const headline = {
  zh: { title: "臻选材质", subtitle: "万千可能，由此而生" },
  ja: { title: "選び抜かれた素材", subtitle: "ここから広がる、無限の可能性" }
};
const fieldsFor = (doc) => ({
  heroTitle: { ...doc.heroTitle, ...Object.fromEntries(Object.entries(headline).map(([locale, copy]) => [locale, copy.title])) },
  heroSubtitle: { ...doc.heroSubtitle, ...Object.fromEntries(Object.entries(headline).map(([locale, copy]) => [locale, copy.subtitle])) }
});
const changed = docs.filter(doc => Object.entries(headline).some(([locale, copy]) =>
  doc.heroTitle?.[locale] !== copy.title || doc.heroSubtitle?.[locale] !== copy.subtitle
));
console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", documents: changed.map(doc => ({ id: doc._id, fields: fieldsFor(doc) })) }, null, 2));
if (apply && changed.length) {
  const dir = path.resolve("outputs/home-hero-headline", String(Date.now()));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "before.json"), JSON.stringify(changed, null, 2));
  let transaction = client.transaction();
  for (const doc of changed) transaction = transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set(fieldsFor(doc)));
  await transaction.commit();
  const updated = await client.fetch('*[_id in $ids]{_id,heroTitle,heroSubtitle}', { ids: changed.map(doc => doc._id) });
  for (const doc of updated) {
    for (const [locale, copy] of Object.entries(headline)) {
      if (doc.heroTitle?.[locale] !== copy.title || doc.heroSubtitle?.[locale] !== copy.subtitle) throw new Error(`Headline verification failed: ${doc._id}/${locale}`);
    }
    const before = changed.find(item => item._id === doc._id);
    if (doc.heroTitle?.en !== before.heroTitle?.en || doc.heroSubtitle?.en !== before.heroSubtitle?.en) throw new Error(`English headline changed unexpectedly: ${doc._id}`);
  }
  console.log(`Updated and verified ${updated.length} homePage documents. Backup: ${dir}/before.json`);
}
