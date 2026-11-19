'use client';

import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import type { CountdownState } from '@/lib/futbolenlapiel-data';
import { BRAND_LOGOS, INSTAGRAM_HANDLE } from '@/lib/futbolenlapiel-data';

interface TickerHeaderProps {
  countdown: CountdownState;
  activeChapter: '#inicio' | '#camiseta' | '#modelos' | '#pedido';
  solid: boolean;
  paused: boolean;
  onTogglePause: () => void;
  tickerRef: React.RefObject<HTMLElement | null>;
}

const CHAPTER_LINKS: Array<{ href: '#camiseta' | '#modelos' | '#pedido'; label: string }> = [
  { href: '#camiseta', label: 'Camiseta' },
  { href: '#modelos', label: 'Modelos' },
  { href: '#pedido', label: 'Pedir' },
];

export default function TickerHeader({
  countdown,
  activeChapter,
  solid,
  paused,
  onTogglePause,
  tickerRef,
}: TickerHeaderProps) {
  return (
    <header
      ref={tickerRef}
      aria-label="Barra de navegación Fútbol en la Piel"
      className={`ticker-bar fixed z-30 top-3 max-md:top-2 left-1/2 -translate-x-1/2 w-[min(1180px,calc(100%-24px))] h-12 max-md:h-11 pl-[18px] max-md:pl-3.5 pr-1.5 max-md:pr-1 flex items-center gap-3.5 max-md:gap-2 border border-[#F5EAD6]/24 rounded-full shadow-[0_1px_0_rgba(245,234,214,0.14)_inset,0_12px_40px_-20px_rgba(0,0,0,0.75)] backdrop-blur-[18px] backdrop-saturate-[1.45] text-[13px] overflow-hidden transition-[background,border-color] duration-350 ${
        solid ? 'bg-[#000000]/90' : 'bg-[#0A1B33]/82'
      }`}
    >
      <a
        href="#inicio"
        aria-label="Fútbol en la Piel, volver arriba"
        className="flex items-center gap-2 no-underline whitespace-nowrap shrink-0"
      >
        <Image
          src={BRAND_LOGOS.emblem}
          alt=""
          width={28}
          height={28}
          priority
          className="w-7 h-7 max-md:w-6 max-md:h-6 rounded-full border border-[#F5EAD6]/25 bg-black object-cover shrink-0"
        />
        <span className="font-archivo text-[14px] max-md:text-[12px] tracking-[0.02em] text-[#F5EAD6]">
          FUTBOL EN LA PIEL
        </span>
      </a>

      <span className="opacity-90 whitespace-nowrap max-lg:hidden">
        <b className="font-mono-cl font-bold mr-1.5">{INSTAGRAM_HANDLE}</b>
        Uruguay{' '}
        <i className="not-italic text-[#0A1B33] bg-[#F5EAD6] rounded-full px-2 py-0.5 ml-1.5 font-semibold text-[11px]">
          Actuales &amp; Retros
        </i>
      </span>

      <nav
        aria-label="Capítulos"
        className="hidden lg:inline-flex items-center gap-1 ml-1 p-[3px] rounded-full bg-[#000000]/30 border border-[#F5EAD6]/14"
      >
        {CHAPTER_LINKS.map((item) => {
          const isActive = activeChapter === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`no-underline text-[12px] font-semibold px-2.5 py-1 rounded-full transition-all duration-250 ${
                isActive
                  ? 'bg-[#F5EAD6]/18 opacity-100'
                  : 'opacity-76 hover:opacity-100'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <span
        aria-label="Estado de cierre de despachos"
        className="ml-auto flex items-center gap-2 max-md:gap-0"
      >
        <span className="opacity-75 max-md:hidden text-[12px]">Cierre a confirmar</span>
        <span className="font-mono-cl font-bold text-[13px] max-md:text-[11px] inline-flex items-baseline overflow-hidden max-md:overflow-visible leading-[1.25] max-md:leading-[1.4] max-md:py-0.5">
          <span className="inline-block min-w-[2ch] text-right">{countdown.d}</span>
          <em className="not-italic opacity-60 font-normal ml-[1px] mr-1.5 max-md:ml-0 max-md:mr-[2px]">
            d
          </em>
          <span className="inline-block min-w-[2ch] text-right">{countdown.h}</span>
          <em className="not-italic opacity-60 font-normal ml-[1px] mr-1.5 max-md:ml-0 max-md:mr-[2px]">
            h
          </em>
          <span className="inline-block min-w-[2ch] text-right">{countdown.m}</span>
          <em className="not-italic opacity-60 font-normal ml-[1px] mr-1.5 max-md:ml-0 max-md:mr-[2px]">
            m
          </em>
          <span className="inline-block min-w-[2ch] text-right text-[#A8D6F0]">
            {countdown.s}
          </span>
          <em className="not-italic opacity-60 font-normal ml-[1px] mr-1.5 max-md:ml-0 max-md:mr-[2px]">
            s
          </em>
        </span>
      </span>

      <button
        type="button"
        onClick={onTogglePause}
        aria-pressed={paused}
        aria-label={paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
        className="inline-flex items-center justify-center gap-1.5 h-[34px] max-md:h-8 max-md:w-8 px-3 max-md:px-0 rounded-full border border-[#8ECBF5]/55 bg-transparent cursor-pointer text-[12px] flex-none hover:border-[#F5EAD6]/80 transition-colors"
      >
        {paused ? (
          <Play className="w-3 h-3 fill-current" aria-hidden="true" />
        ) : (
          <Pause className="w-3 h-3 fill-current" aria-hidden="true" />
        )}
        <span className="max-md:hidden">{paused ? 'Reanudar' : 'Pausar'}</span>
      </button>

      <a
        href="#pedido"
        className="h-9 max-md:h-8 inline-flex items-center px-4 max-md:px-3 rounded-full bg-[#A8D6F0] hover:bg-[#8ECBF5] hover:-translate-y-[1px] text-[#0A1B33] no-underline font-bold whitespace-nowrap max-md:text-[12px] transition-all duration-300"
      >
        Pedir<span className="whitespace-pre max-md:hidden"> por WhatsApp</span>
      </a>
    </header>
  );
}
