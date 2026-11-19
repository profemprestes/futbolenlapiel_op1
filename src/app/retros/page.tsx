import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import CatalogoExplorer from '@/components/CatalogoExplorer';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';

export const metadata = {
  title: 'Retros — Fútbol en la Piel',
  description:
    'Colección retro de @futbolenlapieluy1: clásicos de 1988 a 2018 con dorsales icónicos y su historia.',
};

export default function RetrosPage() {
  const customRetroHref = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    'Hola Fútbol en la Piel! Estoy buscando una camiseta retro que no veo publicada en la web.'
  )}`;

  return (
    <PageShell
      badge="Colección Retro · 1988–2018"
      title="CLÁSICOS CON HISTORIA"
      description="Camisetas retro de época (fines de los 80, años 90 y 2000/2010) con dorsales legendarios, etiquetas de fábrica y detalles fieles al modelo original."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Filtrá por década, equipo o jugador para ver contexto histórico y disponibilidad.
        </p>
        <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/tienda" />}>
          Ver catálogo completo
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>

      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground font-mono-cl">Cargando retros...</p>
        }
      >
        <CatalogoExplorer lockedCategory="retros" hideCategoryFilters showDecadeFilters />
      </Suspense>

      <Card className="bg-card/80 border-border">
        <CardHeader>
          <CardTitle className="font-disp text-2xl font-bold">
            ¿Buscás una retro que no está publicada?
          </CardTitle>
          <CardDescription>
            Escribinos por WhatsApp con el equipo, año y dorsal que estás buscando y te confirmamos
            si podemos conseguirla por encargo.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="rounded-full font-bold"
            render={<a href={customRetroHref} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircle data-icon="inline-start" />
            Pedir retro por encargo
          </Button>
        </CardFooter>
      </Card>
    </PageShell>
  );
}
