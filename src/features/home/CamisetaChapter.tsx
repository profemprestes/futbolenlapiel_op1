'use client';

import { motion } from 'motion/react';
import { CAMISETA_CHAPTER_ROWS } from '@/lib/data/modelos';

interface CamisetaChapterProps {
  reducedMotion: boolean;
  sectionRef: React.RefObject<HTMLElement | null>;
  kwRefs: React.MutableRefObject<Array<HTMLElement | null>>;
}

export default function CamisetaChapter({
  reducedMotion,
  sectionRef,
  kwRefs,
}: CamisetaChapterProps) {
  return (
    <section
      ref={sectionRef}
      id="camiseta"
      aria-label="Catálogo y versiones"
      className="pt-[10vh] max-md:pt-4 px-[var(--pad)] pb-[4vh]"
    >
      {CAMISETA_CHAPTER_ROWS.map((row, idx) => (
        <div
          key={row.id}
          className={`cl-kw-row min-h-[54vh] max-md:min-h-[46svh] max-md:py-6 flex items-center gap-[3vw] max-md:gap-4 max-md:flex-col max-md:justify-end ${
            row.reverse
              ? 'flex-row-reverse text-right max-md:items-end max-md:text-right'
              : 'max-md:items-start max-md:text-left'
          }`}
        >
          {row.isHeading ? (
            <h2
              ref={(el) => {
                kwRefs.current[idx] = el;
              }}
              className="font-disp font-semibold text-[clamp(56px,13.5vw,240px)] max-md:text-[15vw] leading-[0.9] tracking-[-0.03em] [text-shadow:0_10px_50px_rgba(0,0,0,0.35)]"
            >
              {row.word}
            </h2>
          ) : (
            <p
              ref={(el) => {
                kwRefs.current[idx] = el;
              }}
              className={`font-disp font-semibold text-[clamp(48px,11.5vw,210px)] max-md:text-[13.5vw] leading-[0.9] tracking-[-0.03em] [text-shadow:0_10px_50px_rgba(0,0,0,0.35)] ${
                row.isNum ? 'text-[#A8D6F0]' : ''
              }`}
            >
              {row.word}
            </p>
          )}

          <motion.div
            initial={reducedMotion ? false : { opacity: 0.25, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`max-w-[340px] max-md:max-w-[360px] text-[16px] max-md:text-[15px] leading-[1.52] px-5 py-4 bg-[#0A1B33]/90 shadow-[0_14px_36px_-20px_rgba(0,0,0,0.65)] backdrop-blur-[14px] ${
              row.reverse
                ? 'border-r-[3px] border-[#A8D6F0] rounded-l-[14px]'
                : 'border-l-[3px] border-[#A8D6F0] rounded-r-[14px]'
            }`}
          >
            <span className="block font-mono-cl text-[11px] font-bold tracking-[0.1em] text-[#A8D6F0] mb-1">
              0{idx + 1} / 0{CAMISETA_CHAPTER_ROWS.length}
            </span>
            <p className="text-[#F5EAD6]">{row.caption}</p>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
