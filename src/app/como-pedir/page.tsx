import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, MessageCircle } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { COMMERCIAL_INFO, SIZES, VERSION_OPTIONS, WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';

export const metadata = {
  title: 'Cómo pedir — Fútbol en la Piel',
  description:
    'Guía paso a paso para consultar stock, elegir versión Jugador o Fan, talle S a XL y coordinar tu pedido por WhatsApp.',
};

const ORDER_STEPS = [
  {
    step: '01',
    title: 'Elegí tu camiseta',
    detail:
      'Buscá entre camisetas actuales 2026, La Celeste, clubes o clásicos retros 1988–2011.',
  },
  {
    step: '02',
    title: 'Definí versión y talle',
    detail:
      'Indicá si preferís Versión Jugador (calce entallado) o Versión Fan (calce clásico), en talles S, M, L o XL.',
  },
  {
    step: '03',
    title: 'Coordiná entrega o envío',
    detail:
      'Contanos si estás en Montevideo o en el Interior para confirmar modalidad de entrega o envío por agencia.',
  },
  {
    step: '04',
    title: 'Confirmá por WhatsApp',
    detail:
      'Te confirmamos disponibilidad, precio final y medios de pago en el momento.',
  },
] as const;

export default function ComoPedirPage() {
  const whatsAppHref = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    'Hola Fútbol en la Piel! Quiero hacer un pedido y consultar disponibilidad.'
  )}`;

  return (
    <PageShell
      badge="Guía de compra"
      title="CÓMO PEDIR TU CAMISETA"
      description="Proceso simple y directo por WhatsApp para confirmar stock, versión, talle y envío en todo Uruguay."
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ORDER_STEPS.map((item) => (
          <Card key={item.step} className="bg-card border-border">
            <CardHeader>
              <Badge variant="outline" className="w-fit font-mono-cl text-primary border-primary/40">
                PASO {item.step}
              </Badge>
              <CardTitle className="font-disp text-2xl font-bold pt-1">{item.title}</CardTitle>
              <CardDescription className="text-foreground/80">{item.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-disp text-xl font-bold">Versiones y talles</CardTitle>
            <CardDescription>Opciones disponibles según publicación</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {VERSION_OPTIONS.map((v) => (
                <Badge key={v} variant="secondary">
                  {v}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <Badge key={s} variant="outline" className="font-mono-cl">
                  {s}
                </Badge>
              ))}
            </div>
            {COMMERCIAL_INFO.sizingAndChanges.map((info) => (
              <p key={info.label} className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{info.label}:</span> {info.detail}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-disp text-xl font-bold">Medios de pago</CardTitle>
            <CardDescription>Coordinamos el pago al confirmar stock</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {COMMERCIAL_INFO.payments.map((payment) => (
              <div key={payment} className="flex items-center gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>{payment}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          className="rounded-full font-bold"
          render={<a href={whatsAppHref} target="_blank" rel="noopener noreferrer" />}
        >
          <MessageCircle data-icon="inline-start" />
          Iniciar pedido por WhatsApp
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full"
          render={<Link href="/#pedido" />}
        >
          Usar formulario rápido en Inicio
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
    </PageShell>
  );
}
