// Sincroniza los productos de Supabase → js/data.js
// Uso: node scripts/sync-data.js

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const SUPABASE_URL     = 'https://rcsrjgdxqngewdvnkvfc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_p6qwqtM1GLPaFgSfaYoKWg_Zq3ew7y7';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dir, '..', 'js', 'data.js');

async function sync() {
    console.log('Conectando a Supabase…');

    const res = await fetch(`${SUPABASE_URL}/rest/v1/productos?order=id`, {
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

    const rows = await res.json();

    const maquetas = rows.map((row) => {
        const product = {
            id:          row.id,
            estadio:     row.estadio,
            club:        row.club,
            escala:      row.escala,
            precio:      row.precio,
            stock:       row.stock,
            edicion:     row.edicion,
            material:    row.material,
            descripcion: row.descripcion,
            imagen:      row.imagen,
            galeria:     row.galeria ?? [],
        };
        if (Array.isArray(row.medidas) && row.medidas.length > 0) product.medidas = row.medidas;
        if (row.destacado)              product.destacado = true;
        if (row.referencia_personalizada) product.referenciaPersonalizada = true;
        return product;
    });

    const content = `export const maquetas = ${JSON.stringify(maquetas, null, 4)};\n`;
    writeFileSync(OUTPUT, content, 'utf-8');

    console.log(`✓ data.js actualizado con ${maquetas.length} productos`);
}

sync().catch((err) => {
    console.error('✗ Error:', err.message);
    process.exit(1);
});
