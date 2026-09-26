import { editorialTextField, editorialStringField } from "./editorialFields";
import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "seoTitle",
      title: "Homepage SEO Title",
      type: "object",
      fields: localizedString,
      description: "Browser and search-result title for each language. Include the CAMARI brand suffix."
    }),
    editorialStringField("brandValueLabel", "Brand Value Label"),
    editorialTextField("brandValueTitle", "Brand Value Heading"),
    editorialTextField("brandValueBody", "Brand Value Body"),
    editorialStringField("brandValueLinkLabel", "Brand Value Link Label"),
    editorialTextField("ctaTitle", "Bottom CTA Heading"),
    editorialTextField("ctaBody", "Bottom CTA Body"),
    editorialStringField("ctaLabel", "Location Button Label"),
    editorialStringField("ctaSecondaryLabel", "Inquiry Button Label"),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "heroVideoPlaybackId",
      title: "Hero Mux Playback ID",
      type: "string",
      description: "Only the Mux playback ID, not the full stream URL."
    }),
    defineField({
      name: "heroVideoUrl",
      title: "Hero Video URL",
      type: "url",
      description: "Optional direct video URL. If set, this overrides the Mux playback ID."
    }),
    defineField({
      name: "heroPoster",
      title: "Hero Poster Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA Label",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "heroCtaHref",
      title: "Hero CTA Link",
      type: "string",
      initialValue: "/materials"
    }),
    defineField({
      name: "exploreMaterialCategories",
      title: "Explore Material Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "materialCategory" }] }]
    }),
    defineField({
      name: "brandValueImage",
      title: "Brand Value Image",
      type: "image",
      options: { hotspot: true },
      description: "Image displayed alongside the brand value statement on the homepage."
    }),
    defineField({
      name: "showroomBackgroundImage",
      title: "Showroom Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Background image for the Showroom CTA section."
    }),
    defineField({
      name: "exploreProductSlides",
      title: "Explore Product Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "slug", title: "Slug", type: "string" }),
            defineField({ name: "title", title: "Title", type: "object", fields: localizedString }),
            defineField({ name: "category", title: "Category Label", type: "object", fields: localizedString }),
            defineField({ name: "description", title: "Description", type: "object", fields: localizedText }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "href", title: "Link", type: "string" })
          ]
        }
      ]
    })
  ]
});
