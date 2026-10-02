import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createClient} from '@sanity/client';
import {getCliClient} from 'sanity/cli';

const root=process.cwd();
for(const line of fs.readFileSync(path.join(root,'.env.local'),'utf8').split(/\r?\n/)){
  const m=line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');
}
const dir=path.join(root,'outputs/skai-sanity-sync');
const catalog=JSON.parse(fs.readFileSync(path.join(dir,'catalog.json'),'utf8'));
const apply=process.argv.includes('--apply');
const config={projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID??'bfjhbpbx',dataset:process.env.NEXT_PUBLIC_SANITY_DATASET??'production',apiVersion:'2026-06-09',useCdn:false,perspective:'raw'};
const client=process.env.SANITY_AUTH_TOKEN?createClient({...config,token:process.env.SANITY_AUTH_TOKEN}):getCliClient({apiVersion:config.apiVersion}).withConfig(config);
const typeSlugs=catalog.productTypes.map(p=>p.slug),skuSlugs=catalog.skus.map(s=>s.slug);
if(new Set(typeSlugs).size!==typeSlugs.length||new Set(skuSlugs).size!==skuSlugs.length)throw Error('Duplicate workbook slugs');
if(catalog.productTypes.some(p=>p.materialSlug!=='vegan-leather')||catalog.skus.some(s=>!typeSlugs.includes(s.productTypeSlug)))throw Error('Unexpected catalog scope');
const query='*[_type == "productType" && slug.current in $typeSlugs || _type == "sku" && (productType->slug.current in $typeSlugs || slug.current in $skuSlugs)]';
const docs=await client.fetch(query,{typeSlugs,skuSlugs});
const materials=await client.fetch('*[_type=="material" && slug.current=="vegan-leather" && !(_id in path("drafts.**"))]');
if(materials.length!==1)throw Error('Expected exactly one existing vegan-leather material');
const materialId=materials[0]._id;
const group=(type,slug)=>docs.filter(d=>d._type===type&&d.slug?.current===slug);
function idFor(type,slug){const matches=group(type,slug);const ids=[...new Set(matches.map(d=>d._id.replace(/^drafts\./,'')))];if(ids.length>1)throw Error(`Duplicate remote slug: ${slug}`);return ids[0]??`${type}-${slug}`;}
const ids=new Set([...catalog.productTypes.map(p=>idFor('productType',p.slug)),...catalog.skus.map(s=>idFor('sku',s.slug))]);
const stale=docs.filter(d=>d._type==='sku'&&!skuSlugs.includes(d.slug?.current));
const paths=[...new Set([...catalog.productTypes.map(p=>p.seo?.image),...catalog.skus.flatMap(s=>[s.image,s.swatchImage,s.previewImage,s.seo?.image])].filter(Boolean))];
const files=paths.map(url=>{if(!url.startsWith('/uploads/veganleather/skai/'))throw Error('Unexpected image path');const file=path.join(root,'public',url);const bytes=fs.readFileSync(file);return {url,file,bytes,hash:crypto.createHash('sha1').update(bytes).digest('hex')};});
const plan={projectId:config.projectId,dataset:config.dataset,series:catalog.productTypes.length,colors:catalog.skus.length,specifications:catalog.productTypes.reduce((n,p)=>n+p.specTemplate.length,0),images:files.length,existing:docs.filter(d=>ids.has(d._id)).length,drafts:docs.filter(d=>d._id.startsWith('drafts.')&&ids.has(d._id.replace(/^drafts\./,''))).length,staleSkus:stale.map(d=>({id:d._id,slug:d.slug?.current})),mode:apply?'apply':'dry-run'};
console.log(JSON.stringify(plan,null,2));
fs.writeFileSync(path.join(dir,'plan.json'),JSON.stringify(plan,null,2));
if(!apply)process.exit(0);
const unrelated=await client.fetch('*[_type in ["material","productType","sku"] && !(_id in $ids)]{_id,_rev}',{ids:[...ids,...[...ids].map(id=>'drafts.'+id)]});
const backup=path.join(dir,`before-${Date.now()}.json`);
fs.writeFileSync(backup,JSON.stringify(docs,null,2));
const assets=await client.fetch('*[_type=="sanity.imageAsset" && sha1hash in $hashes]{_id,sha1hash}',{hashes:files.map(f=>f.hash)});
const byHash=new Map(assets.map(a=>[a.sha1hash,a._id]));
let uploaded=0,processed=0;
let cursor=0;
await Promise.all(Array.from({length:4},async()=>{while(cursor<files.length){const f=files[cursor++];if(!byHash.has(f.hash)){const a=await client.assets.upload('image',f.bytes,{filename:path.basename(f.file)});byHash.set(f.hash,a._id);uploaded++;}processed++;if(processed%25===0)console.log(`Images ready: ${processed}/${files.length}`);}}));
const ref=id=>({_type:'reference',_ref:id});
const image=url=>({_type:'image',asset:ref(byHash.get(files.find(f=>f.url===url).hash))});
const localized=(old,incoming)=>({...old,...Object.fromEntries(Object.entries(incoming??{}).filter(([,v])=>v!==''&&v!=null))});
const prepared=[];
function prepare(type,item,fields){
  const id=idFor(type,item.slug);
  const targets=group(type,item.slug);
  if(!targets.some(d=>d._id===id))targets.push({_id:id,_type:type});
  for(const old of targets)prepared.push({id:old._id,rev:old._rev,type,fields:fields(old)});
}
for(const p of catalog.productTypes)prepare('productType',p,old=>({
  slug:{_type:'slug',current:p.slug},material:ref(materialId),markets:p.markets,
  name:localized(old.name,p.name),summary:localized(old.summary,p.summary),
  specTemplate:p.specTemplate.map(f=>({_key:`spec-${f.key}`,key:f.key,label:localized(old.specTemplate?.find(x=>x.key===f.key)?.label,f.label),aliases:f.aliases,defaultValue:localized(old.specTemplate?.find(x=>x.key===f.key)?.defaultValue,f.defaultValue)})),
  seo:{...old.seo,title:localized(old.seo?.title,p.seo.title),description:localized(old.seo?.description,p.seo.description),image:image(p.seo.image)}
}));
for(const s of catalog.skus)prepare('sku',s,old=>({
  slug:{_type:'slug',current:s.slug},material:ref(materialId),productType:ref(idFor('productType',s.productTypeSlug)),code:s.code,
  colorName:localized(old.colorName,s.colorName),summary:localized(old.summary,s.summary),
  heroImage:image(s.image),previewImage:image(s.previewImage??s.image),
  seo:{...old.seo,title:localized(old.seo?.title,s.seo.title),description:localized(old.seo?.description,s.seo.description),image:image(s.seo.image??s.image)}
}));
// One atomic catalog transaction; revision guards reject concurrent editorial changes.
let tx=client.transaction();
for(const p of prepared){if(p.rev)tx=tx.patch(p.id,patch=>patch.ifRevisionId(p.rev).set(p.fields));else tx=tx.create({_id:p.id,_type:p.type,...p.fields});}
await tx.commit();
const after=await client.fetch(query,{typeSlugs,skuSlugs});
for(const p of prepared){const d=after.find(d=>d._id===p.id);if(!d)throw Error(`Missing synchronized document ${p.id}`);for(const [key,value] of Object.entries(p.fields)){if(JSON.stringify(d[key])!==JSON.stringify(value)){
  const canonical=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b))):x);
  if(canonical(d[key])!==canonical(value))throw Error(`Verification failed: ${p.id}.${key}`);
}}}
const unrelatedAfter=await client.fetch('*[_type in ["material","productType","sku"] && !(_id in $ids)]{_id,_rev}',{ids:[...ids,...[...ids].map(id=>'drafts.'+id)]});
const changedUnrelated=unrelatedAfter.filter(d=>unrelated.find(x=>x._id===d._id)?._rev!==d._rev);
const report={...plan,verifiedDocuments:prepared.length,uploadedImages:uploaded,reusedImages:files.length-uploaded,unrelatedRevisionChanges:changedUnrelated.map(d=>d._id),backup};
fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
