import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/config';

// Rechtstexte: Name stammt aus der Buchungsseite. Anschrift und Datenschutztext
// müssen von Ronja ergänzt werden – hier nichts erfinden.
const legal = [
  {
    key: 'impressum',
    label: 'Impressum',
    body: (
      <>
        <p><strong>Female Power Coaching</strong><br />Ronja Stoll</p>
        <p className="mt-3">Kontakt: <a className="underline" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM_HANDLE}</a> auf Instagram</p>
        <p className="mt-3 text-muted">Weitere Angaben (Anschrift, E-Mail) werden in Kürze ergänzt.</p>
      </>
    )
  },
  {
    key: 'datenschutz',
    label: 'Datenschutz',
    body: (
      <>
        <p>Diese Seite speichert keine Daten über dich und setzt keine Tracking-Cookies.</p>
        <p className="mt-3">Für die Terminbuchung wirst du auf die Seite von Nutrilize weitergeleitet. Dort gilt deren Datenschutzerklärung.</p>
        <p className="mt-3 text-muted">Die vollständige Datenschutzerklärung wird in Kürze ergänzt.</p>
      </>
    )
  }
];

export function Footer() {
  return (
    <footer className="border-t border-line px-5 pb-28 pt-10 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Ronja – Female Power Coaching</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          {legal.map((l) => (
            <li key={l.key}>
              <Dialog.Root>
                <Dialog.Trigger className="min-h-11 cursor-pointer font-medium underline-offset-4 hover:text-ink hover:underline">
                  {l.label}
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
                  <Dialog.Content className="dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-6 text-ink shadow-2xl">
                    <Dialog.Title className="font-display text-2xl font-semibold">{l.label}</Dialog.Title>
                    <Dialog.Description className="sr-only">{l.label} von Female Power Coaching</Dialog.Description>
                    <div className="mt-4 leading-relaxed">{l.body}</div>
                    <Dialog.Close
                      aria-label="Schliessen"
                      className="absolute right-3 top-3 grid size-11 cursor-pointer place-items-center rounded-full hover:bg-bg"
                    >
                      <X className="size-5" aria-hidden />
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </li>
          ))}
          <li>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-medium text-ink underline-offset-4 hover:underline"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              {INSTAGRAM_HANDLE}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
