'use client';

import { MotionConfig } from 'motion/react';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { type CatalogCategory, type ModeloId, MODELO_NAMES } from '@/lib/futbolenlapiel-data';
import CamisetaChapter from './home/CamisetaChapter';
import CamisetaStage, { type StageController } from './home/CamisetaStage';
import HeroSection from './home/HeroSection';
import ModelosChapter from './home/ModelosChapter';
import PedidoChapter from './home/PedidoChapter';
import TickerHeader from './home/TickerHeader';
import WordmarkFooter from './home/WordmarkFooter';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const docTop = (el: HTMLElement | null) => {
  let t = 0;
  let cur: HTMLElement | null = el;
  while (cur) {
    t += cur.offsetTop;
    cur = cur.offsetParent as HTMLElement | null;
  }
  return t;
};

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

export default function FutbolEnLaPielExperience() {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedModelo, setSelectedModelo] = useState<ModeloId>('uruguay');
  const [announcedModelo, setAnnouncedModelo] = useState<ModeloId | null>(null);
  const [camiseta, setCamiseta] = useState(MODELO_NAMES['uruguay']);
  const [camisetaPlaceholder, setCamisetaPlaceholder] = useState('Ej: Uruguay 2026 Mundial');
  const [pedidoResetNonce, setPedidoResetNonce] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [isDragging, setIsDragging] = useState(false);
  const [sliderDeg, setSliderDeg] = useState(0);
  const [sliderText, setSliderText] = useState('Frente');
  const [activeChapter, setActiveChapter] = useState<
    '#inicio' | '#camiseta' | '#modelos' | '#pedido'
  >('#inicio');
  const [tickerSolid, setTickerSolid] = useState(false);

  const stageRef = useRef<StageController | null>(null);
  const tickerRef = useRef<HTMLElement | null>(null);
  const c1Ref = useRef<HTMLElement | null>(null);
  const c2Ref = useRef<HTMLElement | null>(null);
  const c3Ref = useRef<HTMLElement | null>(null);
  const footRef = useRef<HTMLElement | null>(null);

  const kwRefs = useRef<Array<HTMLElement | null>>([]);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLHeadingElement | null>(null);
  const headSpanRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const cardsBoxRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const swRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    interface Metrics {
      maxScroll: number;
      c1Top: number;
      c1End: number;
      c2: number;
      kws: number[];
      cardsTop: number;
      cards: number[];
      c3: number;
      sws: number[];
    }

    let M: Metrics | null = null;
    const kwLast: number[] = [];

    const measure = () => {
      if (!c1Ref.current || !c2Ref.current || !c3Ref.current || !cardsBoxRef.current) return;
      M = {
        maxScroll: Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
        c1Top: docTop(c1Ref.current),
        c1End: docTop(c1Ref.current) + c1Ref.current.offsetHeight,
        c2: docTop(c2Ref.current),
        kws: kwRefs.current.map((k) => (k ? docTop(k) + k.offsetHeight / 2 : 0)),
        cardsTop: docTop(cardsBoxRef.current),
        cards: cardRefs.current.map((c) => (c ? docTop(c) : 0)),
        c3: docTop(c3Ref.current),
        sws: swRefs.current.map((x) => (x ? docTop(x) : 0)),
      };
    };

    const onScroll = () => {
      if (!M) measure();
      if (!M) return;

      const vh = window.innerHeight;
      const y = window.scrollY;

      tickerRef.current?.style.setProperty('--scroll-p', clamp(y / M.maxScroll).toFixed(4));

      const nextChapter: '#inicio' | '#camiseta' | '#modelos' | '#pedido' =
        y >= M.c3 - vh * 0.45
          ? '#pedido'
          : y >= M.c2 - vh * 0.45
            ? '#modelos'
            : y >= M.c1Top - vh * 0.45
              ? '#camiseta'
              : '#inicio';
      setActiveChapter((prev) => (prev === nextChapter ? prev : nextChapter));

      const nextSolid = y > M.c2 - vh * 0.4;
      setTickerSolid((prev) => (prev === nextSolid ? prev : nextSolid));

      const p1 = clamp(y / Math.max(1, M.c1End - vh));
      const m = reducedMotion ? 0 : p1;
      const prTop = M.c2 - y;
      const pw = reducedMotion ? (prTop <= vh * 0.2 ? 1 : 0) : clamp(-prTop / (vh * 0.5) + 0.25);
      const off = pw >= 1 && prTop < 0;

      const isPhone = window.innerWidth <= 760;
      stageRef.current?.setScrollState({
        extraScale: 1 + (isPhone ? 0.16 : 0.35) * m,
        extraYaw: 16 * m,
        ringFade: 1 - clamp(p1 / 0.32),
        ringGrow: 1 + (reducedMotion ? 0 : (isPhone ? 0.55 : 0.9) * clamp(p1 / 0.32)),
        active: !off,
        lightX: `${64 - 30 * m}%`,
      });

      // Peso tipográfico 600..900 en #camiseta
      kwRefs.current.forEach((k, i) => {
        if (!k || !M) return;
        const d = clamp(Math.abs(M.kws[i] - y - vh / 2) / (vh * 0.55));
        const w = reducedMotion ? 900 : Math.round((900 - 300 * d) / 100) * 100;
        if (kwLast[i] === w) return;
        kwLast[i] = w;
        k.style.fontWeight = String(w);
        k.style.letterSpacing = reducedMotion
          ? '-0.03em'
          : `${(-0.03 + (0.04 * (900 - w)) / 300).toFixed(3)}em`;
      });

      if (pinRef.current) {
        pinRef.current.style.setProperty('--wipe', `${(1 - pw) * 100}%`);
        pinRef.current.style.setProperty('--edge', pw > 0 && pw < 1 ? '1' : '0');
        pinRef.current.style.setProperty('--subo', String(clamp(pw * 1.5 - 0.5)));
      }
      headSpanRefs.current.forEach((h, i) => {
        if (!h) return;
        h.style.setProperty(
          '--hx',
          reducedMotion ? '0' : `${-(1 - clamp(pw * 1.25 - i * 0.12)) * 75}vw`
        );
      });

      const ca = clamp((vh * 0.95 - (M.cardsTop - y)) / (vh * 0.45));
      if (headRef.current) {
        headRef.current.style.opacity = reducedMotion
          ? ca > 0.5
            ? '0'
            : '1'
          : (1 - ca).toFixed(3);
        headRef.current.style.transform = reducedMotion
          ? ''
          : `translateY(${(-ca * 14).toFixed(2)}vh)`;
      }
      if (subRef.current) {
        subRef.current.style.visibility = ca > 0.98 ? 'hidden' : '';
      }

      cardRefs.current.forEach((c, i) => {
        if (!c || !M) return;
        const q = reducedMotion
          ? 1
          : clamp((vh - (M.cards[i] - y)) / (vh * 0.55) - i * 0.08);
        c.style.setProperty('--ry', `${((1 - q) * 160).toFixed(1)}px`);
        c.style.setProperty('--rx', `${((1 - q) * 18).toFixed(2)}deg`);
      });

      if (c3Ref.current) {
        const r3 = M.c3 - y;
        const back = reducedMotion
          ? r3 < vh * 0.5
            ? 100
            : 0
          : clamp((vh - r3) / (vh * 0.7)) * 100;
        c3Ref.current.style.setProperty('--back', `${back}%`);
        c3Ref.current.style.setProperty('--cedge', back > 0 && back < 100 ? '1' : '0');
      }
      swRefs.current.forEach((s, i) => {
        if (!s || !M) return;
        const t = (M.sws[i] - y) / vh - 0.5;
        s.style.setProperty(
          '--sx',
          reducedMotion ? '0' : `${((i % 2 ? -1 : 1) * t * 34).toFixed(2)}vw`
        );
      });
    };

    let ticking = false;
    const kick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
      }
    };

    const invalidateAndKick = () => {
      M = null;
      kick();
    };

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', invalidateAndKick);

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(invalidateAndKick);
      ro.observe(document.body);
    }

    if (document.fonts) {
      void document.fonts.ready.then(invalidateAndKick);
    }

    kick();

    return () => {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', invalidateAndKick);
      ro?.disconnect();
    };
  }, [reducedMotion]);

  const handleSelectSize = useCallback((size: string) => {
    setSelectedSize(size);
    stageRef.current?.markSize(size);
  }, []);

  const handleSelectModelo = useCallback((modelo: ModeloId, announce = false) => {
    setSelectedModelo(modelo);
    setCamiseta(MODELO_NAMES[modelo]);
    setCamisetaPlaceholder('Ej: Uruguay 2026 Mundial');
    setPedidoResetNonce((n) => n + 1);
    stageRef.current?.setModelo(modelo);
    if (announce) {
      setAnnouncedModelo(modelo);
    }
  }, []);

  const handleSelectCategory = useCallback(
    (category: CatalogCategory) => {
      setCamiseta(category.defaultQuery);
      setCamisetaPlaceholder(category.defaultPlaceholder ?? 'Ej: Uruguay 2026 Mundial');
      setPedidoResetNonce((n) => n + 1);
      requestAnimationFrame(() => {
        const formEl = document.getElementById('pedido-form');
        formEl?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        const focusTargetId =
          category.defaultQuery === '' ? 'pedido-camiseta-input' : 'pedido-name-input';
        document.getElementById(focusTargetId)?.focus({ preventScroll: true });
      });
    },
    [reducedMotion]
  );

  const handleAriaUpdate = useCallback((deg: number, valueText: string) => {
    setSliderDeg(deg);
    setSliderText(valueText);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <TickerHeader
        activeChapter={activeChapter}
        solid={tickerSolid}
        tickerRef={tickerRef}
      />

      <CamisetaStage
        modelo={selectedModelo}
        reducedMotion={reducedMotion}
        onDraggingChange={setIsDragging}
        onAriaUpdate={handleAriaUpdate}
        controllerRef={stageRef}
      />

      <main className="relative z-[2] overflow-x-clip">
        <HeroSection
          isDragging={isDragging}
          sliderDeg={sliderDeg}
          sliderText={sliderText}
          onPointerDown={(e) => stageRef.current?.handlePointerDown(e)}
          onPointerMove={(e) => stageRef.current?.handlePointerMove(e)}
          onPointerEnd={() => stageRef.current?.handlePointerEnd()}
          onKeyDown={(e) => stageRef.current?.handleKeyDown(e)}
        />

        <CamisetaChapter sectionRef={c1Ref} kwRefs={kwRefs} />

        <ModelosChapter
          selectedModelo={selectedModelo}
          announcedModelo={announcedModelo}
          reducedMotion={reducedMotion}
          onSelectModelo={(m) => handleSelectModelo(m, true)}
          onSelectCategory={handleSelectCategory}
          sectionRef={c2Ref}
          pinRef={pinRef}
          headRef={headRef}
          headSpanRefs={headSpanRefs}
          subRef={subRef}
          cardsBoxRef={cardsBoxRef}
          cardRefs={cardRefs}
        />

        <PedidoChapter
          selectedSize={selectedSize}
          selectedModelo={selectedModelo}
          camiseta={camiseta}
          camisetaPlaceholder={camisetaPlaceholder}
          resetNonce={pedidoResetNonce}
          reducedMotion={reducedMotion}
          onChangeCamiseta={setCamiseta}
          onSelectSize={handleSelectSize}
          sectionRef={c3Ref}
          swRefs={swRefs}
        />
      </main>

      <WordmarkFooter paused={false} reducedMotion={reducedMotion} footRef={footRef} />
    </MotionConfig>
  );
}
