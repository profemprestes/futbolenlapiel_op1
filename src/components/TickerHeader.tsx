'use client';

import type { CountdownState } from '@/lib/futbolenlapiel-data';
import SiteNavbar from './SiteNavbar';

interface TickerHeaderProps {
  countdown: CountdownState;
  activeChapter: '#inicio' | '#camiseta' | '#modelos' | '#pedido';
  solid: boolean;
  tickerRef: React.RefObject<HTMLElement | null>;
}

export default function TickerHeader({ solid, tickerRef }: TickerHeaderProps) {
  return <SiteNavbar solid={solid} tickerRef={tickerRef} isHome />;
}
