import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';

export const metadata = {
  title: 'Preguntas frecuentes — Fútbol en la Piel',
  description:
    'Dudas frecuentes sobre calidad, talles Jugador vs Fan, personalización, envíos a todo Uruguay, pagos y pedidos por encargo.',
};

const FAQS = [
  {
    q: '¿Qué calidad tienen las camisetas?',
    a: 'Trabajamos camisetas actuales y retros importadas de excelente confección, con etiquetas, escudos y detalles fieles según cada edición (Versión Jugador termosellada o Versión Fan bordada).',
  },
  {
    q: '¿Cómo elijo entre Versión Jugador y Versión Fan?',
    a: 'La Versión Jugador tiene corte más entallado y tela deportiva liviana; la Versión Fan tiene calce clásico más holgado y escudo bordado. Si dudás entre dos talles en Jugador, conviene subir uno.',
  },
  {
    q: '¿Puedo pedirla personalizada con nombre y número?',
    a: 'Muchos modelos ya vienen con dorsales icónicos (como Messi, Haaland, Valverde, Cantona o Luis Enrique). Si buscás un dorsal puntual, consultanos por WhatsApp para confirmarte disponibilidad o encargo.',
  },
  {
    q: '¿Cuánto demoran los envíos en Montevideo e Interior?',
    a: 'En Montevideo coordinamos entrega o retiro rápido según disponibilidad. Al Interior despachamos por agencia a los 19 departamentos y te pasamos el comprobante apenas sale.',
  },
  {
    q: '¿Qué medios de pago aceptan y cuándo se paga?',
    a: 'Aceptamos transferencia bancaria, Mercado Pago y efectivo (a coordinar según entrega). Primero confirmamos stock y talle por WhatsApp; recién después coordinamos el pago.',
  },
  {
    q: '¿Puedo encargar un modelo que no está en el catálogo?',
    a: 'Sí. Si buscás un club, selección o retro específica que no ves publicada, escribinos por WhatsApp con el modelo, año y talle y te avisamos si podemos traerla por encargo.',
  },
  {
    q: '¿Tienen cambios por talle?',
    a: 'Sí, sujeto a disponibilidad de stock, siempre que la prenda esté sin uso y con etiqueta original. Podés ver el detalle completo en Talles y cambios.',
  },
] as const;

export default function PreguntasPage() {
  const whatsAppHref = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    'Hola Fútbol en la Piel! Tengo una consulta antes de hacer mi pedido.'
  )}`;

  return (
    <PageShell
      badge="Dudas frecuentes"
      title="PREGUNTAS FRECUENTES"
      description="Todo lo que necesitás saber sobre talles, calidad, envíos a todo Uruguay, medios de pago y encargos antes de escribirnos."
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FAQS.map((item) => (
          <Card key={item.q} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-disp text-xl font-bold leading-snug">{item.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/85 leading-relaxed">{item.a}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          className="rounded-full font-bold"
          render={<a href={whatsAppHref} target="_blank" rel="noopener noreferrer" />}
        >
          <MessageCircle data-icon="inline-start" />
          Sacarme una duda por WhatsApp
        </Button>
        <Button variant="outline" size="lg" className="rounded-full" render={<Link href="/talles" />}>
          Ver guía de talles
        </Button>
      </div>
    </PageShell>
  );
}
