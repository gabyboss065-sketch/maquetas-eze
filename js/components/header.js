// js/components/header.js
import { getIcon } from '../utils/icons.js';

export const createHeader = () => {
    const header = document.createElement('header');
    header.className = 'main-header';
    
    header.innerHTML = `
        <div class="nav-container">
            <button id="menu-toggle" class="icon-btn mobile-only" aria-label="Abrir menú">
                <img src="assets/icons/hamburger.svg" class="menu-icon menu-icon--open" width="24" height="24" alt="">
                <img src="assets/icons/close.svg" class="menu-icon menu-icon--close" width="24" height="24" alt="">
            </button>
            
            <a class="logo" href="./inicio.html">
                <span class="logo__text">
                    <span class="logo__maquetas">MAQUETAS</span>
                    <span class="logo__ezequiel">EZEQUIEL</span>
                </span>
            </a>
            
            <nav class="nav-menu">
                <ul>
                    <li><a href="./inicio.html#inicio">Inicio</a></li>
                    <li><a href="./inicio.html#todos-los-productos">Productos</a></li>
                    <li><a href="./inicio.html#sobre-mi">Sobre mí</a></li>
                </ul>
            </nav>

            <div class="nav-actions">
                <div class="search-shell">
                    <button id="search-btn" class="icon-btn" type="button" aria-expanded="false" aria-controls="search-panel">
                        ${getIcon('search')}
                    </button>
                    <div id="search-panel" class="search-panel">
                        <form id="search-form" class="search-panel__form">
                            <input
                                id="search-input"
                                class="search-panel__input"
                                type="search"
                                placeholder="Busca por club o estadio"
                                autocomplete="off"
                            >
                            <button id="search-submit" class="search-panel__submit" type="submit" aria-label="Buscar estadio">
                                ${getIcon('search')}
                            </button>
                        </form>
                        <div id="search-suggestions" class="search-panel__suggestions" hidden></div>
                    </div>
                </div>
                <div class="cart-menu">
                    <button id="cart-btn" class="icon-btn" type="button" aria-haspopup="true" aria-expanded="false">
                        ${getIcon('cart')}
                    </button>
                    <div id="cart-dropdown" class="cart-dropdown" aria-hidden="true">
                        <div class="cart-dropdown__header">
                            <strong>Carrito de consultas</strong>
                            <span id="cart-dropdown-count">0 seleccionados</span>
                        </div>
                        <div id="cart-dropdown-items" class="cart-dropdown__items"></div>
                        <div class="cart-dropdown__footer">
                            <p id="cart-dropdown-summary">Agrega productos para consultar por WhatsApp.</p>
                            <a
                                id="cart-dropdown-cta"
                                class="cart-dropdown__cta is-disabled"
                                href="https://wa.me/5491126666219?text=Hola%2C%20quiero%20consultar%20por%20una%20maqueta."
                                target="_blank"
                                rel="noreferrer"
                                aria-disabled="true"
                                tabindex="-1"
                            >
                                Realizar consulta
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // LÃ³gica para desplegar el menÃº
    const menuToggle = header.querySelector('#menu-toggle');
    const navMenu = header.querySelector('.nav-menu');

    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-active');
        menuToggle.classList.toggle('is-active', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    const navLinks = header.querySelectorAll('.nav-menu a');
    const sectionIds = ['inicio', 'todos-los-productos', 'sobre-mi'];

    const setActiveLink = (activeId) => {
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const linkId = href?.split('#')[1];
            link.classList.toggle('is-active', linkId === activeId);
        });
    };

    const updateActiveLink = () => {
        const scrollY = window.scrollY;
        let activeId = 'inicio';
        for (const id of sectionIds) {
            const section = document.getElementById(id);
            if (section && scrollY >= section.offsetTop - 120) {
                activeId = id;
            }
        }
        setActiveLink(activeId);
    };

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            const linkId = href?.split('#')[1];
            if (linkId) setActiveLink(linkId);
            navMenu.classList.remove('is-active');
            menuToggle.classList.remove('is-active');
            menuToggle.setAttribute('aria-label', 'Abrir menú');
        });
    });

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    let lastScrollY = window.scrollY;
    const revealThreshold = 24;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;
        const isBeyondHeaderArea = currentScrollY > 120;
        const isDesktop = window.innerWidth >= 768;

        if (isDesktop && isScrollingDown && isBeyondHeaderArea) {
            header.classList.add('main-header--hidden');
        } else if (!isScrollingDown || currentScrollY <= revealThreshold || !isDesktop) {
            header.classList.remove('main-header--hidden');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scroll-to-top';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.type = 'button';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    scrollToTopBtn.innerHTML = getIcon('arrow-up');
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.add('is-visible');
        } else {
            scrollToTopBtn.classList.remove('is-visible');
        }
    }, { passive: true });

    return header;
};
