import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

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
const copy = JSON.parse(fs.readFileSync("src/data/about-page-ja.json", "utf8"));
const ids = ["aboutPage", "drafts.aboutPage"];
const docs = await client.fetch('*[_id in $ids]', { ids });
if (!docs.some(doc => doc._id === "aboutPage")) throw Error("Published About page missing");

const localized = (existing, ja) => ({ ...existing, ja });
function paragraphs(existing = [], incoming, prefix) {
  return Array.from({ length: Math.max(existing.length, incoming.length) }, (_, index) => ({
    ...existing[index],
    _key: existing[index]?._key ?? `${prefix}-${index + 1}`,
    ja: incoming[index] ?? ""
  }));
}
function fieldsFor(doc) {
  return {
    bodyLabel: localized(doc.bodyLabel, copy.intro.label),
    bodyTitle: localized(doc.bodyTitle, copy.intro.title),
    bodySubtitle: localized(doc.bodySubtitle, copy.intro.subtitle),
    bodyParagraphs: paragraphs(doc.bodyParagraphs, copy.intro.paragraphs, "intro"),
    missionLabel: localized(doc.missionLabel, copy.mission.label),
    missionTitle: localized(doc.missionTitle, copy.mission.title),
    missionParagraphs: paragraphs(doc.missionParagraphs, copy.mission.paragraphs, "mission"),
    businessLabel: localized(doc.businessLabel, copy.business.label),
    businessItems: Array.from({ length: Math.max(doc.businessItems?.length ?? 0, copy.business.items.length) }, (_, index) => ({
      ...doc.businessItems?.[index],
      _key: doc.businessItems?.[index]?._key ?? `business-${index + 1}`,
      title: localized(doc.businessItems?.[index]?.title, copy.business.items[index]?.title ?? ""),
      body: localized(doc.businessItems?.[index]?.body, copy.business.items[index]?.body ?? "")
    })),
    manufacturingLabel: localized(doc.manufacturingLabel, copy.factory.label),
    manufacturingTitle: localized(doc.manufacturingTitle, copy.factory.label),
    manufacturingParagraphs: paragraphs(doc.manufacturingParagraphs, copy.factory.paragraphs, "factory")
  };
}
const prepared = docs.map(doc => ({ doc, fields: fieldsFor(doc) }));
const canonical = value => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
const changed = prepared.filter(({ doc, fields }) => Object.entries(fields).some(([key, value]) => canonical(doc[key]) !== canonical(value)));
console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", documents: changed.map(({ doc }) => doc._id), paragraphs: { intro: copy.intro.paragraphs.length, mission: copy.mission.paragraphs.length, factory: copy.factory.paragraphs.length }, businessAreas: copy.business.items.length }, null, 2));
if (!apply || !changed.length) process.exit(0);

const dir = path.join("outputs", "about-japanese-sync", String(Date.now()));
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "before.json"), JSON.stringify(docs, null, 2));
let tx = client.transaction();
for (const { doc, fields } of changed) tx = tx.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set(fields));
await tx.commit();
const after = await client.fetch('*[_id in $ids]', { ids });
for (const { doc, fields } of prepared) {
  const actual = after.find(item => item._id === doc._id);
  if (!actual) throw Error(`Missing document: ${doc._id}`);
  const expected = { ...doc, ...fields };
  // Compare the full document, including untouched English, images, and metadata.
  const withoutRevision = ({ _rev, _updatedAt, ...rest }) => rest;
  if (canonical(withoutRevision(actual)) !== canonical(withoutRevision(expected))) throw Error(`Verification failed: ${doc._id}`);
}
fs.writeFileSync(path.join(dir, "after.json"), JSON.stringify(after, null, 2));
console.log(`Verified About Japanese content; backup: ${dir}/before.json`);
