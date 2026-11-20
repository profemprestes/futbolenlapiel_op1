'use client';

import SiteNavbar from '../SiteNavbar';

interface TickerHeaderProps {
  activeChapter: '#inicio' | '#camiseta' | '#modelos' | '#pedido';
  solid: boolean;
  tickerRef: React.RefObject<HTMLElement | null>;
}

export default function TickerHeader({ solid, tickerRef }: TickerHeaderProps) {
  return <SiteNavbar solid={solid} tickerRef={tickerRef} isHome />;
}
