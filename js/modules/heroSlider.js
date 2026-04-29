// js/modules/heroSlider.js
import { getIcon } from '../utils/icons.js';
import { loadDeferredImage } from '../utils/imageLoader.js';

export const initHeroSlider = (container) => {
    const slides = container.querySelectorAll('.slide');
    const totalSlides = slides.length;
    if (totalSlides <= 1) return;

    let currentSlide = 0;
    let sliderInterval;

    const controlsHTML = `
        <div class="slider-controls">
            <button class="slider-arrow prev" aria-label="Anterior">${getIcon('chevron-left')}</button>
            <button class="slider-arrow next" aria-label="Siguiente">${getIcon('chevron-right')}</button>
        </div>
        <div class="slider-dots">
            ${Array.from({ length: totalSlides }).map((_, i) => `
                <span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
            `).join('')}
        </div>
    `;
    container.insertAdjacentHTML('beforeend', controlsHTML);

    const dots = container.querySelectorAll('.dot');
    const arrowPrev = container.querySelector('.slider-arrow.prev');
    const arrowNext = container.querySelector('.slider-arrow.next');

    const updateSlider = (index) => {
        container.querySelector('.slide.active').classList.remove('active');
        container.querySelector('.dot.active').classList.remove('active');

        currentSlide = (index + totalSlides) % totalSlides;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        loadDeferredImage(slides[currentSlide].querySelector('img[data-deferred-image]'));
        loadDeferredImage(slides[(currentSlide + 1) % totalSlides].querySelector('img[data-deferred-image]'));
    };

    const stopAutoPlay = () => clearInterval(sliderInterval);

    const startAutoPlay = () => {
        stopAutoPlay();
        sliderInterval = setInterval(() => updateSlider(currentSlide + 1), 6000);
    };

    const goToSlide = (index) => {
        updateSlider(index);
        startAutoPlay();
    };

    arrowPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    arrowNext.addEventListener('click', () => goToSlide(currentSlide + 1));

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index, 10);
            goToSlide(index);
        });
    });

    loadDeferredImage(slides[0].querySelector('img[data-deferred-image]'));
    loadDeferredImage(slides[1]?.querySelector('img[data-deferred-image]'));
    startAutoPlay();
};
