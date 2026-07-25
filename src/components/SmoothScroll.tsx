"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const desktopQuery = "(min-width: 1024px)";
const reduceMotionQuery = "(prefers-reduced-motion: reduce)";

function shouldUseSmoothScroll() {
  return window.matchMedia(desktopQuery).matches && !window.matchMedia(reduceMotionQuery).matches;
}

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const desktopMedia = window.matchMedia(desktopQuery);
    const reduceMotionMedia = window.matchMedia(reduceMotionQuery);

    function destroyLenis() {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      document.documentElement.removeAttribute("data-smooth-scroll");
    }

    function createLenis() {
      if (lenisRef.current || !shouldUseSmoothScroll()) {
        return;
      }

      lenisRef.current = new Lenis({
        anchors: {
          offset: -80
        },
        autoRaf: true,
        autoResize: true,
        autoToggle: true,
        duration: 1.08,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.88,
        prevent: (node) => Boolean(node.closest("[data-lenis-prevent]"))
      });

      document.documentElement.setAttribute("data-smooth-scroll", "true");
    }

    function syncLenisState() {
      if (shouldUseSmoothScroll()) {
        createLenis();
      } else {
        destroyLenis();
      }
    }

    syncLenisState();

    desktopMedia.addEventListener("change", syncLenisState);
    reduceMotionMedia.addEventListener("change", syncLenisState);

    return () => {
      desktopMedia.removeEventListener("change", syncLenisState);
      reduceMotionMedia.removeEventListener("change", syncLenisState);
      destroyLenis();
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.resize();
  }, [pathname]);

  return null;
}
