export const initShowMore = (section, config = {}) => {
    const {
        batchSize = 10,
        gridSelector = '[data-products-grid]',
        itemSelector = 'article',
        hiddenClass = 'is-hidden'
    } = config;

    const grid = section.querySelector(gridSelector);
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll(itemSelector));
    if (items.length <= batchSize) return;

    const visibleItems = items.slice(0, batchSize);
    const hiddenItems = items.slice(batchSize);

    hiddenItems.forEach((item) => item.classList.add(hiddenClass));

    const showMoreContainer = document.createElement('div');
    showMoreContainer.className = 'show-more';

    const showMoreBtn = document.createElement('button');
    showMoreBtn.type = 'button';
    showMoreBtn.className = 'show-more__button';
    showMoreBtn.textContent = 'Mostrar más';

    const showAllBtn = document.createElement('button');
    showAllBtn.type = 'button';
    showAllBtn.className = 'show-more__button';
    showAllBtn.style.display = 'none';

    const showLessBtn = document.createElement('button');
    showLessBtn.type = 'button';
    showLessBtn.className = 'show-more__button';
    showLessBtn.textContent = 'Mostrar menos';
    showLessBtn.style.display = 'none';

    showMoreContainer.appendChild(showMoreBtn);
    showMoreContainer.appendChild(showAllBtn);
    showMoreContainer.appendChild(showLessBtn);

    grid.insertAdjacentElement('afterend', showMoreContainer);

    const getHiddenItems = () => grid.querySelectorAll(`.${hiddenClass}`);
    const getVisibleCount = () => items.filter((item) => !item.classList.contains(hiddenClass)).length;

    showMoreBtn.addEventListener('click', () => {
        const currentlyHidden = getHiddenItems();
        const toShow = Array.from(currentlyHidden).slice(0, batchSize);

        toShow.forEach((item) => item.classList.remove(hiddenClass));

        showMoreBtn.style.display = 'none';
        showAllBtn.textContent = 'Mostrar todos';
        showAllBtn.style.display = 'inline-flex';
    });

    showAllBtn.addEventListener('click', () => {
        items.forEach((item) => item.classList.remove(hiddenClass));

        showAllBtn.style.display = 'none';
        showLessBtn.style.display = 'inline-flex';
    });

    showLessBtn.addEventListener('click', () => {
        items.forEach((item, index) => {
            if (index >= batchSize) {
                item.classList.add(hiddenClass);
            }
        });

        showMoreBtn.style.display = 'inline-flex';
        showAllBtn.style.display = 'none';
        showLessBtn.style.display = 'none';
    });
};