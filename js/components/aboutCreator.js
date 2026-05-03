import { getIcon } from '../utils/icons.js';
import { initMediaSlider } from '../modules/mediaSlider.js';
import { getDeferredImageAttrs } from '../utils/imageLoader.js';

const stats = [
    { value: '6', label: 'Años de experiencia' },
    { value: '+200', label: 'Ventas concretadas' },
    { value: '11 mil', label: 'TikTok' },
    { value: '+44 mil', label: 'Instagram' }
];

const socialCards = [
    {
        platform: 'TikTok',
        handle: '@ezequielarteenmadera',
        followers: '11k seguidores',
        icon: 'tiktok',
        href: 'https://www.tiktok.com/@ezequielarteenmadera'
    },
    {
        platform: 'Instagram',
        handle: '@maquetas_ezequiel',
        followers: '44k seguidores',
        icon: 'instagram',
        href: 'https://www.instagram.com/maquetas_ezequiel/'
    }
];

const workshopPhotos = [
    {
        src: 'assets/img/about/workshop/01.webp',
        alt: 'Artesano midiendo una maqueta de estadio'
    },
    {
        src: 'assets/img/about/workshop/02.webp',
        alt: 'Proceso de pintura y detalle en miniatura'
    },
    {
        src: 'assets/img/about/workshop/03.webp',
        alt: 'Mesa de trabajo con planos y herramientas'
    },
    {
        src: 'assets/img/about/workshop/04.webp',
        alt: 'Manos del artesano ajustando detalles finales'
    }
];

const mediaCards = [
    {
        outlet: 'Clarín',
        outletColor: '#D9261C',
        type: 'destacada',
        typeLabel: 'NOTA DESTACADA',
        date: '15 de diciembre, 2023',
        title: 'Vecino del GBA deslumbra con réplicas de madera de los grandes estadios argentinos',
        href: 'https://www.clarin.com/zonales/vecino-gba-deslumbra-replicas-maderas-grandes-estadios-argentina_0_ekiPCdLRtm.html',
        image: 'assets/img/about/press/01.jpg',
        imageAlt: 'Imagen de la nota de Clarin'
    },
    {
        outlet: 'Infobae',
        outletColor: '#F47C2E',
        type: 'entrevista',
        typeLabel: 'ENTREVISTA',
        date: '7 de mayo, 2023',
        title: 'La Bombonera y el Monumental que creó un artista callejero que se reinventó',
        href: 'https://www.infobae.com/sociedad/2023/05/07/la-bombonera-y-el-monumental-que-creo-un-artista-callejero-que-se-reinvento-y-hace-maquetas-de-canchas/',
        image: 'assets/img/about/press/02.webp',
        imageAlt: 'Imagen de la nota de Infobae'
    },
    {
        outlet: 'Zonales',
        outletColor: '#1F8A4C',
        type: 'nota',
        typeLabel: 'NOTA',
        date: '10 de marzo, 2023',
        title: 'Las increíbles maquetas de un vecino de Hurlingham que son furor entre los futboleros',
        href: 'https://zonales.com/hurlingham-maquetas-estadios-furor-futboleros/',
        image: 'assets/img/about/press/03.webp',
        imageAlt: 'Imagen de la nota de Zonales'
    },
    {
        outlet: 'La Ciudad',
        outletColor: '#2B3F6C',
        type: 'nota',
        typeLabel: 'NOTA',
        date: '4 de agosto, 2023',
        title: 'La Bombonera o el Monumental: el proyecto de un vecino de Hurlingham',
        href: 'https://laciudadweb.com.ar/la-bombonera-o-el-monumental-en-tamano-miniatura-el-increible-proyecto-de-un-vecino-de-hurlingham/',
        image: 'assets/img/about/press/04.webp',
        imageAlt: 'Imagen de la nota de La Ciudad'
    },
    {
        outlet: 'Optimism',
        outletColor: '#7A4FB5',
        type: 'nota',
        typeLabel: 'NOTA',
        date: '22 de junio, 2023',
        title: 'Es artista callejero y hace maquetas de canchas',
        href: 'https://optimism.com.ar/es-artista-callejero-y-hace-maquetas-de-canchas/',
        image: 'assets/img/about/press/05.webp',
        imageAlt: 'Imagen de la nota de Optimism'
    }
];

const pressLogos = [
    { name: 'Clarín' },
    { name: 'infobae' },
    { name: 'Zonales' },
    { name: 'La Ciudad' },
    { name: 'Optimism' }
];

const getTypeIcon = (type) => {
    if (type === 'destacada') return getIcon('press-star');
    if (type === 'entrevista') return getIcon('press-mic');
    return getIcon('press-doc');
};

const getCtaLabel = (type) => {
    if (type === 'entrevista') return 'Ver entrevista';
    return 'Ver nota completa';
};

const createMediaImageMarkup = (card) => {
    if (card.image) {
        return getDeferredImageAttrs({
            src: card.image,
            alt: card.imageAlt,
            fetchpriority: 'low'
        });
    }

    return `
        <div class="about-creator__media-thumb-placeholder">
            <span>Pegar aca la URL de la imagen</span>
        </div>
    `;
};

export const createAboutCreator = () => {
    const section = document.createElement('section');
    section.className = 'about-creator';
    section.id = 'sobre-mi';

    section.innerHTML = `
        <div class="about-creator__shell">
            <div class="about-creator__intro">
                <p class="about-creator__eyebrow">Sobre mí</p>
                <h2>Diseño cada estadio como una pieza única de colección</h2>
                <p>
                    Hace más de seis años convierto historias de cancha en maquetas premium.
                    Trabajo cada proyecto desde el plano inicial hasta el último detalle para
                    lograr una pieza que represente identidad, memoria y pasión.
                </p>
            </div>

            <div class="about-creator__stats">
                ${stats.map((stat) => `
                    <article class="about-creator__stat">
                        <strong>${stat.value}</strong>
                        <span>${stat.label}</span>
                    </article>
                `).join('')}
            </div>

            <div class="about-creator__social">
                ${socialCards.map((social) => `
                    <a class="about-creator__social-card" href="${social.href}" target="_blank" rel="noreferrer">
                        <span class="about-creator__social-icon">${getIcon(social.icon)}</span>
                        <span class="about-creator__social-copy">
                            <strong>${social.platform}</strong>
                            <small>${social.handle}</small>
                        </span>
                        <span class="about-creator__social-followers">${social.followers}</span>
                    </a>
                `).join('')}
            </div>

            <div class="about-creator__workshop">
                <div class="about-creator__gallery">
                    ${workshopPhotos.map((photo) => `
                        <figure>
                            ${getDeferredImageAttrs({
                                src: photo.src,
                                alt: photo.alt,
                                fetchpriority: 'low'
                            })}
                        </figure>
                    `).join('')}
                </div>
            </div>

            <div class="about-creator__media press">
                <header class="press__header">
                    <div class="press__header-left">
                        <span class="press__eyebrow">
                            <span class="press__eyebrow-icon">${getIcon('press-star')}</span>
                            Apariciones destacadas
                        </span>
                        <h3 class="press__title">
                            Nuestro trabajo <br>en <span class="press__title-accent">medios.</span>
                        </h3>
                        <p class="press__subtitle">
                            Historias reales que reflejan pasión, dedicación
                            y un trabajo que inspira.
                        </p>
                    </div>

                    <div class="press__header-right">
                        <div class="press__visto">
                            <span class="press__visto-label">Visto en</span>
                            <span class="press__visto-divider"></span>
                            <ul class="press__visto-logos">
                                ${pressLogos.map((logo) => `
                                    <li class="press__visto-logo">${logo.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </header>

                <div class="press__slider about-creator__media-slider" data-media-slider>
                    <button class="press__arrow press__arrow--prev" type="button" aria-label="Notas anteriores" data-media-prev>
                        ${getIcon('chevron-left')}
                    </button>

                    <div class="press__viewport about-creator__media-viewport">
                        <div class="press__track about-creator__media-track" data-media-track>
                            ${mediaCards.map((card) => `
                                <article class="press-card${card.type === 'destacada' ? ' press-card--featured' : ''}" data-press-type="${card.type}">
                                    <a class="press-card__link" href="${card.href}" target="_blank" rel="noreferrer">
                                        <div class="press-card__media">
                                            <span class="press-card__brand" style="--brand: ${card.outletColor}">${card.outlet}</span>
                                            <div class="press-card__thumb">
                                                ${createMediaImageMarkup(card)}
                                            </div>
                                        </div>
                                        <span class="press-card__type">
                                            <span class="press-card__type-icon">${getTypeIcon(card.type)}</span>
                                            ${card.typeLabel}
                                        </span>
                                        <span class="press-card__date">
                                            <span class="press-card__date-icon">${getIcon('press-calendar')}</span>
                                            ${card.date}
                                        </span>
                                        <div class="press-card__body">
                                            <h4 class="press-card__title">${card.title}</h4>
                                            <span class="press-card__cta">
                                                ${getCtaLabel(card.type)}
                                                <span class="press-card__cta-icon">${getIcon('arrow-right')}</span>
                                            </span>
                                        </div>
                                    </a>
                                </article>
                            `).join('')}
                        </div>
                    </div>

                    <button class="press__arrow press__arrow--next" type="button" aria-label="Siguientes notas" data-media-next>
                        ${getIcon('chevron-right')}
                    </button>
                </div>

                <div class="press__dots about-creator__media-dots" data-media-dots></div>

                <div class="press__cta-bar">
                    <div class="press__cta-block press__cta-block--quote">
                        <span class="press__cta-icon">${getIcon('press-quote')}</span>
                        <p class="press__cta-text">
                            Cada detalle importa.
                            <strong>Cada proyecto es único.</strong>
                        </p>
                    </div>
                    <div class="press__cta-divider"></div>
                    <div class="press__cta-block press__cta-block--message">
                        <span class="press__cta-icon">${getIcon('press-gift')}</span>
                        <p class="press__cta-text">
                            ¿Querés que tu historia
                            <strong>sea la próxima?</strong>
                        </p>
                    </div>
                    <a class="press__cta-button" href="#personalizados">
                        Diseñar mi maqueta
                        <span class="press__cta-button-icon">${getIcon('arrow-right')}</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    initMediaSlider(section);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                section.classList.add('is-animated');
                observer.unobserve(section);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
    observer.observe(section);

    return section;
};
