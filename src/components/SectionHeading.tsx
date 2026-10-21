import type { ReactNode } from 'react';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/utils';

type Props = { eyebrow: string; id: string; children: ReactNode; className?: string };

export function SectionHeading({ eyebrow, id, children, className }: Props) {
  return (
    <Reveal className={cn('max-w-2xl', className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
        {children}
      </h2>
    </Reveal>
  );
}
