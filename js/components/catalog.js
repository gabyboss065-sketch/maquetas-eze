import { getIcon } from '../utils/icons.js';
import { getProductDetailUrl } from '../utils/productLinks.js';
import { getDeferredImageAttrs } from '../utils/imageLoader.js';

const topSellerClubs = ['Boca Juniors', 'River Plate', 'Racing Club', 'Independiente'];

const getHoverSrc = (product) => {
    const cover = product.imagen;
    const coverFile = cover?.split('/').pop()?.split('?')[0] ?? '';
    const extras = Array.isArray(product.galeria)
        ? product.galeria.filter(src => src && src !== cover && src.split('/').pop()?.split('?')[0] !== coverFile)
        : [];
    return extras[0] || '';
};

const createProductCard = (product, index) => {
    const hoverSrc = getHoverSrc(product);
    const eager = index < 2;
    return `
    <article class="product-card">
        <div class="product-card__media${hoverSrc ? ' has-hover' : ''}">
            <img class="product-card__img-primary"
                ${eager ? `src="${product.imagen}" loading="eager" fetchpriority="high"` : `src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-src="${product.imagen}" data-deferred-image loading="lazy" fetchpriority="low"`}
                alt="Maqueta de ${product.estadio}" decoding="async">
            ${hoverSrc ? `<img class="product-card__img-hover"
                src="${hoverSrc}"
                alt=""
                aria-hidden="true"
                loading="lazy" decoding="async">` : ''}
            <span class="product-card__badge">${product.edicion}</span>
        </div>

        <div class="product-card__content">
            <div class="product-card__meta">
                <p class="product-card__club">${product.club}</p>
                <p class="product-card__scale">Escala ${product.escala}</p>
            </div>

            <a
                class="product-card__title-link"
                href="${getProductDetailUrl(product.id)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir ficha de ${product.estadio} en una nueva pestaña"
            >
                <h3>${product.estadio}</h3>
            </a>
            <p class="product-card__description">${product.descripcion}</p>

            <div class="product-card__details">
                <span>${product.material}</span>
                <span>Pedido personalizado</span>
            </div>

            <div class="product-card__footer">
                <div class="product-card__actions">
                    <button
                        class="product-card__button"
                        type="button"
                        data-product-id="${product.id}"
                        data-add-button
                    >
                        Agregar
                    </button>
                    <button
                        class="product-card__button product-card__button--view"
                        type="button"
                        data-product-id="${product.id}"
                        data-view-button
                        aria-label="Ver detalle de ${product.estadio}"
                    >
                        ${getIcon('eye')}
                        <span>VER</span>
                    </button>
                </div>
            </div>
        </div>
    </article>
`;
};

export const createCatalog = (products) => {
    const topSellers = products.filter((product) => topSellerClubs.includes(product.club));
    const orderedTopSellers = topSellerClubs
        .map((club) => topSellers.find((product) => product.club === club))
        .filter(Boolean);

    const section = document.createElement('section');
    section.className = 'catalog';
    section.id = 'catalogo';

    section.innerHTML = `
        <div class="catalog__shell">
            <div class="catalog__intro">
                <p class="catalog__eyebrow">Más Vendidos</p>
                <div class="catalog__heading">
                    <div>
                        <h2>Las maquetas que más salen del taller</h2>
                        <p>
                            Una selección con los cuatro estadios más pedidos por los coleccionistas:
                            Boca, River, Racing e Independiente.
                        </p>
                    </div>
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
            const selectedProduct = products.find((product) => product.id === productId);
            if (!selectedProduct) return;

            section.dispatchEvent(new CustomEvent('catalog:add-product', {
                bubbles: true,
                detail: {
                    product: selectedProduct
                }
            }));
            return;
        }

        const viewButton = event.target.closest('[data-view-button]');
        if (!viewButton) return;

        const productId = Number(viewButton.dataset.productId);
        const selectedProduct = products.find((product) => product.id === productId);
        if (!selectedProduct) return;

        section.dispatchEvent(new CustomEvent('catalog:view-product', {
            bubbles: true,
            detail: {
                product: selectedProduct
            }
        }));
    });

    return section;
};
