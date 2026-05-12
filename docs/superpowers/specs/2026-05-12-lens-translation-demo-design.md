# Lens Translation Demo Design

## Goal

Build a standalone static demo inspired by the monopo london homepage interaction: English headline text is visible by default, and a cursor-following lens reveals Japanese copy in the same position.

## Approved Direction

Use the hybrid DOM lens approach. The page keeps both English and Japanese text as real DOM content. CSS clips the Japanese layer to a circular mask tied to the lens position, while a separate visual lens layer adds border, shadow, subtle highlight, and scale.

## Interaction

- Desktop: lens follows pointer movement with smooth trailing motion.
- Hovering or moving over the hero reveals Japanese text only inside the lens.
- Leaving the hero gently returns the lens to an idle center position.
- Touch devices: lens follows touch/drag and starts from a readable default position.
- Reduced motion: disable trailing animation and transition directly to the current position.

## Structure

- `index.html`: semantic static page, content, and accessible labels.
- `styles.css`: layout, typography, mask variables, lens styling, responsive rules.
- `script.js`: pointer tracking, animation loop, bounds mapping, feature fallback.

## Visual Notes

The demo should feel editorial and sharp: large uppercase English typography, Japanese text aligned underneath, a tactile circular lens, and restrained color. It should not reuse monopo assets or copy their exact code.

