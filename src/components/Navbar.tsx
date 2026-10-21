import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BOOKING_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

const links = [
  { href: '#ueber-ronja', label: 'Über Ronja' },
  { href: '#ergebnisse', label: 'Ergebnisse' },
  { href: '#ablauf', label: 'Ablauf' },
  { href: '#faq', label: 'FAQ' }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-all duration-300',
        scrolled ? 'border-b border-line bg-bg/85 text-ink backdrop-blur-xl' : 'bg-transparent text-[#2b1317]'
      )}
    >
      <nav aria-label="Hauptnavigation" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" aria-label="Female Power Coaching, zum Seitenanfang" className="flex min-h-11 items-center gap-2.5">
          <img src="/images/logo.webp" alt="" width={40} height={40} className="size-10 rounded-[0.7rem]" />
          <span className="flex items-baseline gap-1.5 leading-none">
            <span aria-hidden className="font-script text-[2.15rem]">Female. Power.</span>
            <span aria-hidden className="text-lg font-medium tracking-tight">Coaching</span>
          </span>
        </a>
        <div className="flex items-center gap-6">
          {scrolled && links.map((l) => (
            <a key={l.href} href={l.href} className="hidden min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline lg:flex">
              {l.label}
            </a>
          ))}
          <Button asChild size="sm" className="hidden min-h-11 sm:inline-flex">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              Clarity Call buchen
            </a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
