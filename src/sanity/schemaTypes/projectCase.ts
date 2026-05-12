import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const projectCase = defineType({
  name: "projectCase",
  title: "Project Case",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "object", fields: localizedString }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title.en" }, validation: (rule) => rule.required() }),
    defineField({ name: "industry", title: "Industry", type: "object", fields: localizedString }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "summary", title: "Summary", type: "object", fields: localizedText }),
    defineField({ name: "relatedMaterial", title: "Related Material", type: "reference", to: [{ type: "material" }] }),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" })
  ]
});
