"use client";

import { useEffect } from "react";

/**
 * Drop at the top of any page whose first visible section has a light background.
 * Tells GlobalNav to render dark (charcoal) text and borders instead of white.
 */
export function NavInvert() {
  useEffect(() => {
    document.documentElement.dataset.navInvert = "true";
    return () => {
      delete document.documentElement.dataset.navInvert;
    };
  }, []);

  return null;
}
