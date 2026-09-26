import { createHash } from "node:crypto";
import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
import { productCategories as productCategoryFixtures } from "../src/content/products/categories";
import { requireUniqueMatch } from "../src/lib/product-detail-localization";
import {
  applyJapaneseProductCategoryCopy,
  getJapaneseProductCategorySeo,
} from "../src/lib/japanese-copy";

type SanityImage = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
};

type ExistingCategory = {
  _id: string;
  _rev: string;
  _type: "productCategory";
  title?: { en?: string; ja?: string };
  slug?: { _type?: "slug"; current?: string };
  subtitle?: { en?: string; ja?: string };
  heroImage?: SanityImage;
  description?: { en?: string; ja?: string };
  highlights?: Array<Record<string, unknown> & {
    title?: { en?: string; ja?: string };
    body?: { en?: string; ja?: string };
  }>;
  carouselItems?: Array<Record<string, unknown> & {
    title?: { en?: string; ja?: string };
    description?: { en?: string; ja?: string };
    customizedOption?: { en?: string; ja?: string };
    details?: Array<Record<string, unknown> & { en?: string; ja?: string }>;
  }>;
  sortOrder?: number;
  seo?: Record<string, unknown> & {
    title?: { en?: string; ja?: string };
    description?: { en?: string; ja?: string };
    image?: SanityImage;
  };
};

const root = process.cwd();
const shouldCommit = process.argv.includes("--commit");
loadLocalEnv(path.join(root, ".env.local"));
const apiVersion = "2026-09-03";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const authToken = process.env.SANITY_AUTH_TOKEN;
const client = createClient({ projectId, dataset, apiVersion, token: authToken, useCdn: false });
const categories = applyJapaneseProductCategoryCopy(productCategoryFixtures);

if (shouldCommit && !authToken) {
  throw new Error("SANITY_AUTH_TOKEN is required when using --commit.");
}

function loadLocalEnv(filePath: string): void {
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

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function key(prefix: string, index: number, title: string): string {
  const normalized = title
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .slice(0, 32);
  return `${prefix}${index + 1}${normalized || "item"}`;
}

function publicFilePath(publicUrl: string): string {
  return path.join(root, "public", publicUrl.replace(/^\/+/, ""));
}

function localImageUrls(): string[] {
  return [
    ...new Set(
      categories.flatMap((category) => [
        category.heroImage,
        ...(category.curvedCarouselImages ?? []).flatMap((item) => [
          item.src,
          ...item.galleryImages,
        ]),
      ]),
    ),
  ];
}

async function sha1(filePath: string): Promise<string> {
  return createHash("sha1").update(await readFile(filePath)).digest("hex");
}

async function withRetry<T>(label: string, task: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      const statusCode = (error as { statusCode?: number; response?: { statusCode?: number } })
        ?.statusCode ?? (error as { response?: { statusCode?: number } })?.response?.statusCode;

      if (attempt === 4 || (statusCode && statusCode < 500 && statusCode !== 429)) {
        throw error;
      }

      const delay = 1000 * attempt * attempt;
      console.warn(`${label} failed; retrying in ${delay}ms.`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

async function main() {
const allExisting = await client.fetch<ExistingCategory[]>(
  `*[
    _type == "productCategory" &&
    !(_id in path("versions.**"))
  ] | order(slug.current asc, _id asc) {
    ...,
    highlights[] { ... },
    carouselItems[] { ..., details[] { ... } }
  }`,
);
const relevantExisting = allExisting.filter((document) =>
  categories.some((category) => category.slug === document.slug?.current),
);
// Validate identities before any upload or write, including when array order changes.
for (const document of relevantExisting) {
  const category = categories.find(item => item.slug === document.slug?.current)!;
  for (const item of category.curvedCarouselImages ?? []) {
    const prior = requireUniqueMatch(document.carouselItems ?? [], entry => entry.title?.en === item.title.en, `${document._id}/${item.title.en}`);
    for (const detail of item.details) {
      requireUniqueMatch(prior.details ?? [], entry => entry.en === detail.en, `${document._id}/${item.title.en}/${detail.en}`);
      if (!detail.ja.trim()) throw new Error(`Missing Japanese detail: ${item.title.en}/${detail.en}`);
    }
  }
}
const existingBySlug = Map.groupBy(relevantExisting, (document) => document.slug?.current);
const imageUrls = localImageUrls();
const missingFiles = imageUrls.filter((url) => !fs.existsSync(publicFilePath(url)));

if (missingFiles.length) {
  throw new Error(`Missing ${missingFiles.length} local image(s):\n${missingFiles.join("\n")}`);
}

const hashByUrl = new Map<string, string>();
await Promise.all(
  imageUrls.map(async (url) => hashByUrl.set(url, await sha1(publicFilePath(url)))),
);
const uniqueHashes = [...new Set(hashByUrl.values())];
const assetIdByHash = new Map<string, string>();

for (const hashBatch of chunks(uniqueHashes, 100)) {
  const assets = await client.fetch<Array<{ _id: string; sha1hash: string }>>(
    `*[_type == "sanity.imageAsset" && sha1hash in $hashes]{ _id, sha1hash }`,
    { hashes: hashBatch },
  );
  for (const asset of assets) {
    assetIdByHash.set(asset.sha1hash, asset._id);
  }
}

const hashesToUpload = uniqueHashes.filter((hash) => !assetIdByHash.has(hash));

function japaneseMismatches(
  document: ExistingCategory,
  category: (typeof categories)[number],
): string[] {
  const mismatches: string[] = [];
  const seo = getJapaneseProductCategorySeo(category.slug);
  const expect = (label: string, actual: unknown, expected: unknown) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      mismatches.push(label);
    }
  };

  expect("title.ja", document.title?.ja, category.title.ja);
  expect("subtitle.ja", document.subtitle?.ja, category.subtitle.ja);
  expect("description.ja", document.description?.ja, category.description.ja);
  expect("seo.title.ja", document.seo?.title?.ja, seo?.title);
  expect("seo.description.ja", document.seo?.description?.ja, seo?.description);
  expect("highlights.length", document.highlights?.length ?? 0, category.highlights.length);
  expect(
    "highlights.ja",
    (document.highlights ?? []).map((item) => [item.title?.ja ?? "", item.body?.ja ?? ""]),
    category.highlights.map((item) => [item.title.ja, item.body.ja]),
  );
  expect(
    "carouselItems.length",
    document.carouselItems?.length ?? 0,
    category.curvedCarouselImages?.length ?? 0,
  );
  expect(
    "carouselItems.ja",
    (document.carouselItems ?? []).map((item) => ({
      title: item.title?.ja ?? "",
      description: item.description?.ja ?? "",
      customizedOption: item.customizedOption?.ja ?? "",
      details: (item.details ?? []).map((detail) => detail.ja ?? ""),
    })),
    (category.curvedCarouselImages ?? []).map((item) => ({
      title: item.title.ja,
      description: item.description.ja,
      customizedOption: item.customizedOption?.ja ?? "",
      details: item.details.map((detail) => detail.ja),
    })),
  );

  return mismatches;
}

console.log(`Product categories: ${categories.length}`);
console.log(`Existing matching documents: ${relevantExisting.length}`);
console.log(`Documents to create: ${categories.filter((category) => !existingBySlug.has(category.slug)).length}`);
console.log(`Unique local images: ${uniqueHashes.length}`);
console.log(`Images already in Sanity: ${uniqueHashes.length - hashesToUpload.length}`);
console.log(`Images to upload: ${hashesToUpload.length}`);

for (const category of categories) {
  const existing = existingBySlug.get(category.slug) ?? [];
  const mismatches = existing.flatMap((document) =>
    japaneseMismatches(document, category).map((field) => `${document._id}:${field}`),
  );
  console.log(
    `- ${category.slug}: ${category.highlights.length} highlights, ` +
      `${category.curvedCarouselImages?.length ?? 0} carousel items, ` +
      `${existing.length ? `patch ${existing.map((document) => document._id).join(", ")}` : "create"}, ` +
      `${mismatches.length} Japanese field mismatch(es)`,
  );
}

if (!shouldCommit) {
  console.log("\nDry run only. Re-run with --commit to upload images and sync Sanity.");
  process.exit(0);
}

const backupPath = `/private/tmp/camari-product-category-backup-${Date.now()}.json`;
await writeFile(backupPath, `${JSON.stringify(relevantExisting, null, 2)}\n`);

const urlByHash = new Map<string, string>();
for (const [url, hash] of hashByUrl) {
  if (!urlByHash.has(hash)) {
    urlByHash.set(hash, url);
  }
}

let uploaded = 0;
for (const hashBatch of chunks(hashesToUpload, 6)) {
  await Promise.all(
    hashBatch.map(async (hash) => {
      const url = urlByHash.get(hash);
      if (!url) {
        throw new Error(`No local image found for hash ${hash}.`);
      }

      const filePath = publicFilePath(url);
      const asset = await withRetry(`Upload ${url}`, () =>
        client.assets.upload("image", fs.createReadStream(filePath), {
          filename: path.basename(filePath),
        }),
      );
      assetIdByHash.set(hash, asset._id);
      uploaded += 1;
      console.log(`Uploaded images: ${uploaded}/${hashesToUpload.length}`);
    }),
  );
}

function image(publicUrl: string): SanityImage {
  const hash = hashByUrl.get(publicUrl);
  const assetId = hash ? assetIdByHash.get(hash) : undefined;

  if (!assetId) {
    throw new Error(`No Sanity asset resolved for ${publicUrl}.`);
  }

  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
  };
}

function localized(
  fallback: { en: string; ja: string },
  existing?: { en?: string; ja?: string },
) {
  return {
    ...fallback,
    ...existing,
    ja: fallback.ja,
  };
}

function buildFields(
  category: (typeof categories)[number],
  categoryIndex: number,
  existing?: ExistingCategory,
) {
  const existingHighlights = existing?.highlights ?? [];
  const existingCarousel = existing?.carouselItems ?? [];
  const canPreserveHighlights = existingHighlights.length === category.highlights.length;
  const japaneseSeo = getJapaneseProductCategorySeo(category.slug);

  return {
    title: localized(category.title, existing?.title),
    slug: existing?.slug?.current
      ? existing.slug
      : { _type: "slug" as const, current: category.slug },
    subtitle: localized(category.subtitle, existing?.subtitle),
    heroImage: existing?.heroImage ?? image(category.heroImage),
    description: localized(category.description, existing?.description),
    highlights: category.highlights.map((highlight, index) => {
      const prior = canPreserveHighlights ? existingHighlights[index] : undefined;
      return {
        ...prior,
        _key: String(prior?._key ?? key("highlight", index, highlight.title.en)),
        title: localized(highlight.title, prior?.title),
        body: localized(highlight.body, prior?.body),
      };
    }),
    carouselItems: (category.curvedCarouselImages ?? []).map((item, index) => {
      const prior = existing ? requireUniqueMatch(existingCarousel,
        entry => entry.title?.en === item.title.en, `${existing._id}/${item.title.en}`) : undefined;
      return {
        ...prior,
        _key: String(prior?._key ?? key("carousel", index, item.title.en)),
        coverImage: (prior?.coverImage as SanityImage | undefined) ?? image(item.src),
        title: localized(item.title, prior?.title),
        description: localized(item.description, prior?.description),
        customizedOption: localized(
          item.customizedOption ?? { en: "", ja: "" },
          prior?.customizedOption,
        ),
        details: item.details.map((detail, detailIndex) => {
          const priorDetail = prior ? requireUniqueMatch(prior.details ?? [],
            entry => entry.en === detail.en, `${existing?._id}/${item.title.en}/${detail.en}`) : undefined;
          return {
            ...priorDetail,
            _key: String(
              priorDetail?._key ?? key(`detail${index + 1}`, detailIndex, detail.en),
            ),
            ...localized(detail, priorDetail),
          };
        }),
        gallery: Array.isArray(prior?.gallery) && prior.gallery.length
          ? prior.gallery
          : item.galleryImages.map(image),
      };
    }),
    sortOrder: existing?.sortOrder ?? (categoryIndex + 1) * 10,
    seo: {
      ...existing?.seo,
      title: {
        en: existing?.seo?.title?.en ?? `${category.title.en} | CAMARI JAPAN`,
        ja: japaneseSeo?.title ?? `${category.title.ja} | CAMARI JAPAN`,
      },
      description: {
        en: existing?.seo?.description?.en ?? category.description.en,
        ja: japaneseSeo?.description ?? category.description.ja,
      },
      image: existing?.seo?.image ?? existing?.heroImage ?? image(category.heroImage),
    },
  };
}

let transaction = client.transaction();
for (const [categoryIndex, category] of categories.entries()) {
  const existingDocuments = existingBySlug.get(category.slug) ?? [];

  if (!existingDocuments.length) {
    transaction = transaction.create({
      _id: `productCategory-${category.slug}`,
      _type: "productCategory",
      ...buildFields(category, categoryIndex),
    });
    continue;
  }

  for (const existing of existingDocuments) {
    const values = buildFields(category, categoryIndex, existing);
    transaction = transaction.patch(existing._id, (patch) =>
      patch.ifRevisionId(existing._rev).set(values),
    );
  }
}

const result = await transaction.commit({ autoGenerateArrayKeys: true });
console.log(`Sanity transaction committed: ${result.transactionId}`);
console.log(`Backup: ${backupPath}`);

const verification = await client.fetch<
  Array<{
    _id: string;
    slug: string;
    titleJa: string;
    highlightCount: number;
    carouselCount: number;
    seoTitleJa: string;
  }>
>(
  `*[_type == "productCategory" && slug.current in $slugs && !(_id in path("versions.**"))]
    | order(sortOrder asc) {
      _id,
      "slug": slug.current,
      "titleJa": title.ja,
      "highlightCount": count(highlights),
      "carouselCount": count(carouselItems),
      "seoTitleJa": seo.title.ja
    }`,
  { slugs: categories.map((category) => category.slug) },
);

console.log("Verification:");
console.log(JSON.stringify(verification, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
