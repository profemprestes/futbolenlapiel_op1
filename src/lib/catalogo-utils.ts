import type { CatalogCategoryId } from '@/lib/data/modelos';
import { RAW_ITEMS, type CatalogoItemRaw, type JerseySize, type StockStatus } from '@/lib/data/catalogo';

export type { CatalogoItemRaw, JerseySize, StockStatus };

export interface CatalogoItem extends CatalogoItemRaw {
  slug: string;
  status: StockStatus;
  priceLabel: string;
  availableSizes: JerseySize[];
  decade: string;
}

export function toSlug(text: string, id: number): string {
  const base = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base}-${id}`;
}

export function inferDecade(season: string): string {
  const match = season.match(/(19\d\d|20\d\d)/);
  if (!match) return 'Actual';
  const year = Number(match[1]);
  if (year < 1990) return '1980s';
  if (year < 2000) return '1990s';
  if (year < 2010) return '2000s';
  if (year < 2020) return '2010s';
  return '2020s';
}

export function inferSizes(sizesLabel: string): JerseySize[] {
  if (/S a XL/i.test(sizesLabel)) return ['S', 'M', 'L', 'XL'];
  const found: JerseySize[] = [];
  if (/\bS\b/i.test(sizesLabel)) found.push('S');
  if (/\bM\b/i.test(sizesLabel)) found.push('M');
  if (/\bL\b/i.test(sizesLabel)) found.push('L');
  if (/\bXL\b/i.test(sizesLabel)) found.push('XL');
  return found.length > 0 ? found : ['S', 'M', 'L', 'XL'];
}

export function inferStatus(item: CatalogoItemRaw): StockStatus {
  if (item.status) return item.status;
  if (/inmediata|M, L, XL|S a XL/i.test(item.sizesLabel)) return 'Disponible';
  return 'Consultar';
}

export const CATALOGO_ITEMS: CatalogoItem[] = RAW_ITEMS.map((item) => ({
  ...item,
  slug: toSlug(item.title, item.id),
  status: inferStatus(item),
  priceLabel: item.priceLabel ?? 'Consultar precio',
  availableSizes: item.availableSizes ?? inferSizes(item.sizesLabel),
  decade: inferDecade(item.season),
}));

export function getCatalogoItemBySlug(slug: string): CatalogoItem | undefined {
  return CATALOGO_ITEMS.find((item) => item.slug === slug);
}

export function getRelatedCatalogoItems(item: CatalogoItem, limit = 3): CatalogoItem[] {
  return CATALOGO_ITEMS.filter(
    (other) => other.id !== item.id && (other.category === item.category || other.team === item.team)
  ).slice(0, limit);
}

export const CATALOGO_FILTER_OPTIONS: Array<{
  id: 'todas' | CatalogCategoryId;
  label: string;
}> = [
  { id: 'todas', label: `Todas (${CATALOGO_ITEMS.length})` },
  { id: 'actuales', label: 'Actuales & Mundial 2026' },
  { id: 'retros', label: 'Retros' },
  { id: 'uruguay', label: 'Uruguay' },
  { id: 'clubes', label: 'Clubes' },
];

export const RETRO_DECADES = ['Todas', '1980s', '1990s', '2000s', '2010s'] as const;
