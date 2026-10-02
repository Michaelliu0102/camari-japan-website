import assert from "node:assert/strict";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";
import { build } from "esbuild";

const root = await mkdtemp(path.join(tmpdir(), "camari-editorial-test-"));
await symlink(path.resolve("node_modules"), path.join(root, "node_modules"), "dir");
await build({ stdin: { contents: `export * from './src/sanity/lib/adapters'; export * from './src/sanity/lib/download-page'; export * from './src/sanity/schemaTypes/marketValidation';`, resolveDir: process.cwd(), loader: "ts" }, outfile: `${root}/test.mjs`, bundle: true, platform: "node", format: "esm", packages: "external" });
const cms = await import(pathToFileURL(`${root}/test.mjs`).href);
after(() => rm(root, { recursive: true, force: true }));

test("homepage copy follows CMS while preserving line breaks and deliberately cleared text", () => {
  const home = cms.adaptHomePageSettings({ brandValueTitle: { en: "Line one\nLine two", ja: "新しい見出し" }, ctaBody: { en: "English", ja: "" } });
  assert.equal(home.brandValueTitle.en, "Line one\nLine two");
  assert.equal(home.brandValueTitle.ja, "新しい見出し");
  assert.equal(home.ctaBody.ja, "");
  assert.ok(home.brandValueBody.ja);
});

test("material FAQs use CMS edits and retain an empty array to hide a language", () => {
  const material = cms.adaptMaterial({slug: "alcantara", faq: { en: [], ja: [{question:"編集した質問", answer:"編集した回答"}] }});
  assert.deepEqual(material.faq.en, []);
  assert.equal(material.faq.ja[0].question, "編集した質問");
});

test("news supports new CMS articles, language visibility and intentionally empty sections", () => {
  const news = cms.adaptNewsItem({slug:"new-cms-article", availableLocales:["ja"], title:{en:"",ja:"新記事"}, articleContent:{ja:{introduction:["本文"], sections:[{title:"編集した節",body:["段落"],images:[]}]}}});
  assert.deepEqual(news.availableLocales, ["ja"]);
  assert.equal(news.articleContent.ja.sections[0].body[0], "段落");
  const cleared = cms.adaptNewsItem({articleContent:{ja:{introduction:[],sections:[]}}});
  assert.deepEqual(cleared.articleContent.ja.sections, []);
});

test("downloads follow edited descriptions and file URLs without reviving removed groups or files", () => {
  const settings = cms.adaptDownloadPage({groups:[{slug:"care",label:{en:"Care",ja:"ケア"},downloads:[{title:{en:"Guide",ja:"手引き"},description:{en:"Revised",ja:"更新済み"},href:"https://cdn.sanity.io/files/project/dataset/new.pdf",type:"care"}]}]});
  assert.equal(settings.groups[0].downloads[0].description.ja,"更新済み");
  assert.match(settings.groups[0].downloads[0].href,/new.pdf$/);
  assert.deepEqual(cms.adaptDownloadPage({groups:[]}).groups,[]);
  assert.deepEqual(cms.adaptProductType({slug:"alcantara-panel",downloads:[]}).downloads,[]);
  const product = cms.adaptProductType({slug:"alcantara-panel",downloads:[{title:{en:"New",ja:"更新"},description:{en:"Changed",ja:"変更"},href:"/new.pdf"}]});
  assert.equal(product.downloads[0].description.ja,"変更");
});

test("manufacturer colour names fall back to the original, with Japanese aliases taking precedence", () => {
  assert.equal(cms.adaptSku({colorName:{en:"Kayak",ja:""}}).colorName.ja,"Kayak");
  assert.equal(cms.adaptSku({colorName:{en:"Kayak",ja:"カヤック"}}).colorName.ja,"カヤック");
});

test("market validation requires Japanese for Japan products and SKUs, not Global-only records", async () => {
  const product={_type:"productType",markets:["global"],name:{en:"Original",ja:""},summary:{en:"Description",ja:""}};
  assert.equal(await cms.validateMarketContent(product,{}),true);
  assert.match(await cms.validateMarketContent({...product,markets:["japan"]},{}),/Japanese copy is required/);
  const context=markets=>({getClient:()=>({withConfig:()=>({fetch:async()=>({markets})})})});
  const sku={_type:"sku",productType:{_ref:"article"},summary:{en:"Description",ja:""}};
  assert.equal(await cms.validateMarketContent(sku,context(["global"])),true);
  assert.match(await cms.validateMarketContent(sku,context(["japan"])),/summary/);
  assert.equal(await cms.validateMarketContent({...sku,summary:{en:"Description",ja:"説明"},colorName:{en:"Kayak",ja:""}},context(["japan"])),true);
});

test("clearing managed editorial content cannot restore an old local section", () => {
  assert.deepEqual(cms.adaptMaterial({slug:"alcantara",faq:null}).faq,{});
  assert.equal(cms.adaptNewsItem({slug:"aquapelle-waterborne-microfiber-launch",articleContent:null}).articleContent,undefined);
  assert.deepEqual(cms.adaptProductType({slug:"alcantara-panel",editorialDownloadsMigrated:true,downloads:null}).downloads,[]);
});
