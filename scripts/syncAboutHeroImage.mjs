import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const imagePath = path.join(root, "public/uploads/about/showroom.jpg");
const token = process.env.SANITY_AUTH_TOKEN;
if (!token) {
  throw new Error("SANITY_AUTH_TOKEN is required to upload the About hero image.");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-05-12",
  token,
  useCdn: false
});

if (!fs.existsSync(imagePath)) {
  throw new Error(`About hero image not found: ${imagePath}`);
}

const asset = await client.assets.upload("image", fs.createReadStream(imagePath), {
  filename: path.basename(imagePath)
});

const image = {
  _type: "image",
  asset: { _type: "reference", _ref: asset._id }
};

await client.patch("aboutPage").set({ heroImage: image, seoImage: image }).commit();

console.log(`Synced ${imagePath} to aboutPage.heroImage and aboutPage.seoImage`);
