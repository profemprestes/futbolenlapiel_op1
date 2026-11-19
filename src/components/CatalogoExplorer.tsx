'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { MessageCircle, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  CATALOGO_FILTER_OPTIONS,
  CATALOGO_ITEMS,
  type CatalogoItem,
  type JerseySize,
  RETRO_DECADES,
} from '@/lib/catalogo-data';
import { type CatalogCategoryId, SIZES, WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';
import { cn } from '@/lib/utils';

interface CatalogoExplorerProps {
  lockedCategory?: CatalogCategoryId;
  hideCategoryFilters?: boolean;
  showDecadeFilters?: boolean;
}

const VALID_CATEGORIES = new Set<string>(['actuales', 'retros', 'uruguay', 'clubes']);
const VERSION_FILTERS = ['Todas', 'Versión Jugador', 'Versión Fan', 'Retro', 'Edición especial'] as const;

function extractDorsalNumber(dorsal?: string): string | null {
  if (!dorsal) return null;
  const match = dorsal.match(/\d+/);
  return match ? match[0] : null;
}

function whatsAppItemHref(item: CatalogoItem) {
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    `Hola Fútbol en la Piel! Quiero consultar por "${item.title}" (${item.version}).`
  )}`;
}

function whatsAppCustomHref(query: string) {
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    query
      ? `Hola Fútbol en la Piel! Estoy buscando una camiseta de "${query}". ¿La tienen disponible?`
      : 'Hola Fútbol en la Piel! Quiero consultar por un modelo puntual.'
  )}`;
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
    <div className="flex flex-col gap-7">
      {/* Toolbar */}
      <div className="glass-panel p-4 md:p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar equipo, jugador, dorsal o año..."
              aria-label="Buscar camisetas en el catálogo"
              className="h-10 pl-10 pr-9 rounded-full bg-[#061121]/70 border-[#F5EAD6]/20 text-foreground"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              >
                <X />
              </Button>
            )}
          </div>

          <p className="text-xs font-mono-cl text-muted-foreground tabular-nums">
            <span className="text-primary font-bold">{filteredItems.length}</span>{' '}
            {filteredItems.length === 1 ? 'camiseta encontrada' : 'camisetas encontradas'}
          </p>
        </div>

        {!hideCategoryFilters && (
          <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap items-center gap-2">
            {CATALOGO_FILTER_OPTIONS.map((option) => (
              <Button
                key={option.id}
                type="button"
                size="sm"
                variant={activeCategory === option.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(option.id)}
                className="rounded-full"
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}

        {showDecadeFilters && (
          <div role="group" aria-label="Filtrar por década" className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono-cl text-muted-foreground mr-1">Década:</span>
            {RETRO_DECADES.map((decade) => (
              <Button
                key={decade}
                type="button"
                size="xs"
                variant={selectedDecade === decade ? 'default' : 'outline'}
                onClick={() => setSelectedDecade(decade)}
                className="rounded-full"
              >
                {decade}
              </Button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-t border-[#F5EAD6]/10">
          {!showDecadeFilters && (
            <div role="group" aria-label="Filtrar por versión" className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono-cl text-muted-foreground mr-1">Versión:</span>
              {VERSION_FILTERS.map((ver) => (
                <Button
                  key={ver}
                  type="button"
                  size="xs"
                  variant={selectedVersion === ver ? 'secondary' : 'ghost'}
                  onClick={() => setSelectedVersion(ver)}
                  className="rounded-full"
                >
                  {ver}
                </Button>
              ))}
            </div>
          )}

          <div role="group" aria-label="Filtrar por talle" className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono-cl text-muted-foreground mr-1">Talle:</span>
            {(['Todos', ...SIZES] as const).map((size) => (
              <Button
                key={size}
                type="button"
                size="xs"
                variant={selectedSize === size ? 'secondary' : 'ghost'}
                onClick={() => setSelectedSize(size)}
                className="rounded-full font-mono-cl"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <Card className="glass-panel py-8">
          <CardHeader className="text-center items-center">
            <CardTitle className="font-disp text-2xl font-bold">
              No encontramos camisetas con ese filtro
            </CardTitle>
            <CardDescription className="max-w-md">
              Probá con otro equipo, versión o talle, o consultanos directo por WhatsApp si buscás
              un modelo puntual.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={resetFilters}>
              Ver todo el catálogo
            </Button>
            <Button
              size="sm"
              className="rounded-full font-semibold"
              render={
                <a href={whatsAppCustomHref(query.trim())} target="_blank" rel="noopener noreferrer" />
              }
            >
              <MessageCircle data-icon="inline-start" />
              Consultar por WhatsApp
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const dorsalNum = extractDorsalNumber(item.dorsal);
            return (
              <Card
                key={item.id}
                className="relative overflow-hidden bg-[#0E213E]/85 border-[#F5EAD6]/16 hover:border-[#A8D6F0]/45 transition-colors flex flex-col justify-between"
              >
                {dorsalNum && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute -right-2 -top-4 font-disp font-black text-[96px] leading-none text-[#F5EAD6]/[0.045]"
                  >
                    #{dorsalNum}
                  </span>
                )}

                <CardHeader className="relative z-[1]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="font-mono-cl border-[#F5EAD6]/25">
                        {item.season}
                      </Badge>
                      <Badge variant="secondary">{item.version}</Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[11px] font-mono-cl',
                        item.status === 'Disponible' && 'border-primary/50 text-primary bg-primary/10',
                        item.status === 'Agotado' && 'border-destructive/50 text-destructive'
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <CardTitle className="font-disp text-[22px] font-bold pt-1.5 leading-[1.08] tracking-[-0.01em]">
                    <Link
                      href={`/camiseta/${item.slug}`}
                      className="no-underline hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-foreground/80 leading-relaxed">
                    {item.shortDesc}
                  </CardDescription>
                  {item.contextNote && (
                    <p className="text-xs text-[#A8D6F0]/80 italic pt-1 leading-relaxed">
                      {item.contextNote}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="relative z-[1] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {item.brand && (
                      <Badge variant="outline" className="text-[11px] border-[#F5EAD6]/20">
                        {item.brand}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[11px] font-mono-cl border-[#F5EAD6]/20">
                      {item.availableSizes.join(' · ')}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono-cl font-bold text-primary">
                    {item.priceLabel}
                  </span>
                </CardContent>

                <CardFooter className="relative z-[1] justify-between gap-2 pt-3.5 border-t border-[#F5EAD6]/10">
                  <Button
                    size="sm"
                    className="rounded-full font-semibold"
                    render={
                      <a href={whatsAppItemHref(item)} target="_blank" rel="noopener noreferrer" />
                    }
                  >
                    <MessageCircle data-icon="inline-start" />
                    Consultar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-[#F5EAD6]/20 hover:border-[#A8D6F0]/50"
                    render={<Link href={`/camiseta/${item.slug}`} />}
                  >
                    Ver ficha
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
