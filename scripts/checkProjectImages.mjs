import { getCliClient } from "sanity/cli";
const client = getCliClient({ apiVersion: "2026-06-09" });

const projects = await client.fetch(`*[_type == "projectCase"][0] {
  "coverUrl": coverImage.asset->url,
  "galleryUrls": gallery[].asset->url,
  "coverId": coverImage.asset->_id
}`);

console.log("First project case:");
console.log("  cover asset ID:", projects?.coverId);
console.log("  cover URL:", projects?.coverUrl);
console.log("  gallery:", projects?.galleryUrls);
