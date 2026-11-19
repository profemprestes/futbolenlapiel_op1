import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Instagram,
  MessageCircle,
  Ruler,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import CamisetaImage from '@/components/CamisetaImage';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SiteNavbar from '@/components/SiteNavbar';
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
import { Separator } from '@/components/ui/separator';
import { CATALOGO_ITEMS } from '@/lib/catalogo-data';
import {
  CATALOG_CATEGORIES,
  COMMERCIAL_INFO,
  INSTAGRAM_HANDLE,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER_RAW,
} from '@/lib/futbolenlapiel-data';
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/lib/navigation';

const FEATURED_IDS = [4, 1, 3, 5, 18, 22];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Elegís',
    desc: 'Buscás tu camiseta en Tienda / Stock o Retros y definís versión y talle.',
  },
  {
    step: '02',
    title: 'Confirmamos por WhatsApp',
    desc: 'Nos llega tu consulta ya armada y te confirmamos stock y precio al instante.',
  },
  {
    step: '03',
    title: 'Coordinamos pago y envío',
    desc: 'Pagás por transferencia, Mercado Pago o efectivo y coordinamos entrega o agencia.',
  },
] as const;

const HOME_FAQS = [
  {
    q: '¿Qué calidad tienen las camisetas?',
    a: 'Camisetas actuales y retros importadas con etiquetas, escudos y terminaciones fieles según versión.',
  },
  {
    q: '¿Cuál es la diferencia entre Jugador y Fan?',
    a: 'Jugador es más entallada y termosellada; Fan tiene calce clásico y escudo bordado.',
  },
  {
    q: '¿Hacen envíos a todo Uruguay?',
    a: 'Sí. Entregas coordinadas en Montevideo y envíos por agencia a los 19 departamentos.',
  },
  {
    q: '¿Cuándo se paga el pedido?',
    a: 'Recién después de confirmar stock y talle por WhatsApp. Nada en la web cobra por adelantado.',
  },
] as const;

export default function HomePage() {
  const featured = CATALOGO_ITEMS.filter((item) => FEATURED_IDS.includes(item.id));
  const whatsappHeroHref = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    'Hola Fútbol en la Piel! Quiero consultar por stock y talles disponibles.'
  )}`;
  const instagramHref = `https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNavbar isHome />

      <main className="flex-1 w-[min(1180px,calc(100%-32px))] mx-auto pt-28 pb-20 flex flex-col gap-16">
        {/* 1. Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <Badge variant="secondary" className="w-fit font-mono-cl">
              {INSTAGRAM_HANDLE} · URUGUAY
            </Badge>
            <h1 className="font-disp font-black text-[clamp(40px,5.6vw,72px)] leading-[0.94] tracking-[-0.02em] text-foreground">
              Camisetas de fútbol actuales y retros. Envíos a todo Uruguay.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
              Elegí el modelo, versión (Jugador o Fan) y talle S a XL. Confirmamos stock y precio
              directo por WhatsApp sin vueltas.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                size="lg"
                className="rounded-full font-bold px-6"
                render={<a href={whatsappHeroHref} target="_blank" rel="noopener noreferrer" />}
              >
                <MessageCircle data-icon="inline-start" />
                Pedir por WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6"
                render={<Link href="/tienda" />}
              >
                <ShoppingBag data-icon="inline-start" />
                Ver camisetas
              </Button>
            </div>
          </div>

          <Card className="lg:col-span-5 bg-card/80 border-border overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <div className="w-full aspect-[16/10] flex items-center justify-center rounded-xl bg-secondary/40 p-4">
                <CamisetaImage
                  modelo="uruguay"
                  alt="Camiseta Uruguay 2026 Mundial celeste tradicional"
                  className="w-full h-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.65)]"
                  priority
                />
              </div>
              <div className="w-full flex items-center justify-between gap-2 text-xs font-mono-cl">
                <span className="text-primary font-bold">URUGUAY 2026 MUNDIAL</span>
                <Link href="/emblema" className="text-muted-foreground hover:text-primary">
                  Ver emblema 3D →
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 2. Categorías */}
        <section className="flex flex-col gap-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-disp font-bold text-3xl text-foreground">Categorías</h2>
              <p className="text-sm text-muted-foreground">
                Entrá directo a la grilla filtrada según lo que estás buscando.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATALOG_CATEGORIES.map((cat) => {
              const targetHref =
                cat.id === 'retros' ? '/retros' : `/tienda?categoria=${cat.id}`;
              return (
                <Card key={cat.id} className="bg-card border-border flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="font-disp text-2xl font-bold">{cat.title}</CardTitle>
                    <CardDescription>{cat.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cat.examples}</p>
                  </CardContent>
                  <CardFooter className="pt-3 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-full"
                      render={<Link href={targetHref} />}
                    >
                      Explorar {cat.title}
                      <ArrowUpRight data-icon="inline-end" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 3. Camisetas destacadas */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-disp font-bold text-3xl text-foreground">Camisetas destacadas</h2>
              <p className="text-sm text-muted-foreground">
                Modelos más consultados de temporada 2026 y clásicos retros.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full" render={<Link href="/tienda" />}>
              Ver las {CATALOGO_ITEMS.length} camisetas
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((item) => (
              <Card key={item.id} className="bg-card border-border flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono-cl">
                      {item.season}
                    </Badge>
                    <Badge variant="secondary">{item.version}</Badge>
                  </div>
                  <CardTitle className="font-disp text-xl font-bold pt-1">
                    <Link href={`/camiseta/${item.slug}`} className="no-underline hover:text-primary">
                      {item.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{item.shortDesc}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-xs font-mono-cl">
                  <span className="text-muted-foreground">Talles: {item.availableSizes.join(' · ')}</span>
                  <span className="text-primary font-bold">{item.status}</span>
                </CardContent>
                <CardFooter className="justify-between gap-2 pt-3 border-t border-border/60">
                  <Button
                    size="sm"
                    className="rounded-full font-semibold"
                    render={
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
                          `Hola Fútbol en la Piel! Quiero consultar por "${item.title}" (${item.version}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <MessageCircle data-icon="inline-start" />
                    Pedir
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    render={<Link href={`/camiseta/${item.slug}`} />}
                  >
                    Ver ficha
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. Cómo funciona */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-disp font-bold text-3xl text-foreground">Cómo funciona</h2>
            <Button variant="ghost" size="sm" className="rounded-full" render={<Link href="/como-pedir" />}>
              Armar consulta paso a paso
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((item) => (
              <Card key={item.step} className="bg-card/80 border-border">
                <CardHeader>
                  <Badge variant="outline" className="w-fit font-mono-cl text-primary border-primary/40">
                    {item.step}
                  </Badge>
                  <CardTitle className="font-disp text-2xl font-bold pt-1">{item.title}</CardTitle>
                  <CardDescription className="text-foreground/85">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. Jugador vs Fan + Envíos y pagos */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="bg-card border-border flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Ruler className="size-4" />
                <span className="font-mono-cl text-xs uppercase tracking-wider">Talles S a XL</span>
              </div>
              <CardTitle className="font-disp text-2xl font-bold">Jugador vs. Fan</CardTitle>
              <CardDescription>
                Versión Jugador ofrece corte más entallado y tela liviana; Versión Fan tiene calce
                clásico y escudo bordado.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-3 border-t border-border/60">
              <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/talles" />}>
                Ver guía de talles y cambios
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-card border-border flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Truck className="size-4" />
                <span className="font-mono-cl text-xs uppercase tracking-wider">Todo Uruguay</span>
              </div>
              <CardTitle className="font-disp text-2xl font-bold">Envíos y pagos</CardTitle>
              <CardDescription>
                Montevideo (entrega o retiro) e Interior por agencia. Pagás por{' '}
                {COMMERCIAL_INFO.payments.join(', ')}.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-3 border-t border-border/60">
              <Button variant="outline" size="sm" className="rounded-full" render={<Link href="/envios" />}>
                Ver detalles de envíos y pagos
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* 6. Prueba social */}
        <Card className="bg-card/80 border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Instagram className="size-4" />
              <span className="font-mono-cl text-xs uppercase tracking-wider">
                {INSTAGRAM_HANDLE}
              </span>
            </div>
            <CardTitle className="font-disp text-2xl font-bold">
              Fotos reales de cada ingreso en Instagram
            </CardTitle>
            <CardDescription>
              Más de 48 carruseles con fotos reales sobre pasto sintético y entregas en todo el país.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              render={<a href={instagramHref} target="_blank" rel="noopener noreferrer" />}
            >
              <Instagram data-icon="inline-start" />
              Seguir a {INSTAGRAM_HANDLE}
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>

        {/* 7. Preguntas frecuentes + cierre */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-disp font-bold text-3xl text-foreground">Preguntas frecuentes</h2>
            <Button variant="ghost" size="sm" className="rounded-full" render={<Link href="/preguntas" />}>
              Ver todas las preguntas
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOME_FAQS.map((faq) => (
              <Card key={faq.q} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-disp text-lg font-bold">{faq.q}</CardTitle>
                  <CardDescription className="text-foreground/85">{faq.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="bg-secondary/50 border-primary/30 mt-2">
            <CardHeader>
              <CardTitle className="font-disp text-3xl font-black">
                ¿Ya sabés cuál querés?
              </CardTitle>
              <CardDescription className="text-base text-foreground/85">
                Escribinos por WhatsApp con el modelo, versión y talle y te confirmamos stock en el
                momento.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-full font-bold"
                render={<a href={whatsappHeroHref} target="_blank" rel="noopener noreferrer" />}
              >
                <MessageCircle data-icon="inline-start" />
                Pedir por WhatsApp ({WHATSAPP_DISPLAY})
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" render={<Link href="/como-pedir" />}>
                <CheckCircle2 data-icon="inline-start" />
                Preparar consulta guiada
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border bg-card/40">
        <div className="w-[min(1180px,calc(100%-32px))] mx-auto py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-archivo text-sm tracking-wide text-foreground">
              FUTBOL EN LA PIEL
            </span>
            <span className="text-xs text-muted-foreground font-mono-cl">
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                {INSTAGRAM_HANDLE}
              </a>{' '}
              ·{' '}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER_RAW}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </span>
          </div>

          <nav aria-label="Navegación de pie de página" className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-muted-foreground hover:text-primary no-underline transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {SECONDARY_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-muted-foreground hover:text-primary no-underline transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
