'use client';

import type { CountdownState } from '@/lib/futbolenlapiel-data';
import SiteNavbar from './SiteNavbar';

interface TickerHeaderProps {
  countdown: CountdownState;
  activeChapter: '#inicio' | '#camiseta' | '#modelos' | '#pedido';
  solid: boolean;
  paused: boolean;
  onTogglePause: () => void;
  tickerRef: React.RefObject<HTMLElement | null>;
}

export default function TickerHeader({
  solid,
  paused,
  onTogglePause,
  tickerRef,
}: TickerHeaderProps) {
  return (
    <SiteNavbar
      solid={solid}
      paused={paused}
      onTogglePause={onTogglePause}
      tickerRef={tickerRef}
      isHome
    />
  );
}
