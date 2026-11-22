export const WORDS = 'LA PASIÓN SE LLEVA PUESTA.'.split('');
export const STEP = 9.2;
export const RESTS = [-22, 0, 22];
export const RAD = Math.PI / 180;

export const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

export function restFor(theta: number): number {
  const f = wrap180(theta * 2) / 2;
  const r = RESTS.reduce((a, x) => (Math.abs(x - f) < Math.abs(a - f) ? x : a));
  return theta - f + r;
}

export function nextRest(theta: number, dir: number): number {
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

export const VS = `#version 300 es
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

export const FS = `#version 300 es
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
