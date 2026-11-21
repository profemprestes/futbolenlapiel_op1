'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ROUTES = [
  { href: '/', label: 'Original' },
  { href: '/opcion-1', label: '01 Editorial' },
  { href: '/opcion-2', label: '02 Catálogo' },
  { href: '/opcion-3', label: '03 Archivo' },
  { href: '/opcion-4', label: '04 Configurador' },
  { href: '/opcion-5', label: '05 Bento' },
];

export default function OpcionesSwitcher() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Evaluador de diseños de landing"
      className="sticky top-0 z-50 bg-[#000000]/92 backdrop-blur-md border-b border-[#8ECBF5]/25 px-4 py-2.5"
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 flex-wrap">
        <span className="font-mono-cl text-[11px] font-bold uppercase tracking-[0.08em] text-[#A8D6F0]">
          Evaluación de diseño · Fútbol en la Piel
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5">
          {ROUTES.map((r) => {
            const active = pathname === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap no-underline transition-colors ${
                  active
                    ? 'bg-[#A8D6F0] text-[#0A1B33]'
                    : 'bg-[#0A1B33] text-[#F5EAD6]/85 border border-[#F5EAD6]/15 hover:border-[#A8D6F0]/60'
                }`}
              >
                {r.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
