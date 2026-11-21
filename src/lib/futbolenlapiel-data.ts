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
    desc: 'Selección Uruguay 2026 Mundial · Versión Jugador y Fan · Talles S a XL',
    alt: 'Camiseta Uruguay 2026 Mundial selección',
    priceLabel: 'Consultar por WhatsApp',
    availabilityLabel: 'Stock según publicación',
  },
  {
    id: 'retro',
    num: '02',
    name: 'Retro — Manchester United 1996 Cantona 7',
    shortName: 'Retro Man. United 1996',
    dotColor: '#C81D25',
    desc: 'Clásico 1996 Umbro, dorsal Cantona 7 · Edición retro de colección',
    alt: 'Camiseta Retro Manchester United 1996 dorsal Cantona 7',
    priceLabel: 'Consultar por WhatsApp',
    availabilityLabel: 'Stock según publicación',
  },
  {
    id: 'club',
    num: '03',
    name: 'Retro — España 1996 Luis Enrique 21',
    shortName: 'Retro España 1996',
    dotColor: '#F2C94C',
    desc: 'Clásico 1996 de selección, dorsal Luis Enrique 21 · Edición retro',
    alt: 'Camiseta Retro España 1996 dorsal Luis Enrique 21',
    priceLabel: 'Consultar por WhatsApp',
    availabilityLabel: 'Stock según publicación',
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

export const BRAND_LOGOS = {
  horizontal: '/logos/futbolenlapiel_horizontal_transparente.png',
  emblem: '/logos/futbol_logo_mejorado_v2.png',
  emblem3d:
    'https://ynqvddgxxtmflpouursq.supabase.co/storage/v1/object/public/marifertiendauy/futbol_logo_mejorado_v2.svg',
} as const;

export type CatalogCategoryId = 'actuales' | 'retros' | 'uruguay' | 'clubes';

export interface CatalogCategory {
  id: CatalogCategoryId;
  title: string;
  subtitle: string;
  examples: string;
  defaultQuery: string;
  defaultPlaceholder?: string;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: 'actuales',
    title: 'Actuales',
    subtitle: 'Temporada vigente & Mundial 2026',
    examples: 'Uruguay 2026, Noruega Haaland 9, Argentina Messi 10, España Yamal 19, Alemania 2026',
    defaultQuery: 'Camiseta actual temporada 2026',
  },
  {
    id: 'retros',
    title: 'Retros',
    subtitle: 'Clásicos 1988–2011 con dorsales icónicos',
    examples: 'Man. United 1996 Cantona 7, Real Madrid 2003, Barcelona 2009/2011, Brasil 1994',
    defaultQuery: 'Camiseta retro con dorsal',
  },
  {
    id: 'uruguay',
    title: 'Uruguay',
    subtitle: 'La Celeste y clubes uruguayos',
    examples: 'Uruguay 2026 Mundial, Peñarol 2026 & 1998 Retro, Nacional 2026',
    defaultQuery: 'Uruguay 2026 Mundial',
  },
  {
    id: 'clubes',
    title: 'Clubes',
    subtitle: 'Uruguayos, sudamericanos y europeos',
    examples: 'Peñarol, Nacional, Boca Juniors, Real Madrid, Liverpool, Inter Miami CF, Como 1907',
    defaultQuery: '',
    defaultPlaceholder: 'Ej: Peñarol 2026, Nacional 2026, Real Madrid...',
  },
];

export interface CamisetaChapterRow {
  id: string;
  word: string;
  isHeading: boolean;
  isNum: boolean;
  reverse: boolean;
  caption: string;
}

export const CAMISETA_CHAPTER_ROWS: CamisetaChapterRow[] = [
  {
    id: 'r1',
    word: 'ACTUALES',
    isHeading: true,
    isNum: false,
    reverse: false,
    caption:
      'Selecciones rumbo al Mundial 2026 y clubes de temporada vigente: Uruguay, Argentina, Noruega, España, Peñarol, Nacional y más.',
  },
  {
    id: 'r2',
    word: 'RETROS.',
    isHeading: false,
    isNum: false,
    reverse: true,
    caption:
      'Clásicos de colección de 1988 a 2011 con dorsales históricos: Cantona 7, Luis Enrique 21, Ronaldo 9, Messi 10, Baggio 10 y más.',
  },
  {
    id: 'r3',
    word: 'S–XL',
    isHeading: false,
    isNum: true,
    reverse: false,
    caption:
      'Versión Jugador (corte entallado), Versión Fan (calce clásico) y ediciones Retro. Elegí tu talle en el anillo o en el formulario.',
  },
  {
    id: 'r4',
    word: 'URUGUAY.',
    isHeading: false,
    isNum: false,
    reverse: true,
    caption:
      'Envíos a los 19 departamentos y entregas a coordinar. Confirmás stock, talle y precio actualizado directo por WhatsApp.',
  },
];

export const COMMERCIAL_INFO = {
  payments: [
    'Transferencia bancaria',
    'Mercado Pago',
    'Efectivo (a coordinar según entrega)',
  ],
  shipping: [
    { zone: 'Montevideo', detail: 'Entrega o retiro a coordinar según disponibilidad.' },
    { zone: 'Interior', detail: 'Envíos a todo el país por agencia; costo y plazo a confirmar.' },
  ],
  sizingAndChanges: [
    {
      label: 'Talles S a XL',
      detail: 'Versión Jugador tiene corte más entallado; Versión Fan ofrece calce clásico.',
    },
    {
      label: 'Cambios',
      detail: 'Sujeto a disponibilidad de talle, con prenda sin uso y etiqueta original.',
    },
  ],
} as const;

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
