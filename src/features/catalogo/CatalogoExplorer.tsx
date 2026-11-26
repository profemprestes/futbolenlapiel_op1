'use client';

import { ArrowUpRight, ChevronDown, MessageCircle, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  CATALOGO_FILTER_OPTIONS,
  CATALOGO_ITEMS,
  type CatalogoItem,
  type JerseySize,
  RETRO_DECADES,
} from '@/lib/catalogo-utils';
import { PRICE_REFERENCES, SIZES } from '@/lib/config/brand';
import type { CatalogCategoryId } from '@/lib/data/modelos';
import { createWhatsAppUrl } from '@/lib/whatsapp';

interface CatalogoExplorerProps {
  lockedCategory?: CatalogCategoryId;
  hideCategoryFilters?: boolean;
  showDecadeFilters?: boolean;
}

const VALID_CATEGORIES = new Set<string>(['actuales', 'retros', 'uruguay', 'clubes']);
const VERSION_FILTERS = ['Todas', 'Versión Jugador', 'Versión Fan', 'Retro', 'Edición especial'] as const;

function resolvePriceLabel(item: CatalogoItem): string {
  if (item.priceLabel && item.priceLabel !== 'Consultar precio') return item.priceLabel;
  if (/jugador/i.test(item.version)) return PRICE_REFERENCES.jugador;
  if (item.category === 'retros' || /retro/i.test(item.version)) return PRICE_REFERENCES.retro;
  return PRICE_REFERENCES.fan;
}

function whatsAppItemHref(item: CatalogoItem) {
  return createWhatsAppUrl(
    `Hola Fútbol en la Piel! Quiero consultar por "${item.title}" (${item.version}).`
  );
}

function whatsAppCustomHref(query: string) {
  return createWhatsAppUrl(
    query
      ? `Hola Fútbol en la Piel! Estoy buscando una camiseta de "${query}". ¿La tienen disponible?`
      : 'Hola Fútbol en la Piel! Quiero consultar por un modelo puntual.'
  );
}

export default function CatalogoExplorer({
  lockedCategory,
  hideCategoryFilters = false,
  showDecadeFilters = false,
}: CatalogoExplorerProps) {
  const searchParams = useSearchParams();
  const paramCat = searchParams.get('categoria');
  const initialCategory: 'todas' | CatalogCategoryId = lockedCategory
    ? lockedCategory
    : paramCat && VALID_CATEGORIES.has(paramCat)
      ? (paramCat as CatalogCategoryId)
      : 'todas';

  const [selectedCategory, setSelectedCategory] = useState<'todas' | CatalogCategoryId>(
    initialCategory
  );
  const [selectedVersion, setSelectedVersion] = useState<string>('Todas');
  const [selectedSize, setSelectedSize] = useState<'Todos' | JerseySize>('Todos');
  const [selectedDecade, setSelectedDecade] = useState<string>('Todas');
  const [query, setQuery] = useState('');

  const activeCategory = lockedCategory ?? selectedCategory;

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOGO_ITEMS.filter((item) => {
      if (activeCategory !== 'todas' && item.category !== activeCategory) return false;
      if (
        selectedVersion !== 'Todas' &&
        !item.version.toLowerCase().includes(selectedVersion.toLowerCase())
      ) {
        return false;
      }
      if (selectedSize !== 'Todos' && !item.availableSizes.includes(selectedSize)) {
        return false;
      }
      if (showDecadeFilters && selectedDecade !== 'Todas' && item.decade !== selectedDecade) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        item.title,
        item.team,
        item.season,
        item.version,
        item.dorsal ?? '',
        item.brand ?? '',
        item.shortDesc,
        item.contextNote ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, query, selectedDecade, selectedSize, selectedVersion, showDecadeFilters]);

  const resetFilters = () => {
    setQuery('');
    setSelectedVersion('Todas');
    setSelectedSize('Todos');
    setSelectedDecade('Todas');
    if (!lockedCategory) setSelectedCategory('todas');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="catalogo-search" className="sr-only">
              Buscar camisetas en el catálogo
            </label>
            <Search
              className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="catalogo-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar equipo, jugador, dorsal o año..."
              className="w-full h-12 pl-10 pr-10 rounded-xl border border-border bg-background text-foreground text-[16px] placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                className="w-8 h-8 rounded-full grid place-items-center text-muted-foreground hover:text-foreground active:translate-y-px absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <label htmlFor="filter-version" className="sr-only">
                Filtrar por versión
              </label>
              <select
                id="filter-version"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="h-12 pl-3.5 pr-9 rounded-xl border border-border bg-background text-foreground text-[14px] appearance-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
              >
                {VERSION_FILTERS.map((v) => (
                  <option key={v} value={v}>
                    {v === 'Todas' ? 'Todas las versiones' : v}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="w-4 h-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <div className="relative">
              <label htmlFor="filter-size" className="sr-only">
                Filtrar por talle
              </label>
              <select
                id="filter-size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as 'Todos' | JerseySize)}
                className="h-12 pl-3.5 pr-9 rounded-xl border border-border bg-background text-foreground text-[14px] appearance-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
              >
                <option value="Todos">Todos los talles</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    Talle {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="w-4 h-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            {showDecadeFilters && (
              <div className="relative">
                <label htmlFor="filter-decade" className="sr-only">
                  Filtrar por década
                </label>
                <select
                  id="filter-decade"
                  value={selectedDecade}
                  onChange={(e) => setSelectedDecade(e.target.value)}
                  className="h-12 pl-3.5 pr-9 rounded-xl border border-border bg-background text-foreground text-[14px] appearance-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {RETRO_DECADES.map((d) => (
                    <option key={d} value={d}>
                      {d === 'Todas' ? 'Todas las décadas' : d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="w-4 h-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            )}

            <p className="text-[14px] text-muted-foreground tabular-nums pl-1">
              <strong className="text-primary font-bold">{filteredItems.length}</strong>{' '}
              {filteredItems.length === 1 ? 'camiseta' : 'camisetas'}
            </p>
          </div>
        </div>

        {!hideCategoryFilters && (
          <div
            role="tablist"
            aria-label="Filtrar por categoría"
            className="flex flex-wrap items-center gap-2 pt-3 border-t border-border"
          >
            {CATALOGO_FILTER_OPTIONS.map((option) => {
              const active = activeCategory === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(option.id)}
                  className={`min-h-10 px-4 rounded-full text-[14px] font-semibold border cursor-pointer transition-colors active:translate-y-px disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent text-foreground border-border hover:border-primary'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-[20px] bg-card border border-border flex flex-col items-start gap-4">
          <h2 className="font-disp text-[28px] font-bold text-foreground">
            Sin coincidencias en el catálogo
          </h2>
          <p className="text-[16px] text-muted-foreground max-w-[52ch]">
            No encontramos modelos con esos filtros. Podés restablecer la búsqueda o consultarnos directo por WhatsApp si buscás un modelo por encargo.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-12 px-5 rounded-full border border-border text-foreground font-semibold text-[15px] cursor-pointer hover:border-primary active:translate-y-px focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              Restablecer filtros
            </button>
            <a
              href={whatsAppCustomHref(query.trim())}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-12 px-6 rounded-full bg-primary text-primary-foreground font-bold text-[15px] inline-flex items-center gap-2 no-underline hover:opacity-90 active:translate-y-px focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border border-t border-b border-border">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="py-5 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,3fr)] gap-3 md:gap-5 items-center"
            >
              <div className="min-w-0">
                <h2 className="font-disp text-[22px] font-bold leading-[1.15] text-foreground">
                  <Link
                    href={`/camiseta/${item.slug}`}
                    className="no-underline hover:text-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  >
                    {item.title}
                  </Link>
                </h2>
                <p className="text-[14px] text-muted-foreground mt-1">
                  {item.shortDesc}
                </p>
              </div>

              <div className="text-[14px] text-muted-foreground flex flex-col gap-0.5">
                <span className="text-foreground font-medium">
                  {item.brand ? `${item.brand}, ${item.version}` : item.version}
                </span>
                <span>Talles: {item.availableSizes.join(', ')}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="font-mono-cl tabular-nums text-[15px] font-bold text-primary">
                  {resolvePriceLabel(item)}
                </span>
                <span className="text-[13px] text-muted-foreground">{item.status}</span>
              </div>

              <div className="flex flex-wrap items-center md:justify-end gap-2.5">
                <Link
                  href={`/camiseta/${item.slug}`}
                  className="min-h-10 px-4 rounded-full border border-border text-[14px] font-semibold text-foreground no-underline inline-flex items-center gap-1 hover:border-primary active:translate-y-px focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 whitespace-nowrap"
                >
                  <span>Ver ficha</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <a
                  href={whatsAppItemHref(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-10 px-4 rounded-full bg-primary text-primary-foreground text-[14px] font-bold no-underline inline-flex items-center gap-1.5 hover:opacity-90 active:translate-y-px focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Consultar</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
