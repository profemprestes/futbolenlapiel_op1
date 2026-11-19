import Link from 'next/link';
import { ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react';
import PageShell from '@/components/PageShell';
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
import {
  CATALOG_CATEGORIES,
  MODELOS,
  SIZES,
  VERSION_OPTIONS,
  WHATSAPP_NUMBER_RAW,
} from '@/lib/futbolenlapiel-data';

export const metadata = {
  title: 'Tienda / Stock — Fútbol en la Piel',
  description:
    'Explorá el stock y las categorías disponibles en Uruguay: camisetas actuales 2026, Uruguay, clubes y retros.',
};

function whatsAppQueryHref(item: string) {
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    `Hola Fútbol en la Piel! Quiero consultar stock y talle disponible para: ${item}.`
  )}`;
}

export default function TiendaPage() {
  return (
    <PageShell
      badge="Tienda / Stock"
      title="CATÁLOGO Y STOCK DISPONIBLE"
      description="Camisetas actuales de selecciones y clubes, La Celeste 2026 y ediciones especiales. Talles S a XL en versión Jugador o Fan, con confirmación directa por WhatsApp."
    >
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-disp font-bold text-2xl tracking-tight text-foreground">
            Categorías principales
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {SIZES.map((size) => (
              <Badge key={size} variant="outline" className="font-mono-cl">
                Talle {size}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CATALOG_CATEGORIES.map((category) => (
            <Card key={category.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="font-disp text-2xl font-bold text-foreground">
                    {category.title}
                  </CardTitle>
                  <Badge variant="secondary">Stock a confirmar</Badge>
                </div>
                <CardDescription>{category.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-foreground/90 leading-relaxed">
                  <span className="font-semibold text-primary">Ejemplos:</span> {category.examples}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {VERSION_OPTIONS.slice(0, 2).map((ver) => (
                    <Badge key={ver} variant="outline" className="text-xs">
                      {ver}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-between gap-3 pt-4 border-t border-border/60">
                <Button
                  size="sm"
                  className="rounded-full font-semibold"
                  render={
                    <a
                      href={whatsAppQueryHref(category.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <MessageCircle data-icon="inline-start" />
                  Consultar {category.title}
                </Button>
                {category.id === 'retros' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    render={<Link href="/retros" />}
                  >
                    Ver Retros
                    <ArrowUpRight data-icon="inline-end" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-disp font-bold text-2xl tracking-tight text-foreground">
            Destacadas en vitrina
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono-cl">
            <ShieldCheck className="size-4 text-primary" />
            Disponibilidad según publicación
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MODELOS.map((modelo) => (
            <Card key={modelo.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono-cl">
                    #{modelo.num}
                  </Badge>
                  <Badge variant="secondary">{modelo.availabilityLabel}</Badge>
                </div>
                <CardTitle className="font-disp text-xl font-bold pt-1">
                  {modelo.name}
                </CardTitle>
                <CardDescription>{modelo.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-mono-cl text-primary">{modelo.priceLabel}</p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full"
                  render={
                    <a
                      href={whatsAppQueryHref(modelo.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <MessageCircle data-icon="inline-start" />
                  Consultar talle y precio
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
