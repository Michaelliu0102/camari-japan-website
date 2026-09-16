import type { ReactNode } from "react";
import Link from "next/link";
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
    {preview?<aside className="china-preview-note">中文预览 · 与英文站共用完整内容，未翻译正文保留英文 <Link href="/studio/structure/chinaSite;chinaSiteSettings">后台设置 ↗</Link></aside>:null}
  </div>;
}
