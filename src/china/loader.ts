import { cache } from "react";
import { getSanityClient } from "@/sanity/lib/client";
import { chinaSiteDefaults } from "./defaults";
import { chinaRecordVisible, type ChinaRecord, type ChinaSiteSettings } from "./content";
import { isChinaPreview } from "./config";

export const chinaSiteQuery = `*[_type == "chinaSite" && _id == "chinaSiteSettings"][0]{
  _id,status,brandName,legalName,icpNumber,siteTitle,seoDescription,
  home{status,eyebrow,title,description,"image":coalesce(coverImage.asset->url,image),ctaLabel,brandTitle,brandBody},
  about,contact,downloads{status,title,description,files[]{title,description,"href":coalesce(file.asset->url,href)}}
}`;
export const chinaRecordsQuery = `*[_type in ["materialCategory","material","productCategory","productType","sku","projectCase","news"] && chinaStatus in ["draft","ready"]] | order(sortOrder asc,publishedAt desc) {
  ..., "slug":slug.current,"updatedAt":_updatedAt,
  "image":coalesce(heroImage.asset->url,coverImage.asset->url,coverImagePath),
  "gallery":gallery[].asset->url,
  "categorySlug":category->slug.current,"materialSlug":material->slug.current,"productTypeSlug":productType->slug.current,
  carouselItems[]{...,"image":coverImage.asset->url},
  downloads[]{...,"href":coalesce(file.asset->url,href)},
  articleContent{zh{dateline,"heroImage":coalesce(heroAsset.asset->url,heroImage),relatedLink,video{title,poster,"src":coalesce(file.asset->url,src)},introduction,sections[]{title,body,images[]{alt,"src":coalesce(assetImage.asset->url,src)}}}}
}`;
export function mergeChinaSite(raw: Partial<ChinaSiteSettings> | null): ChinaSiteSettings {
  return {
    ...chinaSiteDefaults,...raw,
    home:{...chinaSiteDefaults.home,...raw?.home}, about:{...chinaSiteDefaults.about,...raw?.about},
    contact:{...chinaSiteDefaults.contact,...raw?.contact}, downloads:{...chinaSiteDefaults.downloads,...raw?.downloads}
  };
}
export function filterChinaRecords(records: ChinaRecord[], preview: boolean): ChinaRecord[] {
  const visible=records.filter(record=>chinaRecordVisible(record,preview));
  // A child page must not leak an untranslated or unlisted parent series/material.
  return visible.filter(record=>{
    if(record._type==="productType")return visible.some(parent=>parent._type==="material"&&parent.slug===record.materialSlug);
    if(record._type==="sku")return visible.some(parent=>parent._type==="productType"&&parent.slug===record.productTypeSlug&&parent.materialSlug===record.materialSlug)
      && visible.some(parent=>parent._type==="material"&&parent.slug===record.materialSlug);
    return true;
  });
}
export const loadChinaContent = cache(async () => {
  // Use Sanity's delivery CDN for published content; the origin API can time out from mainland hosting.
  const client=getSanityClient().withConfig({useCdn:true,perspective:"published"});
  const [raw,records]=await Promise.all([
    client.fetch<ChinaSiteSettings|null>(chinaSiteQuery,{}, {cache:"no-store"}),
    client.fetch<ChinaRecord[]>(chinaRecordsQuery,{}, {cache:"no-store"})
  ]);
  const settings=mergeChinaSite(raw);
  return {settings,records:filterChinaRecords(records??[],isChinaPreview),preview:isChinaPreview,siteReady:Boolean(raw && raw.status==="ready" && raw.brandName?.trim() && raw.siteTitle?.trim() && raw.seoDescription?.trim())};
});
