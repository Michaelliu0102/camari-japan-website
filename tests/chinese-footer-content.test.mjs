import assert from "node:assert/strict";
import {mkdtemp, readFile, rm, symlink} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {test} from "node:test";
import {build} from "esbuild";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";

test("Chinese footer destinations, subscription and consent labels are fully localized", async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),"camari-footer-zh-"));
  try {
    await symlink(path.resolve("node_modules"),`${dir}/node_modules`,"dir");
    await build({
      stdin:{contents:`export {default as privacy} from './src/app/[locale]/privacy-policy/page';
        export {default as cookies} from './src/app/[locale]/cookie-policy/page';
        export {default as terms} from './src/app/[locale]/site-policy/page';
        export {FooterNewsletterForm} from './src/components/FooterNewsletterForm';
        export {CTAMessageDrawer} from './src/components/CTAMessageDrawer';
        export {consentCopyForTest} from './src/components/ConsentManager';`,resolveDir:process.cwd(),loader:"ts"},
      outfile:`${dir}/test.mjs`,bundle:true,format:"esm",platform:"node",packages:"external",jsx:"automatic",
      plugins:[{name:"test-boundaries",setup(builder){
        builder.onResolve({filter:/^next\/(link|navigation)$/},args=>({path:`${args.path}.js`,external:true}));
        builder.onResolve({filter:/^@\/lib\/metadata$/},()=>({path:"metadata",namespace:"stub"}));
        builder.onLoad({filter:/.*/,namespace:"stub"},()=>({contents:'export const createPageMetadata = value => value;'}));
        builder.onLoad({filter:/ConsentManager\.tsx$/},async args=>({contents:(await readFile(args.path,"utf8"))+'\nexport {copy as consentCopyForTest};',loader:"tsx"}));
      }}],
    });
    const mod=await import(pathToFileURL(`${dir}/test.mjs`).href);
    for(const [key,title] of [["privacy","隐私政策"],["cookies","Cookie 政策"],["terms","使用条款与网站政策"]]) {
      const zh=renderToStaticMarkup(await mod[key]({params:Promise.resolve({locale:"zh"})}));
      const en=renderToStaticMarkup(await mod[key]({params:Promise.resolve({locale:"en"})}));
      assert.ok(zh.includes(title));
      assert.ok(zh.includes("卡玛瑞贸易（浙江）有限公司"));
      assert.ok(zh.includes("info@camari-international.com"));
      assert.doesNotMatch(zh,/[ぁ-ゟ゠-ヿ]/);
      assert.doesNotMatch(zh,/Google Maps|info@camari-international\.co\.jp/);
      assert.equal((zh.match(/<h2\b/g)||[]).length,(en.match(/<h2\b/g)||[]).length+(key==="privacy"?1:0),`${key}: all sections translated`);
      if(key==="privacy") {
        assert.match(zh,/隐私政策与使用条款/);
        assert.match(zh,/id="terms-of-use"/);
        assert.match(zh,/未经许可，不得复制、分发或修改/);
      }
    }
    const form=renderToStaticMarkup(createElement(mod.FooterNewsletterForm,{locale:"zh"}));
    assert.match(form,/placeholder="请输入邮箱地址"/);
    const drawer=renderToStaticMarkup(createElement(mod.CTAMessageDrawer,{locale:"zh",buttonClassName:"",buttonLabel:"给我们留言"}));
    for (const label of ["给我们留言","工作邮箱","定制项目","留言／项目要求","关闭留言表单"]) assert.ok(drawer.includes(label),label);
    assert.doesNotMatch(drawer,/Write us a message|Business Email|Select a country|Custom Projects|Tell us about/);
    assert.doesNotMatch(drawer, /<select|国家／地区|请选择国家或地区/);
    const {zh,en}=mod.consentCopyForTest;
    assert.deepEqual(Object.keys(zh).sort(),Object.keys(en).sort());
    for(const text of Object.values(zh)) { assert.match(text,/[\u4e00-\u9fff]/); assert.doesNotMatch(text,/[ぁ-ゟ゠-ヿ]|Google/); }
    assert.equal(zh.save,"保存选择"); assert.equal(zh.alwaysOn,"始终启用");
  } finally {await rm(dir,{recursive:true,force:true});}
});
