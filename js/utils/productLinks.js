const DIACRITICS = /\p{M}/gu;

export const slugify = (str) =>
    str.toLowerCase()
       .normalize('NFD').replace(DIACRITICS, '')
       .replace(/[^a-z0-9]+/g, '-')
       .replace(/^-|-$/g, '');

export const getProductDetailUrl = (product) => `/productos/${slugify(product.estadio)}`;
