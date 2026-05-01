import { maquetas } from './data.js';
import { getIcon } from './utils/icons.js';
import { createWhatsAppFloat } from './components/whatsappFloat.js';
import { buildProductInquiryMessage, buildWhatsappUrl } from './utils/whatsapp.js';
import { createHeader } from './components/header.js';
import { createCartStore } from './store/cartStore.js';
import { createCartDropdownController } from './components/cartDropdown.js';
import { createSearchController } from './components/searchController.js';

const MIN_GALLERY_SLOTS = 6;
const DEFAULT_SIZE_OPTIONS = ['25 x 18 cm', '35 x 24 cm', '45 x 30 cm'];
const CUSTOM_SIZE_VALUE = '__custom__';

const getProductIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('id'));
};

const getSizeOptions = (product) => {
    if (Array.isArray(product.medidas) && product.medidas.length > 0) {
        return product.medidas;
    }
    return DEFAULT_SIZE_OPTIONS;
};

const getGalleryItems = (product) => {
    const images = Array.isArray(product.galeria) && product.galeria.length > 0
        ? product.galeria.filter(Boolean)
        : (product.imagen ? [product.imagen] : []);

    const totalSlots = Math.max(images.length, MIN_GALLERY_SLOTS);
    const galleryItems = images.map((src, index) => ({
        kind: 'image',
        src,
        label: `Vista ${index + 1}`
    }));

    while (galleryItems.length < totalSlots) {
        galleryItems.push({
            kind: 'placeholder',
            label: `Espacio para foto ${galleryItems.length + 1}`
        });
    }

    return galleryItems;
};

const getAvailabilityLabel = (product) => {
    if (product.referenciaPersonalizada) return 'Proyecto a pedido';
    return 'Disponible por pedido';
};

const getSelectionPayload = (size, customSize) => {
    const useCustomSize = size === CUSTOM_SIZE_VALUE;
    const selectedLabel = useCustomSize ? 'Medida personalizada' : size;
    return {
        medida: selectedLabel || 'A definir',
        medidaPersonalizada: useCustomSize ? customSize : ''
    };
};

const buildInquiryMessageWithSize = (product, size, customSize) => {
    const selection = getSelectionPayload(size, customSize);
    return buildProductInquiryMessage(product, selection);
};

const updateWhatsAppCta = (cta, product, size, customSize = '') => {
    if (!cta) return;

    const trimmedCustomSize = customSize.trim();
    const isCustomSize = size === CUSTOM_SIZE_VALUE;
    const isReady = !isCustomSize || Boolean(trimmedCustomSize);

    cta.href = buildWhatsappUrl(buildInquiryMessageWithSize(product, size, trimmedCustomSize));
    cta.classList.toggle('is-disabled', !isReady);
    cta.setAttribute('aria-disabled', String(!isReady));
    cta.tabIndex = isReady ? 0 : -1;
};

const renderGalleryItem = (item, index, isActive) => {
    if (item.kind === 'image') {
        return `
            <button
                class="product-detail__thumb ${isActive ? 'is-active' : ''}"
                type="button"
                data-gallery-index="${index}"
                aria-label="Ver ${item.label}"
            >
                <img src="${item.src}" alt="${item.label}" loading="lazy" decoding="async">
            </button>
        `;
    }

    return `
        <button
            class="product-detail__thumb product-detail__thumb--placeholder ${isActive ? 'is-active' : ''}"
            type="button"
            data-gallery-index="${index}"
            aria-label="${item.label}"
        >
            <span>${item.label}</span>
        </button>
    `;
};

const renderMainMedia = (item, product) => {
    if (item.kind === 'image') {
        return `
            <img class="product-detail__main-image" src="${item.src}" alt="Detalle de ${product.estadio}" loading="eager" decoding="async">
            <button class="product-detail__fullscreen" type="button" data-gallery-fullscreen aria-label="Ver imagen en pantalla completa">
                ${getIcon('fullscreen')}
            </button>
        `;
    }

    return `
        <div class="product-detail__main-placeholder">
            <span>Galeria en construccion</span>
            <strong>${item.label}</strong>
            <p>Aca vas a poder sumar nuevas fotos del producto cuando las tengas listas.</p>
        </div>
    `;
};

const renderProductPage = (product) => {
    const galleryItems = getGalleryItems(product);
    const root = document.getElementById('product-page-root');

    if (!root) return;

    root.innerHTML = `
        <section class="product-detail">
            <div class="product-detail__shell">
                <nav class="product-detail__breadcrumbs" aria-label="Navegacion secundaria">
                    <a href="./index.html">Inicio</a>
                    <span>/</span>
                    <a href="./index.html#todos-los-productos">Catalogo</a>
                    <span>/</span>
                    <strong>${product.estadio}</strong>
                </nav>

                <div class="product-detail__grid">
                    <div class="product-detail__gallery">
                        <div class="product-detail__main-media" data-gallery-main>
                            ${renderMainMedia(galleryItems[0], product)}
                        </div>

                        <div class="product-detail__thumbs" data-gallery-thumbs>
                            ${galleryItems.map((item, index) => renderGalleryItem(item, index, index === 0)).join('')}
                        </div>
                    </div>

                    <div class="product-detail__content">
                        <p class="product-detail__eyebrow">${product.club || 'Coleccion GEM'}</p>
                        <h1>${product.estadio}</h1>
                        <p class="product-detail__lead">
                            ${product.descripcion || 'Una pieza pensada para exhibicion, coleccion y regalo.'}
                        </p>

                        <div class="product-detail__chips">
                            <span>Escala ${product.escala || 'A definir'}</span>
                            <span>${product.material || 'Material a definir'}</span>
                            <span>${product.edicion || 'Edicion especial'}</span>
                        </div>

                        <div class="product-detail__summary">
                            <article>
                                <p>Disponibilidad</p>
                                <strong>${getAvailabilityLabel(product)}</strong>
                            </article>
                        </div>

                        <div class="product-detail__sizes" id="product-sizes">
                            <div class="product-detail__sizes-head">
                                <p>Elegí tu medida</p>
                                <small>Seleccioná una opción o pedí una medida personalizada.</small>
                            </div>
                            <div class="product-detail__size-options" data-size-options>
                                ${getSizeOptions(product).map((option, index) => `
                                    <label class="product-detail__size-option ${index === 0 ? 'is-selected' : ''}">
                                        <input type="radio" name="product-size" value="${option}" ${index === 0 ? 'checked' : ''}>
                                        <span>${option}</span>
                                    </label>
                                `).join('')}
                                <label class="product-detail__size-option">
                                    <input type="radio" name="product-size" value="${CUSTOM_SIZE_VALUE}">
                                    <span>Medida personalizada</span>
                                </label>
                            </div>
                            <label class="product-detail__custom-size" data-custom-size-wrap hidden>
                                <span>Especificá tu medida</span>
                                <input
                                    type="text"
                                    class="product-detail__custom-size-input"
                                    data-custom-size-input
                                    placeholder="Ej: 52 x 36 cm"
                                >
                            </label>
                        </div>

                        <div class="product-detail__actions">
                            <a
                                class="product-detail__cta product-detail__cta--primary"
                                id="whatsapp-cta"
                                href="${buildWhatsappUrl(buildProductInquiryMessage(product, { medida: getSizeOptions(product)[0], medidaPersonalizada: '' }))}"
                                target="_blank"
                                rel="noreferrer"
                            >
                                ${getIcon('whatsapp')}
                                <span>Consultar por WhatsApp</span>
                            </a>
                            <a class="product-detail__cta product-detail__cta--ghost" href="./index.html#todos-los-productos">
                                Volver al catalogo
                            </a>
                        </div>
                    </div>
                </div>

                <section class="product-detail__related">
                    <div class="product-detail__related-head">
                        <div>
                            <p class="product-detail__eyebrow">Segui explorando</p>
                            <h2>Volver al catalogo completo</h2>
                        </div>
                        <a href="./index.html#todos-los-productos">Ver todos los productos</a>
                    </div>
                </section>
            </div>
        </section>
    `;

    const mainMedia = root.querySelector('[data-gallery-main]');
    const thumbButtons = Array.from(root.querySelectorAll('[data-gallery-index]'));

    thumbButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextIndex = Number(button.dataset.galleryIndex);
            const item = galleryItems[nextIndex];
            if (!mainMedia || !item) return;

            mainMedia.innerHTML = renderMainMedia(item, product);
            thumbButtons.forEach((thumb) => thumb.classList.remove('is-active'));
            button.classList.add('is-active');
        });
    });

    root.addEventListener('click', (event) => {
        const fullscreenButton = event.target.closest('[data-gallery-fullscreen]');
        if (!fullscreenButton) return;

        const activeImage = root.querySelector('.product-detail__main-image');
        if (!activeImage) return;

        if (document.fullscreenElement) {
            document.exitFullscreen?.();
            return;
        }

        activeImage.requestFullscreen?.();
    });

    const updateSizeSelection = () => {
        const selectedRadio = root.querySelector('input[name="product-size"]:checked');
        const customSizeWrap = root.querySelector('[data-custom-size-wrap]');
        const customSizeInput = root.querySelector('[data-custom-size-input]');
        const whatsappCta = root.querySelector('#whatsapp-cta');

        if (!selectedRadio) return;

        const currentSize = selectedRadio.value;
        const showCustom = currentSize === CUSTOM_SIZE_VALUE;

        if (customSizeWrap) {
            customSizeWrap.hidden = !showCustom;
        }

        root.querySelectorAll('.product-detail__size-option').forEach((option) => {
            const radio = option.querySelector('input');
            if (radio) {
                option.classList.toggle('is-selected', radio.checked);
            }
        });

        if (customSizeInput && !showCustom) {
            customSizeInput.value = '';
        }

        const customSize = showCustom && customSizeInput ? customSizeInput.value : '';
        updateWhatsAppCta(whatsappCta, product, currentSize, customSize);
    };

    root.querySelectorAll('input[name="product-size"]').forEach((radio) => {
        radio.addEventListener('change', updateSizeSelection);
    });

    const customSizeInput = root.querySelector('[data-custom-size-input]');
    const whatsappCta = root.querySelector('#whatsapp-cta');

    customSizeInput?.addEventListener('focus', () => {
        const customRadio = root.querySelector(`input[name="product-size"][value="${CUSTOM_SIZE_VALUE}"]`);
        if (!customRadio || customRadio.checked) return;
        customRadio.checked = true;
        updateSizeSelection();
    });

    customSizeInput?.addEventListener('input', () => {
        const selectedRadio = root.querySelector('input[name="product-size"]:checked');
        if (!selectedRadio) return;

        updateWhatsAppCta(whatsappCta, product, selectedRadio.value, customSizeInput.value);
    });

    whatsappCta?.addEventListener('click', (event) => {
        if (whatsappCta.classList.contains('is-disabled')) {
            event.preventDefault();
        }
    });

    updateSizeSelection();
};

const renderNotFound = () => {
    const root = document.getElementById('product-page-root');

    if (!root) return;

    root.innerHTML = `
        <section class="product-detail product-detail--empty">
            <div class="product-detail__shell">
                <div class="product-detail__empty-state">
                    <p class="product-detail__eyebrow">Producto no encontrado</p>
                    <h1>No pudimos cargar esta ficha</h1>
                    <p>Revisa el enlace o volve al catalogo para elegir otro producto.</p>
                    <a class="product-detail__cta product-detail__cta--primary" href="./index.html#todos-los-productos">
                        Volver al catalogo
                    </a>
                </div>
            </div>
        </section>
    `;
};

const init = () => {
    const headerSection = document.getElementById('header-section');
    let cartStore = null;

    if (headerSection) {
        headerSection.appendChild(createHeader());
        cartStore = createCartStore(maquetas);

        const cartDropdown = createCartDropdownController(cartStore);
        const searchController = createSearchController(maquetas);

        const syncHeaderUI = () => {
            cartDropdown.render();
            document.dispatchEvent(new CustomEvent('cart:updated'));
        };

        cartStore.subscribe(syncHeaderUI);
        cartDropdown.bindEvents(() => searchController.close());
        searchController.bindEvents(() => cartDropdown.close());
        syncHeaderUI();
    }

    const productId = getProductIdFromUrl();
    const product = maquetas.find((item) => item.id === productId);

    document.body.appendChild(createWhatsAppFloat());

    if (!product) {
        document.title = 'Producto no encontrado | GEM Maquetas';
        renderNotFound();
        return;
    }

    document.title = `${product.estadio} | GEM Maquetas`;
    renderProductPage(product);

    const productCta = document.querySelector('.product-page__contact-link');
    if (productCta) {
        productCta.href = buildWhatsappUrl(buildProductInquiryMessage(product));
    }
};

document.addEventListener('DOMContentLoaded', init);
