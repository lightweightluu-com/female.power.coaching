import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/config';

// Interim-Footer – Impressum/Datenschutz folgen mit dem finalen Conversion-Block.
export function Footer() {
  return (
    <footer className="border-t border-line px-5 pb-28 pt-10 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Ronja – Female Power Coaching</p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-ink hover:text-accent"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg> {INSTAGRAM_HANDLE}
        </a>
      </div>
    </footer>
  );
}
