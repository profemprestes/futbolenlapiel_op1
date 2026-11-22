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

export const WHATSAPP_NUMBER_RAW = '598092864559';
export const WHATSAPP_DISPLAY = '+598 092 864 559';
export const INSTAGRAM_HANDLE = '@futbolenlapieluy1';

export const BRAND_LOGOS = {
  horizontal: '/logos/futbolenlapiel_horizontal_transparente.png',
  emblem: '/logos/futbol_logo_mejorado_v2.png',
  emblem3d:
    'https://ynqvddgxxtmflpouursq.supabase.co/storage/v1/object/public/marifertiendauy/futbol_logo_mejorado_v2.svg',
} as const;

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
