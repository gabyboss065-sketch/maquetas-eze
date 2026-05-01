import { buildCartInquiryMessage, buildWhatsappUrl } from '../utils/whatsapp.js';

const renderItem = (item) => `
    <article class="cart-dropdown__item">
        <img src="${item.imagen}" alt="Miniatura de ${item.estadio}" loading="lazy" decoding="async">
        <div class="cart-dropdown__item-meta">
            <p>${item.estadio}</p>
            <small>Medida: ${item.medida || 'A definir'}${item.medidaPersonalizada ? ` (${item.medidaPersonalizada})` : ''}</small>
            <small>Cantidad seleccionada: ${item.quantity}</small>
            <div class="cart-dropdown__qty-controls">
                <button type="button" data-decrease-key="${item.itemKey}" aria-label="Restar una unidad de ${item.estadio}">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-increase-key="${item.itemKey}" aria-label="Sumar una unidad de ${item.estadio}">+</button>
            </div>
        </div>
        <button type="button" data-remove-key="${item.itemKey}" aria-label="Eliminar ${item.estadio} del carrito">Eliminar</button>
    </article>
`;

export const createCartDropdownController = (store) => {
    const cartItemsWrap = document.getElementById('cart-dropdown-items');
    const cartCount = document.getElementById('cart-dropdown-count');
    const cartSummary = document.getElementById('cart-dropdown-summary');
    const cartCta = document.getElementById('cart-dropdown-cta');
    const cartButton = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');

    const close = () => {
        if (!cartButton || !cartDropdown) return;
        cartDropdown.classList.remove('is-open');
        cartButton.setAttribute('aria-expanded', 'false');
        cartDropdown.setAttribute('aria-hidden', 'true');
    };

    const toggle = () => {
        if (!cartButton || !cartDropdown) return;
        const isOpen = cartDropdown.classList.toggle('is-open');
        cartButton.setAttribute('aria-expanded', String(isOpen));
        cartDropdown.setAttribute('aria-hidden', String(!isOpen));
    };

    const render = () => {
        if (!cartItemsWrap || !cartCount || !cartSummary || !cartCta || !cartButton) return;

        const cart = store.getCart();
        const count = store.getCount();
        const items = cart;

        cartButton.dataset.count = String(count);
        cartButton.classList.toggle('has-count', count > 0);
        cartButton.setAttribute('aria-label', `Carrito de consultas con ${count} productos`);

        cartCount.textContent = `${count} seleccionados`;

        if (items.length === 0) {
            cartSummary.textContent = 'Agrega productos para consultar por WhatsApp.';
            cartCta.href = buildWhatsappUrl('Hola, quiero consultar por una maqueta.');
            cartCta.classList.add('is-disabled');
            cartCta.setAttribute('aria-disabled', 'true');
            cartCta.tabIndex = -1;
            cartItemsWrap.innerHTML = `
                <p class="cart-dropdown__empty">Todavia no agregaste productos.</p>
                <button type="button" class="cart-dropdown__clear" data-clear-cart disabled>Vaciar carrito</button>
            `;
            return;
        }

        cartSummary.textContent = 'Envia esta seleccion al cliente y continua la conversacion por WhatsApp.';
        cartCta.href = buildWhatsappUrl(buildCartInquiryMessage(items));
        cartCta.classList.remove('is-disabled');
        cartCta.setAttribute('aria-disabled', 'false');
        cartCta.tabIndex = 0;

        cartItemsWrap.innerHTML = items.map(renderItem).join('')
            + '<button type="button" class="cart-dropdown__clear" data-clear-cart>Vaciar carrito</button>';
    };

    const bindEvents = (closeOther = () => {}) => {
        if (!cartButton || !cartDropdown) return;

        cartButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!cartDropdown.classList.contains('is-open')) {
                closeOther();
            }
            toggle();
        });

        document.addEventListener('click', (event) => {
            const clickedInside = event.target.closest('.cart-menu');
            if (clickedInside) return;
            close();
        });

        cartDropdown.addEventListener('click', (event) => {
            event.stopPropagation();

            const removeButton = event.target.closest('[data-remove-key]');
            if (removeButton) {
                store.removeItem(removeButton.dataset.removeKey);
                return;
            }

            const increaseButton = event.target.closest('[data-increase-key]');
            if (increaseButton) {
                store.increaseQuantity(increaseButton.dataset.increaseKey);
                return;
            }

            const decreaseButton = event.target.closest('[data-decrease-key]');
            if (decreaseButton) {
                store.decreaseQuantity(decreaseButton.dataset.decreaseKey);
                return;
            }

            const clearButton = event.target.closest('[data-clear-cart]');
            if (clearButton && !clearButton.disabled) {
                store.clear();
            }
        });

        cartCta?.addEventListener('click', (event) => {
            if (cartCta.classList.contains('is-disabled')) {
                event.preventDefault();
            }
        });
    };

    return {
        bindEvents,
        render,
        close
    };
};
