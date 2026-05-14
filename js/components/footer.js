import { getIcon } from '../utils/icons.js';

const NAV_LINKS = [
    { label: 'Inicio',          section: 'inicio' },
    { label: 'Productos',       section: 'todos-los-productos' },
    { label: 'Personalizados',  section: 'personalizados' },
    { label: 'Sobre mí',        section: 'sobre-mi' },
];

const SOCIAL = [
    {
        label: 'Facebook',
        href: 'https://www.facebook.com/ezequiel.duende.37',
        icon: getIcon('facebook'),
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/maquetas_ezequiel/',
        icon: getIcon('instagram'),
    },
    {
        label: 'TikTok',
        href: 'https://www.tiktok.com/@ezequielarteenmadera',
        icon: getIcon('tiktok'),
    },
];

const CONTACT = [
    {
        label: '+54 9 11 2666-6219',
        icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.8 19.8 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>`,
    },
    {
        label: 'difulvioezequiel28@gmail.com',
        icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    },
    {
        label: 'Hurlingham, Buenos Aires',
        icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    },
];

const onMainPage = () => {
    const p = window.location.pathname;
    return p === '/' || p.endsWith('/inicio.html');
};

export const createFooter = () => {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';

    footer.innerHTML = `
        <div class="site-footer__shell">
            <div class="site-footer__grid">

                <div class="site-footer__brand">
                    <p class="site-footer__name">Maquetas Ezequiel</p>
                    <p class="site-footer__tagline">Estadios a escala de colección, hechos a mano con materiales premium.</p>
                    <div class="site-footer__social">
                        ${SOCIAL.map(({ label, href, icon }) => `
                            <a
                                class="site-footer__social-btn"
                                href="${href}"
                                target="_blank"
                                rel="nofollow noreferrer noopener"
                                aria-label="${label}"
                            >${icon}</a>
                        `).join('')}
                    </div>
                </div>

                <div class="site-footer__nav">
                    <p class="site-footer__col-title">Navegación</p>
                    <ul>
                        ${NAV_LINKS.map(({ label, section }) => `
                            <li><a href="${section === 'inicio' ? '/' : `/#${section}`}" data-section="${section}">${label}</a></li>
                        `).join('')}
                    </ul>
                </div>

                <div class="site-footer__contact">
                    <p class="site-footer__col-title">Contacto</p>
                    <ul>
                        ${CONTACT.map(({ label, icon }) => `
                            <li>
                                <span class="site-footer__contact-icon">${icon}</span>
                                <span>${label}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

            </div>

            <div class="site-footer__divider"></div>

            <div class="site-footer__bottom">
                <p class="site-footer__disclaimer">
                    Los nombres, escudos, camisetas, estadios, imágenes y demás signos distintivos de clubes, selecciones o instituciones deportivas pertenecen a sus respectivos titulares. En este sitio se utilizan únicamente con fines ilustrativos y descriptivos.
                </p>
                <span class="site-footer__badge">Maquetas hechas a mano con amor y dedicación.</span>
            </div>
        </div>
    `;

    footer.querySelectorAll('a[data-section]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            if (onMainPage()) {
                if (section === 'inicio') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const target = document.getElementById(section);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                sessionStorage.setItem('scrollTo', section);
                window.location.href = '/';
            }
        });
    });

    return footer;
};
