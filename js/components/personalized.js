import { initPersonalizedSlider } from '../modules/personalizedSlider.js';
import { getDeferredImageAttrs } from '../utils/imageLoader.js';
import { getIcon } from '../utils/icons.js';
import { buildWhatsappUrl } from '../utils/whatsapp.js';

const FEATURE_POINTS = [
    {
        icon: 'design',
        title: 'Diseño a medida personalizada',
        description: 'Adaptamos escala, base y presentación según el espacio donde la vayas a exhibir.'
    },
    {
        icon: 'premium',
        title: 'Terminacion premium',
        description: 'Trabajamos texturas, volúmenes y detalles para que la maqueta tenga presencia real.'
    },
    {
        icon: 'shipping',
        title: 'Entrega a todo el pais',
        description: 'Empaquetado reforzado y seguimiento para que la pieza llegue segura y lista para regalar.'
    }
];

const CTA_MESSAGE = 'Hola, me interesa solicitar una maqueta personalizada. ¿Qué información necesito proporcionar?';

const createVisualSlide = (product, index) => {
    const activeClass = index === 0 ? 'is-active' : '';
    const imageContent = product.imagen
        ? getDeferredImageAttrs({
            src: product.imagen,
            alt: `Maqueta personalizada de ${product.estadio}`,
            eager: index === 0,
            fetchpriority: index === 1 ? 'high' : 'low'
        })
        : `<div class="personalized__image-placeholder">
               <strong>${product.estadio}</strong>
           </div>`;

    return `
        <div class="personalized__media-slide ${activeClass}" data-personalized-image>
            ${imageContent}
        </div>
    `;
};

const createMetaSlide = (product, index) => `
    <div class="personalized__meta-slide ${index === 0 ? 'is-active' : ''}" data-personalized-meta>
        <p class="personalized__card-label">Proyecto de referencia</p>
        <h3>${product.estadio}</h3>
        <p>${product.club} - ${product.material}</p>
    </div>
`;

const createFeaturePoint = ({ icon, title, description }) => `
    <article class="personalized__point">
        <span class="personalized__point-icon">${getIcon(icon)}</span>
        <strong>${title}</strong>
        <p>${description}</p>
    </article>
`;

const getSliderProjects = (products) => {
    const references = products.filter((p) => p.referenciaPersonalizada);
    if (references.length === 0) {
        const fallback = products.find((p) => p.destacado) ?? products[0];
        return fallback ? [fallback] : [];
    }
    return [...references].sort((a, b) => (a.orden ?? Infinity) - (b.orden ?? Infinity));
};

const bindCtaButton = (section) => {
    section.querySelector('.personalized__button')?.addEventListener('click', () => {
        window.open(buildWhatsappUrl(CTA_MESSAGE), '_blank', 'noopener,noreferrer');
    });
};

const observeAnimation = (section) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                section.classList.add('is-animated');
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.15 });
    observer.observe(section);
};

export const createPersonalized = (products) => {
    const sliderProjects = getSliderProjects(products);

    const section = document.createElement('section');
    section.className = 'personalized';
    section.id = 'personalizados';

    section.innerHTML = `
        <div class="personalized__shell">
            <div class="personalized__content">
                <p class="personalized__eyebrow">Personalizados</p>
                <h2>Llevamos tu estadio favorito a escala de colección</h2>
                <p class="personalized__lead">
                    Si querés una pieza única, desarrollamos maquetas personalizadas con base,
                    materiales premium y terminaciones listas para exhibición.
                </p>

                <div class="personalized__points">
                    ${FEATURE_POINTS.map(createFeaturePoint).join('')}
                </div>

                <div class="personalized__actions">
                    <button class="personalized__button" type="button">Pedir maqueta personalizada</button>
                    <span class="personalized__note">Tiempo estimado de producción: consultar según medida.</span>
                </div>
            </div>

            <div class="personalized__visual">
                <div class="personalized__card">
                    <div class="personalized__image">
                        ${sliderProjects.map(createVisualSlide).join('')}
                    </div>

                    <div class="personalized__card-body">
                        <div class="personalized__meta-track">
                            ${sliderProjects.map(createMetaSlide).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    initPersonalizedSlider(section);
    bindCtaButton(section);
    observeAnimation(section);

    return section;
};
