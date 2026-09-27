import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createClient } from '@sanity/client';

// Narrow, user-approved migration. No catalogue-wide sync or asset deletion.
const root = process.cwd();
const out = path.resolve(root, 'outputs/sanity-project-sync-20260927');
let phase = 'initialize';
const aliases = {
  'aston-martin-heritage-5362': 'leather-aston-martin-heritage-5362',
  'leather-juguar-heritage-5365': 'jaguar-heritage-5365',
  'alcantara-louis-vitton-alcantara-master-1234': 'louis-vuitton-alcantara-master-1234',
  'alcantara-hd2': 'hd2'
};
const families = {
  'weimo-alcantara-1112': 'alcantara-panel',
  'chopper-alcantara-6422-masterfr': 'alcantara-master',
  'hiby-alcantara-3096th': 'alcantara-04',
  'wallpanel-alcantara-master-4175-6408': 'alcantara-master',
  'louis-vuitton-alcantara-master-1234': 'alcantara-master'
};
const slugs = [...new Set([...Object.keys(aliases), ...Object.values(aliases),
  ...Object.keys(families).flatMap(slug => slug.startsWith('louis-') ? [slug] : [slug, `alcantara-${slug}`])])];
const ids = slugs.map(slug => `projectCase-${slug}`);
const draftIds = ids.map(id => `drafts.${id}`);
const archiveIds = Object.keys(aliases).map(slug => `projectCase-${slug}`);
const strip = doc => Object.fromEntries(Object.entries(doc).filter(([key]) => !['_rev', '_createdAt', '_updatedAt'].includes(key)));

async function main() {
  process.loadEnvFile(path.join(root, '.env.local'));
  assert(process.env.SANITY_AUTH_TOKEN, 'Missing write credential');
  const client = createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'bfjhbpbx', dataset:process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production', apiVersion:'2026-06-09',token:process.env.SANITY_AUTH_TOKEN,useCdn:false,perspective:'raw'});
  assert.equal(client.config().projectId, 'bfjhbpbx');
  assert.equal(client.config().dataset, 'production');
  await fs.mkdir(out, {recursive:true});
  const write = (name,data,exclusive=false) => fs.writeFile(path.join(out,name),JSON.stringify(data,null,2)+'\n',{flag:exclusive?'wx':'w'});
  phase = 'read current records and references';
  const docs = await client.fetch('*[_id in $ids]', {ids:[...ids,...draftIds]});
  const inbound = await client.fetch('*[references($ids)]{_id,_type}',{ids:archiveIds});
  const products = await client.fetch('*[_type=="productType" && _id in $ids]{_id,"slug":slug.current}',{ids:[...new Set(Object.values(families))].map(slug=>`productType-${slug}`)});

  if (process.argv.includes('--verify')) {
    const result = JSON.parse(await fs.readFile(path.join(out,'result.json'),'utf8'));
    for (const expected of result.expectedDocuments) assert.deepEqual(strip(docs.find(d=>d._id===expected._id)),expected);
    for (const id of archiveIds) assert(!docs.some(d=>d._id===id));
    console.log(JSON.stringify({verified:true,publishedDuplicates:0,archivedDrafts:archiveIds.length,transactionId:result.transactionId}));
    return;
  }

  if (!process.argv.includes('--apply')) {
    assert.equal(docs.length, ids.length, 'Unexpected missing document or existing draft');
    assert.equal(inbound.length, 0, 'Inbound references require review');
    assert.equal(products.length, 3, 'Approved product destination missing');
    const patches=[];
    const archives=[];
    for (const doc of docs) {
      const slug=doc.slug.current;
      if (aliases[slug]) {
        archives.push({sourceId:doc._id,canonicalId:`projectCase-${aliases[slug]}`,draft:{...strip(doc),_id:`drafts.${doc._id}`,replacedBy:{_type:'reference',_ref:`projectCase-${aliases[slug]}`,_weak:true}}});
        continue;
      }
      const family=slug.replace(/^alcantara-/,'');
      const product=families[family];
      if (!product) continue;
      const set={};
      const ref=`productType-${product}`;
      if (JSON.stringify((doc.linkedArticles??[]).map(a=>a._ref))!==JSON.stringify([ref])) {
        set.linkedArticles=[{_type:'reference',_ref:ref,_key:`approved-${product}`}];
      }
      if (family==='chopper-alcantara-6422-masterfr') {
        set.linkedArticleLabels=[{_type:'projectArticleLabel',_key:'master-fr',article:{_type:'reference',_ref:ref},name:{en:'Alcantara Master FR',ja:'Alcantara Master FR',zh:'Alcantara Master FR'}}];
      }
      if (Object.keys(set).length) patches.push({id:doc._id,set});
    }
    await write('before.json',{at:new Date().toISOString(),documents:docs,inbound,products},true);
    await write('plan.json',{at:new Date().toISOString(),patches,archives},true);
    console.log(JSON.stringify({mode:'plan',documents:docs.length,patches:patches.map(p=>({id:p.id,fields:Object.keys(p.set)})),archives:archives.map(a=>({id:a.sourceId,canonicalId:a.canonicalId})),inboundReferences:inbound.length}));
    return;
  }

  phase = 'validate revisions against saved plan';
  const before=JSON.parse(await fs.readFile(path.join(out,'before.json'),'utf8'));
  const plan=JSON.parse(await fs.readFile(path.join(out,'plan.json'),'utf8'));
  assert.equal(inbound.length,0);
  assert.equal(docs.length,before.documents.length);
  for(const d of before.documents) assert.equal(docs.find(x=>x._id===d._id)?._rev,d._rev,'CMS changed after backup');
  let tx=client.transaction();
  const expected=docs.map(strip);
  for(const patch of plan.patches){
    const original=docs.find(d=>d._id===patch.id);
    tx=tx.patch(patch.id,p=>p.ifRevisionId(original._rev).set(patch.set));
    Object.assign(expected.find(d=>d._id===patch.id),patch.set);
  }
  for(const archive of plan.archives){
    const original=docs.find(d=>d._id===archive.sourceId);
    tx=tx.patch(original._id,p=>p.ifRevisionId(original._rev).set({slug:original.slug}));
    tx=tx.create(archive.draft).delete(original._id);
    expected.splice(expected.findIndex(d=>d._id===original._id),1,archive.draft);
  }
  phase = 'commit approved transaction';
  const receipt=await tx.commit({visibility:'sync'});
  await write('receipt.json',{at:new Date().toISOString(),transactionId:receipt.transactionId});
  phase = 'verify exact field changes';
  const after=await client.fetch('*[_id in $ids]',{ids:[...ids,...draftIds]});
  await write('after.json',{at:new Date().toISOString(),documents:after});
  assert.equal(after.length,expected.length);
  for(const d of expected) assert.deepEqual(strip(after.find(a=>a._id===d._id)),d,'Unexpected document change');
  for(const id of archiveIds) assert(!after.some(d=>d._id===id));
  const result={at:new Date().toISOString(),transactionId:receipt.transactionId,patchedDocuments:plan.patches.length,unpublishedDuplicates:plan.archives.length,recoverableDrafts:plan.archives.map(a=>a.draft._id),onlyPlannedFieldsChanged:true,expectedDocuments:expected};
  await write('result.json',result);
  console.log(JSON.stringify({...result,expectedDocuments:undefined}));
}

main().catch(error=>{
  // Never print the SDK error/request object: it can contain Authorization.
  console.error(JSON.stringify({error:'Approved CMS sync did not complete',phase,type:error?.name,status:error?.statusCode??null,code:error?.code??null}));
  process.exitCode=1;
});
