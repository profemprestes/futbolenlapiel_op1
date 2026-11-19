export interface NavItem {
  href: string;
  label: string;
  description: string;
  iconName: 'home' | 'shopping-bag' | 'history' | 'clipboard-list' | 'truck' | 'message-circle';
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Inicio',
    description: 'Portada, destacadas y categorías',
    iconName: 'home',
  },
  {
    href: '/tienda',
    label: 'Tienda / Stock',
    description: 'Catálogo completo con filtros',
    iconName: 'shopping-bag',
  },
  {
    href: '/retros',
    label: 'Retros',
    description: 'Clásicos 1988–2018 con historia',
    iconName: 'history',
  },
  {
    href: '/como-pedir',
    label: 'Cómo pedir',
    description: 'Pasos y formulario para WhatsApp',
    iconName: 'clipboard-list',
  },
  {
    href: '/envios',
    label: 'Envíos',
    description: 'Montevideo, interior y medios de pago',
    iconName: 'truck',
  },
  {
    href: '/contacto',
    label: 'Contacto',
    description: 'WhatsApp directo e Instagram',
    iconName: 'message-circle',
  },
];

export const SECONDARY_NAV_ITEMS = [
  { href: '/talles', label: 'Talles y cambios' },
  { href: '/preguntas', label: 'Preguntas frecuentes' },
] as const;

export const TIENDA_DROPDOWN_ITEMS = [
  {
    href: '/tienda?categoria=actuales',
    title: 'Actuales & Mundial 2026',
    description: 'Selecciones y clubes de temporada vigente.',
  },
  {
    href: '/tienda?categoria=uruguay',
    title: 'La Celeste (Uruguay)',
    description: 'Camiseta Uruguay 2026 y ediciones especiales.',
  },
  {
    href: '/tienda?categoria=clubes',
    title: 'Clubes',
    description: 'Uruguayos, sudamericanos y europeos.',
  },
  {
    href: '/tienda',
    title: 'Ver todo el stock',
    description: 'Explorá todas las categorías y consultá talle.',
  },
] as const;
