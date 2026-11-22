import type { ModeloId } from '@/lib/data/modelos';

const JERSEY_PALETTES: Record<
  ModeloId,
  {
    main: string;
    hi: string;
    lo: string;
    collar: string;
    trim: string;
    crestBg: string;
    crestAccent: string;
    numberText: string;
    tagLabel: string;
    stripeColor?: string;
  }
> = {
  uruguay: {
    main: '#75B2E6',
    hi: '#98CBF5',
    lo: '#4482BA',
    collar: '#0A1B33',
    trim: '#F5EAD6',
    crestBg: '#0A1B33',
    crestAccent: '#F2C94C',
    numberText: '#0A1B33',
    tagLabel: 'URU · 2026',
  },
  retro: {
    main: '#C81D25',
    hi: '#E33941',
    lo: '#820D13',
    collar: '#F5EAD6',
    trim: '#141414',
    crestBg: '#F2C94C',
    crestAccent: '#820D13',
    numberText: '#F5EAD6',
    tagLabel: 'CANTONA · 7',
  },
  club: {
    main: '#B81D24',
    hi: '#D4323A',
    lo: '#7B0E14',
    collar: '#0A1B33',
    trim: '#F2C94C',
    crestBg: '#0A1B33',
    crestAccent: '#F2C94C',
    numberText: '#F2C94C',
    tagLabel: 'ESP · 21',
    stripeColor: '#0A1B33',
  },
};

function traceJerseySilhouette(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  // Collar opening top center
  ctx.moveTo(498, 108);
  // Right shoulder
  ctx.quadraticCurveTo(600, 146, 702, 108);
  ctx.lineTo(845, 152);
  // Right sleeve outer
  ctx.lineTo(942, 326);
  ctx.lineTo(816, 376);
  // Right underarm
  ctx.lineTo(782, 294);
  // Right torso side
  ctx.quadraticCurveTo(772, 465, 788, 622);
  // Bottom hem
  ctx.quadraticCurveTo(600, 642, 412, 622);
  // Left torso side
  ctx.quadraticCurveTo(428, 465, 418, 294);
  // Left underarm
  ctx.lineTo(384, 376);
  // Left sleeve outer
  ctx.lineTo(258, 326);
  ctx.lineTo(355, 152);
  // Left shoulder
  ctx.closePath();
}

export function renderCamisetaDataURL(modelo: ModeloId): string {
  const p = JERSEY_PALETTES[modelo] || JERSEY_PALETTES.uruguay;
  const c = document.createElement('canvas');
  c.width = 1200;
  c.height = 713;
  const ctx = c.getContext('2d');
  if (!ctx) return '';

  ctx.save();

  // Base jersey body
  ctx.save();
  traceJerseySilhouette(ctx);
  const bodyGrad = ctx.createLinearGradient(340, 110, 860, 640);
  bodyGrad.addColorStop(0, p.hi);
  bodyGrad.addColorStop(0.5, p.main);
  bodyGrad.addColorStop(1, p.lo);
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.clip();

  // Subtle athletic mesh weave
  ctx.fillStyle = 'rgba(255,255,255,0.045)';
  for (let y = 110; y < 650; y += 10) {
    for (let x = 260; x < 940; x += 12) {
      ctx.fillRect(x + ((y / 10) % 2) * 5, y, 3, 3);
    }
  }

  // Retro jacquard / diagonal sheen or side stripes
  if (modelo === 'retro') {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 18;
    for (let sx = 220; sx < 980; sx += 56) {
      ctx.beginPath();
      ctx.moveTo(sx, 100);
      ctx.lineTo(sx - 120, 660);
      ctx.stroke();
    }
  } else if (modelo === 'club' && p.stripeColor) {
    ctx.fillStyle = p.stripeColor;
    ctx.fillRect(428, 120, 44, 520);
    ctx.fillStyle = p.trim;
    ctx.fillRect(472, 120, 10, 520);
  } else if (modelo === 'uruguay') {
    // Clean vertical tonal ribs
    ctx.fillStyle = 'rgba(10, 27, 51, 0.06)';
    for (let rx = 430; rx < 775; rx += 32) {
      ctx.fillRect(rx, 110, 12, 535);
    }
  }

  // Vertical fabric fold shadows
  const foldLeft = ctx.createLinearGradient(410, 350, 490, 350);
  foldLeft.addColorStop(0, 'rgba(0,0,0,0.22)');
  foldLeft.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = foldLeft;
  ctx.fillRect(405, 250, 90, 390);

  const foldRight = ctx.createLinearGradient(710, 350, 795, 350);
  foldRight.addColorStop(0, 'rgba(0,0,0,0)');
  foldRight.addColorStop(1, 'rgba(0,0,0,0.24)');
  ctx.fillStyle = foldRight;
  ctx.fillRect(705, 250, 90, 390);

  // Sleeve cuffs
  ctx.save();
  ctx.strokeStyle = p.collar;
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(258, 326);
  ctx.lineTo(384, 376);
  ctx.moveTo(942, 326);
  ctx.lineTo(816, 376);
  ctx.stroke();

  ctx.strokeStyle = p.trim;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(264, 316);
  ctx.lineTo(388, 366);
  ctx.moveTo(936, 316);
  ctx.lineTo(812, 366);
  ctx.stroke();
  ctx.restore();

  // Collar + V/Polo detailing
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(494, 106);
  ctx.quadraticCurveTo(600, 178, 706, 106);
  ctx.lineTo(718, 124);
  ctx.quadraticCurveTo(600, 204, 482, 124);
  ctx.closePath();
  ctx.fillStyle = p.collar;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(498, 108);
  ctx.quadraticCurveTo(600, 146, 702, 108);
  ctx.quadraticCurveTo(600, 165, 498, 108);
  ctx.closePath();
  ctx.fillStyle = '#071120';
  ctx.fill();

  ctx.strokeStyle = p.trim;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(488, 121);
  ctx.quadraticCurveTo(600, 198, 712, 121);
  ctx.stroke();
  ctx.restore();

  // Minimalist crest shield on left chest (viewer right)
  ctx.save();
  ctx.translate(675, 245);
  ctx.beginPath();
  ctx.moveTo(-24, -26);
  ctx.lineTo(24, -26);
  ctx.lineTo(24, 6);
  ctx.quadraticCurveTo(0, 34, 0, 34);
  ctx.quadraticCurveTo(0, 34, -24, 6);
  ctx.closePath();
  ctx.fillStyle = p.crestBg;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = p.crestAccent;
  ctx.stroke();

  // Four subtle stars / emblem bar inside crest
  ctx.fillStyle = p.crestAccent;
  ctx.fillRect(-10, -14, 20, 4);
  ctx.beginPath();
  ctx.arc(0, 4, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Subtle woven tag / number stamp near chest/hem
  ctx.save();
  ctx.fillStyle = p.numberText;
  ctx.globalAlpha = 0.82;
  ctx.font = "700 18px 'JetBrains Mono', monospace";
  ctx.fillText(p.tagLabel, 466, 560);
  ctx.restore();

  // Soft studio highlight over torso
  const spec = ctx.createRadialGradient(600, 290, 30, 600, 310, 320);
  spec.addColorStop(0, 'rgba(255,255,255,0.22)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.fillRect(250, 100, 700, 560);

  ctx.restore(); // end jersey clip

  // Subtle hem stitch
  ctx.save();
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(418, 608);
  ctx.quadraticCurveTo(600, 628, 782, 608);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
  return c.toDataURL('image/png');
}

export function renderCamisetaDepthDataURL(): string {
  const c = document.createElement('canvas');
  c.width = 600;
  c.height = 356;
  const ctx = c.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.save();
  ctx.scale(0.5, 0.5);

  traceJerseySilhouette(ctx);
  const dGrad = ctx.createRadialGradient(600, 340, 40, 600, 350, 340);
  dGrad.addColorStop(0, '#FFFFFF');
  dGrad.addColorStop(0.55, '#BDBDBD');
  dGrad.addColorStop(1, '#363636');
  ctx.fillStyle = dGrad;
  ctx.fill();

  ctx.restore();
  return c.toDataURL('image/png');
}
