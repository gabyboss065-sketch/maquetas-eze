export const initCatalogFilter = (section, products, renderCard) => {
    const select = section.querySelector('#price-sort');
    const grid = section.querySelector('[data-catalog-grid]');

    if (!select || !grid) return;

    const renderProducts = (sortOrder) => {
        const sortedProducts = [...products].sort((a, b) =>
            sortOrder === 'desc' ? b.precio - a.precio : a.precio - b.precio
        );

        grid.innerHTML = sortedProducts.map(renderCard).join('');
    };

    select.addEventListener('change', (event) => {
        renderProducts(event.target.value);
    });

    renderProducts(select.value);
};
