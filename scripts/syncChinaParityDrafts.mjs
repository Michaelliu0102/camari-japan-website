import fs from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {build} from "esbuild";
import nextEnv from "@next/env";
import {createClient} from "@sanity/client";
import {getCliClient} from "sanity/cli";
process.on("uncaughtException",error=>{console.error(error.message);process.exit(1)});
nextEnv.loadEnvConfig(process.cwd());
const apply=process.argv.includes("--apply");
const dir=path.resolve("outputs/china-parity",String(Date.now()));fs.mkdirSync(dir,{recursive:true});
await build({stdin:{contents:'export * from "./src/china/defaults";export * from "./src/china/copy";',resolveDir:process.cwd(),loader:"ts"},outfile:`${dir}/copy.mjs`,bundle:true,format:"esm",platform:"node"});
const {chineseCopy,chinaMaterialDrafts,chinaCategoryDrafts}=await import(pathToFileURL(`${dir}/copy.mjs`).href);
const config={projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID??"bfjhbpbx",dataset:process.env.NEXT_PUBLIC_SANITY_DATASET??"production",apiVersion:"2026-05-12",useCdn:false,perspective:"raw"};
const client=process.env.SANITY_AUTH_TOKEN?createClient({...config,token:process.env.SANITY_AUTH_TOKEN}):getCliClient({apiVersion:config.apiVersion}).withConfig(config);
const docs=await client.fetch('*[_type in ["material","materialCategory","productCategory"] && chinaStatus == "draft"]');
const patches=[];
for(const doc of docs){
 const slug=doc.slug?.current;const seed=doc._type==="productCategory"?chinaCategoryDrafts[slug]:chinaMaterialDrafts[slug==="italian-genuine-leather"?"leather":slug];
 if(!seed)continue;
 const fields={};
 for(const name of ["introTitle","introBody","description"]){
  const field=doc[name];if(!field||typeof field.en!=="string"||field.zh!==seed[name])continue;
  const full=chineseCopy(field.en);if(full===field.en&&full)continue;
  if(full!==field.zh)fields[`${name}.zh`]=full;
 }
 if(Object.keys(fields).length)patches.push({doc,fields});
}
fs.writeFileSync(`${dir}/before.json`,JSON.stringify(docs,null,2));
console.log(JSON.stringify({apply,patches:patches.map(({doc,fields})=>({id:doc._id,fields:Object.keys(fields)}))},null,2));
if(apply&&patches.length){let tx=client.transaction();for(const {doc,fields}of patches)tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).set(fields));await tx.commit();
const after=await client.fetch('*[_id in $ids]',{ids:patches.map(p=>p.doc._id)});fs.writeFileSync(`${dir}/after.json`,JSON.stringify(after,null,2));
for(const {doc,fields}of patches){const saved=after.find(item=>item._id===doc._id);for(const [field,value]of Object.entries(fields)){const name=field.split('.')[0];if(saved?.[name]?.zh!==value||saved[name].en!==doc[name].en||saved[name].ja!==doc[name].ja)throw Error(`Verification failed: ${doc._id}.${name}`);}}
console.log(`Verified ${after.length} documents; English/Japanese preserved. Backup: ${dir}`);}
