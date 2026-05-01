import { getProductDetailUrl } from '../utils/productLinks.js';
import { getDeferredImageAttrs } from '../utils/imageLoader.js';
import { initShowMore } from '../modules/showMore.js';

const createProductCard = (product) => {
    return `
    <article class="all-products__card">
        <button
            class="all-products__media-button"
            type="button"
            data-product-id="${product.id}"
            data-view-button
            aria-label="Ver detalle de ${product.estadio}"
        >
            <div class="all-products__media">
                <img
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                    data-src="${product.imagen}"
                    data-deferred-image
                    alt="Maqueta de ${product.estadio}"
                    loading="lazy" decoding="async">
            </div>
        </button>

        <div class="all-products__content">
            <div class="all-products__topline">
                <span class="all-products__club">${product.club}</span>
                <span class="all-products__edition">${product.edicion}</span>
            </div>

            <a
                class="all-products__title-button"
                href="${getProductDetailUrl(product.id)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir ficha de ${product.estadio} en una nueva pestaña"
            >
                <h3>${product.estadio}</h3>
            </a>

            <div class="all-products__details">
                <span>Escala ${product.escala}</span>
                <span>${product.material}</span>
            </div>

            <div class="all-products__meta">
                <span class="all-products__stock">Pedido personalizado</span>
            </div>

            <button
                class="all-products__button"
                type="button"
                data-product-id="${product.id}"
                data-add-button
            >
                Agregar
            </button>
        </div>
    </article>
`;
};

export const createAllProductsPreview = (products) => {
    const productsToShow = products.filter((product) => product.precio > 0 || product.referenciaPersonalizada);

    const section = document.createElement('section');
    section.className = 'all-products';
    section.id = 'todos-los-productos';

    section.innerHTML = `
        <div class="all-products__shell">
            <div class="all-products__heading">
                <p class="all-products__eyebrow">Todos los productos</p>
                <h2>Explorá más modelos del taller</h2>
                <p>
                    Descubrí todos los modelos disponibles.
                </p>
            </div>

            <div class="all-products__grid" data-products-grid>
                ${productsToShow.map(createProductCard).join('')}
            </div>
        </div>
    `;

    initShowMore(section, {
        batchSize: 10,
        showAllThreshold: 10,
        gridSelector: '[data-products-grid]',
        itemSelector: 'article',
        hiddenClass: 'is-hidden'
    });

    section.addEventListener('click', (event) => {
        const viewButton = event.target.closest('[data-view-button]');
        if (viewButton) {
            const productId = Number(viewButton.dataset.productId);
            const selectedProduct = products.find((product) => product.id === productId);
            if (!selectedProduct) return;

            section.dispatchEvent(new CustomEvent('catalog:view-product', {
                bubbles: true,
                detail: {
                    product: selectedProduct,
                    source: 'all-products'
                }
            }));
            return;
        }

        const addButton = event.target.closest('[data-add-button]');
        if (!addButton || addButton.disabled) return;

        const productId = Number(addButton.dataset.productId);
        const selectedProduct = products.find((product) => product.id === productId);
        if (!selectedProduct) return;

        section.dispatchEvent(new CustomEvent('catalog:add-product', {
            bubbles: true,
            detail: {
                product: selectedProduct
            }
        }));
    });

    return section;
};
