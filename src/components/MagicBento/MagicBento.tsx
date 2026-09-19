"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { gsap } from "gsap";
import "./MagicBento.css";

export interface BentoCardData {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  image?: string;
  href?: string;
  /** Render as a full-bleed image card with overlay */
  variant?: "default" | "image";
}

export interface MagicBentoProps {
  cards?: BentoCardData[];
  imageCtaLabel?: string;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 768;

const defaultCards: BentoCardData[] = [
  { color: "#120F17", title: "Analytics", description: "Track user behavior", label: "Insights" },
  { color: "#120F17", title: "Dashboard", description: "Centralized data view", label: "Overview" },
  { color: "#120F17", title: "Collaboration", description: "Work together seamlessly", label: "Teamwork" },
  { color: "#120F17", title: "Automation", description: "Streamline workflows", label: "Efficiency" },
  { color: "#120F17", title: "Integration", description: "Connect favorite tools", label: "Connectivity" },
  { color: "#120F17", title: "Security", description: "Enterprise-grade protection", label: "Protection" },
];

function createParticle(x: number, y: number, color: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
}

function calcSpotlight(radius: number) {
  return { proximity: radius * 0.5, fadeDistance: radius * 0.75 };
}

function updateCardGlow(card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) {
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--glow-x", `${((mouseX - rect.left) / rect.width) * 100}%`);
  card.style.setProperty("--glow-y", `${((mouseY - rect.top) / rect.height) * 100}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
}

function ParticleCard({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}: {
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoParticles = useRef<HTMLDivElement[]>([]);
  const initialized = useRef(false);
  const magnetRef = useRef<gsap.core.Tween | null>(null);

  const initParticles = useCallback(() => {
    if (initialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoParticles.current = Array.from({ length: particleCount }, () =>
      createParticle(Math.random() * width, Math.random() * height, glowColor)
    );
    initialized.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetRef.current?.kill();
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => p.remove(),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!initialized.current) initParticles();

    memoParticles.current.forEach((particle, i) => {
      const id = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current!.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
      }, i * 100);
      timeoutsRef.current.push(id);
    });
  }, [initParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const enter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt) gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.3, ease: "power2.out", transformPerspective: 1000 });
    };

    const leave = () => {
      isHoveredRef.current = false;
      clearParticles();
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };

    const move = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      if (enableTilt) {
        gsap.to(el, {
          rotateX: ((y - cy) / cy) * -10,
          rotateY: ((x - cx) / cx) * 10,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
      if (enableMagnetism) {
        magnetRef.current = gsap.to(el, { x: (x - cx) * 0.05, y: (y - cy) * 0.05, duration: 0.3, ease: "power2.out" });
      }
    };

    const click = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxD = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute; width: ${maxD * 2}px; height: ${maxD * 2}px; border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxD}px; top: ${y - maxD}px; pointer-events: none; z-index: 1000;
      `;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mousemove", move);
    el.addEventListener("click", click);

    return () => {
      isHoveredRef.current = false;
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("click", click);
      clearParticles();
    };
  }, [animateParticles, clearParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div ref={cardRef} className={`${className} particle-container`} style={{ ...style, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function GlobalSpotlight({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}) {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed; width: 800px; height: 800px; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%, rgba(${glowColor}, 0.08) 15%, rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%, rgba(${glowColor}, 0.01) 65%, transparent 70%);
      z-index: 200; opacity: 0; transform: translate(-50%, -50%); mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const move = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest(".bento-section") as HTMLElement | null;
      const rect = section?.getBoundingClientRect();
      const inside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const cards = gridRef.current.querySelectorAll(".magic-bento-card");

      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cards.forEach((c) => ((c as HTMLElement).style.setProperty("--glow-intensity", "0")));
        return;
      }

      const { proximity, fadeDistance } = calcSpotlight(spotlightRadius);
      let minDist = Infinity;

      cards.forEach((card) => {
        const ce = card as HTMLElement;
        const cr = ce.getBoundingClientRect();
        const cx = cr.left + cr.width / 2;
        const cy = cr.top + cr.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2;
        const eff = Math.max(0, dist);
        minDist = Math.min(minDist, eff);

        let gi = 0;
        if (eff <= proximity) gi = 1;
        else if (eff <= fadeDistance) gi = (fadeDistance - eff) / (fadeDistance - proximity);
        updateCardGlow(ce, e.clientX, e.clientY, gi, spotlightRadius);
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      const target = minDist <= proximity ? 0.8 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8 : 0;
      gsap.to(spotlightRef.current, { opacity: target, duration: target > 0 ? 0.2 : 0.5, ease: "power2.out" });
    };

    const leave = () => {
      gridRef.current?.querySelectorAll(".magic-bento-card").forEach((c) => ((c as HTMLElement).style.setProperty("--glow-intensity", "0")));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      spotlightRef.current?.remove();
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
}

function useMobile() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const check = () => setIs(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return is;
}

export default function MagicBento({
  cards = defaultCards,
  imageCtaLabel = "Explore Texture",
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const shouldDisable = disableAnimations || isMobile;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisable}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className={`card-grid card-grid--${cards.length} bento-section`} ref={gridRef}>
        {cards.map((card, i) => {
          const isImageVariant = card.variant === "image" && card.image;
          const baseCls = `magic-bento-card ${textAutoHide && !isImageVariant ? "magic-bento-card--text-autohide" : ""} ${enableBorderGlow ? "magic-bento-card--border-glow" : ""} ${isImageVariant ? "magic-bento-card--image" : ""}`;
          const style = {
            backgroundColor: isImageVariant ? undefined : card.color ?? "#120F17",
            "--glow-color": glowColor,
          } as React.CSSProperties;

          const inner = isImageVariant ? (
            <>
              <div
                className="magic-bento-card__bg"
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="magic-bento-card__overlay" />
              <div className="magic-bento-card__image-content">
                <h2 className="magic-bento-card__image-title">{card.title}</h2>
                {card.description ? (
                  <p className="magic-bento-card__image-desc">{card.description}</p>
                ) : null}
                <span className="magic-bento-card__cta">{imageCtaLabel}</span>
              </div>
            </>
          ) : (
            <>
              <div className="magic-bento-card__header">
                <div className="magic-bento-card__label">{card.label}</div>
              </div>
              <div className="magic-bento-card__content">
                <h2 className="magic-bento-card__title">{card.title}</h2>
                <p className="magic-bento-card__description">{card.description}</p>
              </div>
            </>
          );

          const cardElement = enableStars ? (
            <ParticleCard
              key={i}
              className={baseCls}
              disableAnimations={shouldDisable}
              particleCount={particleCount}
              glowColor={glowColor}
              enableTilt={enableTilt}
              clickEffect={clickEffect}
              enableMagnetism={enableMagnetism}
              style={style}
            >
              {inner}
            </ParticleCard>
          ) : (
            <div key={i} className={baseCls} style={style}>
              {inner}
            </div>
          );

          if (card.href) {
            return (
              <a href={card.href} key={i} style={{ display: "contents" }}>
                {cardElement}
              </a>
            );
          }

          return cardElement;
        })}
      </div>
    </>
  );
}
