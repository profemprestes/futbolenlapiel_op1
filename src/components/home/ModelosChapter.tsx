'use client';

import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CatalogCategory, ModeloId } from '@/lib/futbolenlapiel-data';
import { CATALOG_CATEGORIES, MODELOS, MODELO_SHORT_NAMES } from '@/lib/futbolenlapiel-data';
import CamisetaImage from '../CamisetaImage';

interface ModelosChapterProps {
  selectedModelo: ModeloId;
  announcedModelo: ModeloId | null;
  reducedMotion: boolean;
  onSelectModelo: (modelo: ModeloId) => void;
  onSelectCategory?: (category: CatalogCategory) => void;
  sectionRef: React.RefObject<HTMLElement | null>;
  pinRef: React.RefObject<HTMLDivElement | null>;
  headRef: React.RefObject<HTMLHeadingElement | null>;
  headSpanRefs: React.MutableRefObject<Array<HTMLSpanElement | null>>;
  subRef: React.RefObject<HTMLParagraphElement | null>;
  cardsBoxRef: React.RefObject<HTMLDivElement | null>;
  cardRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
}

const HEAD_WORDS = ['ELEGÍ', 'TU', 'CAMISETA.'];

export default function ModelosChapter({
  selectedModelo,
  announcedModelo,
  reducedMotion,
  onSelectModelo,
  onSelectCategory,
  sectionRef,
  pinRef,
  headRef,
  headSpanRefs,
  subRef,
  cardsBoxRef,
  cardRefs,
}: ModelosChapterProps) {
  const handleCardMove = (idx: number, e: React.PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || e.pointerType !== 'mouse') return;
    const card = cardRefs.current[idx];
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--ty', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
    card.style.setProperty('--tx', `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`);
  };

  const handleCardLeave = (idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    card.style.setProperty('--tx', '0deg');
    card.style.setProperty('--ty', '0deg');
  };

  return (
    <section
      ref={sectionRef}
      id="modelos"
      aria-labelledby="modelos-h"
      className="cl-c2-bg relative text-[#0A1B33] -mt-[40vh] pb-[12vh]"
    >
      <div
        ref={pinRef}
        className="sticky top-0 h-screen h-[100svh] overflow-hidden"
      >
        <div className="cl-wipe absolute inset-0" />
        <h2
          ref={headRef}
          id="modelos-h"
          className="absolute left-[var(--pad)] top-[max(13vh,84px)] max-md:top-[max(12vh,72px)] font-disp font-black text-[clamp(48px,min(11.8vw,22vh),220px)] max-md:text-[min(16.5vw,22vh)] leading-[0.88] tracking-[-0.03em] text-[#0A1B33]"
        >
          {HEAD_WORDS.map((word, idx) => (
            <span
              key={word}
              ref={(el) => {
                headSpanRefs.current[idx] = el;
              }}
              className={`block [transform:translateX(var(--hx,0))] ${idx === 1 ? 'pl-[9vw]' : ''
                } ${idx === 2 ? 'text-[#1E5AA8]' : ''}`}
            >
              {word}
            </span>
          ))}
        </h2>

        <p
          ref={subRef}
          className="absolute right-[var(--pad)] top-[max(15vh,88px)] max-md:left-[var(--pad)] max-md:right-auto max-md:top-[calc(12vh+48vw)] max-w-[260px] text-[16px] font-medium leading-[1.45] text-[#0A1B33] [opacity:var(--subo,0)]"
        >
          Mismo escudo, misma pasión, tres formas de llevarla. Disponibilidad según publicación.
        </p>
      </div>

      <div
        ref={cardsBoxRef}
        role="radiogroup"
        aria-label="Modelos destacados de ejemplo"
        className="relative z-[2] mt-[55vh] max-md:mt-[50vh] px-[var(--pad)] grid grid-cols-3 max-md:grid-cols-1 gap-[clamp(14px,2vw,28px)] max-md:gap-[18px] max-w-[1320px] mx-auto [perspective:1200px]"
      >
        {MODELOS.map((m, idx) => {
          const isOn = selectedModelo === m.id;
          return (
            <button
              key={m.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isOn}
              onClick={() => onSelectModelo(m.id)}
              onPointerMove={(e) => handleCardMove(idx, e)}
              onPointerLeave={() => handleCardLeave(idx)}
              className={`cl-card-3d group relative text-left border border-[#F5EAD6]/22 cursor-pointer rounded-[26px] p-[22px] pb-5 text-[#F5EAD6] flex flex-col gap-1.5 transition-[box-shadow,outline-color,border-color] duration-400 outline-[3px] outline-offset-4 ${isOn ? 'outline-[#A8D6F0]' : 'outline-transparent'
                }`}
            >
              <span className="font-mono-cl text-[12px] opacity-80">{m.num}</span>
              <span className="w-full aspect-[4/3] grid place-items-center [transform:translateZ(40px)]">
                <CamisetaImage
                  modelo={m.id}
                  alt={m.alt}
                  className="w-[105%] max-md:w-full h-auto -rotate-2 group-hover:-translate-y-2 transition-transform duration-500 ease-[var(--ease)] drop-shadow-[0_22px_18px_rgba(0,0,0,0.5)]"
                />
              </span>
              <span className="font-disp font-bold text-[clamp(21px,2vw,28px)] leading-[1.08] tracking-[-0.015em] flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: m.dotColor }}
                  className="inline-block w-2.5 h-2.5 mt-2 rounded-full border-[1.5px] border-[#F5EAD6]/70 flex-none"
                />
                <span>{m.name}</span>
              </span>
              <span className="text-[14px] opacity-85 min-h-[2.9em]">{m.desc}</span>
              <span className="flex justify-between items-baseline gap-2 pt-2.5 border-t border-[#8ECBF5]/40 mt-1.5">
                <b className="text-[14px] text-[#A8D6F0]">{m.priceLabel}</b>
                <i className="not-italic font-mono-cl text-[11px] opacity-80 text-right">
                  {m.availabilityLabel}
                </i>
              </span>
              <span
                className={`mt-2.5 self-start inline-flex items-center gap-2 text-[13px] font-bold px-3.5 py-2 rounded-full border transition-colors duration-250 ${isOn
                    ? 'bg-[#A8D6F0] border-[#A8D6F0] text-[#0A1B33]'
                    : 'border-[#8ECBF5]/55 text-[#F5EAD6]'
                  }`}
              >
                {isOn && (
                  <span
                    aria-hidden="true"
                    className="w-[7px] h-[7px] rounded-full bg-[#0A1B33] shadow-[0_0_0_3px_rgba(10,27,51,0.25)]"
                  />
                )}
                {isOn ? 'En el escenario' : 'Ver en el escenario'}
              </span>
            </button>
          );
        })}
      </div>

      <p
        role="status"
        aria-live="polite"
        className="relative z-[2] text-center mt-7 mx-auto min-h-[1.4em] font-semibold text-[#0A1B33] flex justify-center items-center gap-2.5 flex-wrap px-4"
      >
        <AnimatePresence mode="wait">
          {announcedModelo && (
            <motion.span
              key={announcedModelo}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2.5 flex-wrap justify-center"
            >
              <span>
                {MODELO_SHORT_NAMES[announcedModelo]} está en el escenario ahora.
              </span>
              <a
                href="#inicio"
                className="inline-flex items-center gap-1 text-[#F5EAD6] bg-[#1E5AA8] hover:bg-[#0A1B33] hover:-translate-y-[1px] no-underline px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all duration-250"
              >
                Verla girar <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </motion.span>
          )}
        </AnimatePresence>
      </p>

      <div className="relative z-[2] max-w-[1160px] mx-auto mt-10 px-[var(--pad)]">
        <p className="font-mono-cl text-[12px] font-bold tracking-[0.08em] uppercase text-[#1E5AA8] mb-3.5 text-center">
          Categorías del catálogo (@futbolenlapieluy1)
        </p>
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-3.5">
          {CATALOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat)}
              className="text-left p-4 rounded-[18px] bg-[#0A1B33] text-[#F5EAD6] border border-[#0A1B33]/15 hover:-translate-y-1 hover:border-[#1E5AA8] transition-all duration-250 cursor-pointer flex flex-col justify-between gap-2.5 shadow-[0_14px_34px_-22px_rgba(10,27,51,0.5)]"
            >
              <span className="block">
                <span className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-disp font-extrabold text-[19px] tracking-[-0.02em] text-[#A8D6F0]">
                    {cat.title}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8ECBF5] shrink-0" aria-hidden="true" />
                </span>
                <span className="block text-[12px] font-semibold text-[#F5EAD6]/90 mb-1.5">
                  {cat.subtitle}
                </span>
                <span className="block text-[12px] text-[#F5EAD6]/70 leading-[1.45]">
                  {cat.examples}
                </span>
              </span>
              <span className="block font-mono-cl text-[11px] font-bold text-[#8ECBF5] pt-2 border-t border-[#8ECBF5]/20">
                Consultar categoría →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
