export type ModeloId = 'uruguay' | 'retro' | 'club';

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
  catalogSlug: string;
}

export const MODELOS: ModeloInfo[] = [
  {
    id: 'uruguay',
    num: '01',
    name: 'Uruguay 2026 Mundial — Alternativa',
    shortName: 'Uruguay 2026',
    dotColor: '#75B2E6',
    desc: 'Azul marino Nike Mundial 2026 · Versión Jugador y Fan · Talles S a XL',
    alt: 'Camiseta Uruguay 2026 Mundial Alternativa',
    priceLabel: '$ 1.990 (ref.)',
    availabilityLabel: 'Entrega inmediata / Encargo',
    catalogSlug: 'uruguay-2026-mundial-alternativa-4',
  },
  {
    id: 'retro',
    num: '02',
    name: 'Manchester United 1996 — Cantona #7',
    shortName: 'Man. United 1996',
    dotColor: '#C81D25',
    desc: 'Blanca visitante Umbro 1996, sponsor Sharp Viewcam · Dorsal Cantona #7',
    alt: 'Camiseta Retro Manchester United 1996 dorsal Cantona 7',
    priceLabel: '$ 1.890 (ref.)',
    availabilityLabel: 'Entrega inmediata',
    catalogSlug: 'manchester-united-1996-cantona-7-3',
  },
  {
    id: 'club',
    num: '03',
    name: 'Real Madrid 2026 — Valverde #8',
    shortName: 'Real Madrid Valverde #8',
    dotColor: '#F2C94C',
    desc: 'Verde manga larga con parches de competición · Versión Jugador · Talles S a XL',
    alt: 'Camiseta Real Madrid Valverde 8 verde manga larga',
    priceLabel: '$ 2.090 (ref.)',
    availabilityLabel: 'Entrega inmediata / Encargo',
    catalogSlug: 'real-madrid-valverde-8-verde-manga-larga-22',
  },
];

export const MODELO_NAMES: Record<ModeloId, string> = {
  uruguay: 'Uruguay 2026 Mundial — Alternativa',
  retro: 'Manchester United 1996 — Cantona #7',
  club: 'Real Madrid 2026 — Valverde #8',
};

export const MODELO_SHORT_NAMES: Record<ModeloId, string> = {
  uruguay: 'Uruguay 2026',
  retro: 'Man. United 1996',
  club: 'Real Madrid Valverde #8',
};

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
    subtitle: 'Clásicos 1988–2018 con dorsales icónicos',
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
    examples: 'Peñarol, Nacional, Boca Juniors, Real Madrid, Liverpool, Inter Miami, Como 1907',
    defaultQuery: 'Camiseta de club 2026',
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
    word: 'EN STOCK',
    isHeading: true,
    isNum: false,
    reverse: false,
    caption:
      'Entrega inmediata en modelos seleccionados y pedidos por encargo a tu talle: Uruguay 2026, Argentina, Noruega, Peñarol, Nacional y Real Madrid.',
  },
  {
    id: 'r2',
    word: 'RETROS.',
    isHeading: false,
    isNum: false,
    reverse: true,
    caption:
      'Clásicos de colección 1988–2018 con etiquetas y dorsales históricos: Cantona #7, Luis Enrique #21, Ronaldo #9, Messi #10 y Baggio #10.',
  },
  {
    id: 'r3',
    word: 'S–XL',
    isHeading: false,
    isNum: true,
    reverse: false,
    caption:
      'Versión Fan (desde $ 1.690), Retro (desde $ 1.890) y Jugador (desde $ 1.990). Elegí tu talle en el anillo 3D o abajo en el formulario.',
  },
  {
    id: 'r4',
    word: 'URUGUAY.',
    isHeading: false,
    isNum: false,
    reverse: true,
    caption:
      'Envíos a los 19 departamentos por agencias conocidas (DAC, Mirtrans, Correo) y pago contado o transferencia bancaria.',
  },
];

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
