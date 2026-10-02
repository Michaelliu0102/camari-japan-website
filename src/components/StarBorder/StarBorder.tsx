import { createElement, type ComponentPropsWithoutRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import "./StarBorder.css";

type StarBorderProps<T extends ElementType = "button"> = Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "style"> & {
  as?: T;
  className?: string;
  children?: ReactNode;
  color?: string;
  speed?: string;
  style?: CSSProperties;
  thickness?: number;
};

export default function StarBorder<T extends ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderProps<T>) {
  const Component: ElementType = as ?? "button";

  return createElement(
    Component,
    {
      ...rest,
      className: `star-border-container ${className}`,
      style: {
        padding: `${thickness}px 0`,
        ...style
      }
    },
    <>
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="inner-content">{children}</div>
    </>
  );
}
