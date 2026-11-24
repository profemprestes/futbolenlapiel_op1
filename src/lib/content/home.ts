import type { CatalogCategoryId } from '@/lib/data/modelos';

export interface HomeCategoryPresentation {
  badge: string;
  summary: string;
  tags: readonly string[];
}

export const HOME_CATEGORY_PRESENTATION: Record<CatalogCategoryId, HomeCategoryPresentation> = {
  actuales: {
    badge: 'Temporada 2026',
    summary: 'Selecciones y camisetas de la nueva temporada en calidad alta.',
    tags: ['Uruguay 2026', 'Haaland #9', 'Messi #10', 'Yamal #19'],
  },
  retros: {
    badge: '1988–2018',
    summary: 'Ediciones de colección con etiquetas y dorsales legendarios.',
    tags: ['Cantona #7', 'Luis Enrique #21', 'Ronaldo #9', 'Baggio #10'],
  },
  uruguay: {
    badge: 'La Celeste',
    summary: 'Camisetas de la selección y ediciones especiales charrúas.',
    tags: ['Uruguay Titular', 'Alternativa 2026', 'Fan & Jugador'],
  },
  clubes: {
    badge: 'Stock & Encargo',
    summary: 'Clubes uruguayos, sudamericanos, europeos y basket.',
    tags: ['Peñarol', 'Nacional', 'Real Madrid', 'Basket'],
  },
};

export const HOME_CONTENT = {
  hero: {
    kickerLeft: 'URUGUAY',
    kickerRight: 'ENTREGA INMEDIATA Y POR ENCARGO',
    title: 'FUTBOL EN LA PIEL',
    tagline: 'La pasión se lleva puesta.',
    subtitle:
      'Camisetas, shorts y remeras de fútbol y basket en alta calidad. Stock S a XL y todos los talles por encargo. Envíos a todo el país.',
    scrollCue: 'Deslizá',
  },
  modelos: {
    subtitle:
      'Stock real para entrega inmediata (S a XL) y pedidos por encargo en todos los talles. Elegí un modelo para girarlo o consultá por categoría.',
    categoriesHeading: 'Categorías del catálogo (@futbolenlapieluy1)',
  },
  pedido: {
    bannerEyebrow: 'STOCK EN URUGUAY + ENCARGOS · TRANSFERENCIA, MERCADO PAGO Y EFECTIVO',
    bannerTitle: 'CONSULTÁ STOCK, PROMOCIONES Y ENVÍO EN MINUTOS',
    bannerDesc:
      'Elegí en nuestra web o Instagram (@futbolenlapieluy1) y cerrá tu pedido por WhatsApp. Trabajamos entrega inmediata en stock (S a XL), encargos en todos los talles, promociones vigentes y envíos a todo el país.',
    formTitle: 'Pedir por WhatsApp',
    submitLabel: 'Enviar consulta por WhatsApp',
    agreeLabel:
      'Confirmo que el stock, precio final y envío por agencia se coordinan por WhatsApp.',
  },
  footer: {
    tagline: 'LA PASIÓN SE LLEVA PUESTA · URUGUAY',
    instagramDesc:
      'Nuestro canal principal: lanzamientos, promociones y catálogo de fútbol y basket. Cerramos tu pedido por WhatsApp.',
  },
} as const;
