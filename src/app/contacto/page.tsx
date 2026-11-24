import { ArrowUpRight, Clock, Instagram, MapPin, MessageCircle } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
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
  COMMERCIAL_INFO,
  INSTAGRAM_HANDLE,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import { createWhatsAppUrl } from '@/lib/whatsapp';

export const metadata = {
  title: 'Contacto — Fútbol en la Piel',
  description:
    'Contactá a Fútbol en la Piel por WhatsApp o Instagram para consultar stock, talles, retiros en Montevideo y envíos.',
};

export default function ContactoPage() {
  const whatsAppHref = createWhatsAppUrl(
    'Hola Fútbol en la Piel! Te escribo desde la web para consultar por una camiseta.'
  );
  const instagramHref = `https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`;

  return (
    <PageShell
      badge="Atención directa"
      title="CONTACTO"
      description="Atención directa sin intermediarios. Escribinos por WhatsApp o Instagram para confirmar stock, talles, precios y envíos."
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-card border-border">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              Cierre de pedidos
            </Badge>
            <CardTitle className="font-disp text-2xl font-bold pt-1">WhatsApp Directo</CardTitle>
            <CardDescription>
              Cierre de pedidos: stock S–XL, todos los talles por encargo, promociones y envíos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="font-mono-cl text-lg font-bold text-primary">{WHATSAPP_DISPLAY}</p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-primary" />
              Horario de atención: Lunes a Sábado (a confirmar por chat)
            </p>
          </CardContent>
          <CardFooter className="pt-4 border-t border-border/60">
            <Button
              size="lg"
              className="w-full rounded-full font-bold"
              render={<a href={whatsAppHref} target="_blank" rel="noopener noreferrer" />}
            >
              <MessageCircle data-icon="inline-start" />
              Abrir WhatsApp
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Canal principal
            </Badge>
            <CardTitle className="font-disp text-2xl font-bold pt-1">Instagram</CardTitle>
            <CardDescription>
              Lanzamientos, promociones, indumentaria de fútbol y basket, y consultas al privado.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="font-mono-cl text-lg font-bold text-foreground">{INSTAGRAM_HANDLE}</p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              Montevideo, Uruguay · Retiros y entregas a coordinar
            </p>
          </CardContent>
          <CardFooter className="pt-4 border-t border-border/60">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full font-semibold"
              render={<a href={instagramHref} target="_blank" rel="noopener noreferrer" />}
            >
              <Instagram data-icon="inline-start" />
              Ver perfil en Instagram
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </section>

      <Card className="bg-card/80 border-border">
        <CardHeader>
          <CardTitle className="font-disp text-xl font-bold">Información comercial</CardTitle>
          <CardDescription>Medios de pago aceptados y política de cambios</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Medios de pago:</span>{' '}
            {COMMERCIAL_INFO.payments.join(' · ')}
          </p>
          {COMMERCIAL_INFO.sizingAndChanges.map((item) => (
            <p key={item.label}>
              <span className="font-semibold text-foreground">{item.label}:</span> {item.detail}
            </p>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
