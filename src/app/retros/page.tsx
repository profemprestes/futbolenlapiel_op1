import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowUpRight } from 'lucide-react';
import CatalogoExplorer from '@/components/CatalogoExplorer';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Retros — Fútbol en la Piel',
  description:
    'Colección retro de @futbolenlapieluy1: clásicos de 1988 a 2018 con dorsales icónicos como Cantona #7, Luis Enrique #21, Baggio #10, Valderrama #10 y Messi #19.',
};

export default function RetrosPage() {
  return (
    <PageShell
      badge="Colección Retro"
      title="CLÁSICOS HISTÓRICOS"
      description="Camisetas retro de 1988 a 2018 con dorsales icónicos y detalles de época. Filtrá por equipo, jugador o año y consultá disponibilidad por WhatsApp."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Incluye ediciones con etiquetas de fábrica y dorsales históricos.
        </p>
        <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/tienda" />}>
          Ver catálogo completo (48)
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>

      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground font-mono-cl">Cargando retros...</p>
        }
      >
        <CatalogoExplorer lockedCategory="retros" hideCategoryFilters />
      </Suspense>
    </PageShell>
  );
}
