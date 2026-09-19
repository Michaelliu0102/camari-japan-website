import assert from "node:assert/strict";
import {mkdtemp,rm,symlink} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {after,test} from "node:test";
import {build} from "esbuild";
const dir=await mkdtemp(path.join(tmpdir(),"camari-china-tests-"));
await symlink(path.resolve("node_modules"),`${dir}/node_modules`,"dir");
await build({stdin:{contents:`export * from './src/china/content';export * from './src/china/routes';export * from './src/china/loader';export * from './src/china/metadata';export * from './src/china/inquiry';export * from './src/china/defaults';`,resolveDir:process.cwd(),loader:"ts"},outfile:`${dir}/test.mjs`,bundle:true,format:"esm",platform:"node",packages:"external"});
const china=await import(pathToFileURL(`${dir}/test.mjs`).href);after(()=>rm(dir,{recursive:true,force:true}));
const material={_id:"material",_type:"material",slug:"leather",chinaStatus:"ready",markets:["china"],name:{en:"Leather",ja:"レザー",zh:"真皮"},introTitle:{zh:"标题"},introBody:{zh:"介绍"},seo:{title:{zh:"SEO 标题"},description:{zh:"SEO 描述"}}};
test("China preview is isolated from legacy routing and unavailable on international production",()=>{
 assert.deepEqual(china.resolveChinaRoute("/zh/materials",false,true),{type:"next"});
 assert.deepEqual(china.resolveChinaRoute("/zh/materials",false,false),{type:"blocked"});
 assert.deepEqual(china.resolveChinaRoute("/materials",false,true),{type:"legacy"});
 assert.deepEqual(china.resolveChinaRoute("/materials",true,false),{type:"rewrite",destination:"/zh/materials"});
 assert.deepEqual(china.resolveChinaRoute("/zh/materials",true,false),{type:"redirect",destination:"/materials"});
 assert.equal(china.resolveChinaRoute("/studio/structure",true,false).type,"legacy");
 assert.match(china.resolveChinaRoute("/ja/about",true,false).destination,/co\.jp\/about$/);
});
test("Publication requires complete Chinese copy, approval, and international or China market membership",()=>{
 assert.equal(china.chinaRecordVisible(material,false),true);
 assert.equal(china.chinaRecordVisible({...material,markets:["global","japan"]},false),true);
 assert.equal(china.chinaRecordVisible({...material,markets:["japan"]},false),false);
 assert.equal(china.chinaRecordVisible({...material,chinaStatus:"draft"},false),false);
 assert.equal(china.chinaRecordVisible({...material,introBody:{en:"English only"}},false),false);
 assert.equal(china.chinaRecordVisible({...material,chinaStatus:"draft",markets:[]},true),true);
 assert.equal(china.chinaRecordVisible({...material,chinaStatus:"hidden"},true),false);
 assert.equal(china.chineseText({en:"English",ja:"日本語"}),"");
});
test("Untranslated nested product, FAQ and news content cannot pass readiness checks",()=>{
 assert.ok(china.missingChineseFields({...material,faq:{en:[{question:"English question"}]}}).includes("faq.zh"));
 assert.deepEqual(china.missingChineseFields({...material,faq:{en:[{}],zh:[]}}),[]);
 assert.ok(china.missingChineseFields({...material,applications:[{name:{en:"Auto"}}]}).includes("applications[0].name.zh"));
 assert.ok(china.missingChineseFields({...material,_type:"news",title:{zh:"新闻"},summary:{zh:"摘要"},articleContent:{en:{introduction:["English"]}}}).includes("articleContent.zh.introduction"));
});
test("Unlisted parent materials and series cannot expose product or SKU detail routes",()=>{
 const series={...material,_id:"series",_type:"productType",slug:"nappa",materialSlug:"leather",summary:{zh:"系列说明"}};
 const sku={...series,_id:"sku",_type:"sku",slug:"color",productTypeSlug:"nappa",code:"1001"};
 assert.equal(china.filterChinaRecords([series,sku],false).length,0);
 assert.equal(china.filterChinaRecords([material,series,sku],false).length,3);
 assert.equal(china.filterChinaRecords([material,{...series,markets:["japan"]},sku],false).length,1);
});
test("China settings preserve independent business identity and draft status",()=>{
 const settings=china.mergeChinaSite(null);
 assert.equal(settings.status,"draft");assert.equal(settings.contact.companyName,"卡玛瑞国际有限公司");
 assert.equal(settings.legalName,"卡玛瑞贸易（浙江）有限公司");assert.equal(settings.contact.email,"info@camari-international.com");
 assert.equal(settings.contact.formEnabled,false);assert.equal(china.chinaPageReady("/",settings,[]),false);
 assert.equal(china.chinaPageReady("/",{...settings,status:"ready",home:{...settings.home,status:"ready"}},[]),true);
 assert.equal(china.chinaPageReady("/contact",{...settings,status:"ready",contact:{status:"ready"}},[]),false);
});
test("Chinese metadata uses the China domain and never indexes previews or search results",()=>{
 const metadata=china.chinaMetadata("/materials/leather",china.chinaSiteDefaults,true,material);
 assert.equal(metadata.robots.index,false);assert.equal(metadata.openGraph.locale,"zh_CN");
 assert.equal(metadata.alternates.canonical,"https://camari-international.com.cn/materials/leather");
 assert.deepEqual(Object.keys(metadata.alternates.languages),["zh-CN"]);
 assert.equal(china.chinaMetadata("/search",china.chinaSiteDefaults,false).robots.index,false);
});
test("Inquiry validation returns Chinese errors and does not silently accept incomplete payloads",()=>{
 assert.match(china.parseChinaInquiry({}).error,/请填写/);
 assert.match(china.parseChinaInquiry({name:"姓名",company:"公司",message:"需求",email:"bad"}).error,/邮箱/);
 assert.equal(china.parseChinaInquiry({name:"姓名",company:"公司",message:"需求",email:"test@example.com"}).ok,true);
 assert.equal(china.parseChinaInquiry({name:"姓名",company:"公司",message:"需求",email:"test@example.com",website:"spam"}).ok,false);
});

test("China routes cover every international page module without maintaining separate page templates", async()=>{
 const {readFile,readdir}=await import("node:fs/promises");
 const root=path.resolve("src/app/[locale]");
 const pages=(await readdir(root,{recursive:true})).filter(file=>file.endsWith("page.tsx")).map(file=>path.join(root,file)).sort();
 const registry=await readFile("src/china/page-registry.ts","utf8");
 const shared=[...registry.matchAll(/import\("([^\"]+)"\)/g)].map(match=>path.resolve("src/china",`${match[1]}.tsx`)).sort();
 assert.deepEqual(shared,pages);
 const layout=await readFile("src/app/zh/layout.tsx","utf8");
 assert.match(layout,/<GlobalNav locale="zh"/);assert.match(layout,/<Footer locale="zh"/);
 assert.doesNotMatch(layout,/ChinaShell/);
});
