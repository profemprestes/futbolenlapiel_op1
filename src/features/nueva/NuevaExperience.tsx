'use client';

import { ArrowUpRight, ChevronDown, ExternalLink, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
  BRAND_LOGOS,
  COMMERCIAL_INFO,
  DEPARTAMENTOS_URUGUAY,
  INSTAGRAM_HANDLE,
  PRICE_REFERENCES,
  SIZES,
  VERSION_OPTIONS,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import type { CsvCatalogItem } from '@/lib/data/csv-catalogo';
import { type CatalogCategoryId, MODELOS, type ModeloId } from '@/lib/data/modelos';
import { buildWhatsAppHref, createWhatsAppUrl, computeConsultaCode } from '@/lib/whatsapp';

const Nueva3DStage = dynamic(() => import('./Nueva3DStage'), {
  ssr: false,
  loading: () => (
    <div className="nueva-stage-surface min-h-[460px] lg:min-h-[540px] p-6 grid place-items-center">
      <Image
        src="/camisetas/uruguay-away-2026-nike-jugador.jpeg"
        alt="Camiseta Uruguay 2026 Mundial Alternativa"
        width={420}
        height={420}
        priority
        className="w-64 h-64 object-cover rounded-2xl"
      />
    </div>
  ),
});

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface NuevaExperienceProps {
  catalogItems: CsvCatalogItem[];
}

interface ConsultaReceipt {
  name: string;
  consultaId: string;
  summary: string;
  whatsAppHref: string;
}

const FEATURED_GALLERY = [
  {
    title: 'Uruguay 2026 Mundial Alternativa',
    detail: 'Versión Jugador Nike Aero-FIT',
    price: PRICE_REFERENCES.jugador,
    src: '/camisetas/uruguay-away-2026-nike-jugador.jpeg',
    alt: 'Camiseta Uruguay 2026 azul marino versión jugador',
  },
  {
    title: 'Manchester United 1993–95 Cantona #7',
    detail: 'Edición Retro Umbro negra',
    price: PRICE_REFERENCES.retro,
    src: '/camisetas/manchester-united-away-1993-1995-umbro.jpeg',
    alt: 'Camiseta retro Manchester United 1993-95 negra Cantona 7',
  },
  {
    title: 'Nacional 2026 Titular Blanca',
    detail: 'Versión Fan Umbro oficial',
    price: PRICE_REFERENCES.fan,
    src: '/camisetas/nacional-home-2026-umbro-blanca.jpeg',
    alt: 'Camiseta Club Nacional de Football 2026 blanca',
  },
  {
    title: 'Noruega 2026 Haaland #9',
    detail: 'Versión Jugador Nike roja',
    price: PRICE_REFERENCES.jugador,
    src: '/camisetas/noruega.jpeg',
    alt: 'Camiseta Noruega 2026 roja Haaland 9',
  },
] as const;

const PRICE_TIERS = [
  {
    name: 'Versión Fan',
    price: PRICE_REFERENCES.fan,
    fit: 'Calce clásico para uso diario, escudo y detalles bordados.',
    availability: 'Stock S a XL y todos los talles por encargo',
  },
  {
    name: 'Edición Retro',
    price: PRICE_REFERENCES.retro,
    fit: 'Clásicos 1988 a 2018 con etiquetas y dorsales históricos.',
    availability: 'Entrega inmediata en modelos seleccionados',
  },
  {
    name: 'Versión Jugador',
    price: PRICE_REFERENCES.jugador,
    fit: 'Calidad muy alta, tela técnica liviana y corte entallado.',
    availability: 'Stock S a XL y todos los talles por encargo',
  },
] as const;

const CATEGORY_TABS: Array<{ id: 'todas' | CatalogCategoryId; label: string }> = [
  { id: 'todas', label: 'Todas' },
  { id: 'actuales', label: 'Actuales' },
  { id: 'retros', label: 'Retros' },
  { id: 'uruguay', label: 'Uruguay' },
  { id: 'clubes', label: 'Clubes' },
];

export default function NuevaExperience({ catalogItems }: NuevaExperienceProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const [selectedModelo, setSelectedModelo] = useState<ModeloId>('uruguay');
  const [activeCategory, setActiveCategory] = useState<'todas' | CatalogCategoryId>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCatalog, setShowAllCatalog] = useState(false);

  // WhatsApp Form state (preserving original wiring)
  const [name, setName] = useState('');
  const [camiseta, setCamiseta] = useState(MODELOS[0].name);
  const [version, setVersion] = useState<string>(VERSION_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [fulfil, setFulfil] = useState<'envio' | 'coordinar'>('envio');
  const [departamento, setDepartamento] = useState('');
  const [agree, setAgree] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});
  const [receipt, setReceipt] = useState<ConsultaReceipt | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalogItems.filter((item) => {
      if (activeCategory !== 'todas' && item.category !== activeCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [catalogItems, activeCategory, searchQuery]);

  const visibleItems = showAllCatalog ? filteredItems : filteredItems.slice(0, 12);

  const jumpToOrder = (itemTitle: string, itemVersion?: string) => {
    setCamiseta(itemTitle);
    if (itemVersion) setVersion(itemVersion);
    setReceipt(null);
    document.getElementById('pedido')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    requestAnimationFrame(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    });
  };

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

    setReceipt({
      name: trimmedName,
      consultaId,
      summary: `${trimmedCamiseta}, ${version}, talle ${selectedSize}, ${destinoText}. Abrimos WhatsApp (${WHATSAPP_DISPLAY}) para confirmar stock, precio y envío.`,
      whatsAppHref,
    });

    window.open(whatsAppHref, '_blank', 'noopener,noreferrer');
    requestAnimationFrame(() => {
      receiptRef.current?.focus();
    });
  };

  const handleReset = () => {
    setReceipt(null);
    setName('');
    setSelectedSize('');
    setDepartamento('');
    setAgree(false);
    setErrorMsg('');
    setInvalidFields({});
    requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
  };

  return (
    <div className="nueva-shell">
      {/* Edge-aligned Navigation */}
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
            <a href="#catalogo" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Catálogo
            </a>
            <Link href="/retros" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Retros
            </Link>
            <Link href="/envios" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Envíos
            </Link>
            <Link href="/talles" className="no-underline text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] transition-colors">
              Talles
            </Link>
          </nav>

          <a href="#pedido" className="nueva-btn-secondary !min-h-10 !px-4 !text-[14px]">
            Pedir ahora
          </a>
        </div>
      </header>

      <main>
        {/* 1. Hero Stage (Asymmetric 5 / 7 split, fits 1280x800 cleanly) */}
        <section aria-labelledby="nueva-hero-h" className="py-10 lg:py-14">
          <div className="nueva-container nueva-hero-grid">
            <div className="flex flex-col items-start gap-5">
              <h1
                id="nueva-hero-h"
                className="nueva-display font-extrabold text-[clamp(2.75rem,5.2vw,4.75rem)] leading-[0.98] tracking-[-0.025em] text-[var(--nh-parchment)] max-w-[14ch]"
              >
                Camisetas que se llevan puestas
              </h1>
              <p className="text-[1.125rem] text-[var(--nh-muted)] leading-[1.55] max-w-[44ch]">
                Stock inmediato en Uruguay y ediciones retro por encargo con envío nacional.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href="#pedido" className="nueva-btn-primary">
                  <span>Consultar por WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a href="#catalogo" className="nueva-btn-secondary">
                  Explorar catálogo ({catalogItems.length})
                </a>
              </div>

              <dl className="grid grid-cols-3 gap-4 pt-5 mt-2 border-t border-[var(--nh-rule)] w-full max-w-[440px]">
                <div>
                  <dt className="text-[13px] text-[var(--nh-muted)]">Versión Fan</dt>
                  <dd className="nueva-mono text-[15px] font-bold text-[var(--nh-parchment)] mt-0.5">
                    {PRICE_REFERENCES.fan}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-[var(--nh-muted)]">Retros</dt>
                  <dd className="nueva-mono text-[15px] font-bold text-[var(--nh-parchment)] mt-0.5">
                    {PRICE_REFERENCES.retro}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-[var(--nh-muted)]">Jugador</dt>
                  <dd className="nueva-mono text-[15px] font-bold text-[var(--nh-celeste)] mt-0.5">
                    {PRICE_REFERENCES.jugador}
                  </dd>
                </div>
              </dl>
            </div>

            <Nueva3DStage
              modelo={selectedModelo}
              reducedMotion={reducedMotion}
              onSelectModelo={setSelectedModelo}
            />
          </div>
        </section>

        {/* 2. Reference Prices & Versions (Rows on Warm Parchment band) */}
        <section aria-labelledby="precios-h" className="bg-[var(--nh-parchment)] text-[var(--nh-ink)] py-20 lg:py-24">
          <div className="nueva-container">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-8 border-b border-[var(--nh-rule-ink)]">
              <h2
                id="precios-h"
                className="nueva-display font-extrabold text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.02em]"
              >
                Precios de referencia y calidades
              </h2>
              <p className="text-[16px] text-[var(--nh-ink)]/80 max-w-[46ch]">
                Talles S a XL en stock habitual y todos los talles por encargo a los 19 departamentos.
              </p>
            </div>

            <div className="divide-y divide-[var(--nh-rule-ink)]">
              {PRICE_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className="py-6 grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,3fr)_minmax(0,6fr)] gap-3 md:gap-6 items-baseline"
                >
                  <h3 className="nueva-display font-bold text-[26px] leading-[1.1]">{tier.name}</h3>
                  <p className="nueva-mono text-[20px] font-bold text-[var(--nh-azul)]">{tier.price}</p>
                  <p className="text-[16px] text-[var(--nh-ink)]/85">
                    {tier.fit} {tier.availability}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Real Photography Split (Asymmetric 7 / 5 showcase) */}
        <section aria-labelledby="fotos-h" className="py-24 lg:py-28">
          <div className="nueva-container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <h2
                id="fotos-h"
                className="nueva-display font-extrabold text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.02em]"
              >
                Ingresos en mano
              </h2>
              <Link href="/tienda" className="nueva-btn-secondary !min-h-10 !px-4 !text-[14px]">
                <span>Ver tienda completa</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="nueva-split-photo">
              <figure className="nueva-photo-frame min-h-[420px] lg:min-h-[540px] flex flex-col justify-end">
                <Image
                  src={FEATURED_GALLERY[0].src}
                  alt={FEATURED_GALLERY[0].alt}
                  width={900}
                  height={1100}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <figcaption className="relative z-10 p-6 bg-gradient-to-t from-[var(--nh-shadow-bg)] via-[var(--nh-shadow-bg)]/85 to-transparent flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[20px] font-bold text-[var(--nh-parchment)]">
                      {FEATURED_GALLERY[0].title}
                    </p>
                    <p className="text-[14px] text-[var(--nh-muted)]">
                      {FEATURED_GALLERY[0].detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="nueva-mono text-[15px] font-bold text-[var(--nh-celeste)]">
                      {FEATURED_GALLERY[0].price}
                    </span>
                    <button
                      type="button"
                      onClick={() => jumpToOrder(FEATURED_GALLERY[0].title, 'Versión Jugador')}
                      className="nueva-btn-primary !min-h-10 !px-4 !text-[14px]"
                    >
                      Consultar
                    </button>
                  </div>
                </figcaption>
              </figure>

              <div className="grid grid-rows-3 gap-4">
                {FEATURED_GALLERY.slice(1).map((item) => (
                  <article
                    key={item.src}
                    className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 items-center p-3 rounded-[18px] bg-[var(--nh-elevated)]/65 border border-[var(--nh-rule)]"
                  >
                    <div className="nueva-photo-frame aspect-square w-28 h-28 rounded-[12px]">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={240}
                        height={240}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex flex-col gap-1">
                      <h3 className="text-[16px] font-bold text-[var(--nh-parchment)] truncate">
                        {item.title}
                      </h3>
                      <p className="text-[14px] text-[var(--nh-muted)]">{item.detail}</p>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="nueva-mono text-[14px] font-bold text-[var(--nh-celeste)]">
                          {item.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => jumpToOrder(item.title)}
                          className="text-[14px] font-semibold text-[var(--nh-parchment)] underline decoration-[var(--nh-celeste)]/60 hover:text-[var(--nh-celeste)] cursor-pointer bg-transparent border-0 p-0"
                        >
                          Pedir
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Full CSV Catalog Explorer (Switcher + Index) */}
        <section
          id="catalogo"
          aria-labelledby="catalogo-h"
          className="py-20 lg:py-24 border-t border-[var(--nh-rule)] bg-[var(--nh-shadow-bg)]"
        >
          <div className="nueva-container">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <h2
                  id="catalogo-h"
                  className="nueva-display font-extrabold text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.02em]"
                >
                  Catálogo publicado en Instagram
                </h2>
                <p className="text-[16px] text-[var(--nh-muted)] mt-2 max-w-[54ch]">
                  Mostrando {visibleItems.length} de {filteredItems.length} modelos reales de {INSTAGRAM_HANDLE}.
                </p>
              </div>

              <div className="relative w-full lg:w-80">
                <label htmlFor="nueva-search" className="sr-only">
                  Buscar camiseta o marca
                </label>
                <Search
                  className="w-4 h-4 text-[var(--nh-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="nueva-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowAllCatalog(false);
                  }}
                  placeholder="Buscar equipo, jugador o marca..."
                  className="nueva-input !pl-10"
                />
              </div>
            </div>

            {/* Category filter tabs */}
            <div role="tablist" aria-label="Filtrar catálogo por categoría" className="flex flex-wrap gap-2 pb-6 border-b border-[var(--nh-rule)]">
              {CATEGORY_TABS.map((tab) => {
                const selected = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => {
                      setActiveCategory(tab.id);
                      setShowAllCatalog(false);
                    }}
                    className={`min-h-10 px-4 rounded-full text-[14px] font-semibold border cursor-pointer transition-colors ${
                      selected
                        ? 'bg-[var(--nh-celeste)] text-[var(--nh-ink)] border-[var(--nh-celeste)]'
                        : 'bg-transparent text-[var(--nh-parchment)] border-[var(--nh-rule)] hover:border-[var(--nh-celeste)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Scannable Catalog Index */}
            {visibleItems.length === 0 ? (
              <div className="py-12 text-left">
                <p className="text-[16px] text-[var(--nh-muted)] mb-4">
                  No encontramos modelos con esa búsqueda en el catálogo cargado.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('todas');
                  }}
                  className="nueva-btn-secondary"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--nh-rule)]">
                {visibleItems.map((item) => (
                  <article
                    key={item.id}
                    className="py-4 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,3fr)] gap-3 md:gap-4 items-center"
                  >
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold text-[var(--nh-parchment)]">
                        {item.title}
                      </h3>
                      <p className="text-[14px] text-[var(--nh-muted)] truncate">
                        {item.brand}
                      </p>
                    </div>

                    <p className="text-[14px] text-[var(--nh-muted)]">{item.version}</p>

                    <p className="nueva-mono text-[15px] font-bold text-[var(--nh-celeste)]">
                      {item.priceLabel}
                    </p>

                    <div className="flex flex-wrap items-center md:justify-end gap-3">
                      <a
                        href={item.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[14px] text-[var(--nh-muted)] hover:text-[var(--nh-parchment)] no-underline"
                      >
                        <span>Instagram</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onClick={() => jumpToOrder(item.title, item.version)}
                        className="nueva-btn-secondary !min-h-10 !px-4 !text-[14px]"
                      >
                        Consultar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {filteredItems.length > 12 && (
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => setShowAllCatalog((prev) => !prev)}
                  className="nueva-btn-secondary"
                >
                  {showAllCatalog
                    ? 'Mostrar menos modelos'
                    : `Ver todos los ${filteredItems.length} modelos`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 5. WhatsApp Order Form & Commercial Rules */}
        <section id="pedido" aria-labelledby="nueva-pedido-h" className="py-24 lg:py-28 border-t border-[var(--nh-rule)]">
          <div className="nueva-container nueva-form-grid">
            <div>
              <h2
                id="nueva-pedido-h"
                className="nueva-display font-extrabold text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.02em] mb-6"
              >
                Pedí por WhatsApp en minutos
              </h2>

              <ol className="list-decimal pl-5 space-y-5 text-[16px] text-[var(--nh-muted)]">
                <li>
                  <strong className="block text-[var(--nh-parchment)] font-semibold">
                    Stock inmediato y encargos
                  </strong>
                  Talles S a XL en stock habitual y todos los talles por encargo en calidad alta.
                </li>
                <li>
                  <strong className="block text-[var(--nh-parchment)] font-semibold">
                    Medios de pago
                  </strong>
                  Aceptamos {COMMERCIAL_INFO.payments.join(', ')}.
                </li>
                <li>
                  <strong className="block text-[var(--nh-parchment)] font-semibold">
                    Envíos a todo Uruguay
                  </strong>
                  {COMMERCIAL_INFO.shipping.map((s) => `${s.zone}: ${s.detail}`).join(' ')}
                </li>
                <li>
                  <strong className="block text-[var(--nh-parchment)] font-semibold">
                    Cambios
                  </strong>
                  {COMMERCIAL_INFO.sizingAndChanges[1].detail}
                </li>
              </ol>
            </div>

            {!receipt ? (
              <form
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-[24px] bg-[var(--nh-elevated)] border border-[var(--nh-rule)] grid gap-4"
              >
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-[var(--nh-rule)]">
                  <h3 className="nueva-display font-bold text-[28px]">Armar consulta</h3>
                  <span className="nueva-mono text-[13px] text-[var(--nh-celeste)]">
                    {WHATSAPP_DISPLAY}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
                      Tu nombre
                    </span>
                    <input
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
                      aria-describedby={errorMsg ? 'nueva-pedido-error' : undefined}
                      className="nueva-input"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
                      Camiseta elegida
                    </span>
                    <input
                      name="camiseta"
                      type="text"
                      placeholder="Ej: Uruguay 2026 Mundial"
                      value={camiseta}
                      onChange={(e) => {
                        setCamiseta(e.target.value);
                        if (invalidFields.camiseta) {
                          setInvalidFields((p) => ({ ...p, camiseta: false }));
                        }
                      }}
                      required
                      aria-invalid={Boolean(invalidFields.camiseta)}
                      aria-describedby={errorMsg ? 'nueva-pedido-error' : undefined}
                      className="nueva-input"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
                      Versión
                    </span>
                    <div className="relative">
                      <select
                        name="version"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="nueva-input appearance-none pr-10 cursor-pointer"
                      >
                        {VERSION_OPTIONS.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        aria-hidden="true"
                        className="w-4 h-4 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--nh-parchment)]"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="block text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
                      Talle
                    </span>
                    <div className="relative">
                      <select
                        name="size"
                        value={selectedSize}
                        onChange={(e) => {
                          setSelectedSize(e.target.value);
                          if (invalidFields.size) setInvalidFields((p) => ({ ...p, size: false }));
                        }}
                        required
                        aria-invalid={Boolean(invalidFields.size)}
                        aria-describedby={errorMsg ? 'nueva-pedido-error' : undefined}
                        className="nueva-input appearance-none pr-10 cursor-pointer"
                      >
                        <option value="">Elegí un talle</option>
                        {SIZES.map((s) => (
                          <option key={s} value={s}>
                            Talle {s}
                          </option>
                        ))}
                        <option value="Otro (por encargo)">Otro talle (por encargo)</option>
                      </select>
                      <ChevronDown
                        aria-hidden="true"
                        className="w-4 h-4 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--nh-parchment)]"
                      />
                    </div>
                  </label>
                </div>

                <fieldset className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[var(--nh-shadow-bg)] border border-[var(--nh-rule)]">
                  <legend className="sr-only">Modalidad de entrega</legend>
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="fulfil"
                      value="envio"
                      checked={fulfil === 'envio'}
                      onChange={() => setFulfil('envio')}
                      className="sr-only peer"
                    />
                    <span className="block text-center py-2.5 px-3 rounded-xl text-[14px] font-semibold peer-checked:bg-[var(--nh-parchment)] peer-checked:text-[var(--nh-ink)] transition-colors">
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
                      className="sr-only peer"
                    />
                    <span className="block text-center py-2.5 px-3 rounded-xl text-[14px] font-semibold peer-checked:bg-[var(--nh-parchment)] peer-checked:text-[var(--nh-ink)] transition-colors">
                      Coordinar entrega
                    </span>
                  </label>
                </fieldset>

                {fulfil === 'envio' && (
                  <label className="block">
                    <span className="block text-[14px] font-semibold mb-1.5 text-[var(--nh-parchment)]">
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
                        aria-describedby={errorMsg ? 'nueva-pedido-error' : undefined}
                        className="nueva-input appearance-none pr-10 cursor-pointer"
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
                        className="w-4 h-4 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--nh-parchment)]"
                      />
                    </div>
                  </label>
                )}

                <label className="flex gap-3 items-start text-[14px] leading-[1.45] cursor-pointer">
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
                    aria-describedby={errorMsg ? 'nueva-pedido-error' : undefined}
                    className="w-5 h-5 mt-0.5 accent-[var(--nh-celeste)] shrink-0"
                  />
                  <span>
                    Confirmo que la disponibilidad, el precio final y el envío se confirman por WhatsApp.
                  </span>
                </label>

                <button type="submit" className="nueva-btn-primary w-full whitespace-nowrap">
                  <span>Consultar por WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <p id="nueva-pedido-error" role="alert" className="min-h-[1.2em] text-[14px] font-semibold text-[var(--nh-celeste)]">
                  {errorMsg}
                </p>
              </form>
            ) : (
              <div
                ref={receiptRef}
                tabIndex={-1}
                className="p-8 rounded-[24px] bg-[var(--nh-elevated)] border border-[var(--nh-celeste)] grid gap-4"
              >
                <p className="nueva-mono text-[13px] text-[var(--nh-celeste)]">
                  Consulta preparada
                </p>
                <h3 className="nueva-display font-extrabold text-[34px] leading-[1.05]">
                  Todo pronto, {receipt.name}.
                </h3>
                <p className="nueva-mono text-[20px] font-bold px-4 py-2.5 rounded-xl border border-dashed border-[var(--nh-celeste)] bg-[var(--nh-shadow-bg)] w-fit">
                  {receipt.consultaId}
                </p>
                <p className="text-[16px] text-[var(--nh-muted)]">{receipt.summary}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={receipt.whatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nueva-btn-primary"
                  >
                    <span>Abrir WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <button type="button" onClick={handleReset} className="nueva-btn-secondary">
                    Consultar otro modelo
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mast Footer on Warm Parchment */}
      <footer className="bg-[var(--nh-parchment)] text-[var(--nh-ink)] pt-16 pb-10">
        <div className="nueva-container">
          <p className="nueva-display font-black text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.03em] pb-8 border-b-2 border-[var(--nh-ink)]">
            Fútbol en la Piel
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
            <div className="space-y-3">
              <Image
                src={BRAND_LOGOS.horizontal}
                alt="Fútbol en la Piel"
                width={120}
                height={56}
                className="h-11 w-auto object-contain"
              />
              <p className="text-[14px] text-[var(--nh-ink)]/80">
                La pasión se lleva puesta. Camisetas actuales y retros en Uruguay.
              </p>
            </div>

            <div>
              <h3 className="text-[14px] font-bold mb-2">Instagram</h3>
              <p className="text-[15px] text-[var(--nh-ink)]/85">
                {INSTAGRAM_HANDLE}, lanzamientos y catálogo completo de fútbol y basket.
              </p>
            </div>

            <div>
              <h3 className="text-[14px] font-bold mb-2">WhatsApp</h3>
              <p className="text-[15px] text-[var(--nh-ink)]/85">
                Atención directa:{' '}
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

            <nav aria-label="Pie de página" className="flex flex-col gap-1.5 text-[15px]">
              <h3 className="text-[14px] font-bold mb-1">Secciones</h3>
              <Link href="/tienda" className="no-underline hover:text-[var(--nh-azul)] font-semibold">
                Tienda y stock
              </Link>
              <Link href="/retros" className="no-underline hover:text-[var(--nh-azul)] font-semibold">
                Retros
              </Link>
              <Link href="/talles" className="no-underline hover:text-[var(--nh-azul)] font-semibold">
                Talles y cambios
              </Link>
              <Link href="/envios" className="no-underline hover:text-[var(--nh-azul)] font-semibold">
                Envíos y pagos
              </Link>
              <Link href="/preguntas" className="no-underline hover:text-[var(--nh-azul)] font-semibold">
                Preguntas frecuentes
              </Link>
            </nav>
          </div>

          <p className="mt-10 pt-6 border-t border-[var(--nh-rule-ink)] text-[13px] text-[var(--nh-ink)]/75">
            Fútbol en la Piel ({INSTAGRAM_HANDLE}), Uruguay. Precios de referencia sujetos a confirmación por WhatsApp.
          </p>
        </div>
      </footer>
    </div>
  );
}
