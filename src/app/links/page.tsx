import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, Layers, LayoutGrid, Shirt } from 'lucide-react';
import {
  BRAND_LOGOS,
  INSTAGRAM_HANDLE,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import { MODELOS } from '@/lib/data/modelos';
import { createWhatsAppUrl } from '@/lib/whatsapp';

const LANDING_OPTIONS = [
  { href: '/', title: 'Home Principal (Original)', desc: 'Experiencia 3D con scroll interactivo' },
  { href: '/opcion-1', title: 'Opción 01 · Vitrina Editorial', desc: 'Hero asimétrico, tabs de categorías y formulario' },
  { href: '/opcion-2', title: 'Opción 02 · Catálogo Directo', desc: 'Buscador, filtros y selector rápido por tarjeta' },
  { href: '/opcion-3', title: 'Opción 03 · Archivo Retro', desc: 'Cronología 1988–2026 y fichas técnicas' },
  { href: '/opcion-4', title: 'Opción 04 · Configurador 3 Pasos', desc: 'Flujo guiado con resumen en vivo para WhatsApp' },
  { href: '/opcion-5', title: 'Opción 05 · Bento Grid', desc: 'Mosaico social-first pensado para mobile' },
];

const SITE_PAGES = [
  { href: '/tienda', title: 'Tienda', desc: 'Vista de tienda y catálogo' },
  { href: '/retros', title: 'Retros', desc: 'Colección de camisetas retro' },
  { href: '/como-pedir', title: 'Cómo pedir', desc: 'Paso a paso para consultar por WhatsApp' },
  { href: '/talles', title: 'Guía de talles', desc: 'Talles S a XL y diferencia Jugador vs. Fan' },
  { href: '/envios', title: 'Envíos y pagos', desc: 'Montevideo, 19 departamentos y medios de pago' },
  { href: '/preguntas', title: 'Preguntas frecuentes', desc: 'Dudas habituales sobre stock, cambios y envíos' },
  { href: '/contacto', title: 'Contacto', desc: 'Canales directos de atención' },
  { href: '/emblema', title: 'Emblema', desc: 'Vista del emblema oficial 3D' },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#0A1B33] text-[#F5EAD6] py-12 px-[var(--pad)]">
      <div className="max-w-[1120px] mx-auto grid gap-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#8ECBF5]/20">
          <div className="flex items-center gap-4">
            <Image
              src={BRAND_LOGOS.emblem}
              alt="Fútbol en la Piel"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full border border-[#F5EAD6]/25 bg-black object-cover shrink-0"
            />
            <div>
              <p className="font-mono-cl text-[11px] font-bold text-[#A8D6F0] uppercase tracking-[0.08em]">
                {INSTAGRAM_HANDLE} · ÍNDICE DEL SITIO
              </p>
              <h1 className="font-archivo text-[clamp(28px,4vw,44px)] leading-none mt-1">
                LINKS DEL PROYECTO
              </h1>
            </div>
          </div>

          <a
            href={createWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] font-bold text-[13px] no-underline inline-flex items-center gap-1.5 transition-colors"
          >
            WhatsApp {WHATSAPP_DISPLAY} <ExternalLink className="w-4 h-4" />
          </a>
        </header>

        {/* Propuestas de Landing */}
        <section aria-labelledby="links-landing">
          <div className="flex items-center gap-2 mb-4 text-[#A8D6F0]">
            <LayoutGrid className="w-4 h-4" />
            <h2 id="links-landing" className="font-mono-cl text-[12px] font-bold uppercase tracking-[0.08em]">
              Landing Principal y 5 Opciones de Diseño
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LANDING_OPTIONS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-[#102442] border border-[#8ECBF5]/25 hover:border-[#A8D6F0] p-5 no-underline flex flex-col justify-between gap-3 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-cl text-[12px] text-[#A8D6F0]">{item.href}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8ECBF5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="font-disp font-bold text-[20px] mt-1">{item.title}</p>
                  <p className="text-[13px] text-[#F5EAD6]/75 mt-1">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Páginas del Sitio */}
        <section aria-labelledby="links-site">
          <div className="flex items-center gap-2 mb-4 text-[#A8D6F0]">
            <Layers className="w-4 h-4" />
            <h2 id="links-site" className="font-mono-cl text-[12px] font-bold uppercase tracking-[0.08em]">
              Páginas del Sitio
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {SITE_PAGES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-[#F5EAD6] text-[#0A1B33] p-4 no-underline flex flex-col justify-between gap-2 hover:bg-[#A8D6F0] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-cl text-[11px] font-bold text-[#1E5AA8]">
                      {item.href}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#0A1B33]" />
                  </div>
                  <p className="font-disp font-extrabold text-[18px] mt-1">{item.title}</p>
                  <p className="text-[12px] opacity-80 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Fichas de Camisetas */}
        <section aria-labelledby="links-camisetas">
          <div className="flex items-center gap-2 mb-4 text-[#A8D6F0]">
            <Shirt className="w-4 h-4" />
            <h2 id="links-camisetas" className="font-mono-cl text-[12px] font-bold uppercase tracking-[0.08em]">
              Fichas de Camisetas (/camiseta/[slug])
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {MODELOS.map((m) => (
              <Link
                key={m.id}
                href={`/camiseta/${m.id}`}
                className="rounded-2xl bg-black/45 border border-[#F5EAD6]/15 hover:border-[#A8D6F0] p-4 no-underline flex items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <span className="font-mono-cl text-[11px] text-[#A8D6F0]">
                    /camiseta/{m.id}
                  </span>
                  <p className="font-disp font-bold text-[17px] mt-0.5">{m.name}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A8D6F0] shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
