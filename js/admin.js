import { supabaseAuth, supabaseDB, supabaseStorage } from './lib/supabase.js';

const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>`;
const ICON_DELETE = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

// ── STATE ────────────────────────────────────────────────────────
let products     = [];
let editingId    = null;
let pendingDeleteId = null;
let galleryItems = []; // { url: string }

// ── DOM ───────────────────────────────────────────────────────────
const loginScreen   = document.getElementById('login-screen');
const dashboard     = document.getElementById('dashboard');
const loginForm     = document.getElementById('login-form');
const loginError    = document.getElementById('login-error');
const loginBtn      = document.getElementById('login-btn');
const adminEmail    = document.getElementById('admin-email');
const logoutBtn     = document.getElementById('logout-btn');
const searchInput   = document.getElementById('search');
const addBtn        = document.getElementById('add-btn');
const productsBody  = document.getElementById('products-body');

const formModal   = document.getElementById('form-modal');
const formTitle   = document.getElementById('form-title');
const productForm = document.getElementById('product-form');
const formError   = document.getElementById('form-error');
const formSubmit  = document.getElementById('form-submit');
const formClose   = document.getElementById('form-close');
const formCancel  = document.getElementById('form-cancel');

const confirmModal  = document.getElementById('confirm-modal');
const confirmText   = document.getElementById('confirm-text');
const confirmOk     = document.getElementById('confirm-ok');
const confirmCancel = document.getElementById('confirm-cancel');

const toast = document.getElementById('toast');

// ── TOAST ─────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.className = type;
    toastTimer = setTimeout(() => { toast.className = 'hidden'; }, 3500);
}

// ── AUTH ──────────────────────────────────────────────────────────
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Ingresando…';

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const data     = await supabaseAuth.signIn(email, password);

    if (data.access_token) {
        adminEmail.textContent = email;
        showDashboard();
        loadProducts();
    } else {
        loginError.textContent = data.error_description || data.msg || 'Credenciales incorrectas.';
        loginError.classList.remove('hidden');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Ingresar';
    }
});

logoutBtn.addEventListener('click', async () => {
    await supabaseAuth.signOut();
    dashboard.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    document.getElementById('password').value = '';
    loginBtn.disabled = false;
    loginBtn.textContent = 'Ingresar';
});

function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
}

// ── INIT ──────────────────────────────────────────────────────────
if (supabaseAuth.restore()) {
    try {
        const token   = sessionStorage.getItem('sb_token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        adminEmail.textContent = payload.email || '';
    } catch {}
    showDashboard();
    loadProducts();
}

// ── LOAD PRODUCTS ─────────────────────────────────────────────────
async function loadProducts() {
    productsBody.innerHTML = '<tr class="empty-row"><td colspan="8">Cargando…</td></tr>';
    try {
        const rows = await supabaseDB.getAll();
        products = rows.map(fromDB);
        renderTable(products);
        renderStats(products);
    } catch (err) {
        productsBody.innerHTML = `<tr class="empty-row"><td colspan="8">Error: ${err.message}</td></tr>`;
    }
}

// ── MAPPING ───────────────────────────────────────────────────────
function fromDB(row) {
    return {
        id:                    row.id,
        estadio:               row.estadio,
        club:                  row.club,
        escala:                row.escala,
        precio:                row.precio,
        stock:                 row.stock,
        edicion:               row.edicion,
        material:              row.material,
        descripcion:           row.descripcion,
        imagen:                row.imagen,
        galeria:               Array.isArray(row.galeria) ? row.galeria : [],
        medidas:               Array.isArray(row.medidas) ? row.medidas : [],
        destacado:             row.destacado ?? false,
        referenciaPersonalizada: row.referencia_personalizada ?? false,
    };
}

function toDB(p) {
    return {
        estadio:               p.estadio,
        club:                  p.club,
        escala:                p.escala,
        precio:                Number(p.precio) || 0,
        stock:                 Number(p.stock) || 0,
        edicion:               p.edicion,
        material:              p.material,
        descripcion:           p.descripcion,
        imagen:                p.imagen,
        galeria:               p.galeria,
        medidas:               p.medidas.length > 0 ? p.medidas : null,
        destacado:             p.destacado,
        referencia_personalizada: p.referenciaPersonalizada,
    };
}

// ── STATS ─────────────────────────────────────────────────────────
function renderStats(list) {
    document.getElementById('stat-total').textContent   = list.length;
    document.getElementById('stat-stock').textContent   = list.filter(p => p.stock > 0).length;
    document.getElementById('stat-nostock').textContent = list.filter(p => p.stock === 0 && !p.referenciaPersonalizada).length;
    document.getElementById('stat-custom').textContent  = list.filter(p => p.referenciaPersonalizada).length;
}

// ── TABLE ─────────────────────────────────────────────────────────
function renderTable(list) {
    if (!list.length) {
        productsBody.innerHTML = '<tr class="empty-row"><td colspan="8">No hay productos.</td></tr>';
        return;
    }
    productsBody.innerHTML = list.map(p => {
        const stockBadge = p.referenciaPersonalizada
            ? '<span class="badge badge-blue">Personalizado</span>'
            : p.stock > 0
                ? `<span class="badge badge-green">${p.stock} en stock</span>`
                : '<span class="badge badge-red">Sin stock</span>';

        const precio = p.precio > 0
            ? `$${p.precio.toLocaleString('es-AR')}`
            : '<span class="text-muted">—</span>';

        const estadoBadge = p.destacado
            ? '<span class="badge badge-yellow">Destacado</span>'
            : '<span class="text-muted">—</span>';

        const img = p.imagen
            ? `<img src="${p.imagen}" alt="" class="product-thumb" loading="lazy" onerror="this.style.display='none'">`
            : '<div class="product-thumb" style="background:var(--surface2)"></div>';

        return `<tr data-id="${p.id}">
            <td>${img}</td>
            <td>
                <div class="product-name">${p.estadio}</div>
                <div class="product-club">${p.club}</div>
            </td>
            <td class="nowrap">${p.escala}</td>
            <td class="nowrap">${precio}</td>
            <td>${stockBadge}</td>
            <td class="text-muted" style="font-size:12px">${p.edicion}</td>
            <td>${estadoBadge}</td>
            <td>
                <div class="actions">
                    <button class="btn-icon edit-btn"   data-id="${p.id}" title="Editar">${ICON_EDIT}</button>
                    <button class="btn-icon danger delete-btn" data-id="${p.id}" title="Eliminar">${ICON_DELETE}</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    renderTable(q
        ? products.filter(p =>
            p.estadio.toLowerCase().includes(q) ||
            p.club.toLowerCase().includes(q) ||
            p.edicion.toLowerCase().includes(q))
        : products);
});

productsBody.addEventListener('click', (e) => {
    const edit = e.target.closest('.edit-btn');
    const del  = e.target.closest('.delete-btn');
    if (edit) openEditForm(Number(edit.dataset.id));
    if (del)  openConfirm(Number(del.dataset.id));
});

addBtn.addEventListener('click', openAddForm);
document.getElementById('fab-add').addEventListener('click', openAddForm);

// ── FORM ──────────────────────────────────────────────────────────
function openAddForm() {
    editingId = null;
    formTitle.textContent = 'Agregar producto';
    productForm.reset();
    galleryItems = [];
    setImagenPreview('');
    renderGallery();
    hideFormError();
    formModal.classList.remove('hidden');
}

function openEditForm(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingId = id;
    formTitle.textContent = 'Editar producto';
    hideFormError();

    document.getElementById('f-estadio').value     = p.estadio;
    document.getElementById('f-club').value        = p.club;
    document.getElementById('f-escala').value      = p.escala;
    document.getElementById('f-edicion').value     = p.edicion;
    document.getElementById('f-precio').value      = p.precio;
    document.getElementById('f-stock').value       = p.stock;
    document.getElementById('f-material').value    = p.material;
    document.getElementById('f-descripcion').value = p.descripcion;
    document.getElementById('f-imagen').value      = p.imagen;
    document.getElementById('f-medidas').value     = p.medidas.join('\n');
    document.getElementById('f-destacado').checked      = p.destacado;
    document.getElementById('f-personalizado').checked  = p.referenciaPersonalizada;

    setImagenPreview(p.imagen);
    galleryItems = p.galeria.map(url => ({ url }));
    renderGallery();

    formModal.classList.remove('hidden');
}

function closeForm() {
    formModal.classList.add('hidden');
    editingId = null;
}

formClose.addEventListener('click', closeForm);
formCancel.addEventListener('click', closeForm);
formModal.addEventListener('click', (e) => { if (e.target === formModal) closeForm(); });

function hideFormError() {
    formError.classList.add('hidden');
    formError.textContent = '';
}
function showFormError(msg) {
    formError.textContent = msg;
    formError.classList.remove('hidden');
}

// ── IMAGE PRINCIPAL UPLOAD ────────────────────────────────────────
const imagenFileInput    = document.getElementById('imagen-file');
const imagenUploadBtn    = document.getElementById('imagen-upload-btn');
const imagenUploading    = document.getElementById('imagen-uploading');
const imagenInput        = document.getElementById('f-imagen');
const imagenPreview      = document.getElementById('imagen-preview');
const imagenPlaceholder  = document.getElementById('imagen-placeholder');

imagenUploadBtn.addEventListener('click', () => imagenFileInput.click());

imagenFileInput.addEventListener('change', async () => {
    const file = imagenFileInput.files[0];
    if (!file) return;

    const estadio = document.getElementById('f-estadio').value.trim() || 'producto';
    const club    = document.getElementById('f-club').value.trim()    || 'club';

    imagenUploadBtn.disabled = true;
    imagenUploading.classList.remove('hidden');

    try {
        const path = supabaseStorage.buildPath(estadio, club, file, '-cover');
        const url  = await supabaseStorage.upload(file, path);
        imagenInput.value = url;
        setImagenPreview(url);
        showToast('Imagen subida correctamente.');
    } catch (err) {
        showToast(`Error al subir imagen: ${err.message}`, 'error');
    } finally {
        imagenUploadBtn.disabled = false;
        imagenUploading.classList.add('hidden');
        imagenFileInput.value = '';
    }
});

imagenInput.addEventListener('input', () => setImagenPreview(imagenInput.value));

function setImagenPreview(url) {
    if (url) {
        imagenPreview.src = url;
        imagenPreview.classList.remove('hidden');
        imagenPlaceholder.classList.add('hidden');
    } else {
        imagenPreview.src = '';
        imagenPreview.classList.add('hidden');
        imagenPlaceholder.classList.remove('hidden');
    }
}

// ── GALLERY UPLOAD ────────────────────────────────────────────────
const galeriaFilesInput  = document.getElementById('galeria-files');
const galeriaUploadBtn   = document.getElementById('galeria-upload-btn');
const galeriaUploading   = document.getElementById('galeria-uploading');
const galeriaGrid        = document.getElementById('galeria-grid');

galeriaUploadBtn.addEventListener('click', () => galeriaFilesInput.click());

galeriaFilesInput.addEventListener('change', async () => {
    const files = Array.from(galeriaFilesInput.files);
    if (!files.length) return;

    const estadio = document.getElementById('f-estadio').value.trim() || 'producto';
    const club    = document.getElementById('f-club').value.trim()    || 'club';

    galeriaUploadBtn.disabled = true;
    galeriaUploading.classList.remove('hidden');
    galeriaUploading.textContent = `Subiendo 0 / ${files.length}…`;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const idx  = galleryItems.length;

        // Placeholder mientras sube
        galleryItems.push({ url: '' });
        renderGallery();

        try {
            const path = supabaseStorage.buildPath(estadio, club, file, `-gallery-${idx}`);
            const url  = await supabaseStorage.upload(file, path);
            galleryItems[galleryItems.length - 1].url = url;
            galeriaUploading.textContent = `Subiendo ${i + 1} / ${files.length}…`;
        } catch (err) {
            galleryItems.pop();
            showToast(`Error al subir foto ${i + 1}: ${err.message}`, 'error');
        }
        renderGallery();
    }

    galeriaUploadBtn.disabled = false;
    galeriaUploading.classList.add('hidden');
    galeriaFilesInput.value = '';
    showToast('Fotos de galería subidas.');
});

function renderGallery() {
    galeriaGrid.innerHTML = galleryItems.map((item, i) => {
        if (!item.url) {
            return `<div class="gallery-thumb uploading"></div>`;
        }
        return `<div class="gallery-thumb">
            <img src="${item.url}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <button type="button" class="gallery-remove" data-idx="${i}" title="Quitar">✕</button>
        </div>`;
    }).join('');
}

galeriaGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.gallery-remove');
    if (!btn) return;
    galleryItems.splice(Number(btn.dataset.idx), 1);
    renderGallery();
});

// ── FORM SUBMIT ───────────────────────────────────────────────────
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormError();
    formSubmit.disabled = true;
    formSubmit.textContent = 'Guardando…';

    const medidasRaw = document.getElementById('f-medidas').value;

    const product = {
        estadio:               document.getElementById('f-estadio').value.trim(),
        club:                  document.getElementById('f-club').value.trim(),
        escala:                document.getElementById('f-escala').value.trim(),
        edicion:               document.getElementById('f-edicion').value.trim(),
        precio:                document.getElementById('f-precio').value,
        stock:                 document.getElementById('f-stock').value,
        material:              document.getElementById('f-material').value.trim(),
        descripcion:           document.getElementById('f-descripcion').value.trim(),
        imagen:                document.getElementById('f-imagen').value.trim(),
        galeria:               galleryItems.filter(i => i.url).map(i => i.url),
        medidas:               medidasRaw.split('\n').map(s => s.trim()).filter(Boolean),
        destacado:             document.getElementById('f-destacado').checked,
        referenciaPersonalizada: document.getElementById('f-personalizado').checked,
    };

    try {
        if (editingId) {
            const updated = await supabaseDB.update(editingId, toDB(product));
            const idx = products.findIndex(p => p.id === editingId);
            if (idx !== -1) products[idx] = fromDB(updated);
            showToast('Producto actualizado.');
        } else {
            const created = await supabaseDB.insert(toDB(product));
            products.push(fromDB(created));
            showToast('Producto agregado.');
        }
        renderTable(products);
        renderStats(products);
        closeForm();
    } catch (err) {
        showFormError(`Error: ${err.message}`);
    } finally {
        formSubmit.disabled = false;
        formSubmit.textContent = 'Guardar';
    }
});

// ── DELETE ────────────────────────────────────────────────────────
function openConfirm(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    pendingDeleteId = id;
    confirmText.textContent = `¿Seguro que querés eliminar "${p.estadio} (${p.club})"? Esta acción no se puede deshacer.`;
    confirmModal.classList.remove('hidden');
}

function closeConfirm() {
    confirmModal.classList.add('hidden');
    pendingDeleteId = null;
}

confirmCancel.addEventListener('click', closeConfirm);
confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) closeConfirm(); });

confirmOk.addEventListener('click', async () => {
    if (!pendingDeleteId) return;
    confirmOk.disabled = true;
    confirmOk.textContent = 'Eliminando…';

    const ok = await supabaseDB.delete(pendingDeleteId);
    if (ok) {
        products = products.filter(p => p.id !== pendingDeleteId);
        renderTable(products);
        renderStats(products);
        showToast('Producto eliminado.');
    } else {
        showToast('Error al eliminar.', 'error');
    }

    confirmOk.disabled = false;
    confirmOk.textContent = 'Eliminar';
    closeConfirm();
});

// ── KEYBOARD ──────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeForm();
    closeConfirm();
});
