import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createWhatsAppUrl } from '@/lib/whatsapp';

interface FloatingWhatsAppProps {
  message?: string;
}

export default function FloatingWhatsApp({
  message = 'Hola Fútbol en la Piel! Quiero consultar por una camiseta.',
}: FloatingWhatsAppProps) {
  const href = createWhatsAppUrl(message);

  return (
    <div className="fixed bottom-4 right-4 z-40 md:hidden">
      <Button
        size="lg"
        className="rounded-full font-bold shadow-[0_12px_30px_-8px_rgba(0,0,0,0.85)] border border-primary/40 px-4 h-11"
        render={
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedir o consultar por WhatsApp"
          />
        }
      >
        <MessageCircle data-icon="inline-start" />
        WhatsApp
      </Button>
    </div>
  );
}
