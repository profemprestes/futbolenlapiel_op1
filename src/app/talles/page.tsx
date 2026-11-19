import Link from 'next/link';
import { MessageCircle, Ruler, ShieldCheck } from 'lucide-react';
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
import { WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';

export const metadata = {
  title: 'Talles y cambios — Fútbol en la Piel',
  description:
    'Guía de talles S a XL, diferencias entre Versión Jugador y Versión Fan, y política de cambios en Uruguay.',
};

const SIZE_TABLE = [
  { size: 'S', chest: '48–50 cm', length: '70–72 cm', fit: '1.65–1.73 m' },
  { size: 'M', chest: '51–53 cm', length: '72–74 cm', fit: '1.73–1.80 m' },
  { size: 'L', chest: '54–56 cm', length: '75–77 cm', fit: '1.80–1.86 m' },
  { size: 'XL', chest: '57–59 cm', length: '77–79 cm', fit: '1.86+ m' },
] as const;

export default function TallesPage() {
  const whatsAppHref = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    'Hola Fútbol en la Piel! Tengo dudas con el talle para una camiseta.'
  )}`;

  return (
    <PageShell
      badge="Guía de calce"
      title="TALLES Y CAMBIOS"
      description="Elegí entre Versión Jugador y Versión Fan sin equivocarte, revisá la tabla de referencia S a XL y conocé nuestra política de cambios."
    >
      {/* Jugador vs Fan */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-card border-border">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              Corte entallado
            </Badge>
            <CardTitle className="font-disp text-2xl font-bold pt-1">Versión Jugador</CardTitle>
            <CardDescription>Pensada para uso deportivo o calce al cuerpo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-foreground/85">
            <p>• Corte más entallado (slim fit) en pecho y cintura.</p>
            <p>• Tela técnica respirable y liviana.</p>
            <p>• Escudo y marca termosellados para mayor ligereza.</p>
            <p className="text-xs text-primary pt-1">
              Tip: si estás entre dos talles o la preferís holgada, pedí un talle más.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Corte clásico
            </Badge>
            <CardTitle className="font-disp text-2xl font-bold pt-1">Versión Fan</CardTitle>
            <CardDescription>Pensada para uso urbano, estadio o colección.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-foreground/85">
            <p>• Calce recto y cómodo (regular fit), igual que tu remera habitual.</p>
            <p>• Tela resistente y suave para uso diario.</p>
            <p>• Escudo y logos bordados con mayor durabilidad.</p>
            <p className="text-xs text-primary pt-1">
              Tip: elegí el talle que usás normalmente en remeras.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Size Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Ruler className="size-4" />
            <span className="font-mono-cl text-xs uppercase tracking-wider">Referencia S a XL</span>
          </div>
          <CardTitle className="font-disp text-2xl font-bold">Tabla de talles orientativa</CardTitle>
          <CardDescription>
            Medidas aproximadas en plano (ancho de axila a axila y largo). Podés pedir medidas
            exactas de un modelo puntual por WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-mono-cl uppercase text-muted-foreground">
                  <th className="py-2.5 pr-4">Talle</th>
                  <th className="py-2.5 pr-4">Ancho (axila a axila)</th>
                  <th className="py-2.5 pr-4">Largo aprox.</th>
                  <th className="py-2.5">Altura orientativa</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_TABLE.map((row) => (
                  <tr key={row.size} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-mono-cl font-bold text-primary">{row.size}</td>
                    <td className="py-3 pr-4">{row.chest}</td>
                    <td className="py-3 pr-4">{row.length}</td>
                    <td className="py-3 text-muted-foreground">{row.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Política de cambios */}
      <Card className="bg-card/80 border-border">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="size-4" />
            <span className="font-mono-cl text-xs uppercase tracking-wider">Cambios</span>
          </div>
          <CardTitle className="font-disp text-2xl font-bold">Política de cambios</CardTitle>
          <CardDescription>Condiciones claras antes de comprar</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-foreground/85">
          <p>• Cambios sujetos a disponibilidad de talle en stock.</p>
          <p>• La prenda debe estar sin uso, sin lavar y con su etiqueta original intacta.</p>
          <p>• El costo de envío por cambio corre por cuenta del comprador (salvo falla o error nuestro).</p>
          <p>• Las camisetas personalizadas con nombre y número a pedido no tienen cambio por talle.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          className="rounded-full font-bold"
          render={<a href={whatsAppHref} target="_blank" rel="noopener noreferrer" />}
        >
          <MessageCircle data-icon="inline-start" />
          Consultar medidas por WhatsApp
        </Button>
        <Button variant="outline" size="lg" className="rounded-full" render={<Link href="/tienda" />}>
          Ir a Tienda / Stock
        </Button>
      </div>
    </PageShell>
  );
}
