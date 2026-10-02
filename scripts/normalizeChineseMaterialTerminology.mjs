import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

process.on("uncaughtException", error => { console.error(error.message); process.exit(1); });
nextEnv.loadEnvConfig(process.cwd());
const apply = process.argv.includes("--apply");
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-05-12", useCdn: false, perspective: "raw",
};
const client = process.env.SANITY_AUTH_TOKEN
  ? createClient({ ...config, token: process.env.SANITY_AUTH_TOKEN })
  : getCliClient({ apiVersion: config.apiVersion }).withConfig(config);
const docs = await client.fetch('*[!(_type match "sanity.*") && !(_id in path("_.**"))]');
const changes = [];
for (const doc of docs) {
  const fields = {};
  const after = structuredClone(doc);
  function visit(value, target, fieldPath = "", chinese = doc._type === "chinaSite") {
    if (!value || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
      if (key.startsWith("_") || /^(slug|url|href|src|image|heroImage|coverImage|file|asset)$/.test(key)) continue;
      const localized = key === "en" || key === "ja" ? false : chinese || key === "zh";
      const nextPath = Array.isArray(value) ? `${fieldPath}[${key}]` : fieldPath ? `${fieldPath}.${key}` : key;
      if (localized && typeof item === "string" && item.includes("素材")) {
        fields[nextPath] = item.replaceAll("素材", "材料");
        target[key] = fields[nextPath];
      } else if (item && typeof item === "object") visit(item, target[key], nextPath, localized);
    }
  }
  visit(doc, after);
  if (Object.keys(fields).length) changes.push({ doc, after, fields });
}
const backup = path.resolve("outputs/chinese-terminology", String(Date.now()));
fs.mkdirSync(backup, { recursive: true });
fs.writeFileSync(`${backup}/before.json`, JSON.stringify(changes.map(c => c.doc), null, 2));
fs.writeFileSync(`${backup}/patches.json`, JSON.stringify(changes.map(c => ({ id: c.doc._id, fields: c.fields })), null, 2));
console.log(JSON.stringify({ apply, scanned: docs.length, documents: changes.length, fields: changes.reduce((n,c)=>n+Object.keys(c.fields).length,0), backup }));
if (apply && changes.length) {
  for (let offset = 0; offset < changes.length; offset += 50) {
    const batch = changes.slice(offset, offset + 50);
    let tx = client.transaction();
    for (const {doc,fields} of batch) tx = tx.patch(doc._id, p => p.ifRevisionId(doc._rev).set(fields));
    await tx.commit();
  }
  const saved = await client.fetch('*[_id in $ids]', { ids: changes.map(c=>c.doc._id) });
  fs.writeFileSync(`${backup}/after.json`, JSON.stringify(saved, null, 2));
  for (const {doc,after} of changes) {
    const result = saved.find(item=>item._id===doc._id);
    assert.ok(result, `Missing document: ${doc._id}`);
    // Compare every content field, including all English and Japanese values.
    const content = value => Object.fromEntries(Object.entries(value).filter(([key])=>!key.startsWith("_")));
    assert.deepEqual(content(result), content(after), `Unexpected change: ${doc._id}`);
  }
  console.log(`Verified ${saved.length} documents; other languages and fields preserved.`);
}
