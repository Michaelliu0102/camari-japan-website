import assert from "node:assert/strict";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { build } from "esbuild";
import { renderToStaticMarkup } from "react-dom/server";

test("Chinese About renders the complete international page, with translated copy and identical assets", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "camari-about-parity-"));
  try {
    await symlink(path.resolve("node_modules"), path.join(dir, "node_modules"), "dir");
    const stubs = {
      "next/image": 'import {createElement} from "react"; export default ({src,alt})=>createElement("img",{src,alt});',
      "@/components/OemLogoLoop": 'export const OemLogoLoop=()=>null;',
      "@/components/ShinyHeading": 'export const ShinyHeading=()=>null;',
      "@/components/CTASection": 'import {createElement} from "react"; export const CTASection=({title,body})=>createElement("aside",null,title,body);',
      "@/lib/metadata": 'export const createPageMetadata=(value)=>value;',
      "@/sanity/lib/loaders": 'export const loadAboutPageSettings=async()=>({}); export const loadHomePageSettings=async()=>({showroomBackgroundImage:"/shared-showroom.jpg"});',
    };
    await build({
      entryPoints: ["src/app/[locale]/about/page.tsx"], outfile: path.join(dir,"page.mjs"),
      bundle: true, format: "esm", platform: "node", packages: "external", jsx: "automatic",
      plugins: [{ name: "page-boundaries", setup(builder) {
        builder.onResolve({filter: /.*/}, (args) => args.path in stubs ? {path:args.path,namespace:"stub"} : undefined);
        builder.onLoad({filter:/.*/,namespace:"stub"}, (args) => ({contents:stubs[args.path],loader:"js",resolveDir:process.cwd()}));
      }}],
    });
    const { default: AboutPage } = await import(pathToFileURL(path.join(dir,"page.mjs")).href);
    const en = renderToStaticMarkup(await AboutPage({params:Promise.resolve({locale:"en"})}));
    const zh = renderToStaticMarkup(await AboutPage({params:Promise.resolve({locale:"zh"})}));
    const images = html => [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match=>match[1]);
    assert.equal(images(en).length, 6);
    assert.deepEqual(images(zh), images(en));
    assert.equal((zh.match(/<section\b/g)||[]).length,(en.match(/<section\b/g)||[]).length);
    for (const text of ["关于卡玛瑞", "一体化供应网络", "官方经销商", "本地服务与全球协作", "快速原型开发与内部打样", "汽车级制造", "全球物流与仓储", "10,000 m²", "1,500+", "盛华", "2000", "2014", "IATF 16949", "ISO 9001"]) assert.ok(zh.includes(text),text);
    for (const text of ["Established in 2014", "Global footprint", "Central warehousing", "Located directly within our China headquarters", "Today, operating strictly", "Speak with our specialists"]) assert.ok(!zh.includes(text),`Untranslated: ${text}`);
    assert.ok(en.includes("Established in 2014 and headquartered in Hong Kong"));
  } finally { await rm(dir,{recursive:true,force:true}); }
});
