"use client";
export default function ChinaError({reset}:{reset:()=>void}){return <section className="section-shell min-h-[70vh] space-y-6 py-40 text-charcoal" lang="zh-CN"><h1>暂时无法加载内容</h1><p>请稍后再试。</p><button className="inline-flex border border-charcoal px-6 py-3" onClick={reset}>重新加载</button></section>;}
