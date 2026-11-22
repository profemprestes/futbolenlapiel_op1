import { PRICE_REFERENCES } from '@/lib/config/brand';

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
