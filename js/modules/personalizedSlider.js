import { getIcon } from '../utils/icons.js';
import { loadDeferredImage } from '../utils/imageLoader.js';

const loadSlideImage = (slide) => {
    if (!slide) return;
    loadDeferredImage(slide.querySelector('img[data-deferred-image]'));
};

export const initPersonalizedSlider = (container) => {
    const imageSlides = container.querySelectorAll('[data-personalized-image]');
    const metaSlides = container.querySelectorAll('[data-personalized-meta]');
    const cardBody = container.querySelector('.personalized__card-body');
    const totalSlides = imageSlides.length;

    if (totalSlides <= 1 || !cardBody) return;

    const controlsHTML = `
        <div class="personalized__controls">
            <button class="personalized__arrow personalized__arrow--prev" type="button" aria-label="Proyecto anterior">
                ${getIcon('chevron-left')}
            </button>
            <div class="personalized__dots">
                ${Array.from({ length: totalSlides }).map((_, index) => `
                    <button
                        class="personalized__dot ${index === 0 ? 'is-active' : ''}"
                        type="button"
                        aria-label="Ir al proyecto ${index + 1}"
                        data-index="${index}"
                    ></button>
                `).join('')}
            </div>
            <button class="personalized__arrow personalized__arrow--next" type="button" aria-label="Proyecto siguiente">
                ${getIcon('chevron-right')}
            </button>
        </div>
    `;

    cardBody.insertAdjacentHTML('beforeend', controlsHTML);

    const dots = container.querySelectorAll('.personalized__dot');
    const prevButton = container.querySelector('.personalized__arrow--prev');
    const nextButton = container.querySelector('.personalized__arrow--next');
    let currentIndex = 0;

    const updateSlider = (index) => {
        imageSlides[currentIndex].classList.remove('is-active');
        metaSlides[currentIndex].classList.remove('is-active');
        dots[currentIndex].classList.remove('is-active');

        currentIndex = (index + totalSlides) % totalSlides;

        imageSlides[currentIndex].classList.add('is-active');
        metaSlides[currentIndex].classList.add('is-active');
        dots[currentIndex].classList.add('is-active');

        loadSlideImage(imageSlides[currentIndex]);
        loadSlideImage(imageSlides[(currentIndex + 1) % totalSlides]);
    };

    prevButton.addEventListener('click', () => updateSlider(currentIndex - 1));
    nextButton.addEventListener('click', () => updateSlider(currentIndex + 1));

    dots.forEach((dot) => {
        dot.addEventListener('click', () => updateSlider(parseInt(dot.dataset.index, 10)));
    });

    loadSlideImage(imageSlides[0]);
    loadSlideImage(imageSlides[1]);
};
