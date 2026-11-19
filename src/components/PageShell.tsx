import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { INSTAGRAM_HANDLE, WHATSAPP_DISPLAY, WHATSAPP_NUMBER_RAW } from '@/lib/futbolenlapiel-data';
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/lib/navigation';
import FloatingWhatsApp from './FloatingWhatsApp';
import SiteNavbar from './SiteNavbar';

interface PageShellProps {
  badge: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function PageShell({ badge, title, description, children }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col cl-field text-foreground">
      <SiteNavbar />

      <main className="flex-1 w-[min(1180px,calc(100%-32px))] mx-auto pt-28 max-md:pt-22 pb-24 flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge
              variant="secondary"
              className="w-fit font-mono-cl uppercase tracking-[0.12em] text-[11px] border border-[#8ECBF5]/30"
            >
              {badge}
            </Badge>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono-cl text-muted-foreground hover:text-primary no-underline transition-colors"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Portada 3D
            </Link>
          </div>

          <h1 className="font-disp font-black uppercase text-[clamp(40px,6vw,78px)] leading-[0.9] tracking-[-0.025em] text-foreground">
            {title}
          </h1>
          <p className="max-w-2xl text-[15px] md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </section>

        <Separator className="bg-[#F5EAD6]/14" />

        {children}
      </main>

      <footer className="border-t border-[#F5EAD6]/14 bg-[#061121]/80 backdrop-blur-md">
        <div className="w-[min(1180px,calc(100%-32px))] mx-auto py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-archivo text-sm tracking-wide text-foreground">
              FUTBOL EN LA PIEL
            </span>
            <span className="text-xs text-muted-foreground font-mono-cl">
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                {INSTAGRAM_HANDLE}
              </a>{' '}
              ·{' '}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER_RAW}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </span>
          </div>

          <nav aria-label="Navegación de pie de página" className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-muted-foreground hover:text-primary no-underline transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {SECONDARY_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-muted-foreground hover:text-primary no-underline transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
