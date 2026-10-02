import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadChinaContent } from "@/china/loader";
import { chinaPageReady } from "@/china/routes";
import { isChinaBuild } from "@/china/config";
import { chinaPageKey,chinaPageModules } from "@/china/page-registry";
export const dynamic="force-dynamic";
type Props={params:Promise<{segments?:string[]}>;searchParams?:Promise<Record<string,string|string[]|undefined>>};
async function resolvePage(props:Props) {
  const segments=(await props.params).segments??[];
  const key=chinaPageKey(segments);
  if(!key)notFound();
  const context=await loadChinaContent();
  const path=`/${segments.map(encodeURIComponent).join("/")}`;
  if(!context.preview&&(!isChinaBuild||!context.siteReady||!chinaPageReady(path,context.settings,context.records)))notFound();
  const pageModule=await chinaPageModules[key]();
  const params=Promise.resolve({locale:"zh" as const,materialSlug:segments[1]??"",productTypeSlug:segments[2]??"",skuSlug:segments[3]??"",categorySlug:segments[1]??"",projectSlug:segments[1]??"",newsSlug:segments[1]??""});
  return {pageModule,params,context,path};
}
export async function generateMetadata(props:Props):Promise<Metadata> {
  const {pageModule,params,context,path}=await resolvePage(props);
  const metadata="generateMetadata" in pageModule?await pageModule.generateMetadata({params}):{};
  return {...metadata,...(path==="/"?{title:context.settings.siteTitle,description:context.settings.seoDescription}:{}),robots:context.preview?{index:false,follow:false}:metadata.robots};
}
export default async function ChinaPage(props:Props) {
  const {pageModule,params}=await resolvePage(props);
  const Page=pageModule.default;
  return (await Page({params,searchParams:props.searchParams})) ?? null;
}
