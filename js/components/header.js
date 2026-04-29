// js/components/header.js
import { getIcon } from '../utils/icons.js';

export const createHeader = () => {
    const header = document.createElement('header');
    header.className = 'main-header';
    
    header.innerHTML = `
        <div class="nav-container">
            <button id="menu-toggle" class="icon-btn mobile-only">${getIcon('menu')}</button>
            
            <div class="logo">MAQUETAS EZEQUIEL</div>
            
            <nav class="nav-menu">
                <ul>
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#todos-los-productos">Productos</a></li>
                    <li><a href="#sobre-mi">Sobre mí</a></li>
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
                                href="https://api.whatsapp.com/send?text=Hola%2C%20quiero%20consultar%20por%20una%20maqueta."
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
        navMenu.classList.toggle('is-active');
    });

    let lastScrollY = window.scrollY;
    const revealThreshold = 24;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;
        const isBeyondHeaderArea = currentScrollY > 120;

        if (isScrollingDown && isBeyondHeaderArea) {
            header.classList.add('main-header--hidden');
        } else if (!isScrollingDown || currentScrollY <= revealThreshold) {
            header.classList.remove('main-header--hidden');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    return header;
};
