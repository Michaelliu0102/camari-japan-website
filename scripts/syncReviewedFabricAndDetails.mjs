import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import nextEnv from '@next/env';
import { createClient } from '@sanity/client';
import { getCliClient } from 'sanity/cli';
import japanese from '../src/data/product-category-ja.json' with {type:'json'};
import { productDetailJapaneseCorrections as corrections } from './productDetailJapaneseCorrections.mjs';

// A narrow, revision-guarded migration. No creates, uploads, slug changes, or publications.
process.on('uncaughtException', e=>{console.error(e.message);process.exit(1);});
nextEnv.loadEnvConfig(process.cwd());
const apply=process.argv.includes('--apply');
const base=path.resolve('outputs/01a0c246-6793-7d83-bee0-edb8b953dc6b-fabric-ja');
const workbook=`${base}/fabric-ja-review.xlsx`;
const dir=path.resolve('outputs/reviewed-fabric-details-sync',`${Date.now()}-${apply?'apply':'dry-run'}`);
fs.mkdirSync(dir,{recursive:true});
const python='/Users/michael/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const workbookRows=JSON.parse(execFileSync(python,['-B','-c',`import openpyxl,json,sys
w=openpyxl.load_workbook(sys.argv[1]);print(json.dumps({s.title:list(s.values) for s in w},ensure_ascii=False))`,workbook],{encoding:'utf8'}));
const rows=name=>workbookRows[name].slice(1).map(r=>Object.fromEntries(workbookRows[name][0].map((h,i)=>[h,r[i]])));
const cell=change=>{
  const values=workbookRows[change.sheet];
  return {row:Object.fromEntries(values[0].map((h,i)=>[h,values[change.row-1][i]])),field:values[0][change.column-1],value:values[change.row-1][change.column-1]};
};
const originalChanges=JSON.parse(fs.readFileSync(`${base}/changes.json`));
const confirmed=JSON.parse(fs.readFileSync(`${base}/confirmed-changes.json`)).changes;
const approved=new Map([...originalChanges,...confirmed].map(c=>[`${c.sheet}/${c.row}/${c.column}`,c]));
const baseline=JSON.parse(fs.readFileSync('outputs/sanity-content-audit-20260921/documents.json'));
const baselineById=new Map(baseline.map(d=>[d._id,d]));
const config={projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID??'bfjhbpbx',dataset:process.env.NEXT_PUBLIC_SANITY_DATASET??'production',apiVersion:'2026-05-12',useCdn:false,perspective:'raw'};
const client=process.env.SANITY_AUTH_TOKEN?createClient({...config,token:process.env.SANITY_AUTH_TOKEN}):getCliClient({apiVersion:config.apiVersion}).withConfig(config);
const docs=await client.fetch('*[!(_id in path("versions.**")) && (_type == "productCategory" || (_type in ["productType","sku"] && material._ref == "material-fabric"))]');
fs.writeFileSync(`${dir}/before.json`,JSON.stringify(docs,null,2));
const desired=new Map(docs.map(d=>[d._id,structuredClone(d)]));
const changes=[],conflicts=[],skipped=[];
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
const equal=(a,b)=>canonical(a)===canonical(b);
const get=(obj,keys)=>keys.reduce((v,k)=>v?.[k],obj);
const set=(obj,keys,value)=>{let parent=obj;for(let i=0;i<keys.length-1;i++)parent=parent[keys[i]]??=(typeof keys[i+1]==='number'?[]:{});const last=keys.at(-1);if(value==null)delete parent[last];else parent[last]=value;};
function edit(doc,keys,value,reason,baselineKeys=keys) {
  const current=get(doc,keys),previous=get(baselineById.get(doc._id),baselineKeys);
  if(equal(current,value)||(current==null&&value==null))return;
  if(!baselineById.has(doc._id)||!equal(current,previous)) {conflicts.push({id:doc._id,path:keys,current,baseline:previous,desired:value});return;}
  set(desired.get(doc._id),keys,value);
  changes.push({id:doc._id,path:keys,before:current??null,after:value,reason});
}
function findDocs(type,predicate,label) {
  const found=docs.filter(d=>d._type===type&&predicate(d));
  if(!found.length||found.filter(d=>!d._id.startsWith('drafts.')).length!==1)throw Error(`Ambiguous/missing ${label}`);
  return found;
}
function one(items,predicate,label) {
  const matches=items.map((v,i)=>({v,i})).filter(x=>predicate(x.v));
  if(matches.length!==1)throw Error(`Expected one ${label}, got ${matches.length}`);
  return matches[0];
}
const skuRows=rows('skus');
const skuFor=slug=>one(skuRows,r=>r.sku_slug===slug,slug).v;
function targets(row,type) {
  return type==='productType'?findDocs(type,d=>d.slug?.current===row.product_type_slug,row.product_type_slug)
    :findDocs(type,d=>d.code===row.code&&d.productType?._ref===`productType-${row.product_type_slug}`,row.code);
}
function localePath(field) {
  const match=field.match(/^(name|color_name|summary|seo_title|seo_description)_(en|ja|zh)$/);
  if(!match)throw Error(`Unsupported approved field ${field}`);
  const roots={name:['name'],color_name:['colorName'],summary:['summary'],seo_title:['seo','title'],seo_description:['seo','description']};
  return [...roots[match[1]],match[2]];
}
for(const change of approved.values()) {
  const {row,field,value}=cell(change);
  if(change.sheet==='sku_case_gallery') continue;
  const type=change.sheet==='product_types'?'productType':change.sheet==='skus'?'sku':null;
  if(!type)throw Error(`Unsupported approved sheet ${change.sheet}`);
  for(const doc of targets(row,type))edit(doc,field==='hex'?['hex']:localePath(field),value,'approved workbook cell');
}
// Identify existing images by their actual asset SHA-1, never gallery array position.
for(const row of rows('sku_case_gallery')) {
  const sku=skuFor(row.sku_slug);
  if(!row.alt_ja?.trim())throw Error(`Empty gallery Japanese: ${row.sku_slug}`);
  const file=path.join(process.cwd(),'public',row.image);
  const hash=createHash('sha1').update(fs.readFileSync(file)).digest('hex');
  for(const doc of targets(sku,'sku')) {
    const match=one(doc.caseGallery??[],g=>g.image?.asset?._ref?.startsWith(`image-${hash}-`),`${doc._id} image ${row.image}`);
    if(!match.v._key)throw Error('Missing gallery _key');
    const prior=one(baselineById.get(doc._id)?.caseGallery??[],g=>g._key===match.v._key,`${doc._id} baseline gallery key`);
    edit(doc,['caseGallery',match.i,'alt','ja'],row.alt_ja,'approved gallery Japanese',['caseGallery',prior.i,'alt','ja']);
  }
}
let products=0;
for(const [slug,category] of Object.entries(japanese)) {
  for(const item of category.carouselItems) {
    if(!corrections[item.sourceTitle])continue;
    products++;
    const translations=item.details;
    if(translations.length!==3||translations.some(d=>!d.source.trim()||!d.text.trim())||new Set(translations.map(d=>d.source)).size!==translations.length)throw Error(`Invalid ${item.sourceTitle}`);
    for(const doc of findDocs('productCategory',d=>d.slug?.current===slug,slug)) {
      const current=one(doc.carouselItems??[],x=>x.title?.en===item.sourceTitle,`${doc._id}/${item.sourceTitle}`);
      if(!current.v._key)throw Error('Missing carousel _key');
      const old=one(baselineById.get(doc._id)?.carouselItems??[],x=>x._key===current.v._key,`${doc._id} baseline carousel key`);
      if(current.v.details?.length!==translations.length)throw Error(`Remote detail count differs: ${item.sourceTitle}`);
      for(const translation of translations) {
        const detail=one(current.v.details,x=>x.en===translation.source,translation.source);
        if(!detail.v._key)throw Error('Missing detail _key');
        const prior=one(old.v.details??[],x=>x._key===detail.v._key,'baseline detail key');
        edit(doc,['carouselItems',current.i,'details',detail.i,'ja'],translation.text,'aligned Japanese product detail',['carouselItems',old.i,'details',prior.i,'ja']);
      }
    }
  }
}
if(products!==15)throw Error(`Expected 15 products, found ${products}`);
const patches=[];
for(const doc of docs) {
  const expected=desired.get(doc._id),fields={},unset=[];
  for(const root of new Set(changes.filter(c=>c.id===doc._id).map(c=>c.path[0]))) {
    if(expected[root]===undefined)unset.push(root);else fields[root]=expected[root];
  }
  if(Object.keys(fields).length||unset.length)patches.push({id:doc._id,rev:doc._rev,fields,unset});
}
const plan={mode:apply?'apply':'dry-run',project:config.projectId,dataset:config.dataset,workbook,workbookSha256:createHash('sha256').update(fs.readFileSync(workbook)).digest('hex'),products,documents:patches.length,fieldChanges:changes.length,conflicts,skipped,changes};
fs.writeFileSync(`${dir}/plan.json`,JSON.stringify(plan,null,2));
fs.writeFileSync(`${dir}/expected.json`,JSON.stringify([...desired.values()],null,2));
console.log(JSON.stringify({mode:plan.mode,documents:patches.length,fieldChanges:changes.length,conflicts:conflicts.length,groups:changes.reduce((a,c)=>(a[c.reason]=(a[c.reason]??0)+1,a),{}),directory:dir},null,2));
if(conflicts.length)throw Error(`Remote changes since audit: ${conflicts.length}; review ${dir}/plan.json. No writes made.`);
if(!apply)process.exit(0);
if(patches.length) {
  let tx=client.transaction();
  for(const patch of patches)tx=tx.patch(patch.id,p=>{p=p.ifRevisionId(patch.rev);if(Object.keys(patch.fields).length)p=p.set(patch.fields);if(patch.unset.length)p=p.unset(patch.unset);return p;});
  await tx.commit({visibility:'sync'});
}
const after=await client.fetch('*[_id in $ids]',{ids:docs.map(d=>d._id)});
fs.writeFileSync(`${dir}/after.json`,JSON.stringify(after,null,2));
const strip=d=>Object.fromEntries(Object.entries(d).filter(([k])=>!['_rev','_updatedAt'].includes(k)));
for(const doc of after)if(!equal(strip(doc),strip(desired.get(doc._id))))throw Error(`Verification mismatch: ${doc._id}`);
if(after.length!==docs.length)throw Error('Verification missing documents');
console.log(`VERIFIED ${patches.length} documents, ${changes.length} field changes; unrelated data preserved.`);
