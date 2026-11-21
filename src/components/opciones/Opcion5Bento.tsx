'use client';

import Image from 'next/image';
import { ArrowUpRight, CreditCard, Instagram, MapPin, MessageCircle, Ruler, Shirt } from 'lucide-react';
import CamisetaImage from '@/components/CamisetaImage';
import {
  BRAND_LOGOS,
  CATALOG_CATEGORIES,
  COMMERCIAL_INFO,
  INSTAGRAM_HANDLE,
  MODELOS,
  SIZES,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER_RAW,
} from '@/lib/futbolenlapiel-data';

export default function Opcion5Bento() {
  return (
    <div className="min-h-screen bg-[#0A1B33] text-[#F5EAD6] py-8 px-[var(--pad)]">
      <div className="max-w-[1240px] mx-auto grid gap-4">
        {/* Top bar Bento */}
        <header className="rounded-[24px] bg-[#000000]/75 border border-[#8ECBF5]/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={BRAND_LOGOS.horizontal}
              alt="Fútbol en la Piel"
              width={140}
              height={52}
              className="h-9 w-auto object-contain"
            />
            <span className="hidden sm:inline-block font-mono-cl text-[11px] text-[#8ECBF5]">
              LA PASIÓN SE LLEVA PUESTA
            </span>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
              'Hola Fútbol en la Piel! Vengo de la web y quiero consultar por una camiseta.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] font-bold text-[13px] no-underline inline-flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </header>

        {/* Bento Row 1: Hero + Uruguay 2026 + Emblema */}
        <div className="grid md:grid-cols-12 gap-4">
          <section className="md:col-span-7 rounded-[26px] bg-gradient-to-br from-[#132C52] to-[#0A1B33] border border-[#8ECBF5]/25 p-7 flex flex-col justify-between gap-6">
            <div>
              <span className="font-mono-cl text-[11px] px-3 py-1 rounded-full bg-[#A8D6F0]/15 text-[#A8D6F0] border border-[#A8D6F0]/30">
                URUGUAY · ENVÍOS A LOS 19 DEPARTAMENTOS
              </span>
              <h1 className="font-archivo text-[clamp(32px,4.4vw,56px)] leading-[0.96] tracking-[-0.03em] mt-4 mb-3">
                CAMISETAS ACTUALES Y CLÁSICOS RETROS.
              </h1>
              <p className="text-[15px] text-[#F5EAD6]/85 leading-[1.6] max-w-[500px]">
                Selecciones rumbo al Mundial 2026, clubes uruguayos e internacionales y retros
                1988–2011. Talles S a XL en Versión Jugador, Fan y Retro.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATALOG_CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
                    `Hola Fútbol en la Piel! Quiero consultar modelos de ${cat.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#F5EAD6] text-[#0A1B33] font-bold text-[13px] no-underline hover:bg-[#A8D6F0] transition-colors inline-flex items-center gap-1"
                >
                  {cat.title} <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </section>

          <article className="md:col-span-5 rounded-[26px] bg-[#000000]/80 border border-[#F5EAD6]/15 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono-cl text-[11px] text-[#A8D6F0]">DESTACADA 01</span>
              <Image
                src={BRAND_LOGOS.emblem}
                alt="Emblema Fútbol en la Piel"
                width={38}
                height={38}
                className="w-9 h-9 rounded-full border border-[#F5EAD6]/20"
              />
            </div>
            <div className="aspect-[4/3] grid place-items-center my-2">
              <CamisetaImage
                modelo={MODELOS[0].id}
                alt={MODELOS[0].alt}
                priority
                className="w-[86%] h-auto"
              />
            </div>
            <div>
              <h2 className="font-disp font-bold text-[22px]">{MODELOS[0].name}</h2>
              <p className="text-[13px] text-[#F5EAD6]/75 mt-0.5">{MODELOS[0].desc}</p>
            </div>
          </article>
        </div>

        {/* Bento Row 2: 4 Categorías */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATALOG_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
                `Hola Fútbol en la Piel! Quiero consultar por ${cat.title}: ${cat.defaultQuery || cat.examples}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[22px] bg-[#F5EAD6] text-[#0A1B33] p-5 no-underline flex flex-col justify-between gap-3 hover:-translate-y-0.5 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-disp font-black text-[22px]">{cat.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#1E5AA8]" />
                </div>
                <p className="text-[12px] font-bold text-[#1E5AA8] mb-2">{cat.subtitle}</p>
                <p className="text-[13px] opacity-80 leading-relaxed">{cat.examples}</p>
              </div>
              <span className="font-mono-cl text-[11px] font-bold text-[#0A1B33]/75 pt-2 border-t border-[#0A1B33]/15">
                Consultar por WhatsApp →
              </span>
            </a>
          ))}
        </div>

        {/* Bento Row 3: Retros + Info Comercial */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-[22px] bg-[#102442] border border-[#8ECBF5]/20 p-5 flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-[#A8D6F0]">
              <Shirt className="w-4 h-4" />
              <span className="font-mono-cl text-[12px] font-bold">RETROS DESTACADAS</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MODELOS.slice(1).map((m) => (
                <div key={m.id} className="rounded-xl bg-black/35 p-3 text-center">
                  <CamisetaImage modelo={m.id} alt={m.alt} className="w-full h-auto mb-2" />
                  <p className="font-disp font-bold text-[13px] leading-tight">{m.shortName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] bg-[#102442] border border-[#8ECBF5]/20 p-5 flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-[#A8D6F0]">
              <Ruler className="w-4 h-4" />
              <span className="font-mono-cl text-[12px] font-bold">TALLES Y VERSIONES</span>
            </div>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <span
                  key={s}
                  className="flex-1 text-center py-2 rounded-xl bg-[#0A1B33] border border-[#F5EAD6]/15 font-disp font-bold text-[18px]"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="text-[13px] text-[#F5EAD6]/80 leading-relaxed">
              {COMMERCIAL_INFO.sizingAndChanges.map((x) => `${x.label}: ${x.detail}`).join(' ')}
            </p>
          </div>

          <div className="rounded-[22px] bg-[#102442] border border-[#8ECBF5]/20 p-5 flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-[#A8D6F0]">
              <MapPin className="w-4 h-4" />
              <span className="font-mono-cl text-[12px] font-bold">ENVÍOS &amp; PAGOS</span>
            </div>
            <p className="text-[13px] text-[#F5EAD6]/85 leading-relaxed">
              {COMMERCIAL_INFO.shipping.map((s) => `${s.zone}: ${s.detail}`).join(' ')}
            </p>
            <p className="text-[13px] text-[#A8D6F0] flex items-center gap-1.5 font-semibold">
              <CreditCard className="w-4 h-4 shrink-0" />
              {COMMERCIAL_INFO.payments.join(' · ')}
            </p>
            <p className="text-[12px] text-[#F5EAD6]/65 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5" /> {INSTAGRAM_HANDLE} · Precios al instante por WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
