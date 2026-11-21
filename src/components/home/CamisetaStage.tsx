'use client';

import Image from 'next/image';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { ModeloId } from '@/lib/futbolenlapiel-data';
import { BRAND_LOGOS, SIZES } from '@/lib/futbolenlapiel-data';

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

const WORDS = 'LA PASIÓN SE LLEVA PUESTA.'.split('');
const STEP = 9.2;
const RESTS = [-22, 0, 22];
const RAD = Math.PI / 180;

const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

function restFor(theta: number) {
  const f = wrap180(theta * 2) / 2;
  const r = RESTS.reduce((a, x) => (Math.abs(x - f) < Math.abs(a - f) ? x : a));
  return theta - f + r;
}

function nextRest(theta: number, dir: number) {
  const all: number[] = [];
  const base = Math.floor(theta / 180) * 180;
  for (let k = -1; k <= 2; k++) {
    for (const r of RESTS) all.push(base + k * 180 + r);
  }
  all.sort((a, b) => a - b);
  return dir > 0
    ? (all.find((x) => x > theta + 1) ?? theta + 22)
    : (all.reverse().find((x) => x < theta - 1) ?? theta - 22);
}

const VS = `#version 300 es
in vec2 aUv;
uniform sampler2D uDepth;
uniform float uYaw, uRoll, uScale, uMirror, uSquash, uDz, uCam, uAsp;
uniform vec2 uC, uK;
out vec2 vUv; out vec3 vP;
void main(){
  vec2 suv = vec2(uMirror > .5 ? 1. - aUv.x : aUv.x, aUv.y);
  float d = 0.;
  for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) d += texture(uDepth, suv + vec2(float(i), float(j)) * vec2(.006, .01)).r;
  d /= 9.;
  vec3 p = vec3((aUv.x - .5) * uSquash, (.5 - aUv.y) * uAsp, d * uDz);
  float cr = cos(uRoll), sr = sin(uRoll);
  p.xy = vec2(p.x * cr - p.y * sr, p.x * sr + p.y * cr);
  float cy = cos(uYaw), sy = sin(uYaw);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy) * uScale;
  float persp = uCam / (uCam - p.z);
  gl_Position = vec4(uC + p.xy * uK * persp, -p.z * .5, 1.);
  vUv = suv; vP = p;
}`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uA, uB, uDepth;
uniform float uMix, uYaw, uMirror, uDz, uAsp, uSweep, uRim, uAlpha;
in vec2 vUv; in vec3 vP; out vec4 o;
void main(){
  vec4 c = mix(texture(uA, vUv), texture(uB, vUv), uMix);
  if (c.a < .004) discard;
  float e = 3. / 600.;
  float sg = uMirror > .5 ? -1. : 1.;
  float dx = (texture(uDepth, vUv + vec2(e, 0.)).r - texture(uDepth, vUv - vec2(e, 0.)).r) / (2. * e) * sg;
  float dy = (texture(uDepth, vUv + vec2(0., e)).r - texture(uDepth, vUv - vec2(0., e)).r) / (2. * e);
  vec3 n = normalize(vec3(-dx * uDz * .7, dy * uDz * .7 / uAsp, 1.));
  float cy = cos(uYaw), sy = sin(uYaw);
  n = vec3(n.x * cy + n.z * sy, n.y, -n.x * sy + n.z * cy);
  float key = max(dot(n, normalize(vec3(-.45, .55, .7))), 0.);
  float rim = pow(max(dot(n, normalize(vec3(.92, .15, -.25))), 0.), 1.6) * uRim;
  float x = vUv.x * sg + (sg < 0. ? 1. : 0.);
  float sweep = exp(-pow((x - uSweep) * 7., 2.)) * .10;
  vec3 rgb = c.rgb * (.8 + .32 * key) + vec3(.56, .80, .96) * rim * c.a + vec3(sweep) * c.a;
  o = vec4(rgb, c.a) * uAlpha;
}`;

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
    texA: null as WebGLTexture | null,
    texB: null as WebGLTexture | null,
  });

  const glyphsRef = useRef<GlyphNode[]>([]);
  const glCtxRef = useRef<{
    gl: WebGL2RenderingContext | null;
    prog: WebGLProgram | null;
    U: Record<string, WebGLUniformLocation | null>;
    nIdx: number;
    tex: Partial<Record<ModeloId | 'depth', WebGLTexture>>;
    ready: boolean;
    layout: { cx: number; cy: number; sw: number; sh: number };
  }>({
    gl: null,
    prog: null,
    U: {},
    nIdx: 0,
    tex: {},
    ready: false,
    layout: { cx: 0, cy: 0, sw: 1, sh: 1 },
  });

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

    const loadSvgCanvas = (url: string) =>
      new Promise<HTMLCanvasElement>((res, rej) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const size = 1024;
          const off = document.createElement('canvas');
          off.width = size;
          off.height = size;
          const ctx = off.getContext('2d');
          if (!ctx) {
            rej(new Error('2D context unavailable'));
            return;
          }
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size * 0.49, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, 0, 0, size, size);
          res(off);
        };
        img.onerror = rej;
        img.src = url;
      });

    const uploadCanvas = (
      gl: WebGL2RenderingContext,
      source: HTMLCanvasElement,
      unit: number
    ) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };

    const createLogoDepthTexture = (gl: WebGL2RenderingContext, unit: number) => {
      const size = 256;
      const pixels = new Uint8Array(size * size * 4);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const nx = (x / (size - 1)) * 2 - 1;
          const ny = (y / (size - 1)) * 2 - 1;
          const r = Math.hypot(nx, ny);
          let depth = 0;
          if (r <= 1) {
            const dome = Math.sqrt(Math.max(0, 1 - r * r * 0.85)) * 0.65;
            const rim = Math.exp(-Math.pow((r - 0.88) / 0.075, 2)) * 0.35;
            const bevel = Math.min(1, Math.max(0, (1 - r) / 0.08));
            depth = (dome + rim) * bevel;
          }
          const v = Math.max(0, Math.min(255, Math.round(depth * 255)));
          const i = (y * size + x) * 4;
          pixels[i] = v;
          pixels[i + 1] = v;
          pixels[i + 2] = v;
          pixels[i + 3] = 255;
        }
      }
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        size,
        size,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };

    const compileShader = (gl: WebGL2RenderingContext, type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) throw new Error('Shader creation failed');
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s) || 'Shader compile error');
      }
      return s;
    };

    let cancelled = false;

    const initGL = async () => {
      try {
        const gl = canvas.getContext('webgl2', {
          antialias: true,
          premultipliedAlpha: true,
          alpha: true,
        });
        if (!gl || cancelled) return;

        const prog = gl.createProgram();
        if (!prog) return;
        gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VS));
        gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const U: Record<string, WebGLUniformLocation | null> = {};
        for (const n of [
          'uDepth',
          'uA',
          'uB',
          'uMix',
          'uYaw',
          'uRoll',
          'uScale',
          'uMirror',
          'uSquash',
          'uDz',
          'uCam',
          'uAsp',
          'uC',
          'uK',
          'uSweep',
          'uRim',
          'uAlpha',
        ]) {
          U[n] = gl.getUniformLocation(prog, n);
        }

        const NX = 150;
        const NY = 90;
        const uv: number[] = [];
        const idx: number[] = [];
        for (let y = 0; y <= NY; y++) {
          for (let x = 0; x <= NX; x++) uv.push(x / NX, y / NY);
        }
        for (let y = 0; y < NY; y++) {
          for (let x = 0; x < NX; x++) {
            const i = y * (NX + 1) + x;
            idx.push(i, i + 1, i + NX + 1, i + 1, i + NX + 2, i + NX + 1);
          }
        }

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'aUv');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const ib = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

        const logoCanvas = await loadSvgCanvas(BRAND_LOGOS.emblem3d);
        if (cancelled) return;

        const dTex = createLogoDepthTexture(gl, 2);
        const uTex = uploadCanvas(gl, logoCanvas, 0);
        if (!dTex || !uTex) return;

        glBox.gl = gl;
        glBox.prog = prog;
        glBox.U = U;
        glBox.nIdx = idx.length;
        glBox.tex.depth = dTex;
        glBox.tex.uruguay = uTex;

        gl.uniform1i(U.uDepth, 2);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, canvas.width, canvas.height);

        S.texA = uTex;
        S.texB = uTex;
        glBox.ready = true;
        S.dirty = true;
        requestAnimationFrame(() => {
          if (!cancelled) setGlOn(true);
        });
      } catch {
        glBox.gl = null;
      }
    };

    const drawGL = () => {
      const { gl, prog, U, nIdx, tex, ready, layout } = glBox;
      if (!gl || !prog || !ready || !S.texA || !S.texB || !tex.depth) return;

      const f = wrap180(S.theta * 2) / 2;
      const half = Math.floor((S.theta + 90) / 180);
      const mirror = ((half % 2) + 2) % 2;
      const af = Math.abs(f);
      const yaw = Math.max(-32, Math.min(32, f * 0.8 + S.extraYaw));
      const dip = Math.min(1, Math.max(0, (af - 64) / 20));
      const alpha = 1 - dip * dip * (3 - 2 * dip);
      const cf = Math.abs(Math.cos(Math.min(af, 64) * RAD));
      const squash = Math.max(0.35, 0.55 + 0.45 * cf);

      shadow.style.transform = `scaleX(${(0.6 + 0.4 * cf).toFixed(3)})`;
      shadow.style.opacity = alpha.toFixed(3);

      const W = canvas.clientWidth || 1;
      const H = canvas.clientHeight || 1;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, S.texA);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, S.texB);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, tex.depth);

      gl.uniform1i(U.uA, 0);
      gl.uniform1i(U.uB, 1);
      gl.uniform1f(U.uMix, S.mix);
      gl.uniform1f(U.uYaw, yaw * RAD);
      gl.uniform1f(U.uRoll, (-2 + S.roll) * RAD);
      gl.uniform1f(U.uScale, S.extraScale * (0.9 + 0.1 * alpha));
      gl.uniform1f(U.uAlpha, alpha);
      gl.uniform1f(U.uMirror, mirror);
      gl.uniform1f(U.uSquash, squash);
      gl.uniform1f(U.uDz, 0.22);
      gl.uniform1f(U.uCam, 2.4);
      gl.uniform1f(U.uAsp, 1);
      gl.uniform2f(U.uC, (layout.cx / W) * 2 - 1, 1 - (layout.cy / H) * 2);
      gl.uniform2f(
        U.uK,
        (layout.sw * 0.72) / (W / 2),
        (layout.sw * 0.72) / (H / 2)
      );
      gl.uniform1f(U.uSweep, 0.5 + 0.9 * Math.sin((S.theta + S.extraYaw * 3) * RAD));
      gl.uniform1f(
        U.uRim,
        0.35 + 0.4 * Math.abs(Math.sin(yaw * RAD * 2)) + S.extraYaw / 60
      );
      gl.useProgram(prog);
      gl.drawElements(gl.TRIANGLES, nIdx, gl.UNSIGNED_SHORT, 0);
    };

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
        if (glBox.gl) drawGL();
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

    const idleWin = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof idleWin.requestIdleCallback === 'function') {
      idleWin.requestIdleCallback(() => void initGL(), { timeout: 1200 });
    } else {
      setTimeout(() => void initGL(), 300);
    }

    rafId = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
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
