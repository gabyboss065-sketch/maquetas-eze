import { getIcon } from '../utils/icons.js';

export const createFooter = () => {
    const footer = document.createElement('div');
    footer.className = 'site-footer';

    footer.innerHTML = `
        <div class="site-footer__shell">
            <div class="site-footer__main">
                <div class="site-footer__brand">
                    <a class="site-footer__logo" href="./index.html">Maquetas Ezequiel</a>
                    <div class="site-footer__social">
                        <a class="site-footer__social-link" href="https://wa.me/540000000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                            ${getIcon('whatsapp')}
                        </a>
                        <a class="site-footer__social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                            ${getIcon('instagram')}
                        </a>
                        <a class="site-footer__social-link" href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">
                            ${getIcon('tiktok')}
                        </a>
                    </div>
                </div>

                <div class="site-footer__contact">
                    <div class="site-footer__contact-item">
                        <span class="site-footer__contact-icon">${getIcon('phone')}</span>
                        <div>
                            <strong>Teléfono / WhatsApp</strong>
                            <a href="tel:+540000000000">+54 00 0000-0000</a>
                        </div>
                    </div>

                    <div class="site-footer__contact-item">
                        <span class="site-footer__contact-icon">${getIcon('mail')}</span>
                        <div>
                            <strong>E-mail</strong>
                            <a href="mailto:tuemail@ejemplo.com">tuemail@ejemplo.com</a>
                        </div>
                    </div>

                    <div class="site-footer__contact-item">
                        <span class="site-footer__contact-icon">${getIcon('location')}</span>
                        <div>
                            <strong>Ubicación</strong>
                            <span>Agregar ciudad, provincia o zona de entrega</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="site-footer__bottom">
                <p class="site-footer__disclaimer">
                    Los nombres, escudos, camisetas, estadios, imágenes y demás signos distintivos de clubes,
                    selecciones o instituciones deportivas pertenecen a sus respectivos titulares. En este sitio
                    se utilizan únicamente con fines ilustrativos y descriptivos.
                </p>

                <div class="site-footer__meta">
                    <span>© Maquetas Ezequiel</span>
                    <span>Espacio para datos legales, CUIT, políticas o condiciones.</span>
                </div>
            </div>
        </div>
    `;

    return footer;
};
