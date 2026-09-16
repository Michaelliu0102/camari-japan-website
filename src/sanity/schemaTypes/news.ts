import { articleContentField, resourcePathField } from "./editorialFields";
import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const news = defineType({
  name: "news",
  title: "News",
  type: "document",
  fields: [
    articleContentField,
    resourcePathField("coverImagePath", "Existing Cover Image Path / URL"),
    defineField({ name: "availableLocales", title: "Published Languages", type: "array", of: [{ type: "string" }], initialValue: ["en", "ja"], validation: rule => rule.required().min(1), options: { list: ["en", "ja"] } }),
    defineField({ name: "title", title: "Title", type: "object", fields: localizedString }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title.en" }, validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "object", fields: localizedString }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "summary", title: "Summary", type: "object", fields: localizedText }),
    defineField({ name: "body", title: "Legacy Body (use Article Content)", hidden: true, type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" })
  ]
});
