import { MapPin, MessageCircle, Truck } from 'lucide-react';
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
import {
  COMMERCIAL_INFO,
  DEPARTAMENTOS_URUGUAY,
  WHATSAPP_NUMBER_RAW,
} from '@/lib/futbolenlapiel-data';

export const metadata = {
  title: 'Envíos — Fútbol en la Piel',
  description:
    'Envíos a todo Uruguay: entregas en Montevideo y despachos por agencia a los 19 departamentos.',
};

export default function EnviosPage() {
  const whatsAppHref = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    'Hola Fútbol en la Piel! Quiero consultar costos y plazos de envío a mi departamento.'
  )}`;

  return (
    <PageShell
      badge="Cobertura nacional"
      title="ENVÍOS A TODO URUGUAY"
      description="Entregas coordinadas en Montevideo y envíos por agencia a los 19 departamentos del país."
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

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="size-4" />
            <span className="font-mono-cl text-xs uppercase tracking-wider">19 departamentos</span>
          </div>
          <CardTitle className="font-disp text-2xl font-bold">Cobertura en todo el país</CardTitle>
          <CardDescription>
            Despachamos por agencia al interior y coordinamos punto o entrega en Montevideo.
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
