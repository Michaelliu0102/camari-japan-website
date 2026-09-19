import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";
import japaneseCopy from "../../data/about-page-ja.json";

// About layouts differ by market, so paragraph entries may belong to one language only.
const optionalLocalizedString = [
  defineField({ name: "en", title: "English", type: "string" }),
  defineField({ name: "ja", title: "Japanese", type: "string" })
];
const optionalLocalizedText = [
  defineField({ name: "en", title: "English", type: "text", rows: 4 }),
  defineField({ name: "ja", title: "Japanese", type: "text", rows: 4 })
];

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
      name: "bodySubtitle",
      title: "Company Subtitle",
      type: "object",
      fields: optionalLocalizedString
    }),
    defineField({
      name: "bodyParagraphs",
      title: "Body Paragraphs",
      type: "array",
      of: [{ type: "object", fields: optionalLocalizedText }]
    }),
    defineField({
      name: "missionLabel",
      title: "Mission Label",
      type: "object",
      fields: optionalLocalizedString
    }),
    defineField({
      name: "missionTitle",
      title: "Mission Title",
      type: "object",
      fields: optionalLocalizedText
    }),
    defineField({
      name: "missionParagraphs",
      title: "Mission Paragraphs",
      type: "array",
      of: [{ type: "object", fields: optionalLocalizedText }]
    }),
    defineField({
      name: "businessLabel",
      title: "Business Label",
      type: "object",
      fields: optionalLocalizedString
    }),
    defineField({
      name: "businessItems",
      title: "Business Areas",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "object", fields: optionalLocalizedString }),
          defineField({ name: "body", title: "Description", type: "object", fields: optionalLocalizedText })
        ],
        preview: { select: { title: "title.ja", subtitle: "body.ja" } }
      }]
    }),
    defineField({
      name: "manufacturingLabel",
      title: "Manufacturing Label",
      description: "Legacy label. The Japanese factory section uses Manufacturing Title below.",
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
      of: [{ type: "object", fields: optionalLocalizedText }]
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
    bodyLabel: { en: "Company", ja: japaneseCopy.intro.label },
    bodyTitle: { en: "ABOUT CAMARI", ja: japaneseCopy.intro.title },
    bodySubtitle: { ja: japaneseCopy.intro.subtitle },
    bodyParagraphs: japaneseCopy.intro.paragraphs.map((ja, index) => ({ _key: `intro-${index + 1}`, ja })),
    missionLabel: { ja: japaneseCopy.mission.label },
    missionTitle: { ja: japaneseCopy.mission.title },
    missionParagraphs: japaneseCopy.mission.paragraphs.map((ja, index) => ({ _key: `mission-${index + 1}`, ja })),
    businessLabel: { ja: japaneseCopy.business.label },
    businessItems: japaneseCopy.business.items.map((item, index) => ({
      _key: `business-${index + 1}`, title: { ja: item.title }, body: { ja: item.body }
    })),
    manufacturingLabel: { en: "Manufacturing", ja: japaneseCopy.factory.label },
    manufacturingTitle: { en: "OUR FACTORY", ja: japaneseCopy.factory.label },
    manufacturingParagraphs: japaneseCopy.factory.paragraphs.map((ja, index) => ({ _key: `factory-${index + 1}`, ja }))
  }
});
