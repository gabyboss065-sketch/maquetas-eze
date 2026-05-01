const WHATSAPP_PHONE = '5491126666219';

const getWhatsappBaseUrl = () => {
    const cleanPhone = WHATSAPP_PHONE.replace(/\D/g, '');
    return cleanPhone ? `https://wa.me/${cleanPhone}` : 'https://api.whatsapp.com/send';
};

export const buildWhatsappUrl = (message) => {
    const encodedMessage = encodeURIComponent(message);
    return `${getWhatsappBaseUrl()}?text=${encodedMessage}`;
};

const DIVIDER = '────────────────────';

const formatItem = (item) => [
    DIVIDER,
    `📦 Producto: ${item.estadio}`,
    `Cantidad: ${item.quantity}`,
    `Club: ${item.club || 'A definir'}`,
    `Escala: ${item.escala || 'A definir'}`,
    `Medida: ${item.medida || 'A definir'}`,
].join('\n');

export const buildProductInquiryMessage = (product, selection = {}) => [
    'Hola, ¿cómo estás?',
    '',
    'Quisiera consultar por la siguiente maqueta:',
    '',
    DIVIDER,
    `📦 Producto: ${product.estadio}`,
    `Cantidad: 1`,
    `Club: ${product.club || 'A definir'}`,
    `Escala: ${product.escala || 'A definir'}`,
    `Medida: ${selection.medida || 'A definir'}`,
    DIVIDER,
    '',
    'Agradecería información sobre:',
    '• Disponibilidad',
    '• Tiempo de producción',
    '• Precio final',
    '',
    'Muchas gracias.',
].join('\n');

export const buildCartInquiryMessage = (items) => [
    'Hola, ¿cómo estás?',
    '',
    'Quisiera consultar por las siguientes maquetas:',
    '',
    ...items.map(formatItem),
    DIVIDER,
    '',
    'Agradecería información sobre:',
    '• Disponibilidad',
    '• Tiempo de producción',
    '• Precio final',
    '',
    'Muchas gracias.',
].join('\n');
