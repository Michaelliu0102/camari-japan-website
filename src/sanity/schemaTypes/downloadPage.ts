import { defineField, defineType } from "sanity";
import { downloadFields, editorialStringField, editorialTextField } from "./editorialFields";

export const downloadPage = defineType({
  name: "downloadPage", title: "Download Center / ダウンロード", type: "document",
  fields: [
    editorialStringField("title", "Page Title"), editorialStringField("subtitle", "Subtitle"),
    editorialTextField("heading", "Heading"), editorialTextField("description", "Introduction"),
    editorialStringField("availableFilesLabel", "Available Files Label"), editorialStringField("downloadLabel", "Download Button Label"),
    editorialStringField("fileLabel", "File Count Label"),
    defineField({ name: "groups", title: "Download Groups", type: "array", of: [{ type: "object", fields: [
      defineField({ name: "slug", title: "Group ID", type: "string", validation: rule => rule.required() }),
      editorialStringField("label", "Group Title"), editorialTextField("intro", "Group Description"),
      defineField({ name: "downloads", title: "Files", type: "array", of: [{ type: "object", fields: downloadFields, preview: { select: { title: "title.en", subtitle: "title.ja" } } }] })
    ], preview: { select: { title: "label.en", subtitle: "label.ja" } } }] })
  ], preview: { prepare: () => ({ title: "Download Center" }) }
});
