import { supabaseDB } from '../lib/supabase.js';
import { maquetas as localData } from '../data.js';

const clubAliases = {
    'Penarol': 'Peñarol',
};

const estadioAliases = {
    'Campeon del Siglo': 'Campeón del Siglo',
};

const normalizeEstadio = (name) => estadioAliases[name] ?? name;

const normalizeClub = (name) => clubAliases[name] ?? name;

const fromDB = (row) => ({
    id: row.id,
    estadio: normalizeEstadio(row.estadio),
    club: normalizeClub(row.club),
    escala: row.escala,
    precio: row.precio,
    stock: row.stock,
    edicion: row.edicion,
    material: row.material,
    descripcion: row.descripcion,
    imagen: row.imagen,
    galeria: Array.isArray(row.galeria) ? row.galeria : [],
    ...(Array.isArray(row.medidas) && row.medidas.length > 0 ? { medidas: row.medidas } : {}),
    destacado: row.destacado ?? false,
    referenciaPersonalizada: row.referencia_personalizada ?? false,
});

const toDB = (p) => ({
    estadio: p.estadio,
    club: p.club,
    escala: p.escala,
    precio: Number(p.precio) || 0,
    stock: Number(p.stock) || 0,
    edicion: p.edicion,
    material: p.material,
    descripcion: p.descripcion,
    imagen: p.imagen,
    galeria: Array.isArray(p.galeria) ? p.galeria : [],
    medidas: Array.isArray(p.medidas) && p.medidas.length > 0 ? p.medidas : null,
    destacado: p.destacado ?? false,
    referencia_personalizada: p.referenciaPersonalizada ?? false,
});

export const productsService = {
    async getAll() {
        try {
            const rows = await supabaseDB.getAll();
            if (Array.isArray(rows) && rows.length > 0) {
                return rows.map(fromDB);
            }
        } catch {
            // fallback silencioso
        }
        return localData;
    },

    async create(product) {
        const row = await supabaseDB.insert(toDB(product));
        return fromDB(row);
    },

    async update(id, product) {
        const row = await supabaseDB.update(id, toDB(product));
        return fromDB(row);
    },

    async delete(id) {
        return supabaseDB.delete(id);
    },
};
