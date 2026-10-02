import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";
process.on("uncaughtException",error=>{console.error(error.message);process.exit(1)});
nextEnv.loadEnvConfig(process.cwd());
const apply=process.argv.includes("--apply");
const dir=path.resolve("outputs/china-preview",String(Date.now()));fs.mkdirSync(dir,{recursive:true});
await build({entryPoints:["src/china/defaults.ts"],outfile:`${dir}/defaults.mjs`,bundle:true,format:"esm",platform:"node"});
const {chinaSiteDefaults,chinaMaterialDrafts,chinaCategoryDrafts}=await import(pathToFileURL(`${dir}/defaults.mjs`).href);
const config={projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID??"bfjhbpbx",dataset:process.env.NEXT_PUBLIC_SANITY_DATASET??"production",apiVersion:"2026-05-12",useCdn:false,perspective:"raw"};
const client=process.env.SANITY_AUTH_TOKEN?createClient({...config,token:process.env.SANITY_AUTH_TOKEN}):getCliClient({apiVersion:config.apiVersion}).withConfig(config);
const docs=await client.fetch('*[_type in ["chinaSite","material","materialCategory","productCategory"]]');
const keyed=value=>Array.isArray(value)?value.map((item,i)=>item&&typeof item==="object"?{_key:`item-${i+1}`,...keyed(item)}:item):value&&typeof value==="object"?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,keyed(v)])):value;
const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==="object"&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
const patches=[];
function localized(existing,zh,fallback){return {...fallback,...existing,zh:existing?.zh??zh};}
for(const doc of docs) {
 const slug=doc.slug?.current;
 const material=chinaMaterialDrafts[slug==="italian-genuine-leather"?"leather":slug];
 const category=chinaCategoryDrafts[slug];
 const fields={};
 if((doc._type==="material"||doc._type==="materialCategory")&&material) {
  fields.name=localized(doc.name,material.name);
  if(doc._type==="material") {fields.introTitle=localized(doc.introTitle,material.introTitle);fields.introBody=localized(doc.introBody,material.introBody);}
  else fields.description=localized(doc.description,material.description);
  fields.seo={...doc.seo,_type:doc.seo?._type??"seo",title:localized(doc.seo?.title,`${material.name}｜CAMARI 中国`,doc.name),description:localized(doc.seo?.description,material.description,doc.introBody??doc.description)};
 }else if(doc._type==="productCategory"&&category) {
  fields.title=localized(doc.title,category.title);fields.description=localized(doc.description,category.description);
  fields.seo={...doc.seo,_type:doc.seo?._type??"seo",title:localized(doc.seo?.title,`${category.title}｜CAMARI 中国`,doc.title),description:localized(doc.seo?.description,category.description,doc.description)};
 }
 if(Object.keys(fields).length) {
  // Start Chinese editorial drafts without assigning products to a new sales market.
  if(doc.chinaStatus==null)fields.chinaStatus="draft";
  const changed=Object.fromEntries(Object.entries(fields).filter(([k,v])=>canonical(v)!==canonical(doc[k])));
  if(Object.keys(changed).length)patches.push({doc,fields:changed});
 }
}
const existingSite=docs.find(doc=>doc._id==="chinaSiteSettings");
const site=keyed({...chinaSiteDefaults,_type:"chinaSite"});
console.log(JSON.stringify({mode:apply?"apply":"dry-run",createSite:!existingSite,patches:patches.map(({doc,fields})=>({id:doc._id,fields:Object.keys(fields)})),assignProductMarkets:false},null,2));
fs.writeFileSync(`${dir}/before.json`,JSON.stringify(docs,null,2));
if(!apply||(!patches.length&&existingSite))process.exit(0);
let tx=client.transaction();for(const {doc,fields}of patches)tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).set(fields));if(!existingSite)tx=tx.create(site);
await tx.commit();
const ids=[...patches.map(({doc})=>doc._id),...(!existingSite?[site._id]:[])];
const after=await client.fetch('*[_id in $ids]',{ids});
const stable=v=>Object.fromEntries(Object.entries(v).filter(([k])=>!["_rev","_createdAt","_updatedAt"].includes(k)));
for(const expected of [...patches.map(({doc,fields})=>({...doc,...fields})),...(!existingSite?[site]:[])]) {
 const actual=after.find(doc=>doc._id===expected._id);if(!actual||canonical(stable(actual))!==canonical(stable(expected)))throw Error(`Verification failed: ${expected._id}`);
}
fs.writeFileSync(`${dir}/after.json`,JSON.stringify(after,null,2));console.log(`Verified ${after.length} documents. Backup: ${dir}`);
