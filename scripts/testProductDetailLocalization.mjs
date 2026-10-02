import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const out = await build({stdin:{contents:`export {alignJapaneseDetails,requireUniqueMatch} from './src/lib/product-detail-localization'; export {applyJapaneseProductCategoryCopy} from './src/lib/japanese-copy'; export {productCategories} from './src/content/products/categories';`,resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',write:false});
const mod={exports:{}};
new Function('module','exports','require',out.outputFiles[0].text)(mod,mod.exports,require);
const {alignJapaneseDetails:align,requireUniqueMatch:unique,applyJapaneseProductCategoryCopy:apply,productCategories}=mod.exports;
const src=[{en:'A',ja:'old',zh:'中文A'},{en:'B',ja:'old',zh:'中文B'}];
const translations=[{source:'B',text:'乙'},{source:'A',text:'甲'}];
assert.deepEqual(align(src,translations,'test'),[{en:'A',ja:'甲',zh:'中文A'},{en:'B',ja:'乙',zh:'中文B'}]);
assert.throws(()=>align(src,translations.slice(1),'count'));
assert.throws(()=>align(src,[{source:'A',text:''},{source:'B',text:'乙'}],'blank'));
assert.throws(()=>align(src,[{source:'A',text:'甲'},{source:'A',text:'乙'}],'duplicate'));
assert.throws(()=>align(src,[{source:'C',text:'甲'},{source:'B',text:'乙'}],'unmatched'));
assert.throws(()=>unique([{en:'A'},{en:'A'}],x=>x.en==='A','duplicate'));
assert.throws(()=>unique([],()=>true,'missing'));
const categories=apply(productCategories);
let items=0, details=0;
for(const category of categories) for(const item of category.curvedCarouselImages??[]) {
  items++; for(const detail of item.details) {details++;assert.ok(detail.en.trim()&&detail.ja.trim());}
}
const shuffled=productCategories.map(c=>({...c,curvedCarouselImages:[...c.curvedCarouselImages].reverse().map(i=>({...i,details:[...i.details].reverse()}))}));
const translated=apply(shuffled);
for(const c of translated) for(const i of c.curvedCarouselImages) {
  const original=categories.find(x=>x.slug===c.slug).curvedCarouselImages.find(x=>x.title.en===i.title.en);
  for(const d of i.details) assert.equal(d.ja,original.details.find(x=>x.en===d.en).ja);
}
console.log(`PASS: ${items} products / ${details} bilingual details; blank, count, duplicate, source mismatch, product/detail reorder tests.`);
