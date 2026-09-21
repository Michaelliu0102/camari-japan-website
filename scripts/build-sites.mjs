import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const siteUrl = "https://camari-japan-preview.y-liu804161.chatgpt.site";
const env = {
  ...process.env,
  SITES_PREVIEW: "1",
  NEXT_PUBLIC_ENABLE_LOCALE_PREVIEW: "true",
  NEXT_PUBLIC_SITE_URL: siteUrl,
  NEXT_PUBLIC_EN_SITE_URL: siteUrl,
  NEXT_PUBLIC_JA_SITE_URL: siteUrl,
  NEXT_PUBLIC_SANITY_PROJECT_ID: "bfjhbpbx",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  NEXT_PUBLIC_SANITY_MARKET: "japan"
};
for (const [command, args] of [
  [resolve("node_modules/.bin/opennextjs-cloudflare"), ["build"]],
  [process.execPath, ["scripts/prepare-sites-dist.mjs"]]
]) {
  const result = spawnSync(command, args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
