import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Keep originals untouched. Versioned, content-addressed files can be cached
// indefinitely by OSS/CDN without stale replacements at the same URL.
const root = process.cwd();
const work = path.join(root, "outputs/china-media-20260922");
const prefix = "images-v1";
const destination = path.join(work, prefix);
const manifest = {};
const sources = new Map();
const stats = { originals: 0, output: 0, files: 0, largest: 0 };
await mkdir(destination, { recursive: true });
async function add(file, url) {
  const bytes = await readFile(file);
  const hash = createHash("sha1").update(bytes).digest("hex");
  if (!sources.has(hash)) sources.set(hash, { file, bytes, urls: [] });
  sources.get(hash).urls.push(url);
}
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(jpe?g|png|webp|gif|svg)$/i.test(entry.name)) {
      await add(file, "/" + path.relative(path.join(root, "public"), file));
    }
  }
}
await walk(path.join(root, "public"));
const assets = JSON.parse(await readFile(path.join(work, "sanity-assets.json"), "utf8")).result;
for (const asset of assets) {
  const hash = asset._id.split("-")[1];
  if (sources.has(hash)) sources.get(hash).urls.push(asset.url);
  else await add(path.join(work, "sources", path.basename(new URL(asset.url).pathname)), asset.url);
}
const queue = [...sources.entries()];
let count = 0;
async function worker() {
  while (queue.length) {
    const [hash, source] = queue.shift();
    const vector = /\.svg$/i.test(source.file);
    const qr = source.urls.some(url => /\/contact\/wechat-/.test(url));
    const ext = vector ? "svg" : qr ? "png" : "webp";
    const base = `${prefix}/${hash}`;
    for (const url of source.urls) manifest[url] = { base, ext };
    stats.originals += source.bytes.length;
    if (vector || qr) {
      const bytes = vector ? source.bytes : await sharp(source.bytes).rotate().png({ compressionLevel: 9 }).toBuffer();
      await writeFile(path.join(destination, `${hash}.${ext}`), bytes);
      stats.output += bytes.length; stats.files++; stats.largest = Math.max(stats.largest, bytes.length);
    } else {
      for (const width of [320, 768, 1920]) {
        let bytes;
        let bound = width;
        for (let quality = 82; ; quality -= 8) {
          bytes = await sharp(source.bytes).rotate().resize({ width: bound, height: bound, fit: "inside", withoutEnlargement: true }).webp({ quality: Math.max(quality, 50), effort: 5 }).toBuffer();
          if (bytes.length <= 400000) break;
          if (quality <= 50) bound = Math.floor(bound * .85);
        }
        await writeFile(path.join(destination, `${hash}-${width}.webp`), bytes);
        stats.output += bytes.length; stats.files++; stats.largest = Math.max(stats.largest, bytes.length);
      }
    }
    if (++count % 100 === 0) console.log(`Prepared ${count}/${sources.size} images`);
  }
}
await Promise.all(Array.from({ length: 3 }, worker));
await mkdir(path.join(root, "src/generated"), { recursive: true });
await writeFile(path.join(root, "src/generated/china-media.json"), JSON.stringify(manifest));
await writeFile(path.join(work, "compression-report.json"), JSON.stringify({ ...stats, uniqueImages: sources.size, mappedUrls: Object.keys(manifest).length }, null, 2));
console.log(stats);
