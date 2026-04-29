import { getIcon } from '../utils/icons.js';

const DEFAULT_SIZE_OPTIONS = ['25 x 18 cm', '35 x 24 cm', '45 x 30 cm'];
const CUSTOM_SIZE_VALUE = '__custom__';
const getGalleryImages = (product) => {
    if (Array.isArray(product.galeria) && product.galeria.length > 0) {
        return product.galeria;
    }

    if (product.imagen) {
        return [product.imagen];
    }

    return [];
};

const getSizeOptions = (product) => {
    if (Array.isArray(product.medidas) && product.medidas.length > 0) {
        return product.medidas;
    }

    return DEFAULT_SIZE_OPTIONS;
};

export const createProductModal = (options = {}) => {
    const { canAddProduct = () => true } = options;
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="product-modal__backdrop" data-modal-close></div>
        <article class="product-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
            <button class="product-modal__close" type="button" data-modal-close aria-label="Cerrar detalle">
                ${getIcon('close')}
            </button>

            <div class="product-modal__grid">
                <div class="product-modal__gallery">
                    <div class="product-modal__main-image-wrap">
                        <button class="product-modal__nav product-modal__nav--prev" type="button" data-gallery-prev aria-label="Imagen anterior">
                            ${getIcon('chevron-left')}
                        </button>
                        <img class="product-modal__main-image" src="" alt="" loading="eager" decoding="async">
                        <button class="product-modal__fullscreen" type="button" data-gallery-fullscreen aria-label="Ver imagen en pantalla completa">
                            ${getIcon('fullscreen')}
                        </button>
                        <button class="product-modal__nav product-modal__nav--next" type="button" data-gallery-next aria-label="Imagen siguiente">
                            ${getIcon('chevron-right')}
                        </button>
                    </div>
                    <div class="product-modal__thumbs" data-gallery-thumbs></div>
                </div>

                <div class="product-modal__info">
                    <p class="product-modal__club" data-product-club></p>
                    <h3 id="product-modal-title" data-product-title></h3>
                    <p class="product-modal__description" data-product-description></p>

                    <div class="product-modal__details">
                        <span data-product-scale></span>
                        <span data-product-material></span>
                        <span data-product-edition></span>
                        <span data-product-availability></span>
                    </div>

                    <div class="product-modal__sizes">
                        <div class="product-modal__sizes-head">
                            <p>Medidas disponibles</p>
                            <small>Elegi una opcion o pedi una medida personalizada.</small>
                        </div>
                        <div class="product-modal__size-options" data-size-options></div>
                        <label class="product-modal__custom-size" data-custom-size-wrap hidden>
                            <span>Medida personalizada</span>
                            <input
                                class="product-modal__custom-size-input"
                                type="text"
                                data-custom-size-input
                                placeholder="Ej: 52 x 36 cm"
                            >
                        </label>
                    </div>

                    <div class="product-modal__actions">
                        <button class="product-modal__btn product-modal__btn--primary" type="button" data-modal-add>Agregar al carrito</button>
                        <button class="product-modal__btn product-modal__btn--ghost" type="button" data-modal-close>Cerrar</button>
                    </div>
                </div>
            </div>
        </article>
    `;

    const mainImage = modal.querySelector('.product-modal__main-image');
    const thumbsWrap = modal.querySelector('[data-gallery-thumbs]');
    const title = modal.querySelector('[data-product-title]');
    const club = modal.querySelector('[data-product-club]');
    const description = modal.querySelector('[data-product-description]');
    const scale = modal.querySelector('[data-product-scale]');
    const material = modal.querySelector('[data-product-material]');
    const edition = modal.querySelector('[data-product-edition]');
    const availability = modal.querySelector('[data-product-availability]');
    const addToCartButton = modal.querySelector('[data-modal-add]');
    const sizeOptionsWrap = modal.querySelector('[data-size-options]');
    const customSizeWrap = modal.querySelector('[data-custom-size-wrap]');
    const customSizeInput = modal.querySelector('[data-custom-size-input]');

    let currentImages = [];
    let currentIndex = 0;
    let currentProduct = null;
    let touchStartX = 0;
    let touchDeltaX = 0;
    let currentSize = '';
    let currentCustomSize = '';

    const getSelectionPayload = () => {
        const useCustomSize = currentSize === CUSTOM_SIZE_VALUE;
        const customSize = (currentCustomSize || '').trim();
        const selectedLabel = useCustomSize ? 'Medida personalizada' : currentSize;

        return {
            medida: selectedLabel || 'A definir',
            medidaPersonalizada: useCustomSize ? customSize : ''
        };
    };

    const updateCustomSizeVisibility = () => {
        const showCustom = currentSize === CUSTOM_SIZE_VALUE;
        if (customSizeWrap) {
            customSizeWrap.hidden = !showCustom;
        }
        if (customSizeInput && !showCustom) {
            customSizeInput.value = '';
            currentCustomSize = '';
        }
    };

    const renderSizeOptions = () => {
        if (!sizeOptionsWrap || !currentProduct) return;

        const options = [...getSizeOptions(currentProduct), 'Medida personalizada'];
        sizeOptionsWrap.innerHTML = options.map((option, index) => {
            const value = option === 'Medida personalizada' ? CUSTOM_SIZE_VALUE : option;
            const checked = index === 0;

            if (checked) {
                currentSize = value;
            }

            return `
                <label class="product-modal__size-option ${checked ? 'is-selected' : ''}">
                    <input
                        type="radio"
                        name="product-size"
                        value="${value}"
                        ${checked ? 'checked' : ''}
                    >
                    <span>${option}</span>
                </label>
            `;
        }).join('');

        updateCustomSizeVisibility();
    };

    const renderMainImage = () => {
        if (!currentImages.length || !mainImage) return;
        const imageUrl = currentImages[currentIndex];
        mainImage.src = imageUrl;
        mainImage.alt = currentProduct
            ? `Detalle de ${currentProduct.estadio}`
            : 'Imagen de producto';
    };

    const renderThumbs = () => {
        if (!thumbsWrap) return;

        thumbsWrap.innerHTML = currentImages.map((image, index) => `
            <button
                class="product-modal__thumb ${index === currentIndex ? 'is-active' : ''}"
                type="button"
                data-thumb-index="${index}"
                aria-label="Ver imagen ${index + 1}"
            >
                <img src="${image}" alt="" loading="lazy" decoding="async">
            </button>
        `).join('');
    };

    const updateGallery = () => {
        renderMainImage();
        renderThumbs();
    };

    const syncAddButtonState = () => {
        if (!addToCartButton || !currentProduct) return;
        const customSizeReady = currentSize !== CUSTOM_SIZE_VALUE || Boolean((currentCustomSize || '').trim());
        const isAvailable = canAddProduct(currentProduct) && customSizeReady;
        addToCartButton.disabled = !isAvailable;
        addToCartButton.textContent = currentSize === CUSTOM_SIZE_VALUE && !customSizeReady
            ? 'Completa tu medida personalizada'
            : 'Agregar a consulta';
        addToCartButton.setAttribute('aria-disabled', String(!isAvailable));
    };

    const close = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('is-modal-open');
        modal.dispatchEvent(new CustomEvent('product-modal:closed', {
            bubbles: true
        }));
    };

    const open = (product) => {
        currentProduct = product;
        currentImages = getGalleryImages(product);
        currentIndex = 0;
        currentCustomSize = '';
        currentSize = '';

        if (!currentImages.length) return;

        title.textContent = product.estadio || 'Producto';
        club.textContent = product.club || '';
        description.textContent = product.descripcion || '';
        scale.textContent = `Escala: ${product.escala || 'A definir'}`;
        material.textContent = `Material: ${product.material || 'A definir'}`;
        edition.textContent = `Edicion: ${product.edicion || 'A definir'}`;
        availability.textContent = 'Disponible por pedido y consulta personalizada';

        updateGallery();
        renderSizeOptions();
        syncAddButtonState();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('is-modal-open');
        modal.dispatchEvent(new CustomEvent('product-modal:opened', {
            bubbles: true,
            detail: {
                product
            }
        }));
    };

    modal.addEventListener('click', (event) => {
        const closeTrigger = event.target.closest('[data-modal-close]');
        if (closeTrigger) {
            close();
            return;
        }

        const prevButton = event.target.closest('[data-gallery-prev]');
        if (prevButton && currentImages.length > 1) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateGallery();
            return;
        }

        const nextButton = event.target.closest('[data-gallery-next]');
        if (nextButton && currentImages.length > 1) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateGallery();
            return;
        }

        const fullscreenButton = event.target.closest('[data-gallery-fullscreen]');
        if (fullscreenButton && mainImage) {
            if (document.fullscreenElement) {
                document.exitFullscreen?.();
                return;
            }

            mainImage.requestFullscreen?.();
            return;
        }

        const thumb = event.target.closest('[data-thumb-index]');
        if (thumb) {
            currentIndex = Number(thumb.dataset.thumbIndex);
            updateGallery();
            return;
        }

        const sizeOption = event.target.closest('.product-modal__size-option');
        if (sizeOption) {
            const radio = sizeOption.querySelector('input[type="radio"]');
            if (!radio) return;
            currentSize = radio.value;
            radio.checked = true;
            modal.querySelectorAll('.product-modal__size-option').forEach((option) => {
                option.classList.toggle('is-selected', option === sizeOption);
            });
            updateCustomSizeVisibility();
            syncAddButtonState();
            return;
        }

        const addButton = event.target.closest('[data-modal-add]');
        if (addButton && currentProduct) {
            if (addButton.disabled) return;
            const selection = getSelectionPayload();
            modal.dispatchEvent(new CustomEvent('catalog:add-product', {
                bubbles: true,
                detail: {
                    product: currentProduct,
                    selection
                }
            }));
        }
    });

    customSizeInput?.addEventListener('input', (event) => {
        currentCustomSize = event.target.value;
        syncAddButtonState();
    });

    const mainImageWrap = modal.querySelector('.product-modal__main-image-wrap');
    if (mainImageWrap) {
        mainImageWrap.addEventListener('touchstart', (event) => {
            if (currentImages.length <= 1) return;
            touchStartX = event.changedTouches[0].clientX;
            touchDeltaX = 0;
        }, { passive: true });

        mainImageWrap.addEventListener('touchmove', (event) => {
            if (currentImages.length <= 1) return;
            touchDeltaX = event.changedTouches[0].clientX - touchStartX;
        }, { passive: true });

        mainImageWrap.addEventListener('touchend', () => {
            if (currentImages.length <= 1) return;
            const minSwipeDistance = 50;
            if (Math.abs(touchDeltaX) < minSwipeDistance) return;

            if (touchDeltaX < 0) {
                currentIndex = (currentIndex + 1) % currentImages.length;
            } else {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            }

            updateGallery();
        }, { passive: true });
    }

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('is-open')) return;
        if (event.key === 'Escape') close();
    });

    document.addEventListener('cart:updated', () => {
        if (!modal.classList.contains('is-open')) return;
        syncAddButtonState();
    });

    return {
        element: modal,
        open,
        close
    };
};
