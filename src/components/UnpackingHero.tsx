"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { RotateCcw, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Market = "global" | "japan";

interface Piece {
  name: { en: string; jp: string };
  src: string;
  description: { en: string; jp: string };
  left: string;
  top: string;
  width: string;
  rotation: number;
  center: { left: string; top: string };
}

/* -------------------------------------------------------------------------- */
/*  Catalog & Stationary Backpack                                             */
/* -------------------------------------------------------------------------- */

const pieces: Piece[] = [
  {
    name: {
      en: "Alcantara® iPad Case",
      jp: "Alcantara® iPadケース"
    },
    src: "/explode/ipadcase.png",
    description: {
      en: "Premium Alcantara tablet sleeve tailored for ultimate impact protection.",
      jp: "触感の奥行きと保護性能を両立した、最高級アルカンターラ仕様のタブレットケース。"
    },
    left: "17%",
    top: "23%",
    width: "18%",
    rotation: -22,
    center: { left: "26%", top: "33%" }
  },
  {
    name: {
      en: "Minimalist Cardholder",
      jp: "ミニマル カードホルダー"
    },
    src: "/explode/cardholder.png",
    description: {
      en: "Sleek, laser-cut card wallet with RFID shielding.",
      jp: "レーザーカットによる美しいエッジ与极上の手触りを備えたミニマルカードホルダー。"
    },
    left: "35%",
    top: "9%",
    width: "10%",
    rotation: -40,
    center: { left: "40%", top: "15%" }
  },
  {
    name: {
      en: "High-Grade Spectacle Case",
      jp: "高級メガネケース"
    },
    src: "/explode/spetaclecase.png",
    description: {
      en: "Ergonomic protective eyewear shelter.",
      jp: "内側にマイクロファイバーの伝統テキスタイルをあしらった、高級メガネケース。"
    },
    left: "52%",
    top: "8%",
    width: "14%",
    rotation: 38,
    center: { left: "59%", top: "16%" }
  },
  {
    name: {
      en: "Premium Washbag / Vanity Pouch",
      jp: "プレミアム トラベルポーチ"
    },
    src: "/explode/washbag.png",
    description: {
      en: "Water-resistant travel companion constructed from resilient textiles.",
      jp: "耐久性に優れたプレミアムマテリアルを採用した、防水仕様 of トラベルポーチ。"
    },
    left: "67%",
    top: "31%",
    width: "15.5%",
    rotation: 22,
    center: { left: "76%", top: "40%" }
  }
];

// Open backpack state is bagpackzipon.png
const backpackPiece: Piece = {
  name: {
    en: "Classic Leather Backpack",
    jp: "クラシック レザー バックパック"
  },
  src: "/explode/bagpackzipon.png",
  description: {
    en: "A refined travel backpack combining Italian leather craftsmanship with a modern aesthetic.",
    jp: "イタリア製の高級レザー職人技と現代的な美意识が融合した、洗練されたトラベルバックパック。"
  },
  left: "50%",
  top: "73%",
  width: "32%",
  rotation: 0,
  center: { left: "50%", top: "72%" }
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function currentMarket(): Market {
  if (typeof process === "undefined" || !process.env) return "global";
  return process.env.NEXT_PUBLIC_MARKET === "japan" ? "japan" : "global";
}

const DROP_SHADOW = "drop-shadow(0px 25px 35px rgba(0, 0, 0, 0.08))";

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function UnpackingHero() {
  const market = useMemo(currentMarket, []);
  const mqlReduced =
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const prefersReduced = mqlReduced?.matches ?? false;

  const stageRef = useRef<HTMLDivElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);
  const bagClosedRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activePart, setActivePart] = useState<Piece | null>(null);
  const [replayReady, setReplayReady] = useState(false);
  const [cycle, setCycle] = useState(0);

  /* ═══════════════════════════════════════════════════════════════════════ */
  /*  GSAP Timeline                                                          */
  /* ═══════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (prefersReduced) {
      pieces.forEach((_, i) => {
        gsap.set(`.component-piece-${i}`, {
          left: pieces[i].left,
          top: pieces[i].top,
          rotation: pieces[i].rotation,
          opacity: 1,
          scale: 1
        });
      });
      gsap.set(bagRef.current, { opacity: 1, clipPath: "none" });
      gsap.set(bagClosedRef.current, { opacity: 0 });
      gsap.set(".hotspot-dot", { opacity: 1, scale: 1 });
      setReplayReady(true);
      return;
    }

    const ctx = gsap.context(() => {
      /* -- initial states ------------------------------------------------ */
      gsap.set(shutterRef.current, { opacity: 0 });

      // All 4 pieces hidden deep inside the bag body (50% left, 54% top)
      pieces.forEach((_, i) => {
        gsap.set(`.component-piece-${i}`, {
          left: "50%",
          top: "54%",
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          scale: 0.12,
          rotation: 0
        });
      });

      gsap.set(".hotspot-dot", { opacity: 0, scale: 0.4 });
      gsap.set(".unpack-replay", { opacity: 0 });
      gsap.set(".tap-hint", { opacity: 0, y: 6 });
      
      // Open backpack starts hidden by clip-path, closed starts visible
      gsap.set(bagRef.current, { 
        scale: 1, 
        opacity: 1, 
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" 
      });
      gsap.set(bagClosedRef.current, { scale: 1, opacity: 1 });

      /* -- master timeline ----------------------------------------------- */
      const tl = gsap.timeline({ delay: 0.8 });

      /* ── Phase 1: Shutter flash & Zipper wipe transition ── */
      tl.to(shutterRef.current, {
        opacity: 0.58,
        duration: 0.15,
        ease: "power2.in"
      }, 0);

      // Slide-wipe open using clip-path and cross-fade closed bag (0.25s duration)
      tl.to(bagRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.25,
        ease: "power1.inOut"
      }, 0.05);

      tl.to(bagClosedRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.inOut"
      }, 0.05);

      tl.to(shutterRef.current, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.out"
      }, 0.15);

      // Define explosion start point immediately following the camera flash
      tl.addLabel("explosion-start", 0.28);
      // Settle starts immediately after blast finishes (0.28s + 0.22s = 0.50s)
      tl.addLabel("explosion-settle", 0.50);

      /* ── Phase 2 & 3: Synchronized Spring Blast + Stop-Motion Settle ── */
      pieces.forEach((p, i) => {
        const pieceEl = `.component-piece-${i}`;

        // Parse target coordinates
        const targetLeft = parseFloat(p.left);
        const targetTop = parseFloat(p.top);

        // Compute midway coordinates (70% of the distance) starting from inside the bag (50%, 54%)
        const midLeft = 50 + (targetLeft - 50) * 0.70;
        const midTop = 54 + (targetTop - 54) * 0.70;

        // Generate a subtle randomized target rotation between -15 and +25 degrees
        const randomRot = Math.floor(Math.random() * 40) - 15;

        // Phase 2: Snappy spring blast explosion out of center (simultaneous)
        tl.to(pieceEl, {
          left: `${midLeft}%`,
          top: `${midTop}%`,
          scale: 0.90,
          opacity: 1,
          rotation: randomRot,
          duration: 0.22,
          ease: "elastic.out(1.2, 0.6)"
        }, "explosion-start");

        // Phase 3: Stop-motion stepped settle into final position (simultaneous, 3 steps)
        tl.to(pieceEl, {
          left: p.left,
          top: p.top,
          scale: 1,
          rotation: p.rotation,
          duration: 0.45,
          ease: "steps(3)"
        }, "explosion-settle");
      });

      /* ── Bag subtle scale-back (both layers in sync) ─────────────────── */
      tl.to(
        [bagRef.current, bagClosedRef.current],
        { scale: 0.92, duration: 0.5, ease: "power2.out" },
        "explosion-start+=0.2"
      );

      /* ── Hotspot dots ────────────────────────────────────────────────── */
      tl.to(
        ".hotspot-dot",
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "elastic.out(1, 0.7)"
        },
        "explosion-settle+=0.45"
      );

      tl.to(
        ".tap-hint",
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        "explosion-settle+=0.55"
      );

      tl.to(
        ".unpack-replay",
        { opacity: 1, duration: 0.28, ease: "power2.out" },
        "explosion-settle+=0.65"
      );

      tl.eventCallback("onComplete", () => setReplayReady(true));
      tl.play();
    }, stageRef);

    return () => ctx.revert();
  }, [cycle, prefersReduced]);

  const handleReplay = useCallback(() => {
    setReplayReady(false);
    setActivePart(null);
    setCycle((c) => c + 1);
  }, []);

  // Post-scatter hover effect: lift, tilt, scale, elevate z-index (bring to foreground 30)
  const handleCardMouseEnter = useCallback((index: number) => {
    if (!replayReady) return;

    const outerEl = cardRefs.current[index];
    if (outerEl) {
      outerEl.style.zIndex = "30";
    }

    const innerEl = innerCardRefs.current[index];
    if (innerEl) {
      gsap.to(innerEl, {
        scale: 1.08,
        y: -6,
        transformPerspective: 800,
        rotateX: 6,
        rotateY: -4,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  }, [replayReady]);

  const handleCardMouseLeave = useCallback((index: number) => {
    if (!replayReady) return;

    const outerEl = cardRefs.current[index];
    const innerEl = innerCardRefs.current[index];

    if (innerEl) {
      gsap.to(innerEl, {
        scale: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          // Restore base z-index (8, under the backpack) after transition completes
          if (outerEl && replayReady) {
            outerEl.style.zIndex = "8";
          }
        }
      });
    }
  }, [replayReady]);

  /* ---- localized copy ---- */
  const t = {
    tapToExplore: market === "japan" ? "タップして詳細を見る" : "Tap to explore",
    replay: market === "japan" ? "リプレイ" : "Replay",
    materialNote: market === "japan" ? "素材ノート" : "Material Note",
    marketPreview: market === "japan" ? "マーケットプレビュー" : "Market Preview",
    marketNote:
      market === "japan"
        ? "NEXT_PUBLIC_MARKET=japan の場合は引き出し内の説明が日本語で表示されます。"
        : "With NEXT_PUBLIC_MARKET=global, drawer copy defaults to English."
  };

  /* ═══════════════════════════════════════════════════════════════════════ */
  /*  Render                                                                 */
  /* ═══════════════════════════════════════════════════════════════════════ */

  return (
    <main
      className="min-h-screen overflow-hidden bg-[oklch(0.975_0.008_78)] text-charcoal"
      data-nav-invert
    >
      <section className="relative min-h-screen px-5 py-24 md:px-16 md:py-28">
        {/* Background Wrapper (z-index 0) */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,oklch(0.91_0.018_78),transparent_38%),linear-gradient(135deg,oklch(0.985_0.006_82),oklch(0.93_0.012_75))]"
          style={{ zIndex: 0 }}
        />

        <div className="relative z-10 grid min-h-[calc(100vh-12rem)] gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
          {/* ═══ MAIN STAGE — overflow-visible, no clipping ═══ */}
          <div
            className="relative min-h-[78vh] rounded-[4px] border border-charcoal/10 shadow-[0_30px_100px_rgb(26_26_26_/_0.09)] flex items-center justify-center p-6 md:p-12"
            ref={stageRef}
            style={{ backgroundColor: "oklch(0.975 0.008 78)", overflow: "visible" }}
          >
            {/* Top-left label */}
            <div className="absolute left-6 top-6" style={{ zIndex: 60 }}>
              <p className="label-caps text-charcoal/45">Stop-Motion Unpacking</p>
              <h1 className="mt-3 max-w-[13ch] font-serif text-4xl uppercase leading-[1.05] tracking-[0.12em] md:text-6xl">
                Flat Lay
              </h1>
            </div>

            {/* Replay button */}
            <button
              aria-label={t.replay}
              className="unpack-replay absolute right-4 top-4 inline-flex items-center gap-2 rounded-[4px] border border-charcoal/15 bg-[rgb(250_248_244_/_0.64)] px-3 py-2 text-xs font-medium text-charcoal/60 backdrop-blur-sm transition-colors hover:bg-charcoal hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
              onClick={handleReplay}
              style={{ zIndex: 60 }}
              type="button"
            >
              <RotateCcw aria-hidden className="h-3 w-3" />
              {t.replay}
            </button>

            {/* ── Shutter flash (z-index 45) ── */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[4px]"
              ref={shutterRef}
              style={{ backgroundColor: "#F9F9F5", zIndex: 45 }}
            />

            {/* ── Centered 16:9 Canvas wrapper (z-index 5) ── */}
            <div
              className="relative w-full"
              style={{
                aspectRatio: "16 / 9",
                maxWidth: "960px",
                overflow: "visible",
                zIndex: 5
              }}
            >
              {/* ── BackpackAnchor Open / final state (bagpackzipon.png) (z-index 10) ── */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                ref={bagRef}
                style={{ bottom: "3%", width: backpackPiece.width, zIndex: 10 }}
              >
                <img
                  alt="Open Backpack"
                  className="w-full select-none"
                  draggable={false}
                  src={backpackPiece.src}
                  style={{
                    filter: DROP_SHADOW,
                    mixBlendMode: "multiply"
                  }}
                />
              </div>

              {/* ── BackpackAnchor Closed / initial state (bagpack.png) (z-index 10) ── */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                ref={bagClosedRef}
                style={{ bottom: "3%", width: backpackPiece.width, zIndex: 10 }}
              >
                <img
                  alt="Closed Backpack"
                  className="w-full select-none"
                  draggable={false}
                  src="/explode/bagpack.png"
                  style={{
                    filter: DROP_SHADOW,
                    mixBlendMode: "multiply"
                  }}
                />
              </div>

              {/* ── ComponentPiece (z-index 12, start layered over backpack, fly out) ── */}
              {pieces.map((p, i) => (
                <div
                  className={`component-piece component-piece-${i} absolute`}
                  key={p.name.en}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  style={{
                    width: p.width,
                    zIndex: 8,
                    overflow: "visible",
                    left: "50%",
                    top: "54%",
                    opacity: 0
                  }}
                  onMouseEnter={() => handleCardMouseEnter(i)}
                  onMouseLeave={() => handleCardMouseLeave(i)}
                >
                  {/* Inner div for tilt, float, and scale hovers */}
                  <div
                    ref={(el) => {
                      innerCardRefs.current[i] = el;
                    }}
                    className="w-full h-full"
                    style={{ willChange: "transform" }}
                  >
                    <img
                      alt={market === "japan" ? p.name.jp : p.name.en}
                      className="w-full select-none"
                      draggable={false}
                      src={p.src}
                      style={{
                        filter: DROP_SHADOW,
                        overflow: "visible",
                        mixBlendMode: "multiply"
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* ── HotspotButton for Backpack (z-index 50) ── */}
              <button
                aria-label={market === "japan" ? backpackPiece.name.jp : backpackPiece.name.en}
                className="hotspot-dot group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/80 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] focus:outline-none"
                onClick={() => setActivePart(backpackPiece)}
                style={{
                  left: backpackPiece.center.left,
                  top: backpackPiece.center.top,
                  zIndex: 50,
                  width: "18px",
                  height: "18px"
                }}
                type="button"
              >
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-70 motion-safe:animate-ping" />
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-300 group-hover:scale-125" />
                <span className="pointer-events-none absolute left-1/2 top-[calc(100%+12px)] w-max max-w-[13rem] -translate-x-1/2 rounded-[3px] border border-charcoal/10 bg-[rgb(250_248_244_/_0.92)] px-3 py-2 text-[11px] font-medium text-charcoal opacity-0 shadow-[0_18px_50px_rgb(26_26_26_/_0.12)] backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {market === "japan" ? backpackPiece.name.jp : backpackPiece.name.en}
                </span>
              </button>

              {/* ── HotspotButtons for Pieces (z-index 50) ── */}
              {pieces.map((p) => (
                <button
                  aria-label={market === "japan" ? p.name.jp : p.name.en}
                  className="hotspot-dot group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/80 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] focus:outline-none"
                  key={p.name.en}
                  onClick={() => setActivePart(p)}
                  style={{
                    left: p.center.left,
                    top: p.center.top,
                    zIndex: 50,
                    width: "18px",
                    height: "18px"
                  }}
                  type="button"
                >
                  <span className="absolute inset-0 rounded-full bg-white/20 opacity-70 motion-safe:animate-ping" />
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-300 group-hover:scale-125" />
                  <span className="pointer-events-none absolute left-1/2 top-[calc(100%+12px)] w-max max-w-[13rem] -translate-x-1/2 rounded-[3px] border border-charcoal/10 bg-[rgb(250_248_244_/_0.92)] px-3 py-2 text-[11px] font-medium text-charcoal opacity-0 shadow-[0_18px_50px_rgb(26_26_26_/_0.12)] backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {market === "japan" ? p.name.jp : p.name.en}
                  </span>
                </button>
              ))}
            </div>

            {/* ── Tap to explore ── */}
            <p
              className="tap-hint absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-charcoal/40"
              style={{ zIndex: 60 }}
            >
              {t.tapToExplore}
            </p>
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <aside className="relative z-10 flex flex-col justify-end pb-2">
            <p className="label-caps text-charcoal/45">{t.marketPreview}</p>
            <p className="mt-4 max-w-[28rem] text-sm leading-7 text-muted">{t.marketNote}</p>
          </aside>
        </div>
      </section>

      {/* ═══ DETAIL DRAWER ═══ */}
      {activePart && (
        <>
          <button
            aria-label="Close detail drawer"
            className="fixed inset-0 z-40 cursor-default bg-charcoal/12"
            onClick={() => setActivePart(null)}
            type="button"
          />
          <aside
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[31rem] flex-col border-l border-charcoal/10 bg-[rgb(250_248_244_/_0.78)] px-7 py-8 shadow-[0_30px_120px_rgb(26_26_26_/_0.22)] backdrop-blur-2xl md:px-10"
            style={{ animation: "drawerIn 0.46s cubic-bezier(0.16, 1, 0.3, 1) both" }}
          >
            <button
              aria-label="Close drawer"
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-[rgb(255_255_255_/_0.42)] text-charcoal transition-colors hover:bg-charcoal hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
              onClick={() => setActivePart(null)}
              type="button"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
            <div className="mt-auto">
              <p className="label-caps text-charcoal/45">{t.materialNote}</p>
              <h2 className="mt-5 font-serif text-4xl uppercase leading-[1.08] tracking-[0.1em] md:text-5xl">
                {market === "japan" ? activePart.name.jp : activePart.name.en}
              </h2>
              <p className="mt-8 text-[15px] leading-8 text-muted">
                {market === "japan" ? activePart.description.jp : activePart.description.en}
              </p>
            </div>
          </aside>

          <style>{`
            @keyframes drawerIn {
              from { transform: translateX(100%); }
              to   { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </main>
  );
}
