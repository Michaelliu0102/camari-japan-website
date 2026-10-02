import fs from 'node:fs';
import assert from 'node:assert/strict';
import nextEnv from '@next/env';
import {createClient} from '@sanity/client';
import {getCliClient} from 'sanity/cli';
process.on('uncaughtException',e=>{console.error(e.message);process.exit(1)});
process.on('unhandledRejection',e=>{console.error(e?.message??String(e));process.exit(1)});
nextEnv.loadEnvConfig(process.cwd(),true);
const config={projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID??'bfjhbpbx',dataset:process.env.NEXT_PUBLIC_SANITY_DATASET??'production',apiVersion:'2026-06-09',perspective:'raw',useCdn:false,timeout:30000,maxRetries:2};
const client=process.env.SANITY_AUTH_TOKEN?createClient({...config,token:process.env.SANITY_AUTH_TOKEN}):getCliClient({apiVersion:config.apiVersion}).withConfig(config);
const dir='outputs/fa8526-polyester';
const query='*[_type == "sku" && (code == "FA8526" || slug.current == "fa8526")]';
const docs=await client.fetch(query);
assert.ok(docs.length>0);
assert.ok(docs.every(d=>d._id.replace(/^drafts\./,'')==='sku-fa8526'));
fs.writeFileSync(`${dir}/sanity-before.json`,JSON.stringify(docs,null,2));
const parentBefore=await client.getDocument('productType-porsche-plaid');
let transaction=client.transaction();
const fields=new Map();
for(const doc of docs){
  const specs=structuredClone(doc.specs??[]);
  const index=specs.findIndex(s=>s.label?.en?.trim().toLowerCase()==='material');
  const old=specs[index]??{};
  const spec={...old,_key:old._key??'material',label:{...old.label,en:'MATERIAL',ja:'素材',zh:'材质'},value:{...old.value,en:'Polyester',ja:'ポリエステル',zh:'聚酯纤维'}};
  if(index<0)specs.push(spec);else specs[index]=spec;
  fields.set(doc._id,specs);
  transaction=transaction.patch(doc._id,p=>p.ifRevisionId(doc._rev).set({specs}));
}
await transaction.commit();
const after=await client.fetch(query);
for(const doc of after){
  assert.deepEqual(doc.specs,fields.get(doc._id));
  const before=docs.find(d=>d._id===doc._id);
  for(const key of Object.keys(before).filter(k=>!['_rev','_updatedAt','specs'].includes(k)))assert.deepEqual(doc[key],before[key]);
}
assert.equal((await client.getDocument('productType-porsche-plaid'))._rev,parentBefore._rev);
fs.writeFileSync(`${dir}/sanity-after.json`,JSON.stringify(after,null,2));
const path='src/data/product-catalog.generated.json';
const catalog=JSON.parse(fs.readFileSync(path,'utf8'));
const sku=catalog.skus.find(s=>s.slug==='fa8526');
assert.ok(sku);
sku.specs=fields.get('sku-fa8526').map(({_key,...spec})=>spec);
fs.writeFileSync(path,JSON.stringify(catalog,null,2)+'\n');
console.log('Verified FA8526 material override: Polyester / ポリエステル / 聚酯纤维. Parent product type unchanged.');
