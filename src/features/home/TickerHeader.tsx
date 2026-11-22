'use client';

import SiteNavbar from '@/components/layout/SiteNavbar';

interface TickerHeaderProps {
  solid: boolean;
  tickerRef: React.RefObject<HTMLElement | null>;
}

export default function TickerHeader({ solid, tickerRef }: TickerHeaderProps) {
  return <SiteNavbar solid={solid} tickerRef={tickerRef} isHome />;
}
