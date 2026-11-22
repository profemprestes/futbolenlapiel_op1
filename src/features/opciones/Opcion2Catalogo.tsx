'use client';

import Image from 'next/image';
import { ArrowUpRight, Filter, MessageCircle, Search, Truck } from 'lucide-react';
import { useState } from 'react';
import CamisetaImage from '@/features/catalogo/CamisetaImage';
import {
  BRAND_LOGOS,
  COMMERCIAL_INFO,
  INSTAGRAM_HANDLE,
  SIZES,
  VERSION_OPTIONS,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import {
  CATALOG_CATEGORIES,
  MODELOS,
  type CatalogCategoryId,
} from '@/lib/data/modelos';
import { buildWhatsAppHref, computeConsultaCode } from '@/lib/whatsapp';

export default function Opcion2Catalogo() {
  const [filter, setFilter] = useState<'all' | CatalogCategoryId>('all');
  const [search, setSearch] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedVersions, setSelectedVersions] = useState<Record<string, string>>({});

  const visibleCategories = CATALOG_CATEGORIES.filter((cat) => {
    if (filter !== 'all' && cat.id !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.subtitle.toLowerCase().includes(q) ||
      cat.examples.toLowerCase().includes(q)
    );
  });

  const openWhatsAppFor = (camiseta: string, key: string) => {
    const size = selectedSizes[key] || 'M';
    const version = selectedVersions[key] || VERSION_OPTIONS[2];
    const href = buildWhatsAppHref({
      name: 'Consulta Web',
      camiseta,
      version,
      size,
      fulfil: 'envio',
      departamento: 'Uruguay',
      consultaId: computeConsultaCode(`${camiseta}-${size}`),
    });
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#F5EAD6] text-[#0A1B33]">
      {/* Barra superior estilo tienda */}
      <header className="bg-[#0A1B33] text-[#F5EAD6] py-8 px-[var(--pad)]">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src={BRAND_LOGOS.emblem}
              alt="Fútbol en la Piel"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full border border-[#F5EAD6]/25 bg-black object-cover shrink-0"
            />
            <div>
              <p className="font-mono-cl text-[11px] text-[#A8D6F0]">
                {INSTAGRAM_HANDLE} · CATÁLOGO URUGUAY
              </p>
              <h1 className="font-archivo text-[clamp(24px,3.2vw,38px)] leading-tight">
                FÚTBOL EN LA PIEL
              </h1>
              <p className="text-[14px] text-[#F5EAD6]/80">
                La pasión se lleva puesta · Envíos a todo el país
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A8D6F0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar selección, club o retro..."
                className="h-11 pl-10 pr-4 rounded-full bg-black/40 border border-[#F5EAD6]/25 text-[14px] text-[#F5EAD6] placeholder:text-[#F5EAD6]/50 w-full sm:w-[260px]"
              />
            </div>
            <a
              href="#modelos-tienda"
              className="h-11 px-5 rounded-full bg-[#A8D6F0] text-[#0A1B33] font-bold text-[14px] inline-flex items-center justify-center gap-1.5 no-underline hover:bg-[#8ECBF5]"
            >
              Ver destacados <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Filtros de categoría */}
      <div className="border-b border-[#0A1B33]/15 bg-[#F5EAD6] sticky top-[45px] z-30 px-[var(--pad)] py-3">
        <div className="max-w-[1240px] mx-auto flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-[#1E5AA8] shrink-0 mr-1" />
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-bold cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#0A1B33] text-[#F5EAD6]'
                : 'bg-white/60 text-[#0A1B33] border border-[#0A1B33]/15'
            }`}
          >
            Todas las líneas
          </button>
          {CATALOG_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold cursor-pointer whitespace-nowrap ${
                filter === c.id
                  ? 'bg-[#0A1B33] text-[#F5EAD6]'
                  : 'bg-white/60 text-[#0A1B33] border border-[#0A1B33]/15'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de Modelos Destacados con selector rápido */}
      <section id="modelos-tienda" className="max-w-[1240px] mx-auto px-[var(--pad)] py-12">
        <div className="flex items-baseline justify-between gap-4 mb-6 flex-wrap">
          <h2 className="font-disp font-black text-[clamp(26px,3.2vw,38px)]">
            DESTACADOS PARA CONSULTA RÁPIDA
          </h2>
          <span className="font-mono-cl text-[12px] text-[#1E5AA8] font-bold">
            STOCK Y PRECIO SE CONFIRMAN POR WHATSAPP
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MODELOS.map((m) => {
            const curSize = selectedSizes[m.id] || 'M';
            const curVer = selectedVersions[m.id] || VERSION_OPTIONS[2];
            return (
              <article
                key={m.id}
                className="rounded-[24px] bg-[#0A1B33] text-[#F5EAD6] p-6 flex flex-col justify-between gap-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-[12px] font-mono-cl text-[#A8D6F0] mb-3">
                    <span>MODELO {m.num}</span>
                    <span>{m.availabilityLabel}</span>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl bg-black/35 grid place-items-center p-4 mb-4">
                    <CamisetaImage modelo={m.id} alt={m.alt} className="w-[90%] h-auto" />
                  </div>
                  <h3 className="font-disp font-bold text-[22px] leading-tight mb-1">{m.name}</h3>
                  <p className="text-[13px] text-[#F5EAD6]/75 leading-relaxed">{m.desc}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#8ECBF5]/20">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold opacity-80">Talle:</span>
                    <div className="flex gap-1.5">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSizes((p) => ({ ...p, [m.id]: s }))}
                          className={`w-8 h-8 rounded-lg text-[12px] font-bold cursor-pointer ${
                            curSize === s
                              ? 'bg-[#A8D6F0] text-[#0A1B33]'
                              : 'bg-black/40 text-[#F5EAD6] border border-[#F5EAD6]/20'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <select
                    aria-label={`Versión para ${m.name}`}
                    value={curVer}
                    onChange={(e) => setSelectedVersions((p) => ({ ...p, [m.id]: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-[#F5EAD6]/20 text-[13px] [&>option]:text-[#0A1B33]"
                  >
                    {VERSION_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => openWhatsAppFor(m.name, m.id)}
                    className="w-full h-11 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] font-bold text-[14px] cursor-pointer inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Consultar talle {curSize}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Líneas del catálogo */}
      <section className="max-w-[1240px] mx-auto px-[var(--pad)] pb-14">
        <h2 className="font-disp font-black text-[26px] mb-5">CATEGORÍAS DE {INSTAGRAM_HANDLE}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleCategories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl bg-white/75 border border-[#0A1B33]/15 p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <p className="font-disp font-extrabold text-[22px] text-[#0A1B33]">{cat.title}</p>
                <p className="text-[12px] font-semibold text-[#1E5AA8] mb-2">{cat.subtitle}</p>
                <p className="text-[13px] text-[#0A1B33]/80 leading-relaxed">{cat.examples}</p>
              </div>
              <button
                type="button"
                onClick={() => openWhatsAppFor(cat.defaultQuery || cat.title, cat.id)}
                className="self-start text-[13px] font-bold text-[#1E5AA8] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                Consultar por WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Pie comercial */}
      <footer className="bg-[#0A1B33] text-[#F5EAD6] py-10 px-[var(--pad)]">
        <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-6 text-[14px]">
          <div>
            <p className="font-mono-cl text-[12px] text-[#A8D6F0] mb-1.5">ENVÍOS EN URUGUAY</p>
            <p className="opacity-85 flex gap-2 items-start">
              <Truck className="w-4 h-4 text-[#A8D6F0] shrink-0 mt-1" />
              <span>
                {COMMERCIAL_INFO.shipping.map((s) => `${s.zone}: ${s.detail}`).join(' ')}
              </span>
            </p>
          </div>
          <div>
            <p className="font-mono-cl text-[12px] text-[#A8D6F0] mb-1.5">PAGOS Y CAMBIOS</p>
            <p className="opacity-85">
              {COMMERCIAL_INFO.payments.join(', ')}.{' '}
              {COMMERCIAL_INFO.sizingAndChanges[1].detail}
            </p>
          </div>
          <div>
            <p className="font-mono-cl text-[12px] text-[#A8D6F0] mb-1.5">WHATSAPP DIRECTO</p>
            <p className="font-bold text-[16px]">{WHATSAPP_DISPLAY}</p>
            <p className="text-[12px] opacity-75">Nada se cobra ni reserva stock desde esta web.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
