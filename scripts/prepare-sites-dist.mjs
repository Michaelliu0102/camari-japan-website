import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const dist = resolve(root, "dist");
const bundle = resolve(root, ".open-next/sites-bundle");
const result = spawnSync(resolve(root, "node_modules/.bin/wrangler"), [
  "deploy", "--dry-run", "--outdir", bundle
], { cwd: root, stdio: "inherit" });
if (result.status !== 0) throw new Error("Cloudflare runtime bundling failed.");

// Deploy the bundled runtime, not the duplicated Next build and node_modules tree.
rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, "server"), { recursive: true });
mkdirSync(resolve(dist, ".openai"), { recursive: true });
const shim = 'import { createRequire as __sitesCreateRequire } from "node:module";\nglobalThis.require ??= __sitesCreateRequire("file:///worker/index.js");\n';
writeFileSync(resolve(dist, "server/index.js"), shim + readFileSync(resolve(bundle, "worker.js"), "utf8").replace(/^\/\/# sourceMappingURL=.*$/gm, ""));
for (const name of readdirSync(bundle)) {
  if (["worker.js", "worker.js.map", "README.md"].includes(name)) continue;
  cpSync(resolve(bundle, name), resolve(dist, "server", name), { recursive: true });
}
cpSync(resolve(root, ".open-next/assets"), resolve(dist, "assets"), { recursive: true, dereference: true });
cpSync(resolve(root, ".openai/hosting.json"), resolve(dist, ".openai/hosting.json"));

// A complete deployment must include every public file, not just JS and logos.
let count = 0;
function verify(directory) {
  for (const name of readdirSync(directory)) {
    const source = resolve(directory, name);
    if (statSync(source).isDirectory()) verify(source);
    else {
      const path = relative(resolve(root, "public"), source);
      const destination = resolve(dist, "assets", path);
      if (!existsSync(destination) || statSync(source).size !== statSync(destination).size) {
        throw new Error(`Public asset missing or incomplete: ${path}`);
      }
      count++;
    }
  }
}
verify(resolve(root, "public"));
console.log(`Verified all ${count} public files in Sites build output.`);

// Optimize delivery copies only. Preserve every URL, format, dimensions and metadata;
// the original public files remain untouched. This keeps full Sites archives below
// the upload limit without dropping any image from the deployed website.
sharp.concurrency(1);
const photographs = [];
function collectPhotographs(directory) {
  for (const name of readdirSync(directory)) {
    const path = resolve(directory, name);
    if (statSync(path).isDirectory()) collectPhotographs(path);
    else if (/\.jpe?g$/i.test(name)) photographs.push(path);
  }
}
collectPhotographs(resolve(dist, "assets"));
let savedBytes = 0;
let optimized = 0;
async function optimizePhotographs() {
  while (photographs.length) {
    const path = photographs.pop();
    const original = readFileSync(path);
    const before = await sharp(original).metadata();
    const compressed = await sharp(original).keepMetadata().jpeg({ quality: 90, mozjpeg: true }).toBuffer();
    if (compressed.length >= original.length) continue;
    const after = await sharp(compressed).metadata();
    if (before.width !== after.width || before.height !== after.height || (before.orientation ?? 1) !== (after.orientation ?? 1)) {
      throw new Error(`Image geometry changed: ${path}`);
    }
    writeFileSync(path, compressed);
    savedBytes += original.length - compressed.length;
    optimized++;
  }
}
await Promise.all(Array.from({ length: 4 }, optimizePhotographs));
console.log(`Optimized ${optimized} delivery images; saved ${(savedBytes / 1048576).toFixed(1)} MiB. Originals unchanged.`);
