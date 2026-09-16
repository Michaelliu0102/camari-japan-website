import { defineField } from "sanity";

export function isLocaleRequired(document: { _type?: string; availableLocales?: unknown } | undefined, locale: "en" | "ja"): boolean {
  if (document?._type === "news" && Array.isArray(document.availableLocales)) return document.availableLocales.includes(locale);
  return locale !== "ja" || !["productType", "sku"].includes(document?._type ?? "");
}

export const localizedString = [
  defineField({
    name: "en",
    title: "English",
    type: "string",
    validation: (rule) => rule.custom((value, context) => !isLocaleRequired(context.document, "en") || Boolean(value?.trim()) ? true : "English is required.")
  }),
  defineField({
    name: "ja",
    title: "Japanese",
    type: "string",
    description: "For products/SKUs, Japanese requirements follow the target market. Original colour names may remain untranslated.",
    validation: (rule) => rule.custom((value, context) => !isLocaleRequired(context.document, "ja") || Boolean(value?.trim()) ? true : "Japanese is required.")
  }),
  defineField({ name: "zh", title: "简体中文", type: "string", description: "中文内容独立编辑；未完成时不影响英日文更新。" })
];

export const localizedText = [
  defineField({
    name: "en",
    title: "English",
    type: "text",
    rows: 4,
    validation: (rule) => rule.custom((value, context) => !isLocaleRequired(context.document, "en") || Boolean(value?.trim()) ? true : "English is required.")
  }),
  defineField({
    name: "ja",
    title: "Japanese",
    type: "text",
    rows: 4,
    description: "For products/SKUs, Japanese requirements follow the target market.",
    validation: (rule) => rule.custom((value, context) => !isLocaleRequired(context.document, "ja") || Boolean(value?.trim()) ? true : "Japanese is required.")
  }),
  defineField({ name: "zh", title: "简体中文", type: "text", rows: 4, description: "中文内容独立编辑；审核通过前仅供预览。" })
];
