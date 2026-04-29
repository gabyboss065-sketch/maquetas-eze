export const initCatalogShowMore = (
    section,
    {
        step = 4,
        itemSelector = '.product-card',
        hiddenClass = 'is-hidden',
        buttonSelector = '[data-show-more]'
    } = {}
) => {
    const showMoreButton = section.querySelector(buttonSelector);
    const hiddenCards = () =>
        Array.from(section.querySelectorAll(`${itemSelector}.${hiddenClass}`));

    if (!showMoreButton) return;

    const updateButtonVisibility = () => {
        showMoreButton.hidden = hiddenCards().length === 0;
    };

    showMoreButton.addEventListener('click', () => {
        hiddenCards()
            .slice(0, step)
            .forEach((card) => card.classList.remove(hiddenClass));

        updateButtonVisibility();
    });

    updateButtonVisibility();
};
