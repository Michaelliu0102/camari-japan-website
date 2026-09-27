import localFont from "next/font/local";
import "./font-subsets.css";

const cinzel = localFont({
  src: [{ path: "../../public/fonts/cinzel-192773d8da73.woff2", weight: "400 500", style: "normal" }],
  variable: "--font-cinzel",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Camari Cinzel Extended"]
});

const inter = localFont({
  src: [{ path: "../../public/fonts/inter-e3237528af75.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Camari Inter Extended"]
});

const baskerville = localFont({
  src: [{ path: "../../public/fonts/libre-baskerville-0e8574f3ff27.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-baskerville",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Camari Libre Baskerville Extended"]
});

const montserrat = localFont({
  src: [{ path: "../../public/fonts/montserrat-3dac51d0c0ab.woff2", weight: "500 700", style: "normal" }],
  variable: "--font-montserrat",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Camari Montserrat Extended"]
});

const playfair = localFont({
  src: [{ path: "../../public/fonts/playfair-display-a80fed7886ad.woff2", weight: "400", style: "italic" }, { path: "../../public/fonts/playfair-display-363014d7c907.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Camari Playfair Display Extended"]
});

// No blanket preloads: families/subsets load only when the page uses them.
export const webFontVariables = `camari-web-fonts ${inter.variable} ${cinzel.variable} ${baskerville.variable} ${montserrat.variable} ${playfair.variable}`;
