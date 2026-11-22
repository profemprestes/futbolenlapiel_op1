import { Suspense } from 'react';
import { ShieldCheck } from 'lucide-react';
import CatalogoExplorer from '@/features/catalogo/CatalogoExplorer';
import PageShell from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/badge';
import { SIZES } from '@/lib/config/brand';

export const metadata = {
  title: 'Tienda / Stock — Fútbol en la Piel',
  description:
    'Catálogo completo de @futbolenlapieluy1 en Uruguay: camisetas actuales 2026, La Celeste, clubes y retros con consulta directa por WhatsApp.',
};

export default function TiendaPage() {
  return (
    <PageShell
      badge="Tienda / Stock · @futbolenlapieluy1"
      title="CATÁLOGO COMPLETO"
      description="Las 48 camisetas publicadas en nuestro catálogo: selecciones 2026, La Celeste, clubes uruguayos y europeos, y clásicos retros. Consultá talle y disponibilidad directa por WhatsApp."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {SIZES.map((size) => (
            <Badge key={size} variant="outline" className="font-mono-cl">
              Talle {size}
            </Badge>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono-cl">
          <ShieldCheck className="size-4 text-primary" />
          Stock y talle a confirmar por WhatsApp
        </span>
      </div>

      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground font-mono-cl">Cargando catálogo...</p>
        }
      >
        <CatalogoExplorer />
      </Suspense>
    </PageShell>
  );
}
