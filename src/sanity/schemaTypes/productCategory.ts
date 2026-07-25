import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./localizedString";

const productCategorySlugs = [
  { title: "Automotive Interior Accessories", value: "automotive-interior-accessories" },
  { title: "Tech Accessories", value: "tech-accessories" },
  { title: "Lifestyle", value: "lifestyle" },
  { title: "Corporate Gifts", value: "corporation-gift" }
];

export const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: localizedString,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Use one of the four product category slugs shown in PRODUCT navigation.",
      options: { source: "title.en" },
      validation: (rule) =>
        rule.required().custom((value) => {
          const slug = value?.current;

          if (!slug || productCategorySlugs.some((item) => item.value === slug)) {
            return true;
          }

          return `Slug must be one of: ${productCategorySlugs.map((item) => item.value).join(", ")}`;
        })
    }),
    defineField({
      name: "subtitle",
      title: "Hero Subtitle",
      type: "object",
      fields: localizedString
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: localizedText
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "object", fields: localizedString }),
            defineField({ name: "body", title: "Body", type: "object", fields: localizedText })
          ],
          preview: {
            select: {
              title: "title.en",
              subtitle: "body.en"
            }
          }
        }
      ]
    }),
    defineField({
      name: "carouselItems",
      title: "Carousel Items",
      description: "Items shown in the curved hero carousel. Cover Image is used in the carousel; Gallery Images are used in the full-screen detail view.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "coverImage",
              title: "Cover Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "object",
              fields: localizedString,
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "object",
              fields: localizedText
            }),
            defineField({
              name: "customizedOption",
              title: "Customized Option",
              type: "object",
              fields: localizedText
            }),
            defineField({
              name: "details",
              title: "Details",
              type: "array",
              of: [{ type: "object", fields: localizedString }]
            }),
            defineField({
              name: "gallery",
              title: "Gallery Images",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }]
            })
          ],
          preview: {
            select: {
              title: "title.en",
              media: "coverImage"
            },
            prepare({ title, media }) {
              return {
                title: title || "Carousel item",
                media
              };
            }
          }
        }
      ]
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo"
    })
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "slug.current",
      media: "heroImage"
    }
  }
});
