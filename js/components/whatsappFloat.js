import { getIcon } from '../utils/icons.js';
import { buildWhatsappUrl } from '../utils/whatsapp.js';

export const createWhatsAppFloat = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'whatsapp-float';

    wrapper.innerHTML = `
        <a
            class="whatsapp-float__link"
            href="${buildWhatsappUrl('Hola, quiero consultar por una maqueta.')}"
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir WhatsApp"
        >
            <span class="whatsapp-float__ring" aria-hidden="true"></span>
            <span class="whatsapp-float__icon">${getIcon('whatsapp')}</span>
        </a>
    `;

    return wrapper;
};
