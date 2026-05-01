import { getProductDetailUrl } from '../utils/productLinks.js';

const normalizeText = (value = '') =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const buildSearchIndex = (products) => products.map((product) => ({
    product,
    club: normalizeText(product.club),
    estadio: normalizeText(product.estadio),
    combined: normalizeText(`${product.club} ${product.estadio}`)
}));

const getScore = (query, item) => {
    if (!query) return 0;

    if (item.club === query) return 120;
    if (item.estadio === query) return 115;
    if (item.combined === query) return 110;
    if (item.club.startsWith(query)) return 95;
    if (item.estadio.startsWith(query)) return 92;
    if (item.combined.startsWith(query)) return 88;
    if (item.club.includes(query)) return 78;
    if (item.estadio.includes(query)) return 74;
    if (item.combined.includes(query)) return 70;

    const queryTokens = query.split(/\s+/).filter(Boolean);
    if (!queryTokens.length) return 0;

    const matches = queryTokens.reduce((acc, token) => {
        if (item.club.includes(token) || item.estadio.includes(token) || item.combined.includes(token)) {
            return acc + 1;
        }

        return acc;
    }, 0);

    return matches > 0 ? 50 + matches : 0;
};

const getSuggestions = (productsIndex, query) => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return [];

    return productsIndex
        .map((item) => ({
            ...item,
            score: getScore(normalizedQuery, item)
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((item) => item.product);
};

export const createSearchController = (products) => {
    const searchButton = document.getElementById('search-btn');
    const searchPanel = document.getElementById('search-panel');
    const searchInput = document.getElementById('search-input');
    const searchSubmit = document.getElementById('search-submit');
    const searchSuggestions = document.getElementById('search-suggestions');
    const searchForm = document.getElementById('search-form');

    if (!searchButton || !searchPanel || !searchInput || !searchSubmit || !searchSuggestions || !searchForm) {
        return {
            bindEvents: () => {}
        };
    }

    const productsIndex = buildSearchIndex(products);

    const close = () => {
        searchPanel.classList.remove('is-open');
        searchButton.setAttribute('aria-expanded', 'false');
    };

    const open = () => {
        document.dispatchEvent(new CustomEvent('header:search-opened'));
        searchPanel.classList.add('is-open');
        searchButton.setAttribute('aria-expanded', 'true');
        searchInput.focus();
        searchInput.select();
    };

    const navigateToProduct = (product) => {
        if (!product) return;
        window.location.href = getProductDetailUrl(product.id);
    };

    const renderSuggestions = (query) => {
        const suggestions = getSuggestions(productsIndex, query);

        if (!query.trim()) {
            searchSuggestions.innerHTML = '';
            searchSuggestions.hidden = true;
            return suggestions;
        }

        if (suggestions.length === 0) {
            searchSuggestions.hidden = false;
            searchSuggestions.innerHTML = `
                <div class="search-panel__empty">
                    No encontramos una coincidencia. Prueba con el nombre del club o del estadio.
                </div>
            `;
            return suggestions;
        }

        searchSuggestions.hidden = false;
        searchSuggestions.innerHTML = suggestions.map((product, index) => `
            <button
                class="search-panel__suggestion ${index === 0 ? 'is-primary' : ''}"
                type="button"
                data-suggestion-id="${product.id}"
            >
                <span>${product.club}</span>
                <strong>${product.estadio}</strong>
            </button>
        `).join('');

        return suggestions;
    };

    const submitSearch = () => {
        const suggestions = renderSuggestions(searchInput.value);
        if (!suggestions.length) return;
        navigateToProduct(suggestions[0]);
    };

    const bindEvents = () => {
        searchButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (searchPanel.classList.contains('is-open')) {
                close();
                return;
            }

            open();
            renderSuggestions(searchInput.value);
        });

        searchInput.addEventListener('input', () => {
            renderSuggestions(searchInput.value);
        });

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                close();
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                submitSearch();
            }
        });

        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            submitSearch();
        });

        searchSubmit.addEventListener('click', (event) => {
            event.preventDefault();
            submitSearch();
        });

        searchSuggestions.addEventListener('click', (event) => {
            const suggestionButton = event.target.closest('[data-suggestion-id]');
            if (!suggestionButton) return;

            const productId = Number(suggestionButton.dataset.suggestionId);
            const selectedProduct = products.find((product) => product.id === productId);
            navigateToProduct(selectedProduct);
        });

        document.addEventListener('click', (event) => {
            if (event.target.closest('.search-shell')) return;
            close();
        });

        document.addEventListener('header:cart-opened', close);
    };

    return {
        bindEvents,
        close
    };
};
