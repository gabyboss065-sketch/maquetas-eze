const DEFAULT_STORAGE_KEY = 'gem_cart';

export const createCartStore = (products, options = {}) => {
    const storageKey = options.storageKey || DEFAULT_STORAGE_KEY;
    const listeners = new Set();

    const getProductById = (productId) => products.find((item) => item.id === productId);

    const read = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    };

    const write = (items) => {
        localStorage.setItem(storageKey, JSON.stringify(items));
    };

    const buildItemKey = (productId, selection = {}) => {
        const medida = selection.medida || '';
        const medidaPersonalizada = selection.medidaPersonalizada || '';
        return `${productId}::${medida}::${medidaPersonalizada}`;
    };

    const getItemQuantity = (productId) =>
        read().find((item) => item.id === productId)?.quantity ?? 0;

    const canAddProduct = (product) => Boolean(product);

    const notify = () => {
        listeners.forEach((listener) => listener());
    };

    const getCount = () => read().reduce((acc, item) => acc + item.quantity, 0);

    const addProduct = (product, selection = {}) => {
        if (!canAddProduct(product)) return false;

        const cart = read();
        const itemKey = buildItemKey(product.id, selection);
        const existingItem = cart.find((item) => item.itemKey === itemKey);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                itemKey,
                id: product.id,
                estadio: product.estadio,
                club: product.club,
                escala: product.escala,
                imagen: product.imagen,
                medida: selection.medida || 'A definir',
                medidaPersonalizada: selection.medidaPersonalizada || '',
                quantity: 1
            });
        }

        write(cart);
        notify();
        return true;
    };

    const increaseQuantity = (itemKey) => {
        const item = read().find((cartItem) => cartItem.itemKey === itemKey);
        if (!item) return false;
        const product = getProductById(item.id);
        if (!product) return false;
        return addProduct(product, {
            medida: item.medida,
            medidaPersonalizada: item.medidaPersonalizada
        });
    };

    const decreaseQuantity = (itemKey) => {
        const cart = read();
        const target = cart.find((item) => item.itemKey === itemKey);
        if (!target) return false;

        target.quantity -= 1;
        write(cart.filter((item) => item.quantity > 0));
        notify();
        return true;
    };

    const removeItem = (itemKey) => {
        write(read().filter((item) => item.itemKey !== itemKey));
        notify();
    };

    const clear = () => {
        write([]);
        notify();
    };

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return {
        getCart: read,
        getCount,
        getProductById,
        getItemQuantity,
        canAddProduct,
        addProduct,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clear,
        subscribe
    };
};
