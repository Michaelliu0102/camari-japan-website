# Self-hosted CAMARI web fonts

These are the exact Google Fonts WOFF2 resources previously requested by the
website, acquired on 2026-09-27. `manifest.json` records each source URL, family,
style, weight, Unicode range, byte count and SHA-256. OFL licenses are in
`licenses/`. No visitor-side Google Fonts request is required.

`src/app/fonts.ts` uses `next/font/local` for the five Latin font families.
`src/app/font-subsets.css` retains extended character and Noto Sans JP Unicode
ranges: the browser downloads only subsets needed by rendered text. Identical
variable-font files shared across requested weights are stored once. Do not
replace these ranges with a single eagerly loaded Japanese font file.

Fonts use `display: swap` and are not all preloaded. CSS variables are applied
to non-China pages; China retains its existing system-font selection. The
named fallback families are deliberately prefixed with `Camari` to avoid
activating these web fonts on pages without the variables.

Keep the original typography when replacing or updating these files, and
verify English, Japanese, extended Latin characters and font licenses.
