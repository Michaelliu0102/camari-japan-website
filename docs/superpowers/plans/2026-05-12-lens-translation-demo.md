# Lens Translation Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone static cursor-lens demo that reveals Japanese text over English text.

**Architecture:** Use three files in the project root. HTML owns semantic content, CSS owns all visual layering and mask effects through custom properties, and JavaScript updates lens coordinates using pointer/touch input plus a small animation loop.

**Tech Stack:** Static HTML, CSS custom properties, CSS masking/clip-path fallback, vanilla JavaScript.

---

### Task 1: Static Page and Content

**Files:**
- Create: `/Users/michael/Documents/New project/index.html`

- [ ] **Step 1: Create semantic HTML**

Add a single hero section with duplicated English/Japanese text layers and a visual lens element.

- [ ] **Step 2: Verify the file opens**

Run: `test -f index.html`
Expected: command exits with status 0.

### Task 2: Visual Layering and Lens Styling

**Files:**
- Create: `/Users/michael/Documents/New project/styles.css`

- [ ] **Step 1: Define responsive layout and typography**

Use a full-viewport hero, large uppercase headline text, and aligned Japanese copy.

- [ ] **Step 2: Add lens reveal styles**

Use CSS variables `--lens-x`, `--lens-y`, and `--lens-size` to position a circular mask on the Japanese layer and the visual lens.

- [ ] **Step 3: Add responsive and reduced-motion behavior**

Keep text readable on small screens and remove smoothing transitions when `prefers-reduced-motion` is active.

### Task 3: Pointer Interaction

**Files:**
- Create: `/Users/michael/Documents/New project/script.js`

- [ ] **Step 1: Track pointer and touch positions**

Map client coordinates into hero-local coordinates and store target lens position.

- [ ] **Step 2: Smooth movement**

Use `requestAnimationFrame` to interpolate current lens position toward the target position.

- [ ] **Step 3: Add idle and bounds behavior**

Clamp coordinates to the hero bounds and return to a center-biased idle position on pointer leave.

### Task 4: Local Verification

**Files:**
- Read: `/Users/michael/Documents/New project/index.html`
- Read: `/Users/michael/Documents/New project/styles.css`
- Read: `/Users/michael/Documents/New project/script.js`

- [ ] **Step 1: Start a local static server**

Run: `python3 -m http.server 8000`
Expected: server starts and serves the project directory.

- [ ] **Step 2: Browser check**

Open `http://localhost:8000/` and verify the page loads, the lens follows pointer movement, Japanese text is visible only inside the lens, and no console errors appear.

