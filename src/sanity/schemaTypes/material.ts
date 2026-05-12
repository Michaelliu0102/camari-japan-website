import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const material = defineType({
  name: "material",
  title: "Material",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name.en" },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "materialCategory" }]
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "introTitle",
      title: "Intro Title",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "introBody",
      title: "Intro Body",
      type: "object",
      fields: localizedText
    }),
    defineField({
      name: "introImage",
      title: "Intro Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "applications",
      title: "Applications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "object", fields: localizedString }),
            defineField({ name: "colorCount", title: "Color Count", type: "number" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } })
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
