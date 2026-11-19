import Link from 'next/link';
import { ArrowUpRight, History, MessageCircle } from 'lucide-react';
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
import { MODELOS, WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';

export const metadata = {
  title: 'Retros — Fútbol en la Piel',
  description:
    'Camisetas retro clásicas de 1988 a 2011 con dorsales icónicos en Uruguay. Consultá disponibilidad por WhatsApp.',
};

const RETRO_HIGHLIGHTS = [
  {
    era: '1996',
    title: 'Manchester United 1996 — Cantona 7',
    detail: 'Cuello clásico y dorsal histórico #7 de Eric Cantona.',
    tag: 'Clásico Premier',
  },
  {
    era: '1996',
    title: 'España 1996 — Luis Enrique 21',
    detail: 'Edición Euro 1996 con dorsal #21.',
    tag: 'Selección Retro',
  },
  {
    era: '1994',
    title: 'Brasil 1994 — Tetracampeón',
    detail: 'Diseño icónico del Mundial USA 1994.',
    tag: 'Mundiales',
  },
  {
    era: '1988–2011',
    title: 'Otras joyas retro a pedido',
    detail: 'Consultá por clubes europeos, sudamericanos y selecciones históricas.',
    tag: 'A pedido',
  },
] as const;

function whatsAppRetroHref(modelo: string) {
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    `Hola Fútbol en la Piel! Quiero consultar por la camiseta retro: ${modelo}.`
  )}`;
}

export default function RetrosPage() {
  const retroModelos = MODELOS.filter((m) => m.id !== 'uruguay');

  return (
    <PageShell
      badge="Colección Retro"
      title="CLÁSICOS 1988–2011"
      description="Camisetas retro con dorsales icónicos y detalles de época. Consultá stock inmediato o disponibilidad por encargo directo en Uruguay."
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {RETRO_HIGHLIGHTS.map((item) => (
          <Card key={item.title} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="font-mono-cl">
                  <History data-icon="inline-start" />
                  {item.era}
                </Badge>
                <Badge variant="secondary">{item.tag}</Badge>
              </div>
              <CardTitle className="font-disp text-2xl font-bold pt-1">{item.title}</CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-4 border-t border-border/60">
              <Button
                size="sm"
                className="rounded-full font-semibold"
                render={
                  <a
                    href={whatsAppRetroHref(item.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircle data-icon="inline-start" />
                Consultar esta retro
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-disp font-bold text-2xl text-foreground">
            Modelos retro en portada 3D
          </h2>
          <Button variant="ghost" size="sm" className="rounded-full" render={<Link href="/" />}>
            Ver en experiencia 3D
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {retroModelos.map((modelo) => (
            <Card key={modelo.id} className="bg-card/80 border-border">
              <CardHeader>
                <CardTitle className="font-disp text-xl font-bold">{modelo.name}</CardTitle>
                <CardDescription>{modelo.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-mono-cl text-primary">{modelo.priceLabel}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
