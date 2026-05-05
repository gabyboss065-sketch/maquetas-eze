// js/app.js
import { createHeader } from './components/header.js';
import { createHero } from './components/hero.js';
import { createCatalog } from './components/catalog.js';
import { createCartDropdownController } from './components/cartDropdown.js';
import { createProductModal } from './components/productModal.js';
import { createPersonalized } from './components/personalized.js';
import { createAboutCreator } from './components/aboutCreator.js';
import { createAllProductsPreview } from './components/allProductsPreview.js';
import { createClubStrip } from './components/clubStrip.js';
import { createFooter } from './components/footer.js';
import { createWhatsAppFloat } from './components/whatsappFloat.js';
import { createSearchController } from './components/searchController.js';
import { createToastController } from './components/toast.js';
import { productsService } from './services/productsService.js';
import { createCartStore } from './store/cartStore.js';
import { observeDeferredImages } from './utils/imageLoader.js';
import { slugify } from './utils/productLinks.js';

const getProductHash = (product) => `#${slugify(product.estadio)}`;
const getProductIdFromHash = () => {
    const match = window.location.hash.match(/^#producto-(\d+)$/);
    return match ? Number(match[1]) : null;
};

const updateCatalogAddButtons = (store) => {
    const addButtons = document.querySelectorAll('[data-add-button]');
    addButtons.forEach((button) => {
        const productId = Number(button.dataset.productId);
        const product = store.getProductById(productId);
        if (!product) return;

        button.disabled = !store.canAddProduct(product);
        button.setAttribute('aria-disabled', String(button.disabled));
    });
};

const init = async () => {
    const maquetas = await productsService.getAll();
    const heroSection = document.getElementById('hero-section');
    const catalogSection = document.getElementById('catalog-section');
    const footerSection = document.getElementById('footer-section');
    if (!heroSection || !catalogSection || !footerSection) return;

    heroSection.appendChild(createHeader());
    heroSection.appendChild(createHero(maquetas));
    const catalog = createCatalog(maquetas);
    const cartStore = createCartStore(maquetas);
    const cartDropdown = createCartDropdownController(cartStore);
    const searchController = createSearchController(maquetas);
    const toast = createToastController();
    const productModal = createProductModal({
        canAddProduct: (product) => cartStore.canAddProduct(product)
    });



    catalogSection.appendChild(catalog);
    catalogSection.appendChild(createAllProductsPreview(maquetas));
    catalogSection.appendChild(createPersonalized(maquetas));
    catalogSection.appendChild(createAboutCreator());
    catalogSection.appendChild(createClubStrip());
    footerSection.appendChild(createFooter());
    document.body.appendChild(createWhatsAppFloat());
    document.body.appendChild(productModal.element);
    observeDeferredImages(document);

    document.addEventListener('catalog:view-product', (event) => {
        const selectedProduct = event.detail?.product;
        if (!selectedProduct) return;
        productModal.open(selectedProduct);
        const nextHash = getProductHash(selectedProduct);
        if (window.location.hash !== nextHash) {
            history.replaceState(null, '', nextHash);
        }
    });

    document.addEventListener('catalog:add-product', (event) => {
        const selectedProduct = event.detail?.product;
        const selection = event.detail?.selection || {};
        if (!selectedProduct) return;
        const added = cartStore.addProduct(selectedProduct, selection);
        if (added) {
            const medidaLabel = selection.medida || 'medida a definir';
            toast.show(`${selectedProduct.estadio} se agrego a tu consulta (${medidaLabel}).`);
        }
    });

    cartDropdown.bindEvents(() => searchController.close());
    searchController.bindEvents(() => cartDropdown.close());

    const syncUI = () => {
        cartDropdown.render();
        updateCatalogAddButtons(cartStore);
        document.dispatchEvent(new CustomEvent('cart:updated'));
    };
    cartStore.subscribe(syncUI);
    syncUI();

    document.addEventListener('product-modal:closed', () => {
        if (getProductIdFromHash() !== null) {
            const nextUrl = `${window.location.pathname}${window.location.search}`;
            history.replaceState(null, '', nextUrl);
        }
    });

    window.addEventListener('hashchange', () => {
        const productId = getProductIdFromHash();
        if (productId === null) {
            if (productModal.element.classList.contains('is-open')) {
                productModal.close();
            }
            return;
        }

        const selectedProduct = maquetas.find(product => product.id === productId);
        if (!selectedProduct) return;
        productModal.open(selectedProduct);
    });

    const initialProductId = getProductIdFromHash();
    if (initialProductId !== null) {
        const selectedProduct = maquetas.find((product) => product.id === initialProductId);
        if (selectedProduct) {
            productModal.open(selectedProduct);
        }
    }

    const hash = window.location.hash;
    if (hash && !hash.startsWith('#producto-')) {
        requestAnimationFrame(() => {
            const target = document.querySelector(hash);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }
};

document.addEventListener('DOMContentLoaded', init);
