'use client';

import dynamic from 'next/dynamic';
import { MoveHorizontal } from 'lucide-react';

// bundle-dynamic-imports: cargar Three.js bajo demanda en cliente sin bloquear SSR
const Logo3D = dynamic(() => import('../Logo3D'), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-full bg-black/50" aria-hidden="true" />,
});

// rendering-hoist-jsx: extraer contenido estático fuera del componente
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

const SCROLL_CUE = (
  <a
    href="#camiseta"
    className="cl-scroll-cue absolute left-1/2 bottom-[var(--pad)] -translate-x-1/2 max-md:left-[var(--pad)] max-md:translate-x-0 max-md:bottom-[max(24px,5svh)] text-[12px] no-underline flex gap-2.5 items-center opacity-85"
  >
    <span className="font-mono-cl">01 / 04</span> Deslizá
  </a>
);

interface HeroSectionProps {
  isDragging: boolean;
  sliderDeg: number;
  sliderText: string;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerEnd: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function HeroSection({
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
        <p className="cl-hero-sub text-[14px] max-md:text-[13px] opacity-90 max-md:mt-1 max-md:max-w-[300px]">
          Camisetas actuales, Mundial 2026, clubes y clásicos retros en talles S a XL.
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
        className={`cl-hero-badge absolute right-[calc(var(--pad)+10px)] top-[44%] max-md:right-[var(--pad)] max-md:top-auto max-md:bottom-[max(20px,4svh)] w-28 h-28 max-md:w-[72px] max-md:h-[72px] pointer-events-none transition-transform duration-350 ease-[var(--ease)] ${isDragging ? 'scale-108' : 'scale-100'
          }`}
      >
        {ROTATE_BADGE_SVG}
      </div>

      {SCROLL_CUE}
    </section>
  );
}
