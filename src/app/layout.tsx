import type { Metadata, Viewport } from 'next';
import { Archivo_Black, Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import { BRAND_LOGOS } from '@/lib/futbolenlapiel-data';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-text',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-disp',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://futbolenlapiel.uy'),
  title: 'Fútbol en la Piel — Camisetas actuales y retros en Uruguay (@futbolenlapieluy1)',
  description:
    'Camisetas actuales y retros en Uruguay. Envíos a todo el país. Consultá stock, versión Jugador o Fan y talles por WhatsApp al +598 092 864 559.',
  icons: {
    icon: BRAND_LOGOS.emblem,
    apple: BRAND_LOGOS.emblem,
  },
  openGraph: {
    title: 'Fútbol en la Piel — @futbolenlapieluy1',
    description:
      'Camisetas actuales y retros en Uruguay. Envíos a todo el país. Consultas al privado o por WhatsApp.',
    type: 'website',
    images: [BRAND_LOGOS.emblem],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fútbol en la Piel — @futbolenlapieluy1',
    description:
      'Camisetas actuales y retros en Uruguay. Envíos a todo el país. Consultas por WhatsApp.',
    images: [BRAND_LOGOS.emblem],
  },
};

export const viewport: Viewport = {
  themeColor: '#0A1B33',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} ${archivoBlack.variable} ${barlowCondensed.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
