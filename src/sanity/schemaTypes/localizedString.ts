import { defineField } from "sanity";

export const localizedString = [
  defineField({
    name: "en",
    title: "English",
    type: "string",
    validation: (rule) => rule.required()
  }),
  defineField({
    name: "ja",
    title: "Japanese",
    type: "string",
    validation: (rule) => rule.required()
  })
];

export const localizedText = [
  defineField({
    name: "en",
    title: "English",
    type: "text",
    rows: 4,
    validation: (rule) => rule.required()
  }),
  defineField({
    name: "ja",
    title: "Japanese",
    type: "text",
    rows: 4,
    validation: (rule) => rule.required()
  })
];
