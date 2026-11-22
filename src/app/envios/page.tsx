import { CheckCircle2, MapPin, MessageCircle, ShieldAlert, Truck } from 'lucide-react';
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
import { COMMERCIAL_INFO, DEPARTAMENTOS_URUGUAY } from '@/lib/config/brand';
import { createWhatsAppUrl } from '@/lib/whatsapp';

export const metadata = {
  title: 'Envíos y pagos — Fútbol en la Piel',
  description:
    'Envíos a todo Uruguay (Montevideo e Interior por agencia), medios de pago aceptados y cobertura de reclamos.',
};

export default function EnviosPage() {
  const whatsAppHref = createWhatsAppUrl(
    'Hola Fútbol en la Piel! Quiero consultar costos y plazos de envío a mi departamento.'
  );

  return (
    <PageShell
      badge="Envíos y pagos"
      title="ENVÍOS A TODO URUGUAY"
      description="Entregas coordinadas en Montevideo y envíos por agencia a los 19 departamentos. Confirmamos costo, plazo y pago directo por WhatsApp."
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {COMMERCIAL_INFO.shipping.map((item) => (
          <Card key={item.zone} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Truck className="size-5" />
                <span className="font-mono-cl text-xs uppercase tracking-wider">Zona de entrega</span>
              </div>
              <CardTitle className="font-disp text-2xl font-bold">{item.zone}</CardTitle>
              <CardDescription className="text-foreground/85">{item.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-disp text-2xl font-bold">Medios de pago</CardTitle>
            <CardDescription>
              Primero confirmamos stock; recién después coordinamos el pago.
            </CardDescription>
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

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <ShieldAlert className="size-4" />
              <span className="font-mono-cl text-xs uppercase tracking-wider">Respaldo</span>
            </div>
            <CardTitle className="font-disp text-2xl font-bold">
              ¿Y si llega mal o con demora?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-foreground/85">
            <p>• Si tu pedido tiene un error de talle o modelo atribuible a nosotros, lo cambiamos sin costo de envío.</p>
            <p>• Para envíos al Interior te compartimos el número de seguimiento de la agencia apenas despachamos.</p>
          </CardContent>
        </Card>
      </section>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="size-4" />
            <span className="font-mono-cl text-xs uppercase tracking-wider">19 departamentos</span>
          </div>
          <CardTitle className="font-disp text-2xl font-bold">Cobertura nacional</CardTitle>
          <CardDescription>
            Despachamos por agencia al interior y coordinamos entrega o retiro en Montevideo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {DEPARTAMENTOS_URUGUAY.map((dep) => (
            <Badge key={dep} variant="secondary" className="px-3 py-1">
              {dep}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <div>
        <Button
          size="lg"
          className="rounded-full font-bold"
          render={<a href={whatsAppHref} target="_blank" rel="noopener noreferrer" />}
        >
          <MessageCircle data-icon="inline-start" />
          Consultar envío por WhatsApp
        </Button>
      </div>
    </PageShell>
  );
}
