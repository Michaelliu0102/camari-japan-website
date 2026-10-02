"use client";

import ShinyText from "@/components/ShinyText/ShinyText";

type ShinyHeadingProps = {
  text: string;
  className?: string;
  color?: string;
  shineColor?: string;
};

export function ShinyHeading({ text, className = "", color = "#1a1a1a", shineColor = "#ffffff" }: ShinyHeadingProps) {
  return (
    <ShinyText
      className={className}
      color={color}
      shineColor={shineColor}
      text={text}
    />
  );
}
