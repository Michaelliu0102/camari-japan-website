import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const client = getCliClient({ apiVersion: "2026-05-12" });
const heroImagePath = path.join(root, "public/uploads/hero/showroom.png");

function ref(_ref) {
  return { _type: "reference", _ref };
}

async function uploadHeroImage() {
  if (!fs.existsSync(heroImagePath)) {
    console.warn(`Hero image not found at ${heroImagePath}; creating About Page without an image asset.`);
    return undefined;
  }

  const asset = await client.assets.upload("image", fs.createReadStream(heroImagePath), {
    filename: path.basename(heroImagePath)
  });

  return {
    _type: "image",
    asset: ref(asset._id)
  };
}

function keyedParagraph(value, index) {
  return {
    _key: `about-paragraph-${index + 1}`,
    ...value
  };
}

const heroImage = await uploadHeroImage();
const imagePatch = heroImage ? { heroImage, seoImage: heroImage } : {};

await client.createIfNotExists({
  _id: "aboutPage",
  _type: "aboutPage"
});

await client
  .patch("aboutPage")
  .set({
    seoTitle: { en: "About | CAMARI INTERNATIONAL JAPAN", ja: "会社情報 | CAMARI INTERNATIONAL JAPAN" },
    seoDescription: {
      en: "Learn about CAMARI INTERNATIONAL JAPAN's material philosophy, company values, and contact information.",
      ja: "CAMARI INTERNATIONAL JAPAN の素材哲学、企業価値、連絡先について。"
    },
    heroAlt: { en: "CAMARI showroom interior", ja: "CAMARI ショールーム内観" },
    heroTitle: { en: "CAMARI", ja: "CAMARI" },
    exploreLabel: { en: "Explore", ja: "Explore" },
    bodyLabel: { en: "Company", ja: "Company" },
    bodyTitle: { en: "ABOUT CAMARI", ja: "ABOUT CAMARI" },
    bodyParagraphs: [
      keyedParagraph(
        {
          en: "CAMARI INTERNATIONAL JAPAN curates premium surface materials for teams who treat texture as an essential part of brand, space, and product quality.",
          ja: "CAMARI INTERNATIONAL JAPAN は、質感をブランド、空間、プロダクト品質の中核として扱うチームに向けて、上質なサーフェス素材を選定します。"
        },
        0
      )
    ],
    manufacturingLabel: { en: "Manufacturing", ja: "Manufacturing" },
    manufacturingTitle: { en: "OUR FACTORY", ja: "OUR FACTORY" },
    manufacturingParagraphs: [
      keyedParagraph(
        {
          en: "SHENGHUA is factory from 2000.",
          ja: "SHENGHUA is factory from 2000."
        },
        0
      )
    ],
    ...imagePatch
  })
  .commit();

console.log("Seeded About Page document: aboutPage");
