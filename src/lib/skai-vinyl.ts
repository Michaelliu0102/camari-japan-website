import { cache } from "react";
import { isSkaiProductType } from "@/lib/skai-collections";
import { loadProductTypes, loadSkus } from "@/sanity/lib/loaders";

export type SkaiVinylArticle = {
  slug: string;
  name: string;
  coverImage: string;
  colorCount: number;
  firstSkuSlug: string;
  fieldOfApplication: string;
};

export const loadSkaiVinylProductTypeSlugs = cache(async (): Promise<Set<string>> => {
  const productTypes = await loadProductTypes();
  return new Set(productTypes.filter(isSkaiProductType).map((productType) => productType.slug));
});

export const loadSkaiVinylArticles = cache(async (): Promise<SkaiVinylArticle[]> => {
  const [productTypes, skus] = await Promise.all([loadProductTypes(), loadSkus()]);
  return productTypes.filter(isSkaiProductType).flatMap((productType) => {
    const colors = skus.filter((sku) =>
      sku.materialSlug === productType.materialSlug && sku.productTypeSlug === productType.slug
    );
    const first = colors[0];
    if (!first) return [];
    return [{
      slug: productType.slug,
      name: productType.name.en,
      coverImage: productType.seo.image || first.previewImage || first.image,
      colorCount: colors.length,
      firstSkuSlug: first.slug,
      fieldOfApplication: productType.specTemplate.find((field) =>
        field.key === "fieldOfApplication" || field.label.en.trim().toLowerCase() === "field of application"
      )?.defaultValue?.en ?? ""
    }];
  });
});
