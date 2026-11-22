'use client';

import Image from 'next/image';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { BRAND_LOGOS, SIZES } from '@/lib/config/brand';
import type { ModeloId } from '@/lib/data/modelos';
import { nextRest, RAD, restFor, STEP, WORDS, wrap180 } from './shaders';
import {
  createInitialGLContext,
  disposeJerseyWebGL,
  drawJerseyWebGL,
  initJerseyWebGL,
} from './webgl-jersey';

export interface StageController {
  markSize: (size: string) => void;
  setModelo: (modelo: ModeloId) => void;
  setPaused: (paused: boolean) => void;
  setScrollState: (params: {
    extraScale: number;
    extraYaw: number;
    ringFade: number;
    ringGrow: number;
    active: boolean;
    lightX: string;
  }) => void;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerEnd: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  rotateStep: (dir: -1 | 1) => void;
}

interface CamisetaStageProps {
  modelo: ModeloId;
  reducedMotion: boolean;
  onDraggingChange?: (dragging: boolean) => void;
  onAriaUpdate?: (deg: number, valueText: string) => void;
  controllerRef: React.RefObject<StageController | null>;
}

interface GlyphNode {
  ch: string;
  a: number;
  sz: boolean;
  size?: string;
  f: HTMLSpanElement | null;
  b: HTMLSpanElement | null;
  lf?: number;
  lb?: number;
}

export default function CamisetaStage({
  reducedMotion,
  onDraggingChange,
  onAriaUpdate,
  controllerRef,
}: CamisetaStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const camisetaRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frontTiltRef = useRef<HTMLDivElement>(null);
  const backTiltRef = useRef<HTMLDivElement>(null);

  const [glOn, setGlOn] = useState(false);
  const [stageOff, setStageOff] = useState(false);

  const stateRef = useRef({
    theta: 0,
    vel: 0,
    drag: false,
    last: 0,
    target: null as number | null,
    sv: 0,
    paused: false,
    roll: 0,
    extraYaw: 0,
    extraScale: 1,
    ringFade: 1,
    ringGrow: 1,
    active: true,
    size: null as string | null,
    R: 400,
    mix: 1,
    modelo: 'uruguay' as ModeloId,
    ringOff: 0,
    ringTarget: null as number | null,
    rv: 0,
    sizeLock: false,
    swayT: 0,
    swayAmp: 0,
    swayBase: 0,
    dirty: true,
  });

  const glyphsRef = useRef<GlyphNode[]>([]);
  const glCtxRef = useRef(createInitialGLContext());

  const dragInputRef = useRef({
    px: 0,
    lastMove: 0,
    startX: 0,
    startY: 0,
    decided: false,
  });

  useEffect(() => {
    const stage = stageRef.current;
    const camisetaEl = camisetaRef.current;
    const shadow = shadowRef.current;
    const canvas = canvasRef.current;
    const front = frontTiltRef.current;
    const back = backTiltRef.current;
    if (!stage || !camisetaEl || !shadow || !canvas || !front || !back) return;

    const S = stateRef.current;
    S.last = performance.now();

    front.innerHTML = '';
    back.innerHTML = '';
    const glyphs: GlyphNode[] = [];
    const wordMid = (WORDS.length - 1) / 2;
    WORDS.forEach((ch, i) =>
      glyphs.push({ ch, a: (i - wordMid) * STEP, sz: false, f: null, b: null })
    );
    const sizeMid = (SIZES.length - 1) / 2;
    SIZES.forEach((s, j) =>
      glyphs.push({
        ch: s,
        a: 180 + (j - sizeMid) * 18,
        sz: true,
        size: s,
        f: null,
        b: null,
      })
    );

    for (const g of glyphs) {
      for (const [layer, key] of [
        [front, 'f'],
        [back, 'b'],
      ] as const) {
        const el = document.createElement('span');
        el.className = 'g' + (g.sz ? ' sz' : '');
        el.textContent = g.ch === ' ' ? '' : g.ch;
        layer.appendChild(el);
        g[key] = el;
      }
    }
    glyphsRef.current = glyphs;

    const glBox = glCtxRef.current;

    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const phone = vw <= 760;
      S.R = phone ? Math.min(vw * 0.42, vh * 0.28) : Math.min(vw * 0.36, vh * 0.6);
      stage.style.setProperty('--r', `${S.R}px`);
      stage.style.setProperty(
        '--gs',
        `${phone ? Math.min(vw * 0.085, vh * 0.058) : Math.min(vw * 0.08, vh * 0.13)}px`
      );
      stage.style.setProperty('--persp', `${phone ? 820 : 1700}px`);
      const sw = camisetaEl.offsetWidth;
      const sh = sw;
      glBox.layout = {
        cx: camisetaEl.offsetLeft + sw / 2,
        cy: camisetaEl.offsetTop + sh / 2,
        sw,
        sh,
      };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      if (glBox.gl) glBox.gl.viewport(0, 0, canvas.width, canvas.height);
      S.dirty = true;
    };

    const drawRing = () => {
      const R = S.R * S.ringGrow;
      const ai = S.size ? SIZES.indexOf(S.size as (typeof SIZES)[number]) : -9;
      for (const g of glyphsRef.current) {
        if (!g.f || !g.b) continue;
        const w = g.a + S.theta + S.ringOff;
        const c = Math.cos(w * RAD);
        const x = R * Math.sin(w * RAD);
        const z = R * c;
        const on = g.sz && g.size === S.size;
        const near =
          g.sz &&
          ai >= 0 &&
          g.size !== undefined &&
          Math.abs(SIZES.indexOf(g.size as (typeof SIZES)[number]) - ai) === 1;
        const edge = Math.min(1, Math.max(0, (Math.abs(c) - 0.06) / 0.3));
        const fo = c > 0 ? +(S.ringFade * edge * (near ? 0.18 : 1)).toFixed(3) : 0;
        const bo = c <= 0 ? +((g.sz ? 0.2 : 0.07) * S.ringFade * edge).toFixed(3) : 0;
        const pos = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) `;
        if (fo > 0 || g.lf !== 0) {
          g.f.style.transform = pos + `rotateY(${w.toFixed(2)}deg) scale(${on ? 1.35 : 1})`;
        }
        if (bo > 0 || g.lb !== 0) {
          g.b.style.transform = pos + `rotateY(${(w + 180).toFixed(2)}deg)`;
        }
        if (fo !== g.lf) {
          g.f.style.opacity = String(fo);
          g.lf = fo;
        }
        if (bo !== g.lb) {
          g.b.style.opacity = String(bo);
          g.lb = bo;
        }
      }
    };

    let cancelled = false;
    let prev = performance.now();
    let restDone = true;
    let settled = true;
    let rafId = 0;

    const step = (now: number) => {
      if (cancelled) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const before = S.theta;

      if (!S.drag && !reducedMotion && S.active) {
        if (S.target !== null) {
          S.sv += ((S.target - S.theta) * 120 - S.sv * 14.7) * dt;
          S.theta += S.sv * dt;
          if (Math.abs(S.target - S.theta) < 0.05 && Math.abs(S.sv) < 0.5) {
            S.theta = S.target;
            S.target = null;
            S.sv = 0;
          }
        } else if (Math.abs(S.vel) > 0.2) {
          S.theta += S.vel;
          S.vel *= Math.pow(0.92, dt * 60);
          restDone = false;
        } else if (!restDone) {
          S.vel = 0;
          restDone = true;
          S.target = restFor(S.theta);
        } else if (!S.paused && !S.sizeLock && now - S.last > 2500) {
          if (S.swayAmp === 0) {
            S.swayBase = restFor(S.theta);
            S.swayT = 0;
          }
          S.swayAmp = Math.min(1, S.swayAmp + dt / 3);
          S.swayT += dt;
          S.theta = S.swayBase + 14 * S.swayAmp * Math.sin(S.swayT / 2.4);
        }

        if (S.ringTarget !== null) {
          S.rv += ((S.ringTarget - S.ringOff) * 120 - S.rv * 14.7) * dt;
          S.ringOff += S.rv * dt;
          if (Math.abs(S.ringTarget - S.ringOff) < 0.05 && Math.abs(S.rv) < 0.5) {
            S.ringOff = S.ringTarget;
            S.ringTarget = null;
            S.rv = 0;
          }
          S.dirty = true;
        }
      }

      const targetRoll = reducedMotion ? 0 : Math.max(-4, Math.min(4, S.vel * 0.8));
      S.roll += (targetRoll - S.roll) * Math.min(1, dt * 8);
      if (S.mix < 1) {
        S.mix = Math.min(1, S.mix + dt / 0.26);
        S.dirty = true;
      }
      if (S.theta !== before || Math.abs(S.roll) > 0.01) S.dirty = true;

      if (S.active && S.dirty) {
        drawRing();
        if (glBox.gl) drawJerseyWebGL(canvas, shadow, glBox, S);
        S.dirty = false;
        settled = false;
      } else if (!settled && S.target === null && !S.drag) {
        settled = true;
        const deg = ((S.theta % 360) + 360) % 360;
        const f = Math.abs(wrap180(S.theta * 2) / 2);
        const backSide = Math.abs(wrap180(S.theta)) > 90;
        onAriaUpdate?.(
          Math.round(deg),
          (f < 8 ? 'Frente' : 'Vista tres cuartos') +
            (backSide ? ', otro lado' : '')
        );
      }

      rafId = requestAnimationFrame(step);
    };

    measure();
    window.addEventListener('resize', measure);
    drawRing();

    const startGL = () =>
      void initJerseyWebGL(
        canvas,
        glBox,
        () => cancelled,
        () => {
          S.dirty = true;
          requestAnimationFrame(() => {
            if (!cancelled) setGlOn(true);
          });
        }
      );

    const idleWin = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof idleWin.requestIdleCallback === 'function') {
      idleWin.requestIdleCallback(startGL, { timeout: 1200 });
    } else {
      setTimeout(startGL, 300);
    }

    rafId = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
      disposeJerseyWebGL(glBox);
    };
  }, [onAriaUpdate, reducedMotion]);

  useImperativeHandle(controllerRef, () => ({
    markSize: (s: string) => {
      const S = stateRef.current;
      S.size = s;
      for (const g of glyphsRef.current) {
        if (g.sz && g.f && g.b) {
          g.f.classList.toggle('on', g.size === s);
          g.b.classList.toggle('on', g.size === s);
        }
      }
      const match = glyphsRef.current.find((x) => x.sz && x.size === s);
      if (!match) return;
      S.sizeLock = true;
      S.swayAmp = 0;
      if (!reducedMotion) {
        S.ringTarget = S.ringOff + wrap180(-(match.a + S.theta + S.ringOff));
        S.vel = 0;
        S.target = restFor(S.theta);
      } else {
        S.ringOff += wrap180(-(match.a + S.theta + S.ringOff));
      }
      S.dirty = true;
    },

    setModelo: (nextModelo: ModeloId) => {
      const S = stateRef.current;
      if (nextModelo === S.modelo) return;
      S.modelo = nextModelo;
      S.swayAmp = 0;
      if (!reducedMotion) {
        S.target = nextRest(S.theta, 1);
      }
      S.last = performance.now();
      S.dirty = true;
    },

    setPaused: (paused: boolean) => {
      stateRef.current.paused = paused;
    },

    setScrollState: ({ extraScale, extraYaw, ringFade, ringGrow, active, lightX }) => {
      const S = stateRef.current;
      S.extraScale = extraScale;
      S.extraYaw = extraYaw;
      S.ringFade = ringFade;
      S.ringGrow = ringGrow;
      S.active = active;
      S.dirty = true;
      stageRef.current?.style.setProperty('--lx', lightX);
      setStageOff(!active);
    },

    handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const S = stateRef.current;
      const d = dragInputRef.current;
      S.drag = true;
      d.decided = e.pointerType === 'mouse';
      d.px = d.startX = e.clientX;
      d.startY = e.clientY;
      S.target = null;
      S.vel = 0;
      S.last = performance.now();
      S.swayAmp = 0;
      S.sizeLock = false;
      if (d.decided) {
        e.currentTarget.setPointerCapture(e.pointerId);
        onDraggingChange?.(true);
      }
    },

    handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      const S = stateRef.current;
      if (!S.drag) return;
      const d = dragInputRef.current;
      if (!d.decided) {
        if (Math.abs(e.clientX - d.startX) < 8 && Math.abs(e.clientY - d.startY) < 8) return;
        if (Math.abs(e.clientY - d.startY) > Math.abs(e.clientX - d.startX)) {
          S.drag = false;
          return;
        }
        d.decided = true;
        onDraggingChange?.(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
      const dx = e.clientX - d.px;
      d.px = e.clientX;
      const delta = dx * (window.innerWidth <= 760 ? 0.55 : 0.32);
      S.theta += delta;
      S.vel = S.vel * 0.5 + delta * 0.5;
      d.lastMove = performance.now();
      S.last = d.lastMove;
      S.dirty = true;
    },

    handlePointerEnd: () => {
      onDraggingChange?.(false);
      const S = stateRef.current;
      if (!S.drag) return;
      S.drag = false;
      S.last = performance.now();
      if (performance.now() - dragInputRef.current.lastMove > 90) {
        S.vel = 0;
      } else if (Math.abs(S.vel) <= 0.2) {
        S.target = restFor(S.theta);
      }
    },

    handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const S = stateRef.current;
      const base = S.target ?? S.theta;
      S.target = nextRest(base, e.key === 'ArrowRight' ? 1 : -1);
      S.swayAmp = 0;
      if (reducedMotion) {
        S.theta = S.target;
        S.target = null;
      }
      S.last = performance.now();
      S.dirty = true;
    },

    rotateStep: (dir: -1 | 1) => {
      const S = stateRef.current;
      const base = S.target ?? S.theta;
      S.target = nextRest(base, dir);
      S.swayAmp = 0;
      if (reducedMotion) {
        S.theta = S.target;
        S.target = null;
      }
      S.last = performance.now();
      S.dirty = true;
    },
  }));

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className={`cl-stage fixed inset-0 z-0 overflow-hidden pointer-events-none ${
        stageOff ? 'invisible' : 'visible'
      }`}
    >
      <div className="cl-field absolute inset-0" />

      {/* Mitad trasera del anillo 3D */}
      <div className="cl-ring cl-ring-back absolute inset-0">
        <div ref={backTiltRef} className="cl-ring-tilt absolute w-0 h-0">
          <div className="cl-ring-line" />
        </div>
      </div>

      {/* Logo 3D de respaldo + sombra */}
      <div ref={camisetaRef} className="cl-camiseta absolute">
        <div
          ref={shadowRef}
          className="absolute left-[22%] right-[22%] -bottom-[6%] h-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(0,0,0,0.58),rgba(0,0,0,0))] blur-[6px] origin-center"
        />
        <Image
          src={BRAND_LOGOS.emblem3d}
          alt=""
          width={512}
          height={512}
          priority
          className={`block w-[72%] h-auto mx-auto rounded-full -rotate-2 transition-opacity duration-500 drop-shadow-[18px_0_30px_rgba(142,203,245,0.22)] ${
            glOn ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>

      {/* Canvas WebGL2 */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-600 ${
          glOn ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Mitad delantera del anillo 3D */}
      <div className="cl-ring cl-ring-front absolute inset-0">
        <div ref={frontTiltRef} className="cl-ring-tilt absolute w-0 h-0">
          <div className="cl-ring-line" />
        </div>
      </div>

      {/* Ruido editorial */}
      <div className="cl-grain absolute -inset-1/2 opacity-[0.07] mix-blend-overlay pointer-events-none" />
    </div>
  );
}
