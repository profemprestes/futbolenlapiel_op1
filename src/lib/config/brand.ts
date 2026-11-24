export const SIZES = ['S', 'M', 'L', 'XL'] as const;

export const VERSION_OPTIONS = [
  'Versión Jugador',
  'Versión Fan',
  'Edición Retro',
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

export const WHATSAPP_NUMBER_RAW = '59899760998';
export const WHATSAPP_DISPLAY = '+598 99 760 998';
export const INSTAGRAM_HANDLE = '@futbolenlapieluy1';

export const BRAND_LOGOS = {
  horizontal: '/logos/futbolenlapiel_horizontal_transparente.png',
  emblem: '/logos/futbol_logo_mejorado_v2.png',
  emblem3d:
    'https://ynqvddgxxtmflpouursq.supabase.co/storage/v1/object/public/marifertiendauy/futbol_logo_mejorado_v2.svg',
} as const;

export const PRICE_REFERENCES = {
  fan: 'Desde $ 1.690',
  jugador: 'Desde $ 1.990',
  retro: 'Desde $ 1.890',
} as const;

export const COMMERCIAL_INFO = {
  payments: [
    'Transferencia bancaria',
    'Mercado Pago',
    'Efectivo',
  ],
  shipping: [
    {
      zone: 'Montevideo',
      detail: 'Entrega o retiro a coordinar; envíos por cadetería o agencia.',
    },
    {
      zone: 'Interior',
      detail: 'Envíos a los 19 departamentos por agencias conocidas (DAC, Mirtrans, Correo Uruguayo).',
    },
  ],
  sizingAndChanges: [
    {
      label: 'Talles S a XL en stock · Todos por encargo',
      detail: 'En stock habitual del S al XL; por encargo trabajamos todos los talles. Versión Jugador (calidad muy alta, corte entallado) y Versión Fan (calce clásico).',
    },
    {
      label: 'Cambios',
      detail: 'Sujeto a disponibilidad de talle, con prenda sin uso y etiqueta original.',
    },
  ],
} as const;
