import assert from "node:assert/strict";
import fs from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

process.on("uncaughtException", (error) => { console.error(error.message); process.exit(1); });
nextEnv.loadEnvConfig(process.cwd());
const japanSocialLinks = JSON.parse(fs.readFileSync(new URL("../src/content/japan-social-links.json", import.meta.url), "utf8"));
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-09-21", useCdn: false, perspective: "raw"
};
const client = process.env.SANITY_AUTH_TOKEN
  ? createClient({ ...config, token: process.env.SANITY_AUTH_TOKEN })
  : getCliClient({ apiVersion: config.apiVersion }).withConfig(config);
const query = '*[_id in ["homePageSettings", "drafts.homePageSettings"]]{_id,_rev,japanSocialLinks}';
const before = await client.fetch(query);
assert.ok(before.some(({ _id }) => _id === "homePageSettings"), "Published homepage is required");
console.log(JSON.stringify({ apply: process.argv.includes("--apply"), ids: before.map(({ _id }) => _id), japanSocialLinks }, null, 2));
if (process.argv.includes("--apply")) {
  const backup = `outputs/japan-social-links/${Date.now()}`;
  fs.mkdirSync(backup, { recursive: true });
  fs.writeFileSync(`${backup}/before.json`, JSON.stringify(before, null, 2));
  let transaction = client.transaction();
  for (const document of before) {
    transaction = transaction.patch(document._id, (patch) => patch.ifRevisionId(document._rev).set({ japanSocialLinks }));
  }
  await transaction.commit();
  const after = await client.fetch(query);
  assert.equal(after.length, before.length);
  for (const document of after) assert.deepEqual(document.japanSocialLinks, japanSocialLinks);
  fs.writeFileSync(`${backup}/after.json`, JSON.stringify(after, null, 2));
  console.log(`Synced and verified ${after.length} document(s). Backup: ${backup}`);
}
