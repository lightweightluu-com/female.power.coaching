const items = [
  'Ketogene Ernährung',
  'Hormonelle Balance',
  'PMOS',
  'Training',
  '1:1 Coaching',
  'Wöchentliche Check-ins',
  'Kein One-Size-Fits-All'
];

/** Laufband mit den Kernthemen. Bei reduzierter Bewegung steht es still. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap font-display text-2xl italic sm:text-3xl">
          <span className="px-6">{t}</span>
          <span aria-hidden className="size-1.5 rounded-full bg-bg/60" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="marquee mt-16 overflow-hidden bg-ink py-5 text-bg"
      role="region"
      aria-label="Schwerpunkte des Coachings"
    >
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
