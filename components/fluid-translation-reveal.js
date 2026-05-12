const template = document.createElement?.("template");

const componentStyles = `
  :host {
    --ftr-ink: oklch(18% 0.012 70);
    --ftr-accent: oklch(42% 0.17 31);
    --ftr-muted-fluid: oklch(76% 0.09 70 / 0.38);
    --ftr-deep-fluid: oklch(54% 0.13 20 / 0.2);
    --ftr-lens-x: 56%;
    --ftr-lens-y: 44%;
    --ftr-mask-x: 50%;
    --ftr-mask-y: 44%;
    --ftr-fluid-x: 56%;
    --ftr-fluid-y: 44%;
    --ftr-fluid-rotation: 0deg;
    --ftr-reveal-size: clamp(7.4rem, 16vw, 13rem);
    display: block;
    position: relative;
    width: min(15.5ch, 100%);
    color: var(--ftr-ink);
    cursor: auto;
  }

  :host([size="compact"]) {
    --ftr-reveal-size: clamp(5.5rem, 12vw, 9rem);
  }

  .fluid-svg {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  .wrap {
    position: relative;
    isolation: isolate;
  }

  .fluid-field {
    position: absolute;
    inset: -18%;
    z-index: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition: opacity 220ms ease-out;
  }

  :host(.is-active) .fluid-field {
    opacity: 1;
  }

  :host([variant="lens"]) .fluid-field {
    display: none;
  }

  .blob {
    position: absolute;
    left: var(--ftr-fluid-x);
    top: var(--ftr-fluid-y);
    width: clamp(8rem, 21vw, 17rem);
    aspect-ratio: 1.45;
    border-radius: 52% 48% 58% 42% / 44% 58% 42% 56%;
    filter: blur(22px);
    mix-blend-mode: multiply;
    translate: -50% -50%;
    rotate: var(--ftr-fluid-rotation);
    transform-origin: 50% 50%;
  }

  .blob--one {
    background: oklch(68% 0.16 31 / 0.34);
  }

  .blob--two {
    width: clamp(6.5rem, 17vw, 13rem);
    background: var(--ftr-muted-fluid);
    translate: -28% -74%;
    rotate: calc(var(--ftr-fluid-rotation) * -0.8);
  }

  .blob--three {
    width: clamp(5.5rem, 14vw, 10rem);
    background: var(--ftr-deep-fluid);
    translate: -78% -24%;
    rotate: calc(var(--ftr-fluid-rotation) * 1.35);
  }

  .stack {
    position: relative;
    z-index: 1;
  }

  .headline {
    margin: 0;
    font-size: var(--ftr-font-size, clamp(3.45rem, 11vw, 11rem));
    font-weight: 950;
    letter-spacing: 0;
    line-height: 0.88;
    text-transform: uppercase;
  }

  .headline--english {
    position: relative;
    z-index: 0;
  }

  .headline--japanese {
    position: absolute;
    inset: 0;
    z-index: 1;
    color: var(--ftr-accent);
    font-family:
      "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", system-ui,
      sans-serif;
    font-size: var(--ftr-japanese-font-size, clamp(3rem, 8.2vw, 8.8rem));
    font-weight: 900;
    line-height: 1.01;
    text-transform: none;
    opacity: 0;
    clip-path: ellipse(calc(var(--ftr-reveal-size) * 0.57) calc(var(--ftr-reveal-size) * 0.43) at var(--ftr-mask-x) var(--ftr-mask-y));
    filter: url("#fluid-text") saturate(1.08);
    transform: scale(1.018);
    transform-origin: var(--ftr-mask-x) var(--ftr-mask-y);
    pointer-events: none;
    transition: opacity 180ms ease-out;
  }

  .headline--japanese span {
    display: block;
  }

  :host(.is-active) .headline--japanese {
    opacity: 1;
  }

  @supports (mask-image: radial-gradient(circle, black 50%, transparent 51%)) {
    .headline--english {
      -webkit-mask-image: none;
      mask-image: none;
    }

    :host(.is-active) .headline--english {
      -webkit-mask-image: radial-gradient(
        ellipse calc(var(--ftr-reveal-size) * 0.58) calc(var(--ftr-reveal-size) * 0.43) at var(--ftr-mask-x) var(--ftr-mask-y),
        transparent 48%,
        oklch(0% 0 0 / 0.28) 58%,
        black 68%
      );
      mask-image: radial-gradient(
        ellipse calc(var(--ftr-reveal-size) * 0.58) calc(var(--ftr-reveal-size) * 0.43) at var(--ftr-mask-x) var(--ftr-mask-y),
        transparent 48%,
        oklch(0% 0 0 / 0.28) 58%,
        black 68%
      );
    }

    .headline--japanese {
      clip-path: none;
      -webkit-mask-image: radial-gradient(
        ellipse calc(var(--ftr-reveal-size) * 0.57) calc(var(--ftr-reveal-size) * 0.43) at var(--ftr-mask-x) var(--ftr-mask-y),
        black 46%,
        oklch(0% 0 0 / 0.75) 56%,
        transparent 70%
      );
      mask-image: radial-gradient(
        ellipse calc(var(--ftr-reveal-size) * 0.57) calc(var(--ftr-reveal-size) * 0.43) at var(--ftr-mask-x) var(--ftr-mask-y),
        black 46%,
        oklch(0% 0 0 / 0.75) 56%,
        transparent 70%
      );
    }
  }

  .lens {
    position: absolute;
    left: var(--ftr-lens-x);
    top: var(--ftr-lens-y);
    z-index: 2;
    display: none;
    width: var(--ftr-reveal-size);
    aspect-ratio: 1;
    border: clamp(1.5px, 0.22vw, 3px) solid color-mix(in oklch, var(--ftr-ink), var(--ftr-accent) 18%);
    border-radius: 50%;
    background:
      radial-gradient(circle at 34% 24%, oklch(99% 0.01 82 / 0.75), transparent 18%),
      radial-gradient(circle at 70% 80%, oklch(36% 0.04 50 / 0.15), transparent 38%),
      oklch(96% 0.02 82 / 0.34);
    box-shadow:
      0 1.2rem 4rem oklch(16% 0.02 70 / 0.28),
      inset 1rem 1rem 2.6rem oklch(99% 0.01 82 / 0.55),
      inset -1rem -1.2rem 2.6rem oklch(18% 0.02 70 / 0.14);
    translate: -50% -50%;
    pointer-events: none;
  }

  :host([variant="lens"]) {
    cursor: none;
  }

  :host([variant="lens"]) .lens {
    display: block;
  }

  :host([variant="lens"]) .headline--japanese {
    opacity: 0.98;
    filter: none;
  }

  .lens::before,
  .lens::after {
    position: absolute;
    content: "";
    border-radius: inherit;
  }

  .lens::before {
    inset: 7%;
    border: 1px solid oklch(100% 0.005 82 / 0.6);
  }

  .lens::after {
    inset: -10%;
    background: radial-gradient(circle, transparent 58%, oklch(20% 0.02 70 / 0.12) 62%, transparent 70%);
  }

  .glint {
    position: absolute;
    top: 18%;
    left: 22%;
    width: 22%;
    height: 9%;
    border-radius: 50%;
    background: oklch(99% 0.008 82 / 0.76);
    rotate: -28deg;
  }

  @media (max-width: 720px) {
    :host {
      --ftr-reveal-size: clamp(7.5rem, 42vw, 11rem);
      width: 100%;
    }

    .headline {
      font-size: var(--ftr-font-size-mobile, clamp(3rem, 15vw, 5.8rem));
      line-height: 0.93;
    }

    .headline--japanese {
      font-size: var(--ftr-japanese-font-size-mobile, clamp(2.45rem, 12vw, 4.8rem));
      line-height: 1.14;
    }
  }
`;

if (template) {
  template.innerHTML = `
    <style>${componentStyles}</style>
    <svg class="fluid-svg" aria-hidden="true" focusable="false">
      <filter id="fluid-text">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.8" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
    <div class="wrap">
      <div class="fluid-field" aria-hidden="true">
        <span class="blob blob--one"></span>
        <span class="blob blob--two"></span>
        <span class="blob blob--three"></span>
      </div>
      <div class="stack"></div>
      <div class="lens" aria-hidden="true"><span class="glint"></span></div>
    </div>
  `;
}

class FluidTranslationReveal extends HTMLElement {
  static observedAttributes = ["english", "japanese", "variant", "size", "aria-label"];

  static parseLines(value = "") {
    return value
      .split("|")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  constructor() {
    super();
    this.state = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      previousX: 0,
      previousY: 0,
      initialized: false,
    };
    this.animationFrame = 0;
    this.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? {
      matches: false,
    };
    this.handlePointerEnter = this.handlePointerEnter.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.tick = this.tick.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot && template) {
      this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
    }

    this.stack = this.shadowRoot?.querySelector(".stack");
    this.render();
    this.addEventListener("pointerenter", this.handlePointerEnter);
    this.addEventListener("pointermove", this.handlePointerMove);
    this.addEventListener("pointerleave", this.handlePointerLeave);
    this.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    this.addEventListener("touchmove", this.handleTouchMove, { passive: true });
    this.addEventListener("touchend", this.handleTouchEnd);
    this.setIdleTarget();
    this.animationFrame = window.requestAnimationFrame?.(this.tick) ?? 0;
  }

  disconnectedCallback() {
    this.removeEventListener("pointerenter", this.handlePointerEnter);
    this.removeEventListener("pointermove", this.handlePointerMove);
    this.removeEventListener("pointerleave", this.handlePointerLeave);
    this.removeEventListener("touchstart", this.handleTouchStart);
    this.removeEventListener("touchmove", this.handleTouchMove);
    this.removeEventListener("touchend", this.handleTouchEnd);
    if (this.animationFrame) {
      window.cancelAnimationFrame?.(this.animationFrame);
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    if (!this.stack) return;

    const english = this.getAttribute("english") || "We choose a different starting point";
    const japaneseLines = FluidTranslationReveal.parseLines(
      this.getAttribute("japanese") || "私たちは|異なる|出発点を|選びます",
    );
    const label = this.getAttribute("aria-label") || english;

    this.stack.setAttribute("aria-label", label);
    this.stack.innerHTML = `
      <h1 class="headline headline--english">${this.escapeHtml(english)}</h1>
      <p class="headline headline--japanese" aria-hidden="true">
        ${japaneseLines.map((line) => `<span>${this.escapeHtml(line)}</span>`).join("")}
      </p>
    `;
  }

  escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[character];
    });
  }

  handlePointerEnter(event) {
    this.classList.add("is-active");
    this.setTargetFromClientPoint(event.clientX, event.clientY);
  }

  handlePointerMove(event) {
    this.setTargetFromClientPoint(event.clientX, event.clientY);
  }

  handlePointerLeave() {
    this.classList.remove("is-active");
    this.setIdleTarget();
  }

  handleTouchStart(event) {
    const touch = event.touches[0];
    if (!touch) return;
    this.classList.add("is-active");
    this.setTargetFromClientPoint(touch.clientX, touch.clientY);
  }

  handleTouchMove(event) {
    const touch = event.touches[0];
    if (!touch) return;
    this.setTargetFromClientPoint(touch.clientX, touch.clientY);
  }

  handleTouchEnd() {
    this.classList.remove("is-active");
    this.setIdleTarget();
  }

  setTargetFromClientPoint(clientX, clientY) {
    const rect = this.getBoundingClientRect();
    const x = this.clamp(clientX - rect.left, 0, rect.width);
    const y = this.clamp(clientY - rect.top, 0, rect.height);

    this.state.targetX = x;
    this.state.targetY = y;

    if (!this.state.initialized || this.reduceMotion.matches) {
      this.state.currentX = x;
      this.state.currentY = y;
      this.state.initialized = true;
      this.paint();
    }
  }

  setIdleTarget() {
    const rect = this.getBoundingClientRect();
    this.state.targetX = rect.width * 0.56;
    this.state.targetY = rect.height * 0.44;

    if (!this.state.initialized) {
      this.state.currentX = this.state.targetX;
      this.state.currentY = this.state.targetY;
      this.state.initialized = true;
      this.paint();
    }
  }

  tick() {
    if (this.reduceMotion.matches) {
      this.state.currentX = this.state.targetX;
      this.state.currentY = this.state.targetY;
    } else {
      this.state.currentX += (this.state.targetX - this.state.currentX) * 0.18;
      this.state.currentY += (this.state.targetY - this.state.currentY) * 0.18;
    }

    this.paint();
    this.animationFrame = window.requestAnimationFrame?.(this.tick) ?? 0;
  }

  paint() {
    const { currentX, currentY, previousX, previousY } = this.state;
    const deltaX = currentX - previousX;
    const deltaY = currentY - previousY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    this.style.setProperty("--ftr-lens-x", `${currentX}px`);
    this.style.setProperty("--ftr-lens-y", `${currentY}px`);
    this.style.setProperty("--ftr-mask-x", `${currentX}px`);
    this.style.setProperty("--ftr-mask-y", `${currentY}px`);
    this.style.setProperty("--ftr-fluid-x", `${currentX}px`);
    this.style.setProperty("--ftr-fluid-y", `${currentY}px`);
    this.style.setProperty("--ftr-fluid-rotation", `${Number.isFinite(angle) ? angle : 0}deg`);

    this.state.previousX = currentX;
    this.state.previousY = currentY;
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}

if (!customElements.get("fluid-translation-reveal")) {
  customElements.define("fluid-translation-reveal", FluidTranslationReveal);
}

globalThis.FluidTranslationReveal = FluidTranslationReveal;
