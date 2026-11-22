import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import ComoPedirFormClient from '@/features/pedidos/ComoPedirFormClient';
import PageShell from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { COMMERCIAL_INFO } from '@/lib/config/brand';

export const metadata = {
  title: 'Cómo pedir — Fútbol en la Piel',
  description:
    'Guía paso a paso y formulario rápido para preparar tu consulta por WhatsApp con modelo, versión y talle elegidos.',
};

const ORDER_STEPS = [
  {
    step: '01',
    title: 'Elegís tu camiseta',
    detail:
      'Explorás Tienda / Stock o Retros y definís el modelo, la versión (Jugador o Fan) y tu talle.',
  },
  {
    step: '02',
    title: 'Confirmamos stock y precio por WhatsApp',
    detail:
      'Nos escribís con el mensaje prearmado y te confirmamos disponibilidad inmediata o plazo de ingreso.',
  },
  {
    step: '03',
    title: 'Coordinamos pago y envío',
    detail:
      'Elegís transferencia, Mercado Pago o efectivo y coordinamos entrega en Montevideo o despacho al Interior.',
  },
] as const;

export default function ComoPedirPage() {
  return (
    <PageShell
      badge="Guía de compra"
      title="CÓMO PEDIR TU CAMISETA"
      description="En 3 pasos llegás a WhatsApp con el modelo, la versión y el talle ya definidos. Sin checkout complejo ni registros."
    >
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ORDER_STEPS.map((item) => (
          <Card key={item.step} className="bg-card border-border">
            <CardHeader>
              <Badge variant="outline" className="w-fit font-mono-cl text-primary border-primary/40">
                PASO {item.step}
              </Badge>
              <CardTitle className="font-disp text-2xl font-bold pt-1">{item.title}</CardTitle>
              <CardDescription className="text-foreground/85">{item.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <ComoPedirFormClient />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Clock className="size-4" />
              <span className="font-mono-cl text-xs uppercase tracking-wider">Luego de escribir</span>
            </div>
            <CardTitle className="font-disp text-xl font-bold">¿Qué pasa después?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-foreground/85">
            <p>• Respondemos dentro del horario de atención por orden de llegada.</p>
            <p>• Te confirmamos si el talle está para entrega inmediata y el precio final.</p>
            <p>• Si coordinamos envío, te pedimos dirección o agencia de preferencia.</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-disp text-xl font-bold">Medios de pago y talles</CardTitle>
            <CardDescription>Información rápida antes de confirmar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              {COMMERCIAL_INFO.payments.map((payment) => (
                <div key={payment} className="flex items-center gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>{payment}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/talles" />}>
                Ver Talles y cambios
                <ArrowUpRight data-icon="inline-end" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/preguntas" />}>
                Preguntas frecuentes
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
