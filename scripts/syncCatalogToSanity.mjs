import { getCliClient } from "sanity/cli";
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
loadLocalEnv(path.join(root, ".env.local"));

const catalogPath = path.join(root, "src/data/product-catalog.generated.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const apiVersion = "2026-06-09";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const authToken = process.env.SANITY_USE_CLI_AUTH === "1" ? undefined : process.env.SANITY_AUTH_TOKEN;
const client = authToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token: authToken,
      useCdn: false
    })
  : getCliClient({ apiVersion });
const assetCache = new Map();

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

    const value = match[2].trim().replace(/^['"]|['"]$/g, "");
    process.env[match[1]] = value;
  }
}

const MATERIALS = {
  alcantara: {
    id: "material-alcantara",
    name: { en: "Alcantara", ja: "アルカンターラ" }
  },
  leather: {
    id: "material-leather",
    name: { en: "Leather", ja: "レザー" }
  },
  fabric: {
    id: "material-fabric",
    name: { en: "Fabric", ja: "ファブリック" }
  },
  "vegan-leather": {
    id: "material-vegan-leather",
    name: { en: "Vegan Leather", ja: "ヴィーガンレザー" }
  }
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, task) {
  let lastError;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      const statusCode = error?.statusCode ?? error?.response?.statusCode;
      if (attempt === 4 || (statusCode && statusCode < 500 && statusCode !== 429)) {
        throw error;
      }

      const delay = 1000 * attempt * attempt;
      console.warn(`${label} failed with ${statusCode ?? "unknown error"}; retrying in ${delay}ms`);
      await wait(delay);
    }
  }

  throw lastError;
}

function slugDoc(slug) {
  return { _type: "slug", current: slug };
}

function ref(_ref) {
  return { _type: "reference", _ref };
}

function localPublicPath(publicUrl) {
  if (!publicUrl?.startsWith("/")) {
    return null;
  }

  return path.join(root, "public", publicUrl);
}

function imagePathFromUrl(url) {
  if (!url) return null;

  // Handle full file paths like /Users/.../public/uploads/...
  if (url.includes("/public/uploads/") || url.includes("/public/images/")) {
    const idx = url.indexOf("/public/");
    if (idx >= 0) {
      return url;
    }
  }

  // Handle paths starting with /uploads or /public
  if (url.startsWith("/")) {
    // Check if it's a full system path
    if (fs.existsSync(url)) {
      return url;
    }
    // Try public-relative
    const p = path.join(root, "public", url);
    if (fs.existsSync(p)) {
      return p;
    }
    return p; // Return anyway, let upload fail gracefully
  }

  return null;
}

async function imageValue(publicUrl) {
  if (!publicUrl) return undefined;

  const filePath = imagePathFromUrl(publicUrl);
  if (!filePath || !fs.existsSync(filePath)) {
    return undefined;
  }

  if (!assetCache.has(filePath)) {
    try {
      const asset = await withRetry(`Upload ${path.basename(filePath)}`, () =>
        client.assets.upload("image", fs.createReadStream(filePath), {
          filename: path.basename(filePath)
        })
      );
      assetCache.set(filePath, asset._id);
    } catch (err) {
      console.warn(`  ⚠ Failed to upload image: ${filePath} — ${err.message}`);
      return undefined;
    }
  }

  return {
    _type: "image",
    asset: ref(assetCache.get(filePath))
  };
}

async function seoValue(seo) {
  const value = {
    title: seo?.title ?? { en: "", ja: "" },
    description: seo?.description ?? { en: "", ja: "" }
  };
  const image = await imageValue(seo?.image);

  if (image) {
    value.image = image;
  }

  return value;
}

function keyed(value, prefix, fallback) {
  return {
    _key: `${prefix}-${String(fallback).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item"}`,
    ...value
  };
}

async function syncMaterials() {
  for (const [slug, material] of Object.entries(MATERIALS)) {
    const id = material.id;
    await withRetry(`Create ${id}`, () =>
      client.createIfNotExists({
        _id: id,
        _type: "material",
        name: material.name,
        slug: slugDoc(slug)
      })
    );
    console.log(`Material: ${slug}`);
  }
}

async function syncProductTypes(productTypes) {
  for (const productType of productTypes) {
    const materialSlug = productType.materialSlug;
    const material = MATERIALS[materialSlug];
    if (!material) {
      console.warn(`  ⚠ Unknown material: ${materialSlug} for ${productType.slug}`);
      continue;
    }

    const id = `productType-${productType.slug}`;
    await withRetry(`Create ${id}`, () =>
      client.createIfNotExists({
        _id: id,
        _type: "productType",
        name: productType.name,
        slug: slugDoc(productType.slug),
        material: ref(material.id)
      })
    );

    const seo = await seoValue(productType.seo);
    await withRetry(`Patch ${id}`, () =>
      client
        .patch(id)
        .set({
          name: productType.name,
          slug: slugDoc(productType.slug),
          markets: productType.markets ?? ["global", "japan"],
          material: ref(material.id),
          summary: productType.summary,
          productCode: productType.productCode ?? "",
          specTemplate: (productType.specTemplate ?? []).map((field) =>
            keyed(
              {
                key: field.key,
                label: field.label,
                aliases: field.aliases ?? [],
                defaultValue: field.defaultValue
              },
              "spec",
              field.key
            )
          ),
          certifications: productType.certifications ?? [],
          maintenance: (productType.maintenance ?? []).map((item, index) =>
            keyed(item, "maintenance", index)
          ),
          seo
        })
        .commit()
    );
    console.log(`  PT: ${productType.slug}`);
  }
}

async function syncSkus(skus) {
  let total = 0;
  for (const sku of skus) {
    const materialSlug = sku.materialSlug;
    const material = MATERIALS[materialSlug];
    if (!material) {
      console.warn(`  ⚠ Unknown material: ${materialSlug} for SKU ${sku.slug}`);
      continue;
    }

    const id = `sku-${sku.slug}`;
    await withRetry(`Create ${id}`, () =>
      client.createIfNotExists({
        _id: id,
        _type: "sku",
        code: sku.code,
        slug: slugDoc(sku.slug),
        material: ref(material.id),
        productType: ref(`productType-${sku.productTypeSlug}`)
      })
    );

    const heroImage = await imageValue(sku.image);
    const swatchImage = await imageValue(sku.swatchImage);
    const previewImage = await imageValue(sku.previewImage);
    const seo = await seoValue(sku.seo);
    const caseGallery = [];

    for (const [index, item] of (sku.caseGallery ?? []).entries()) {
      const image = await imageValue(item.image);
      if (image) {
        caseGallery.push({
          _key: `case-${sku.code.toLowerCase()}-${index}`,
          image,
          alt: item.alt
        });
      }
    }

    const patch = {
      code: sku.code,
      slug: slugDoc(sku.slug),
      material: ref(material.id),
      productType: ref(`productType-${sku.productTypeSlug}`),
      colorName: sku.colorName,
      hex: sku.hex ?? "",
      summary: sku.summary,
      specs: (sku.specs ?? []).map((spec, index) =>
        keyed(spec, "spec", `${sku.code}-${index}`)
      ),
      certifications: sku.certifications ?? [],
      caseGallery,
      seo
    };

    if (heroImage) {
      patch.heroImage = heroImage;
    }

    if (swatchImage) {
      patch.swatchImage = swatchImage;
    }

    if (previewImage) {
      patch.previewImage = previewImage;
    }

    await withRetry(`Patch ${id}`, () => client.patch(id).set(patch).commit());
    total += 1;
    if (total % 50 === 0) {
      console.log(`  SKUs: ${total}`);
    }
  }
  console.log(`  SKUs: ${total} (done)`);
}

// Main
const targetMaterials = process.argv.slice(2).filter(Boolean);
const productTypes = targetMaterials.length
  ? catalog.productTypes.filter((pt) => targetMaterials.includes(pt.materialSlug))
  : catalog.productTypes;
const skus = targetMaterials.length
  ? catalog.skus.filter((sku) => targetMaterials.includes(sku.materialSlug))
  : catalog.skus;

if (!productTypes.length && !skus.length) {
  console.error("No product types or SKUs found for the specified materials.");
  console.error("Usage: node scripts/syncCatalogToSanity.mjs [alcantara] [leather] [fabric]");
  process.exit(1);
}

const materialsToSync = new Set(productTypes.map((pt) => pt.materialSlug));
console.log(`Syncing materials: ${[...materialsToSync].join(", ")}`);
console.log(`Product types: ${productTypes.length}`);
console.log(`SKUs: ${skus.length}`);

await syncMaterials();
await syncProductTypes(productTypes);
await syncSkus(skus);

console.log(`\nDone. Synced ${productTypes.length} product type(s), ${skus.length} SKU(s), and ${assetCache.size} image asset(s).`);
