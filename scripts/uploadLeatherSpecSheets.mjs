import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const specDir = path.join(root, "public/uploads/spec/leather");

loadLocalEnv(path.join(root, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!token && !dryRun) {
  throw new Error("SANITY_AUTH_TOKEN is required to upload files and patch product types.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-06-09",
  token,
  useCdn: false,
  perspective: "raw",
});

const specs = [
  {
    slug: "automotive-nappa",
    file: "automotive_nappa_spec_sheet.pdf",
    title: { en: "Automotive Nappa Spec Sheet", ja: "Automotive Nappa スペックシート" },
  },
  {
    slug: "heritage",
    file: "heritage_spec_sheet.pdf",
    title: { en: "Heritage Spec Sheet", ja: "Heritage スペックシート" },
  },
  {
    slug: "linea",
    file: "linea_spec_sheet.pdf",
    title: { en: "Linea Spec Sheet", ja: "Linea スペックシート" },
  },
  {
    slug: "roma",
    file: "roma_spec_sheet.pdf",
    title: { en: "Roma Spec Sheet", ja: "Roma スペックシート" },
  },
  {
    slug: "verona",
    file: "verona_spec_sheet.pdf",
    title: { en: "Verona Spec Sheet", ja: "Verona スペックシート" },
  },
];

function loadLocalEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

function ref(_ref) {
  return { _type: "reference", _ref };
}

function keyFor(slug) {
  return `technical-spec-sheet-${slug}`;
}

function downloadValue(spec, assetId) {
  return {
    _key: keyFor(spec.slug),
    title: spec.title,
    description: {
      en: "Technical specification PDF for this leather article.",
      ja: "このレザー記事の技術仕様PDF。",
    },
    file: {
      _type: "file",
      asset: ref(assetId),
    },
    type: "technical",
  };
}

function assetIdFor(download) {
  return download?.file?.asset?._ref ?? download?.file?.asset?._id;
}

function normalizeDownload(download) {
  const assetId = assetIdFor(download);

  if (!assetId) {
    return download;
  }

  return {
    ...download,
    file: {
      ...download.file,
      asset: ref(assetId),
    },
  };
}

async function main() {
  const docs = await client.fetch(
    `*[_type == "productType" && material->slug.current == "leather" && slug.current in $slugs] {
      _id,
      name,
      "slug": slug.current,
      downloads
    }`,
    { slugs: specs.map((spec) => spec.slug) },
  );

  const docsBySlug = new Map();
  for (const doc of docs) {
    const docsForSlug = docsBySlug.get(doc.slug) ?? [];
    docsForSlug.push(doc);
    docsBySlug.set(doc.slug, docsForSlug);
  }

  const missingDocs = specs.filter((spec) => !docsBySlug.has(spec.slug));
  const missingFiles = specs.filter((spec) => !fs.existsSync(path.join(specDir, spec.file)));

  console.log(`Sanity project: ${projectId}/${dataset}`);
  console.log(`Spec dir: ${specDir}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "upload"}`);

  if (missingDocs.length) {
    throw new Error(`Missing leather productType document(s): ${missingDocs.map((spec) => spec.slug).join(", ")}`);
  }

  if (missingFiles.length) {
    throw new Error(`Missing PDF file(s): ${missingFiles.map((spec) => spec.file).join(", ")}`);
  }

  for (const spec of specs) {
    const docsForSlug = docsBySlug.get(spec.slug);
    const filePath = path.join(specDir, spec.file);
    const existingAssetId = docsForSlug
      .flatMap((doc) => doc.downloads ?? [])
      .find((download) => download._key === keyFor(spec.slug))
      ?.file?.asset?._ref;

    let assetId = existingAssetId;

    console.log(`\n${spec.slug}`);
    console.log(`  file: ${path.relative(root, filePath)}`);
    console.log(`  docs: ${docsForSlug.map((doc) => doc._id).join(", ")}`);
    console.log(`  existing asset: ${existingAssetId ?? "none"}`);

    if (dryRun) {
      console.log(`  would set download key on ${docsForSlug.length} doc(s): ${keyFor(spec.slug)}`);
      continue;
    }

    if (!assetId) {
      const asset = await client.assets.upload("file", fs.createReadStream(filePath), {
        filename: spec.file,
        contentType: "application/pdf",
      });
      assetId = asset._id;
      console.log(`  uploaded asset: ${assetId}`);
    }

    for (const doc of docsForSlug) {
      const existingDownloads = (doc.downloads ?? []).map(normalizeDownload);
      const preservedDownloads = existingDownloads.filter((download) => download._key !== keyFor(spec.slug));
      const nextDownloads = [...preservedDownloads, downloadValue(spec, assetId)];

      await client.patch(doc._id).set({ downloads: nextDownloads }).commit();
      console.log(`  patched ${doc._id}: ${nextDownloads.length} download(s)`);
    }
  }

  console.log(`\nDone. ${dryRun ? "No changes made." : "Leather spec sheets uploaded and linked."}`);
}

await main();
