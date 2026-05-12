# Fluid Translation Reveal

Reusable web component for a cursor-driven English-to-Japanese reveal effect.

## Usage

```html
<script src="./components/fluid-translation-reveal.js"></script>

<fluid-translation-reveal
  english="We choose a different starting point"
  japanese="私たちは|異なる|出発点を|選びます"
  variant="fluid"
  aria-label="We choose a different starting point"
></fluid-translation-reveal>
```

## Attributes

- `english`: English headline text.
- `japanese`: Japanese lines separated with `|`.
- `variant`: `fluid` for the direct hover effect, or `lens` for a visible lens.
- `size`: optional `compact` value for smaller placements.
- `aria-label`: accessible label for the text block.

## Styling Hooks

Set CSS custom properties on the element:

```css
fluid-translation-reveal {
  --ftr-ink: oklch(18% 0.012 70);
  --ftr-accent: oklch(42% 0.17 31);
  --ftr-font-size: clamp(3.45rem, 11vw, 11rem);
  --ftr-japanese-font-size: clamp(3rem, 8.2vw, 8.8rem);
}
```
