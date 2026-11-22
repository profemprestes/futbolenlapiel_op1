import { WHATSAPP_NUMBER_RAW } from '@/lib/config/brand';

export function createWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER_RAW}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

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
  return createWhatsAppUrl(text);
}
