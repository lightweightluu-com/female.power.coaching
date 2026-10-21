import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BOOKING_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

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
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          Female <span className="italic">Power</span> Coaching
        </a>
        <div className="flex items-center gap-6">
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
