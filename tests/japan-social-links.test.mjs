import assert from "node:assert/strict";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { build } from "esbuild";
import { renderToStaticMarkup } from "react-dom/server";

test("Japanese footer renders only configured Instagram and TikTok accounts", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "camari-sns-"));
  try {
    await symlink(path.resolve("node_modules"), `${dir}/node_modules`, "dir");
    await build({
      entryPoints: ["src/components/Footer.tsx"], outfile: `${dir}/footer.mjs`,
      bundle: true, format: "esm", platform: "node", packages: "external", jsx: "automatic",
      plugins: [{ name: "boundaries", setup(builder) {
        builder.onResolve({ filter: /^next\/(link|image)$/ }, args => ({ path: args.path, namespace: "next" }));
        builder.onLoad({ filter: /.*/, namespace: "next" }, args => ({ resolveDir: process.cwd(), contents: `import {createElement} from 'react'; export default ({children, ...props}) => createElement('${args.path.endsWith("link") ? "a" : "img"}', props, children);` }));
        builder.onResolve({ filter: /(?:FooterNewsletterForm|CookiePreferencesButton)$/ }, args => ({ path: args.path.split("/").pop(), namespace: "empty" }));
        builder.onLoad({ filter: /.*/, namespace: "empty" }, args => ({ contents: `export const ${args.path} = () => null;` }));
        builder.onResolve({ filter: /sanity\/lib\/client$/ }, () => ({ path: "client", namespace: "mock" }));
        builder.onLoad({ filter: /.*/, namespace: "mock" }, () => ({ contents: `export const getSanityClient = () => ({withConfig: () => ({fetch: async () => {
          if (globalThis.snsFailure) throw new Error('offline');
          return globalThis.snsAccounts ?? null;
        }})});` }));
        builder.onResolve({ filter: /lib\/site-config$/ }, () => ({ path: "site", namespace: "mockSite" }));
        builder.onLoad({ filter: /.*/, namespace: "mockSite" }, () => ({ contents: `export const siteConfig = {get siteKey() {return globalThis.snsSiteKey ?? 'global'}, siteName: 'CAMARI'};` }));
      }}]
    });
    const { Footer } = await import(pathToFileURL(`${dir}/footer.mjs`).href);
    const render = async locale => renderToStaticMarkup(await Footer({ locale }));
    const ja = await render("ja");
    assert.match(ja, /href="https:\/\/www.instagram.com\/camari_japan_offical\/"/);
    assert.match(ja, /href="https:\/\/www.tiktok.com\/@camari.japan"/);
    for (const platform of ["X", "LinkedIn", "LINE", "Facebook", "YouTube", "小红书"]) {
      assert.ok(!ja.includes(`aria-label="${platform}"`));
    }
    assert.match(await render("en"), /aria-label="LinkedIn"/);
    assert.match(await render("zh"), /aria-label="抖音"/);
    globalThis.snsSiteKey = "japan";
    assert.match(await render("en"), /camari_japan_offical/);
    assert.doesNotMatch(await render("en"), /aria-label="LinkedIn"/);
    assert.match(await render("zh"), /aria-label="抖音"/);
    globalThis.snsAccounts = { instagram: "https://www.instagram.com/updated/", tiktok: "" };
    const edited = await render("ja");
    assert.match(edited, /href="https:\/\/www.instagram.com\/updated\/"/);
    assert.doesNotMatch(edited, /aria-label="TikTok"/);
    globalThis.snsAccounts = { instagram: "javascript:alert(1)", tiktok: "" };
    assert.doesNotMatch(await render("ja"), /javascript:|aria-label="Instagram"/);
    globalThis.snsFailure = true;
    assert.match(await render("ja"), /camari_japan_offical/);
  } finally {
    delete globalThis.snsAccounts;
    delete globalThis.snsFailure;
    delete globalThis.snsSiteKey;
    await rm(dir, { recursive: true, force: true });
  }
});
