import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const productType = defineType({
  name: "productType",
  title: "Product Type",
  type: "document",
  fields: [
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
      name: "material",
      title: "Material",
      type: "reference",
      to: [{ type: "material" }],
      validation: (rule) => rule.required()
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
