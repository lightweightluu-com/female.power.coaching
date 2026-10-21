import { useRef, type ReactNode, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

type Props = { children: ReactNode; className?: string };

/** Karte mit Spotlight-Glow, der dem Zeiger (Maus/Touch) folgt – Magic-UI-Stil. */
export function SpotlightCard({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 active:scale-[0.985] sm:p-8',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--accent-soft) 22%, transparent), transparent 70%)'
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
