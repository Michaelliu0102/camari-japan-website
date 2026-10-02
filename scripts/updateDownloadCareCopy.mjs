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
const docs = await client.fetch('*[_id in ["downloadPageSettings", "drafts.downloadPageSettings"]]{_id,_rev,groups}');
const oldText = "Cleaning and maintenance files for material handling after specification.";
const newText = "Cleaning and maintenance files for material handling.";
const changes = docs.flatMap(doc => (doc.groups ?? []).flatMap((group, index) =>
  group.slug === "care" && group.intro?.en === oldText ? [{doc, index}] : []));
console.log(JSON.stringify({mode:apply ? "apply":"dry-run",changes:changes.map(({doc,index})=>({id:doc._id,index,before:doc.groups[index].intro.en,after:newText}))},null,2));
if (apply && changes.length) {
 const dir=path.resolve("outputs/download-care-copy",String(Date.now()));
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,"before.json"),JSON.stringify(docs,null,2));
 let transaction=client.transaction();
 for(const {doc,index} of changes) transaction=transaction.patch(doc._id,p=>p.ifRevisionId(doc._rev).set({[`groups[${index}].intro.en`]:newText}));
 await transaction.commit();
 const updated=await client.fetch('*[_id in $ids]{_id,"intro":groups[slug=="care"][0].intro.en}',{ids:changes.map(({doc})=>doc._id)});
 if(updated.some(doc=>doc.intro!==newText)) throw new Error("Verification failed");
 console.log(JSON.stringify({verified:updated,backup:dir}));
}
