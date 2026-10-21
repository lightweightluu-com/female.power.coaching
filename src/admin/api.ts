export interface AdminTestimonial {
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
  before: string | null;
  after: string | null;
}

export type MetaInput = Pick<AdminTestimonial, 'name' | 'result' | 'text' | 'consent' | 'consentNote' | 'published'>;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      credentials: 'same-origin',
      ...init,
      headers: { 'x-requested-with': 'fetch', ...init.headers }
    });
  } catch {
    throw new ApiError(0, 'Keine Verbindung. Bitte Internet prüfen und erneut versuchen.');
  }
  if (!res.ok) {
    let message = 'Etwas ist schiefgelaufen. Bitte erneut versuchen.';
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* Standardmeldung */
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
});

export const api = {
  me: () => request<{ ok: true }>('/api/admin/me'),
  login: (password: string) => request<{ ok: true }>('/api/admin/login', jsonInit('POST', { password })),
  logout: () => request<{ ok: true }>('/api/admin/logout', { method: 'POST' }),
  list: () => request<AdminTestimonial[]>('/api/admin/testimonials'),
  create: (meta: MetaInput) => request<AdminTestimonial>('/api/admin/testimonials', jsonInit('POST', meta)),
  update: (id: string, meta: MetaInput) => request<AdminTestimonial>(`/api/admin/testimonials/${id}`, jsonInit('PUT', meta)),
  remove: (id: string) => request<{ ok: true }>(`/api/admin/testimonials/${id}`, { method: 'DELETE' }),
  uploadImage: (id: string, slot: 'before' | 'after', blob: Blob) =>
    request<AdminTestimonial>(`/api/admin/testimonials/${id}/${slot}`, {
      method: 'PUT',
      headers: { 'content-type': blob.type },
      body: blob
    })
};
