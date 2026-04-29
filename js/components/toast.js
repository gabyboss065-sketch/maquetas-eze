export const createToastController = () => {
    const root = document.createElement('div');
    root.className = 'toast-stack';
    document.body.appendChild(root);

    let currentTimeout = null;

    const show = (message) => {
        root.innerHTML = `
            <div class="toast-stack__item is-visible" role="status" aria-live="polite">
                ${message}
            </div>
        `;

        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }

        currentTimeout = window.setTimeout(() => {
            root.innerHTML = '';
        }, 1800);
    };

    return {
        show
    };
};
