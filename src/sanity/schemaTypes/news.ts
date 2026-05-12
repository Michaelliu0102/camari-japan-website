import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const news = defineType({
  name: "news",
  title: "News",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "object", fields: localizedString }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title.en" }, validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "object", fields: localizedString }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "summary", title: "Summary", type: "object", fields: localizedText }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" })
  ]
});
