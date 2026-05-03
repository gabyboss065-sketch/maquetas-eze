// Actualiza el campo `edicion` de cada producto en Supabase
// Uso: node scripts/push-ediciones.js <SERVICE_ROLE_KEY>

const SUPABASE_URL = 'https://rcsrjgdxqngewdvnkvfc.supabase.co';

const SERVICE_KEY = process.argv[2];
if (!SERVICE_KEY) {
    console.error('Uso: node scripts/push-ediciones.js <SERVICE_ROLE_KEY>');
    console.error('La service_role key está en: Supabase → Settings → API → service_role');
    process.exit(1);
}

const ediciones = [
    { id: 1,  edicion: 'La Doce Edition' },
    { id: 2,  edicion: 'Millonarios Edition' },
    { id: 3,  edicion: 'La Academia Edition' },
    { id: 4,  edicion: 'Rey de Copas Edition' },
    { id: 5,  edicion: 'Carbonero Edition' },
    { id: 6,  edicion: 'El Gallo Edition' },
    { id: 7,  edicion: 'El Pirata Edition' },
    { id: 8,  edicion: 'Edicion Boedo' },
    { id: 9,  edicion: 'El Tricolor Edition' },
    { id: 10, edicion: 'El Globo Edition' },
    { id: 11, edicion: 'El Verde Edition' },
    { id: 12, edicion: 'El Torito Edition' },
    { id: 13, edicion: 'El Bicho Edition' },
    { id: 14, edicion: 'El Celeste Edition' },
    { id: 18, edicion: 'Historia Millonaria' },
    { id: 19, edicion: 'El Fortin Edition' },
    { id: 21, edicion: 'El Calamar Edition' },
    { id: 22, edicion: 'El Taladro Edition' },
    { id: 23, edicion: 'La Lepra Edition' },
    { id: 24, edicion: 'El Cuervo Edition' },
    { id: 25, edicion: 'El Funebrero Edition' },
    { id: 26, edicion: 'Matador Edition' },
];

const headers = {
    'Content-Type': 'application/json',
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    Prefer: 'return=minimal',
};

async function pushEdiciones() {
    console.log(`Actualizando ${ediciones.length} productos en Supabase…\n`);

    let ok = 0;
    let fail = 0;

    for (const { id, edicion } of ediciones) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/productos?id=eq.${id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ edicion }),
        });

        if (res.ok) {
            console.log(`✓ id ${id} → "${edicion}"`);
            ok++;
        } else {
            const err = await res.text();
            console.error(`✗ id ${id} → HTTP ${res.status}: ${err}`);
            fail++;
        }
    }

    console.log(`\n${ok} actualizados, ${fail} errores.`);
    if (fail > 0) process.exit(1);
}

pushEdiciones().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
