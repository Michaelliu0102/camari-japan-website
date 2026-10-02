import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

process.on("uncaughtException", (error) => { console.error(error.message); process.exit(1); });
nextEnv.loadEnvConfig(process.cwd());

const apply = process.argv.includes("--apply");
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-09-21",
  useCdn: false,
  perspective: "raw"
};
const client = process.env.SANITY_AUTH_TOKEN
  ? createClient({ ...config, token: process.env.SANITY_AUTH_TOKEN })
  : getCliClient({ apiVersion: config.apiVersion }).withConfig(config);

const seoTitle = {
  zh: "Alcantara、真皮与面料供应及产品定制｜CAMARI 卡玛瑞",
  en: "Alcantara, Leather & Fabric Supply · Custom Products | CAMARI",
  ja: "アルカンターラ・本革・生地の販売と製品製作｜CAMARI"
};
const chinaSiteTitle = seoTitle.zh;
const documents = await client.fetch(
  '*[_id in ["homePageSettings", "drafts.homePageSettings", "chinaSiteSettings", "drafts.chinaSiteSettings"]]{_id,_rev,_type,seoTitle,siteTitle}'
);
if (!documents.some((document) => document._id === "homePageSettings")) throw new Error("Published homePageSettings document not found.");
if (!documents.some((document) => document._id === "chinaSiteSettings")) throw new Error("Published chinaSiteSettings document not found.");

const fieldsFor = (document) => document._type === "homePage"
  ? { seoTitle }
  : { siteTitle: chinaSiteTitle };
const changed = documents.filter((document) => document._type === "homePage"
  ? Object.entries(seoTitle).some(([locale, title]) => document.seoTitle?.[locale] !== title)
  : document.siteTitle !== chinaSiteTitle
);
console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", changed: changed.map((document) => ({ id: document._id, fields: fieldsFor(document) })) }, null, 2));

if (apply && changed.length) {
  const outputDirectory = path.resolve("outputs/home-seo-titles", String(Date.now()));
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, "before.json"), `${JSON.stringify(changed, null, 2)}\n`);
  let transaction = client.transaction();
  for (const document of changed) {
    transaction = transaction.patch(document._id, (patch) => patch.ifRevisionId(document._rev).set(fieldsFor(document)));
  }
  await transaction.commit();
  const updated = await client.fetch(
    '*[_id in $ids]{_id,_type,seoTitle,siteTitle}',
    { ids: changed.map((document) => document._id) }
  );
  for (const document of updated) {
    if (document._type === "homePage" && Object.entries(seoTitle).some(([locale, title]) => document.seoTitle?.[locale] !== title)) {
      throw new Error(`Homepage SEO title verification failed: ${document._id}`);
    }
    if (document._type === "chinaSite" && document.siteTitle !== chinaSiteTitle) {
      throw new Error(`China homepage SEO title verification failed: ${document._id}`);
    }
  }
  fs.writeFileSync(path.join(outputDirectory, "after.json"), `${JSON.stringify(updated, null, 2)}\n`);
  console.log(`Updated and verified ${updated.length} Sanity documents. Backup: ${outputDirectory}`);
}
