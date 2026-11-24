'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
  BRAND_LOGOS,
  COMMERCIAL_INFO,
  INSTAGRAM_HANDLE,
  WHATSAPP_DISPLAY,
} from '@/lib/config/brand';
import { HOME_CONTENT } from '@/lib/content/home';
import { createWhatsAppUrl } from '@/lib/whatsapp';

interface WordmarkFooterProps {
  paused: boolean;
  reducedMotion: boolean;
  footRef: React.RefObject<HTMLElement | null>;
}

const WORDMARK = 'FUTBOL EN LA PIEL'.split('');

export default function WordmarkFooter({
  paused,
  reducedMotion,
  footRef,
}: WordmarkFooterProps) {
  const wmRef = useRef<HTMLParagraphElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const centersRef = useRef<number[]>([]);
  const lastWRef = useRef<number[]>([]);
  const wmXRef = useRef<number | null>(null);
  const footInRef = useRef(false);
  const wavingRef = useRef(false);
  const touchRef = useRef(false);

  useEffect(() => {
    touchRef.current = window.matchMedia('(hover: none)').matches;
    const wm = wmRef.current;
    if (!wm) return;

    const measureLetters = () => {
      centersRef.current = letterRefs.current.map((s) => {
        if (!s) return 0;
        const r = s.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    };

    const setW = (i: number, w: number) => {
      const cap = i === WORDMARK.length - 1 ? 800 : 900;
      const rounded = Math.min(cap, Math.round(w / 100) * 100);
      if (lastWRef.current[i] !== rounded) {
        const el = letterRefs.current[i];
        if (el) el.style.setProperty('--w', String(rounded));
        lastWRef.current[i] = rounded;
      }
    };

    const still = () => {
      WORDMARK.forEach((_, i) => {
        setW(i, 300 + 600 * Math.exp(-Math.pow((i - 8) / 4.2, 2)));
      });
    };

    const weights = (now: number) => {
      if (!centersRef.current.length) measureLetters();
      const vw = window.innerWidth;
      const x = wmXRef.current ?? vw / 2 + Math.sin(now / 1400) * vw * 0.42;
      WORDMARK.forEach((_, i) => {
        setW(
          i,
          250 + 650 * Math.exp(-Math.pow((centersRef.current[i] - x) / (vw * 0.12), 2))
        );
      });
    };

    const wave = (now: number) => {
      if (footInRef.current && !reducedMotion && !touchRef.current && !paused) {
        weights(now);
        requestAnimationFrame(wave);
      } else {
        wavingRef.current = false;
      }
    };

    const kickWave = () => {
      if (!wavingRef.current && footInRef.current && !reducedMotion && !touchRef.current && !paused) {
        wavingRef.current = true;
        requestAnimationFrame(wave);
      }
    };

    if (reducedMotion || touchRef.current) {
      still();
    }

    if (!reducedMotion) {
      letterRefs.current.forEach((s) => s?.style.setProperty('--y', '70%'));
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        footInRef.current = entry.isIntersecting;
        if (!reducedMotion) {
          letterRefs.current.forEach((s) =>
            s?.style.setProperty('--y', entry.isIntersecting ? '0%' : '70%')
          );
        }
        if (entry.isIntersecting) {
          measureLetters();
          kickWave();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(wm);

    const parent = wm.parentElement;
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        wmXRef.current = e.clientX;
        kickWave();
      }
    };
    const onPointerLeave = () => {
      wmXRef.current = null;
    };
    const onResize = () => {
      centersRef.current = [];
    };

    parent?.addEventListener('pointermove', onPointerMove);
    parent?.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onResize);

    if (footInRef.current) {
      kickWave();
    }

    return () => {
      io.disconnect();
      parent?.removeEventListener('pointermove', onPointerMove);
      parent?.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      wavingRef.current = false;
    };
  }, [paused, reducedMotion]);

  return (
    <footer
      ref={footRef}
      id="contacto"
      className="relative z-[2] overflow-x-clip bg-[#F5EAD6] text-[#0A1B33] pt-[12vh] px-[var(--pad)] pb-7 overflow-hidden"
    >
      <p
        ref={wmRef}
        aria-label="Fútbol en la Piel"
        className="cl-wm-big font-disp text-[8.8vw] max-md:text-[8.6vw] leading-[0.9] tracking-[-0.03em] text-[#0A1B33] flex justify-center whitespace-nowrap select-none"
      >
        {WORDMARK.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            aria-hidden="true"
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </p>

      <div className="mt-[8vh] flex items-center justify-between gap-4 flex-wrap">
        <Image
          src={BRAND_LOGOS.horizontal}
          alt="Fútbol en la Piel"
          width={112}
          height={56}
          className="h-11 sm:h-12 w-auto object-contain"
        />
        <span className="font-mono-cl text-[12px] font-bold text-[#1E5AA8]">
          {HOME_CONTENT.footer.tagline}
        </span>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-7 max-md:gap-[22px] mt-5 pt-7 border-t-2 border-[#0A1B33]">
        <div>
          <p className="font-mono-cl text-[12px] font-bold text-[#1E5AA8] mb-2">INSTAGRAM</p>
          <p className="text-[15px] max-md:text-[14px] leading-[1.5]">
            {INSTAGRAM_HANDLE} — {HOME_CONTENT.footer.instagramDesc}
          </p>
        </div>
        <div>
          <p className="font-mono-cl text-[12px] font-bold text-[#1E5AA8] mb-2">WHATSAPP</p>
          <p className="text-[15px] max-md:text-[14px] leading-[1.5]">
            Atención directa:{' '}
            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-[#1E5AA8]/50 hover:text-[#1E5AA8]"
            >
              {WHATSAPP_DISPLAY}
            </a>
            . Consultá stock, talles (S–XL o todos por encargo), promociones y precios.
          </p>
        </div>
        <div>
          <p className="font-mono-cl text-[12px] font-bold text-[#1E5AA8] mb-2">
            ENVÍOS &amp; PAGOS
          </p>
          <p className="text-[15px] max-md:text-[14px] leading-[1.5]">
            {COMMERCIAL_INFO.shipping.map((s) => `${s.zone}: ${s.detail}`).join(' ')} Pagos:{' '}
            {COMMERCIAL_INFO.payments.join(', ')}.
          </p>
        </div>
        <nav aria-label="Pie de página">
          <p className="font-mono-cl text-[12px] font-bold text-[#1E5AA8] mb-2">IR A</p>
          <Link
            href="/tienda"
            className="block no-underline font-semibold py-1 transition-all duration-200 hover:text-[#1E5AA8] hover:translate-x-1"
          >
            Tienda / Stock
          </Link>
          <Link
            href="/retros"
            className="block no-underline font-semibold py-1 transition-all duration-200 hover:text-[#1E5AA8] hover:translate-x-1"
          >
            Retros
          </Link>
          <Link
            href="/talles"
            className="block no-underline font-semibold py-1 transition-all duration-200 hover:text-[#1E5AA8] hover:translate-x-1"
          >
            Talles y cambios
          </Link>
          <Link
            href="/envios"
            className="block no-underline font-semibold py-1 transition-all duration-200 hover:text-[#1E5AA8] hover:translate-x-1"
          >
            Envíos y pagos
          </Link>
          <Link
            href="/preguntas"
            className="block no-underline font-semibold py-1 transition-all duration-200 hover:text-[#1E5AA8] hover:translate-x-1"
          >
            Preguntas frecuentes
          </Link>
          <a
            href="#pedido"
            className="block no-underline font-semibold py-1 transition-all duration-200 hover:text-[#1E5AA8] hover:translate-x-1"
          >
            Pedir ahora
          </a>
        </nav>
      </div>

      <p className="mt-10 text-[13px] opacity-75">
        Fútbol en la Piel ({INSTAGRAM_HANDLE}) · Uruguay. Catálogo basado en las publicaciones de
        la cuenta oficial. Precios y disponibilidad sujetos a confirmación por WhatsApp. Nada en
        esta página cobra ni reserva stock.
      </p>
    </footer>
  );
}
