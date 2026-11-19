'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, MessageCircle, Ruler, ShieldCheck } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import type { CatalogoItem, JerseySize } from '@/lib/catalogo-data';
import { SIZES, WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';

interface CamisetaDetailClientProps {
  item: CatalogoItem;
}

const VERSION_CHOICES = ['Versión Jugador', 'Versión Fan'] as const;

export default function CamisetaDetailClient({ item }: CamisetaDetailClientProps) {
  const defaultVersion = item.version.includes('Jugador') ? 'Versión Jugador' : 'Versión Fan';
  const [selectedVersion, setSelectedVersion] = useState<string>(
    item.category === 'retros' ? item.version : defaultVersion
  );
  const [selectedSize, setSelectedSize] = useState<JerseySize>(item.availableSizes[0] ?? 'M');

  const whatsAppText = [
    `Hola Fútbol en la Piel! Quiero pedir:`,
    `• Camiseta: ${item.title}`,
    `• Versión: ${selectedVersion}`,
    `• Talle: ${selectedSize}`,
    `¿Me confirmás stock, precio y envío?`,
  ].join('\n');

  const whatsAppHref = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(whatsAppText)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Visual / Context Card */}
      <Card className="lg:col-span-6 bg-card border-border">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="font-mono-cl">
              {item.season}
            </Badge>
            <Badge
              variant="outline"
              className="border-primary/50 text-primary bg-primary/10 font-mono-cl"
            >
              {item.status}
            </Badge>
          </div>
          <CardTitle className="font-disp text-3xl font-black pt-2">{item.title}</CardTitle>
          <CardDescription className="text-base text-foreground/85">
            {item.shortDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {item.contextNote && (
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-xs font-mono-cl uppercase text-primary mb-1">Contexto histórico</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{item.contextNote}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-border/70 p-3">
              <p className="text-xs font-mono-cl text-muted-foreground">Equipo / Selección</p>
              <p className="font-semibold text-foreground">{item.team}</p>
            </div>
            <div className="rounded-xl border border-border/70 p-3">
              <p className="text-xs font-mono-cl text-muted-foreground">Marca / Edición</p>
              <p className="font-semibold text-foreground">{item.brand ?? item.version}</p>
            </div>
            {item.dorsal && (
              <div className="rounded-xl border border-border/70 p-3">
                <p className="text-xs font-mono-cl text-muted-foreground">Dorsal</p>
                <p className="font-semibold text-primary">{item.dorsal}</p>
              </div>
            )}
            <div className="rounded-xl border border-border/70 p-3">
              <p className="text-xs font-mono-cl text-muted-foreground">Precio</p>
              <p className="font-semibold text-foreground">{item.priceLabel}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border/60 pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            render={<a href={item.instagramUrl} target="_blank" rel="noopener noreferrer" />}
          >
            Ver carrusel de fotos reales en Instagram
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>

      {/* Right: Version + Size Selector + WhatsApp CTA */}
      <Card className="lg:col-span-6 bg-card border-border">
        <CardHeader>
          <CardTitle className="font-disp text-2xl font-bold">
            Elegí versión y talle
          </CardTitle>
          <CardDescription>
            Armá tu consulta y abrí WhatsApp con el mensaje ya listo.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Version */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-cl uppercase text-muted-foreground">Versión</span>
              <Link
                href="/talles"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Ruler className="size-3.5" />
                Jugador vs. Fan
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {(item.category === 'retros' ? [item.version] : VERSION_CHOICES).map((ver) => (
                <Button
                  key={ver}
                  type="button"
                  size="sm"
                  variant={selectedVersion === ver ? 'default' : 'outline'}
                  onClick={() => setSelectedVersion(ver)}
                  className="rounded-full"
                >
                  {ver}
                </Button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-cl uppercase text-muted-foreground">Talle</span>
              <Link href="/talles" className="text-xs text-primary hover:underline">
                Ver tabla de medidas
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const available = item.availableSizes.includes(size);
                return (
                  <Button
                    key={size}
                    type="button"
                    size="sm"
                    disabled={!available}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                    className="rounded-full min-w-12 font-mono-cl"
                  >
                    {size}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground/90">
              <CheckCircle2 className="size-4 text-primary shrink-0" />
              <span>Incluye etiquetas y terminaciones bordadas/termoselladas según versión.</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/90">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>Envíos a Montevideo y a los 19 departamentos por agencia.</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-3 pt-4 border-t border-border/60">
          <Button
            size="lg"
            className="w-full rounded-full font-bold"
            render={<a href={whatsAppHref} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircle data-icon="inline-start" />
            Pedir por WhatsApp ({selectedSize})
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Nada en esta página cobra ni reserva stock automáticamente. Confirmamos por WhatsApp.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
