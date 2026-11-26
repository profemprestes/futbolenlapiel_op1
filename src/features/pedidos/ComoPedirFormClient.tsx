'use client';

import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  DEPARTAMENTOS_URUGUAY,
  PRICE_REFERENCES,
  SIZES,
  VERSION_OPTIONS,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import { buildWhatsAppHref, computeConsultaCode } from '@/lib/whatsapp';

interface ConsultaReceipt {
  name: string;
  consultaId: string;
  summary: string;
  whatsAppHref: string;
}

function getVersionPriceHint(version: string): string {
  if (version === 'Versión Jugador') return PRICE_REFERENCES.jugador;
  if (version === 'Edición Retro') return PRICE_REFERENCES.retro;
  if (version === 'Versión Fan') return PRICE_REFERENCES.fan;
  return 'Según modelo';
}

export default function ComoPedirFormClient() {
  const [name, setName] = useState('');
  const [camiseta, setCamiseta] = useState('Uruguay 2026 Mundial');
  const [version, setVersion] = useState<string>(VERSION_OPTIONS[0]);
  const [size, setSize] = useState<string>('M');
  const [fulfil, setFulfil] = useState<'envio' | 'coordinar'>('envio');
  const [departamento, setDepartamento] = useState<string>('Montevideo');
  const [error, setError] = useState('');
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});
  const [receipt, setReceipt] = useState<ConsultaReceipt | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const camisetaInputRef = useRef<HTMLInputElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleOpenWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCamiseta = camiseta.trim();

    if (!trimmedName) {
      setInvalidFields({ name: true });
      setError('Escribí tu nombre para armar la consulta.');
      nameInputRef.current?.focus();
      return;
    }
    if (!trimmedCamiseta) {
      setInvalidFields({ camiseta: true });
      setError('Indicá qué camiseta te interesa consultar.');
      camisetaInputRef.current?.focus();
      return;
    }

    setInvalidFields({});
    setError('');
    const consultaId = computeConsultaCode(`${trimmedName}-${trimmedCamiseta}-${size}`);
    const href = buildWhatsAppHref({
      name: trimmedName,
      camiseta: trimmedCamiseta,
      version,
      size,
      fulfil,
      departamento,
      consultaId,
    });

    const destinoText =
      fulfil === 'envio'
        ? `envío a ${departamento}`
        : `coordinar retiro (${departamento})`;

    setReceipt({
      name: trimmedName,
      consultaId,
      summary: `${trimmedCamiseta}, ${version}, talle ${size}, ${destinoText}. Abrimos WhatsApp (${WHATSAPP_DISPLAY}) para confirmar disponibilidad y precio.`,
      whatsAppHref: href,
    });

    window.open(href, '_blank', 'noopener,noreferrer');
    requestAnimationFrame(() => {
      receiptRef.current?.focus();
    });
  };

  const handleReset = () => {
    setReceipt(null);
    setError('');
    setInvalidFields({});
    requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
  };

  if (receipt) {
    return (
      <div
        ref={receiptRef}
        tabIndex={-1}
        className="p-6 sm:p-8 rounded-[24px] bg-[var(--nh-elevated)] border border-[var(--nh-celeste)] grid gap-4"
      >
        <p className="nueva-mono text-[13px] text-[var(--nh-celeste)]">Consulta lista</p>
        <h2 className="nueva-display font-extrabold text-[32px] leading-[1.05]">
          Todo pronto, {receipt.name}.
        </h2>
        <p className="nueva-mono text-[20px] font-bold px-4 py-2.5 rounded-xl border border-dashed border-[var(--nh-celeste)] bg-[var(--nh-shadow-bg)] w-fit">
          {receipt.consultaId}
        </p>
        <p className="text-[16px] text-[var(--nh-muted)]">{receipt.summary}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={receipt.whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="nueva-btn-primary whitespace-nowrap"
          >
            <span>Abrir WhatsApp</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <button type="button" onClick={handleReset} className="nueva-btn-secondary">
            Consultar otro modelo
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleOpenWhatsApp}
      className="p-6 sm:p-8 rounded-[24px] bg-[var(--nh-elevated)] border border-[var(--nh-rule)] grid gap-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-[var(--nh-rule)]">
        <h2 className="nueva-display font-bold text-[28px] leading-[1.1]">
          Preparar consulta para WhatsApp
        </h2>
        <span className="nueva-mono text-[14px] text-[var(--nh-celeste)]">
          {getVersionPriceHint(version)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label htmlFor="cp-name" className="block">
          <span className="block text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
            Tu nombre
          </span>
          <input
            ref={nameInputRef}
            id="cp-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (invalidFields.name) setInvalidFields((p) => ({ ...p, name: false }));
            }}
            placeholder="Ej: Martín"
            aria-invalid={Boolean(invalidFields.name)}
            aria-describedby={error ? 'cp-error' : undefined}
            className="nueva-input"
          />
        </label>

        <label htmlFor="cp-camiseta" className="block">
          <span className="block text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
            Camiseta o modelo
          </span>
          <input
            ref={camisetaInputRef}
            id="cp-camiseta"
            name="camiseta"
            type="text"
            value={camiseta}
            onChange={(e) => {
              setCamiseta(e.target.value);
              if (invalidFields.camiseta) setInvalidFields((p) => ({ ...p, camiseta: false }));
            }}
            placeholder="Ej: España 1996 Luis Enrique 21"
            aria-invalid={Boolean(invalidFields.camiseta)}
            aria-describedby={error ? 'cp-error' : undefined}
            className="nueva-input"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
          <legend className="text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
            Versión
          </legend>
          <div className="flex flex-wrap gap-2">
            {VERSION_OPTIONS.map((opt) => {
              const active = version === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setVersion(opt)}
                  className={`min-h-10 px-3.5 rounded-full text-[13px] font-semibold border cursor-pointer transition-colors active:translate-y-px disabled:opacity-55 ${
                    active
                      ? 'bg-[var(--nh-celeste)] text-[var(--nh-ink)] border-[var(--nh-celeste)]'
                      : 'bg-transparent text-[var(--nh-parchment)] border-[var(--nh-rule)] hover:border-[var(--nh-celeste)]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
          <legend className="text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
            Talle
          </legend>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const active = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSize(s)}
                  className={`nueva-mono min-h-10 min-w-11 px-3 rounded-full text-[14px] font-bold border cursor-pointer transition-colors active:translate-y-px disabled:opacity-55 ${
                    active
                      ? 'bg-[var(--nh-celeste)] text-[var(--nh-ink)] border-[var(--nh-celeste)]'
                      : 'bg-transparent text-[var(--nh-parchment)] border-[var(--nh-rule)] hover:border-[var(--nh-celeste)]'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
          <legend className="text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
            Entrega
          </legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={fulfil === 'envio'}
              onClick={() => setFulfil('envio')}
              className={`min-h-10 px-3.5 rounded-full text-[13px] font-semibold border cursor-pointer transition-colors active:translate-y-px ${
                fulfil === 'envio'
                  ? 'bg-[var(--nh-parchment)] text-[var(--nh-ink)] border-[var(--nh-parchment)]'
                  : 'bg-transparent text-[var(--nh-parchment)] border-[var(--nh-rule)] hover:border-[var(--nh-celeste)]'
              }`}
            >
              Envío a domicilio
            </button>
            <button
              type="button"
              aria-pressed={fulfil === 'coordinar'}
              onClick={() => setFulfil('coordinar')}
              className={`min-h-10 px-3.5 rounded-full text-[13px] font-semibold border cursor-pointer transition-colors active:translate-y-px ${
                fulfil === 'coordinar'
                  ? 'bg-[var(--nh-parchment)] text-[var(--nh-ink)] border-[var(--nh-parchment)]'
                  : 'bg-transparent text-[var(--nh-parchment)] border-[var(--nh-rule)] hover:border-[var(--nh-celeste)]'
              }`}
            >
              Coordinar retiro
            </button>
          </div>
        </fieldset>

        <label htmlFor="cp-depto" className="block">
          <span className="block text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
            Departamento
          </span>
          <div className="relative">
            <select
              id="cp-depto"
              name="departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="nueva-input appearance-none pr-10 cursor-pointer"
            >
              {DEPARTAMENTOS_URUGUAY.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="w-4 h-4 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--nh-parchment)]"
            />
          </div>
        </label>
      </div>

      <button type="submit" className="nueva-btn-primary w-full whitespace-nowrap">
        <span>Consultar por WhatsApp</span>
        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
      </button>

      {error ? (
        <p id="cp-error" role="alert" className="text-[14px] font-semibold text-[var(--nh-celeste)]">
          {error}
        </p>
      ) : (
        <p className="text-[14px] text-[var(--nh-muted)]">
          Nada en esta página cobra ni reserva stock. Al abrir WhatsApp confirmamos disponibilidad y precio.
        </p>
      )}
    </form>
  );
}
