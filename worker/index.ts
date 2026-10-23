/**
 * Mini-Backend für die Erfahrungsberichte (Cloudflare Worker + Workers KV).
 *
 * Öffentlich:  GET /api/testimonials, GET /img/:id/:slot
 * Admin:       /api/admin/* (Login per Passwort, Session in KV)
 *
 * KV-Schlüssel:
 *   idx            JSON-Liste aller Bericht-IDs (neueste zuerst)
 *   t:<id>         JSON des Berichts
 *   img:<id>:<slot>  Bild (before | after), Typ in den Metadaten
 *   s:<sid>        Admin-Session (läuft nach 7 Tagen ab)
 *   rl:<ip>        Zähler gegen Passwort-Raten
 */

interface Env {
  ASSETS: Fetcher;
  DB: KVNamespace;
  /** SHA-256 (hex) des Admin-Passworts. Das Passwort ist ein langer Zufallswert. */
  ADMIN_HASH: string;
}

type Slot = 'before' | 'after';

interface Testimonial {
  id: string;
  name: string;
  result: string;
  text: string;
  consent: boolean;
  consentNote: string;
  published: boolean;
  hasBefore: boolean;
  hasAfter: boolean;
  createdAt: number;
  updatedAt: number;
}

const SESSION_TTL = 60 * 60 * 24 * 7;
const MAX_IMAGE_BYTES = 2_500_000;
const ID_RE = /^[a-f0-9]{16}$/;
const IMAGE_TYPES = ['image/webp', 'image/jpeg', 'image/png'];

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  });

const fail = (status: number, message: string) => json({ error: message }, status);

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getCookie(req: Request, name: string): string | null {
  const raw = req.headers.get('cookie') ?? '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

const randomHex = (bytes: number) =>
  [...crypto.getRandomValues(new Uint8Array(bytes))].map((b) => b.toString(16).padStart(2, '0')).join('');

async function readIndex(env: Env): Promise<string[]> {
  return (await env.DB.get<string[]>('idx', 'json')) ?? [];
}

async function readTestimonial(env: Env, id: string): Promise<Testimonial | null> {
  return env.DB.get<Testimonial>(`t:${id}`, 'json');
}

const isPublic = (t: Testimonial) => t.published && t.consent && t.hasBefore && t.hasAfter;

const imageUrls = (t: Testimonial) => ({
  before: `/img/${t.id}/before?v=${t.updatedAt}`,
  after: `/img/${t.id}/after?v=${t.updatedAt}`
});

/** Vorschau-Adressen für den Admin: funktionieren auch bei unveröffentlichten Berichten. */
const adminImageUrls = (t: Testimonial) => ({
  before: t.hasBefore ? `/api/admin/testimonials/${t.id}/before?v=${t.updatedAt}` : null,
  after: t.hasAfter ? `/api/admin/testimonials/${t.id}/after?v=${t.updatedAt}` : null
});

/* ---------- Öffentlich ---------- */

async function publicList(env: Env): Promise<Response> {
  const ids = await readIndex(env);
  const all = await Promise.all(ids.map((id) => readTestimonial(env, id)));
  const items = all
    .filter((t): t is Testimonial => !!t && isPublic(t))
    .map((t) => ({ id: t.id, name: t.name, result: t.result, text: t.text, ...imageUrls(t) }));
  // Kein Browser-Cache: zurückgezogene Berichte müssen sofort verschwinden.
  return json(items, 200, { 'cache-control': 'no-cache' });
}

async function image(env: Env, id: string, slot: Slot): Promise<Response> {
  const t = await readTestimonial(env, id);
  if (!t || !isPublic(t)) return new Response('Nicht gefunden', { status: 404 });
  return serveImage(env, id, slot, 'public, max-age=86400');
}

async function serveImage(env: Env, id: string, slot: Slot, cache: string): Promise<Response> {
  const { value, metadata } = await env.DB.getWithMetadata<{ type: string }>(`img:${id}:${slot}`, 'arrayBuffer');
  if (!value) return new Response('Nicht gefunden', { status: 404 });
  return new Response(value, {
    headers: { 'content-type': metadata?.type ?? 'image/webp', 'cache-control': cache, 'x-content-type-options': 'nosniff' }
  });
}

/* ---------- Admin ---------- */

async function login(req: Request, env: Env): Promise<Response> {
  const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
  const rlKey = `rl:${ip}`;
  const tries = Number((await env.DB.get(rlKey)) ?? '0');
  if (tries >= 10) return fail(429, 'Zu viele Versuche. Bitte in 10 Minuten erneut versuchen.');

  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  // Gross-/Kleinschreibung, Leerzeichen und Bindestriche spielen keine Rolle (Passwort wird gruppiert angezeigt).
  const given = typeof body?.password === 'string' ? body.password.replace(/[\s-]/g, '').toLowerCase() : '';
  const ok = given.length > 0 && safeEqual(await sha256Hex(given), env.ADMIN_HASH.toLowerCase());
  if (!ok) {
    await env.DB.put(rlKey, String(tries + 1), { expirationTtl: 600 });
    return fail(401, 'Passwort stimmt nicht.');
  }

  const sid = randomHex(32);
  await env.DB.put(`s:${sid}`, '1', { expirationTtl: SESSION_TTL });
  return json({ ok: true }, 200, {
    'set-cookie': `sid=${sid}; Path=/; Max-Age=${SESSION_TTL}; HttpOnly; Secure; SameSite=Strict`
  });
}

async function isAuthed(req: Request, env: Env): Promise<boolean> {
  const sid = getCookie(req, 'sid');
  return !!sid && /^[a-f0-9]{64}$/.test(sid) && (await env.DB.get(`s:${sid}`)) !== null;
}

function cleanString(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

async function saveMeta(req: Request, env: Env, id: string | null): Promise<Response> {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return fail(400, 'Ungültige Eingabe.');

  const existing = id ? await readTestimonial(env, id) : null;
  if (id && !existing) return fail(404, 'Bericht nicht gefunden.');

  const name = cleanString(body.name, 60);
  if (!name) return fail(400, 'Bitte einen Namen angeben.');

  const now = Date.now();
  const t: Testimonial = {
    id: existing?.id ?? randomHex(8),
    name,
    result: cleanString(body.result, 80),
    text: cleanString(body.text, 1200),
    consent: body.consent === true,
    consentNote: cleanString(body.consentNote, 200),
    published: body.published === true,
    hasBefore: existing?.hasBefore ?? false,
    hasAfter: existing?.hasAfter ?? false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };
  if (t.published && !t.consent) return fail(400, 'Veröffentlichen geht nur mit vorliegender Einwilligung.');
  if (t.published && !(t.hasBefore && t.hasAfter)) return fail(400, 'Zum Veröffentlichen fehlen Vorher- oder Nachher-Bild.');

  await env.DB.put(`t:${t.id}`, JSON.stringify(t));
  if (!existing) {
    const idx = await readIndex(env);
    await env.DB.put('idx', JSON.stringify([t.id, ...idx]));
  }
  return json(t);
}

async function saveImage(req: Request, env: Env, id: string, slot: Slot): Promise<Response> {
  const t = await readTestimonial(env, id);
  if (!t) return fail(404, 'Bericht nicht gefunden.');
  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim();
  if (!IMAGE_TYPES.includes(type)) return fail(415, 'Nur WebP, JPEG oder PNG erlaubt.');
  const data = await req.arrayBuffer();
  if (data.byteLength === 0 || data.byteLength > MAX_IMAGE_BYTES) return fail(413, 'Bild ist leer oder zu gross (max. 2,5 MB).');

  await env.DB.put(`img:${id}:${slot}`, data, { metadata: { type } });
  const updated: Testimonial = { ...t, [slot === 'before' ? 'hasBefore' : 'hasAfter']: true, updatedAt: Date.now() };
  await env.DB.put(`t:${id}`, JSON.stringify(updated));
  return json(updated);
}

async function remove(env: Env, id: string): Promise<Response> {
  const idx = await readIndex(env);
  await env.DB.put('idx', JSON.stringify(idx.filter((x) => x !== id)));
  await Promise.all([env.DB.delete(`t:${id}`), env.DB.delete(`img:${id}:before`), env.DB.delete(`img:${id}:after`)]);
  return json({ ok: true });
}

async function admin(req: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname.replace('/api/admin', '');
  if (path === '/login' && req.method === 'POST') return login(req, env);

  if (!(await isAuthed(req, env))) return fail(401, 'Nicht angemeldet.');
  const mutating = req.method !== 'GET' && req.method !== 'HEAD';
  if (mutating && req.headers.get('x-requested-with') !== 'fetch') return fail(403, 'Anfrage abgelehnt.');

  if (path === '/me' && req.method === 'GET') return json({ ok: true });
  if (path === '/logout' && req.method === 'POST') {
    const sid = getCookie(req, 'sid');
    if (sid) await env.DB.delete(`s:${sid}`);
    return json({ ok: true }, 200, { 'set-cookie': 'sid=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict' });
  }

  if (path === '/testimonials' && req.method === 'GET') {
    const ids = await readIndex(env);
    const all = await Promise.all(ids.map((id) => readTestimonial(env, id)));
    return json(all.filter((t): t is Testimonial => !!t).map((t) => ({ ...t, ...adminImageUrls(t) })));
  }
  if (path === '/testimonials' && req.method === 'POST') return saveMeta(req, env, null);

  const m = path.match(/^\/testimonials\/([a-f0-9]{16})(?:\/(before|after))?$/);
  if (m && ID_RE.test(m[1])) {
    const [, id, slot] = m;
    if (slot === 'before' || slot === 'after') {
      if (req.method === 'PUT') return saveImage(req, env, id, slot);
      if (req.method === 'GET') return serveImage(env, id, slot, 'private, no-store');
    } else {
      if (req.method === 'PUT') return saveMeta(req, env, id);
      if (req.method === 'DELETE') return remove(env, id);
    }
  }
  return fail(404, 'Unbekannte Anfrage.');
}

/* ---------- Einstieg ---------- */

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const p = url.pathname;
    try {
      if (p === '/api/testimonials' && req.method === 'GET') return await publicList(env);
      const img = p.match(/^\/img\/([a-f0-9]{16})\/(before|after)$/);
      if (img && req.method === 'GET') return await image(env, img[1], img[2] as Slot);
      if (p.startsWith('/api/admin/')) return await admin(req, env, url);
      if (p.startsWith('/api/')) return fail(404, 'Unbekannte Anfrage.');
      return await env.ASSETS.fetch(req);
    } catch (err) {
      console.error(err);
      return fail(500, 'Serverfehler. Bitte später erneut versuchen.');
    }
  }
} satisfies ExportedHandler<Env>;
