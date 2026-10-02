import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import nextEnv from '@next/env';
import {createClient} from '@sanity/client';
import {getCliClient} from 'sanity/cli';

// SDK errors may include request headers; log messages only.
process.on('uncaughtException', error => { console.error(error.message); process.exit(1); });
process.on('unhandledRejection', error => { console.error(error?.message ?? String(error)); process.exit(1); });
nextEnv.loadEnvConfig(process.cwd(), true);
const root=process.cwd();
const directory=path.join(root,'outputs/fabric-new-skus-20260918');
const apply=process.argv.includes('--apply');
const config={projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID??'bfjhbpbx',dataset:process.env.NEXT_PUBLIC_SANITY_DATASET??'production',apiVersion:'2026-06-09',useCdn:false,perspective:'raw',timeout:30000,maxRetries:2};
const client=process.env.SANITY_AUTH_TOKEN
  ? createClient({...config,token:process.env.SANITY_AUTH_TOKEN})
  : getCliClient({apiVersion:config.apiVersion}).withConfig(config);
const source=JSON.parse(fs.readFileSync(path.join(directory,'fabric-catalog.json'),'utf8'));
const codes=['FA1869','FA6107','FA8526'];
const skus=source.skus.filter(s=>codes.includes(s.code));
assert.equal(skus.length,3);
const typeSlugs=[...new Set(skus.map(s=>s.productTypeSlug))];
const productTypes=source.productTypes.filter(p=>typeSlugs.includes(p.slug));
assert.equal(productTypes.length,3);
assert.ok([...skus,...productTypes].every(item=>item.materialSlug==='fabric'));
const skuSlugs=skus.map(s=>s.slug);
const query='*[_type == "productType" && slug.current in $typeSlugs || _type == "sku" && (slug.current in $skuSlugs || code in $codes)]';
const params={typeSlugs,skuSlugs,codes};
const docs=await client.fetch(query,params);
const materials=await client.fetch('*[_type=="material" && slug.current=="fabric" && !(_id in path("drafts.**"))]{_id,_rev}');
assert.equal(materials.length,1);
const materialId=materials[0]._id;
const group=(type,item)=>docs.filter(d=>d._type===type&&(d.slug?.current===item.slug||(type==='sku'&&d.code===item.code)));
function idFor(type,item){
  const ids=[...new Set(group(type,item).map(d=>d._id.replace(/^drafts\./,'')))];
  assert.ok(ids.length<=1,`Duplicate ${type}: ${item.slug}`);
  return ids[0]??`${type}-${item.slug}`;
}
const productIds=new Map(productTypes.map(p=>[p.slug,idFor('productType',p)]));
const ids=[...productIds.values(),...skus.map(s=>idFor('sku',s))];
const allIds=[...ids,...ids.map(id=>`drafts.${id}`)];
const urls=[...new Set([
  ...productTypes.map(p=>p.seo?.image),
  ...skus.flatMap(s=>[s.image,s.previewImage,s.seo?.image,...s.caseGallery.map(g=>g.image)])
].filter(Boolean))];
const files=urls.map(url=>{
  assert.ok(url.startsWith('/uploads/fabric/'),`Unexpected asset: ${url}`);
  const file=path.join(root,'public',url);
  const bytes=fs.readFileSync(file);
  return {url,file,bytes,hash:crypto.createHash('sha1').update(bytes).digest('hex')};
});
for(const p of productTypes) for(const field of ['name','summary']) assert.ok(!p[field]?.en||p[field].ja,`${p.slug}: missing ${field}.ja`);
for(const item of [...productTypes,...skus]) for(const field of ['title','description']) assert.ok(!item.seo?.[field]?.en||item.seo[field].ja,`${item.slug}: missing SEO ${field}.ja`);
for(const p of productTypes) for(const spec of p.specTemplate) {
  assert.ok(!spec.label.en||spec.label.ja,`${p.slug}: missing spec label`);
  assert.ok(!spec.defaultValue.en||spec.defaultValue.ja,`${p.slug}: missing spec value`);
}
const plan={mode:apply?'apply':'dry-run',projectId:config.projectId,dataset:config.dataset,productTypes:productTypes.map(p=>({slug:p.slug,id:idFor('productType',p),existing:group('productType',p).length>0})),skus:skus.map(s=>({code:s.code,slug:s.slug,id:idFor('sku',s),existing:group('sku',s).length>0})),images:files.length};
fs.writeFileSync(path.join(directory,'sync-plan.json'),JSON.stringify(plan,null,2));
console.log(JSON.stringify(plan,null,2));
if(!apply)process.exit(0);
const before=path.join(directory,`sanity-before-${Date.now()}.json`);
fs.writeFileSync(before,JSON.stringify(docs,null,2));
const unrelatedQuery='*[_type in ["material","productType","sku"] && !(_id in $ids)]{_id,_rev}';
const unrelated=await client.fetch(unrelatedQuery,{ids:allIds});
const assets=await client.fetch('*[_type=="sanity.imageAsset" && sha1hash in $hashes]{_id,sha1hash}',{hashes:files.map(f=>f.hash)});
const byHash=new Map(assets.map(a=>[a.sha1hash,a._id]));
let uploaded=0;
for(const file of files){
  if(!byHash.has(file.hash)){
    const asset=await client.assets.upload('image',file.bytes,{filename:path.basename(file.file)});
    byHash.set(file.hash,asset._id);uploaded++;
  }
  console.log(`Image ready: ${file.url}`);
}
const ref=id=>({_type:'reference',_ref:id});
const image=url=>({_type:'image',asset:ref(byHash.get(files.find(f=>f.url===url).hash))});
const localized=(old,incoming)=>({...old,...Object.fromEntries(Object.entries(incoming??{}).filter(([,value])=>value!==''&&value!=null))});
function seo(old,incoming){
  return {...old,title:localized(old?.title,incoming?.title),description:localized(old?.description,incoming?.description),...(incoming?.image?{image:image(incoming.image)}:{})};
}
const prepared=[];
function prepare(type,item,fields){
  const id=idFor(type,item);
  const targets=group(type,item);
  if(!targets.some(d=>d._id===id)) targets.push({_id:id,_type:type});
  for(const old of targets)prepared.push({id:old._id,rev:old._rev,type,fields:fields(old)});
}
for(const p of productTypes)prepare('productType',p,old=>({
  name:localized(old.name,p.name),slug:{_type:'slug',current:p.slug},material:ref(materialId),
  markets:old.markets??p.markets,summary:localized(old.summary,p.summary),
  specTemplate:p.specTemplate.map((s,index)=>{
    const previous=old.specTemplate?.find(x=>x.key===s.key);
    return {...previous,_key:previous?._key??`spec-${index}`,key:s.key,label:localized(previous?.label,s.label),aliases:s.aliases,defaultValue:localized(previous?.defaultValue,s.defaultValue)};
  }),
  seo:seo(old.seo,p.seo)
}));
for(const s of skus)prepare('sku',s,old=>({
  slug:{_type:'slug',current:s.slug},code:s.code,material:ref(materialId),productType:ref(productIds.get(s.productTypeSlug)),
  colorName:localized(old.colorName,s.colorName),summary:localized(old.summary,s.summary),
  ...(s.hex?{hex:s.hex}:{}),heroImage:image(s.image),...(s.previewImage?{previewImage:image(s.previewImage)}:{}),
  ...(s.specs.length?{specs:s.specs.map((spec,index)=>({_key:`spec-${index}`,...spec}))}:{}),
  ...(s.caseGallery.length?{caseGallery:s.caseGallery.map((g,index)=>({_key:`case-${index}`,image:image(g.image),alt:g.alt}))}:{}),
  seo:seo(old.seo,s.seo)
}));
fs.writeFileSync(path.join(directory,'prepared-fields.json'),JSON.stringify(prepared,null,2));
let transaction=client.transaction();
for(const p of prepared){
  if(p.rev) transaction=transaction.patch(p.id,patch=>patch.ifRevisionId(p.rev).set(p.fields));
  else transaction=transaction.create({_id:p.id,_type:p.type,...p.fields});
}
await transaction.commit();
const after=await client.fetch(query,params);
for(const p of prepared){
  const actual=after.find(d=>d._id===p.id);
  assert.ok(actual,`Missing document: ${p.id}`);
  for(const [field,value] of Object.entries(p.fields)) assert.deepEqual(actual[field],value,`${p.id}.${field}`);
}
const unrelatedAfter=await client.fetch(unrelatedQuery,{ids:allIds});
const beforeRevisions=new Map(unrelated.map(d=>[d._id,d._rev]));
const changed=unrelatedAfter.filter(d=>beforeRevisions.get(d._id)!==d._rev).map(d=>d._id);
const report={...plan,verifiedDocuments:prepared.length,uploadedImages:uploaded,unrelatedRevisionChanges:changed,backup:before};
fs.writeFileSync(path.join(directory,'sanity-after.json'),JSON.stringify(after,null,2));
fs.writeFileSync(path.join(directory,'sync-result.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
