const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
const SUPABASE_KEY = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  ?? import.meta.env.VITE_SUPABASE_ANON_KEY
  ?? ''
).trim();

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL
  && SUPABASE_KEY
  && !SUPABASE_URL.includes('your-project')
  && !SUPABASE_KEY.includes('your-publishable-key')
);

const SESSION_STORAGE_KEY = 'noteur.supabase.session';

function ensureConfiguration() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY pada environment variables.');
  }
}

function readStoredSession() {
  if (typeof window === 'undefined') return null;

  try {
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch {
    return null;
  }
}

function storeSession(session) {
  if (typeof window === 'undefined') return;

  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function getPublicHeaders(accessToken = SUPABASE_KEY) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

async function parseResponse(response) {
  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const message = payload?.msg
      ?? payload?.message
      ?? payload?.error_description
      ?? payload?.error
      ?? `Permintaan gagal (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return payload;
}

async function authRequest(path, body, accessToken = SUPABASE_KEY) {
  ensureConfiguration();

  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: getPublicHeaders(accessToken),
    body: JSON.stringify(body),
  });

  return parseResponse(response);
}

function createSession(payload, previousSession = null) {
  if (!payload?.access_token || !payload?.refresh_token) return null;

  const expiresIn = Number(payload.expires_in ?? 3600);
  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    token_type: payload.token_type ?? 'bearer',
    expires_in: expiresIn,
    expires_at: Number(payload.expires_at ?? (Math.floor(Date.now() / 1000) + expiresIn)),
    user: payload.user ?? previousSession?.user ?? null,
  };
}

async function refreshSession(session) {
  const payload = await authRequest('token?grant_type=refresh_token', {
    refresh_token: session.refresh_token,
  });

  const refreshedSession = createSession(payload, session);
  if (!refreshedSession) {
    storeSession(null);
    throw new Error('Sesi login berakhir. Silakan login kembali.');
  }

  storeSession(refreshedSession);
  return refreshedSession;
}

export async function getSavedSession() {
  if (!isSupabaseConfigured) return null;

  const session = readStoredSession();
  if (!session?.access_token || !session?.refresh_token) return null;

  const expiresAt = Number(session.expires_at ?? 0);
  if (expiresAt > Math.floor(Date.now() / 1000) + 60) {
    return session;
  }

  try {
    return await refreshSession(session);
  } catch {
    storeSession(null);
    return null;
  }
}

export async function signUpWithEmail(email, password) {
  const payload = await authRequest('signup', { email, password });
  const session = createSession(payload);

  if (session) storeSession(session);

  return {
    user: payload?.user ?? session?.user ?? null,
    session,
    confirmationRequired: !session,
  };
}

export async function signInWithEmail(email, password) {
  const payload = await authRequest('token?grant_type=password', { email, password });
  const session = createSession(payload);

  if (!session) {
    throw new Error('Login belum menghasilkan sesi. Periksa konfigurasi autentikasi Supabase.');
  }

  storeSession(session);
  return session;
}

export async function signOutFromSupabase() {
  const session = readStoredSession();

  try {
    if (session?.access_token && isSupabaseConfigured) {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: getPublicHeaders(session.access_token),
      });

      // A local sign-out should still complete if the remote session has expired.
      if (!response.ok && response.status !== 401) {
        await parseResponse(response);
      }
    }
  } finally {
    storeSession(null);
  }
}

async function requestNotesTable(query, options = {}) {
  ensureConfiguration();

  const session = await getSavedSession();
  if (!session?.access_token || !session?.user?.id) {
    throw new Error('Sesi login tidak tersedia. Silakan login kembali.');
  }

  const { method = 'GET', body, returnRepresentation = false } = options;
  const headers = getPublicHeaders(session.access_token);
  if (returnRepresentation) {
    headers.Prefer = 'return=representation';
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/notes${query}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  return parseResponse(response);
}

function mapDatabaseNote(row) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    archived: row.archived,
    createdAt: row.created_at,
  };
}

export async function fetchNotesFromDatabase() {
  const rows = await requestNotesTable(
    '?select=id,title,body,archived,created_at&order=created_at.desc'
  );

  return (rows ?? []).map(mapDatabaseNote);
}

export async function insertNoteIntoDatabase({ title, body }) {
  const session = await getSavedSession();

  if (!session?.user?.id) {
    throw new Error('Sesi login tidak tersedia. Silakan login kembali.');
  }

  const rows = await requestNotesTable('', {
    method: 'POST',
    returnRepresentation: true,
    body: {
      user_id: session.user.id,
      title,
      body,
      archived: false,
    },
  });

  if (!rows?.[0]) {
    throw new Error('Catatan tidak menerima respons dari database. Periksa tabel dan kebijakan RLS Supabase.');
  }

  return mapDatabaseNote(rows[0]);
}

export async function setDatabaseNoteArchived(id, archived) {
  const rows = await requestNotesTable(`?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    returnRepresentation: true,
    body: { archived },
  });

  if (!rows?.[0]) {
    throw new Error('Catatan tidak ditemukan atau kamu tidak memiliki izin untuk mengubahnya.');
  }

  return mapDatabaseNote(rows[0]);
}

export async function deleteNoteFromDatabase(id) {
  const rows = await requestNotesTable(`?id=eq.${encodeURIComponent(id)}&select=id`, {
    method: 'DELETE',
    returnRepresentation: true,
  });

  if (!rows?.length) {
    throw new Error('Catatan tidak ditemukan atau sudah dihapus.');
  }
}
