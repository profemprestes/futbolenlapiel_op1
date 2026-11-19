export type ModeloId = 'uruguay' | 'retro' | 'club';

export const SIZES = ['S', 'M', 'L', 'XL'] as const;

export const VERSION_OPTIONS = [
  'Versión Jugador',
  'Versión Fan',
  'A confirmar según stock',
] as const;

export const DEPARTAMENTOS_URUGUAY = [
  'Montevideo',
  'Canelones',
  'Maldonado',
  'Salto',
  'Paysandú',
  'Rivera',
  'Colonia',
  'Rocha',
  'San José',
  'Tacuarembó',
  'Cerro Largo',
  'Soriano',
  'Artigas',
  'Durazno',
  'Florida',
  'Lavalleja',
  'Río Negro',
  'Treinta y Tres',
  'Flores',
] as const;

export interface ModeloInfo {
  id: ModeloId;
  num: string;
  name: string;
  shortName: string;
  dotColor: string;
  desc: string;
  alt: string;
  priceLabel: string;
  availabilityLabel: string;
}

export const MODELOS: ModeloInfo[] = [
  {
    id: 'uruguay',
    num: '01',
    name: 'Uruguay 2026 Mundial',
    shortName: 'Uruguay 2026',
    dotColor: '#75B2E6',
    desc: 'Celeste tradicional, selección Uruguay, versión 2026 Mundial',
    alt: 'Camiseta Uruguay 2026 Mundial celeste tradicional',
    priceLabel: 'A CONFIRMAR por WhatsApp',
    availabilityLabel: 'Disponibilidad según publicación',
  },
  {
    id: 'retro',
    num: '02',
    name: 'Retro — Manchester United 1996 Cantona 7',
    shortName: 'Retro Man. United 1996',
    dotColor: '#C81D25',
    desc: 'Retro 1996, dorsal Cantona 7 — ejemplo real de posteos',
    alt: 'Camiseta Retro Manchester United 1996 dorsal Cantona 7',
    priceLabel: 'A CONFIRMAR por WhatsApp',
    availabilityLabel: 'Disponibilidad según publicación',
  },
  {
    id: 'club',
    num: '03',
    name: 'Retro — España 1996 Luis Enrique 21',
    shortName: 'Retro España 1996',
    dotColor: '#F2C94C',
    desc: 'Retro 1996, dorsal Luis Enrique 21 — ejemplo real de posteos',
    alt: 'Camiseta Retro España 1996 dorsal Luis Enrique 21',
    priceLabel: 'A CONFIRMAR por WhatsApp',
    availabilityLabel: 'Disponibilidad según publicación',
  },
];

export const MODELO_NAMES: Record<ModeloId, string> = {
  uruguay: 'Uruguay 2026 Mundial',
  retro: 'Retro — Manchester United 1996 Cantona 7',
  club: 'Retro — España 1996 Luis Enrique 21',
};

export const MODELO_SHORT_NAMES: Record<ModeloId, string> = {
  uruguay: 'Uruguay 2026',
  retro: 'Retro Man. United 1996',
  club: 'Retro España 1996',
};

export const WHATSAPP_NUMBER_RAW = '598092864559';
export const WHATSAPP_DISPLAY = '+598 092 864 559';
export const INSTAGRAM_HANDLE = '@futbolenlapieluy1';

export interface CountdownState {
  d: string;
  h: string;
  m: string;
  s: string;
}

export const STATIC_COUNTDOWN: CountdownState = {
  d: '00',
  h: '00',
  m: '00',
  s: '00',
};

export function computeConsultaCode(seed: string): string {
  let h = 7;
  for (const ch of seed.toLowerCase()) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return `FEP-${String(1000 + (h % 9000))}`;
}

export function buildWhatsAppHref(params: {
  name: string;
  camiseta: string;
  version: string;
  size: string;
  fulfil: 'envio' | 'coordinar';
  departamento: string;
  consultaId: string;
}): string {
  const entrega =
    params.fulfil === 'envio'
      ? `Envío a ${params.departamento}`
      : `Coordinar entrega (${params.departamento || 'Uruguay'})`;
  const text = [
    `Hola Fútbol en la Piel! Consulta ${params.consultaId}:`,
    `• Nombre: ${params.name}`,
    `• Camiseta: ${params.camiseta}`,
    `• Versión: ${params.version}`,
    `• Talle: ${params.size}`,
    `• Entrega: ${entrega}`,
    `Quedo atento para confirmar stock, precio y envío.`,
  ].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(text)}`;
}
