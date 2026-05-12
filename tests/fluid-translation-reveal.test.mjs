import assert from "node:assert/strict";
import { test } from "node:test";

class FakeHTMLElement {
  attachShadow() {
    this.shadowRoot = { innerHTML: "" };
    return this.shadowRoot;
  }

  getAttribute() {
    return null;
  }

  hasAttribute() {
    return false;
  }
}

const registry = new Map();

globalThis.HTMLElement = FakeHTMLElement;
globalThis.document = {
  createElement(name) {
    if (name !== "template") return {};
    return {
      content: {
        cloneNode() {
          return {};
        },
      },
      innerHTML: "",
    };
  },
};
globalThis.customElements = {
  define(name, component) {
    registry.set(name, component);
  },
  get(name) {
    return registry.get(name);
  },
};
globalThis.window = {
  matchMedia() {
    return { matches: false };
  },
  requestAnimationFrame() {
    return 1;
  },
  cancelAnimationFrame() {},
};

await import("../components/fluid-translation-reveal.js");

test("registers a reusable fluid translation reveal element", () => {
  const Component = customElements.get("fluid-translation-reveal");

  assert.equal(typeof Component, "function");
  assert.deepEqual(Component.observedAttributes, [
    "english",
    "japanese",
    "variant",
    "size",
    "aria-label",
  ]);
});

test("exposes helpers for parsing pipe separated Japanese lines", () => {
  const Component = customElements.get("fluid-translation-reveal");

  assert.deepEqual(Component.parseLines("私たちは|異なる|出発点を|選びます"), [
    "私たちは",
    "異なる",
    "出発点を",
    "選びます",
  ]);
});
