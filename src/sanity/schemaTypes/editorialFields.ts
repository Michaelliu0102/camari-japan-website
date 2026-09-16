import { defineField } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const optionalLocalizedString = localizedString.map((field) => ({ ...field, validation: undefined }));
export const optionalLocalizedText = localizedText.map((field) => ({ ...field, validation: undefined }));
export const editorialTextField = (name: string, title: string) => defineField({ name, title, type: "object", fields: optionalLocalizedText });
export const editorialStringField = (name: string, title: string) => defineField({ name, title, type: "object", fields: optionalLocalizedString });

export const resourcePathField = (name: string, title: string) => defineField({
  name, title, type: "string", description: "Website path (/uploads/…) or full HTTPS URL. Upload a replacement file to override this path.",
  validation: (rule) => rule.custom((value) => !value || /^(\/[^/]|https?:\/\/)/.test(value) ? true : "Use a website path or an HTTP(S) URL.")
});

export const downloadFields = [
  editorialStringField("title", "Title"),
  editorialTextField("description", "Description"),
  defineField({ name: "file", title: "File", type: "file" }),
  resourcePathField("href", "Existing File Path / URL"),
  defineField({ name: "type", title: "Type", type: "string", options: { list: ["catalog", "technical", "care"] } })
];

export const faqField = defineField({
  name: "faq", title: "Frequently Asked Questions / よくあるご質問", type: "object",
  description: "Edit each language separately. Remove all entries to hide its FAQ section.",
  fields: ["en", "ja"].map((locale) => defineField({
    name: locale, title: locale === "en" ? "English" : "Japanese", type: "array", of: [{
      type: "object", fields: [
        defineField({ name: "question", title: "Question", type: "string" }),
        defineField({ name: "answer", title: "Answer", type: "text", rows: 5 }),
        defineField({ name: "link", title: "Related Link", type: "object", fields: [resourcePathField("href", "Link"), defineField({ name: "label", title: "Label", type: "string" })] })
      ], preview: { select: { title: "question" } }
    }]
  }))
});

const articleFields = [
  defineField({ name: "dateline", title: "Date Label", type: "string" }),
  defineField({ name: "heroFormat", title: "Cover Layout", type: "string", options: { list: ["landscape", "portrait", "standard"] } }),
  resourcePathField("heroImage", "Existing Cover Path / URL"),
  defineField({ name: "heroAsset", title: "Cover Image", type: "image", options: { hotspot: true } }),
  defineField({ name: "introduction", title: "Introduction Paragraphs", type: "array", of: [{ type: "text" }] }),
  defineField({ name: "sections", title: "Article Sections", type: "array", of: [{ type: "object", fields: [
    defineField({ name: "title", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Paragraphs", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "images", title: "Images", type: "array", of: [{ type: "object", fields: [
      resourcePathField("src", "Existing Image Path / URL"),
      defineField({ name: "assetImage", title: "Image", type: "image", options: { hotspot: true } }),
      defineField({ name: "alt", title: "Image Description", type: "string" }),
      defineField({ name: "aspectRatio", title: "Aspect Ratio (width / height)", type: "string" }),
      defineField({ name: "featured", title: "Full Width", type: "boolean" })
    ], preview: { select: { title: "alt", media: "assetImage" } } }] })
  ], preview: { select: { title: "title" } } }] }),
  defineField({ name: "relatedLink", title: "Related Link", type: "object", fields: [resourcePathField("href", "Link"), defineField({ name: "label", title: "Label", type: "string" })] }),
  defineField({ name: "video", title: "Video", type: "object", fields: [
    resourcePathField("src", "Video Path / URL"), defineField({ name: "file", title: "Video File", type: "file" }),
    resourcePathField("poster", "Poster Path / URL"), defineField({ name: "title", title: "Video Title", type: "string" })
  ] })
];
export const articleContentField = defineField({
  name: "articleContent", title: "Article Content / 記事本文", type: "object",
  fields: ["en", "ja"].map(locale => defineField({ name: locale, title: locale === "en" ? "English" : "Japanese", type: "object", fields: articleFields }))
});
