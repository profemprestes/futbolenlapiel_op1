import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Logo3D from '@/components/Logo3D';

export const metadata: Metadata = {
  title: 'Emblema 3D | Fútbol en la Piel',
  description: 'Vista interactiva del emblema 3D de Fútbol en la Piel.',
};

export default function EmblemaPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0A1B33]">
      <Logo3D className="h-full w-full" ariaLabel="Emblema oficial 3D de Fútbol en la Piel" />

      <Link
        href="/"
        className="fixed top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full border border-[#F5EAD6]/25 bg-[#0A1B33]/80 px-4 py-2 text-[13px] font-semibold text-[#F5EAD6] backdrop-blur-md transition-colors hover:bg-[#0A1B33]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>
    </main>
  );
}
