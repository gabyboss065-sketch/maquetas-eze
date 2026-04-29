import { initPersonalizedSlider } from '../modules/personalizedSlider.js';
import { getDeferredImageAttrs } from '../utils/imageLoader.js';

const createVisualSlide = (product, index) => {
    const activeClass = index === 0 ? 'is-active' : '';
    const imageContent = product.imagen
        ? getDeferredImageAttrs({
            src: product.imagen,
            alt: `Maqueta personalizada de ${product.estadio}`,
            eager: index === 0,
            fetchpriority: index === 1 ? 'high' : 'low'
        })
        : `
            <div class="personalized__image-placeholder">
                <span>Agregar imagen de referencia</span>
                <strong>${product.estadio}</strong>
            </div>
        `;

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

export const createPersonalized = (products) => {
    const referenceProjects = products.filter((product) => product.referenciaPersonalizada);
    const sliderProjects = referenceProjects.length > 0
        ? referenceProjects
        : [products.find((product) => product.destacado) || products[0]];

    const section = document.createElement('section');
    section.className = 'personalized';
    section.id = 'personalizados';

    section.innerHTML = `
        <div class="personalized__shell">
            <div class="personalized__content">
                <p class="personalized__eyebrow">Personalizados</p>
                <h2>Llevamos tu estadio favorito a escala de coleccion</h2>
                <p class="personalized__lead">
                    Si queres una pieza unica, desarrollamos maquetas personalizadas con base,
                    materiales premium y terminaciones listas para exhibicion.
                </p>

                <div class="personalized__points">
                    <article class="personalized__point">
                        <strong>Diseno a medida</strong>
                        <p>Adaptamos escala, base y presentacion segun el espacio donde la vayas a exhibir.</p>
                    </article>

                    <article class="personalized__point">
                        <strong>Terminacion premium</strong>
                        <p>Trabajamos texturas, volumenes y detalles para que la maqueta tenga presencia real.</p>
                    </article>

                    <article class="personalized__point">
                        <strong>Entrega a todo el pais</strong>
                        <p>Empaquetado reforzado y seguimiento para que la pieza llegue segura y lista para regalar.</p>
                    </article>
                </div>

                <div class="personalized__actions">
                    <button class="personalized__button" type="button">Pedir maqueta personalizada</button>
                    <span class="personalized__note">Tiempo estimado de produccion: 15 a 25 dias.</span>
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

    return section;
};
