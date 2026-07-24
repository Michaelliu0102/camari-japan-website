import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { ProductType, ProductTypeSpecificationField, Sku } from "@/lib/content";

const skaiRoot = path.join(process.cwd(), "public/uploads/veganleather/skai");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const specFileName = "SPEC.pages";
const skaiIntroDescriptions: Record<string, string> = {
  "aliena": "High quality skai material with a natural, very slender ostrich leather grain. This article is a highlight among exclusive leather optics.",
  "gemini": "The upholstery material is characterized by a very fine leather grain. Due to its large color palette, flame-retardant characteristics, and pleasant natural feel, it is perfectly suited for hospitality environments such as hotels, public institutions, and cruise ships.",
  "neptun-pescara": "High-quality upholstery material with a fine leather grain. The material is especially used in sophisticated outdoor and contract applications and is particularly well-suited for boats and yachts.",
  "palma-nf": "High-quality material with a fine calf leather grain and subdued print image. The material is universally usable and especially suitable for contract areas, public buildings, and institutions. Palma NF is impressive due to its comfort, robustness, and flame-retardant properties.",
  "parotega-nf": "High-quality material with a classic leather grain. Due to its natural look and touch, it can hardly be differentiated from genuine leather. The material is especially suitable for contract areas, public buildings, and institutions.",
  "sofelto-en": "A delicate skin structure evokes African antelope fur. The color accentuation of the grain valleys, coupled with slightly shining tops, creates a sophisticated iridescent effect. Its visual appeal opens up new design possibilities when using this material.",
  "solino-en": "skai Solino EN is a salute to textile manufacturers. It is embossed with irregular, criss-cross quilting seams which form a network of patterned lines on a pleated surface. The seams are hard to distinguish from real stitching.",
  "soshagro-en": "Soshagro EN fascinates with its unique manta ray look. Its special allure results from an interesting color contrast and a fine play of matt and shiny areas due to grain valleys and lacquered peaks.",
  "sotega-fls": "High quality material with soft nappa finish and a classic leather grain. Due to its natural look and touch, it can hardly be differentiated from genuine leather.",
  "venezia": "The high-quality upholstery material Venezia is equipped with cool colors technology. It reduces heat build-up on the surface when exposed to direct sunlight. A nano coating makes it extremely weather-, UV-, and dirt-resistant. It has a fine, sporty and elegant appearance with a pleasant feel.",
  "vyp-nappa": "The high-performance upholstery material with a realistic leather look and wide color range sets new standards in comfort and sustainability. Thanks to laif technology, this hybrid of vinyl and renewable raw materials is ideal for applications where sitting for long periods is the rule."
};
const skaiMaintenance = [
  {
    title: { en: "WASHING", ja: "WASHING" },
    description: { en: "Wash at 40 °C", ja: "Wash at 40 °C" }
  },
  {
    title: { en: "BLEACH", ja: "BLEACH" },
    description: { en: "Do not bleach", ja: "Do not bleach" }
  },
  {
    title: { en: "IRON", ja: "IRON" },
    description: { en: "Iron at 110°C maximum", ja: "Iron at 110°C maximum" }
  },
  {
    title: { en: "DRY CLEANING", ja: "DRY CLEANING" },
    description: { en: "Normal dry cleaning", ja: "Normal dry cleaning" }
  },
  {
    title: { en: "TUMBLE DRY", ja: "TUMBLE DRY" },
    description: { en: "Do not tumble dry", ja: "Do not tumble dry" }
  }
];
const skaiDownloads = [
  {
    title: { en: "Faux Leather Cleaning & Care Detail", ja: "Faux Leather Cleaning & Care Detail" },
    description: {
      en: "Detailed cleaning and care guidance for skai faux leather.",
      ja: "Detailed cleaning and care guidance for skai faux leather."
    },
    href: "/uploads/veganleather/skai/Download/2021-01_EN_Cleaning-Care_Faux-Leather_detail.pdf",
    type: "care" as const
  },
  {
    title: { en: "Clean and Care", ja: "Clean and Care" },
    description: {
      en: "Quick cleaning and care reference for skai vinyl articles.",
      ja: "Quick cleaning and care reference for skai vinyl articles."
    },
    href: "/uploads/veganleather/skai/Download/clean%20and%20care.pdf",
    type: "care" as const
  }
];
const skaiCertifications = [
  { en: "REACh", ja: "REACh" },
  { en: "IATF 16949:2016", ja: "IATF 16949:2016" },
  { en: "ISO 9001:2015", ja: "ISO 9001:2015" }
];
const skaiSpecFallbacks: Record<string, string> = {
  "aliena": "sofelto-en"
};
const specTemplate: ProductTypeSpecificationField[] = [
  { key: "material", label: { en: "MATERIAL", ja: "MATERIAL" }, aliases: ["material"] },
  { key: "composition", label: { en: "COMPOSITION", ja: "COMPOSITION" }, aliases: ["composition"] },
  { key: "backing", label: { en: "BACKING", ja: "BACKING" }, aliases: ["backing"] },
  { key: "finish", label: { en: "FINISH", ja: "FINISH" }, aliases: ["finish"] },
  { key: "width", label: { en: "WIDTH", ja: "WIDTH" }, aliases: ["width"] },
  { key: "rollLength", label: { en: "ROLL LENGTH", ja: "ROLL LENGTH" }, aliases: ["roll length", "rollLength"] },
  { key: "thickness", label: { en: "THICKNESS", ja: "THICKNESS" }, aliases: ["thickness"] },
  { key: "martindale", label: { en: "MARTINDALE", ja: "MARTINDALE" }, aliases: ["martindale"] },
  { key: "flameProtection", label: { en: "FLAME PROTECTION", ja: "FLAME PROTECTION" }, aliases: ["flame protection", "flameProtection"] },
  { key: "application", label: { en: "APPLICATION", ja: "APPLICATION" }, aliases: ["application"] },
  { key: "properties", label: { en: "MATERIAL PROPERTIES", ja: "MATERIAL PROPERTIES" }, aliases: ["material properties", "properties"] }
];

export type SkaiVinylArticle = {
  slug: string;
  name: string;
  coverImage: string;
  colorCount: number;
  firstSkuSlug: string;
};

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (word ? `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}` : word))
    .join(" ");
}

function publicSkaiPath(folderName: string, fileName: string): string {
  return `/uploads/veganleather/skai/${folderName}/${fileName}`;
}

function getArticleDescription(slug: string, folderName: string, imageCount: number): string {
  return skaiIntroDescriptions[slug] ?? `skai ${folderName} vinyl article with ${imageCount} colour options.`;
}

function parseImageMeta(articleSlug: string, fileName: string) {
  const baseName = path.basename(fileName, path.extname(fileName));
  const codeMatch = baseName.match(/F\d{5,}/i);
  const code = codeMatch?.[0]?.toUpperCase() ?? baseName.toUpperCase();
  const colorName = titleCase(
    baseName
      .replace(/F\d{5,}/gi, "")
      .replace(/^[-_\s]+|[-_\s]+$/g, "")
  ) || code;

  return {
    code,
    colorName,
    slug: `${articleSlug}-${slugify(code)}`
  };
}

function extractPrintableStrings(buffer: Buffer): string[] {
  const strings: string[] = [];
  let current = "";

  for (const byte of buffer) {
    if (byte >= 32 && byte <= 126) {
      current += String.fromCharCode(byte);
    } else {
      if (current.trim().length >= 3) {
        strings.push(current.trim());
      }
      current = "";
    }
  }

  if (current.trim().length >= 3) {
    strings.push(current.trim());
  }

  return strings;
}

function cleanSpecValue(value: string): string {
  return value
    .replace(/^[:;,.!@#$%^&*()[\]{}<>\-_=+\\|/`~\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatchingLine(lines: string[], predicate: (line: string) => boolean): string | undefined {
  return lines.map(cleanSpecValue).find((line) => line && predicate(line));
}

function parseSpecValues(lines: string[]): Record<string, string> {
  const values: Record<string, string> = {};
  const flameProtection = firstMatchingLine(
    lines,
    (line) => /\b(?:DIN|EN1021|NF M|FAR|AM18|MVSS|BS5852|IMO|Classe Uno|NORM)\b/i.test(line) && line.length > 12
  );
  const composition = firstMatchingLine(
    lines,
    (line) => /(?:approx\.|ca\.|\d+\s*%).*(?:PVC|PU).*compound/i.test(line)
  );
  const backing = firstMatchingLine(lines, (line) => /\b(?:knitted polyester|PES-knitted|polyester)\b/i.test(line) && /%/.test(line));
  const finish = firstMatchingLine(lines, (line) => /\bPU-finish\b/i.test(line));
  const width = firstMatchingLine(lines, (line) => /<?\b1[345]\d{2}\s*mm\b/i.test(line));
  const rollLength = firstMatchingLine(lines, (line) => /\b\d+\s*m\b/i.test(line) && !/\bmm\b/i.test(line));
  const thickness = firstMatchingLine(lines, (line) => /\b\d+(?:\.\d+)?\s*mm\b/i.test(line) && !/\b1[345]\d{2}\s*mm\b/i.test(line));
  const martindale = firstMatchingLine(lines, (line) => /\b\d+[.,]\d+\s*invers/i.test(line));
  const application = firstMatchingLine(lines, (line) => /\b(?:Hospitality|Public Area|Healthcare|Residential|Fitness|indoor|outdoor)\b/i.test(line));
  const properties = firstMatchingLine(lines, (line) => /\b(?:easy-to-clean|disinfectants|waterproof|abrasions|tearproof|lightfast|vegan|durable|blood|urine)\b/i.test(line));

  values.material = "Vinyl";
  if (composition) values.composition = composition;
  if (backing) values.backing = backing;
  if (finish) values.finish = finish;
  if (width) values.width = width;
  if (rollLength) values.rollLength = rollLength;
  if (thickness) values.thickness = thickness;
  if (martindale) values.martindale = martindale;
  if (flameProtection) values.flameProtection = flameProtection;
  if (application) values.application = application;
  if (properties) values.properties = properties;

  return values;
}

async function loadSpecValues(folderPath: string): Promise<Record<string, string>> {
  try {
    const buffer = await readFile(path.join(folderPath, specFileName));
    return parseSpecValues(extractPrintableStrings(buffer));
  } catch {
    return {};
  }
}

async function loadSkaiVinylFolders() {
  const folderEntries = await readdir(skaiRoot, { withFileTypes: true }).catch(() => []);
  return folderEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en"));
}

async function loadSkaiVinylRecords() {
  const folders = await loadSkaiVinylFolders();
  const records: Array<{
    folderName: string;
    folderPath: string;
    slug: string;
    imageFiles: string[];
    specValues: Record<string, string>;
  }> = [];

  for (const folderName of folders) {
    const folderPath = path.join(skaiRoot, folderName);
    const fileEntries = await readdir(folderPath, { withFileTypes: true });
    const imageFiles = fileEntries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "en"));

    if (imageFiles.length === 0) {
      continue;
    }

    records.push({
      folderName,
      folderPath,
      slug: slugify(folderName),
      imageFiles,
      specValues: await loadSpecValues(folderPath)
    });
  }

  const recordBySlug = new Map(records.map((record) => [record.slug, record]));
  for (const record of records) {
    const fallbackSlug = skaiSpecFallbacks[record.slug];
    if (fallbackSlug && Object.keys(record.specValues).length === 0) {
      record.specValues = { ...(recordBySlug.get(fallbackSlug)?.specValues ?? {}) };
    }
  }

  return records;
}

function buildSkuSpecs(specValues: Record<string, string>) {
  return specTemplate
    .filter((field) => specValues[field.key])
    .map((field) => ({
      label: field.label,
      value: { en: specValues[field.key], ja: specValues[field.key] }
    }));
}

export async function loadSkaiVinylArticles(): Promise<SkaiVinylArticle[]> {
  const records = await loadSkaiVinylRecords();
  const articles = records.map((record) => {
    const firstImage = record.imageFiles[0];
    const firstSkuSlug = parseImageMeta(record.slug, firstImage).slug;

    return {
      slug: record.slug,
      name: record.folderName,
      coverImage: publicSkaiPath(record.folderName, firstImage),
      colorCount: record.imageFiles.length,
      firstSkuSlug
    };
  });

  return articles;
}

export async function loadSkaiVinylProductTypeSlugs(): Promise<Set<string>> {
  const articles = await loadSkaiVinylArticles();
  return new Set(articles.map((article) => article.slug));
}

export async function loadSkaiVinylProductTypes(): Promise<ProductType[]> {
  const records = await loadSkaiVinylRecords();

  return records.map((record) => {
    const coverImage = publicSkaiPath(record.folderName, record.imageFiles[0]);
    const availableSpecTemplate = specTemplate.filter((field) => record.specValues[field.key]);

    return {
      slug: record.slug,
      materialSlug: "vegan-leather",
      name: { en: record.folderName, ja: record.folderName },
      summary: {
        en: getArticleDescription(record.slug, record.folderName, record.imageFiles.length),
        ja: getArticleDescription(record.slug, record.folderName, record.imageFiles.length)
      },
      downloads: skaiDownloads,
      specTemplate: availableSpecTemplate,
      certifications: skaiCertifications,
      maintenance: skaiMaintenance,
      seo: {
        title: { en: `${record.folderName} Vinyl | CAMARI JAPAN`, ja: `${record.folderName} Vinyl | CAMARI JAPAN` },
        description: {
          en: getArticleDescription(record.slug, record.folderName, record.imageFiles.length),
          ja: getArticleDescription(record.slug, record.folderName, record.imageFiles.length)
        },
        image: coverImage
      }
    };
  });
}

export async function loadSkaiVinylSkus(): Promise<Sku[]> {
  const records = await loadSkaiVinylRecords();
  const skus: Sku[] = [];

  for (const record of records) {
    const specs = buildSkuSpecs(record.specValues);

    for (const fileName of record.imageFiles) {
      const image = publicSkaiPath(record.folderName, fileName);
      const meta = parseImageMeta(record.slug, fileName);

      skus.push({
        slug: meta.slug,
        materialSlug: "vegan-leather",
        productTypeSlug: record.slug,
        code: meta.code,
        colorName: { en: meta.colorName, ja: meta.colorName },
        image,
        swatchImage: image,
        previewImage: image,
        summary: {
          en: `${record.folderName} vinyl in ${meta.colorName}.`,
          ja: `${record.folderName} vinyl in ${meta.colorName}.`
        },
        specs,
        certifications: [],
        downloads: [],
        seo: {
          title: { en: `${record.folderName} ${meta.colorName} | CAMARI JAPAN`, ja: `${record.folderName} ${meta.colorName} | CAMARI JAPAN` },
          description: {
            en: `${record.folderName} vinyl colour ${meta.code}.`,
            ja: `${record.folderName} vinyl colour ${meta.code}.`
          },
          image
        }
      });
    }
  }

  return skus;
}
