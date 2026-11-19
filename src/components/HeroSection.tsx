'use client';

import dynamic from 'next/dynamic';
import { ArrowUpRight, MoveHorizontal } from 'lucide-react';
import type { ModeloId } from '@/lib/futbolenlapiel-data';
import { MODELO_NAMES } from '@/lib/futbolenlapiel-data';

// bundle-dynamic-imports: cargar Three.js bajo demanda en cliente sin bloquear SSR
const Logo3D = dynamic(() => import('./Logo3D'), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-full bg-black/50" aria-hidden="true" />,
});

// rendering-hoist-jsx: extraer contenido estático fuera del componente
const BRAND_PILLARS = ['Actuales & Retros', 'Envíos a todo Uruguay', 'Atención directa'] as const;

const BRAND_FACTS = [
  { label: 'Propuesta', value: 'Selecciones, clubes y retros' },
  { label: 'Cobertura', value: 'Montevideo e Interior' },
  { label: 'Atención', value: 'Asesoramiento por WhatsApp' },
  { label: 'Comunidad', value: 'Para hinchas y coleccionistas' },
] as const;

const ROTATE_BADGE_SVG = (
  <>
    <svg viewBox="0 0 120 120" className="cl-badge-spin w-full h-full">
      <defs>
        <path id="bp" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <text className="font-mono-cl text-[10.2px] font-bold tracking-[0.13em] fill-[#F5EAD6]">
        <textPath href="#bp" textLength="284" lengthAdjust="spacing">
          GIRAR CAMISETA &#183; GIRAR CAMISETA &#183;{' '}
        </textPath>
      </text>
    </svg>
    <span className="absolute inset-0 grid place-items-center text-[#A8D6F0]">
      <MoveHorizontal className="w-6 h-6 max-md:w-4 max-md:h-4" strokeWidth={2.2} />
    </span>
  </>
);

interface HeroSectionProps {
  selectedModelo: ModeloId;
  isDragging: boolean;
  sliderDeg: number;
  sliderText: string;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerEnd: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function HeroSection({
  selectedModelo,
  isDragging,
  sliderDeg,
  sliderText,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
  onKeyDown,
}: HeroSectionProps) {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-h"
      className="cl-hero relative h-screen h-[100svh] min-h-[620px] max-md:min-h-[640px]"
    >
      <div className="cl-hero-kick absolute left-[var(--pad)] top-[86px] max-md:top-[64px] max-w-[360px] max-md:max-w-none max-md:right-[var(--pad)] text-[15px] leading-[1.45]">
        <p className="font-mono-cl text-[12px] font-bold mb-2 text-[#A8D6F0]">
          URUGUAY <span className="text-[#8ECBF5]">/</span> ENVÍOS A TODO EL PAÍS
        </p>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="relative z-10 w-16 h-16 max-md:w-12 max-md:h-12 rounded-full border border-[#F5EAD6]/25 bg-black/70 overflow-hidden shrink-0">
            <Logo3D planeHeight={2.1} ariaLabel="Emblema oficial Fútbol en la Piel" />
          </div>
          <div>
            <h1
              id="hero-h"
              className="font-archivo text-[clamp(22px,2.2vw,32px)] leading-[1.05] tracking-[-0.02em] text-[#F5EAD6]"
            >
              FUTBOL EN LA PIEL
            </h1>
            <p className="text-[14px] font-semibold text-[#8ECBF5]">
              La pasión se lleva puesta.
            </p>
          </div>
        </div>
        <p className="cl-hero-sub max-md:hidden text-[14px] opacity-90">
          Camisetas actuales, ediciones especiales y clásicos retros para vivir cada partido con historia.
        </p>
      </div>

      {/* Superficie interactiva para girar la camiseta */}
      <div
        tabIndex={0}
        role="slider"
        aria-label="Girar la camiseta"
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={sliderDeg}
        aria-valuetext={sliderText}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
        className="absolute inset-x-0 top-[70px] bottom-0 cursor-grab active:cursor-grabbing touch-pan-y focus-visible:-outline-offset-8"
      />

      {/* Insignia circular giratoria */}
      <div
        aria-hidden="true"
        className={`cl-hero-badge absolute right-[calc(var(--pad)+10px)] top-[44%] max-md:right-3 max-md:top-auto max-md:bottom-[214px] w-28 h-28 max-md:w-[72px] max-md:h-[72px] pointer-events-none transition-transform duration-350 ease-[var(--ease)] ${
          isDragging ? 'scale-108' : 'scale-100'
        }`}
      >
        {ROTATE_BADGE_SVG}
      </div>

      {/* Presentación general de la marca */}
      <div className="cl-picker glass-panel absolute left-[var(--pad)] bottom-[var(--pad)] w-[388px] min-w-0 p-4 pb-3.5 max-md:left-3 max-md:right-3 max-md:bottom-3 max-md:w-auto max-md:p-3 max-md:rounded-[18px]">
        <p className="font-mono-cl text-[11.5px] font-bold tracking-[0.06em] text-[#A8D6F0] mb-1.5">
          IDENTIDAD DE MARCA
        </p>
        <p className="text-[14px] max-md:text-[13px] font-semibold leading-snug text-[#F5EAD6]">
          Cultura futbolera en cada camiseta: diseños actuales y reliquias históricas con atención cercana.
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5 max-md:hidden" aria-label="Pilares de la marca">
          {BRAND_PILLARS.map((pillar) => (
            <li
              key={pillar}
              className="rounded-full border border-[#F5EAD6]/25 bg-[#0A1B33]/45 px-2.5 py-1 font-mono-cl text-[11px] font-semibold text-[#F5EAD6]"
            >
              {pillar}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-2 max-md:mt-2.5">
          <a
            href="#modelos"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] no-underline text-[13px] font-bold transition-colors"
          >
            Explorar modelos <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <a
            href="#pedido"
            className="inline-flex items-center h-9 px-3.5 rounded-full border border-[#8ECBF5]/50 hover:border-[#F5EAD6] no-underline text-[12.5px] font-semibold transition-colors"
          >
            Contacto directo
          </a>
        </div>
      </div>

      {/* Ficha general de la marca */}
      <aside
        aria-label="Información general de Fútbol en la Piel"
        className="cl-droptag glass-panel absolute right-[var(--pad)] bottom-[var(--pad)] w-[290px] px-[18px] py-4 max-md:left-3 max-md:right-3 max-md:bottom-[146px] max-md:w-auto max-md:px-3.5 max-md:py-[9px] max-md:rounded-[14px] max-md:flex max-md:gap-2.5 max-md:items-center max-md:justify-between"
      >
        <p className="cl-dt-n font-mono-cl text-[13px] font-bold tracking-[0.06em] text-[#A8D6F0]">
          COLECCIÓN DESTACADA
        </p>
        <p className="font-disp font-bold text-[18px] max-md:text-[13px] mt-1 mb-2.5 max-md:m-0 leading-tight">
          {MODELO_NAMES[selectedModelo]}
        </p>
        <dl className="max-md:hidden">
          {BRAND_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="cl-dt-row flex justify-between gap-3 py-[6px] border-t border-[#8ECBF5]/35 text-[12.5px]"
            >
              <dt className="opacity-70">{fact.label}</dt>
              <dd className="font-semibold text-right">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </aside>

      {/* Indicador de scroll */}
      <a
        href="#camiseta"
        className="cl-scroll-cue absolute left-1/2 bottom-[var(--pad)] -translate-x-1/2 text-[12px] no-underline flex gap-2.5 items-center opacity-85 max-md:hidden"
      >
        <span className="font-mono-cl">01 / 04</span> Deslizá
      </a>
    </section>
  );
}
