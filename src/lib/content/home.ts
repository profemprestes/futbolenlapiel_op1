import { PRICE_REFERENCES } from '@/lib/config/brand';
import type { CatalogCategoryId } from '@/lib/data/modelos';

export interface HomeCategoryPresentation {
  badge: string;
  summary: string;
  tags: readonly string[];
}

export const HOME_CATEGORY_PRESENTATION: Record<CatalogCategoryId, HomeCategoryPresentation> = {
  actuales: {
    badge: 'Temporada 2026',
    summary: 'Selecciones y camisetas oficiales de la nueva temporada.',
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
    summary: 'Clubes uruguayos, sudamericanos y gigantes de Europa.',
    tags: ['Peñarol', 'Nacional', 'Real Madrid', 'Boca Juniors'],
  },
};

export const HOME_CONTENT = {
  hero: {
    kickerLeft: 'URUGUAY',
    kickerRight: 'ENTREGA INMEDIATA Y POR ENCARGO',
    title: 'FUTBOL EN LA PIEL',
    tagline: 'La pasión se lleva puesta.',
    subtitle: `Camisetas actuales, Mundial 2026, clubes y retros en talles S a XL (${PRICE_REFERENCES.fan}). Envíos a todo el país por agencias conocidas.`,
    scrollCue: 'Deslizá',
  },
  modelos: {
    subtitle:
      'Stock real para entrega inmediata y modelos por encargo. Elegí una camiseta para verla girar o consultá por categoría.',
    categoriesHeading: 'Categorías del catálogo (@futbolenlapieluy1)',
  },
  pedido: {
    bannerEyebrow: 'STOCK EN URUGUAY + ENCARGOS · PAGO CONTADO O TRANSFERENCIA',
    bannerTitle: 'CONSULTÁ STOCK, TALLE Y ENVÍO EN MINUTOS',
    bannerDesc:
      'Trabajamos con entrega inmediata de nuestro stock en Uruguay y pedidos por encargo si buscás un modelo o dorsal puntual. Despachamos por agencias conocidas a todo el país.',
    formTitle: 'Pedir por WhatsApp',
    submitLabel: 'Enviar consulta por WhatsApp',
    agreeLabel:
      'Confirmo que el stock, precio final y envío por agencia se coordinan por WhatsApp.',
  },
  footer: {
    tagline: 'LA PASIÓN SE LLEVA PUESTA · URUGUAY',
    instagramDesc:
      'Catálogo actualizado con entregas inmediatas, Mundial 2026, clubes y clásicos retros.',
  },
} as const;
