import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, LogOut, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, ApiError, type AdminTestimonial, type MetaInput } from '@/admin/api';
import { resizeImage } from '@/admin/resizeImage';
import { cn } from '@/lib/utils';

type Slot = 'before' | 'after';
interface Picked { blob: Blob; preview: string }
interface Draft extends MetaInput {
  id?: string;
  existing: { before: string | null; after: string | null };
  picked: Partial<Record<Slot, Picked>>;
}

const emptyDraft = (): Draft => ({
  name: '', result: '', text: '', consent: false, consentNote: '', published: false,
  existing: { before: null, after: null }, picked: {}
});

const fromItem = (t: AdminTestimonial): Draft => ({
  id: t.id, name: t.name, result: t.result, text: t.text, consent: t.consent,
  consentNote: t.consentNote, published: t.published,
  existing: { before: t.before, after: t.after }, picked: {}
});

const field = 'h-12 w-full rounded-xl border border-line bg-surface px-4 text-base outline-offset-2 placeholder:text-muted/70';

function Field({ label, hint, error, htmlFor, children }: { label: string; hint?: string; error?: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-[#a3201a] dark:text-[#ff9a92]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

function Banner({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  const Icon = kind === 'error' ? AlertCircle : CheckCircle2;
  return (
    <p
      role={kind === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-medium',
        kind === 'error' ? 'border-[#a3201a]/40 bg-[#a3201a]/10' : 'border-line bg-surface'
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden /> {children}
    </p>
  );
}

/* ---------- Login ---------- */

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(password);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Anmeldung fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-sm space-y-5">
      <h1 className="font-display text-3xl font-semibold">Anmelden</h1>
      <p className="text-muted">Verwaltung der Erfahrungsberichte für Female Power Coaching.</p>
      <Field label="Passwort" htmlFor="pw" error={error}>
        <input
          id="pw" type="password" autoComplete="current-password" required value={password}
          onChange={(e) => setPassword(e.target.value)} className={field}
        />
      </Field>
      <Button type="submit" className="w-full" aria-busy={busy}>
        {busy ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Anmelden …</> : 'Anmelden'}
      </Button>
    </form>
  );
}

/* ---------- Bild-Auswahl ---------- */

function ImagePicker({ slot, label, src, error, onPick }: { slot: Slot; label: string; src: string | null; error?: string; onPick: (slot: Slot, f: File) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const id = `img-${slot}`;
  return (
    <div>
      <p id={`${id}-l`} className="mb-1.5 text-sm font-semibold">{label}</p>
      <button
        type="button" onClick={() => input.current?.click()} aria-labelledby={`${id}-l`}
        className={cn(
          'group relative grid aspect-[4/5] w-full cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-surface text-muted transition-colors hover:border-ink',
          error ? 'border-[#a3201a]' : 'border-line'
        )}
      >
        {src ? (
          <>
            <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-x-2 bottom-2 rounded-lg bg-bg/90 px-3 py-2 text-sm font-semibold text-ink">Bild ersetzen</span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-center text-sm font-medium">
            <ImagePlus className="size-7" aria-hidden /> Foto auswählen
          </span>
        )}
      </button>
      <input
        ref={input} id={id} type="file" accept="image/*" className="sr-only" tabIndex={-1}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(slot, f); e.target.value = ''; }}
      />
      {error && (
        <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-[#a3201a] dark:text-[#ff9a92]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Editor ---------- */

function Editor({ initial, onCancel, onSaved }: { initial: Draft; onCancel: () => void; onSaved: (message: string) => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setErrors((e) => ({ ...e, [k as string]: '' }));
  };

  const pick = async (slot: Slot, file: File) => {
    try {
      const blob = await resizeImage(file);
      setD((prev) => ({ ...prev, picked: { ...prev.picked, [slot]: { blob, preview: URL.createObjectURL(blob) } } }));
      setErrors((e) => ({ ...e, [slot]: '' }));
    } catch (err) {
      setErrors((e) => ({ ...e, [slot]: err instanceof Error ? err.message : 'Bild konnte nicht gelesen werden.' }));
    }
  };

  const src = (slot: Slot) => d.picked[slot]?.preview ?? d.existing[slot];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!d.name.trim()) e.name = 'Bitte einen Namen angeben (z. B. nur der Vorname).';
    if (d.published) {
      if (!d.consent) e.consent = 'Zum Veröffentlichen muss die Einwilligung vorliegen.';
      if (!src('before')) e.before = 'Zum Veröffentlichen fehlt das Vorher-Bild.';
      if (!src('after')) e.after = 'Zum Veröffentlichen fehlt das Nachher-Bild.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setBusy(true);
    const meta: MetaInput = { name: d.name, result: d.result, text: d.text, consent: d.consent, consentNote: d.consentNote, published: d.published };
    try {
      // Erst als Entwurf speichern, damit Bilder hochgeladen werden können; dann endgültig.
      const base = d.id ? await api.update(d.id, { ...meta, published: false }) : await api.create({ ...meta, published: false });
      for (const slot of ['before', 'after'] as Slot[]) {
        const p = d.picked[slot];
        if (p) await api.uploadImage(base.id, slot, p.blob);
      }
      await api.update(base.id, meta);
      onSaved(d.published ? 'Gespeichert und veröffentlicht.' : 'Als Entwurf gespeichert.');
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Speichern fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} noValidate className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{d.id ? 'Bericht bearbeiten' : 'Neuer Bericht'}</h2>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Abbrechen</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ImagePicker slot="before" label="Vorher" src={src('before')} error={errors.before} onPick={pick} />
        <ImagePicker slot="after" label="Nachher" src={src('after')} error={errors.after} onPick={pick} />
      </div>

      <Field label="Name" htmlFor="name" error={errors.name} hint="Wird öffentlich angezeigt, z. B. nur der Vorname.">
        <input id="name" value={d.name} maxLength={60} onChange={(e) => set('name', e.target.value)} className={field} aria-invalid={!!errors.name} />
      </Field>
      <Field label="Ergebnis in einer Zeile" htmlFor="result" hint="Zum Beispiel «−5 kg in 8 Wochen».">
        <input id="result" value={d.result} maxLength={80} onChange={(e) => set('result', e.target.value)} className={field} />
      </Field>
      <Field label="Erfahrungsbericht" htmlFor="text" hint={`${d.text.length} von 1200 Zeichen`}>
        <textarea id="text" value={d.text} maxLength={1200} rows={6} onChange={(e) => set('text', e.target.value)} className={cn(field, 'h-auto py-3')} />
      </Field>

      <fieldset className="space-y-4 rounded-2xl border border-line bg-surface p-5">
        <legend className="px-2 text-sm font-semibold">Einwilligung und Veröffentlichung</legend>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={d.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--ink)]" />
          <span className="text-sm leading-relaxed">
            Die <strong>schriftliche Einwilligung</strong> der Person zur Veröffentlichung von Name, Text und Fotos liegt vor.
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-[#a3201a] dark:text-[#ff9a92]">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {errors.consent}
          </p>
        )}
        <Field label="Notiz zur Einwilligung" htmlFor="note" hint="Wann und wie eingeholt, z. B. «schriftlich per E-Mail am 12.10.2026».">
          <input id="note" value={d.consentNote} maxLength={200} onChange={(e) => set('consentNote', e.target.value)} className={field} />
        </Field>
        <label className="flex cursor-pointer items-start gap-3 border-t border-line pt-4">
          <input type="checkbox" checked={d.published} onChange={(e) => set('published', e.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--ink)]" />
          <span className="text-sm leading-relaxed"><strong>Auf der Webseite veröffentlichen.</strong> Ohne Haken bleibt der Bericht ein Entwurf.</span>
        </label>
      </fieldset>

      {formError && <Banner kind="error">{formError}</Banner>}
      <Button type="submit" size="lg" className="w-full" aria-busy={busy}>
        {busy ? <><Loader2 className="size-5 animate-spin" aria-hidden /> Speichern …</> : 'Speichern'}
      </Button>
    </form>
  );
}

/* ---------- Liste ---------- */

function Thumb({ src, label }: { src: string | null; label: string }) {
  return (
    <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg bg-bg sm:w-20">
      {src ? <img src={src} alt="" className="size-full object-cover" /> : <span className="grid size-full place-items-center text-[0.65rem] text-muted">kein {label}</span>}
    </div>
  );
}

function List({ items, onNew, onEdit, onDelete }: { items: AdminTestimonial[]; onNew: () => void; onEdit: (t: AdminTestimonial) => void; onDelete: (t: AdminTestimonial) => void }) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-8 text-center">
        <ImagePlus className="mx-auto size-8 text-muted" aria-hidden />
        <h2 className="mt-3 font-display text-2xl font-semibold">Noch kein Erfahrungsbericht</h2>
        <p className="mx-auto mt-2 max-w-sm text-muted">Lade den ersten Bericht mit Vorher- und Nachher-Foto hoch. Er erscheint erst auf der Webseite, wenn du ihn veröffentlichst.</p>
        <Button onClick={onNew} className="mt-6"><Plus className="size-5" aria-hidden /> Ersten Bericht anlegen</Button>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t.id} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 sm:p-4">
          <Thumb src={t.before} label="Vorher" />
          <Thumb src={t.after} label="Nachher" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{t.name}</p>
            <p className="truncate text-sm text-muted">{t.result || 'Kein Ergebnis angegeben'}</p>
            <p className={cn('mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', t.published ? 'border-ink' : 'border-line text-muted')}>
              {t.published ? <><CheckCircle2 className="size-3.5" aria-hidden /> Veröffentlicht</> : 'Entwurf'}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
            <button type="button" onClick={() => onEdit(t)} aria-label={`${t.name} bearbeiten`} className="grid size-11 cursor-pointer place-items-center rounded-xl hover:bg-bg"><Pencil className="size-5" aria-hidden /></button>
            <button type="button" onClick={() => onDelete(t)} aria-label={`${t.name} löschen`} className="grid size-11 cursor-pointer place-items-center rounded-xl hover:bg-bg"><Trash2 className="size-5" aria-hidden /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ConfirmDelete({ target, onClose, onConfirm }: { target: AdminTestimonial | null; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog.Root open={!!target} onOpenChange={(o) => !o && !busy && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
        <Dialog.Content className="dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-6 text-ink shadow-2xl">
          <Dialog.Title className="font-display text-2xl font-semibold">Bericht von {target?.name} löschen?</Dialog.Title>
          <Dialog.Description className="mt-3 leading-relaxed text-muted">Text und beide Fotos werden endgültig gelöscht. Das lässt sich nicht rückgängig machen.</Dialog.Description>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={busy}>Bericht behalten</Button>
            <Button
              variant="ink" aria-busy={busy}
              onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); } }}
            >
              {busy ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Löschen …</> : 'Bericht löschen'}
            </Button>
          </div>
          <Dialog.Close aria-label="Schliessen" className="absolute right-3 top-3 grid size-11 cursor-pointer place-items-center rounded-full hover:bg-bg"><X className="size-5" aria-hidden /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ---------- Seite ---------- */

export default function Admin() {
  const [auth, setAuth] = useState<'checking' | 'out' | 'in'>('checking');
  const [items, setItems] = useState<AdminTestimonial[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState<AdminTestimonial | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = 'Verwaltung – Female Power Coaching';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.append(meta); }
    meta.content = 'noindex, nofollow';
    api.me().then(() => setAuth('in')).catch(() => setAuth('out'));
  }, []);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      setItems(await api.list());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setAuth('out');
      else setLoadError(err instanceof ApiError ? err.message : 'Laden fehlgeschlagen.');
    }
  }, []);

  useEffect(() => { if (auth === 'in') void load(); }, [auth, load]);

  const logout = async () => { await api.logout().catch(() => undefined); setItems(null); setAuth('out'); };

  return (
    <div className="min-h-svh bg-bg px-5 py-8 pb-16 text-ink sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-3">
          <a href="/" className="font-display text-lg font-semibold">Female Power Coaching</a>
          {auth === 'in' && (
            <Button variant="outline" size="sm" onClick={logout}><LogOut className="size-4" aria-hidden /> Abmelden</Button>
          )}
        </header>

        <main>
          {auth === 'checking' && <p role="status" className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" aria-hidden /> Lädt …</p>}
          {auth === 'out' && <Login onDone={() => setAuth('in')} />}
          {auth === 'in' && editing && (
            <Editor
              key={editing.id ?? 'new'} initial={editing} onCancel={() => setEditing(null)}
              onSaved={(m) => { setEditing(null); setNotice(m); void load(); }}
            />
          )}
          {auth === 'in' && !editing && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-display text-3xl font-semibold">Erfahrungsberichte</h1>
                {items && items.length > 0 && <Button onClick={() => { setNotice(''); setEditing(emptyDraft()); }}><Plus className="size-5" aria-hidden /> Neuer Bericht</Button>}
              </div>
              {notice && <Banner kind="success">{notice}</Banner>}
              {loadError && (
                <div className="space-y-3">
                  <Banner kind="error">{loadError}</Banner>
                  <Button variant="outline" onClick={load}>Erneut versuchen</Button>
                </div>
              )}
              {!loadError && items === null && <p role="status" className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" aria-hidden /> Berichte werden geladen …</p>}
              {items && <List items={items} onNew={() => setEditing(emptyDraft())} onEdit={(t) => { setNotice(''); setEditing(fromItem(t)); }} onDelete={setDeleting} />}
            </div>
          )}
        </main>
      </div>

      <ConfirmDelete
        target={deleting} onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          try { await api.remove(deleting.id); setNotice(`Bericht von ${deleting.name} gelöscht.`); setDeleting(null); await load(); }
          catch (err) { setLoadError(err instanceof ApiError ? err.message : 'Löschen fehlgeschlagen.'); setDeleting(null); }
        }}
      />
    </div>
  );
}
