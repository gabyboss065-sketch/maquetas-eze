const PLACEHOLDER_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

export const loadDeferredImage = (image) => {
    if (!image || image.dataset.loaded === 'true') return;

    const nextSrc = image.dataset.src;
    if (!nextSrc) return;

    image.src = nextSrc;
    if (image.dataset.srcset) {
        image.srcset = image.dataset.srcset;
    }

    image.dataset.loaded = 'true';
};

export const getDeferredImageAttrs = ({
    src,
    alt,
    eager = false,
    className = '',
    fetchpriority = 'low'
}) => {
    const classAttr = className ? `class="${className}"` : '';

    if (eager) {
        return `
            <img
                ${classAttr}
                src="${src}"
                alt="${alt}"
                loading="eager"
                fetchpriority="high"
                decoding="async"
            >
        `;
    }

    return `
        <img
            ${classAttr}
            src="${PLACEHOLDER_PIXEL}"
            data-src="${src}"
            data-deferred-image
            alt="${alt}"
            loading="lazy"
            fetchpriority="${fetchpriority}"
            decoding="async"
        >
    `;
};

export const observeDeferredImages = (root = document) => {
    const images = Array.from(root.querySelectorAll('img[data-deferred-image]'))
        .filter((image) => image.dataset.loaded !== 'true');

    if (!images.length) return;

    if (!('IntersectionObserver' in window)) {
        images.forEach(loadDeferredImage);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            loadDeferredImage(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: '240px 0px'
    });

    images.forEach((image) => observer.observe(image));
};
