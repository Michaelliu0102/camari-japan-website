"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface ParallaxCarouselProps {
  images: string[];
  imageWidth?: number;
  imageHeight?: number;
  imageFit?: "cover" | "contain";
  gap?: number;
  parallaxIntensity?: number;
  uvScale?: number;
  lerp?: number;
  wheelSensitivity?: number;
  dragSensitivity?: number;
  loop?: boolean;
  borderRadius?: number;
  autoplaySpeed?: number;
  pauseOnHover?: boolean;
  showProgress?: boolean;
  onImageClick?: (src: string, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ParallaxCarouselRef {
  scrollToIndex: (index: number) => void;
  reset: () => void;
}

const PLANE_VERTEX = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const PLANE_FRAGMENT = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uMap;
uniform vec2 uPlanePx;
uniform vec2 uTexPx;
uniform float uShift;
uniform float uIntensity;
uniform float uMaxShift;
uniform float uRadiusPx;
uniform float uHasTexture;
uniform float uContainFit;

vec2 coverFit(vec2 uv, vec2 planeSize, vec2 texSize) {
  float planeAspect = planeSize.x / max(planeSize.y, 1.0);
  float texAspect = texSize.x / max(texSize.y, 0.0001);
  vec2 ratio = vec2(
    min(planeAspect / max(texAspect, 0.0001), 1.0),
    min((1.0 / planeAspect) / max(1.0 / texAspect, 0.0001), 1.0)
  );
  return uv * ratio + (1.0 - ratio) * 0.5;
}

float roundedBoxAlpha(vec2 uv, vec2 sizePx, float radiusPx) {
  vec2 p = (uv - 0.5) * sizePx;
  vec2 half_ = sizePx * 0.5 - vec2(radiusPx);
  vec2 d = abs(p) - half_;
  float outside = length(max(d, 0.0));
  float inside = min(max(d.x, d.y), 0.0);
  float dist = outside + inside - radiusPx;
  return clamp(0.5 - dist, 0.0, 1.0);
}

void main() {
  vec2 uv = coverFit(vUv, uPlanePx, uTexPx);
  float imageMask = 1.0;

  if (uContainFit > 0.5) {
    float planeAspect = uPlanePx.x / max(uPlanePx.y, 1.0);
    float texAspect = uTexPx.x / max(uTexPx.y, 0.0001);
    vec2 scale = vec2(1.0);

    if (texAspect > planeAspect) {
      scale.y = planeAspect / max(texAspect, 0.0001);
    } else {
      scale.x = texAspect / max(planeAspect, 0.0001);
    }

    vec2 offset = (1.0 - scale) * 0.5;
    uv = (vUv - offset) / scale;
    imageMask = step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0);
  } else {
    float zoom = 1.0 / (1.0 + 2.0 * uMaxShift);
    uv = (uv - 0.5) * zoom + 0.5;

    uv.x += uShift * uIntensity * zoom;
  }

  vec4 tex;
  if (uHasTexture > 0.5) {
    tex = texture2D(uMap, uv);
  } else {
    tex = vec4(mix(vec3(0.07), vec3(0.12), vUv.y), 1.0);
  }

  float mask = uRadiusPx > 0.5 ? roundedBoxAlpha(vUv, uPlanePx, uRadiusPx) : 1.0;
  gl_FragColor = vec4(tex.rgb, tex.a * mask * imageMask);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildUniforms() {
  return {
    uMap: { value: null as THREE.Texture | null },
    uPlanePx: { value: new THREE.Vector2(1, 1) },
    uTexPx: { value: new THREE.Vector2(1, 1) },
    uShift: { value: 0 },
    uIntensity: { value: 0.4 },
    uMaxShift: { value: 0.2 },
    uRadiusPx: { value: 0 },
    uHasTexture: { value: 0 },
    uContainFit: { value: 0 }
  };
}

interface ScrollState {
  current: number;
  target: number;
  limit: number;
}

interface PlaneProps {
  src: string;
  index: number;
  imageWidth: number;
  imageHeight: number;
  imageFit: "cover" | "contain";
  gap: number;
  parallaxIntensity: number;
  uvScale: number;
  borderRadius: number;
  loop: boolean;
  totalCount: number;
  scrollRef: React.RefObject<ScrollState>;
}

const Plane: React.FC<PlaneProps> = ({
  src,
  index,
  imageWidth,
  imageHeight,
  imageFit,
  gap,
  parallaxIntensity,
  uvScale,
  borderRadius,
  loop,
  totalCount,
  scrollRef
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const { size } = useThree();
  const [uniforms] = React.useState(buildUniforms);
  const propsRef = useRef({
    borderRadius,
    gap,
    imageHeight,
    imageFit,
    imageWidth,
    loop,
    parallaxIntensity,
    uvScale
  });

  useEffect(() => {
    propsRef.current = {
      borderRadius,
      gap,
      imageHeight,
      imageFit,
      imageWidth,
      loop,
      parallaxIntensity,
      uvScale
    };
  }, [borderRadius, imageFit, imageHeight, imageWidth, gap, loop, parallaxIntensity, uvScale]);

  useEffect(() => {
    if (!src) {
      return;
    }

    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      src,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        textureRef.current = tex;
      },
      undefined,
      () => {
        if (!cancelled) {
          textureRef.current = null;
        }
      }
    );

    return () => {
      cancelled = true;
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [src]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const mat = mesh.material as THREE.ShaderMaterial;
    const u = mat.uniforms;
    const p = propsRef.current;
    const scroll = scrollRef.current;

    if (!scroll) {
      return;
    }

    const planeStride = p.imageWidth + p.gap;
    let offsetPx = index * planeStride - scroll.current;

    if (p.loop && totalCount > 0) {
      const stripLength = totalCount * planeStride;
      const halfStrip = stripLength * 0.5;
      offsetPx = ((offsetPx + halfStrip) % stripLength + stripLength) % stripLength - halfStrip;
    }

    mesh.position.x = offsetPx;
    mesh.position.y = 0;
    mesh.scale.set(p.imageWidth, p.imageHeight, 1);

    const viewport = Math.max(size.width, 1);
    const norm = clamp(offsetPx / viewport, -p.uvScale, p.uvScale);
    u.uShift.value = -norm;
    u.uIntensity.value = p.parallaxIntensity;
    u.uMaxShift.value = p.uvScale * p.parallaxIntensity;
    u.uRadiusPx.value = p.borderRadius;
    u.uContainFit.value = p.imageFit === "contain" ? 1 : 0;
    (u.uPlanePx.value as THREE.Vector2).set(p.imageWidth, p.imageHeight);

    if (textureRef.current?.image) {
      u.uMap.value = textureRef.current;
      const img = textureRef.current.image as HTMLImageElement;
      (u.uTexPx.value as THREE.Vector2).set(
        img.naturalWidth || img.width || 1,
        img.naturalHeight || img.height || 1
      );
      u.uHasTexture.value = 1;
    } else {
      u.uHasTexture.value = 0;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial fragmentShader={PLANE_FRAGMENT} transparent uniforms={uniforms} vertexShader={PLANE_VERTEX} />
    </mesh>
  );
};

const CameraRig: React.FC = () => {
  const camRef = useRef<THREE.OrthographicCamera>(null);
  const { set, size } = useThree();

  useEffect(() => {
    const cam = camRef.current;
    if (!cam) {
      return;
    }

    cam.left = -size.width / 2;
    cam.right = size.width / 2;
    cam.top = size.height / 2;
    cam.bottom = -size.height / 2;
    cam.near = 0.1;
    cam.far = 1000;
    cam.position.set(0, 0, 10);
    cam.updateProjectionMatrix();
    set({ camera: cam });
  }, [set, size.height, size.width]);

  return <orthographicCamera ref={camRef} />;
};

const ParallaxCarousel = React.forwardRef<ParallaxCarouselRef, ParallaxCarouselProps>(
  (
    {
      images,
      imageWidth = 420,
      imageHeight = 560,
      imageFit = "cover",
      gap = 32,
      parallaxIntensity = 0.4,
      uvScale = 0.85,
      lerp = 0.08,
      wheelSensitivity = 1,
      dragSensitivity = 1.4,
      loop = false,
      borderRadius = 16,
      autoplaySpeed = 0,
      pauseOnHover = true,
      showProgress = true,
      onImageClick,
      className,
      style
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const hoverRef = useRef(false);
    const draggingRef = useRef(false);
    const lastPointerXRef = useRef(0);
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
    const lastFrameTsRef = useRef<number | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<ScrollState>({
      current: 0,
      limit: 0,
      target: 0
    });
    const settingsRef = useRef({
      autoplaySpeed,
      count: images.length,
      dragSensitivity,
      gap,
      imageHeight,
      imageWidth,
      lerp,
      loop,
      onImageClick,
      pauseOnHover,
      wheelSensitivity
    });

    useEffect(() => {
      settingsRef.current = {
        autoplaySpeed,
        count: images.length,
        dragSensitivity,
        gap,
        imageHeight,
        imageWidth,
        lerp,
        loop,
        onImageClick,
        pauseOnHover,
        wheelSensitivity
      };
    }, [autoplaySpeed, dragSensitivity, gap, imageHeight, imageWidth, images.length, lerp, loop, onImageClick, pauseOnHover, wheelSensitivity]);

    const recomputeLimit = useCallback(() => {
      const node = containerRef.current;
      if (!node) {
        return;
      }

      const total = images.length * (imageWidth + gap) - gap;
      const visible = node.clientWidth;
      scrollRef.current.limit = loop ? Number.POSITIVE_INFINITY : Math.max(0, total - visible);
    }, [gap, imageWidth, images.length, loop]);

    useEffect(() => {
      recomputeLimit();
      const node = containerRef.current;
      if (!node || typeof ResizeObserver === "undefined") {
        return;
      }

      const ro = new ResizeObserver(recomputeLimit);
      ro.observe(node);
      return () => ro.disconnect();
    }, [recomputeLimit]);

    useEffect(() => {
      const tick = (now: number) => {
        const s = scrollRef.current;
        const settings = settingsRef.current;
        const last = lastFrameTsRef.current ?? now;
        const dt = Math.max(0, (now - last) / 1000);
        lastFrameTsRef.current = now;

        if (settings.autoplaySpeed !== 0 && !draggingRef.current && !(settings.pauseOnHover && hoverRef.current)) {
          s.target += settings.autoplaySpeed * dt;
        }

        if (!settings.loop) {
          s.target = clamp(s.target, 0, s.limit);
        }

        const k = clamp(settings.lerp, 0.001, 1);
        s.current += (s.target - s.current) * k;

        if (progressBarRef.current && !settings.loop && s.limit > 0) {
          const ratio = clamp(s.current / s.limit, 0, 1);
          progressBarRef.current.style.transform = `scaleX(${ratio})`;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = null;
        lastFrameTsRef.current = null;
      };
    }, []);

    useEffect(() => {
      const node = containerRef.current;
      if (!node) {
        return;
      }

      const onWheel = (event: WheelEvent) => {
        const settings = settingsRef.current;
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        scrollRef.current.target += delta * settings.wheelSensitivity;
      };

      const onPointerDown = (event: PointerEvent) => {
        draggingRef.current = true;
        lastPointerXRef.current = event.clientX;
        pointerStartRef.current = { x: event.clientX, y: event.clientY };
        node.setPointerCapture(event.pointerId);
        node.style.cursor = "grabbing";
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!draggingRef.current) {
          return;
        }

        const settings = settingsRef.current;
        const dx = event.clientX - lastPointerXRef.current;
        lastPointerXRef.current = event.clientX;
        scrollRef.current.target -= dx * settings.dragSensitivity;
      };

      const getClickedImageIndex = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const settings = settingsRef.current;
        const localX = event.clientX - rect.left - rect.width * 0.5;
        const localY = event.clientY - rect.top - rect.height * 0.5;
        const planeStride = settings.imageWidth + settings.gap;

        for (let index = 0; index < images.length; index += 1) {
          let offsetPx = index * planeStride - scrollRef.current.current;

          if (settings.loop && images.length > 0) {
            const stripLength = images.length * planeStride;
            const halfStrip = stripLength * 0.5;
            offsetPx = ((offsetPx + halfStrip) % stripLength + stripLength) % stripLength - halfStrip;
          }

          const withinX = Math.abs(localX - offsetPx) <= settings.imageWidth * 0.5;
          const withinY = Math.abs(localY) <= settings.imageHeight * 0.5;

          if (withinX && withinY) {
            return index;
          }
        }

        return -1;
      };

      const onPointerUp = (event: PointerEvent) => {
        if (!draggingRef.current) {
          return;
        }

        draggingRef.current = false;
        const start = pointerStartRef.current;
        pointerStartRef.current = null;
        try {
          node.releasePointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
        node.style.cursor = "grab";

        const moved = start ? Math.hypot(event.clientX - start.x, event.clientY - start.y) : Number.POSITIVE_INFINITY;
        const settings = settingsRef.current;

        if (moved <= 6 && settings.onImageClick) {
          const clickedIndex = getClickedImageIndex(event);

          if (clickedIndex >= 0) {
            settings.onImageClick(images[clickedIndex], clickedIndex);
          }
        }
      };

      const onEnter = () => {
        hoverRef.current = true;
      };
      const onLeave = () => {
        hoverRef.current = false;
      };

      node.addEventListener("wheel", onWheel, { passive: true });
      node.addEventListener("pointerdown", onPointerDown);
      node.addEventListener("pointermove", onPointerMove);
      node.addEventListener("pointerup", onPointerUp);
      node.addEventListener("pointercancel", onPointerUp);
      node.addEventListener("pointerleave", onPointerUp);
      node.addEventListener("mouseenter", onEnter);
      node.addEventListener("mouseleave", onLeave);

      return () => {
        node.removeEventListener("wheel", onWheel);
        node.removeEventListener("pointerdown", onPointerDown);
        node.removeEventListener("pointermove", onPointerMove);
        node.removeEventListener("pointerup", onPointerUp);
        node.removeEventListener("pointercancel", onPointerUp);
        node.removeEventListener("pointerleave", onPointerUp);
        node.removeEventListener("mouseenter", onEnter);
        node.removeEventListener("mouseleave", onLeave);
      };
    }, [images]);

    const scrollToIndex = useCallback((idx: number) => {
      const settings = settingsRef.current;
      const target = idx * (settings.imageWidth + settings.gap);
      scrollRef.current.target = settings.loop ? target : clamp(target, 0, scrollRef.current.limit);
    }, []);

    const reset = useCallback(() => {
      scrollRef.current.target = 0;
      scrollRef.current.current = 0;
    }, []);

    useImperativeHandle(ref, () => ({ reset, scrollToIndex }), [reset, scrollToIndex]);

    const planeKeys = useMemo(() => images.map((src, index) => `${index}-${src}`), [images]);

    return (
      <div
        className={`relative h-full w-full select-none overflow-hidden ${className ?? ""}`}
        ref={containerRef}
        style={{
          cursor: "grab",
          touchAction: "pan-y",
          ...style
        }}
      >
        <Canvas className="!absolute inset-0 h-full w-full" dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
          <CameraRig />
          {images.map((src, index) => (
            <Plane
              borderRadius={borderRadius}
              gap={gap}
              imageHeight={imageHeight}
              imageFit={imageFit}
              imageWidth={imageWidth}
              index={index}
              key={planeKeys[index]}
              loop={loop}
              parallaxIntensity={parallaxIntensity}
              scrollRef={scrollRef}
              src={src}
              totalCount={images.length}
              uvScale={uvScale}
            />
          ))}
        </Canvas>

        {showProgress && !loop ? (
          <div aria-hidden className="pointer-events-none absolute bottom-4 left-1/2 h-[2px] w-32 -translate-x-1/2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-full origin-left bg-white/80" ref={progressBarRef} style={{ transform: "scaleX(0)" }} />
          </div>
        ) : null}
      </div>
    );
  }
);

ParallaxCarousel.displayName = "ParallaxCarousel";

export default ParallaxCarousel;
