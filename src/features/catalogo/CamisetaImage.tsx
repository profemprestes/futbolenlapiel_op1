'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { renderCamisetaDataURL } from '@/lib/camiseta-assets';
import type { ModeloId } from '@/lib/data/modelos';

interface CamisetaImageProps {
  modelo: ModeloId;
  alt: string;
  className?: string;
  priority?: boolean;
}

const TRANSPARENT_PX =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default function CamisetaImage({
  modelo,
  alt,
  className,
  priority = false,
}: CamisetaImageProps) {
  const [renderedMap, setRenderedMap] = useState<Partial<Record<ModeloId, string>>>({});

  useEffect(() => {
    if (renderedMap[modelo]) return;
    const rafId = requestAnimationFrame(() => {
      const url = renderCamisetaDataURL(modelo);
      if (url) {
        setRenderedMap((prev) => (prev[modelo] ? prev : { ...prev, [modelo]: url }));
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [modelo, renderedMap]);

  return (
    <Image
      src={renderedMap[modelo] ?? TRANSPARENT_PX}
      alt={alt}
      width={1200}
      height={713}
      priority={priority}
      referrerPolicy="no-referrer"
      className={className}
    />
  );
}
