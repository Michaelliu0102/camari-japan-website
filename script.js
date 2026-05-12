const hero = document.querySelector("[data-lens-area]");
const stack = document.querySelector(".translation-stack");

if (hero && stack) {
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const state = {
  currentX: 0,
  currentY: 0,
  targetX: 0,
  targetY: 0,
  previousX: 0,
  previousY: 0,
  active: false,
  initialized: false,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setTargetFromClientPoint(clientX, clientY) {
  const rect = hero.getBoundingClientRect();
  const x = clamp(clientX - rect.left, 0, rect.width);
  const y = clamp(clientY - rect.top, 0, rect.height);

  state.targetX = x;
  state.targetY = y;

  if (!state.initialized || motionQuery.matches) {
    state.currentX = x;
    state.currentY = y;
    state.initialized = true;
    paint();
  }
}

function setIdleTarget() {
  const rect = hero.getBoundingClientRect();
  state.targetX = rect.width * 0.56;
  state.targetY = rect.height * 0.44;

  if (!state.initialized) {
    state.currentX = state.targetX;
    state.currentY = state.targetY;
    state.initialized = true;
    paint();
  }
}

function paint() {
  hero.style.setProperty("--lens-x", `${state.currentX}px`);
  hero.style.setProperty("--lens-y", `${state.currentY}px`);
  hero.style.setProperty("--fluid-x", `${state.currentX}px`);
  hero.style.setProperty("--fluid-y", `${state.currentY}px`);

  const deltaX = state.currentX - state.previousX;
  const deltaY = state.currentY - state.previousY;
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  hero.style.setProperty("--fluid-rotation", `${Number.isFinite(angle) ? angle : 0}deg`);

  const heroRect = hero.getBoundingClientRect();
  const stackRect = stack.getBoundingClientRect();
  const maskX = state.currentX - (stackRect.left - heroRect.left);
  const maskY = state.currentY - (stackRect.top - heroRect.top);

  stack.style.setProperty("--mask-x", `${maskX}px`);
  stack.style.setProperty("--mask-y", `${maskY}px`);

  state.previousX = state.currentX;
  state.previousY = state.currentY;
}

function tick() {
  if (motionQuery.matches) {
    state.currentX = state.targetX;
    state.currentY = state.targetY;
  } else {
    state.currentX += (state.targetX - state.currentX) * 0.18;
    state.currentY += (state.targetY - state.currentY) * 0.18;
  }

  paint();
  requestAnimationFrame(tick);
}

hero.addEventListener("pointerenter", (event) => {
  state.active = true;
  hero.classList.add("is-active");
  setTargetFromClientPoint(event.clientX, event.clientY);
});

hero.addEventListener("pointermove", (event) => {
  setTargetFromClientPoint(event.clientX, event.clientY);
});

hero.addEventListener("pointerleave", () => {
  state.active = false;
  hero.classList.remove("is-active");
  setIdleTarget();
});

hero.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    hero.classList.add("is-active");
    setTargetFromClientPoint(touch.clientX, touch.clientY);
  },
  { passive: true },
);

hero.addEventListener(
  "touchmove",
  (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    setTargetFromClientPoint(touch.clientX, touch.clientY);
  },
  { passive: true },
);

hero.addEventListener("touchend", () => {
  hero.classList.remove("is-active");
  setIdleTarget();
});

window.addEventListener("resize", setIdleTarget);

setIdleTarget();
requestAnimationFrame(tick);
}
