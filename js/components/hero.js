// js/components/hero.js
import { initHeroSlider } from '../modules/heroSlider.js';
import { getDeferredImageAttrs } from '../utils/imageLoader.js';
import { getProductDetailUrl } from '../utils/productLinks.js';

export const createHero = (maquetas) => {
    const hero = document.createElement('section');
    hero.className = 'hero-slider';

    const featuredSlide = maquetas.find((maqueta) => maqueta.destacado);
    const remainingSlides = maquetas.filter((maqueta) => !maqueta.destacado);
    const slidesData = featuredSlide
        ? [featuredSlide, ...remainingSlides].slice(0, 5)
        : maquetas.slice(0, 5);

    hero.innerHTML = `
        <div class="slider-wrapper">
            ${slidesData.map((m, index) => `
                <div class="slide ${index === 0 ? 'active' : ''}" data-product-id="${m.id}" data-product-url="${getProductDetailUrl(m)}">
                    ${getDeferredImageAttrs({
                        src: m.imagen,
                        alt: `Maqueta del estadio ${m.estadio}`,
                        eager: index === 0,
                        className: 'slide-media',
                        fetchpriority: index === 1 ? 'high' : 'low'
                    })}
                    <div class="slide-content">
                        <h1>${m.estadio}</h1>
                        <p>${m.club} - Escala ${m.escala}</p>
                        <button class="btn-cta" data-discover-btn>Descubrir</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    initHeroSlider(hero);

    return hero;
};
