import Link from "next/link";
import { chinaPath } from "@/china/config";
export default function ChinaNotFound(){return <section className="section-shell min-h-[70vh] space-y-6 py-40 text-charcoal" lang="zh-CN"><p className="label-caps">404</p><h1>此页面暂未开放</h1><p>内容可能尚未发布，或链接已发生变化。</p><Link className="inline-flex border border-charcoal px-6 py-3" href={chinaPath()}>返回首页</Link></section>;}
