'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowUpRight, MessageCircle, Search, X } from 'lucide-react';
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
import { CATALOGO_FILTER_OPTIONS, CATALOGO_ITEMS, type CatalogoItem } from '@/lib/catalogo-data';
import { type CatalogCategoryId, WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';

interface CatalogoExplorerProps {
  lockedCategory?: CatalogCategoryId;
  hideCategoryFilters?: boolean;
}

const VALID_CATEGORIES = new Set<string>(['actuales', 'retros', 'uruguay', 'clubes']);

function whatsAppItemHref(item: CatalogoItem) {
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    `Hola Fútbol en la Piel! Quiero consultar disponibilidad, talle y precio de: ${item.title}.`
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
  const [query, setQuery] = useState('');

  const activeCategory = lockedCategory ?? selectedCategory;

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOGO_ITEMS.filter((item) => {
      if (activeCategory !== 'todas' && item.category !== activeCategory) {
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
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, query]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search + Category Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar equipo, jugador, dorsal o año..."
              aria-label="Buscar camisetas en el catálogo"
              className="h-10 pl-9 pr-9 rounded-full bg-card border-border text-foreground"
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

          <p className="text-xs font-mono-cl text-muted-foreground">
            Mostrando <span className="text-foreground font-bold">{filteredItems.length}</span>{' '}
            {filteredItems.length === 1 ? 'camiseta' : 'camisetas'}
          </p>
        </div>

        {!hideCategoryFilters && (
          <div
            role="group"
            aria-label="Filtrar por categoría"
            className="flex flex-wrap items-center gap-2"
          >
            {CATALOGO_FILTER_OPTIONS.map((option) => {
              const isSelected = activeCategory === option.id;
              return (
                <Button
                  key={option.id}
                  type="button"
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(option.id)}
                  className="rounded-full"
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <Card className="bg-card/80 border-border py-6">
          <CardHeader className="text-center items-center">
            <CardTitle className="font-disp text-2xl font-bold">
              No encontramos camisetas con ese filtro
            </CardTitle>
            <CardDescription className="max-w-md">
              Probá con otro equipo, jugador o año, o consultanos directo por WhatsApp si buscás un
              modelo puntual.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                setQuery('');
                if (!lockedCategory) setSelectedCategory('todas');
              }}
            >
              Ver todo el catálogo
            </Button>
            <Button
              size="sm"
              className="rounded-full font-semibold"
              render={
                <a
                  href={whatsAppCustomHref(query.trim())}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircle data-icon="inline-start" />
              Consultar por WhatsApp
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-card border-border flex flex-col justify-between">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono-cl">
                    {item.season}
                  </Badge>
                  <Badge variant="secondary">{item.version}</Badge>
                </div>
                <CardTitle className="font-disp text-xl font-bold pt-1 leading-snug">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-foreground/80 leading-relaxed">
                  {item.shortDesc}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-1.5">
                {item.brand && (
                  <Badge variant="outline" className="text-[11px]">
                    {item.brand}
                  </Badge>
                )}
                {item.dorsal && (
                  <Badge variant="outline" className="text-[11px] text-primary border-primary/40">
                    {item.dorsal}
                  </Badge>
                )}
                <Badge variant="outline" className="text-[11px] font-mono-cl">
                  {item.sizesLabel}
                </Badge>
              </CardContent>

              <CardFooter className="justify-between gap-2 pt-4 border-t border-border/60">
                <Button
                  size="sm"
                  className="rounded-full font-semibold"
                  render={
                    <a
                      href={whatsAppItemHref(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <MessageCircle data-icon="inline-start" />
                  Consultar stock
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                  render={
                    <a href={item.instagramUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  Ver fotos
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
