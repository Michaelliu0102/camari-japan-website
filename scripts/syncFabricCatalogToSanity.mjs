import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "src/data/product-catalog.generated.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const client = getCliClient({ apiVersion: "2026-05-12" });
const assetCache = new Map();

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

async function imageValue(publicUrl) {
  const filePath = localPublicPath(publicUrl);

  if (!filePath || !fs.existsSync(filePath)) {
    return undefined;
  }

  if (!assetCache.has(filePath)) {
    const asset = await withRetry(`Upload ${path.basename(filePath)}`, () =>
      client.assets.upload("image", fs.createReadStream(filePath), {
        filename: path.basename(filePath)
      })
    );
    assetCache.set(filePath, asset._id);
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

async function syncMaterial() {
  await withRetry("Create material-fabric", () =>
    client.createIfNotExists({
      _id: "material-fabric",
      _type: "material",
      name: { en: "Fabric", ja: "ファブリック" },
      slug: slugDoc("fabric")
    })
  );
}

async function syncProductTypes(productTypes) {
  for (const productType of productTypes) {
    const id = `productType-${productType.slug}`;
    await withRetry(`Create ${id}`, () =>
      client.createIfNotExists({
        _id: id,
        _type: "productType",
        name: productType.name,
        slug: slugDoc(productType.slug),
        material: ref("material-fabric")
      })
    );

    const seo = await seoValue(productType.seo);
    await withRetry(`Patch ${id}`, () =>
      client
        .patch(id)
        .set({
          name: productType.name,
          slug: slugDoc(productType.slug),
          markets: productType.markets ?? ["global"],
          material: ref("material-fabric"),
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
          maintenance: (productType.maintenance ?? []).map((item, index) => keyed(item, "maintenance", index)),
          seo
        })
        .commit()
    );
    console.log(`Product type: ${productType.slug}`);
  }
}

async function syncSkus(skus) {
  for (const sku of skus) {
    const id = `sku-${sku.slug}`;
    await withRetry(`Create ${id}`, () =>
      client.createIfNotExists({
        _id: id,
        _type: "sku",
        code: sku.code,
        slug: slugDoc(sku.slug),
        material: ref("material-fabric"),
        productType: ref(`productType-${sku.productTypeSlug}`)
      })
    );

    const heroImage = await imageValue(sku.image);
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
      material: ref("material-fabric"),
      productType: ref(`productType-${sku.productTypeSlug}`),
      colorName: sku.colorName,
      hex: sku.hex ?? "",
      summary: sku.summary,
      specs: (sku.specs ?? []).map((spec, index) => keyed(spec, "spec", `${sku.code}-${index}`)),
      certifications: sku.certifications ?? [],
      caseGallery,
      seo
    };

    if (heroImage) {
      patch.heroImage = heroImage;
    }

    if (previewImage) {
      patch.previewImage = previewImage;
    }

    await withRetry(`Patch ${id}`, () => client.patch(id).set(patch).commit());
    console.log(`SKU: ${sku.code}`);
  }
}

const fabricProductTypes = catalog.productTypes.filter((productType) => productType.materialSlug === "fabric");
const fabricSkus = catalog.skus.filter((sku) => sku.materialSlug === "fabric");

if (!fabricProductTypes.length || !fabricSkus.length) {
  throw new Error("No Fabric product types or SKUs found in generated catalog.");
}

await syncMaterial();
await syncProductTypes(fabricProductTypes);
await syncSkus(fabricSkus);

console.log(`Done. Synced ${fabricProductTypes.length} Fabric product type(s), ${fabricSkus.length} SKU(s), and ${assetCache.size} image asset(s).`);
