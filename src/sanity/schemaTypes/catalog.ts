import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const catalog = defineType({
  name: "catalog",
  title: "Catalog",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "object", fields: localizedString }),
    defineField({ name: "description", title: "Description", type: "object", fields: localizedText }),
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "ja"] } }),
    defineField({ name: "pdf", title: "PDF", type: "file", validation: (rule) => rule.required() }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } })
  ]
});
