import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CamisetaDetailClient from '@/features/catalogo/CamisetaDetailClient';
import PageShell from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CATALOGO_ITEMS,
  getCatalogoItemBySlug,
  getRelatedCatalogoItems,
} from '@/lib/catalogo-utils';

export function generateStaticParams() {
  return CATALOGO_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCatalogoItemBySlug(slug);
  if (!item) {
    return { title: 'Camiseta no encontrada — Fútbol en la Piel' };
  }
  return {
    title: `${item.title} — Fútbol en la Piel`,
    description: item.shortDesc,
  };
}

export default async function CamisetaSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCatalogoItemBySlug(slug);
  if (!item) notFound();

  const related = getRelatedCatalogoItems(item, 3);

  return (
    <PageShell
      badge={`Ficha · ${item.team} · ${item.season}`}
      title={item.title}
      description={item.shortDesc}
    >
      <div>
        <Button variant="ghost" size="sm" className="rounded-full" render={<Link href="/tienda" />}>
          <ArrowLeft data-icon="inline-start" />
          Volver a Tienda / Stock
        </Button>
      </div>

      <CamisetaDetailClient item={item} />

      {related.length > 0 && (
        <section className="flex flex-col gap-4 pt-4">
          <h2 className="font-disp font-bold text-2xl text-foreground">
            Camisetas relacionadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((rel) => (
              <Card key={rel.id} className="bg-card border-border flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono-cl">
                      {rel.season}
                    </Badge>
                    <Badge variant="secondary">{rel.version}</Badge>
                  </div>
                  <CardTitle className="font-disp text-xl font-bold pt-1">{rel.title}</CardTitle>
                  <CardDescription>{rel.shortDesc}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-4 border-t border-border/60">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full rounded-full"
                    render={<Link href={`/camiseta/${rel.slug}`} />}
                  >
                    Ver ficha
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
