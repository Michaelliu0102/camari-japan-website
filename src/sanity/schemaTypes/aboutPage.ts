import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "object",
      fields: localizedText
    }),
    defineField({
      name: "seoImage",
      title: "SEO Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "heroAlt",
      title: "Hero Image Alt Text",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "exploreLabel",
      title: "Explore Label",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "bodyLabel",
      title: "Body Label",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "bodyTitle",
      title: "Body Title",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "bodyParagraphs",
      title: "Body Paragraphs",
      type: "array",
      of: [{ type: "object", fields: localizedText }]
    }),
    defineField({
      name: "manufacturingLabel",
      title: "Manufacturing Label",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "manufacturingTitle",
      title: "Manufacturing Title",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "manufacturingParagraphs",
      title: "Manufacturing Paragraphs",
      type: "array",
      of: [{ type: "object", fields: localizedText }]
    })
  ],
  initialValue: {
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
      {
        en: "CAMARI INTERNATIONAL JAPAN curates premium surface materials for teams who treat texture as an essential part of brand, space, and product quality.",
        ja: "CAMARI INTERNATIONAL JAPAN は、質感をブランド、空間、プロダクト品質の中核として扱うチームに向けて、上質なサーフェス素材を選定します。"
      }
    ],
    manufacturingLabel: { en: "Manufacturing", ja: "Manufacturing" },
    manufacturingTitle: { en: "OUR FACTORY", ja: "OUR FACTORY" },
    manufacturingParagraphs: [
      {
        en: "SHENGHUA is factory from 2000.",
        ja: "SHENGHUA is factory from 2000."
      }
    ]
  }
});
