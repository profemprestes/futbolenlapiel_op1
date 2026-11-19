'use client';

import { ArrowUpRight, MoveHorizontal } from 'lucide-react';
import type { ModeloId } from '@/lib/futbolenlapiel-data';
import { MODELO_NAMES, SIZES } from '@/lib/futbolenlapiel-data';
import Logo3D from './Logo3D';

interface HeroSectionProps {
  selectedSize: string;
  selectedModelo: ModeloId;
  isDragging: boolean;
  sliderDeg: number;
  sliderText: string;
  onSelectSize: (size: string) => void;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerEnd: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function HeroSection({
  selectedSize,
  selectedModelo,
  isDragging,
  sliderDeg,
  sliderText,
  onSelectSize,
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
      <div className="cl-hero-kick absolute left-[var(--pad)] top-[86px] max-md:top-[64px] max-w-[340px] max-md:max-w-none max-md:right-[var(--pad)] text-[15px] leading-[1.45]">
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
          Camisetas actuales y retros. Consultá stock por privado y pedí por WhatsApp.
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
      </div>

      {/* Selector de talles + CTAs */}
      <fieldset className="cl-picker glass-panel absolute left-[var(--pad)] bottom-[var(--pad)] w-[372px] min-w-0 p-4 pb-3.5 max-md:left-3 max-md:right-3 max-md:bottom-3 max-md:w-auto max-md:p-3 max-md:rounded-[18px]">
        <legend className="cl-picker-legend float-left w-full font-bold text-[14px] max-md:text-[13px] mb-3 max-md:mb-2">
          Talle{' '}
          <span className="font-normal opacity-75 ml-1.5">Según publicación</span>
        </legend>
        <div
          role="radiogroup"
          aria-label="Elegí tu talle"
          className="cl-chips-scroll clear-both max-w-full grid grid-cols-4 gap-2 max-md:flex max-md:overflow-x-auto max-md:pb-0.5"
        >
          {SIZES.map((s) => {
            const checked = selectedSize === s;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={`Talle ${s}, disponibilidad a confirmar según publicación`}
                onClick={() => onSelectSize(s)}
                className={`cl-chip h-10 max-md:flex-1 max-md:min-w-[54px] max-md:h-[38px] rounded-full border cursor-pointer font-mono-cl text-[13px] font-semibold transition-all duration-250 ${
                  checked
                    ? 'bg-[#A8D6F0] border-[#A8D6F0] text-[#0A1B33] font-bold'
                    : 'border-[#F5EAD6]/35 bg-[#0A1B33]/40 hover:border-[#F5EAD6] hover:-translate-y-[1px]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="cl-pick-note mt-2.5 max-md:mt-2 text-[12.5px] max-md:text-[12px] opacity-92">
          <b className="font-mono-cl text-[#A8D6F0]">
            {selectedSize ? `Talle ${selectedSize}` : 'Elegí un talle'}
          </b>{' '}
          <span>
            {selectedSize
              ? '— disponibilidad a confirmar por publicación'
              : 'y el anillo lo trae al frente (S a XL según modelo)'}
          </span>
        </p>
        <div className="mt-3 flex items-center gap-2 max-md:hidden">
          <a
            href="#pedido"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] text-[#0A1B33] no-underline text-[13px] font-bold transition-colors"
          >
            Pedir por WhatsApp <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <a
            href="#modelos"
            className="inline-flex items-center h-9 px-3.5 rounded-full border border-[#8ECBF5]/50 hover:border-[#F5EAD6] no-underline text-[12.5px] font-semibold transition-colors"
          >
            Ver modelos
          </a>
        </div>
      </fieldset>

      {/* Ficha de la camiseta */}
      <aside
        aria-label="Ficha de la camiseta"
        className="cl-droptag glass-panel absolute right-[var(--pad)] bottom-[var(--pad)] w-[290px] px-[18px] py-4 max-md:left-3 max-md:right-3 max-md:bottom-[146px] max-md:w-auto max-md:px-3.5 max-md:py-[9px] max-md:rounded-[14px] max-md:flex max-md:gap-2.5 max-md:items-center max-md:justify-between"
      >
        <p className="cl-dt-n font-mono-cl text-[13px] font-bold tracking-[0.06em] text-[#A8D6F0]">
          MODELO DESTACADO
        </p>
        <p className="font-disp font-bold text-[18px] max-md:text-[13px] mt-1 mb-2.5 max-md:m-0 leading-tight">
          {MODELO_NAMES[selectedModelo]}
        </p>
        <dl className="max-md:hidden">
          <div className="cl-dt-row flex justify-between gap-3 py-[6px] border-t border-[#8ECBF5]/35 text-[12.5px]">
            <dt className="opacity-70">Versiones</dt>
            <dd className="font-semibold text-right">Jugador / Fan</dd>
          </div>
          <div className="cl-dt-row flex justify-between gap-3 py-[6px] border-t border-[#8ECBF5]/35 text-[12.5px]">
            <dt className="opacity-70">Talles</dt>
            <dd className="font-semibold text-right">S · M · L · XL (según mod.)</dd>
          </div>
          <div className="cl-dt-row flex justify-between gap-3 py-[6px] border-t border-[#8ECBF5]/35 text-[12.5px]">
            <dt className="opacity-70">Precio</dt>
            <dd className="font-semibold text-[#A8D6F0] text-right">A confirmar por WhatsApp</dd>
          </div>
          <div className="cl-dt-row flex justify-between gap-3 py-[6px] border-t border-[#8ECBF5]/35 text-[12.5px]">
            <dt className="opacity-70">Estado</dt>
            <dd className="font-semibold text-right">Disponible / Vendida</dd>
          </div>
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
