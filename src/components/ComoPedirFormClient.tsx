'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DEPARTAMENTOS_URUGUAY,
  SIZES,
  VERSION_OPTIONS,
  buildWhatsAppHref,
  computeConsultaCode,
} from '@/lib/futbolenlapiel-data';

export default function ComoPedirFormClient() {
  const [name, setName] = useState('');
  const [camiseta, setCamiseta] = useState('Uruguay 2026 Mundial');
  const [version, setVersion] = useState<string>(VERSION_OPTIONS[0]);
  const [size, setSize] = useState<string>('M');
  const [fulfil, setFulfil] = useState<'envio' | 'coordinar'>('envio');
  const [departamento, setDepartamento] = useState<string>('Montevideo');
  const [error, setError] = useState('');

  const handleOpenWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Escribí tu nombre para armar la consulta.');
      return;
    }
    if (!camiseta.trim()) {
      setError('Indicá qué camiseta te interesa consultar.');
      return;
    }
    setError('');
    const consultaId = computeConsultaCode(`${name}-${camiseta}-${size}`);
    const href = buildWhatsAppHref({
      name: name.trim(),
      camiseta: camiseta.trim(),
      version,
      size,
      fulfil,
      departamento,
      consultaId,
    });
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-disp text-2xl font-bold">
          Preparar consulta para WhatsApp
        </CardTitle>
        <CardDescription>
          Completá estos datos y abrí el chat con tu pedido ya armado.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleOpenWhatsApp}>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cp-name" className="text-xs font-mono-cl uppercase text-muted-foreground">
                Tu nombre
              </label>
              <Input
                id="cp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Martín"
                className="h-10 bg-background/60 border-border"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cp-camiseta" className="text-xs font-mono-cl uppercase text-muted-foreground">
                Camiseta o modelo
              </label>
              <Input
                id="cp-camiseta"
                value={camiseta}
                onChange={(e) => setCamiseta(e.target.value)}
                placeholder="Ej: España 1996 Luis Enrique 21"
                className="h-10 bg-background/60 border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono-cl uppercase text-muted-foreground">Versión</span>
              <div className="flex flex-wrap gap-2">
                {VERSION_OPTIONS.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    size="sm"
                    variant={version === opt ? 'default' : 'outline'}
                    onClick={() => setVersion(opt)}
                    className="rounded-full"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono-cl uppercase text-muted-foreground">Talle</span>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={size === s ? 'default' : 'outline'}
                    onClick={() => setSize(s)}
                    className="rounded-full min-w-11 font-mono-cl"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono-cl uppercase text-muted-foreground">Entrega</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={fulfil === 'envio' ? 'default' : 'outline'}
                  onClick={() => setFulfil('envio')}
                  className="rounded-full"
                >
                  Envío a domicilio / agencia
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={fulfil === 'coordinar' ? 'default' : 'outline'}
                  onClick={() => setFulfil('coordinar')}
                  className="rounded-full"
                >
                  Coordinar retiro
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cp-depto" className="text-xs font-mono-cl uppercase text-muted-foreground">
                Departamento
              </label>
              <select
                id="cp-depto"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground"
              >
                {DEPARTAMENTOS_URUGUAY.map((dep) => (
                  <option key={dep} value={dep} className="bg-popover text-popover-foreground">
                    {dep}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex-col items-start gap-3 pt-4 border-t border-border/60">
          <Button type="submit" size="lg" className="rounded-full font-bold">
            <MessageCircle data-icon="inline-start" />
            Preparar consulta para WhatsApp
          </Button>
          <p className="text-xs text-muted-foreground">
            Nada en esta página cobra ni reserva stock. Al abrir WhatsApp confirmamos disponibilidad
            y precio en el momento.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
