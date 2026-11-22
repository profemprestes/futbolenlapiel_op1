'use client';

import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, MapPin, ShieldCheck, Shirt, Truck } from 'lucide-react';
import { useState } from 'react';
import CamisetaImage from '@/features/catalogo/CamisetaImage';
import {
  BRAND_LOGOS,
  COMMERCIAL_INFO,
  DEPARTAMENTOS_URUGUAY,
  INSTAGRAM_HANDLE,
  SIZES,
  VERSION_OPTIONS,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import {
  CATALOG_CATEGORIES,
  MODELOS,
  type CatalogCategoryId,
  type ModeloId,
} from '@/lib/data/modelos';
import {
  buildWhatsAppHref,
  computeConsultaCode,
  createWhatsAppUrl,
} from '@/lib/whatsapp';

export default function Opcion1Editorial() {
  const [activeCat, setActiveCat] = useState<CatalogCategoryId>('actuales');
  const [selectedModelo, setSelectedModelo] = useState<ModeloId>('uruguay');
  const [size, setSize] = useState<string>('M');
  const [version, setVersion] = useState<string>(VERSION_OPTIONS[2]);
  const [departamento, setDepartamento] = useState<string>('Montevideo');
  const [name, setName] = useState('');

  const currentCat = CATALOG_CATEGORIES.find((c) => c.id === activeCat) ?? CATALOG_CATEGORIES[0];
  const currentModelo = MODELOS.find((m) => m.id === selectedModelo) ?? MODELOS[0];

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || 'Cliente';
    const query = currentModelo.name;
    const href = buildWhatsAppHref({
      name: cleanName,
      camiseta: query,
      version,
      size,
      fulfil: 'envio',
      departamento,
      consultaId: computeConsultaCode(`${cleanName}-${query}-${size}`),
    });
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#0A1B33] text-[#F5EAD6]">
      {/* Hero Editorial Asimétrico */}
      <header className="relative overflow-hidden border-b border-[#8ECBF5]/20">
        <div className="max-w-[1240px] mx-auto px-[var(--pad)] py-12 lg:py-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image
                src={BRAND_LOGOS.horizontal}
                alt="Fútbol en la Piel"
                width={150}
                height={60}
                className="h-10 w-auto object-contain"
              />
              <span className="font-mono-cl text-[11px] px-3 py-1 rounded-full border border-[#A8D6F0]/40 text-[#A8D6F0]">
                URUGUAY · 19 DEPARTAMENTOS
              </span>
            </div>

            <h1 className="font-archivo text-[clamp(36px,5.2vw,68px)] leading-[0.95] tracking-[-0.03em] text-[#F5EAD6] mb-4">
              LA PASIÓN SE LLEVA PUESTA.
            </h1>
            <p className="text-[17px] text-[#F5EAD6]/85 leading-[1.6] max-w-[540px] mb-8">
              Camisetas actuales rumbo al Mundial 2026, clubes uruguayos e internacionales y
              clásicos retros de 1988 a 2011. Talles S a XL en Versión Jugador, Fan y Retro.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#consulta-editorial"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] font-bold text-[15px] no-underline transition-colors"
              >
                Consultar por WhatsApp <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#categorias-editorial"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#F5EAD6]/30 text-[#F5EAD6] font-semibold text-[15px] no-underline hover:border-[#A8D6F0] transition-colors"
              >
                Explorar categorías
              </a>
            </div>
          </div>

          <div className="relative rounded-[28px] bg-gradient-to-br from-[#132C52] to-[#000000] border border-[#8ECBF5]/25 p-6 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="font-mono-cl text-[12px] text-[#A8D6F0]">{currentModelo.num} / DESTACADA</span>
              <Image
                src={BRAND_LOGOS.emblem}
                alt="Emblema Fútbol en la Piel"
                width={44}
                height={44}
                className="w-11 h-11 rounded-full border border-[#F5EAD6]/25 bg-black object-cover"
              />
            </div>
            <div className="w-full max-w-[340px] aspect-[4/3] grid place-items-center my-2">
              <CamisetaImage
                modelo={currentModelo.id}
                alt={currentModelo.alt}
                priority
                className="w-full h-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.65)]"
              />
            </div>
            <p className="font-disp font-bold text-[22px] text-center">{currentModelo.name}</p>
            <p className="text-[13px] text-[#F5EAD6]/75 text-center mt-1">{currentModelo.desc}</p>
            <div className="flex gap-2 mt-4">
              {MODELOS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModelo(m.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-colors ${
                    selectedModelo === m.id
                      ? 'bg-[#A8D6F0] text-[#0A1B33]'
                      : 'bg-[#0A1B33] text-[#F5EAD6]/80 border border-[#F5EAD6]/20'
                  }`}
                >
                  {m.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Banda de 4 Pilares */}
      <section className="bg-[#F5EAD6] text-[#0A1B33] py-8 px-[var(--pad)]">
        <div className="max-w-[1240px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex gap-3 items-start">
            <Shirt className="w-5 h-5 text-[#1E5AA8] shrink-0 mt-0.5" />
            <div>
              <p className="font-disp font-bold text-[17px]">Talles S a XL</p>
              <p className="text-[13px] opacity-80">Versión Jugador (entallada), Fan (clásica) y Retro.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Truck className="w-5 h-5 text-[#1E5AA8] shrink-0 mt-0.5" />
            <div>
              <p className="font-disp font-bold text-[17px]">Todo Uruguay</p>
              <p className="text-[13px] opacity-80">Montevideo a coordinar e Interior por agencia.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-[#1E5AA8] shrink-0 mt-0.5" />
            <div>
              <p className="font-disp font-bold text-[17px]">Stock y precio al día</p>
              <p className="text-[13px] opacity-80">Confirmación real por WhatsApp antes de pagar.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 text-[#1E5AA8] shrink-0 mt-0.5" />
            <div>
              <p className="font-disp font-bold text-[17px]">Pagos flexibles</p>
              <p className="text-[13px] opacity-80">{COMMERCIAL_INFO.payments.join(' · ')}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías con Tabs */}
      <section id="categorias-editorial" className="max-w-[1240px] mx-auto px-[var(--pad)] py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono-cl text-[12px] text-[#A8D6F0] mb-1">CATÁLOGO {INSTAGRAM_HANDLE}</p>
            <h2 className="font-disp font-black text-[clamp(30px,4vw,48px)] leading-none">
              CUATRO LÍNEAS DE CAMISETAS
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATALOG_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCat(cat.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold cursor-pointer transition-colors ${
                  activeCat === cat.id
                    ? 'bg-[#A8D6F0] text-[#0A1B33]'
                    : 'bg-[#102442] text-[#F5EAD6] border border-[#F5EAD6]/15 hover:border-[#A8D6F0]/50'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-[#102442] border border-[#8ECBF5]/25 p-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="font-mono-cl text-[12px] text-[#8ECBF5]">{currentCat.subtitle}</span>
            <h3 className="font-disp font-extrabold text-[32px] mt-1 mb-3">{currentCat.title}</h3>
            <p className="text-[15px] text-[#F5EAD6]/85 leading-[1.6] mb-5">
              Modelos publicados en la cuenta oficial: <strong className="text-[#A8D6F0]">{currentCat.examples}</strong>.
            </p>
            <a
              href={createWhatsAppUrl(
                `Hola Fútbol en la Piel! Quiero consultar disponibilidad de la categoría ${currentCat.title}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#A8D6F0] text-[#0A1B33] font-bold text-[14px] no-underline hover:bg-[#8ECBF5]"
            >
              Consultar {currentCat.title} por WhatsApp <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid gap-3">
            {COMMERCIAL_INFO.sizingAndChanges.map((item) => (
              <div key={item.label} className="p-4 rounded-2xl bg-[#0A1B33] border border-[#F5EAD6]/10">
                <p className="font-disp font-bold text-[17px] text-[#A8D6F0]">{item.label}</p>
                <p className="text-[14px] text-[#F5EAD6]/80 mt-0.5">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario Editorial de Cierre */}
      <section id="consulta-editorial" className="bg-[#F5EAD6] text-[#0A1B33] py-16 px-[var(--pad)]">
        <div className="max-w-[960px] mx-auto grid md:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div>
            <p className="font-mono-cl text-[12px] font-bold text-[#1E5AA8] mb-2">
              ATENCIÓN DIRECTA · {WHATSAPP_DISPLAY}
            </p>
            <h2 className="font-disp font-black text-[clamp(30px,4vw,44px)] leading-[0.98] mb-4">
              ARMÁ TU CONSULTA EN SEGUNDOS
            </h2>
            <p className="text-[15px] opacity-85 leading-[1.6] mb-5">
              Elegí modelo, versión y talle. Te abrimos WhatsApp con el detalle listo para
              confirmar stock, precio y envío en tu departamento.
            </p>
            <div className="space-y-2 text-[14px]">
              <p className="flex items-center gap-2 font-semibold">
                <MapPin className="w-4 h-4 text-[#1E5AA8]" /> Montevideo e Interior (19 departamentos)
              </p>
              <p className="opacity-80">Medios de pago: {COMMERCIAL_INFO.payments.join(', ')}.</p>
            </div>
          </div>

          <form
            onSubmit={handleWhatsApp}
            className="bg-[#0A1B33] text-[#F5EAD6] rounded-[24px] p-6 grid gap-4 shadow-xl"
          >
            <label className="block">
              <span className="block text-[12px] font-semibold mb-1 opacity-85">Tu nombre</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Matías"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-[#F5EAD6]/25 text-[15px]"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[12px] font-semibold mb-1 opacity-85">Versión</span>
                <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-black/40 border border-[#F5EAD6]/25 text-[14px] [&>option]:text-[#0A1B33]"
                >
                  {VERSION_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-[12px] font-semibold mb-1 opacity-85">Talle</span>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-black/40 border border-[#F5EAD6]/25 text-[14px] [&>option]:text-[#0A1B33]"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      Talle {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="block text-[12px] font-semibold mb-1 opacity-85">Departamento</span>
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-black/40 border border-[#F5EAD6]/25 text-[14px] [&>option]:text-[#0A1B33]"
              >
                {DEPARTAMENTOS_URUGUAY.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="h-12 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] font-bold text-[15px] cursor-pointer inline-flex items-center justify-center gap-2 transition-colors"
            >
              Consultar por WhatsApp <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
