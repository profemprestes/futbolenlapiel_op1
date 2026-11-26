import '@/app/nueva/nueva.css';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import CatalogoExplorer from '@/features/catalogo/CatalogoExplorer';
import {
  BRAND_LOGOS,
  INSTAGRAM_HANDLE,
  PRICE_REFERENCES,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import { createWhatsAppUrl } from '@/lib/whatsapp';

export const metadata = {
  title: 'Tienda / Stock — Fútbol en la Piel',
  description:
    'Catálogo completo de @futbolenlapieluy1 en Uruguay: camisetas actuales 2026, La Celeste, clubes y retros con consulta directa por WhatsApp.',
};

export default function TiendaPage() {
  return (
    <div className="nueva-shell">
      <header className="sticky top-0 z-30 border-b border-[var(--nh-rule)] bg-[var(--nh-field)]/92 backdrop-blur-md">
        <div className="nueva-container h-[72px] flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Fútbol en la Piel, volver al inicio"
            className="flex items-center gap-3 no-underline shrink-0"
          >
            <Image
              src={BRAND_LOGOS.emblem}
              alt=""
              width={34}
              height={34}
              priority
              className="w-8 h-8 rounded-full border border-[var(--nh-rule)] object-cover"
            />
            <span className="nueva-mark text-[15px] tracking-[-0.01em] text-[var(--nh-parchment)]">
              Fútbol en la Piel
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6 text-[15px]">
            <Link href="/nueva" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Portada
            </Link>
            <Link href="/retros" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Retros
            </Link>
            <Link href="/como-pedir" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Cómo pedir
            </Link>
            <Link href="/talles" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Talles
            </Link>
            <Link href="/envios" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Envíos
            </Link>
          </nav>

          <Link href="/como-pedir" className="nueva-btn-secondary !min-h-10 !px-4 !text-[14px]">
            Pedir ahora
          </Link>
        </div>
      </header>

      <main className="py-12 lg:py-16">
        <div className="nueva-container flex flex-col gap-10">
          <section aria-labelledby="tienda-h" className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--nh-rule)]">
            <div className="max-w-[54ch]">
              <h1
                id="tienda-h"
                className="nueva-display font-extrabold text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.02] tracking-[-0.025em] text-[var(--nh-parchment)]"
              >
                Catálogo completo
              </h1>
              <p className="text-[1.0625rem] text-[var(--nh-muted)] mt-3">
                Selecciones 2026, La Celeste, clubes y clásicos retros con stock S a XL y todos los talles por encargo.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-6 shrink-0">
              <div>
                <dt className="text-[13px] text-[var(--nh-muted)]">Fan</dt>
                <dd className="nueva-mono text-[15px] font-bold text-[var(--nh-parchment)]">
                  {PRICE_REFERENCES.fan}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-[var(--nh-muted)]">Retro</dt>
                <dd className="nueva-mono text-[15px] font-bold text-[var(--nh-parchment)]">
                  {PRICE_REFERENCES.retro}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-[var(--nh-muted)]">Jugador</dt>
                <dd className="nueva-mono text-[15px] font-bold text-[var(--nh-celeste)]">
                  {PRICE_REFERENCES.jugador}
                </dd>
              </div>
            </dl>
          </section>

          <Suspense
            fallback={
              <p className="text-[15px] text-[var(--nh-muted)]">Cargando catálogo...</p>
            }
          >
            <CatalogoExplorer />
          </Suspense>
        </div>
      </main>

      <footer className="bg-[var(--nh-parchment)] text-[var(--nh-ink)] border-t border-[var(--nh-rule-ink)] py-10 mt-12">
        <div className="nueva-container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src={BRAND_LOGOS.horizontal}
              alt="Fútbol en la Piel"
              width={110}
              height={50}
              className="h-10 w-auto object-contain"
            />
            <p className="text-[14px] text-[var(--nh-ink)]/80">
              {INSTAGRAM_HANDLE}, atención directa por{' '}
              <a
                href={createWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-[var(--nh-azul)]/50 hover:text-[var(--nh-azul)]"
              >
                {WHATSAPP_DISPLAY}
              </a>
              .
            </p>
          </div>

          <nav aria-label="Pie de página" className="flex flex-wrap gap-5 text-[14px] font-semibold">
            <Link href="/retros" className="no-underline hover:text-[var(--nh-azul)]">
              Retros
            </Link>
            <Link href="/como-pedir" className="no-underline hover:text-[var(--nh-azul)]">
              Cómo pedir
            </Link>
            <Link href="/talles" className="no-underline hover:text-[var(--nh-azul)]">
              Talles
            </Link>
            <Link href="/envios" className="no-underline hover:text-[var(--nh-azul)]">
              Envíos
            </Link>
            <Link href="/preguntas" className="no-underline hover:text-[var(--nh-azul)]">
              Preguntas
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
