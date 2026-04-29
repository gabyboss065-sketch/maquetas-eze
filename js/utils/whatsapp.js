const WHATSAPP_PHONE = '5491100000000';

const getWhatsappBaseUrl = () => {
    const cleanPhone = WHATSAPP_PHONE.replace(/\D/g, '');
    return cleanPhone ? `https://wa.me/${cleanPhone}` : 'https://api.whatsapp.com/send';
};

export const buildWhatsappUrl = (message) => {
    const encodedMessage = encodeURIComponent(message);
    return `${getWhatsappBaseUrl()}?text=${encodedMessage}`;
};

export const buildProductInquiryMessage = (product, selection = {}) => [
    'Hola, quiero consultar por esta maqueta:',
    `Producto: ${product.estadio}`,
    `Club: ${product.club}`,
    `Escala: ${product.escala || 'A definir'}`,
    `Medida elegida: ${selection.medida || 'A definir'}`,
    `Medida personalizada: ${selection.medidaPersonalizada || 'No'}`
].join('\n');

export const buildCartInquiryMessage = (items) => {
    const lines = items.map((item, index) => [
        `${index + 1}. ${item.estadio} x${item.quantity}`,
        `   Club: ${item.club || 'A definir'}`,
        `   Escala: ${item.escala || 'A definir'}`,
        `   Medida: ${item.medida || 'A definir'}`,
        `   Personalizada: ${item.medidaPersonalizada || 'No'}`
    ].join('\n'));

    return [
        'Hola, quiero realizar una consulta por estas maquetas:',
        '',
        ...lines,
        '',
        'Quedo atento a la informacion y disponibilidad.'
    ].join('\n');
};
