import fs from 'node:fs';
import path from 'node:path';
import { PRICE_REFERENCES } from '@/lib/config/brand';
import type { CatalogCategoryId } from '@/lib/data/modelos';

export interface CsvCatalogItem {
  id: string;
  title: string;
  description: string;
  brand: string;
  color: string;
  size: string;
  instagramUrl: string;
  category: CatalogCategoryId;
  version: 'Versión Jugador' | 'Edición Retro' | 'Versión Fan';
  priceLabel: string;
  localImage?: string;
}

const LOCAL_IMAGE_MATCHERS: Array<{ pattern: RegExp; src: string }> = [
  {
    pattern: /uruguay.*azul marino|uruguay.*2026/i,
    src: '/camisetas/uruguay-away-2026-nike-jugador.jpeg',
  },
  {
    pattern: /noruega.*roja/i,
    src: '/camisetas/noruega.jpeg',
  },
  {
    pattern: /como 1907/i,
    src: '/camisetas/como.jpeg',
  },
  {
    pattern: /manchester united.*1993-95|manchester united.*negra/i,
    src: '/camisetas/manchester-united-away-1993-1995-umbro.jpeg',
  },
  {
    pattern: /manchester united.*1996/i,
    src: '/camisetas/manchest3er_united.jpeg',
  },
  {
    pattern: /nacional.*blanca/i,
    src: '/camisetas/nacional-home-2026-umbro-blanca.jpeg',
  },
  {
    pattern: /nacional.*golero|nacional.*bordo/i,
    src: '/camisetas/nacional-golero-2026-umbro-bordo.jpeg',
  },
  {
    pattern: /boca juniors/i,
    src: '/camisetas/boca-juniors-home-2026-2027-adidas.jpeg',
  },
];

function parseCsvRows(raw: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const next = raw[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\r' && next === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i++;
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function inferCategory(title: string, description: string): CatalogCategoryId {
  const text = `${title} ${description}`;
  if (/uruguay|peñarol|penarol|nacional/i.test(text)) return 'uruguay';
  if (/retro|1988|1990|1991|1993|1994|1995|1996|1998|1999|2002|2003|2006|2009|2011|2018/i.test(text)) {
    return 'retros';
  }
  if (/noruega|alemania|españa|espana|argentina|brasil|italia|colombia|camerun|cabo verde/i.test(text)) {
    return 'actuales';
  }
  return 'clubes';
}

function inferVersion(title: string, description: string, category: CatalogCategoryId): CsvCatalogItem['version'] {
  const text = `${title} ${description}`;
  if (/versi[oó]n jugador/i.test(text)) return 'Versión Jugador';
  if (category === 'retros' || /retro|vintage/i.test(text)) return 'Edición Retro';
  return 'Versión Fan';
}

function inferPriceLabel(version: CsvCatalogItem['version'], rawPrice: string): string {
  const trimmed = rawPrice.trim();
  if (trimmed) return trimmed;
  if (version === 'Versión Jugador') return PRICE_REFERENCES.jugador;
  if (version === 'Edición Retro') return PRICE_REFERENCES.retro;
  return PRICE_REFERENCES.fan;
}

function findLocalImage(title: string): string | undefined {
  return LOCAL_IMAGE_MATCHERS.find((m) => m.pattern.test(title))?.src;
}

export function loadCsvCatalogoItems(): CsvCatalogItem[] {
  const csvPath = path.join(process.cwd(), 'docs', 'catalogo_instagram_futbolenlapiel.csv');
  const raw = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsvRows(raw);
  if (rows.length < 3) return [];

  // Row 0 is Facebook catalog help comments, Row 1 is the header row
  const headers = rows[1].map((h) => h.trim());
  const idx = (name: string) => headers.indexOf(name);

  const iId = idx('id');
  const iTitle = idx('title');
  const iDesc = idx('description');
  const iPrice = idx('price');
  const iLink = idx('link');
  const iBrand = idx('brand');
  const iColor = idx('color');
  const iSize = idx('size');

  const items: CsvCatalogItem[] = [];

  for (let r = 2; r < rows.length; r++) {
    const cols = rows[r];
    const id = cols[iId]?.trim();
    const title = cols[iTitle]?.trim();
    if (!id || !title) continue;

    const description = cols[iDesc]?.trim() ?? '';
    const brand = cols[iBrand]?.trim() || 'Fútbol en la Piel';
    const color = cols[iColor]?.trim() || '';
    const size = cols[iSize]?.trim() || 'S a XL';
    const instagramUrl = cols[iLink]?.trim() || 'https://www.instagram.com/futbolenlapieluy1/';
    const rawPrice = cols[iPrice] ?? '';

    const category = inferCategory(title, description);
    const version = inferVersion(title, description, category);
    const priceLabel = inferPriceLabel(version, rawPrice);
    const localImage = findLocalImage(title);

    items.push({
      id,
      title,
      description,
      brand,
      color,
      size,
      instagramUrl,
      category,
      version,
      priceLabel,
      localImage,
    });
  }

  return items;
}
