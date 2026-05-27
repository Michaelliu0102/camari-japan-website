"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

type Market = "global" | "japan";

type ExplodedPart = {
  key: string;
  title: string;
  image: string;
  width: string;
  left: string;
  top: string;
  rotate: number;
  delay: number;
  spring: {
    stiffness: number;
    damping: number;
  };
  hotspot: {
    left: string;
    top: string;
  };
  description: Record<Market, string>;
};

const mockSvg = (label: string, tone: string, stroke: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 190"><defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="rgb(26 26 26)" flood-opacity=".18"/></filter><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${tone}" stop-opacity=".92"/><stop offset="1" stop-color="oklch(0.92 0.014 78)" stop-opacity=".82"/></linearGradient></defs><path d="M38 104C55 42 111 26 182 31c80 6 141 39 146 86 4 39-45 58-133 53-92-5-172-23-157-66Z" fill="url(#g)" filter="url(#s)"/><path d="M67 101c41-26 91-36 150-30 38 4 67 15 87 33" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round" opacity=".32"/><text x="180" y="114" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="3" fill="rgb(46 44 40)" opacity=".72">${label}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const assemblyImage = mockSvg("ASSEMBLY", "oklch(0.86 0.018 78)", "oklch(0.52 0.04 78)");

const parts: ExplodedPart[] = [
  {
    key: "surface",
    title: "Alcantara® Fabric Layer",
    image: mockSvg("SURFACE", "oklch(0.83 0.025 76)", "oklch(0.48 0.055 76)"),
    width: "min(34vw, 380px)",
    left: "49%",
    top: "32%",
    rotate: -8,
    delay: 0.1,
    spring: { stiffness: 138, damping: 17 },
    hotspot: { left: "50%", top: "48%" },
    description: {
      global:
        "A tactile microfibre surface engineered for soft optical depth, controlled nap direction, and low-glare cabin environments. The layer balances premium hand feel with abrasion resistance for high-contact interiors.",
      japan:
        "触感の奥行き、毛並み方向の制御、低グレアな車室環境を想定したマイクロファイバー表層です。高接触部位に必要な耐摩耗性と、上質な手触りを両立します。"
    }
  },
  {
    key: "foam",
    title: "Pressure Recovery Foam",
    image: mockSvg("FOAM", "oklch(0.89 0.012 110)", "oklch(0.56 0.045 110)"),
    width: "min(30vw, 330px)",
    left: "24%",
    top: "54%",
    rotate: 10,
    delay: 0.24,
    spring: { stiffness: 118, damping: 14 },
    hotspot: { left: "35%", top: "52%" },
    description: {
      global:
        "A resilient intermediate cushion that evens out substrate geometry and improves perceived softness without muting stitch definition. Tuned recovery keeps the surface calm after compression cycles.",
      japan:
        "基材の凹凸をならし、ステッチの輪郭を損なわずに柔らかさを高める中間クッション層です。圧縮後の復元性を調整し、表面の乱れを抑えます。"
    }
  },
  {
    key: "carrier",
    title: "Dimensional Carrier Mesh",
    image: mockSvg("MESH", "oklch(0.81 0.018 220)", "oklch(0.4 0.06 220)"),
    width: "min(31vw, 350px)",
    left: "69%",
    top: "58%",
    rotate: 7,
    delay: 0.36,
    spring: { stiffness: 104, damping: 16 },
    hotspot: { left: "60%", top: "44%" },
    description: {
      global:
        "A stabilizing mesh that keeps laminated layers dimensionally true during wrapping, trimming, and thermal cycling. It reduces stretch drift while preserving a clean edge for precision upholstery.",
      japan:
        "貼り合わせ層の寸法安定性を保つキャリアメッシュです。巻き込み、トリム、熱サイクル時の伸びズレを抑え、精密な端部処理を支えます。"
    }
  },
  {
    key: "adhesive",
    title: "Low-VOC Bonding Film",
    image: mockSvg("BOND", "oklch(0.91 0.018 62)", "oklch(0.58 0.075 72)"),
    width: "min(27vw, 300px)",
    left: "52%",
    top: "80%",
    rotate: -4,
    delay: 0.5,
    spring: { stiffness: 150, damping: 20 },
    hotspot: { left: "51%", top: "73%" },
    description: {
      global:
        "A thin bonding film designed for stable lamination and low cabin odor. The adhesive window is selected for repeatable production handling and clean separation between decorative and structural layers.",
      japan:
        "安定したラミネーションと低臭気を目的とした薄膜接着層です。量産時の再現性と、意匠層と構造層の明確な分離を考慮して設計しています。"
    }
  }
];

function currentMarket(): Market {
  return process.env.NEXT_PUBLIC_MARKET === "global" ? "global" : "japan";
}

export function ExplodedViewTest() {
  const market = useMemo(currentMarket, []);
  const [hasExploded, setHasExploded] = useState(false);
  const [completedParts, setCompletedParts] = useState<Set<string>>(new Set());
  const [activePart, setActivePart] = useState<ExplodedPart | null>(null);
  const hotspotsReady = hasExploded && completedParts.size === parts.length;

  function explodeAssembly() {
    setActivePart(null);
    setCompletedParts(new Set());
    setHasExploded(true);
  }

  function markComplete(partKey: string) {
    setCompletedParts((current) => {
      if (current.has(partKey)) {
        return current;
      }

      return new Set([...current, partKey]);
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[oklch(0.975_0.008_78)] text-charcoal" data-nav-invert>
      <section className="relative min-h-screen px-5 py-24 md:px-16 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,oklch(0.91_0.018_78),transparent_38%),linear-gradient(135deg,oklch(0.985_0.006_82),oklch(0.93_0.012_75))]" />
        <div className="relative z-10 grid min-h-[calc(100vh-12rem)] gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="relative min-h-[62vh] rounded-[4px] border border-charcoal/10 bg-[rgb(255_255_255_/_0.34)] shadow-[0_30px_100px_rgb(26_26_26_/_0.09)] backdrop-blur-md">
            <div className="absolute left-6 top-6 z-20">
              <p className="label-caps text-charcoal/45">Static Motion Study</p>
              <h1 className="mt-3 max-w-[13ch] font-serif text-4xl uppercase leading-[1.05] tracking-[0.12em] md:text-6xl">
                Exploded Material
              </h1>
            </div>

            <div className="absolute inset-0">
              <AnimatePresence>
                {!hasExploded ? (
                  <div className="absolute left-1/2 top-[60%] z-20 w-[min(42vw,460px)] -translate-x-1/2 -translate-y-1/2">
                    <motion.button
                      animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                      aria-label="Explode material assembly"
                      className="group relative w-full cursor-pointer rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                      exit={{ opacity: 0, scale: 0.82, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } }}
                      initial={{ opacity: 0, scale: 0.92 }}
                      onClick={explodeAssembly}
                      transition={{
                        duration: 4,
                        ease: [0.16, 1, 0.3, 1],
                        repeat: Infinity,
                        repeatType: "mirror"
                      }}
                      type="button"
                    >
                      <span className="pointer-events-none absolute inset-[18%_8%] rounded-full border border-charcoal/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                      <img alt="" className="select-none transition-transform duration-500 ease-expo group-hover:scale-[1.02]" draggable={false} src={assemblyImage} />
                    </motion.button>
                  </div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {hasExploded
                  ? parts.map((part) => (
                      <motion.div
                        animate={{
                          left: part.left,
                          opacity: 1,
                          rotate: part.rotate,
                          scale: 1,
                          top: part.top
                        }}
                        className="absolute"
                        initial={{
                          left: "50%",
                          opacity: 0.96,
                          rotate: 0,
                          scale: 0.82,
                          top: "58%"
                        }}
                        key={part.key}
                        onAnimationComplete={() => markComplete(part.key)}
                        style={{ width: part.width }}
                        transition={{
                          delay: part.delay,
                          damping: part.spring.damping,
                          stiffness: part.spring.stiffness,
                          type: "spring"
                        }}
                      >
                        <div className="-translate-x-1/2 -translate-y-1/2">
                          <img alt="" className="select-none" draggable={false} src={part.image} />
                        </div>
                      </motion.div>
                    ))
                  : null}
              </AnimatePresence>

              <AnimatePresence>
                {hotspotsReady
                  ? parts.map((part, index) => (
                      <motion.button
                        animate={{ opacity: 1, scale: 1 }}
                        aria-label={part.title}
                        className="group absolute z-30 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-charcoal/35 bg-[rgb(250_248_244_/_0.82)] shadow-[0_10px_26px_rgb(26_26_26_/_0.16)] backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                        exit={{ opacity: 0, scale: 0.82 }}
                        initial={{ opacity: 0, scale: 0.82 }}
                        key={part.key}
                        onClick={() => setActivePart(part)}
                        style={{ left: part.hotspot.left, top: part.hotspot.top }}
                        transition={{ delay: 0.14 * index, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        type="button"
                      >
                        <span className="absolute inset-0 rounded-full bg-gold/25 opacity-70 motion-safe:animate-ping" />
                        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-charcoal" />
                        <span className="pointer-events-none absolute left-1/2 top-[calc(100%+12px)] w-max max-w-[13rem] -translate-x-1/2 rounded-[3px] border border-charcoal/10 bg-[rgb(250_248_244_/_0.92)] px-3 py-2 text-[11px] font-medium text-charcoal opacity-0 shadow-[0_18px_50px_rgb(26_26_26_/_0.12)] backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                          {part.title}
                        </span>
                      </motion.button>
                    ))
                  : null}
              </AnimatePresence>
            </div>
          </div>

          <aside className="relative z-10 flex flex-col justify-end pb-2">
            <p className="label-caps text-charcoal/45">Market Preview</p>
            <p className="mt-4 max-w-[28rem] text-sm leading-7 text-muted">
              {market === "japan"
                ? "NEXT_PUBLIC_MARKET=japan の場合は抽屉内の説明が日本語で表示されます。"
                : "With NEXT_PUBLIC_MARKET=global, drawer copy defaults to English."}
            </p>
          </aside>
        </div>
      </section>

      <AnimatePresence>
        {activePart ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close material drawer"
              className="fixed inset-0 z-40 cursor-default bg-charcoal/12"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setActivePart(null)}
              type="button"
            />
            <motion.aside
              animate={{ x: 0 }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[31rem] flex-col border-l border-charcoal/10 bg-[rgb(250_248_244_/_0.78)] px-7 py-8 shadow-[0_30px_120px_rgb(26_26_26_/_0.22)] backdrop-blur-2xl md:px-10"
              exit={{ x: "100%" }}
              initial={{ x: "100%" }}
              transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                aria-label="Close drawer"
                className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-[rgb(255_255_255_/_0.42)] text-charcoal transition-colors hover:bg-charcoal hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
                onClick={() => setActivePart(null)}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
              <div className="mt-auto">
                <p className="label-caps text-charcoal/45">{market === "japan" ? "Technical Note" : "Material Note"}</p>
                <h2 className="mt-5 font-serif text-4xl uppercase leading-[1.08] tracking-[0.1em] md:text-5xl">{activePart.title}</h2>
                <p className="mt-8 text-[15px] leading-8 text-muted">{activePart.description[market]}</p>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
