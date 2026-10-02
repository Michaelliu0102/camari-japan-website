import { chinaStatusField, chinaMarketsField } from "./chinaFields";
import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";
import { localizedDocumentPreview } from "./documentPreview";

export const projectCase = defineType({
  name: "projectCase",
  title: "Project Case",
  type: "document",
  preview: localizedDocumentPreview("title", "Unnamed project case", "coverImage"),
  fields: [
    chinaStatusField,
    chinaMarketsField,
    defineField({
      name: "replacedBy", title: "Archived Duplicate Of", type: "reference", to: [{ type: "projectCase" }], weak: true,
      description: "Duplicate cases are retained as unpublished drafts. Do not republish; use the selected case."
    }),
    defineField({ name: "title", title: "Title", type: "object", fields: localizedString }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title.en" }, validation: (rule) => rule.required() }),
    defineField({ name: "industry", title: "Industry", type: "object", fields: localizedString }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "summary", title: "Summary", type: "object", fields: localizedText }),
    defineField({ name: "relatedMaterial", title: "Primary Material", type: "reference", to: [{ type: "material" }] }),
    defineField({
      name: "linkedMaterials",
      title: "Additional Materials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "material" }] }]
    }),
    defineField({
      name: "linkedArticles",
      title: "Linked Articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productType" }] }]
    }),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({
      name: "linkedArticleLabels", title: "Case-specific Product Labels", type: "array",
      description: "Optional display names for linked products, e.g. MASTER FR linking to the MASTER family.",
      of: [{
        type: "object", name: "projectArticleLabel", fields: [
          defineField({ name: "article", title: "Linked Product", type: "reference", to: [{ type: "productType" }], validation: (rule) => rule.required() }),
          defineField({ name: "name", title: "Display Name", type: "object", fields: localizedString })
        ]
      }]
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" })
  ]
});
