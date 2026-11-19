'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowUpRight,
  ClipboardList,
  History,
  Home,
  Menu,
  MessageCircle,
  Pause,
  Play,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  BRAND_LOGOS,
  INSTAGRAM_HANDLE,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER_RAW,
} from '@/lib/futbolenlapiel-data';
import { NAV_ITEMS, TIENDA_DROPDOWN_ITEMS, type NavItem } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface SiteNavbarProps {
  solid?: boolean;
  paused?: boolean;
  onTogglePause?: () => void;
  tickerRef?: React.RefObject<HTMLElement | null>;
  isHome?: boolean;
}

const NAV_ICONS: Record<NavItem['iconName'], React.ComponentType<{ className?: string }>> = {
  home: Home,
  'shopping-bag': ShoppingBag,
  history: History,
  'clipboard-list': ClipboardList,
  truck: Truck,
  'message-circle': MessageCircle,
};

export default function SiteNavbar({
  solid = false,
  paused = false,
  onTogglePause,
  tickerRef,
  isHome = false,
}: SiteNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const whatsappDirectHref = `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
    'Hola Fútbol en la Piel! Quiero consultar por stock y talles disponibles.'
  )}`;

  return (
    <header
      ref={tickerRef}
      aria-label="Navegación principal Fútbol en la Piel"
      className={cn(
        'fixed z-30 top-3 max-md:top-2 left-1/2 -translate-x-1/2 w-[min(1220px,calc(100%-24px))] h-13 max-md:h-12 pl-4 max-md:pl-3 pr-2 max-md:pr-1.5 flex items-center justify-between gap-3 border border-[#F5EAD6]/22 rounded-full shadow-[0_1px_0_rgba(245,234,214,0.14)_inset,0_12px_40px_-20px_rgba(0,0,0,0.75)] backdrop-blur-[18px] backdrop-saturate-[1.45] transition-[background,border-color] duration-350',
        isHome && 'ticker-bar',
        solid ? 'bg-[#000000]/90' : 'bg-[#0A1B33]/85'
      )}
    >
      {/* Brand */}
      <Link
        href="/"
        aria-label="Fútbol en la Piel, ir al inicio"
        className="flex items-center gap-2.5 no-underline whitespace-nowrap shrink-0"
      >
        <Image
          src={BRAND_LOGOS.emblem}
          alt=""
          width={30}
          height={30}
          priority
          className="size-7.5 max-md:size-6.5 rounded-full border border-[#F5EAD6]/25 bg-black object-cover shrink-0"
        />
        <span className="font-archivo text-[14px] max-md:text-[12px] tracking-[0.02em] text-foreground">
          FUTBOL EN LA PIEL
        </span>
        <Badge variant="secondary" className="hidden xl:inline-flex text-[10px] font-mono-cl">
          UY
        </Badge>
      </Link>

      {/* Desktop NavigationMenu */}
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList className="gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(item.href);

            if (item.href === '/tienda') {
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger
                    className={cn(
                      'h-8 rounded-full bg-transparent px-3 text-[13px] font-semibold text-foreground/80 hover:bg-foreground/10 hover:text-foreground focus:bg-foreground/10 data-popup-open:bg-foreground/12 data-open:bg-foreground/12',
                      active && 'bg-primary/18 text-primary hover:bg-primary/22 hover:text-primary'
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[460px] p-3 bg-popover text-popover-foreground">
                    <div className="grid grid-cols-2 gap-2">
                      {TIENDA_DROPDOWN_ITEMS.map((sub) => (
                        <NavigationMenuLink
                          key={sub.href}
                          render={<Link href={sub.href} />}
                          className="flex flex-col items-start gap-1 rounded-lg p-3 hover:bg-muted/70"
                        >
                          <span className="text-sm font-semibold text-foreground">{sub.title}</span>
                          <span className="text-xs text-muted-foreground leading-snug">
                            {sub.description}
                          </span>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  active={active}
                  render={<Link href={item.href} />}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'h-8 rounded-full bg-transparent px-3 text-[13px] font-semibold text-foreground/80 hover:bg-foreground/10 hover:text-foreground focus:bg-foreground/10 data-active:bg-primary/18 data-active:text-primary'
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {onTogglePause && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onTogglePause}
            aria-pressed={paused}
            aria-label={paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
            className="rounded-full border-[#8ECBF5]/45 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground max-md:size-8 max-md:px-0"
          >
            {paused ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}
            <span className="max-md:hidden">{paused ? 'Reanudar' : 'Pausar'}</span>
          </Button>
        )}

        <Button
          size="sm"
          className="rounded-full font-bold px-3.5 max-md:px-3"
          render={
            isHome ? (
              <a href="#pedido" />
            ) : (
              <a href={whatsappDirectHref} target="_blank" rel="noopener noreferrer" />
            )
          }
        >
          <MessageCircle data-icon="inline-start" />
          <span>Pedir</span>
          <span className="max-sm:hidden">por WhatsApp</span>
        </Button>

        {/* Mobile Sheet Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Abrir menú de navegación"
                className="lg:hidden rounded-full border-border bg-transparent text-foreground hover:bg-foreground/10"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(340px,88vw)] bg-popover text-popover-foreground border-border">
            <SheetHeader className="text-left">
              <div className="flex items-center gap-2.5">
                <Image
                  src={BRAND_LOGOS.emblem}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 rounded-full border border-border bg-black object-cover"
                />
                <SheetTitle className="font-archivo tracking-wide text-foreground">
                  FUTBOL EN LA PIEL
                </SheetTitle>
              </div>
              <SheetDescription className="text-muted-foreground">
                {INSTAGRAM_HANDLE} · Camisetas actuales y retros en Uruguay
              </SheetDescription>
            </SheetHeader>

            <Separator />

            <nav aria-label="Páginas del sitio" className="flex flex-col gap-1.5 px-4">
              {NAV_ITEMS.map((item) => {
                const Icon = NAV_ICONS[item.iconName];
                const active = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-start gap-3 rounded-xl px-3 py-2.5 no-underline transition-colors',
                      active
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'text-foreground/85 hover:bg-muted/70 hover:text-foreground'
                    )}
                  >
                    <Icon className="size-4 mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold leading-none">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <Separator />

            <SheetFooter className="gap-2.5">
              <Button
                className="w-full rounded-full font-bold"
                render={
                  <a
                    href={whatsappDirectHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  />
                }
              >
                <MessageCircle data-icon="inline-start" />
                Consultar por WhatsApp
                <ArrowUpRight data-icon="inline-end" />
              </Button>
              <p className="text-center text-xs font-mono-cl text-muted-foreground">
                {WHATSAPP_DISPLAY} · Envíos a todo Uruguay
              </p>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
