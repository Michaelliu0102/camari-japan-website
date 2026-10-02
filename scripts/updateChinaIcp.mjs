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
const docs = await client.fetch('*[_id in ["chinaSiteSettings", "drafts.chinaSiteSettings"]]{_id,_rev,icpNumber}');
if(!docs.length) throw new Error("China site settings not found");
const icpNumber = "浙ICP备17003937号-2";
const changed=docs.filter(doc=>doc.icpNumber!==icpNumber);
console.log(JSON.stringify({mode:apply?"apply":"dry-run",before:docs,icpNumber}));
if(apply && changed.length) {
 const dir=path.resolve("outputs/china-icp",String(Date.now()));
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,"before.json"),JSON.stringify(docs,null,2));
 let transaction=client.transaction();
 for(const doc of changed) transaction=transaction.patch(doc._id,p=>p.ifRevisionId(doc._rev).set({icpNumber}));
 await transaction.commit();
 const updated=await client.fetch('*[_id in $ids]{_id,icpNumber}',{ids:docs.map(doc=>doc._id)});
 if(updated.some(doc=>doc.icpNumber!==icpNumber)) throw new Error("Verification failed");
 console.log(JSON.stringify({verified:updated,backup:dir}));
}
