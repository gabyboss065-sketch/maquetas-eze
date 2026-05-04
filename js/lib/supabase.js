// Reemplazá estos valores con los de tu proyecto en Supabase → Settings → API
export const SUPABASE_URL = 'https://rcsrjgdxqngewdvnkvfc.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_p6qwqtM1GLPaFgSfaYoKWg_Zq3ew7y7';

let authToken = SUPABASE_ANON_KEY;

const headers = (extra = {}) => ({
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${authToken}`,
    ...extra,
});

export const supabaseAuth = {
    async signIn(email, password) {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.access_token) {
            authToken = data.access_token;
            localStorage.setItem('sb_token', data.access_token);
        }
        return data;
    },

    async signOut() {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
            method: 'POST',
            headers: headers(),
        }).catch(() => {});
        authToken = SUPABASE_ANON_KEY;
        localStorage.removeItem('sb_token');
    },

    restore() {
        const token = localStorage.getItem('sb_token');
        if (token) authToken = token;
        return !!token;
    },

    isAuthenticated() {
        return !!localStorage.getItem('sb_token');
    },
};

const DIACRITICS = /\p{M}/gu;
const slugify = (str) =>
    str.toLowerCase()
       .normalize('NFD').replace(DIACRITICS, '')
       .replace(/[^a-z0-9]+/g, '-')
       .replace(/^-|-$/g, '');

export const supabaseStorage = {
    BUCKET: 'productos',

    buildPath(estadio, club, file, suffix = '') {
        const ext = file.name.split('.').pop().toLowerCase();
        const base = `${slugify(club)}/${slugify(estadio)}`;
        return `${base}/${Date.now()}${suffix}.${ext}`;
    },

    async upload(file, path) {
        const res = await fetch(
            `${SUPABASE_URL}/storage/v1/object/${this.BUCKET}/${path}`,
            {
                method: 'POST',
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': file.type,
                    'x-upsert': 'true',
                },
                body: file,
            }
        );
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Storage ${res.status}`);
        }
        return this.publicUrl(path);
    },

    publicUrl(path) {
        return `${SUPABASE_URL}/storage/v1/object/public/${this.BUCKET}/${path}`;
    },
};

export const supabaseDB = {
    async getAll() {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/productos?order=id`, {
            headers: headers(),
        });
        if (!res.ok) throw new Error(`Supabase ${res.status}`);
        return res.json();
    },

    async insert(data) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/productos`, {
            method: 'POST',
            headers: headers({ Prefer: 'return=representation' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Supabase ${res.status}`);
        }
        const rows = await res.json();
        return rows[0];
    },

    async update(id, data) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/productos?id=eq.${id}`, {
            method: 'PATCH',
            headers: headers({ Prefer: 'return=representation' }),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Supabase ${res.status}`);
        }
        const rows = await res.json();
        return rows[0];
    },

    async delete(id) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/productos?id=eq.${id}`, {
            method: 'DELETE',
            headers: headers(),
        });
        return res.ok;
    },
};
