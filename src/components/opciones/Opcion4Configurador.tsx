'use client';

import Image from 'next/image';
import { ArrowUpRight, Check, CreditCard, MapPin, Shirt } from 'lucide-react';
import { useState } from 'react';
import CamisetaImage from '@/components/CamisetaImage';
import {
  BRAND_LOGOS,
  CATALOG_CATEGORIES,
  COMMERCIAL_INFO,
  DEPARTAMENTOS_URUGUAY,
  INSTAGRAM_HANDLE,
  MODELOS,
  SIZES,
  VERSION_OPTIONS,
  WHATSAPP_DISPLAY,
  buildWhatsAppHref,
  computeConsultaCode,
  type ModeloId,
} from '@/lib/futbolenlapiel-data';

export default function Opcion4Configurador() {
  const [selectedModelo, setSelectedModelo] = useState<ModeloId>('uruguay');
  const [customCamiseta, setCustomCamiseta] = useState(MODELOS[0].name);
  const [version, setVersion] = useState<string>(VERSION_OPTIONS[0]);
  const [size, setSize] = useState<string>('M');
  const [fulfil, setFulfil] = useState<'envio' | 'coordinar'>('envio');
  const [departamento, setDepartamento] = useState<string>('Montevideo');
  const [name, setName] = useState('');

  const consultaId = computeConsultaCode(`${name || 'web'}-${customCamiseta}-${size}`);
  const whatsAppHref = buildWhatsAppHref({
    name: name.trim() || 'Cliente',
    camiseta: customCamiseta.trim() || MODELOS[0].name,
    version,
    size,
    fulfil,
    departamento,
    consultaId,
  });

  return (
    <div className="min-h-screen bg-[#0A1B33] text-[#F5EAD6] py-10 px-[var(--pad)]">
      <div className="max-w-[1180px] mx-auto">
        {/* Encabezado compacto */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#8ECBF5]/20 mb-8">
          <div className="flex items-center gap-3.5">
            <Image
              src={BRAND_LOGOS.emblem}
              alt="Fútbol en la Piel"
              width={52}
              height={52}
              className="w-13 h-13 rounded-full border border-[#F5EAD6]/25 bg-black"
            />
            <div>
              <p className="font-mono-cl text-[11px] text-[#A8D6F0]">
                {INSTAGRAM_HANDLE} · CONFIGURADOR DE CONSULTA
              </p>
              <h1 className="font-archivo text-[clamp(22px,3vw,34px)] leading-tight">
                ARMÁ TU CONSULTA EN 3 PASOS
              </h1>
            </div>
          </div>
          <p className="text-[13px] text-[#F5EAD6]/75 max-w-[300px]">
            La pasión se lleva puesta. Confirmamos stock, precio y envío directo por WhatsApp.
          </p>
        </header>

        {/* Grid principal: Configurador + Vista previa en vivo */}
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-start">
          <div className="grid gap-6">
            {/* Paso 1 */}
            <section className="rounded-[24px] bg-[#102442] border border-[#8ECBF5]/20 p-6">
              <p className="font-mono-cl text-[12px] font-bold text-[#A8D6F0] mb-3">
                PASO 01 · ELEGÍ MODELO O CATEGORÍA
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                {MODELOS.map((m) => {
                  const active = selectedModelo === m.id && customCamiseta === m.name;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedModelo(m.id);
                        setCustomCamiseta(m.name);
                      }}
                      className={`p-3 rounded-2xl text-left border cursor-pointer transition-all ${
                        active
                          ? 'bg-[#A8D6F0] text-[#0A1B33] border-[#A8D6F0]'
                          : 'bg-[#0A1B33] text-[#F5EAD6] border-[#F5EAD6]/15 hover:border-[#A8D6F0]/50'
                      }`}
                    >
                      <div className="aspect-[4/3] grid place-items-center mb-2">
                        <CamisetaImage modelo={m.id} alt={m.alt} className="w-[85%] h-auto" />
                      </div>
                      <p className="font-disp font-bold text-[15px] leading-tight">{m.shortName}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {CATALOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCustomCamiseta(cat.defaultQuery || `${cat.title} — `)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-black/35 border border-[#F5EAD6]/20 hover:border-[#A8D6F0] cursor-pointer"
                  >
                    + {cat.title}
                  </button>
                ))}
              </div>

              <input
                type="text"
                aria-label="Modelo o equipo buscado"
                value={customCamiseta}
                onChange={(e) => setCustomCamiseta(e.target.value)}
                placeholder="Ej: Peñarol 2026, Nacional 2026, Noruega Haaland 9..."
                className="w-full h-11 px-4 rounded-xl bg-black/40 border border-[#F5EAD6]/25 text-[15px]"
              />
            </section>

            {/* Paso 2 */}
            <section className="rounded-[24px] bg-[#102442] border border-[#8ECBF5]/20 p-6">
              <p className="font-mono-cl text-[12px] font-bold text-[#A8D6F0] mb-3 flex items-center gap-1.5">
                <Shirt className="w-4 h-4" /> PASO 02 · VERSIÓN Y TALLE
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-[12px] opacity-80 mb-2">Versión</span>
                  <div className="grid gap-2">
                    {VERSION_OPTIONS.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVersion(v)}
                        className={`px-3.5 py-2.5 rounded-xl text-left text-[13px] font-semibold border cursor-pointer flex items-center justify-between ${
                          version === v
                            ? 'bg-[#F5EAD6] text-[#0A1B33] border-[#F5EAD6]'
                            : 'bg-[#0A1B33] text-[#F5EAD6] border-[#F5EAD6]/15'
                        }`}
                      >
                        <span>{v}</span>
                        {version === v && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[12px] opacity-80 mb-2">Talle (S a XL)</span>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`h-11 rounded-xl font-disp font-bold text-[18px] border cursor-pointer ${
                          size === s
                            ? 'bg-[#A8D6F0] text-[#0A1B33] border-[#A8D6F0]'
                            : 'bg-[#0A1B33] text-[#F5EAD6] border-[#F5EAD6]/15'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-[12px] text-[#F5EAD6]/75 leading-relaxed">
                    {COMMERCIAL_INFO.sizingAndChanges[0].detail}
                  </p>
                </div>
              </div>
            </section>

            {/* Paso 3 */}
            <section className="rounded-[24px] bg-[#102442] border border-[#8ECBF5]/20 p-6">
              <p className="font-mono-cl text-[12px] font-bold text-[#A8D6F0] mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> PASO 03 · ENTREGA EN URUGUAY Y TU NOMBRE
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre (ej: Lucía)"
                  className="h-11 px-4 rounded-xl bg-black/40 border border-[#F5EAD6]/25 text-[15px]"
                />
                <select
                  aria-label="Departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  className="h-11 px-3.5 rounded-xl bg-black/40 border border-[#F5EAD6]/25 text-[14px] [&>option]:text-[#0A1B33]"
                >
                  {DEPARTAMENTOS_URUGUAY.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setFulfil('envio')}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer ${
                    fulfil === 'envio'
                      ? 'bg-[#F5EAD6] text-[#0A1B33]'
                      : 'bg-[#0A1B33] text-[#F5EAD6]/80 border border-[#F5EAD6]/15'
                  }`}
                >
                  Envío a domicilio / agencia
                </button>
                <button
                  type="button"
                  onClick={() => setFulfil('coordinar')}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer ${
                    fulfil === 'coordinar'
                      ? 'bg-[#F5EAD6] text-[#0A1B33]'
                      : 'bg-[#0A1B33] text-[#F5EAD6]/80 border border-[#F5EAD6]/15'
                  }`}
                >
                  Coordinar entrega
                </button>
              </div>
            </section>
          </div>

          {/* Resumen en vivo */}
          <aside className="rounded-[24px] bg-[#F5EAD6] text-[#0A1B33] p-6 sticky top-[68px] shadow-2xl">
            <p className="font-mono-cl text-[11px] font-bold text-[#1E5AA8] mb-1">
              RESUMEN DE CONSULTA · {consultaId}
            </p>
            <h2 className="font-disp font-black text-[26px] leading-tight mb-4">
              LISTA PARA WHATSAPP
            </h2>

            <div className="space-y-2.5 text-[14px] pb-4 border-b border-[#0A1B33]/15 mb-4">
              <p>
                <strong>Camiseta:</strong> {customCamiseta || MODELOS[0].name}
              </p>
              <p>
                <strong>Versión:</strong> {version}
              </p>
              <p>
                <strong>Talle:</strong> {size}
              </p>
              <p>
                <strong>Entrega:</strong>{' '}
                {fulfil === 'envio' ? `Envío a ${departamento}` : `Coordinar (${departamento})`}
              </p>
            </div>

            <a
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-full bg-[#0A1B33] hover:bg-[#1E5AA8] text-[#F5EAD6] font-bold text-[15px] no-underline inline-flex items-center justify-center gap-2 transition-colors mb-4"
            >
              Enviar consulta por WhatsApp <ArrowUpRight className="w-4 h-4" />
            </a>

            <div className="text-[12px] opacity-80 space-y-1.5">
              <p className="flex items-center gap-1.5 font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-[#1E5AA8]" />
                {COMMERCIAL_INFO.payments.join(' · ')}
              </p>
              <p>WhatsApp: {WHATSAPP_DISPLAY}. Nada se cobra ni reserva stock aquí.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
