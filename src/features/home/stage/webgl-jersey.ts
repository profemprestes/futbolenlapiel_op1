import { renderCamisetaCanvas } from '@/lib/camiseta-assets';
import { BRAND_LOGOS } from '@/lib/config/brand';
import type { ModeloId } from '@/lib/data/modelos';
import { FS, RAD, VS, wrap180 } from './shaders';

export interface StageLayout {
  cx: number;
  cy: number;
  sw: number;
  sh: number;
}

export interface JerseyRenderState {
  theta: number;
  roll: number;
  extraYaw: number;
  extraScale: number;
  mix: number;
}

export interface JerseyWebGLContext {
  gl: WebGL2RenderingContext | null;
  prog: WebGLProgram | null;
  vao: WebGLVertexArrayObject | null;
  vbo: WebGLBuffer | null;
  ibo: WebGLBuffer | null;
  U: Record<string, WebGLUniformLocation | null>;
  nIdx: number;
  tex: Partial<Record<ModeloId | 'depth', WebGLTexture>>;
  texA: WebGLTexture | null;
  texB: WebGLTexture | null;
  ready: boolean;
  layout: StageLayout;
}

export function createInitialGLContext(): JerseyWebGLContext {
  return {
    gl: null,
    prog: null,
    vao: null,
    vbo: null,
    ibo: null,
    U: {},
    nIdx: 0,
    tex: {},
    texA: null,
    texB: null,
    ready: false,
    layout: { cx: 0, cy: 0, sw: 1, sh: 1 },
  };
}

function loadSvgCanvas(url: string): Promise<HTMLCanvasElement> {
  return new Promise<HTMLCanvasElement>((res, rej) => {
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
}

function uploadCanvas(
  gl: WebGL2RenderingContext,
  source: HTMLCanvasElement,
  unit: number
): WebGLTexture | null {
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
}

function createLogoDepthTexture(gl: WebGL2RenderingContext, unit: number): WebGLTexture | null {
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
}

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw new Error('Shader creation failed');
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) || 'Shader compile error');
  }
  return s;
}

const UNIFORM_NAMES = [
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
] as const;

export async function initJerseyWebGL(
  canvas: HTMLCanvasElement,
  glBox: JerseyWebGLContext,
  isCancelled: () => boolean,
  onReady: () => void
): Promise<void> {
  try {
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      premultipliedAlpha: true,
      alpha: true,
    });
    if (!gl || isCancelled()) return;

    const prog = gl.createProgram();
    if (!prog) return;
    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(prog);

    const U: Record<string, WebGLUniformLocation | null> = {};
    for (const n of UNIFORM_NAMES) {
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
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aUv');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

    const logoCanvas = await loadSvgCanvas(BRAND_LOGOS.emblem3d);
    if (isCancelled()) return;

    const dTex = createLogoDepthTexture(gl, 2);
    const uTex = uploadCanvas(gl, logoCanvas, 0);
    if (!dTex || !uTex) return;

    glBox.gl = gl;
    glBox.prog = prog;
    glBox.vao = vao;
    glBox.vbo = vbo;
    glBox.ibo = ibo;
    glBox.U = U;
    glBox.nIdx = idx.length;
    glBox.tex.depth = dTex;

    gl.uniform1i(U.uDepth, 2);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);

    glBox.texA = uTex;
    glBox.texB = uTex;
    glBox.ready = true;
    onReady();
  } catch {
    glBox.gl = null;
  }
}

function createSquareJerseyCanvas(modelo: ModeloId): HTMLCanvasElement | null {
  const jersey = renderCamisetaCanvas(modelo);
  if (!jersey) return null;
  const size = 1024;
  const sq = document.createElement('canvas');
  sq.width = size;
  sq.height = size;
  const ctx = sq.getContext('2d');
  if (!ctx) return null;
  const drawW = size * 0.96;
  const drawH = (drawW * jersey.height) / jersey.width;
  ctx.drawImage(jersey, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);
  return sq;
}

export function setJerseyModeloTexture(
  glBox: JerseyWebGLContext,
  modelo: ModeloId
): boolean {
  const { gl, ready } = glBox;
  if (!gl || !ready) return false;
  let nextTex = glBox.tex[modelo] ?? null;
  if (!nextTex) {
    const sq = createSquareJerseyCanvas(modelo);
    if (!sq) return false;
    nextTex = uploadCanvas(gl, sq, 1);
    if (!nextTex) return false;
    glBox.tex[modelo] = nextTex;
  }
  glBox.texA = glBox.texB ?? nextTex;
  glBox.texB = nextTex;
  return true;
}

export function drawJerseyWebGL(
  canvas: HTMLCanvasElement,
  shadow: HTMLDivElement,
  glBox: JerseyWebGLContext,
  state: JerseyRenderState
): void {
  const { gl, prog, U, nIdx, tex, ready, layout, texA, texB } = glBox;
  if (!gl || !prog || !ready || !texA || !texB || !tex.depth) return;

  const f = wrap180(state.theta * 2) / 2;
  const half = Math.floor((state.theta + 90) / 180);
  const mirror = ((half % 2) + 2) % 2;
  const af = Math.abs(f);
  const yaw = Math.max(-32, Math.min(32, f * 0.8 + state.extraYaw));
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
  gl.bindTexture(gl.TEXTURE_2D, texA);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texB);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, tex.depth);

  gl.uniform1i(U.uA, 0);
  gl.uniform1i(U.uB, 1);
  gl.uniform1f(U.uMix, state.mix);
  gl.uniform1f(U.uYaw, yaw * RAD);
  gl.uniform1f(U.uRoll, (-2 + state.roll) * RAD);
  gl.uniform1f(U.uScale, state.extraScale * (0.9 + 0.1 * alpha));
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
  gl.uniform1f(U.uSweep, 0.5 + 0.9 * Math.sin((state.theta + state.extraYaw * 3) * RAD));
  gl.uniform1f(
    U.uRim,
    0.35 + 0.4 * Math.abs(Math.sin(yaw * RAD * 2)) + state.extraYaw / 60
  );
  gl.useProgram(prog);
  gl.drawElements(gl.TRIANGLES, nIdx, gl.UNSIGNED_SHORT, 0);
}

export function disposeJerseyWebGL(glBox: JerseyWebGLContext): void {
  const { gl, prog, vao, vbo, ibo, tex } = glBox;
  if (!gl) return;
  Object.values(tex).forEach((t) => {
    if (t) gl.deleteTexture(t);
  });
  if (vbo) gl.deleteBuffer(vbo);
  if (ibo) gl.deleteBuffer(ibo);
  if (vao) gl.deleteVertexArray(vao);
  if (prog) gl.deleteProgram(prog);
  glBox.gl = null;
  glBox.prog = null;
  glBox.ready = false;
}
