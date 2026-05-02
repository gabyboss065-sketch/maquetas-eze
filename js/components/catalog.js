import { getIcon } from '../utils/icons.js';

const topSellerClubs = ['Boca Juniors', 'River Plate', 'Racing Club', 'Independiente'];

const bestSellsImages = {
    'Boca Juniors':  'assets/img/best-sells/boca_best_sells.webp',
    'River Plate':   'assets/img/best-sells/river_best_sells.webp',
    'Racing Club':   'assets/img/best-sells/racing_best_sells.webp',
    'Independiente': 'assets/img/best-sells/independiente_best_sells.webp',
};

const editionIconMap = {
    'Edicion Club':       'badge-star',
    'Serie Arquitectura': 'badge-building',
    'Hincha Edition':     'badge-heart',
    'Rojo Legendario':    'badge-flame',
};

const createLightbox = () => {
    const el = document.createElement('div');
    el.className = 'product-lightbox';
    el.innerHTML = `
        <button class="product-lightbox__close" type="button" aria-label="Cerrar">
            ${getIcon('close')}
        </button>
        <img class="product-lightbox__img" src="" alt="">
    `;

    const img = el.querySelector('.product-lightbox__img');
    const closeBtn = el.querySelector('.product-lightbox__close');

    const close = () => {
        el.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    const open = (src, alt) => {
        img.src = src;
        img.alt = alt;
        el.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    closeBtn.addEventListener('click', close);
    el.addEventListener('click', (e) => { if (e.target === el) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    document.body.appendChild(el);
    return { open };
};

const createProductCard = (product, index) => {
    const image = bestSellsImages[product.club] ?? product.imagen;
    const badgeIcon = getIcon(editionIconMap[product.edicion] ?? 'badge-star');
    const eager = index < 2;

    return `
    <article
        class="product-card"
        data-product-id="${product.id}"
        data-expand-button
        data-image="${product.imagen}"
        data-alt="${product.estadio}"
        aria-label="Ver imagen de ${product.estadio}"
    >
        <img
            ${eager ? `src="${image}" loading="eager" fetchpriority="high"` : `src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-src="${image}" data-deferred-image loading="lazy" fetchpriority="low"`}
            alt="Maqueta de ${product.estadio}"
            decoding="async"
        >

        <div class="product-card__badge">
            ${badgeIcon}
            ${product.edicion}
        </div>

        <div class="product-card__overlay">
            <p class="product-card__club">${product.club}</p>
            <h3 class="product-card__name">${product.estadio}</h3>
            <div class="product-card__footer">
                <span class="product-card__scale">
                    ${getIcon('scale')}
                    Escala ${product.escala}
                </span>
                <button
                    class="product-card__cart-btn"
                    type="button"
                    data-product-id="${product.id}"
                    data-add-button
                    aria-label="Agregar ${product.estadio} a la consulta"
                >
                    ${getIcon('cart')}
                </button>
            </div>
        </div>

        <div class="product-card__hover-actions">
            <button
                class="product-card__expand-btn"
                type="button"
                data-expand-button
                data-image="${product.imagen}"
                data-alt="${product.estadio}"
                aria-label="Ver imagen de ${product.estadio}"
            >
                ${getIcon('fullscreen')}
            </button>
            <button
                class="product-card__cart-btn"
                type="button"
                data-product-id="${product.id}"
                data-add-button
                aria-label="Agregar ${product.estadio} a la consulta"
            >
                ${getIcon('cart')}
            </button>
        </div>
    </article>
`;
};

export const createCatalog = (products) => {
    const topSellers = products.filter((product) => topSellerClubs.includes(product.club));
    const orderedTopSellers = topSellerClubs
        .map((club) => topSellers.find((product) => product.club === club))
        .filter(Boolean);

    const lightbox = createLightbox();

    const section = document.createElement('section');
    section.className = 'catalog';
    section.id = 'catalogo';

    section.innerHTML = `
        <div class="catalog__shell">
            <div class="catalog__intro">
                <p class="catalog__eyebrow">Más Vendidos</p>
                <div class="catalog__heading">
                    <h2>Nuestros modelos más vendidos<span style="color:#f5d76e">.</span></h2>
                </div>
            </div>

            <div class="catalog__grid">
                ${orderedTopSellers.map((product, index) => createProductCard(product, index)).join('')}
            </div>
        </div>
    `;

    section.addEventListener('click', (event) => {
        const addButton = event.target.closest('[data-add-button]');
        if (addButton) {
            if (addButton.disabled) return;
            const productId = Number(addButton.dataset.productId);
            const selectedProduct = products.find((p) => p.id === productId);
            if (!selectedProduct) return;
            section.dispatchEvent(new CustomEvent('catalog:add-product', {
                bubbles: true,
                detail: { product: selectedProduct }
            }));
            return;
        }

        const expandButton = event.target.closest('[data-expand-button]');
        if (expandButton) {
            lightbox.open(expandButton.dataset.image, `Maqueta de ${expandButton.dataset.alt}`);
            return;
        }
    });

    return section;
};
