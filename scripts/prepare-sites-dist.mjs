import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const dist = resolve(root, "dist");
const bundle = resolve(root, ".open-next/sites-bundle");
const result = spawnSync(resolve(root, "node_modules/.bin/wrangler"), [
  "deploy", "--dry-run", "--outdir", bundle
], { cwd: root, stdio: "inherit" });
if (result.status !== 0) throw new Error("Cloudflare runtime bundling failed.");

// Keep one bundled runtime and the complete set of public URLs. Large media
// already uploaded to Sanity is served through its immutable, original CDN URL.
rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, "server"), { recursive: true });
mkdirSync(resolve(dist, ".openai"), { recursive: true });
const shim = 'import { createRequire as __sitesCreateRequire } from "node:module";\nglobalThis.require ??= __sitesCreateRequire("file:///worker/index.js");\n';
writeFileSync(resolve(dist, "server/app.js"), shim + readFileSync(resolve(bundle, "worker.js"), "utf8").replace(/^\/\/# sourceMappingURL=.*$/gm, ""));
for (const name of readdirSync(bundle)) {
  if (["worker.js", "worker.js.map", "README.md"].includes(name)) continue;
  cpSync(resolve(bundle, name), resolve(dist, "server", name), { recursive: true });
}
cpSync(resolve(root, ".open-next/assets"), resolve(dist, "assets"), { recursive: true, dereference: true });
cpSync(resolve(root, ".openai/hosting.json"), resolve(dist, ".openai/hosting.json"));

const manifestPath = resolve(root, "scripts/sites-public-media.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const redirects = {};
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
      const media = manifest[`/${path}`];
      // Never use stale mappings if a local image is replaced at the same path.
      if (media && createHash("sha1").update(readFileSync(source)).digest("hex") === media.sha1) {
        const url = new URL(media.url);
        if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io") throw new Error(`Invalid public media URL: ${path}`);
        redirects[`/${path}`] = media.url;
        rmSync(destination);
      }
      count++;
    }
  }
}
verify(resolve(root, "public"));
writeFileSync(resolve(dist, "server/index.js"), `import app from "./app.js";
export * from "./app.js";
const media = ${JSON.stringify(redirects)};
export default {
  ...app,
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path;
    try { path = decodeURIComponent(url.pathname); } catch { return new Response("Invalid path", { status: 400 }); }
    const target = media[path];
    if (target && (request.method === "GET" || request.method === "HEAD")) {
      return Response.redirect(target, 302);
    }
    return app.fetch(request, env, ctx);
  }
};
`);
console.log(`Verified all ${count} public files: ${Object.keys(redirects).length} original CDN assets, ${count - Object.keys(redirects).length} bundled assets.`);
