import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const filePath = path.join(root, "public/uploads/spec/vegan leather/aquapelle-spec-sheet.pdf");
const productTypeSlug = "microfiber-leather";
const downloadKey = "technical-spec-sheet-microfiber-leather-aquapelle";
const name = {
  en: "Microfiber Leather Aquapelle",
  ja: "マイクロファイバーレザー Aquapelle",
};

loadLocalEnv(path.join(root, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!token && !dryRun) {
  throw new Error("SANITY_AUTH_TOKEN is required to upload the Aquapelle PDF and patch catalog documents.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-06-09",
  token,
  useCdn: false,
  perspective: "raw",
});

function loadLocalEnv(envPath) {
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

function ref(_ref) {
  return { _type: "reference", _ref };
}

function fileAssetId(download) {
  return download?.file?.asset?._ref ?? download?.file?.asset?._id;
}

function normalizeDownload(download) {
  const assetId = fileAssetId(download);

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

function aquapelleDownload(assetId) {
  return {
    _key: downloadKey,
    title: {
      en: "Microfiber Leather Aquapelle Spec Sheet",
      ja: "Microfiber Leather Aquapelle 仕様書",
    },
    description: {
      en: "Technical specifications for Microfiber Leather Aquapelle.",
      ja: "Microfiber Leather Aquapelle の技術仕様書。",
    },
    file: {
      _type: "file",
      asset: ref(assetId),
    },
    type: "technical",
  };
}

function productTypeSeo(existingSeo = {}) {
  return {
    ...existingSeo,
    title: {
      en: "Microfiber Leather Aquapelle Vegan Leather | CAMARI JAPAN",
      ja: "マイクロファイバーレザー Aquapelle ヴィーガンレザー | CAMARI JAPAN",
    },
    description: {
      en: "Premium solvent-free Microfiber Leather Aquapelle for automotive upholstery, trim, and mixed-material interior applications.",
      ja: "自動車用シート張地、トリム、異素材内装に向けた、無溶剤のプレミアム マイクロファイバーレザー Aquapelle。",
    },
  };
}

function skuSummary(code) {
  return {
    en: `Microfiber Leather Aquapelle, code ${code}. Premium vegan microfiber leather for automotive upholstery and interior trim.`,
    ja: `マイクロファイバーレザー Aquapelle、品番 ${code}。自動車用シート張地や内装トリムに適したプレミアムなヴィーガンマイクロファイバーレザーです。`,
  };
}

function skuSeo(existingSeo = {}, code) {
  return {
    ...existingSeo,
    title: {
      en: `Microfiber Leather Aquapelle ${code} | CAMARI JAPAN`,
      ja: `マイクロファイバーレザー Aquapelle ${code} | CAMARI JAPAN`,
    },
    description: {
      en: `View Microfiber Leather Aquapelle ${code}, a solvent-free vegan microfiber leather for premium automotive upholstery and interior applications.`,
      ja: `マイクロファイバーレザー Aquapelle ${code}。上質な自動車用シート張地や内装用途に向けた無溶剤ヴィーガンマイクロファイバーレザーです。`,
    },
  };
}

async function main() {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing Aquapelle PDF: ${filePath}`);
  }

  const productTypes = await client.fetch(
    `*[_type == "productType" && slug.current == $slug] {
      _id,
      downloads,
      seo
    }`,
    { slug: productTypeSlug },
  );
  const skus = await client.fetch(
    `*[_type == "sku" && productType->slug.current == $slug] {
      _id,
      code,
      seo
    }`,
    { slug: productTypeSlug },
  );

  if (!productTypes.length) {
    throw new Error(`No Sanity productType found for ${productTypeSlug}`);
  }

  const existingAssetId = productTypes
    .flatMap((productType) => productType.downloads ?? [])
    .find((download) => download._key === downloadKey)
    ?.file?.asset?._ref;

  console.log(`Sanity project: ${projectId}/${dataset}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "upload"}`);
  console.log(`Product type documents: ${productTypes.length}`);
  console.log(`SKU documents: ${skus.length}`);
  console.log(`Existing Aquapelle file asset: ${existingAssetId ?? "none"}`);

  if (dryRun) {
    console.log(`Would upload ${path.relative(root, filePath)} if needed.`);
    console.log("Would rename the product type, update SKU metadata, and link the PDF download.");
    return;
  }

  let assetId = existingAssetId;

  if (!assetId) {
    const asset = await client.assets.upload("file", fs.createReadStream(filePath), {
      filename: path.basename(filePath),
      contentType: "application/pdf",
    });
    assetId = asset._id;
    console.log(`Uploaded file asset: ${assetId}`);
  }

  for (const productType of productTypes) {
    const preservedDownloads = (productType.downloads ?? [])
      .map(normalizeDownload)
      .filter((download) => download._key !== downloadKey);

    await client
      .patch(productType._id)
      .set({
        name,
        seo: productTypeSeo(productType.seo),
        downloads: [...preservedDownloads, aquapelleDownload(assetId)],
      })
      .commit();
  }

  for (const sku of skus) {
    await client
      .patch(sku._id)
      .set({
        summary: skuSummary(sku.code),
        seo: skuSeo(sku.seo, sku.code),
      })
      .commit();
  }

  console.log("Aquapelle name, SKU metadata, and specification download are live in Sanity.");
}

await main();
