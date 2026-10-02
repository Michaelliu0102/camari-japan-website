import type { Locale } from "../lib/locales";
import { cache } from "react";
import { headers } from "next/headers.js";
import { getSanityMarket } from "../sanity/lib/market";
// Request scoped: a Chinese preview always uses the complete international catalog.
export const getDeliveryMarket=cache(async(locale?:Locale)=>{
  if(locale === "zh" || locale === "en")return "global" as const;
  if(process.env.NEXT_PUBLIC_SITE_KEY==="china")return "global" as const;
  if(process.env.NODE_ENV === "production")return getSanityMarket();
  const values=await headers();
  if(values.get("x-camari-site")==="china"||values.get("x-camari-locale")==="en")return "global" as const;
  return getSanityMarket();
});
