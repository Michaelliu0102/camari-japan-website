import type { ReactNode } from "react";
import { loadChinaContent } from "@/china/loader";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import "./china.css";
export default async function ChinaLayout({children}:{children:ReactNode}) {
  const {settings,preview,siteReady}=await loadChinaContent();
  if(!preview&&!siteReady)return <div lang="zh-CN">{children}</div>;
  return <div className="china-shared-site" lang="zh-CN">
    <GlobalNav locale="zh"/>
    {children}
    <Footer locale="zh" chinaSettings={settings}/>
  </div>;
}
