import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const root = process.cwd();
const output = path.join(root, "outputs/catalog-chinese-sanity-20260920");
const apply = process.argv.includes("--apply");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "src/data/product-catalog.generated.json"), "utf8"));

for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: "2026-06-09",
  useCdn: false,
  perspective: "raw"
});

function copy(value) { return structuredClone(value); }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function normalizedId(id) { return id.replace(/^drafts\./, ""); }
function localized(dst, src) {
  if (!src || typeof src.zh !== "string" || !src.zh.trim()) return dst;
  return { ...(dst ?? {}), zh: src.zh };
}
function matchArray(name, source, current, identity, changes, unmatched, fallback) {
  if (!Array.isArray(source) || !source.length) return undefined;
  const original = current;
  if (!Array.isArray(current) || !current.length) {
    if (Array.isArray(fallback) && fallback.length) current = fallback;
    else {
      unmatched.push(`${name}: no existing array (${source.length} source entries)`);
      return undefined;
    }
  }
  const next = copy(current);
  const used = new Set();
  for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
    const item = source[sourceIndex];
    const key = identity(item);
    let index = current.findIndex((candidate, i) => !used.has(i) && key && identity(candidate) === key);
    if (index < 0 && current.length === source.length) index = sourceIndex;
    if (index < 0 || !current[index]) {
      unmatched.push(`${name}: ${key || sourceIndex}`);
      continue;
    }
    used.add(index);
    const dest = next[index];
    for (const field of ["label", "defaultValue", "value", "title", "description", "alt"]) {
      if (item[field]?.zh) dest[field] = localized(dest[field], item[field]);
    }
    if (typeof item.zh === "string" && item.zh.trim()) dest.zh = item.zh;
  }
  if (!same(next, original)) { changes[name] = next; return next; }
  return undefined;
}

const editorialDownloads = {
  "Alcantara Consumer Electronics Colors": ["Alcantara 消费电子配色", "Alcantara 消费电子产品应用配色参考。"],
  "Alcantara Interiors, Marine & Aviation Indoor Colors": ["Alcantara 室内、船艇与航空配色", "Alcantara 室内、船艇与航空应用配色参考。"],
  "Alcantara Automotive Colors": ["Alcantara 汽车内饰配色", "Alcantara 汽车内饰应用配色参考。"],
  "Alcantara Interiors, Marine Outdoor EXO Colors": ["Alcantara 户外 EXO 与船艇配色", "Alcantara 户外 EXO 与船艇外部应用配色参考。"]
};
const editorialCertifications = {
  "REACH compliant": "符合 REACH 要求",
  "RoHS compliant": "符合 RoHS 要求"
};

const documents = await client.fetch('*[_type in ["productType","sku"]]');
const productTypes = catalog.productTypes;
const skus = catalog.skus;
const byId = new Map(documents.map((doc) => [doc._id, doc]));
const sourceById = new Map();
const missing = [];
const ambiguous = [];
for (const source of productTypes) {
  const matched = documents.filter((doc) => doc._type === "productType" && doc.slug?.current === source.slug);
  if (!matched.length) missing.push(`productType:${source.slug}`);
  for (const doc of matched) sourceById.set(doc._id, source);
}
for (const source of skus) {
  const direct = documents.filter((doc) => doc._type === "sku" && doc.slug?.current === source.slug);
  const matched = direct.length ? direct : documents.filter((doc) =>
    doc._type === "sku" && doc.code === source.code &&
    normalizedId(doc.productType?._ref ?? "") === `productType-${source.productTypeSlug}`
  );
  if (!matched.length) missing.push(`sku:${source.slug}`);
  if (matched.length > 2) ambiguous.push(`sku:${source.slug}`);
  for (const doc of matched) {
    const previous = sourceById.get(doc._id);
    if (previous && previous !== source) ambiguous.push(`sku:${source.slug}`);
    sourceById.set(doc._id, source);
  }
}
assert.equal(missing.length, 0, `Missing Sanity documents: ${missing.join(", ")}`);
assert.equal(ambiguous.length, 0, `Ambiguous Sanity documents: ${ambiguous.join(", ")}`);

const updates = [];
const unmatched = [];
const stats = { documents: sourceById.size, productTypes: 0, skus: 0, changedDocuments: 0, changedPaths: 0 };
for (const [id, source] of sourceById) {
  const doc = byId.get(id);
  const fields = {};
  for (const key of doc._type === "productType" ? ["name", "summary"] : ["colorName", "summary"]) {
    if (source[key]?.zh && doc[key]?.zh !== source[key].zh) fields[`${key}.zh`] = source[key].zh;
  }
  for (const key of ["title", "description"]) {
    if (source.seo?.[key]?.zh && doc.seo?.[key]?.zh !== source.seo[key].zh)
      fields[`seo.${key}.zh`] = source.seo[key].zh;
  }
  if (doc._type === "productType") {
    stats.productTypes++;
    const published = id.startsWith("drafts.") ? byId.get(normalizedId(id)) : undefined;
    matchArray("specTemplate", source.specTemplate, doc.specTemplate, item => item.key, fields, unmatched, published?.specTemplate);
    matchArray("certifications", source.certifications, doc.certifications, item => item.en, fields, unmatched);
    matchArray("maintenance", source.maintenance, doc.maintenance, item => item.title?.en, fields, unmatched);
    matchArray("downloads", source.downloads, doc.downloads, item => item.href || item.title?.en, fields, unmatched);
    const downloads = fields.downloads ?? doc.downloads;
    if (Array.isArray(downloads)) {
      const translated = downloads.map(item => {
        const copy = editorialDownloads[item.title?.en];
        return copy ? {
          ...item,
          title: { ...item.title, zh: item.title?.zh || copy[0] },
          description: { ...item.description, zh: item.description?.zh || copy[1] }
        } : item;
      });
      if (!same(translated, doc.downloads)) fields.downloads = translated;
    }
    const certifications = fields.certifications ?? doc.certifications;
    if (Array.isArray(certifications)) {
      const translated = certifications.map(item => editorialCertifications[item.en] && !item.zh
        ? { ...item, zh: editorialCertifications[item.en] } : item);
      if (!same(translated, doc.certifications)) fields.certifications = translated;
    }
  } else {
    stats.skus++;
    matchArray("specs", source.specs, doc.specs, item => item.label?.en, fields, unmatched);
    matchArray("caseGallery", source.caseGallery, doc.caseGallery, item => item.alt?.en, fields, unmatched);
  }
  if (Object.keys(fields).length) {
    updates.push({ id, rev: doc._rev, fields });
    stats.changedDocuments++;
    stats.changedPaths += Object.keys(fields).length;
  }
}

fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, "sanity-before.json"), JSON.stringify(documents.filter(doc => sourceById.has(doc._id)), null, 2));
fs.writeFileSync(path.join(output, "patches.json"), JSON.stringify(updates, null, 2));
fs.writeFileSync(path.join(output, "audit.json"), JSON.stringify({ stats, unmatched }, null, 2));
console.log(JSON.stringify({ apply, stats, unmatchedCount: unmatched.length, unmatchedSample: unmatched.slice(0, 15) }));

if (apply) {
  for (let i = 0; i < updates.length; i += 100) {
    const batch = updates.slice(i, i + 100);
    let transaction = client.transaction();
    for (const { id, rev, fields } of batch)
      transaction = transaction.patch(id, patch => patch.ifRevisionId(rev).set(fields));
    await transaction.commit();
    console.log(`Committed ${Math.min(i + batch.length, updates.length)}/${updates.length}`);
  }
  const after = [];
  const ids = [...sourceById.keys()];
  for (let i = 0; i < ids.length; i += 100)
    after.push(...await client.fetch('*[_id in $ids]', { ids: ids.slice(i, i + 100) }));
  const byAfterId = new Map(after.map(doc => [doc._id, doc]));
  for (const { id, fields } of updates) {
    const before = byId.get(id);
    const result = byAfterId.get(id);
    assert.ok(result, `Missing updated document: ${id}`);
    const expected = copy(before);
    for (const [path, value] of Object.entries(fields)) {
      const parts = path.split(".");
      let node = expected;
      for (const part of parts.slice(0, -1)) node = node[part] ??= {};
      node[parts.at(-1)] = value;
    }
    for (const key of Object.keys(before).filter(key => !key.startsWith("_")))
      assert.deepEqual(result[key], expected[key], `Unexpected content change: ${id}.${key}`);
  }
  fs.writeFileSync(path.join(output, "sanity-after.json"), JSON.stringify(after, null, 2));
  console.log(`Verified ${updates.length} changed documents; existing non-Chinese content preserved.`);
}
