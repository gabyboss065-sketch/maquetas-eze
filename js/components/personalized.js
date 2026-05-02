import { getDeferredImageAttrs } from '../utils/imageLoader.js';
import { getIcon } from '../utils/icons.js';
import { buildWhatsappUrl } from '../utils/whatsapp.js';

const CTA_MESSAGE = 'Hola, me interesa solicitar una maqueta personalizada. ¿Qué información necesito proporcionar?';
const CTA_BAR_MESSAGE = 'Hola, quiero mi estadio personalizado. ¿Cómo empezamos?';

const FEATURE_POINTS = [
    {
        icon: 'design',
        title: 'Diseño a medida',
        description: 'Adaptamos escala, base y presentación al espacio donde la vayas a exhibir.'
    },
    {
        icon: 'premium',
        title: 'Terminación premium',
        description: 'Trabajamos texturas y detalles para que la maqueta tenga presencia real.'
    },
    {
        icon: 'shipping',
        title: 'Envios a todo el país',
        description: 'Embalaje reforzado para que la pieza llegue segura y lista para regalar.'
    }
];

const PROCESS_STEPS = [
    {
        num: 1,
        svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
        title: 'Nos mandás tu idea',
        desc: 'Enviá una foto, medidas o referencia del estadio que querés.'
    },
    {
        num: 2,
        svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        title: 'Diseñamos el modelo',
        desc: 'Desarrollamos el diseño digital con todos los detalles del proyecto.'
    },
    {
        num: 3,
        svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
        title: 'Lo convertimos en maqueta real',
        desc: 'Construimos tu maqueta con materiales premium y luces LED.'
    },
    {
        num: 4,
        svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
        title: 'Te la entregamos',
        desc: 'Embalaje reforzado para que llegue segura y lista para exhibir.'
    }
];

const TESTIMONIALS = [
    { text: 'Increíble el nivel de detalle. Superó totalmente mis expectativas.', author: 'Martín G.' },
    { text: 'La maqueta quedó espectacular. Excelente atención y calidad premium.', author: 'Lucas R.' },
    { text: 'El regalo perfecto para mi papá. ¡Quedó emocionado!', author: 'Sebastián T.' }
];

const FAQ_ITEMS = [
    {
        q: '¿Qué información necesito enviar?',
        a: 'Una foto o referencia del estadio, las medidas aproximadas y el espacio donde lo vas a exhibir. Con eso podemos darte un presupuesto ajustado.'
    },
    {
        q: '¿Cuánto tiempo tarda el proceso?',
        a: 'Según la complejidad y las medidas. Te informamos el tiempo exacto al recibir tu consulta.'
    },
    {
        q: '¿Hacen envíos a todo el país?',
        a: 'Sí, enviamos a todo el país con embalaje reforzado y número de seguimiento. El costo se calcula según la distancia y el tamaño de la pieza.'
    },
    {
        q: '¿Las maquetas incluyen luces?',
        a: 'Sí, todas incluyen iluminación LED integrada. Si preferís una versión sin luces, podemos adaptarlo.'
    },
    {
        q: '¿Puedo pedir un tamaño especial?',
        a: 'Sí, trabajamos con medidas personalizadas. Indicanos el espacio disponible y te recomendamos la escala más adecuada.'
    }
];

const ARROW_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

const renderStars = () => Array.from({ length: 5 }, () =>
    `<img src="assets/icons/star.svg" class="personalized__star" width="14" height="14" alt="" aria-hidden="true">`
).join('');

const getPersonalizedProjects = (products) => {
    const refs = products.filter((p) => p.referenciaPersonalizada);
    return [...refs].sort((a, b) => (a.orden ?? Infinity) - (b.orden ?? Infinity));
};

const FEATURED_HERO_IMAGE = 'assets/img/products/qatar/lusail-stadium/destacada_personalized.jpg';
const FEATURED_REF_IMAGE = 'assets/img/products/qatar/lusail-stadium/referencia_real.webp?v=2';

const createHero = (featured) => `
    <div class="personalized__hero">
        <div class="personalized__hero-shell">
            <div class="personalized__hero-content">
                <p class="personalized__eyebrow">Maquetas Personalizadas</p>
                <h2 class="personalized__title">Creamos tu estadio.<br><em class="personalized__title-accent">Literal.</em></h2>
                <p class="personalized__lead">
                    Convertimos tu idea en una pieza única,<br>
                    con detalles reales y materiales premium.
                </p>
                <div class="personalized__features">
                    ${FEATURE_POINTS.map((fp) => `
                        <div class="personalized__feature">
                            <span class="personalized__feature-icon">${getIcon(fp.icon)}</span>
                            <div class="personalized__feature-text">
                                <strong>${fp.title}</strong>
                                <p>${fp.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="personalized__hero-btn" type="button" data-cta="hero">
                    Pedí tu maqueta personalizada ${ARROW_SVG}
                </button>
            </div>

            ${featured ? `
            <div class="personalized__hero-visual">
                <p class="personalized__featured-kicker">
                    ${getIcon('badge-star')} Proyecto Destacado
                </p>
                <div class="personalized__featured-card">
                    <img
                        src="${FEATURED_HERO_IMAGE}"
                        alt="Maqueta personalizada de ${featured.estadio}"
                        loading="eager"
                        fetchpriority="high"
                        decoding="async"
                    >
                    <div class="personalized__featured-badge">
                        ${getIcon('badge-star')} Proyecto Destacado
                    </div>
                    <div class="personalized__featured-overlay">
                        <p class="personalized__featured-club">${featured.club}</p>
                        <h3 class="personalized__featured-name">${featured.estadio}</h3>
                        <div class="personalized__featured-footer">
                            <span class="personalized__featured-label">Proyecto personalizado</span>
                            <a href="product.html?id=${featured.id}" class="personalized__featured-link">
                                Ver proyecto completo ${ARROW_SVG}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    </div>
`;

const createComparison = (featured) => {
    if (!featured) return '';
    const refImg = FEATURED_REF_IMAGE;
    const finalImg = featured.imagen;
    return `
        <div class="personalized__comparison">
            <div class="personalized__comparison-shell">
                <p class="personalized__kicker personalized__kicker--center">De la idea a la realidad</p>
                <p class="personalized__kicker-sub">Así transformamos una referencia en una maqueta única.</p>
                <div class="personalized__panels">
                    <div class="personalized__panel">
                        <span class="personalized__panel-tag">Referencia Real</span>
                        <img src="${refImg}" alt="Referencia del estadio ${featured.estadio}" loading="lazy" decoding="async">
                    </div>
                    <div class="personalized__arrow-circle" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                    <div class="personalized__panel personalized__panel--final">
                        <span class="personalized__panel-tag personalized__panel-tag--gold">Maqueta Final</span>
                        <img src="${finalImg}" alt="Maqueta final de ${featured.estadio}" loading="lazy" decoding="async">
                    </div>
                </div>
            </div>
        </div>
    `;
};

const createProcess = () => `
    <div class="personalized__process">
        <p class="personalized__kicker">Nuestro Proceso</p>
        <ol class="personalized__steps">
            ${PROCESS_STEPS.map((step, i) => `
                <li class="personalized__step ${i === PROCESS_STEPS.length - 1 ? 'personalized__step--last' : ''}">
                    <div class="personalized__step-marker">
                        <div class="personalized__step-icon-wrap">${step.svg}</div>
                        <span class="personalized__step-connector" aria-hidden="true"></span>
                    </div>
                    <div class="personalized__step-body">
                        <span class="personalized__step-num">${step.num}</span>
                        <strong>${step.title}</strong>
                        <p>${step.desc}</p>
                    </div>
                </li>
            `).join('')}
        </ol>
    </div>
`;

const createOtherProjects = (others) => `
    <div class="personalized__others">
        <p class="personalized__kicker">Otros Proyectos Personalizados</p>
        <div class="personalized__other-grid">
            ${others.slice(0, 3).map((p) => `
                <a class="personalized__other-card" href="product.html?id=${p.id}">
                    <img src="${p.imagen}" alt="Maqueta de ${p.estadio}" loading="lazy" decoding="async">
                    <div class="personalized__other-overlay">
                        <span class="personalized__other-club">${p.club}</span>
                        <strong class="personalized__other-name">${p.estadio}</strong>
                        <div class="personalized__other-rating">
                            ${renderStars()} <span class="personalized__other-score">5.0</span>
                        </div>
                    </div>
                </a>
            `).join('')}
        </div>
    </div>
`;

const createQuoteCard = () => `
    <div class="personalized__quote-wrap">
        <div class="personalized__quote-shell">
            <div class="personalized__quote-card">
                <p class="personalized__quote-icon" aria-hidden="true">""</p>
                <p class="personalized__quote-text">No es solo una maqueta,<br>es tu estadio, a tu manera.</p>
                <p class="personalized__quote-sub">Cada detalle importa. Cada proyecto es único.</p>
                <div class="personalized__quote-badges">
                    <span>Calidad premium</span>
                    <span>Atención personalizada</span>
                    <span>Envíos a todo el país</span>
                </div>
            </div>
        </div>
    </div>
`;

const createTestimonials = () => `
    <div class="personalized__reviews">
        <div class="personalized__reviews-shell">
            <p class="personalized__kicker">Lo que dicen nuestros clientes</p>
            <div class="personalized__review-grid">
                ${TESTIMONIALS.map((t) => `
                    <div class="personalized__review-card">
                        <div class="personalized__review-icon" aria-hidden="true">
                            <img src="assets/icons/quote.svg" width="28" height="28" alt="">
                        </div>
                        <p class="personalized__review-text">${t.text}</p>
                        <strong class="personalized__review-author">${t.author}</strong>
                        <div class="personalized__other-rating">
                            ${renderStars()}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
`;

const createFaq = () => `
    <div class="personalized__faq">
        <div class="personalized__faq-shell">
            <p class="personalized__kicker">¿Tenés dudas?</p>
            <div class="personalized__faq-list">
                ${FAQ_ITEMS.map((item) => `
                    <div class="personalized__faq-item" data-faq-item>
                        <button class="personalized__faq-q" type="button" data-faq-trigger aria-expanded="false">
                            <span>${item.q}</span>
                            <span class="personalized__faq-icon" aria-hidden="true">
                                <svg class="personalized__faq-plus" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                <svg class="personalized__faq-minus" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </span>
                        </button>
                        <div class="personalized__faq-a" data-faq-answer>
                            <p>${item.a}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
`;

const createCtaBar = () => `
    <div class="personalized__cta-bar">
        <div class="personalized__cta-bar-shell">
            <div class="personalized__cta-bar-left">
                <span class="personalized__cta-bar-icon">${getIcon('gift')}</span>
                <div class="personalized__cta-bar-text">
                    <strong>El regalo perfecto existe.</strong>
                    <span>Hacemos realidad tu estadio favorito.</span>
                </div>
            </div>
            <button class="personalized__cta-bar-btn" type="button" data-cta="bar">
                Quiero mi estadio personalizado ${ARROW_SVG}
            </button>
        </div>
    </div>
`;

const initFaqAccordion = (section) => {
    section.querySelectorAll('[data-faq-item]').forEach((item) => {
        const trigger = item.querySelector('[data-faq-trigger]');
        const answer = item.querySelector('[data-faq-answer]');
        if (!trigger || !answer) return;

        trigger.addEventListener('click', () => {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', String(!isOpen));
            answer.style.maxHeight = isOpen ? '0' : `${answer.scrollHeight}px`;
            item.classList.toggle('is-open', !isOpen);
        });
    });
};

const bindCtaButtons = (section) => {
    section.querySelectorAll('[data-cta="hero"]').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.open(buildWhatsappUrl(CTA_MESSAGE), '_blank', 'noopener,noreferrer');
        });
    });
    section.querySelectorAll('[data-cta="bar"]').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.open(buildWhatsappUrl(CTA_BAR_MESSAGE), '_blank', 'noopener,noreferrer');
        });
    });
};

const observeAnimation = (section) => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    section.classList.add('is-visible');
                    observer.unobserve(section);
                }
            });
        },
        { threshold: 0.05 }
    );
    observer.observe(section);
};

export const createPersonalized = (products) => {
    const projects = getPersonalizedProjects(products);
    const featured = projects.find((p) => p.id === 20) ?? projects[0];
    const rest = projects.filter((p) => p.id !== featured?.id);

    const section = document.createElement('section');
    section.className = 'personalized';
    section.id = 'personalizados';

    section.innerHTML = `
        ${createHero(featured)}
        ${createComparison(featured)}
        <div class="personalized__mid">
            <div class="personalized__mid-shell">
                ${createProcess()}
                ${createOtherProjects([featured, ...rest])}
            </div>
        </div>
        ${createTestimonials()}
        ${createFaq()}
        ${createCtaBar()}
    `;

    initFaqAccordion(section);
    bindCtaButtons(section);
    observeAnimation(section);

    return section;
};
