import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const media = JSON.parse(readFileSync(new URL("../src/generated/china-media.json", import.meta.url)));
const source = readFileSync(new URL("../src/lib/china-media.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function loader(site = "china", origin = "http://media.camari.com.cn") {
  const context = { exports: {}, require: () => ({ default: media }), process: { env: { NEXT_PUBLIC_SITE_KEY: site, NEXT_PUBLIC_CHINA_MEDIA_URL: origin } } };
  vm.runInNewContext(compiled, context);
  return context.exports.chinaMediaUrl;
}

test("China uses CDN variants directly for local and Sanity sources", () => {
  const resolve = loader();
  const local = "/uploads/veganleather/home-vegan-leather.jpg";
  assert.match(resolve(local, 320), /^http:\/\/media\.camari\.com\.cn\/images-v1\/[a-f0-9]+-320\.webp$/);
  assert.match(resolve(local, 640), /-768\.webp$/);
  assert.match(resolve(local, 3840), /-1920\.webp$/);
  const sanity = Object.keys(media).find(url => url.startsWith("https://cdn.sanity.io") && media[url].ext === "webp");
  assert.equal(resolve(`${sanity}?w=1600&auto=format`), resolve(sanity));
});

test("Encoded Chinese paths resolve and QR codes use lossless originals", () => {
  const resolve = loader();
  assert.equal(resolve(encodeURI("/uploads/home/营业执照.png")), resolve("/uploads/home/营业执照.png"));
  assert.match(resolve("/uploads/contact/wechat-sales.jpg", 320), /\.png$/);
  assert.equal(resolve("/uploads/contact/wechat-official.jpg", 96), resolve("/uploads/contact/wechat-official.jpg", 1920));
});

test("International builds, unconfigured origins, and new images preserve working URLs", () => {
  const src = "/uploads/veganleather/home-vegan-leather.jpg";
  assert.equal(loader("japan")(src), src);
  assert.equal(loader("global")(src), src);
  assert.equal(loader("china", "")(src), src);
  assert.equal(loader()("/uploads/not-yet-mirrored.jpg"), "/uploads/not-yet-mirrored.jpg");
});
