/* ==========================================================================
   PROCEDURAL STUDIO SNEAKER & DEPTH MAP GENERATOR
   Synthesizes high-res 1200x713 cutout WebP/PNG data URLs for Midnight,
   Ember, and Chalk colorways + a matching 3D volume depth map so WebGL2
   and fallback images work self-contained without external file dependencies.
   ========================================================================== */
(function () {
  const PALETTES = {
    midnight: {
      upperMain: "#14224A",
      upperHi: "#28407E",
      upperLo: "#09112A",
      suede: "#1C2E62",
      lining: "#E6E9F5",
      soleTop: "#F6F3EA",
      soleBottom: "#DFD9C8",
      stitch: "#3E589C",
      accent: "#FF5A1F"
    },
    ember: {
      upperMain: "#E84917",
      upperHi: "#FF713E",
      upperLo: "#9E2806",
      suede: "#C9380B",
      lining: "#F7EFEA",
      soleTop: "#F6F3EA",
      soleBottom: "#DFD9C8",
      stitch: "#FFB092",
      accent: "#14224A"
    },
    chalk: {
      upperMain: "#D8DCE8",
      upperHi: "#F2F5FC",
      upperLo: "#9BA3B8",
      suede: "#C2C8D8",
      lining: "#FFFFFF",
      soleTop: "#F7F4EC",
      soleBottom: "#DED8C8",
      stitch: "#FFFFFF",
      accent: "#FF5A1F"
    }
  };

  function traceUpperSilhouette(ctx) {
    ctx.beginPath();
    ctx.moveTo(145, 480);
    ctx.bezierCurveTo(122, 390, 140, 275, 195, 212);
    ctx.bezierCurveTo(235, 205, 278, 255, 345, 268);
    ctx.bezierCurveTo(405, 276, 445, 222, 495, 168);
    ctx.bezierCurveTo(530, 142, 575, 152, 608, 192);
    ctx.bezierCurveTo(695, 265, 795, 322, 912, 348);
    ctx.bezierCurveTo(1015, 368, 1072, 412, 1068, 478);
    ctx.lineTo(145, 480);
    ctx.closePath();
  }

  function traceCupsole(ctx) {
    ctx.beginPath();
    ctx.moveTo(132, 474);
    ctx.bezierCurveTo(420, 480, 760, 480, 1075, 472);
    ctx.bezierCurveTo(1088, 512, 1076, 558, 1035, 574);
    ctx.bezierCurveTo(750, 592, 410, 590, 152, 572);
    ctx.bezierCurveTo(124, 556, 122, 512, 132, 474);
    ctx.closePath();
  }

  function renderSneakerDataURL(cw) {
    const p = PALETTES[cw] || PALETTES.midnight;
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 713;
    const ctx = c.getContext("2d");

    ctx.save();
    ctx.translate(0, 10);

    // 1. Soft leather lining peeking at collar
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(205, 218);
    ctx.bezierCurveTo(260, 192, 390, 215, 505, 165);
    ctx.lineTo(525, 245);
    ctx.lineTo(205, 265);
    ctx.closePath();
    ctx.fillStyle = p.lining;
    ctx.fill();
    ctx.restore();

    // 2. Main Pebbled Leather Upper
    ctx.save();
    traceUpperSilhouette(ctx);
    const upGrad = ctx.createLinearGradient(200, 160, 950, 520);
    upGrad.addColorStop(0, p.upperHi);
    upGrad.addColorStop(0.48, p.upperMain);
    upGrad.addColorStop(1, p.upperLo);
    ctx.fillStyle = upGrad;
    ctx.fill();
    ctx.clip();

    // Procedural pebbled leather grain inside upper
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i < 1600; i++) {
      const gx = 120 + ((i * 73) % 960);
      const gy = 150 + ((i * 47 + Math.floor(i / 14) * 19) % 350);
      const r = 1.4 + (i % 3) * 0.65;
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Quarter panel overlay
    ctx.beginPath();
    ctx.moveTo(295, 480);
    ctx.bezierCurveTo(335, 360, 445, 265, 575, 225);
    ctx.bezierCurveTo(685, 290, 745, 365, 765, 480);
    ctx.closePath();
    const qGrad = ctx.createLinearGradient(300, 230, 760, 480);
    qGrad.addColorStop(0, p.upperHi);
    qGrad.addColorStop(1, p.upperMain);
    ctx.fillStyle = qGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0,0,0,0.28)";
    ctx.stroke();

    // Double stitch along quarter panel
    ctx.save();
    ctx.setLineDash([7, 5]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = p.stitch;
    ctx.stroke();
    ctx.restore();

    // Heel wrap overlay
    ctx.beginPath();
    ctx.moveTo(135, 480);
    ctx.bezierCurveTo(135, 360, 175, 265, 235, 225);
    ctx.bezierCurveTo(295, 285, 335, 375, 328, 480);
    ctx.closePath();
    ctx.fillStyle = p.suede;
    ctx.fill();
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = p.stitch;
    ctx.stroke();
    ctx.restore();

    // Mudguard / Toe cap overlay
    ctx.beginPath();
    ctx.moveTo(725, 480);
    ctx.bezierCurveTo(748, 392, 835, 345, 935, 352);
    ctx.bezierCurveTo(1035, 365, 1075, 415, 1070, 480);
    ctx.closePath();
    ctx.fillStyle = p.suede;
    ctx.fill();
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = p.stitch;
    ctx.stroke();
    ctx.restore();

    // Subtle numbered stamp on ankle ("CL·014/312")
    ctx.save();
    ctx.translate(255, 355);
    ctx.rotate(-0.08);
    ctx.fillStyle = "rgba(255,255,255,0.48)";
    ctx.font = "700 15px 'JetBrains Mono', monospace";
    ctx.fillText("CL·014/312", 0, 0);
    ctx.restore();

    // Crisp White Cotton Laces
    for (let l = 0; l < 6; l++) {
      const lx = 558 + l * 42;
      const ly = 212 + l * 21;
      ctx.beginPath();
      ctx.arc(lx - 8, ly + 18, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(lx - 10, ly + 18);
      ctx.quadraticCurveTo(lx + 14, ly - 10, lx + 30, ly - 16);
      ctx.lineWidth = 13;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#F7F8FC";
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(10,16,51,0.2)";
      ctx.stroke();
      ctx.restore();
    }

    // Specular studio highlight along upper ridge
    const specGrad = ctx.createRadialGradient(640, 290, 20, 640, 290, 340);
    specGrad.addColorStop(0, "rgba(255,255,255,0.22)");
    specGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = specGrad;
    ctx.fillRect(120, 140, 960, 360);

    ctx.restore(); // end upper clip

    // 3. Stitched 34mm Cream Cupsole
    ctx.save();
    traceCupsole(ctx);
    const soleGrad = ctx.createLinearGradient(130, 474, 130, 588);
    soleGrad.addColorStop(0, p.soleTop);
    soleGrad.addColorStop(0.65, "#EDE7D8");
    soleGrad.addColorStop(1, p.soleBottom);
    ctx.fillStyle = soleGrad;
    ctx.fill();
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(135, 502);
    ctx.bezierCurveTo(420, 510, 760, 510, 1072, 498);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(10,16,51,0.16)";
    ctx.stroke();

    ctx.save();
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(140, 492);
    ctx.bezierCurveTo(420, 500, 760, 500, 1068, 488);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FAF8F2";
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "rgba(10,16,51,0.12)";
    for (let x = 165; x < 1030; x += 22) {
      ctx.fillRect(x, 562, 11, 18);
    }

    ctx.fillStyle = p.accent;
    ctx.fillRect(132, 512, 26, 12);

    ctx.restore();
    ctx.restore();
    return c.toDataURL("image/png");
  }

  function renderDepthDataURL() {
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 356;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.save();
    ctx.scale(0.5, 0.5);
    ctx.translate(0, 10);

    traceUpperSilhouette(ctx);
    const dGrad = ctx.createRadialGradient(590, 380, 40, 590, 380, 480);
    dGrad.addColorStop(0, "#FFFFFF");
    dGrad.addColorStop(0.55, "#B8B8B8");
    dGrad.addColorStop(1, "#383838");
    ctx.fillStyle = dGrad;
    ctx.fill();

    traceCupsole(ctx);
    const sGrad = ctx.createLinearGradient(130, 520, 1075, 520);
    sGrad.addColorStop(0, "#666666");
    sGrad.addColorStop(0.5, "#DCDCDC");
    sGrad.addColorStop(1, "#777777");
    ctx.fillStyle = sGrad;
    ctx.fill();

    ctx.restore();
    return c.toDataURL("image/png");
  }

  const GENERATED_ASSETS = {
    midnight: "https://animatedwebs.com/demos/courtline-sneaker-drops-chicago/assets/subject-midnight-1200.webp",
    ember: "https://animatedwebs.com/demos/courtline-sneaker-drops-chicago/assets/subject-ember-1200.webp",
    chalk: "https://animatedwebs.com/demos/courtline-sneaker-drops-chicago/assets/subject-chalk-1200.webp",
    depth: "https://animatedwebs.com/demos/courtline-sneaker-drops-chicago/assets/depth.png"
  };

  window.COURTLINE_ASSETS = GENERATED_ASSETS;

  const poster = document.querySelector(".stage .poster");
  if (poster) {
    poster.src = GENERATED_ASSETS.midnight;
    poster.addEventListener("error", () => {
      poster.src = renderSneakerDataURL("midnight");
    }, { once: true });
  }
  document.querySelectorAll("[data-cw-img]").forEach((img) => {
    const cw = img.getAttribute("data-cw-img");
    if (GENERATED_ASSETS[cw]) {
      img.src = GENERATED_ASSETS[cw];
      img.addEventListener("error", () => {
        img.src = renderSneakerDataURL(cw);
      }, { once: true });
    }
  });
  window.COURTLINE_FALLBACK = {
    sneaker: renderSneakerDataURL,
    depth: renderDepthDataURL
  };
})();

/* ==========================================================================
   Stage: the 3D type ring and WebGL2 depth-mapped sneaker share one angle
   ========================================================================== */
(function () {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = document.querySelector(".stage");
  const shoeEl = stage.querySelector(".shoe");
  const shadow = stage.querySelector(".shadow");
  const canvas = stage.querySelector(".gl");
  const front = stage.querySelector(".ring-front .ring-tilt");
  const back = stage.querySelector(".ring-back .ring-tilt");

  const SIZES = ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13"];
  const WORDS = "LACE. LINE. LEAVE.".split("");
  const STEP = 11.6;
  const glyphs = [];

  WORDS.forEach((ch, i) => glyphs.push({ ch, a: (i - 8) * STEP, sz: false }));
  SIZES.forEach((s, j) => glyphs.push({ ch: s, a: 180 + (j - 6) * 12.2, sz: true, size: s }));
  for (const g of glyphs) {
    for (const [layer, key] of [[front, "f"], [back, "b"]]) {
      const el = document.createElement("span");
      el.className = "g" + (g.sz ? " sz" : "");
      el.textContent = g.ch === " " ? "" : g.ch;
      layer.appendChild(el);
      g[key] = el;
    }
  }

  const S = {
    theta: 0, vel: 0, drag: false, last: performance.now(), target: null, sv: 0, lockUntil: 0,
    paused: false, roll: 0, extraYaw: 0, extraScale: 1, ringFade: 1, ringGrow: 1, active: true,
    size: null, R: 400, mix: 1, cw: "midnight", ringOff: 0, ringTarget: null, rv: 0, sizeLock: false, swayT: 0, swayAmp: 0, swayBase: 0,
  };
  window.CL = { S, SIZES, RM };

  const wrap180 = (d) => ((((d + 180) % 360) + 360) % 360) - 180;
  const rad = Math.PI / 180;
  let layout = { cx: 0, cy: 0, sw: 1, sh: 1 };

  function measure() {
    const vw = innerWidth, vh = innerHeight, phone = vw <= 760;
    S.R = phone ? vw * 0.55 : Math.min(vw * 0.36, vh * 0.62);
    stage.style.setProperty("--r", S.R + "px");
    stage.style.setProperty("--gs", (phone ? vw * 0.13 : Math.min(vw * 0.092, vh * 0.15)) + "px");
    stage.style.setProperty("--persp", (phone ? 820 : 1700) + "px");
    const sw = shoeEl.offsetWidth, sh = (sw * 713) / 1200;
    layout = { cx: shoeEl.offsetLeft + sw / 2, cy: shoeEl.offsetTop + sh / 2, sw, sh };
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    S.dirty = true;
  }

  /* ---------- ring ---------- */
  function drawRing() {
    const R = S.R * S.ringGrow;
    const ai = S.size ? SIZES.indexOf(S.size) : -9;
    for (const g of glyphs) {
      const w = g.a + S.theta + S.ringOff;
      const c = Math.cos(w * rad);
      const x = R * Math.sin(w * rad), z = R * c;
      const on = g.sz && g.size === S.size;
      const near = g.sz && ai >= 0 && Math.abs(SIZES.indexOf(g.size) - ai) === 1;
      const edge = Math.min(1, Math.max(0, (Math.abs(c) - 0.06) / 0.3));
      const fo = c > 0 ? +(S.ringFade * edge * (near ? 0.07 : 1)).toFixed(3) : 0;
      const bo = c <= 0 ? +((g.sz ? 0.16 : 0.05) * S.ringFade * edge).toFixed(3) : 0;
      const pos = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) `;
      if (fo > 0 || g.lf !== 0) g.f.style.transform = pos + `rotateY(${w.toFixed(2)}deg) scale(${on ? 1.35 : 1})`;
      if (bo > 0 || g.lb !== 0) g.b.style.transform = pos + `rotateY(${(w + 180).toFixed(2)}deg)`;
      if (fo !== g.lf) { g.f.style.opacity = fo; g.lf = fo; }
      if (bo !== g.lb) { g.b.style.opacity = bo; g.lb = bo; }
    }
  }

  function markSize(s) {
    S.size = s;
    for (const g of glyphs) if (g.sz) { g.f.classList.toggle("on", g.size === s); g.b.classList.toggle("on", g.size === s); }
    const g = glyphs.find((x) => x.sz && x.size === s);
    S.sizeLock = true; S.swayAmp = 0;
    if (!RM) {
      S.ringTarget = S.ringOff + wrap180(-(g.a + S.theta + S.ringOff)); S.vel = 0;
      S.target = restFor(S.theta);
    } else { S.ringOff += wrap180(-(g.a + S.theta + S.ringOff)); }
    S.dirty = true;
  }
  window.CL.markSize = markSize;

  const RESTS = [-22, 0, 22];
  function restFor(theta) {
    const f = wrap180(theta * 2) / 2;
    const r = RESTS.reduce((a, x) => (Math.abs(x - f) < Math.abs(a - f) ? x : a));
    return theta - f + r;
  }
  function nextRest(theta, dir) {
    const all = [];
    const base = Math.floor(theta / 180) * 180;
    for (let k = -1; k <= 2; k++) for (const r of RESTS) all.push(base + k * 180 + r);
    all.sort((a, b) => a - b);
    return dir > 0 ? all.find((x) => x > theta + 1) : all.reverse().find((x) => x < theta - 1);
  }

  /* ---------- WebGL depth turn ---------- */
  let gl = null, prog, U = {}, nIdx = 0, tex = {}, ready = false;
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
    vec3 rgb = c.rgb * (.8 + .32 * key) + vec3(.56, .64, 1.) * rim * c.a + vec3(sweep) * c.a;
    o = vec4(rgb, c.a) * uAlpha;
  }`;

  function sh(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function loadImg(src, fallbackFn) {
    return new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => {
        if (fallbackFn) {
          const fb = new Image();
          fb.onload = () => res(fb);
          fb.onerror = rej;
          fb.src = fallbackFn();
        } else {
          rej(new Error("Image load failed"));
        }
      };
      i.src = src;
    });
  }
  function upload(img, unit) {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  const srcFor = (cw) => window.COURTLINE_ASSETS[cw] || window.COURTLINE_ASSETS.midnight;

  async function initGL() {
    try {
      gl = canvas.getContext("webgl2", { antialias: true, premultipliedAlpha: true, alpha: true });
      if (!gl) return;
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      for (const n of ["uDepth", "uA", "uB", "uMix", "uYaw", "uRoll", "uScale", "uMirror", "uSquash", "uDz", "uCam", "uAsp", "uC", "uK", "uSweep", "uRim", "uAlpha"]) U[n] = gl.getUniformLocation(prog, n);
      const NX = 150, NY = 90, uv = [], idx = [];
      for (let y = 0; y <= NY; y++) for (let x = 0; x <= NX; x++) uv.push(x / NX, y / NY);
      for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
        const i = y * (NX + 1) + x;
        idx.push(i, i + 1, i + NX + 1, i + 1, i + NX + 2, i + NX + 1);
      }
      nIdx = idx.length;
      const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aUv"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
      const [dImg, aImg] = await Promise.all([
        loadImg(window.COURTLINE_ASSETS.depth, () => window.COURTLINE_FALLBACK.depth()),
        loadImg(srcFor("midnight"), () => window.COURTLINE_FALLBACK.sneaker("midnight"))
      ]);
      tex.depth = upload(dImg, 2);
      tex.midnight = upload(aImg, 0);
      gl.uniform1i(U.uDepth, 2);
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.viewport(0, 0, canvas.width, canvas.height);
      S.texA = tex.midnight; S.texB = tex.midnight;
      ready = true; S.dirty = true;
      requestAnimationFrame(() => document.documentElement.classList.add("gl-on"));
    } catch (e) {
      gl = null;
    }
  }

  async function setColorway(cw) {
    if (cw === S.cw) return;
    S.cw = cw;
    const img = stage.querySelector(".poster");
    img.src = srcFor(cw);
    if (!gl) return;
    try {
      if (!tex[cw]) tex[cw] = upload(await loadImg(srcFor(cw), () => window.COURTLINE_FALLBACK.sneaker(cw)), 1);
      S.texA = S.texB;
      S.texB = tex[cw]; S.mix = RM ? 1 : 0; S.dirty = true;
    } catch (e) { /* keep current texture */ }
  }
  window.CL.setColorway = setColorway;

  function drawGL() {
    if (!ready) return;
    const f = wrap180(S.theta * 2) / 2;
    const half = Math.floor((S.theta + 90) / 180);
    const mirror = ((half % 2) + 2) % 2;
    const af = Math.abs(f);
    const yaw = Math.max(-32, Math.min(32, f * 0.8 + S.extraYaw));
    const dip = Math.min(1, Math.max(0, (af - 64) / 20));
    const alpha = 1 - dip * dip * (3 - 2 * dip);
    const cf = Math.abs(Math.cos(Math.min(af, 64) * rad));
    const squash = Math.max(0.35, 0.55 + 0.45 * cf);
    shadow.style.transform = `scaleX(${(0.6 + 0.4 * cf).toFixed(3)})`;
    shadow.style.opacity = alpha.toFixed(3);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, S.texA);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, S.texB);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, tex.depth);
    gl.uniform1i(U.uA, 0); gl.uniform1i(U.uB, 1);
    gl.uniform1f(U.uMix, S.mix);
    gl.uniform1f(U.uYaw, yaw * rad);
    gl.uniform1f(U.uRoll, (-3 + S.roll) * rad);
    gl.uniform1f(U.uScale, S.extraScale * (0.9 + 0.1 * alpha));
    gl.uniform1f(U.uAlpha, alpha);
    gl.uniform1f(U.uMirror, mirror);
    gl.uniform1f(U.uSquash, squash);
    gl.uniform1f(U.uDz, 0.16);
    gl.uniform1f(U.uCam, 2.4);
    gl.uniform1f(U.uAsp, 713 / 1200);
    gl.uniform2f(U.uC, (layout.cx / W) * 2 - 1, 1 - (layout.cy / H) * 2);
    gl.uniform2f(U.uK, layout.sw / (W / 2), layout.sw / (H / 2));
    gl.uniform1f(U.uSweep, 0.5 + 0.9 * Math.sin((S.theta + S.extraYaw * 3) * rad));
    gl.uniform1f(U.uRim, 0.35 + 0.4 * Math.abs(Math.sin(yaw * rad * 2)) + S.extraYaw / 60);
    gl.useProgram(prog);
    gl.drawElements(gl.TRIANGLES, nIdx, gl.UNSIGNED_SHORT, 0);
  }

  /* ---------- input ---------- */
  const zone = document.querySelector(".drag-zone");
  let px = 0, lastMove = 0, startX = 0, startY = 0, decided = false;
  zone.addEventListener("pointerdown", (e) => {
    if (RM) return;
    S.drag = true; decided = e.pointerType === "mouse"; px = startX = e.clientX; startY = e.clientY;
    S.target = null; S.vel = 0; S.last = performance.now(); S.swayAmp = 0; S.sizeLock = false;
    if (decided) {
      zone.setPointerCapture(e.pointerId);
      document.documentElement.classList.add("is-dragging");
    }
  });
  zone.addEventListener("pointermove", (e) => {
    if (!S.drag) return;
    if (!decided) {
      if (Math.abs(e.clientX - startX) < 8 && Math.abs(e.clientY - startY) < 8) return;
      if (Math.abs(e.clientY - startY) > Math.abs(e.clientX - startX)) { S.drag = false; return; }
      decided = true;
      document.documentElement.classList.add("is-dragging");
      try { zone.setPointerCapture(e.pointerId); } catch (_) {}
    }
    const dx = e.clientX - px; px = e.clientX;
    const d = dx * (innerWidth <= 760 ? 0.55 : 0.32);
    S.theta += d; S.vel = S.vel * 0.5 + d * 0.5; lastMove = performance.now();
    S.last = lastMove; S.dirty = true;
  });
  const end = () => {
    document.documentElement.classList.remove("is-dragging");
    if (!S.drag) return;
    S.drag = false; S.last = performance.now(); restDone = false;
    if (performance.now() - lastMove > 90) S.vel = 0;
  };
  zone.addEventListener("pointerup", end);
  zone.addEventListener("pointercancel", end);
  zone.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const base = S.target ?? S.theta;
    S.target = nextRest(base, e.key === "ArrowRight" ? 1 : -1); S.swayAmp = 0;
    if (RM) { S.theta = S.target; S.target = null; }
    S.last = performance.now(); S.dirty = true;
  });

  /* ---------- loop ---------- */
  let prev = performance.now(), restDone = true, settled = true;
  function step(now) {
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    const before = S.theta;
    if (!S.drag && !RM && S.active) {
      if (S.target !== null) {
        S.sv += ((S.target - S.theta) * 120 - S.sv * 14.7) * dt;
        S.theta += S.sv * dt;
        if (Math.abs(S.target - S.theta) < 0.05 && Math.abs(S.sv) < 0.5) { S.theta = S.target; S.target = null; S.sv = 0; }
      } else if (Math.abs(S.vel) > 0.2) {
        S.theta += S.vel; S.vel *= Math.pow(0.92, dt * 60); restDone = false;
      } else if (!restDone) {
        S.vel = 0; restDone = true;
        S.target = restFor(S.theta);
      } else if (!S.paused && !S.sizeLock && now - S.last > 2500) {
        if (S.swayAmp === 0) { S.swayBase = restFor(S.theta); S.swayT = 0; }
        S.swayAmp = Math.min(1, S.swayAmp + dt / 3);
        S.swayT += dt;
        S.theta = S.swayBase + 14 * S.swayAmp * Math.sin(S.swayT / 2.4);
      }
      if (S.ringTarget !== null) {
        S.rv += ((S.ringTarget - S.ringOff) * 120 - S.rv * 14.7) * dt;
        S.ringOff += S.rv * dt;
        if (Math.abs(S.ringTarget - S.ringOff) < 0.05 && Math.abs(S.rv) < 0.5) { S.ringOff = S.ringTarget; S.ringTarget = null; S.rv = 0; }
        S.dirty = true;
      }
    }
    const targetRoll = RM ? 0 : Math.max(-4, Math.min(4, S.vel * 0.8));
    S.roll += (targetRoll - S.roll) * Math.min(1, dt * 8);
    if (S.mix < 1) { S.mix = Math.min(1, S.mix + dt / 0.26); S.dirty = true; }
    if (S.theta !== before || Math.abs(S.roll) > 0.01) S.dirty = true;
    if (S.active && S.dirty) {
      drawRing();
      if (gl) drawGL(now);
      S.dirty = false;
      settled = false;
    } else if (!settled && S.target === null && !S.drag) {
      settled = true;
      const deg = ((S.theta % 360) + 360) % 360;
      const f = Math.abs(wrap180(S.theta * 2) / 2);
      const back = Math.abs(wrap180(S.theta)) > 90;
      zone.setAttribute("aria-valuenow", String(Math.round(deg)));
      zone.setAttribute("aria-valuetext", (f < 8 ? "Front" : "Three-quarter") + (back ? " view, other side" : " view"));
    }
    requestAnimationFrame(step);
  }

  measure();
  addEventListener("resize", measure);
  drawRing();
  if ("requestIdleCallback" in window) requestIdleCallback(initGL, { timeout: 1200 }); else setTimeout(initGL, 300);
  requestAnimationFrame(step);
})();

/* ==========================================================================
   Main UI controller: size picker, scroll chapters, countdown, colorways, draw & wordmark
   ========================================================================== */
(function () {
  const { S, SIZES, RM } = window.CL;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;

  /* ---------- size picker ---------- */
  const LEFT = [6, 9, 14, 18, 22, 23, 27, 25, 19, 15, 11, 7, 3];
  const chips = $(".chips");
  const sizeSel = $('select[name="size"]');
  sizeSel.innerHTML = '<option value="">Pick a size</option>' + SIZES.map((s) => `<option value="${s}">US ${s}</option>`).join("");
  SIZES.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip" + (LEFT[i] < 10 ? " low" : "");
    b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
    b.setAttribute("aria-label", `US ${s}, ${LEFT[i]} pairs left`);
    b.textContent = s;
    b.addEventListener("click", () => pickSize(s));
    chips.appendChild(b);
  });
  function pickSize(s) {
    const i = SIZES.indexOf(s);
    $$(".chip", chips).forEach((c, j) => c.setAttribute("aria-checked", String(j === i)));
    $("[data-size-label]").textContent = `US ${s}`;
    $("[data-size-stock]").textContent = LEFT[i] < 10 ? `only ${LEFT[i]} pairs left in this size` : `${LEFT[i]} pairs left in this size`;
    sizeSel.value = s;
    window.CL.markSize(s);
  }
  sizeSel.addEventListener("change", () => sizeSel.value && pickSize(sizeSel.value));

  /* ---------- colorways ---------- */
  const NAMES = { midnight: "Midnight", ember: "Ember", chalk: "Chalk" };
  const cwSel = $('select[name="colorway"]');
  const toast = $(".cw-toast");
  const cwDot = $("[data-cw-dot]");
  function pickColor(cw, announce) {
    $$(".card").forEach((c) => {
      const on = c.dataset.cw === cw;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-checked", String(on));
      $(".card-pick", c).textContent = on ? "On the turntable" : "Put it on the turntable";
    });
    $("[data-cw-label]").textContent = NAMES[cw];
    if (cwDot) cwDot.dataset.cwDot = cw;
    cwSel.value = cw;
    window.CL.setColorway(cw);
    if (announce) {
      toast.innerHTML = `<span>${NAMES[cw]} is on the turntable now.</span> <a href="#lace">See it turn &#8593;</a>`;
      toast.classList.add("is-visible");
    }
  }
  $$(".card").forEach((c) => {
    c.addEventListener("click", () => pickColor(c.dataset.cw, true));
    if (RM) return;
    c.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--ty", ((e.clientX - r.left) / r.width - 0.5) * 12 + "deg");
      c.style.setProperty("--tx", -((e.clientY - r.top) / r.height - 0.5) * 10 + "deg");
    });
    c.addEventListener("pointerleave", () => { c.style.setProperty("--tx", "0deg"); c.style.setProperty("--ty", "0deg"); });
  });
  cwSel.addEventListener("change", () => pickColor(cwSel.value, false));

  /* ---------- countdown to Friday 10:00 AM Central ---------- */
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", hourCycle: "h23" });
  const parts = (d) => Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]));
  const offset = (d) => { const p = parts(d); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(d.getTime() / 1000) * 1000; };
  function nextDraw() {
    const now = new Date(), p = parts(now);
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    let ahead = (5 - wd + 7) % 7;
    if (ahead === 0 && +p.hour >= 10) ahead = 7;
    const wall = Date.UTC(+p.year, +p.month - 1, +p.day + ahead, 10, 0, 0);
    let t = wall - offset(new Date(wall));
    t = wall - offset(new Date(t));
    return t;
  }
  let target = nextDraw();
  const when = new Date(target).toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "long", month: "long", day: "numeric" });
  $("[data-cd-when]").textContent = `The draw closes ${when} at 10:00 AM Central. Winners hear back by 10:15.`;
  const units = $$(".cd [data-u]");
  function tick() {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    if (s === 0) target = nextDraw();
    const v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    for (const el of units) {
      const t = String(v[el.dataset.u]).padStart(2, "0");
      if (el.textContent !== t) {
        el.textContent = t;
        if (!RM && !S.paused) { el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip"); }
      }
    }
  }
  tick(); setInterval(tick, 1000);

  /* ---------- the draw ---------- */
  const form = $("form.draw");
  const zip = $(".zip"), zipIn = $('input[name="zip"]');
  zipIn.disabled = true;
  $$('input[name="fulfil"]').forEach((r) => r.addEventListener("change", () => {
    const ship = form.fulfil.value === "ship";
    zip.hidden = !ship; zipIn.disabled = !ship; zipIn.required = ship;
  }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $(".form-err");
    $$(".bad", form).forEach((x) => x.classList.remove("bad"));
    if (!form.checkValidity()) {
      const bad = $$("input, select", form).filter((x) => !x.disabled && !x.checkValidity());
      bad.forEach((x) => x.classList.add("bad"));
      const f = bad[0];
      err.textContent = f.name === "email" ? "Add an email we can reach you at." : f.name === "size" ? "Pick a size first." : f.name === "agree" ? "Tick the box to accept the draw rules." : f.name === "zip" ? "Add a 5 digit ZIP for shipping." : "Add your full name.";
      form.classList.remove("is-shaking");
      void form.offsetWidth;
      form.classList.add("is-shaking");
      f.focus();
      return;
    }
    err.textContent = "";
    const d = new FormData(form);
    let h = 7; for (const ch of String(d.get("email")).toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    $("[data-ent-name]").textContent = String(d.get("name")).trim().split(/\s+/)[0];
    $("[data-ent-id]").textContent = `CL014-${String(1000 + (h % 9000))}`;
    const how = d.get("fulfil") === "ship" ? `ships to ${d.get("zip")} in 2 days for $12` : "pickup at the West Loop counter";
    $("[data-ent-sum]").textContent = `US ${d.get("size")}, ${NAMES[d.get("colorway")]}, ${how}. If your number comes up you get a 24-hour checkout link for $185. Nothing is charged to enter.`;
    form.hidden = true;
    const ok = $(".entered"); ok.hidden = false; ok.focus();
  });
  $(".again").addEventListener("click", () => { form.reset(); zip.hidden = true; zipIn.disabled = true; $(".entered").hidden = true; form.hidden = false; form.name.focus(); });

  /* ---------- wordmark ---------- */
  const wm = $(".wm-big");
  const letters = "COURTLINE".split("").map((ch, i) => {
    const s = document.createElement("span"); s.textContent = ch; s.setAttribute("aria-hidden", "true");
    s.style.transitionDelay = i * 45 + "ms"; wm.appendChild(s); return s;
  });
  let wmX = null, centers = [];
  const TOUCH = matchMedia("(hover: none)").matches;
  const measureLetters = () => { centers = letters.map((s) => { const r = s.getBoundingClientRect(); return r.left + r.width / 2; }); };
  wm.parentElement.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { wmX = e.clientX; kickWave(); } });
  wm.parentElement.addEventListener("pointerleave", () => (wmX = null));
  if (!RM) {
    letters.forEach((s) => s.style.setProperty("--y", "70%"));
    new IntersectionObserver((es) => es.forEach((en) => letters.forEach((s) => s.style.setProperty("--y", en.isIntersecting ? "0%" : "70%"))), { threshold: 0.25 }).observe(wm);
  }
  const lastW = [];
  function setW(i, w) {
    const cap = i === letters.length - 1 ? 780 : 860;
    w = Math.min(cap, Math.round(w / 50) * 50);
    if (lastW[i] !== w) { letters[i].style.setProperty("--w", w); lastW[i] = w; }
  }
  function weights(now) {
    if (!centers.length) measureLetters();
    const x = wmX ?? innerWidth / 2 + Math.sin(now / 1400) * innerWidth * 0.42;
    letters.forEach((s, i) => setW(i, 250 + 650 * Math.exp(-Math.pow((centers[i] - x) / (innerWidth * 0.12), 2))));
  }
  const still = () => letters.forEach((s, i) => setW(i, 300 + 500 * Math.exp(-Math.pow((i - 4) / 2.6, 2))));
  if (RM || TOUCH) still();

  /* ---------- pause ---------- */
  const pb = $(".tk-motion");
  pb.addEventListener("click", () => {
    S.paused = !S.paused;
    pb.setAttribute("aria-pressed", String(S.paused));
    pb.setAttribute("aria-label", S.paused ? "Resume motion" : "Pause motion");
    $(".txt", pb).textContent = S.paused ? "Play" : "Pause";
    root.classList.toggle("paused", S.paused);
  });

  /* ---------- scroll chapters ---------- */
  const stage = $(".stage"), ticker = $(".ticker"), c1 = $("#shoe"), c2 = $("#color"), c3 = $("#draw"), foot = $("#club");
  const kws = $$("[data-kw]"), heads = $$(".c2-head span"), cards = $$(".card"), sws = $$(".sw");
  const pin = $(".c2-pin"), head = $(".c2-head"), sub = $(".c2-sub"), cardsBox = $(".cards");
  const navLinks = $$(".tk-nav a");
  let footIn = false;

  const docTop = (el) => { let t = 0; while (el) { t += el.offsetTop; el = el.offsetParent; } return t; };
  let M = null;
  function measure() {
    M = {
      maxScroll: Math.max(1, document.documentElement.scrollHeight - innerHeight),
      c1Top: docTop(c1),
      c1End: docTop(c1) + c1.offsetHeight,
      c2: docTop(c2), c2Top: c2.offsetTop,
      kws: kws.map((k) => docTop(k) + k.offsetHeight / 2),
      cardsTop: docTop(cardsBox),
      cards: cards.map((c) => docTop(c)),
      c3: docTop(c3),
      sws: sws.map((x) => docTop(x)),
    };
    centers = [];
  }
  const kwLast = [];

  function onScroll() {
    if (!M) measure();
    const vh = innerHeight, y = scrollY;

    // Ticker scroll progress & active chapter
    if (ticker) {
      ticker.style.setProperty("--scroll-p", clamp(y / M.maxScroll).toFixed(4));
    }
    if (navLinks.length) {
      const activeId = y >= M.c3 - vh * 0.45 ? "#draw" : y >= M.c2 - vh * 0.45 ? "#color" : y >= M.c1Top - vh * 0.45 ? "#shoe" : "#lace";
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === activeId));
    }

    // C0 to C1: the ring flies out, the shoe pushes in and turns a little
    const p1 = clamp(y / Math.max(1, M.c1End - vh));
    const m = RM ? 0 : p1;
    S.extraScale = 1 + 0.35 * m;
    S.extraYaw = 16 * m;
    S.ringFade = 1 - clamp(p1 / 0.32);
    S.ringGrow = 1 + (RM ? 0 : 0.9 * clamp(p1 / 0.32));
    S.dirty = true;
    stage.style.setProperty("--lx", 64 - 30 * m + "%");
    // giant words: weight 200 to 900 as each crosses the middle of the screen
    kws.forEach((k, i) => {
      const d = clamp(Math.abs(M.kws[i] - y - vh / 2) / (vh * 0.55));
      const w = RM ? 800 : Math.round((900 - 700 * d) / 50) * 50;
      if (kwLast[i] === w) return;
      kwLast[i] = w;
      k.style.fontWeight = w;
      k.style.letterSpacing = RM ? "-0.035em" : (-0.035 + 0.06 * (900 - w) / 700).toFixed(3) + "em";
    });
    // C2: the ice field wipes in from the left over the stage
    const prTop = M.c2 - y;
    const pw = RM ? (prTop <= vh * 0.2 ? 1 : 0) : clamp(-prTop / (vh * 0.5) + 0.25);
    pin.style.setProperty("--wipe", (1 - pw) * 100 + "%");
    pin.style.setProperty("--edge", pw > 0 && pw < 1 ? 1 : 0);
    pin.style.setProperty("--subo", clamp(pw * 1.5 - 0.5));
    heads.forEach((h, i) => h.style.setProperty("--hx", RM ? "0" : -(1 - clamp(pw * 1.25 - i * 0.12)) * 75 + "vw"));
    const off = pw >= 1 && prTop < 0;
    stage.classList.toggle("off", off);
    S.active = !off;
    root.classList.toggle("tk-solid", y > M.c2 - vh * 0.4);
    // the headline holds alone, then lifts away as the cards arrive
    const ca = clamp((vh * 0.95 - (M.cardsTop - y)) / (vh * 0.45));
    head.style.opacity = RM ? (ca > 0.5 ? 0 : 1) : (1 - ca).toFixed(3);
    head.style.transform = RM ? "" : `translateY(${(-ca * 14).toFixed(2)}vh)`;
    sub.style.visibility = ca > 0.98 ? "hidden" : "";
    cards.forEach((c, i) => {
      const q = RM ? 1 : clamp((vh - (M.cards[i] - y)) / (vh * 0.55) - i * 0.08);
      c.style.setProperty("--ry", ((1 - q) * 160).toFixed(1) + "px");
      c.style.setProperty("--rx", ((1 - q) * 18).toFixed(2) + "deg");
    });
    // C3: cobalt wipes back over the ice, the three words slide across
    const r3 = M.c3 - y;
    const back = RM ? (r3 < vh * 0.5 ? 100 : 0) : clamp((vh - r3) / (vh * 0.7)) * 100;
    c3.style.setProperty("--back", back + "%");
    c3.style.setProperty("--cedge", back > 0 && back < 100 ? 1 : 0);
    sws.forEach((s, i) => {
      const t = (M.sws[i] - y) / vh - 0.5;
      s.style.setProperty("--sx", RM ? "0" : ((i % 2 ? -1 : 1) * t * 34).toFixed(2) + "vw");
    });
  }

  let ticking = false;
  const loop = () => { onScroll(); ticking = false; };
  const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(loop); } };
  let waving = false;
  const wave = (now) => { if (footIn && !RM && !TOUCH && !S.paused) { weights(now); requestAnimationFrame(wave); } else waving = false; };
  function kickWave() { if (!waving && footIn && !RM && !TOUCH && !S.paused) { waving = true; requestAnimationFrame(wave); } }
  new IntersectionObserver((es) => { footIn = es[0].isIntersecting; if (footIn) { measureLetters(); kickWave(); } }).observe(foot);
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { M = null; kick(); });
  if ("ResizeObserver" in window) new ResizeObserver(() => { M = null; kick(); }).observe(document.body);
  if (document.fonts) document.fonts.ready.then(() => { M = null; kick(); });
  pb.addEventListener("click", () => { kick(); kickWave(); });
  kick();
})();
