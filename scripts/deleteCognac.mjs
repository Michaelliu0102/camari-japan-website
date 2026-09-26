import { getCliClient } from "sanity/cli";
const client = getCliClient({ apiVersion: "2026-06-09" });

const cognac = await client.fetch(`*[_type == "sku" && slug.current == "l-tpg-3345-cognac"][0] { _id, code, slug }`);

if (cognac) {
  await client.delete(cognac._id);
  console.log(`Deleted: ${cognac._id} (${cognac.code})`);
} else {
  console.log("Cognac SKU not found in Sanity — already clean.");
}
