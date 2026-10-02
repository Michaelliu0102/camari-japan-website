import { chinaStatusField } from "./chinaFields";
import { downloadFields } from "./editorialFields";
import { validateMarketContent } from "./marketValidation";
import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";
import { localizedDocumentPreview } from "./documentPreview";

export const productType = defineType({
  name: "productType",
  title: "Product Type",
  type: "document",
  preview: localizedDocumentPreview("name", "Unnamed product type"),
  validation: rule => rule.custom(validateMarketContent),
  fields: [
    chinaStatusField,
    defineField({ name: "editorialDownloadsMigrated", title: "Editorial Download Migration", type: "boolean", hidden: true, readOnly: true }),
    defineField({
      name: "name",
      title: "Name",
      type: "object",
      fields: localizedString,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name.en" },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "markets",
      title: "Target Markets / Websites",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "China 中国大陆 (.com.cn)", value: "china" },
          { title: "Global International (.com)", value: "global" },
          { title: "Japan Only (.co.jp)", value: "japan" }
        ],
        layout: "tags"
      },
      validation: (rule) => rule.required().min(1).error("At least one target market must be selected.")
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "reference",
      to: [{ type: "material" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "object",
      fields: localizedText
    }),
    defineField({
      name: "downloads",
      title: "Downloads",
      type: "array",
      of: [
        {
          type: "object",
          fields: downloadFields
        }
      ]
    }),
    defineField({
      name: "specTemplate",
      title: "Specification Template",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key", title: "Key", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "label", title: "Label", type: "object", fields: localizedString }),
            defineField({ name: "aliases", title: "Aliases", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "defaultValue", title: "Default Value", type: "object", fields: localizedString })
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
      name: "maintenance",
      title: "Maintenance and Use",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "object", fields: localizedString }),
            defineField({ name: "description", title: "Description", type: "object", fields: localizedText })
          ]
        }
      ]
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo"
    })
  ]
});
