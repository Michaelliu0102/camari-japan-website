import { chinaStatusField, chinaMarketsField } from "./chinaFields";
import { validateMarketContent } from "./marketValidation";
import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const sku = defineType({
  name: "sku",
  title: "SKU",
  type: "document",
  validation: rule => rule.custom(validateMarketContent),
  fields: [
    chinaStatusField,
    chinaMarketsField,
    defineField({
      name: "code",
      title: "SKU Code",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "code" },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "reference",
      to: [{ type: "material" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "productType",
      title: "Product Type",
      type: "reference",
      to: [{ type: "productType" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "colorName",
      title: "Manufacturer Colour Name / 原厂色名",
      description: "English stores the original manufacturer name. Japanese is an optional alias; when empty the original name is displayed.",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "hex",
      title: "Hex Color",
      type: "string"
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "previewImage",
      title: "Card Preview Image",
      description: "Optional square preview used only in the Fabric card hover strip.",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "caseGallery",
      title: "SKU Case Gallery",
      description: "Application and case images shown below the SKU thumbnail on the detail page.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
            defineField({ name: "alt", title: "Alt Text", type: "object", fields: localizedString })
          ],
          preview: {
            select: {
              title: "alt.en",
              media: "image"
            },
            prepare({ title, media }) {
              return {
                title: title || "Case image",
                media
              };
            }
          }
        }
      ]
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "object",
      fields: localizedText
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "object", fields: localizedString }),
            defineField({ name: "value", title: "Value", type: "object", fields: localizedString })
          ]
        }
      ]
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [{ type: "object", fields: localizedString }]
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo"
    })
  ]
});
