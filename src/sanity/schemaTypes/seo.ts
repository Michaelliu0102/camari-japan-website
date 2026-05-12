import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: localizedText
    }),
    defineField({
      name: "image",
      title: "Open Graph Image",
      type: "image",
      options: { hotspot: true }
    })
  ]
});
