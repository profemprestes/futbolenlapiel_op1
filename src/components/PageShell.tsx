import Link from 'next/link';
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNavbar />

      <main className="flex-1 w-[min(1180px,calc(100%-32px))] mx-auto pt-26 pb-20 flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit font-mono-cl uppercase tracking-wider">
            {badge}
          </Badge>
          <h1 className="font-disp font-black text-[clamp(38px,5.5vw,68px)] leading-[0.94] tracking-[-0.02em] text-foreground">
            {title}
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </section>

        <Separator />

        {children}
      </main>

      <footer className="border-t border-border bg-card/40">
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
