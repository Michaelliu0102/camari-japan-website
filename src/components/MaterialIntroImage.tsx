"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

type MaterialIntroImageProps = {
  alt: string;
  src: string;
};

export function MaterialIntroImage({ alt, src }: MaterialIntroImageProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"]
  });
  const dampedProgress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 34,
    mass: 0.42
  });
  const y = useTransform(dampedProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-34, 34]);
  const scale = useTransform(dampedProgress, [0, 0.5, 1], prefersReducedMotion ? [1, 1, 1] : [1.04, 1.075, 1.04]);

  return (
    <div ref={frameRef} className="relative min-h-[520px] overflow-hidden shadow-material md:min-h-[680px] md:h-full">
      <motion.div className="absolute inset-x-0 -top-10 bottom-[-2.5rem] will-change-transform" style={{ y, scale }}>
        <Image alt={alt} className="object-cover" fill priority={false} sizes="(min-width: 1024px) 45vw, 100vw" src={src} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-charcoal/5" />
    </div>
  );
}
