import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",
    },
  },
  globalIgnores([
    ".codex-tmp/**",
    ".codex-work/**",
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    "dist/**",
    "next-env.d.ts",
    "public/**",
  ]),
]);
