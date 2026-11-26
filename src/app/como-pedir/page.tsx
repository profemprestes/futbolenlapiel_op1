import '@/app/nueva/nueva.css';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ComoPedirFormClient from '@/features/pedidos/ComoPedirFormClient';
import {
  BRAND_LOGOS,
  COMMERCIAL_INFO,
  INSTAGRAM_HANDLE,
  PRICE_REFERENCES,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import { createWhatsAppUrl } from '@/lib/whatsapp';

export const metadata = {
  title: 'Cómo pedir — Fútbol en la Piel',
  description:
    'Guía paso a paso y formulario rápido para preparar tu consulta por WhatsApp con modelo, versión y talle elegidos.',
};

const ORDER_STEPS = [
  {
    title: 'Elegís tu camiseta',
    detail:
      'Explorás Tienda o Retros y definís el modelo, la versión (Jugador, Fan o Retro) y tu talle.',
  },
  {
    title: 'Confirmamos stock y precio por WhatsApp',
    detail:
      'Nos escribís con el mensaje prearmado y te confirmamos disponibilidad inmediata o plazo de ingreso.',
  },
  {
    title: 'Coordinamos pago y envío',
    detail:
      'Elegís transferencia, Mercado Pago o efectivo y coordinamos entrega en Montevideo o despacho al Interior.',
  },
] as const;

const AFTER_MESSAGE_POINTS = [
  'Respondemos dentro del horario de atención por orden de llegada.',
  'Te confirmamos si el talle está para entrega inmediata y el precio final.',
  'Si coordinamos envío, te pedimos dirección o agencia de preferencia.',
] as const;

export default function ComoPedirPage() {
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
            <Link href="/tienda" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Tienda
            </Link>
            <Link href="/retros" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Retros
            </Link>
            <Link href="/talles" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Talles
            </Link>
            <Link href="/envios" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Envíos
            </Link>
          </nav>

          <Link href="/nueva" className="nueva-btn-secondary !min-h-10 !px-4 !text-[14px]">
            Ver portada
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Form Split: Steps on left 5 cols, WhatsApp Form on right 7 cols */}
        <section aria-labelledby="como-pedir-h" className="py-12 lg:py-16">
          <div className="nueva-container nueva-form-grid">
            <div className="flex flex-col gap-6">
              <div>
                <h1
                  id="como-pedir-h"
                  className="nueva-display font-extrabold text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.02] tracking-[-0.025em] text-[var(--nh-parchment)]"
                >
                  Cómo pedir tu camiseta
                </h1>
                <p className="text-[1.0625rem] text-[var(--nh-muted)] mt-4 max-w-[44ch]">
                  En tres pasos llegás a WhatsApp con el modelo, la versión y el talle ya definidos, sin registros.
                </p>
              </div>

              <ol className="list-decimal pl-5 divide-y divide-[var(--nh-rule)] border-t border-b border-[var(--nh-rule)]">
                {ORDER_STEPS.map((item) => (
                  <li key={item.title} className="py-4 pl-2">
                    <h2 className="nueva-display font-bold text-[22px] text-[var(--nh-parchment)]">
                      {item.title}
                    </h2>
                    <p className="text-[15px] text-[var(--nh-muted)] mt-1">{item.detail}</p>
                  </li>
                ))}
              </ol>

              <dl className="grid grid-cols-3 gap-4 pt-1">
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
            </div>

            <ComoPedirFormClient />
          </div>
        </section>

        {/* Warm Parchment band: What happens next & Payment methods */}
        <section aria-labelledby="despues-h" className="bg-[var(--nh-parchment)] text-[var(--nh-ink)] py-20">
          <div className="nueva-container grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2
                id="despues-h"
                className="nueva-display font-extrabold text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] pb-4 border-b border-[var(--nh-rule-ink)]"
              >
                Qué pasa después de escribir
              </h2>
              <ul className="list-disc pl-5 space-y-3 pt-5 text-[16px] text-[var(--nh-ink)]/85">
                {AFTER_MESSAGE_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="nueva-display font-extrabold text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] pb-4 border-b border-[var(--nh-rule-ink)]">
                Medios de pago y guías
              </h2>
              <ul className="list-none space-y-3 pt-5 text-[16px] text-[var(--nh-ink)]/90">
                {COMMERCIAL_INFO.payments.map((payment) => (
                  <li key={payment} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--nh-azul)] shrink-0" aria-hidden="true" />
                    <span>{payment}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-6">
                <Link
                  href="/talles"
                  className="inline-flex items-center gap-1.5 min-h-11 px-5 rounded-full border border-[var(--nh-ink)]/30 text-[14px] font-semibold text-[var(--nh-ink)] no-underline hover:bg-[var(--nh-ink)] hover:text-[var(--nh-parchment)] transition-colors"
                >
                  <span>Ver talles y cambios</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/preguntas"
                  className="inline-flex items-center gap-1.5 min-h-11 px-5 rounded-full border border-[var(--nh-ink)]/30 text-[14px] font-semibold text-[var(--nh-ink)] no-underline hover:bg-[var(--nh-ink)] hover:text-[var(--nh-parchment)] transition-colors"
                >
                  <span>Preguntas frecuentes</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--nh-parchment)] text-[var(--nh-ink)] border-t border-[var(--nh-rule-ink)] py-10">
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
            <Link href="/tienda" className="no-underline hover:text-[var(--nh-azul)]">
              Tienda
            </Link>
            <Link href="/retros" className="no-underline hover:text-[var(--nh-azul)]">
              Retros
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
