import { productsService } from './services/productsService.js';
import { getIcon } from './utils/icons.js';
import { createWhatsAppFloat } from './components/whatsappFloat.js';
import { buildProductInquiryMessage, buildWhatsappUrl } from './utils/whatsapp.js';
import { createHeader } from './components/header.js';
import { createCartStore } from './store/cartStore.js';
import { createCartDropdownController } from './components/cartDropdown.js';
import { createSearchController } from './components/searchController.js';
import { slugify } from './utils/productLinks.js';

const MIN_GALLERY_SLOTS = 6;
const DEFAULT_SIZE_OPTIONS = ['60 x 50 cm', '70 x 60 cm', '1 metro x 80 cm'];
const CUSTOM_SIZE_VALUE = '__custom__';

const getSlugFromUrl = () => {
    const parts = window.location.pathname.replace(/\/$/, '').split('/');
    return parts[parts.length - 1];
};

const findProductBySlug = (products, slug) =>
    products.find((p) => slugify(p.estadio) === slug);

const getSizeOptions = (product) => {
    if (Array.isArray(product.medidas) && product.medidas.length > 0) {
        return product.medidas;
    }
    return DEFAULT_SIZE_OPTIONS;
};

const filename = (url) => url?.split('/').pop()?.split('?')[0] ?? '';

const getGalleryItems = (product) => {
    const cover = product.imagen;
    const coverFile = filename(cover);
    const extra = Array.isArray(product.galeria)
        ? product.galeria.filter(src => Boolean(src) && src !== cover && filename(src) !== coverFile)
        : [];
    const images = cover ? [cover, ...extra] : extra;

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

const renderGalleryItem = (item, index, isActive, product) => {
    if (item.kind === 'image') {
        const alt = product
            ? `${product.estadio} — ${product.club}, vista ${index + 1}`
            : item.label;
        return `
            <button
                class="product-detail__thumb ${isActive ? 'is-active' : ''}"
                type="button"
                data-gallery-index="${index}"
                aria-label="Ver ${item.label}"
            >
                <img src="${item.src}" alt="${alt}" width="120" height="90" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">
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
            <img class="product-detail__main-image" src="${item.src}" alt="Maqueta del ${product.estadio} — ${product.club}, escala ${product.escala}" width="800" height="600" sizes="(max-width: 768px) 100vw, 50vw" loading="eager" decoding="async">
            <button class="product-detail__fullscreen-close" type="button" data-gallery-fullscreen-close aria-label="Salir de pantalla completa">
                ${getIcon('close')}
            </button>
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
                <nav class="product-detail__breadcrumbs" aria-label="Navegación secundaria">
                    <a href="/">Inicio</a>
                    <span>/</span>
                    <a href="/?section=todos-los-productos">Catálogo</a>
                    <span>/</span>
                    <strong>${product.estadio}</strong>
                </nav>

                <div class="product-detail__grid">
                    <div class="product-detail__gallery">
                        <div class="product-detail__main-media" data-gallery-main>
                            ${renderMainMedia(galleryItems[0], product)}
                        </div>

                        <div class="product-detail__thumbs" data-gallery-thumbs>
                            ${galleryItems.map((item, index) => renderGalleryItem(item, index, index === 0, product)).join('')}
                        </div>
                    </div>

                    <div class="product-detail__content">
                        <p class="product-detail__eyebrow">${product.club || 'Colección'}</p>
                        <h1>${product.estadio}</h1>
                        <p class="product-detail__lead">
                            ${product.descripcion || 'Una pieza pensada para exhibición, colección y regalo.'}
                        </p>

                        <div class="product-detail__chips">
                            <span>Escala ${product.escala || 'A definir'}</span>
                            <span>${product.material || 'Material a definir'}</span>
                            <span>${product.edicion || 'Edición especial'}</span>
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
                            <a class="product-detail__cta product-detail__cta--ghost" href="/?section=todos-los-productos">
                                Volver al catálogo
                            </a>
                        </div>
                    </div>
                </div>

                <section class="product-detail__related">
                    <div class="product-detail__related-head">
                        <div>
                            <p class="product-detail__eyebrow">Seguí explorando</p>
                            <h2>Volver al catálogo completo</h2>
                        </div>
                        <a href="/?section=todos-los-productos">Ver todos los productos</a>
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
        const mainMedia = root.querySelector('[data-gallery-main]');

        const fullscreenCloseButton = event.target.closest('[data-gallery-fullscreen-close]');
        if (fullscreenCloseButton) {
            mainMedia?.classList.remove('is-fullscreen');
            return;
        }

        const fullscreenButton = event.target.closest('[data-gallery-fullscreen]');
        if (!fullscreenButton) return;
        mainMedia?.classList.add('is-fullscreen');
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

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        const mainMedia = root.querySelector('[data-gallery-main]');
        if (mainMedia?.classList.contains('is-fullscreen')) {
            mainMedia.classList.remove('is-fullscreen');
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
                    <a class="product-detail__cta product-detail__cta--primary" href="/?section=todos-los-productos">
                        Volver al catalogo
                    </a>
                </div>
            </div>
        </section>
    `;
};

const BASE_URL = 'https://maquetasezequiel.com';

const updatePageMeta = (product) => {
    const slug = slugify(product.estadio);
    const url = `${BASE_URL}/productos/${slug}`;
    const imageUrl = `${BASE_URL}/${product.imagen}`;
    const title = `${product.estadio} (${product.club}) | Maquetas Ezequiel`;
    const description = `${product.descripcion} Maqueta del ${product.estadio} — ${product.club}. Escala ${product.escala}. Hecha a mano en Argentina, envíos a todo el país.`;

    document.title = title;

    const setMeta = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', imageUrl);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:type"]', 'product');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', imageUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = url;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.estadio,
        description: product.descripcion,
        image: imageUrl,
        brand: { '@type': 'Brand', name: 'Maquetas Ezequiel' },
        offers: {
            '@type': 'Offer',
            price: String(product.precio),
            priceCurrency: 'ARS',
            availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url,
            seller: { '@type': 'Organization', name: 'Maquetas Ezequiel' }
        }
    };

    let ldScript = document.querySelector('script[data-schema="product"]');
    if (!ldScript) {
        ldScript = document.createElement('script');
        ldScript.type = 'application/ld+json';
        ldScript.dataset.schema = 'product';
        document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(schema);
};

const init = async () => {
    const maquetas = await productsService.getAll();

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

    const slug = getSlugFromUrl();
    const product = findProductBySlug(maquetas, slug);

    document.body.appendChild(createWhatsAppFloat());

    if (!product) {
        document.title = 'Producto no encontrado | Maquetas Ezequiel';
        renderNotFound();
        return;
    }

    updatePageMeta(product);
    renderProductPage(product);
};

document.addEventListener('DOMContentLoaded', init);
