'use client';

import Image from 'next/image';
import { ArrowUpRight, Clock, History, Shield } from 'lucide-react';
import CamisetaImage from '@/features/catalogo/CamisetaImage';
import {
  BRAND_LOGOS,
  COMMERCIAL_INFO,
  INSTAGRAM_HANDLE,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import { MODELOS } from '@/lib/data/modelos';
import { createWhatsAppUrl } from '@/lib/whatsapp';

const ERAS = [
  {
    period: '1988 – 1996',
    title: 'La era de los clásicos Umbro, Kappa y Reebok',
    items: 'Man. United 1988 & 1996 Cantona 7 · España 1996 Luis Enrique 21 · Brasil 1994 Romário 11 · Italia 1994 Baggio 10 · Barcelona 1991 Kappa',
  },
  {
    period: '1998 – 2006',
    title: 'Noches de Copa y Mundiales inolvidables',
    items: 'Peñarol 1998 Reebok #10 · Man. United 1999 UCL Final · Real Madrid 2003 Ronaldo 9 · Argentina 2006 Messi 19',
  },
  {
    period: '2009 – 2011',
    title: 'Finales europeas con dorsal histórico',
    items: 'FC Barcelona 2009 UCL Final Iniesta 8 · FC Barcelona 2011 UCL Final Messi 10',
  },
  {
    period: 'TEMPORADA 2026',
    title: 'Actuales, clubes y camino al Mundial',
    items: 'Uruguay 2026 · Peñarol 2026 · Nacional 2026 · Noruega Haaland 9 · Argentina Messi 10 · España Yamal 19 · Boca Paredes 5',
  },
];

export default function Opcion3RetroArchivo() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#F5EAD6]">
      {/* Portada tipo archivo */}
      <header className="border-b border-[#F5EAD6]/15 bg-gradient-to-b from-[#0A1B33] to-[#000000] px-[var(--pad)] py-14">
        <div className="max-w-[1160px] mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-10">
            <div className="flex items-center gap-3">
              <Image
                src={BRAND_LOGOS.emblem}
                alt="Fútbol en la Piel"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border border-[#A8D6F0]/40 bg-black"
              />
              <span className="font-mono-cl text-[12px] text-[#A8D6F0]">
                ARCHIVO &amp; COLECCIÓN · {INSTAGRAM_HANDLE}
              </span>
            </div>
            <a
              href={createWhatsAppUrl(
                'Hola Fútbol en la Piel! Quiero consultar por una camiseta del archivo.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#A8D6F0] text-[#0A1B33] font-bold text-[13px] no-underline inline-flex items-center gap-1.5 hover:bg-[#8ECBF5]"
            >
              WhatsApp {WHATSAPP_DISPLAY} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <p className="font-mono-cl text-[12px] tracking-[0.12em] text-[#8ECBF5] uppercase mb-3">
            URUGUAY · ACTUALES Y RETROS DESDE 1988
          </p>
          <h1 className="font-archivo text-[clamp(38px,6vw,84px)] leading-[0.92] tracking-[-0.03em] mb-6">
            CADA CAMISETA CUENTA UN PARTIDO.
          </h1>
          <p className="text-[17px] text-[#F5EAD6]/80 max-w-[660px] leading-[1.6]">
            Curaduría de camisetas actuales, ediciones especiales de clubes y clásicos retros con
            dorsales icónicos. Talles S a XL en Versión Jugador, Versión Fan y Retro.
          </p>
        </div>
      </header>

      {/* Línea de tiempo por eras */}
      <section className="max-w-[1160px] mx-auto px-[var(--pad)] py-14">
        <div className="flex items-center gap-2 mb-8">
          <History className="w-5 h-5 text-[#A8D6F0]" />
          <h2 className="font-disp font-black text-[28px] tracking-[-0.02em]">
            CRONOLOGÍA DEL CATÁLOGO
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {ERAS.map((era) => (
            <article
              key={era.period}
              className="rounded-2xl border border-[#F5EAD6]/15 bg-[#0A1B33]/55 p-6 flex flex-col justify-between gap-4"
            >
              <div>
                <span className="font-mono-cl text-[12px] font-bold text-[#A8D6F0] flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5" /> {era.period}
                </span>
                <h3 className="font-disp font-bold text-[22px] mb-2">{era.title}</h3>
                <p className="text-[14px] text-[#F5EAD6]/80 leading-[1.6]">{era.items}</p>
              </div>
              <a
                href={createWhatsAppUrl(
                  `Hola Fútbol en la Piel! Consulto disponibilidad de la línea ${era.period} (${era.title}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start font-mono-cl text-[12px] font-bold text-[#8ECBF5] no-underline hover:underline inline-flex items-center gap-1"
              >
                Consultar disponibilidad <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Fichas técnicas de modelos */}
      <section className="border-y border-[#F5EAD6]/15 bg-[#0A1B33]/40 py-14 px-[var(--pad)]">
        <div className="max-w-[1160px] mx-auto">
          <h2 className="font-disp font-black text-[28px] mb-8">PIEZAS DESTACADAS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {MODELOS.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-[#8ECBF5]/25 bg-black/70 p-5 flex flex-col gap-3"
              >
                <div className="flex justify-between font-mono-cl text-[11px] text-[#A8D6F0]">
                  <span>FICHA {m.num}</span>
                  <span>TALLES S–XL</span>
                </div>
                <div className="aspect-[4/3] grid place-items-center py-2">
                  <CamisetaImage modelo={m.id} alt={m.alt} className="w-[88%] h-auto" />
                </div>
                <h3 className="font-disp font-bold text-[20px]">{m.name}</h3>
                <p className="text-[13px] text-[#F5EAD6]/75">{m.desc}</p>
                <a
                  href={createWhatsAppUrl(
                    `Hola Fútbol en la Piel! Quiero consultar stock y precio de: ${m.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-3 border-t border-[#F5EAD6]/15 flex items-center justify-between text-[13px] font-bold text-[#A8D6F0] no-underline hover:text-[#8ECBF5]"
                >
                  <span>Consultar por WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Condiciones verificadas */}
      <footer className="max-w-[1160px] mx-auto px-[var(--pad)] py-12 grid md:grid-cols-3 gap-8 text-[14px]">
        <div>
          <p className="font-mono-cl text-[12px] text-[#A8D6F0] mb-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> CALCE Y VERSIONES
          </p>
          <p className="text-[#F5EAD6]/80 leading-relaxed">
            {COMMERCIAL_INFO.sizingAndChanges.map((x) => `${x.label}: ${x.detail}`).join(' ')}
          </p>
        </div>
        <div>
          <p className="font-mono-cl text-[12px] text-[#A8D6F0] mb-2">ENVÍOS A TODO EL PAÍS</p>
          <p className="text-[#F5EAD6]/80 leading-relaxed">
            {COMMERCIAL_INFO.shipping.map((s) => `${s.zone}: ${s.detail}`).join(' ')}
          </p>
        </div>
        <div>
          <p className="font-mono-cl text-[12px] text-[#A8D6F0] mb-2">MEDIOS DE PAGO</p>
          <p className="text-[#F5EAD6]/80 leading-relaxed">
            {COMMERCIAL_INFO.payments.join(', ')}. Precios y stock confirmados al instante en{' '}
            {WHATSAPP_DISPLAY}.
          </p>
        </div>
      </footer>
    </div>
  );
}
