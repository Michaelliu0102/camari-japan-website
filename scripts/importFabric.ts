import { getSanityClient } from "../src/sanity/lib/client";
import fs from "node:fs";
import path from "node:path";

interface SanityDoc {
  _id: string;
  _type: string;
  [key: string]: unknown;
}

async function importFabric() {
  const client = getSanityClient().withConfig({ useCdn: false, token: process.env.SANITY_AUTH_TOKEN });

  const ndjsonPath = path.join(process.cwd(), "data/import/fabric/fabric-import.ndjson");
  const raw = fs.readFileSync(ndjsonPath, "utf-8");
  const docs: SanityDoc[] = raw
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));

  console.log(`Importing ${docs.length} documents...`);

  const transaction = client.transaction();
  for (const doc of docs) {
    transaction.createOrReplace(doc);
  }

  const result = await transaction.commit();
  console.log(`Done! Transaction completed in ${result.transactionId}`);
}

importFabric().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});
