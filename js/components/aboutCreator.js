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
        title: 'Vecino del GBA deslumbra con réplicas de madera de los grandes estadios argentinos',
        excerpt: 'Un perfil sobre el crecimiento del taller y el impacto que generan sus maquetas entre hinchas de distintos clubes.',
        href: 'https://www.clarin.com/zonales/vecino-gba-deslumbra-replicas-maderas-grandes-estadios-argentina_0_ekiPCdLRtm.html',
        image: 'assets/img/about/press/01.jpg',
        imageAlt: 'Imagen de la nota de Clarin'
    },
    {
        outlet: 'Infobae',
        title: 'La Bombonera y el Monumental que creó un artista callejero que se reinventó',
        excerpt: 'La nota repasa su historia antes y después de la pandemia, y cómo transformó el oficio artesanal en su trabajo principal.',
        href: 'https://www.infobae.com/sociedad/2023/05/07/la-bombonera-y-el-monumental-que-creo-un-artista-callejero-que-se-reinvento-y-hace-maquetas-de-canchas/',
        image: 'assets/img/about/press/02.webp',
        imageAlt: 'Imagen de la nota de Infobae'
    },
    {
        outlet: 'Zonales',
        title: 'Las increíbles maquetas de un vecino de Hurlingham que son furor entre los futboleros',
        excerpt: 'Una historia local sobre su reinvención durante la pandemia y el salto de las ferias al taller propio.',
        href: 'https://zonales.com/hurlingham-maquetas-estadios-furor-futboleros/',
        image: 'assets/img/about/press/03.webp',
        imageAlt: 'Imagen de la nota de Zonales'
    },
    {
        outlet: 'La Ciudad',
        title: 'La Bombonera o el Monumental: el proyecto de un vecino de Hurlingham',
        excerpt: 'Una cobertura centrada en la precisión del trabajo, la escala de las piezas y la expansión del emprendimiento.',
        href: 'https://laciudadweb.com.ar/la-bombonera-o-el-monumental-en-tamano-miniatura-el-increible-proyecto-de-un-vecino-de-hurlingham/',
        image: 'assets/img/about/press/04.webp',
        imageAlt: 'Imagen de la nota de La Ciudad'
    },
    {
        outlet: 'Optimism',
        title: 'Es artista callejero y hace maquetas de canchas',
        excerpt: 'Una versión inspiracional de su historia, enfocada en el oficio, la reinvención y la pasión por crear estadios en miniatura.',
        href: 'https://optimism.com.ar/es-artista-callejero-y-hace-maquetas-de-canchas/',
        image: 'assets/img/about/press/05.webp',
        imageAlt: 'Imagen de la nota de Optimism'
    }
];

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

            <div class="about-creator__media">
                <div class="about-creator__media-heading">
                    <h3>Prensa y medios</h3>
                    <p>Notas y entrevistas donde compartí el camino del taller.</p>
                </div>
                <div class="about-creator__media-slider" data-media-slider>
                    <button class="about-creator__media-arrow about-creator__media-arrow--prev" type="button" aria-label="Notas anteriores" data-media-prev>
                        ${getIcon('chevron-left')}
                    </button>

                    <div class="about-creator__media-viewport">
                        <div class="about-creator__media-track" data-media-track>
                    ${mediaCards.map((card) => `
                        <article class="about-creator__media-card">
                            <div class="about-creator__media-thumb">
                                ${createMediaImageMarkup(card)}
                            </div>
                            <p class="about-creator__media-outlet">${card.outlet}</p>
                            <h4>
                                <a class="about-creator__media-title" href="${card.href}" target="_blank" rel="noreferrer">
                                    ${card.title}
                                </a>
                            </h4>
                            <p>${card.excerpt}</p>
                            <a href="${card.href}" target="_blank" rel="noreferrer" class="about-creator__media-link">Ver nota</a>
                        </article>
                    `).join('')}
                        </div>
                    </div>

                    <button class="about-creator__media-arrow about-creator__media-arrow--next" type="button" aria-label="Siguientes notas" data-media-next>
                        ${getIcon('chevron-right')}
                    </button>
                </div>

                <div class="about-creator__media-dots" data-media-dots></div>
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
