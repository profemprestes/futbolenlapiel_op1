'use client';

interface CamisetaChapterProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  kwRefs: React.MutableRefObject<Array<HTMLElement | null>>;
}

const ROWS = [
  {
    id: 'r1',
    word: 'UNA',
    isHeading: true,
    isNum: false,
    reverse: false,
    caption:
      'Camisetas actuales y retros, de selecciones y clubes. Sin inventar historia: cada modelo se confirma por su publicación.',
  },
  {
    id: 'r2',
    word: 'CAMISETA.',
    isHeading: false,
    isNum: false,
    reverse: true,
    caption:
      'Versión Jugador o Versión Fan según publicación. Talle a confirmar por modelo.',
  },
  {
    id: 'r3',
    word: '50',
    isHeading: false,
    isNum: true,
    reverse: false,
    caption:
      '50 publicaciones en la cuenta @futbolenlapieluy1. No es cantidad de modelos distintos verificados: el catálogo real se confirma modelo por modelo.',
  },
  {
    id: 'r4',
    word: 'PUBLICACIONES.',
    isHeading: false,
    isNum: false,
    reverse: true,
    caption:
      'Elegí un talle arriba y el anillo lo trae al frente. La disponibilidad real se confirma por WhatsApp.',
  },
];

export default function CamisetaChapter({ sectionRef, kwRefs }: CamisetaChapterProps) {
  return (
    <section
      ref={sectionRef}
      id="camiseta"
      aria-label="La camiseta"
      className="pt-[10vh] max-md:pt-0 px-[var(--pad)] pb-[4vh]"
    >
      {ROWS.map((row, idx) => (
        <div
          key={row.id}
          className={`cl-kw-row min-h-[62vh] max-md:min-h-[70vh] flex items-center gap-[3vw] max-md:gap-[18px] max-md:flex-col max-md:justify-center ${
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
              className="font-disp font-semibold text-[clamp(56px,13.5vw,240px)] max-md:text-[17vw] leading-[0.9] tracking-[-0.03em] [text-shadow:0_10px_50px_rgba(0,0,0,0.35)]"
            >
              {row.word}
            </h2>
          ) : (
            <p
              ref={(el) => {
                kwRefs.current[idx] = el;
              }}
              className={`font-disp font-semibold text-[clamp(48px,11.5vw,210px)] max-md:text-[14vw] leading-[0.9] tracking-[-0.03em] [text-shadow:0_10px_50px_rgba(0,0,0,0.35)] ${
                row.isNum ? 'text-[#A8D6F0]' : ''
              }`}
            >
              {row.word}
            </p>
          )}

          <p
            className={`max-w-[300px] text-[16px] max-md:text-[15px] leading-[1.52] px-[18px] py-4 bg-[#0A1B33]/72 shadow-[0_14px_36px_-20px_rgba(0,0,0,0.65)] backdrop-blur-[14px] ${
              row.reverse
                ? 'border-r-[3px] border-[#A8D6F0] rounded-l-[14px]'
                : 'border-l-[3px] border-[#A8D6F0] rounded-r-[14px]'
            }`}
          >
            {row.caption}
          </p>
        </div>
      ))}
    </section>
  );
}
