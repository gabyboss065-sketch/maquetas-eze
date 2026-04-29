export const initMediaSlider = (container) => {
    const slider = container.querySelector('[data-media-slider]');
    const viewport = container.querySelector('.about-creator__media-viewport');
    const track = container.querySelector('[data-media-track]');
    const dotsWrap = container.querySelector('[data-media-dots]');
    const prevButton = container.querySelector('[data-media-prev]');
    const nextButton = container.querySelector('[data-media-next]');

    if (!slider || !viewport || !track || !dotsWrap || !prevButton || !nextButton) return;

    const slides = Array.from(track.children);
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let touchStartX = 0;
    let touchDeltaX = 0;

    const getPerView = () => {
        if (window.innerWidth <= 720) return 1;
        if (window.innerWidth <= 1040) return 2;
        return 3;
    };

    const getMaxIndex = () => Math.max(0, slides.length - getPerView());

    const renderDots = () => {
        const totalPages = getMaxIndex() + 1;
        dotsWrap.innerHTML = Array.from({ length: totalPages }).map((_, index) => `
            <button
                class="about-creator__media-dot ${index === currentIndex ? 'is-active' : ''}"
                type="button"
                aria-label="Ir a la pagina ${index + 1} de notas"
                data-media-dot="${index}"
            ></button>
        `).join('');
    };

    const updateSlider = (nextIndex = currentIndex) => {
        const maxIndex = getMaxIndex();
        currentIndex = Math.min(Math.max(nextIndex, 0), maxIndex);
        const targetSlide = slides[currentIndex];
        if (!targetSlide) return;

        const maxTranslate = Math.max(track.scrollWidth - viewport.clientWidth, 0);
        const translateX = Math.min(targetSlide.offsetLeft, maxTranslate);
        track.style.transform = `translateX(${-translateX}px)`;

        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === maxIndex;

        renderDots();
    };

    prevButton.addEventListener('click', () => updateSlider(currentIndex - 1));
    nextButton.addEventListener('click', () => updateSlider(currentIndex + 1));

    dotsWrap.addEventListener('click', (event) => {
        const dot = event.target.closest('[data-media-dot]');
        if (!dot) return;
        updateSlider(Number(dot.dataset.mediaDot));
    });

    slider.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchDeltaX = 0;
    }, { passive: true });

    slider.addEventListener('touchmove', (event) => {
        touchDeltaX = event.changedTouches[0].clientX - touchStartX;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        const minSwipeDistance = 50;
        if (Math.abs(touchDeltaX) < minSwipeDistance) return;

        if (touchDeltaX < 0) {
            updateSlider(currentIndex + 1);
        } else {
            updateSlider(currentIndex - 1);
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        updateSlider(currentIndex);
    });

    updateSlider(0);
};
