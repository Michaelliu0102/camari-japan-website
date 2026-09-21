import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import nextEnv from "@next/env";
import { build } from "esbuild";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

// Never print SDK error objects: they can contain authentication headers.
process.on("uncaughtException", error => { console.error(error.message); process.exit(1); });
nextEnv.loadEnvConfig(process.cwd());
const apply = process.argv.includes("--apply");
// Scope a copy-only repair without running unrelated editorial migrations.
const materialArg = process.argv.find(arg => arg.startsWith("--material="));
const materialSlug = materialArg?.slice("--material=".length);
if (materialArg && !materialSlug) throw Error("--material requires a material slug.");
const dir = path.resolve("outputs/cms-editorial-migration", String(Date.now()));
fs.mkdirSync(dir, { recursive: true });
await build({ entryPoints: ["scripts/editorialMigrationDefaults.ts"], outfile: `${dir}/defaults.mjs`, bundle: true, platform: "node", format: "esm", packages: "external" });
const defaultsModule = await import(pathToFileURL(`${dir}/defaults.mjs`).href);
if (materialSlug && !defaultsModule.materialEditorialCopy[materialSlug]) throw Error(`No local editorial copy for material: ${materialSlug}`);
const defaults = materialSlug
  ? { materialEditorialCopy: defaultsModule.materialEditorialCopy, materialFaqs: {}, news: [], downloadPage: { groups: [] } }
  : await defaultsModule.getEditorialMigrationDefaults();
const config = { projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx", dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production", apiVersion: "2026-05-12", useCdn: false, perspective: "raw" };
const client = process.env.SANITY_AUTH_TOKEN ? createClient({ ...config, token: process.env.SANITY_AUTH_TOKEN }) : getCliClient({ apiVersion: config.apiVersion }).withConfig(config);
const docs = materialSlug
  ? await client.fetch('*[_type == "material" && slug.current == $slug]', { slug: materialSlug })
  : await client.fetch('*[_type in ["homePage", "material", "news", "productType", "downloadPage"]]');
if (materialSlug && !docs.length) throw Error(`Material not found in Sanity: ${materialSlug}`);
const keyed = value => Array.isArray(value) ? value.map((item, index) => typeof item === "object" && item !== null ? { _key: `entry-${index + 1}`, ...keyed(item) } : item)
  : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).filter(([,item])=>item!==undefined).map(([key,item])=>[key,keyed(item)])) : value;
const canonical = value => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))) : item);
const patches = [], creates = [];
function fillMissingLocales(existing, fallback) {
  const merged = { ...existing };
  for (const locale of ["en", "ja"]) {
    if (!merged[locale]?.trim() && fallback?.[locale]?.trim()) merged[locale] = fallback[locale];
  }
  return merged;
}
for (const doc of docs) {
  const fields = {};
  if (doc._type === "homePage") for (const [key, value] of Object.entries(defaults.homePageCopy)) if (doc[key] == null) fields[key] = value;
  if (doc._type === "material") {
    const copy = defaults.materialEditorialCopy[doc.slug?.current];
    if (copy) {
      for (const field of ["introTitle", "introBody"]) {
        const merged = fillMissingLocales(doc[field], copy[field]);
        if (canonical(merged) !== canonical(doc[field])) fields[field] = merged;
      }
      const description = fillMissingLocales(doc.seo?.description, copy.seoDescription);
      if (canonical(description) !== canonical(doc.seo?.description)) {
        fields.seo = { ...doc.seo, _type: doc.seo?._type ?? "seo", description };
      }
    }
    const faq = defaults.materialFaqs[doc.slug?.current];
    if (faq) {
      const merged = { ...doc.faq };
      for (const locale of ["en", "ja"]) if (merged[locale] == null && faq[locale]) merged[locale] = keyed(faq[locale]);
      if (canonical(merged) !== canonical(doc.faq)) fields.faq = merged;
    }
  }
  if (doc._type === "productType" && defaults.productDownloads[doc.slug?.current]) {
    // These series previously displayed locally forced downloads. Move exactly that visible list to CMS.
    // A marker makes future runs safe for editors' later changes.
    if (!doc.editorialDownloadsMigrated) {
      fields.downloads = keyed(defaults.productDownloads[doc.slug.current]);
      fields.editorialDownloadsMigrated = true;
    }
  }
  if (Object.keys(fields).length) patches.push({ doc, fields });
}
for (const item of defaults.news) {
  const existing = docs.filter(doc => doc._type === "news" && doc.slug?.current === item.slug);
  if (!existing.length) creates.push(keyed({ _id: `news-${item.slug}`, _type: "news", title:item.title, slug:{_type:"slug",current:item.slug}, category:item.category,
    publishedAt:`${item.date}T00:00:00Z`, coverImagePath:item.image, summary:item.summary, availableLocales:item.availableLocales ?? ["en","ja"],
    articleContent:item.articleContent, seo:{_type:"seo",title:item.seo.title,description:item.seo.description} }));
  else for (const doc of existing) {
    const article = {...doc.articleContent};
    for (const locale of ["en","ja"]) if(article[locale]==null && item.articleContent[locale]) article[locale]=keyed(item.articleContent[locale]);
    if(canonical(article)!==canonical(doc.articleContent)) patches.push({doc,fields:{articleContent:article}});
  }
}
if (!materialSlug && !docs.some(doc => doc._id === "downloadPageSettings")) creates.push(keyed({ _id:"downloadPageSettings", _type:"downloadPage", ...defaults.downloadPage }));
const plan = { mode:apply?"apply":"dry-run", material:materialSlug ?? null, patches:patches.map(x=>({id:x.doc._id,fields:Object.keys(x.fields)})), creates:creates.map(x=>x._id), faqMaterials:Object.keys(defaults.materialFaqs).length, news:defaults.news.length, downloadFiles:defaults.downloadPage.groups.reduce((n,g)=>n+g.downloads.length,0) };
fs.writeFileSync(`${dir}/plan.json`,JSON.stringify(plan,null,2));
fs.writeFileSync(`${dir}/expected.json`,JSON.stringify([...patches.map(({doc,fields})=>({...doc,...fields})),...creates],null,2));
console.log(JSON.stringify(plan,null,2));
console.log(`Plan and expected documents: ${dir}`);
if(!apply || (!patches.length && !creates.length)) process.exit(0);
fs.writeFileSync(`${dir}/before.json`,JSON.stringify(docs,null,2));
let tx=client.transaction();
for(const {doc,fields} of patches) tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).set(fields));
for(const doc of creates) tx=tx.create(doc);
await tx.commit();
const ids=[...patches.map(x=>x.doc._id),...creates.map(x=>x._id)];
const after=await client.fetch('*[_id in $ids]',{ids});
const stable=value=>Object.fromEntries(Object.entries(value).filter(([key])=>!["_rev","_updatedAt","_createdAt"].includes(key)));
for(const expected of [...patches.map(({doc,fields})=>({...doc,...fields})),...creates]) {
 const actual=after.find(doc=>doc._id===expected._id);
 if(!actual||canonical(stable(actual))!==canonical(stable(expected)))throw Error(`Verification failed: ${expected._id}`);
}
fs.writeFileSync(`${dir}/after.json`,JSON.stringify(after,null,2));
console.log(`Verified ${after.length} documents. Backup and plan: ${dir}`);
