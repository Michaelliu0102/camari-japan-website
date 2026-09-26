import type { Metadata } from "next";
import { chinaSiteUrl } from "./config";
import { chinaTitle, chineseText, type ChinaRecord, type ChinaSiteSettings } from "./content";
export function chinaMetadata(path:string,settings:ChinaSiteSettings,preview:boolean,record?:ChinaRecord):Metadata {
  const labels:Record<string,string>={"/":"首页","/about":"关于我们","/materials":"材料","/products":"产品","/projects":"应用案例","/media":"新闻","/downloads":"资料下载","/contact":"联系我们","/search":"搜索"};
  const title=record?(chineseText(record.seo?.title)||chinaTitle(record)):(path==="/"?settings.siteTitle:`${labels[path]??"页面"}｜${settings.brandName}`);
  const description=record?chineseText(record.seo?.description):settings.seoDescription;
  const url=new URL(path,chinaSiteUrl).toString();
  return {metadataBase:new URL(chinaSiteUrl),title,description,robots:{index:!preview&&path!=="/search",follow:!preview},
    alternates:{canonical:url,languages:{"zh-CN":url}},
    openGraph:{title,description,url,locale:"zh_CN",siteName:settings.brandName,type:record?._type==="news"?"article":"website",...(record?.image?{images:[record.image]}:{})}
  };
}
