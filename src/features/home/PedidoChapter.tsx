'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import type { ModeloId } from '@/lib/data/modelos';
import {
  BRAND_LOGOS,
  COMMERCIAL_INFO,
  DEPARTAMENTOS_URUGUAY,
  SIZES,
  VERSION_OPTIONS,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import { HOME_CONTENT } from '@/lib/content/home';
import { buildWhatsAppHref, computeConsultaCode } from '@/lib/whatsapp';

interface PedidoChapterProps {
  selectedSize: string;
  selectedModelo: ModeloId;
  camiseta: string;
  camisetaPlaceholder: string;
  resetNonce: number;
  reducedMotion: boolean;
  onChangeCamiseta: (value: string) => void;
  onSelectSize: (size: string) => void;
  sectionRef: React.RefObject<HTMLElement | null>;
  swRefs: React.MutableRefObject<Array<HTMLParagraphElement | null>>;
}

interface ConsultaReceipt {
  name: string;
  consultaId: string;
  summary: string;
  whatsAppHref: string;
}

const SLIDE_WORDS = [
  { text: 'PEDÍ.', extraClass: '' },
  { text: 'POR WHATSAPP.', extraClass: 'text-right text-[#A8D6F0]' },
  { text: 'URUGUAY.', extraClass: 'cl-sw-stroke' },
];

export default function PedidoChapter({
  selectedSize,
  camiseta,
  camisetaPlaceholder,
  resetNonce,
  reducedMotion,
  onChangeCamiseta,
  onSelectSize,
  sectionRef,
  swRefs,
}: PedidoChapterProps) {
  const [name, setName] = useState('');
  const [version, setVersion] = useState<string>(VERSION_OPTIONS[2]);
  const [fulfil, setFulfil] = useState<'envio' | 'coordinar'>('envio');
  const [departamento, setDepartamento] = useState('');
  const [agree, setAgree] = useState(false);
  const [errorState, setErrorState] = useState<{ nonce: number; msg: string } | null>(null);
  const [invalidState, setInvalidState] = useState<{
    nonce: number;
    fields: Record<string, boolean>;
  }>({ nonce: -1, fields: {} });
  const [shaking, setShaking] = useState(false);
  const [receiptState, setReceiptState] = useState<{
    nonce: number;
    data: ConsultaReceipt;
  } | null>(null);

  const errorMsg = errorState && errorState.nonce === resetNonce ? errorState.msg : '';
  const invalidFields = invalidState.nonce === resetNonce ? invalidState.fields : {};
  const receipt = receiptState && receiptState.nonce === resetNonce ? receiptState.data : null;

  const setErrorMsg = (msg: string) =>
    setErrorState(msg ? { nonce: resetNonce, msg } : null);
  const setInvalidFields = (
    updater:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => {
    setInvalidState((prev) => {
      const current = prev.nonce === resetNonce ? prev.fields : {};
      const next = typeof updater === 'function' ? updater(current) : updater;
      return { nonce: resetNonce, fields: next };
    });
  };

  const formRef = useRef<HTMLFormElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const trimmedName = name.trim();
    const trimmedCamiseta = camiseta.trim();
    const deptRequired = fulfil === 'envio';

    const nextInvalid: Record<string, boolean> = {
      name: trimmedName.length === 0,
      camiseta: trimmedCamiseta.length === 0,
      size: !selectedSize,
      departamento: deptRequired && !departamento,
      agree: !agree,
    };

    const firstBadKey = (['name', 'camiseta', 'size', 'departamento', 'agree'] as const).find(
      (k) => nextInvalid[k]
    );

    if (firstBadKey) {
      setInvalidFields(nextInvalid);
      const msg =
        firstBadKey === 'camiseta'
          ? 'Elegí una camiseta.'
          : firstBadKey === 'size'
            ? 'Elegí un talle.'
            : firstBadKey === 'departamento'
              ? 'Elegí tu departamento.'
              : firstBadKey === 'agree'
                ? 'Aceptá que la confirmación es por WhatsApp.'
                : 'Agregá tu nombre.';
      setErrorMsg(msg);
      setShaking(false);
      requestAnimationFrame(() => setShaking(true));

      const targetEl = form.elements.namedItem(firstBadKey) as HTMLElement | null;
      targetEl?.focus();
      return;
    }

    setInvalidFields({});
    setErrorMsg('');

    const consultaId = computeConsultaCode(
      `${trimmedName}-${trimmedCamiseta}-${selectedSize}-${departamento}`
    );
    const destinoText =
      fulfil === 'envio'
        ? `envío a ${departamento}`
        : `coordinar entrega${departamento ? ` (${departamento})` : ' directa'}`;

    const whatsAppHref = buildWhatsAppHref({
      name: trimmedName,
      camiseta: trimmedCamiseta,
      version,
      size: selectedSize,
      fulfil,
      departamento,
      consultaId,
    });

    setReceiptState({
      nonce: resetNonce,
      data: {
        name: trimmedName,
        consultaId,
        summary: `${trimmedCamiseta}, ${version}, talle ${selectedSize}, ${destinoText}. Abrí WhatsApp (${WHATSAPP_DISPLAY}) para confirmar stock, precio y envío. Nada se cobra desde esta página.`,
        whatsAppHref,
      },
    });

    requestAnimationFrame(() => {
      receiptRef.current?.focus();
    });
  };

  const handleReset = () => {
    setReceiptState(null);
    setName('');
    setVersion(VERSION_OPTIONS[2]);
    setFulfil('envio');
    setDepartamento('');
    setAgree(false);
    setErrorMsg('');
    setInvalidFields({});
    requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
  };

  return (
    <section
      ref={sectionRef}
      id="pedido"
      aria-labelledby="pedido-h"
      className="cl-c3 relative py-[14vh] px-[var(--pad)] overflow-hidden"
    >
      <h2 id="pedido-h" className="sr-only">
        Pedí por WhatsApp en Uruguay.
      </h2>

      {/* Palabras deslizantes en parallax */}
      <div
        aria-hidden="true"
        className="font-disp font-black text-[clamp(42px,10.8vw,190px)] max-md:text-[14vw] leading-[0.92] tracking-[-0.035em] whitespace-nowrap relative"
      >
        {SLIDE_WORDS.map((item, idx) => (
          <p
            key={item.text}
            ref={(el) => {
              swRefs.current[idx] = el;
            }}
            className={`[transform:translateX(var(--sx,0))] ${item.extraClass}`}
          >
            {item.text}
          </p>
        ))}
      </div>

      {/* Aviso compacto de despachos y stock */}
      <article
        aria-label="Estado de despachos y stock"
        className="relative mt-[6vh] mb-[6vh] max-w-[1180px] mx-auto glass-panel px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex flex-col gap-1">
          <header className="flex items-center gap-2 text-[#A8D6F0]">
            <Truck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="font-mono-cl text-[12px] font-bold uppercase tracking-[0.08em]">
              {HOME_CONTENT.pedido.bannerEyebrow}
            </span>
          </header>
          <p className="text-[15px] text-[#F5EAD6]/90 leading-relaxed">
            {HOME_CONTENT.pedido.bannerDesc}
          </p>
        </div>

        <footer className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/envios"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#F5EAD6]/25 text-[13px] font-semibold text-[#F5EAD6] no-underline hover:border-[#A8D6F0] hover:text-[#A8D6F0] transition-colors"
          >
            Envíos y pagos
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/talles"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#F5EAD6]/25 text-[13px] font-semibold text-[#F5EAD6] no-underline hover:border-[#A8D6F0] hover:text-[#A8D6F0] transition-colors"
          >
            Guía de talles
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </footer>
      </article>

      {/* Reglas + Formulario de consulta */}
      <div className="relative grid grid-cols-[1fr_1.25fr] max-md:grid-cols-1 gap-[clamp(20px,4vw,64px)] max-w-[1180px] mx-auto items-start">
        <ol className="cl-rules list-none grid gap-[18px]">
          <li className="relative pl-[58px] pb-[18px] border-b border-[#8ECBF5]/40 text-[16px] leading-[1.5]">
            <b className="block font-disp font-bold text-[18px] mb-0.5">
              {HOME_CONTENT.pedido.bannerTitle}
            </b>
            Trabajamos con entrega inmediata de stock y pedidos por encargo (Fan desde $ 1.690,
            Retro desde $ 1.890, Jugador desde $ 1.990 como referencia).
          </li>
          <li className="relative pl-[58px] pb-[18px] border-b border-[#8ECBF5]/40 text-[16px] leading-[1.5]">
            <b className="block font-disp font-bold text-[18px] mb-0.5">
              Medios de pago disponibles.
            </b>
            Aceptamos {COMMERCIAL_INFO.payments.join(', ')}.
          </li>
          <li className="relative pl-[58px] pb-[18px] border-b border-[#8ECBF5]/40 text-[16px] leading-[1.5]">
            <b className="block font-disp font-bold text-[18px] mb-0.5">
              Envíos a todo Uruguay.
            </b>
            {COMMERCIAL_INFO.shipping.map((s) => `${s.zone}: ${s.detail}`).join(' ')}
          </li>
          <li className="relative pl-[58px] pb-[18px] border-b border-[#8ECBF5]/40 text-[16px] leading-[1.5]">
            <b className="block font-disp font-bold text-[18px] mb-0.5">
              Guía de talles y cambios.
            </b>
            {COMMERCIAL_INFO.sizingAndChanges.map((item) => `${item.label}: ${item.detail}`).join(' ')}
          </li>
        </ol>

        {!receipt ? (
          <form
            id="pedido-form"
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            onAnimationEnd={() => setShaking(false)}
            className={`glass-panel p-[clamp(18px,2.4vw,30px)] grid gap-3.5 ${
              shaking ? 'cl-shake' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-disp font-extrabold text-[26px] tracking-[-0.02em]">
                Pedir por WhatsApp
              </h3>
              <Image
                src={BRAND_LOGOS.emblem}
                alt="Sello Fútbol en la Piel"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border border-[#F5EAD6]/25 bg-black object-cover shrink-0"
              />
            </div>

            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
              <label className="block">
                <span className="block text-[12px] font-semibold tracking-[0.04em] mb-1.5 opacity-85">
                  Tu nombre
                </span>
                <input
                  id="pedido-name-input"
                  ref={nameInputRef}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ej: Mati"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (invalidFields.name) setInvalidFields((p) => ({ ...p, name: false }));
                  }}
                  required
                  aria-invalid={Boolean(invalidFields.name)}
                  aria-describedby={errorMsg ? 'pedido-error' : undefined}
                  className={`w-full h-12 px-3.5 rounded-[14px] border bg-[#000000]/35 outline-none text-[16px] placeholder:text-[#F5EAD6]/70 focus:border-[#F5EAD6] focus:bg-[#000000]/50 focus:shadow-[0_0_0_3px_rgba(168,214,240,0.3)] transition-all duration-200 ${
                    invalidFields.name ? 'border-[#A8D6F0]' : 'border-[#F5EAD6]/35'
                  }`}
                />
              </label>

              <label className="block">
                <span className="block text-[12px] font-semibold tracking-[0.04em] mb-1.5 opacity-85">
                  Camiseta elegida
                </span>
                <input
                  id="pedido-camiseta-input"
                  name="camiseta"
                  type="text"
                  placeholder={camisetaPlaceholder}
                  value={camiseta}
                  onChange={(e) => {
                    onChangeCamiseta(e.target.value);
                    if (invalidFields.camiseta) {
                      setInvalidFields((p) => ({ ...p, camiseta: false }));
                    }
                  }}
                  required
                  aria-invalid={Boolean(invalidFields.camiseta)}
                  aria-describedby={errorMsg ? 'pedido-error' : undefined}
                  className={`w-full h-12 px-3.5 rounded-[14px] border bg-[#000000]/35 outline-none text-[16px] placeholder:text-[#F5EAD6]/70 focus:border-[#F5EAD6] focus:bg-[#000000]/50 focus:shadow-[0_0_0_3px_rgba(168,214,240,0.3)] transition-all duration-200 ${
                    invalidFields.camiseta ? 'border-[#A8D6F0]' : 'border-[#F5EAD6]/35'
                  }`}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
              <label className="block">
                <span className="block text-[12px] font-semibold tracking-[0.04em] mb-1.5 opacity-85">
                  Versión
                </span>
                <div className="relative">
                  <select
                    name="version"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    required
                    className="w-full h-12 pl-3.5 pr-9 rounded-[14px] border border-[#F5EAD6]/35 bg-[#000000]/35 outline-none text-[16px] appearance-none cursor-pointer focus:border-[#F5EAD6] focus:bg-[#000000]/50 focus:shadow-[0_0_0_3px_rgba(168,214,240,0.3)] transition-all duration-200 [&>option]:text-[#0A1B33]"
                  >
                    {VERSION_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="w-4 h-4 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5EAD6]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-[12px] font-semibold tracking-[0.04em] mb-1.5 opacity-85">
                  Talle
                </span>
                <div className="relative">
                  <select
                    name="size"
                    value={selectedSize}
                    onChange={(e) => {
                      if (e.target.value) onSelectSize(e.target.value);
                      if (invalidFields.size) setInvalidFields((p) => ({ ...p, size: false }));
                    }}
                    required
                    aria-invalid={Boolean(invalidFields.size)}
                    aria-describedby={errorMsg ? 'pedido-error' : undefined}
                    className={`w-full h-12 pl-3.5 pr-9 rounded-[14px] border bg-[#000000]/35 outline-none text-[16px] appearance-none cursor-pointer focus:border-[#F5EAD6] focus:bg-[#000000]/50 focus:shadow-[0_0_0_3px_rgba(168,214,240,0.3)] transition-all duration-200 [&>option]:text-[#0A1B33] ${
                      invalidFields.size ? 'border-[#A8D6F0]' : 'border-[#F5EAD6]/35'
                    }`}
                  >
                    <option value="">Elegí un talle</option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        Talle {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="w-4 h-4 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5EAD6]"
                  />
                </div>
              </label>
            </div>

            {/* Selector segmentado de envío */}
            <div
              role="radiogroup"
              aria-label="Envío"
              className="grid grid-cols-2 p-1 rounded-2xl bg-[#000000]/30"
            >
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="fulfil"
                  value="envio"
                  checked={fulfil === 'envio'}
                  onChange={() => setFulfil('envio')}
                  required
                  className="peer absolute opacity-0"
                />
                <span className="block text-center py-3 px-2 max-[380px]:py-[11px] max-[380px]:px-1 rounded-xl text-[14px] max-[380px]:text-[13px] font-semibold transition-colors duration-250 peer-checked:bg-[#F5EAD6] peer-checked:text-[#0A1B33] peer-focus-visible:outline-2 peer-focus-visible:outline-[#A8D6F0]">
                  Envío a todo Uruguay
                </span>
              </label>
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="fulfil"
                  value="coordinar"
                  checked={fulfil === 'coordinar'}
                  onChange={() => setFulfil('coordinar')}
                  className="peer absolute opacity-0"
                />
                <span className="block text-center py-3 px-2 max-[380px]:py-[11px] max-[380px]:px-1 rounded-xl text-[14px] max-[380px]:text-[13px] font-semibold transition-colors duration-250 peer-checked:bg-[#F5EAD6] peer-checked:text-[#0A1B33] peer-focus-visible:outline-2 peer-focus-visible:outline-[#A8D6F0]">
                  Coordinar entrega
                </span>
              </label>
            </div>

            {fulfil === 'envio' && (
              <label className="block">
                <span className="block text-[12px] font-semibold tracking-[0.04em] mb-1.5 opacity-85">
                  Departamento de destino
                </span>
                <div className="relative">
                  <select
                    name="departamento"
                    value={departamento}
                    onChange={(e) => {
                      setDepartamento(e.target.value);
                      if (invalidFields.departamento) {
                        setInvalidFields((p) => ({ ...p, departamento: false }));
                      }
                    }}
                    required
                    aria-invalid={Boolean(invalidFields.departamento)}
                    aria-describedby={errorMsg ? 'pedido-error' : undefined}
                    className={`w-full h-12 pl-3.5 pr-9 rounded-[14px] border bg-[#000000]/35 outline-none text-[16px] appearance-none cursor-pointer focus:border-[#F5EAD6] focus:bg-[#000000]/50 focus:shadow-[0_0_0_3px_rgba(168,214,240,0.3)] transition-all duration-200 [&>option]:text-[#0A1B33] ${
                      invalidFields.departamento ? 'border-[#A8D6F0]' : 'border-[#F5EAD6]/35'
                    }`}
                  >
                    <option value="">Elegí tu departamento</option>
                    {DEPARTAMENTOS_URUGUAY.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="w-4 h-4 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5EAD6]"
                  />
                </div>
              </label>
            )}

            <label className="flex gap-2.5 items-start min-h-6 text-[14px] leading-[1.4] cursor-pointer">
              <input
                type="checkbox"
                name="agree"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                  if (invalidFields.agree) setInvalidFields((p) => ({ ...p, agree: false }));
                }}
                required
                aria-invalid={Boolean(invalidFields.agree)}
                aria-describedby={errorMsg ? 'pedido-error' : undefined}
                className={`w-5 h-5 accent-[#A8D6F0] mt-[1px] flex-none focus-visible:outline-2 focus-visible:outline-[#A8D6F0] ${
                  invalidFields.agree ? 'outline-2 outline-[#A8D6F0]' : ''
                }`}
              />
              <span>
                Confirmo que la disponibilidad, el precio y el envío se confirman por WhatsApp.
              </span>
            </label>

            <button
              type="submit"
              className="h-14 border-0 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] font-bold text-[17px] cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 shadow-[0_16px_40px_-18px_rgba(168,214,240,0.65)]"
            >
              Preparar consulta para WhatsApp <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
            </button>

            <p id="pedido-error" role="alert" className="min-h-[1.2em] text-[14px] text-[#A8D6F0] font-semibold">
              {errorMsg}
            </p>
          </form>
        ) : (
          <motion.div
            ref={receiptRef}
            tabIndex={-1}
            initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel p-8 grid gap-3.5 border-[#F5EAD6]/35 bg-gradient-to-br from-[#F5EAD6]/14 to-[#000000]/45"
          >
            <p className="font-mono-cl text-[13px] text-[#A8D6F0]">CONSULTA LISTA</p>
            <p className="font-disp font-extrabold text-[clamp(26px,3vw,40px)] tracking-[-0.02em]">
              Todo pronto, {receipt.name}.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono-cl text-[20px] text-[#F5EAD6] bg-[#A8D6F0]/18 border border-dashed border-[#A8D6F0] px-3.5 py-2.5 rounded-xl font-bold">
                {receipt.consultaId}
              </p>
              <span className="text-[12px] opacity-75">
                Identificador de consulta (no es número de pedido ni de stock)
              </span>
            </div>
            <p className="leading-[1.55]">{receipt.summary}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a
                href={receipt.whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] no-underline font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                Abrir WhatsApp <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="h-11 px-[18px] rounded-full border border-[#F5EAD6] bg-transparent cursor-pointer font-semibold hover:bg-[#F5EAD6]/10 transition-colors"
              >
                Consultar otro modelo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
