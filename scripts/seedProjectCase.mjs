import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const client = getCliClient({ apiVersion: "2026-05-12" });

const projectId = "projectCase-private-automotive-cabin";
const materialId = "material-alcantara";
const imagePaths = [
  path.join(root, "public/uploads/carousel/alcantara.jpeg"),
  path.join(root, "public/uploads/alcantara/exo/9604.jpeg"),
  path.join(root, "public/uploads/alcantara/exo/1709.jpeg")
];

function ref(_ref) {
  return { _type: "reference", _ref };
}

async function uploadImage(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image not found: ${filePath}`);
  }

  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath)
  });

  return {
    _type: "image",
    asset: ref(asset._id)
  };
}

const [coverImage, galleryImage1, galleryImage2] = await Promise.all(imagePaths.map(uploadImage));

const doc = {
  _id: projectId,
  _type: "projectCase",
  title: {
    en: "Private Automotive Cabin",
    ja: "プライベートオートモーティブキャビン"
  },
  slug: {
    _type: "slug",
    current: "private-automotive-cabin"
  },
  industry: {
    en: "Automotive",
    ja: "自動車"
  },
  coverImage,
  summary: {
    en: "A restrained cabin material program using deep Alcantara surfaces and precision panel transitions.",
    ja: "深い Alcantara サーフェスと精密なパネル遷移で構成した、抑制されたキャビンプログラム。"
  },
  relatedMaterial: ref(materialId),
  gallery: [galleryImage1, galleryImage2],
  seo: {
    title: {
      en: "Private Automotive Cabin | CAMARI JAPAN",
      ja: "プライベートオートモーティブキャビン | CAMARI JAPAN"
    },
    description: {
      en: "OEM/ODM automotive material case using Alcantara surfaces.",
      ja: "Alcantara サーフェスを用いた OEM/ODM 自動車素材事例。"
    },
    image: coverImage
  }
};

await client.createOrReplace(doc);

console.log(`Seeded Project Case document: ${projectId}`);
