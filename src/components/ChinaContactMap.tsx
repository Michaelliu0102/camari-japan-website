"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { useConsent } from "@/components/ConsentManager";

const placeUrl = "https://www.amap.com/place/B0FFHCUY2V";
const position = [120.740869, 30.799941];
type MapInstance = { add(marker: unknown): void; on(event: string, callback: () => void): void; destroy(): void };
type MapApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => MapInstance;
  Marker: new (options: Record<string, unknown>) => unknown;
};
type MapWindow = Window & { AMap?: MapApi; _AMapSecurityConfig?: { securityJsCode: string } };
let sdkPromise: Promise<MapApi> | undefined;

function loadSdk(key: string, securityCode: string) {
  const target = window as MapWindow;
  if (target.AMap) return Promise.resolve(target.AMap);
  if (sdkPromise) return sdkPromise;
  target._AMapSecurityConfig = { securityJsCode: securityCode };
  sdkPromise = new Promise<MapApi>((resolve, reject) => {
    const script = document.createElement("script");
    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      sdkPromise = undefined;
      reject(new Error("AMap unavailable"));
    };
    const timeout = window.setTimeout(fail, 15000);
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}`;
    script.async = true;
    script.onerror = fail;
    script.onload = () => {
      if (!target.AMap) { fail(); return; }
      window.clearTimeout(timeout);
      resolve(target.AMap);
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export function ChinaContactMap({ address }: { address?: string }) {
  const { externalMediaAllowed, grantExternalMedia } = useConsent();
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [attempt, setAttempt] = useState(0);
  const key = process.env.NEXT_PUBLIC_AMAP_KEY;
  const securityCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE;

  useEffect(() => {
    if (!externalMediaAllowed || !container.current) return;
    let disposed = false;
    let map: MapInstance | undefined;
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      if (!disposed) setStatus("failed");
    }, 20000);
    const ready = key && securityCode ? loadSdk(key, securityCode) : Promise.reject(new Error("Missing map configuration"));
    ready.then(api => {
      if (disposed || timedOut || !container.current) return;
      map = new api.Map(container.current, { center: position, zoom: 16, viewMode: "2D", scrollWheel: false });
      map.on("complete", () => {
        if (disposed || timedOut) return;
        window.clearTimeout(timeout);
        setStatus("ready");
      });
      map.add(new api.Marker({ position, title: "卡玛瑞中国展厅与办公室" }));
    }).catch(() => {
      window.clearTimeout(timeout);
      if (!disposed) setStatus("failed");
    });
    return () => { disposed = true; window.clearTimeout(timeout); map?.destroy(); };
  }, [externalMediaAllowed, key, securityCode, attempt]);

  return (
    <section aria-label="卡玛瑞中国展厅位置" className="overflow-hidden border border-charcoal/10 bg-stone">
      {externalMediaAllowed ? (
        <div className={status === "failed" ? "hidden" : "relative"}>
          <div ref={container} role="region" aria-label="高德地图：卡玛瑞国际有限公司" className="h-[360px] w-full sm:h-[440px] lg:h-[560px]" />
          {status === "loading" ? <p role="status" className="absolute left-4 top-4 bg-paper px-4 py-3 text-sm">地图加载中…</p> : null}
        </div>
      ) : null}
      <div className="flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between md:p-10">
        <div className="flex min-w-0 gap-4">
          <MapPin className="mt-1 shrink-0 text-gold" aria-hidden="true" size={24} />
          <div>
            <h3 className="text-xl font-medium">卡玛瑞中国 · 展厅与办公室</h3>
            <p className="mt-3 text-base leading-7 text-muted">{address || "浙江省嘉兴市禾兴北路1525号"}</p>
            <p className="mt-2 text-sm leading-6 text-muted">欢迎提前联系销售团队，预约来访。</p>
            {status === "failed" ? <p role="status" className="mt-2 text-sm text-muted">地图暂时无法加载，请重试或打开高德地图导航。</p> : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3">
          {!externalMediaAllowed ? <button type="button" onClick={grantExternalMedia} className="min-h-11 border border-charcoal/20 px-5 py-3 text-sm">允许外部媒体并显示地图</button> : null}
          {status === "failed" ? <button type="button" onClick={() => { setStatus("loading"); setAttempt(value => value + 1); }} className="min-h-11 border border-charcoal/20 px-5 py-3 text-sm">重新加载地图</button> : null}
          <a href={placeUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 bg-charcoal px-6 py-3 text-sm text-paper transition-colors hover:bg-gold">
            <Navigation aria-hidden="true" size={17} /> 高德地图导航
          </a>
        </div>
      </div>
    </section>
  );
}
