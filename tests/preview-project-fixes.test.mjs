import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

async function load(name, env = {}) {
  const source = await readFile(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, process: { env } });
  return exports;
}

test("preview noindex requires the switch and the exact temporary site URL", async () => {
  const preview = "https://camari-japan-preview.y-liu804161.chatgpt.site";
  for (const [url, flag, expected] of [
    [preview, "true", true], [preview, undefined, false], [preview, "false", false],
    ["https://www.camari-international.com", "true", false],
    ["https://www.camari.co.jp", "true", false],
    ["https://www.camari.com.cn", "true", false]
  ]) {
    assert.equal((await load("preview-indexing", { NEXT_PUBLIC_SITE_URL: url, NEXT_PUBLIC_PREVIEW_NOINDEX: flag })).previewNoindexEnabled, expected);
  }
});

test("canonical cases retain CMS article corrections without merging obsolete product links", async () => {
  const { canonicalizeProjects, projectAliases } = await load("project-canonical");
  const makeCase = (slug, article) => ({ slug, title: { en: slug }, linkedArticles: [{ slug: article, name: { en: article } }], linkedMaterials: [], projectImages: ["/same.jpg"] });
  const input = Object.entries(projectAliases).flatMap(([alias, canonical]) => [makeCase(alias, "wrong-board-fr"), makeCase(canonical, "cms-selected-family")]);
  input.push(makeCase("unrelated-case", "own-family"));
  const before = JSON.stringify(input);
  const result = canonicalizeProjects(input);
  assert.equal(result.length, 5);
  for (const [alias, canonical] of Object.entries(projectAliases)) {
    assert.equal(result.some(p => p.slug === alias), false);
    assert.equal(result.find(p => p.slug === canonical).linkedArticles[0].slug, "cms-selected-family");
  }
  assert.equal(result.find(p => p.slug === "unrelated-case").linkedArticles[0].slug, "own-family");
  assert.equal(JSON.stringify(input), before);
  assert.equal(canonicalizeProjects([input[0]])[0].slug, input[0].slug);
});
